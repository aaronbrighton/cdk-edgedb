# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### EdgeDb <a name="EdgeDb" id="cdk-edgedb.EdgeDb"></a>

#### Initializers <a name="Initializers" id="cdk-edgedb.EdgeDb.Initializer"></a>

```typescript
import { EdgeDb } from 'cdk-edgedb'

new EdgeDb(scope: Construct, id: string, props?: EdgeDBProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-edgedb.EdgeDb.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-edgedb.EdgeDb.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-edgedb.EdgeDb.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-edgedb.EdgeDBProps">EdgeDBProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-edgedb.EdgeDb.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-edgedb.EdgeDb.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="cdk-edgedb.EdgeDb.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-edgedb.EdgeDBProps">EdgeDBProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-edgedb.EdgeDb.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cdk-edgedb.EdgeDb.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-edgedb.EdgeDb.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-edgedb.EdgeDb.isConstruct"></a>

```typescript
import { EdgeDb } from 'cdk-edgedb'

EdgeDb.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-edgedb.EdgeDb.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-edgedb.EdgeDb.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-edgedb.EdgeDb.property.endpoint">endpoint</a></code> | <code>string</code> | FQDN of the Network Load Balancer used as part of the EdgeDB deployment, you can connect to query EdgeDB from this endpoint. |
| <code><a href="#cdk-edgedb.EdgeDb.property.secret">secret</a></code> | <code>aws-cdk-lib.aws_secretsmanager.Secret</code> | Secrets Manager secret containing the automatically generated EdgeDB server credentials. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-edgedb.EdgeDb.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `endpoint`<sup>Required</sup> <a name="endpoint" id="cdk-edgedb.EdgeDb.property.endpoint"></a>

```typescript
public readonly endpoint: string;
```

- *Type:* string

FQDN of the Network Load Balancer used as part of the EdgeDB deployment, you can connect to query EdgeDB from this endpoint.

---

##### `secret`<sup>Required</sup> <a name="secret" id="cdk-edgedb.EdgeDb.property.secret"></a>

```typescript
public readonly secret: Secret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.Secret

Secrets Manager secret containing the automatically generated EdgeDB server credentials.

---


## Structs <a name="Structs" id="Structs"></a>

### EdgeDBCustomDomainProps <a name="EdgeDBCustomDomainProps" id="cdk-edgedb.EdgeDBCustomDomainProps"></a>

#### Initializer <a name="Initializer" id="cdk-edgedb.EdgeDBCustomDomainProps.Initializer"></a>

```typescript
import { EdgeDBCustomDomainProps } from 'cdk-edgedb'

const edgeDBCustomDomainProps: EdgeDBCustomDomainProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-edgedb.EdgeDBCustomDomainProps.property.email">email</a></code> | <code>string</code> | An email address to use for the Lets Encrypt certificate registration. |
| <code><a href="#cdk-edgedb.EdgeDBCustomDomainProps.property.hostedZoneId">hostedZoneId</a></code> | <code>string</code> | The Route53 Hosted Zone ID that is authoritative for the Custom Domain name to be used as the EdgeDB endpoint. |
| <code><a href="#cdk-edgedb.EdgeDBCustomDomainProps.property.name">name</a></code> | <code>string</code> | The FQDN of the Custom Domain name to be used for the EdgeDB endpoint. |
| <code><a href="#cdk-edgedb.EdgeDBCustomDomainProps.property.zoneName">zoneName</a></code> | <code>string</code> | The Route53 Hosted Zone Name that is authoritative for the Custom Domain name to be used as the EdgeDB endpoint. |

---

##### `email`<sup>Required</sup> <a name="email" id="cdk-edgedb.EdgeDBCustomDomainProps.property.email"></a>

```typescript
public readonly email: string;
```

- *Type:* string

An email address to use for the Lets Encrypt certificate registration.

---

##### `hostedZoneId`<sup>Required</sup> <a name="hostedZoneId" id="cdk-edgedb.EdgeDBCustomDomainProps.property.hostedZoneId"></a>

```typescript
public readonly hostedZoneId: string;
```

- *Type:* string

The Route53 Hosted Zone ID that is authoritative for the Custom Domain name to be used as the EdgeDB endpoint.

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-edgedb.EdgeDBCustomDomainProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The FQDN of the Custom Domain name to be used for the EdgeDB endpoint.

---

##### `zoneName`<sup>Required</sup> <a name="zoneName" id="cdk-edgedb.EdgeDBCustomDomainProps.property.zoneName"></a>

```typescript
public readonly zoneName: string;
```

- *Type:* string

The Route53 Hosted Zone Name that is authoritative for the Custom Domain name to be used as the EdgeDB endpoint.

---

### EdgeDBProps <a name="EdgeDBProps" id="cdk-edgedb.EdgeDBProps"></a>

#### Initializer <a name="Initializer" id="cdk-edgedb.EdgeDBProps.Initializer"></a>

```typescript
import { EdgeDBProps } from 'cdk-edgedb'

const edgeDBProps: EdgeDBProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-edgedb.EdgeDBProps.property.customDomain">customDomain</a></code> | <code><a href="#cdk-edgedb.EdgeDBCustomDomainProps">EdgeDBCustomDomainProps</a></code> | Properties for using a Custom Domain name to be used as the EdgeDB endpoint, an authoritative zone for the domain must already exist in Route53. |
| <code><a href="#cdk-edgedb.EdgeDBProps.property.highAvailability">highAvailability</a></code> | <code>boolean</code> | When true, EdgeDB server and Aurora PostgreSQL will deployed with two Tasks/Nodes in separate availability-zones. |

---

##### `customDomain`<sup>Optional</sup> <a name="customDomain" id="cdk-edgedb.EdgeDBProps.property.customDomain"></a>

```typescript
public readonly customDomain: EdgeDBCustomDomainProps;
```

- *Type:* <a href="#cdk-edgedb.EdgeDBCustomDomainProps">EdgeDBCustomDomainProps</a>

Properties for using a Custom Domain name to be used as the EdgeDB endpoint, an authoritative zone for the domain must already exist in Route53.

* @default - Not used.

---

##### `highAvailability`<sup>Optional</sup> <a name="highAvailability" id="cdk-edgedb.EdgeDBProps.property.highAvailability"></a>

```typescript
public readonly highAvailability: boolean;
```

- *Type:* boolean

When true, EdgeDB server and Aurora PostgreSQL will deployed with two Tasks/Nodes in separate availability-zones.

* @default - true

---



