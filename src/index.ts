import { Duration } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as letsencrypt from 'cdk-lets-encrypt';
import { Construct } from 'constructs';

export interface EdgeDBCustomDomainProps {
  /**
   * The Route53 Hosted Zone ID that is authoritative for the Custom Domain name to be used as the EdgeDB endpoint.
   */
  readonly hostedZoneId: string;

  /**
   * The Route53 Hosted Zone Name that is authoritative for the Custom Domain name to be used as the EdgeDB endpoint.
   */
  readonly zoneName: string;

  /**
   * The FQDN of the Custom Domain name to be used for the EdgeDB endpoint.
   */
  readonly name: string;

  /**
   * An email address to use for the Lets Encrypt certificate registration.
   */
  readonly email: string;
}

export interface EdgeDBProps {

  /**
   * When true, EdgeDB server and Aurora PostgreSQL will deployed with two Tasks/Nodes in separate availability-zones.
   *
   * * @default - true
   */
  readonly highAvailability?: boolean;

  /**
   * Properties for using a Custom Domain name to be used as the EdgeDB endpoint, an authoritative zone for the domain must already exist in Route53.
   *
   * * @default - Not used.
   */
  readonly customDomain?: EdgeDBCustomDomainProps;

}

export class EdgeDB extends Construct {

  /**
   * FQDN of the Network Load Balancer used as part of the EdgeDB deployment, you can connect to query EdgeDB from this endpoint.
   */
  readonly endpoint: string;

  /**
   * Secrets Manager secret containing the automatically generated EdgeDB server credentials.
   *
   */
  readonly secret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props: EdgeDBProps = {}) {
    super(scope, id);

    props = {
      highAvailability: props!.highAvailability || true,
      ...props,
    };

    //
    // Deployment logic/configuration
    //

    const vpc = new ec2.Vpc(this, 'vpc', {
      natGateways: 0,
      maxAzs: 2,
    });

    // It seems it might be possible that the DatabaseCluster construct auto-generated password actually contains characters that interfere in EdgeDB's backend DSN string.
    // So we'll generate the Postgres password ourselves with Secrets Manager.
    const auroraPasswordSecret = new secretsmanager.Secret(this, 'AuroraPassword', {
      generateSecretString: {
        excludePunctuation: true,
        secretStringTemplate: JSON.stringify({
          username: 'postgres',
          password: '',
        }),
        generateStringKey: 'password',
      },
    });
    const auroraDatabaseCluster = new rds.DatabaseCluster(this, 'AuroraDatabase', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_13_4 }), // https://github.com/edgedb/edgedb-deploy/blob/2dd48d538b1d785efcf89bc5b1cd83d835c8ad2e/aws-cf/edgedb-aurora.yml#L387
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
        vpc,
      },
      instances: !props.highAvailability ? 1 : 2,
      defaultDatabaseName: 'postgres',
      credentials: rds.Credentials.fromSecret(auroraPasswordSecret),
    });
    const auroraDatabaseClusterDSN = new secretsmanager.Secret(this, 'AuroraDatabaseClusterDSN', {
      secretStringBeta1: secretsmanager.SecretStringValueBeta1.fromUnsafePlaintext(`postgres://${auroraDatabaseCluster.secret?.secretValueFromJson('username')}:${auroraDatabaseCluster.secret?.secretValueFromJson('password')}@${auroraDatabaseCluster.clusterEndpoint.hostname}:${auroraDatabaseCluster.secret?.secretValueFromJson('port')}/${auroraDatabaseCluster.secret?.secretValueFromJson('dbname')}`),
    });

    const endpointCertificate: letsencrypt.LetsEncryptCertificate|undefined = props.customDomain ? new letsencrypt.LetsEncryptCertificate(this, 'EndpointCertificate', {
      domain: props.customDomain.name,
      email: props.customDomain.email,
      zone: props.customDomain.hostedZoneId,
    }) : undefined;

    // Some of the values are informed from here: https://github.com/edgedb/edgedb-deploy/blob/2dd48d538b1d785efcf89bc5b1cd83d835c8ad2e/aws-cf/edgedb-aurora.yml#L497
    const edgeDBServerPasswordSecret = new secretsmanager.Secret(this, 'EdgeDBServerPassword', {
      generateSecretString: {
        excludePunctuation: true,
      },
    }); // Let Secrets Manager generate the password for us.
    const edgeDBFargateService = new ecsPatterns.NetworkLoadBalancedFargateService(this, 'EdgeDBFargate', {
      vpc,
      memoryLimitMiB: 2048,
      cpu: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('edgedb/edgedb'), // Use latest, if worried about breaking changes, it's possible to update this to pin versions.
        containerPort: 5656,
        environment: {
          EDGEDB_SERVER_TLS_CERT_MODE: props.customDomain ? 'require_file' : 'generate_self_signed',
        },
        secrets: props.customDomain ? {
          EDGEDB_SERVER_PASSWORD: ecs.Secret.fromSecretsManager(edgeDBServerPasswordSecret),
          EDGEDB_SERVER_BACKEND_DSN: ecs.Secret.fromSecretsManager(auroraDatabaseClusterDSN),
          EDGEDB_SERVER_TLS_KEY: ecs.Secret.fromSecretsManager(endpointCertificate!.secret, 'keyPem'),
          EDGEDB_SERVER_TLS_CERT: ecs.Secret.fromSecretsManager(endpointCertificate!.secret, 'certPem'),
        } :
          {
            EDGEDB_SERVER_PASSWORD: ecs.Secret.fromSecretsManager(edgeDBServerPasswordSecret),
            EDGEDB_SERVER_BACKEND_DSN: ecs.Secret.fromSecretsManager(auroraDatabaseClusterDSN),
          },
      },
      desiredCount: !props.highAvailability ? 1 : 2,
      publicLoadBalancer: true,
      healthCheckGracePeriod: Duration.minutes(2),
      minHealthyPercent: 100,
      maxHealthyPercent: 200,
      listenerPort: 5656,
      assignPublicIp: true,
    });
    auroraDatabaseCluster.connections.allowDefaultPortFrom(edgeDBFargateService.service); // Allow communication to the Aurora PostgreSQL backend from EdgeDB Fargate tasks
    edgeDBFargateService.service.connections.allowFromAnyIpv4(ec2.Port.tcp(5656)); // Allow communication from the Network Load Balancer to the EdgeDB Fargate tasks

    // Informed from here: https://github.com/edgedb/edgedb-deploy/blob/2dd48d538b1d785efcf89bc5b1cd83d835c8ad2e/aws-cf/edgedb-aurora.yml#L556
    edgeDBFargateService.targetGroup.configureHealthCheck({
      path: '/server/status/ready',
      interval: Duration.seconds(10),
      unhealthyThresholdCount: 2,
      healthyThresholdCount: 2,
      protocol: elbv2.Protocol.HTTPS,
    });
    edgeDBFargateService.targetGroup.setAttribute('deregistration_delay.timeout_seconds', '10');

    props.customDomain ? new route53.CnameRecord(this, 'nlb-custom-dns', {
      domainName: edgeDBFargateService.loadBalancer.loadBalancerDnsName,
      recordName: props.customDomain.name,
      zone: route53.HostedZone.fromHostedZoneAttributes(this, 'hosted-zone', {
        zoneName: props.customDomain.zoneName,
        hostedZoneId: props.customDomain.hostedZoneId,
      }),
      ttl: Duration.minutes(1),
    }) : null;


    //
    // Properties made available
    //

    edgeDBFargateService.node.tryRemoveChild('LoadBalancerDNS'); // The NetworkLoadBalancedFargateService construct automatically creates a redundant CfnOutput.
    this.endpoint = props.customDomain ? props.customDomain.name : edgeDBFargateService.loadBalancer.loadBalancerDnsName;
    this.secret = new secretsmanager.Secret(this, 'EdgeDBServerSecret', {
      secretStringBeta1: secretsmanager.SecretStringValueBeta1.fromUnsafePlaintext(JSON.stringify({
        host: this.endpoint,
        port: 5656,
        username: 'edgedb',
        password: edgeDBServerPasswordSecret.secretValue,
        dbname: 'edgedb',
        dsn: `edgedb://edgedb:${edgeDBServerPasswordSecret.secretValue}@${this.endpoint}:5656/edgedb`,
      })),
    });

  }
}