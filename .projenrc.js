const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Aaron Brighton',
  authorAddress: 'https://aaronbrighton.ca/',
  cdkVersion: '2.12.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-edgedb',
  repositoryUrl: 'https://github.com/aaronbrighton/cdk-edgedb.git',
  keywords: [
    'aws-cdk',
  ],
  releaseToNpm: true,
  publishDryRun: true,

  deps: [
    'cdk-lets-encrypt',
  ],
  description: 'Using Aurora PostgreSQL and Fargate provision a highly-available EdgeDB database deployment that is accessible from the internet.',
});
project.synth();