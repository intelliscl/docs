---
id: launch
title: LTI Launch
---

This section specifies the requirements for linking to an IDaP resource using a third-party Platform as the identity provider.

:::tip

Refer to this section if you are a **software developer** seeking to launch an Intellischool product from your software - such as an LMS or school portal.

:::

---

## Claims

### Compulsory claims

Any LTI link or launch request requires, at minimum, the following claim in the token header:
* `alg` - the algorithm used to sign the token (one of “RS256”, “RS384” or “RS512”); and
* `typ` - the token type (always “jwt”).

Additionally, the following claims must always be present in the payload:
* `iss` - a unique URI for the platform that issued the token;
* `sub` - a unique identifier for the entity for whom this token has been issued (see the Subject claims section below);
* `aud` - the audience that the token has been issued to (always `https://core.intellischool.net/auth/lti`);
* `iat` - the Unix epoch timestamp at which the token was created;
* `exp` - the Unix epoch timestamp at which this token should be considered invalid (keep this to a minimum, preferably no more than 5-10 minutes);
* `name` - the display name of the user being authenticated;
* `given_name` and `family_name` - the given and family name of the user being authenticated;
* `email` - the e-mail address of the user being authenticated;
* `https://purl.imsglobal.org/lti/claim/deployment_id` - the unique `deployment_id`, which is provided as part of the LTI configuration in the IDaP;
* `https://purl.imsglobal.org/lti/claim/message_type` - the message type (always `LtiResourceLinkRequest`);
* `https://purl.imsglobal.org/lti/claim/version` - the LTI version in use (always `1.3.0`);
* `https://purl.imsglobal.org/lti/claim/resource_link` - an object containing the contextually unique ID (with relation to the `deployment_id`) of the resource being linked to; and
* `https://purl.imsglobal.org/lti/claim/target_link_uri` - the URL of the Intellischool resource being linked to.


### Optional claims

The following claims may be optionally included in a token’s payload:
* `middle_name` - the middle name(s) of the user being authenticated;
* `picture` - a URL to the avatar/picture of the user being authenticated;
* `locale` - an ISO code representing the locality settings for the user;
* `https://purl.imsglobal.org/lti/claim/roles` - an array of roles applicable to the user being authenticated (must be an in the LTI role vocab list - more information on roles);
* `https://purl.imsglobal.org/lti/claim/lis` - an object containing Learning Information Services variables (if supplied, must include the person_sourcedId value);
* `https://purl.imsglobal.org/lti/claim/role_scope_mentor` - an array of students to which this user has a mentor role (required for situations where LTI is being used to authenticate a parent or caregiver); and
* `https://purl.imsglobal.org/lti/claim/launch_presentation` - an object consisting of:
  * `document_target` - the context in which the launched resource will be presented (must be one of either `iframe`, `frame` or `window`, defaults to `iframe`); and
  * `return_url` - the URL that the user should be redirected to upon completion of their session with the launched resource (defaults to `null`).

:::caution

__Be aware:__ failing to include the `https://purl.imsglobal.org/lti/claim/roles` claim in your will force the IDaP to search for roles assigned to the user, whom will be identified using the `sub` claim of the token. If the IDaP cannot resolve the value of the sub claim to a user, and your token does not include the roles claim, your launch request will fail.
 
It is best practice to include the roles claim in your tokens.

:::


### Subject claims

The IDaP supports a number of different identifiers when matching an LTI entity with a known entity. By default, the `sub` claim can be populated with (in order of preference):

1. An __universally unique identifier__, including dashes, including (in order of speed):
  * An IDaP `user_uuid`;
  * An IDaP `entity_uuid`, `student_uuid` or `staff_uuid`; or
  * An external UUID populated in the `ext_id` field of the entity, student or staff objects;
2. An __e-mail address__, that is unique to an entity in the tenant; or
3. An __external ID__ of any type, populated in the `ext_id` field of the entity, student or staff objects.

When the sub claim is an e-mail address or external ID, the IDaP will attempt to limit the search scope of the identifier to the `student` or `staff` objects based on the `https://purl.imsglobal.org/lti/claim/roles` claim. For example, if the token includes staff role, it will limit the identifier search to the staff table. Similarly, if the token includes a student role, it will limit the identifier search to the student table.

:::warning

__When using an e-mail address or external ID__ as a `sub` claim, the value must be unique in the context of the claim. If multiple matches are found, the login request will be rejected.

:::

Depending on the tenant's LTI configuration, the IDaP may provision users on-demand based on the information provided by an authorized LTI Platform. There are three possible configurations for on-demand provisioning:
1. __Enabled__ - the IDaP will automatically provision new user accounts for entities that can be matched to the `sub` claim of the LTI token;
2. __Disabled__ - the IDaP will reject login requests if the `sub` claim cannot be matched to an existing provisioned user; or
3. __Enabled with unknown entity provisioning__ (*not recommended*) - the IDaP will automatically provision new user accounts for `sub` claims that cannot be matched to an existing user, regardless of whether or not a matching entity can be found. *Use of this setting is not recommended, and is offered for compatibility reasons only.*

---

## Signing the token

The IDaP expects LTI tokens to be signed by the platform’s private key using the `RS256` algorithm, as recommended by the [IMS Security Framework](https://www.imsglobal.org/spec/security/v1p0/#authentication-response-validation):

<blockquote>
The alg value SHOULD be the default of RS256 ... Use of algorithms other [than] RS256 will limit interoperability.
</blockquote>

However, if a Platform chooses to sign a token with the `RS384` or `RS512` algorithms the token will also be validated. Any other algorithms will result in the token being rejected.

If a *public* key was not supplied to the IDaP during configuration, the IDaP automatically generates a new key pair and returns the *private* key for configuration in the platform.

---

## LTI endpoint

LTI Launch resources are provided via an HTTPS URL. When an LTI-compliant platform presents a user with an LTI Launch resource, the IDaP expects either an id_token or JWT parameter to be provided. As per the LTI specification, only the POST method is supported.

```curl
POST https://core.intellischool.net/auth/lti
     ?id_token=your.lti-compliant.token
```

---

## Error handling

When the IDaP is acting as a LTI Tool (i.e. identity consumer), LTI tokens may be rejected for some reason. Depending on the type of LTI request, the IDaP will feed back error information in different ways.

__If your message includes a `return_url` in the launch presentation claim__, users will be redirected back to the nominated return URL with an error and code query parameter.

```
https://your-return-host.com/return-path?code=A123&error=ERROR_SHORT_REASON
```

__If your message does not include a `return_url`__, the IDaP will return an mime-type `application/json` document with the error detais, as follows:

```json
{
  "short": "ERROR_SHORT_REASON",
  "code": "A123"
}
```

The LTI standard does not mandate how a LTI Platform should handle errors from LTI Tools, however we recommend including basic error handling in your LTI deployment.

---

## Example token payloads

### IDaP as a Tool

The following payload exemplifies a valid LTI Launch token (excluding the JWT signature) that the IDaP would expect when acting as a *tool*.

```json
{
  "alg": "RS256",
  "typ": "JWT"
}
.
{
  "iss": "https://lms.school.edu",
  "sub": "4e4928b7-df3e-4501-a5d0-f2cc54b3beef", // UUID, e-mail or external ID
  "aud": "https://core.intellischool.net/auth/lti",
  "iat": 1234567890,
  "exp": 1234567890,
  "name": "Ms Jane Marie Doe",
  "given_name": "Jane",
  "family_name": "Doe",
  "middle_name": "Marie",
  "email": "jane@school.edu",
  "picture": "https://lms.school.edu/jane.jpg",
  "locale": "en-US",
  "https://purl.imsglobal.org/spec/lti/claim/deployment_id":
    "a94f9cf6-80cf-4a61-85ca-2d0d4ea63403",
  "https://purl.imsglobal.org/spec/lti/claim/message_type": 
    "LtiResourceLinkRequest",
  "https://purl.imsglobal.org/spec/lti/claim/version":
    "1.3.0",
  "https://purl.imsglobal.org/spec/lti/claim/lis": {
    "person_sourcedId": "person_id_in_external_system"
  },
  "https://purl.imsglobal.org/spec/lti/claim/roles": [
    "http://purl.imsglobal.org/vocab/lis/v2/institution/person#Student"
  ],
  "https://purl.imsglobal.org/spec/lti/claim/resource_link": {
    "id": "ec123cba-0aa2-4712-b9df-87cd75ea994d"
  },
  "https://purl.imsglobal.org/spec/lti/claim/target_link_uri":
    "https://analytics.intellischool.cloud/dashboard/123456",
  "https://purl.imsglobal.org/spec/lti/claim/launch_presentation": {
    "document_target": "iframe"
  }
}
. // JWT SIGNATURE
```

### IDaP as a Platform

When the IDaP is acting as a LTI Platform (i.e. an identity provider), it will issue LTI tokens as per the specification. Tokens include all of the [required message claims](http://www.imsglobal.org/spec/lti/v1p3/#required-message-claims), in addition to:
* `https://purl.imsglobal.org/lti/claim/context` - if specifically required in the configuration for the tool, otherwise this claim will be omitted;
* `https://purl.imsglobal.org/lti/claim/tool_platform` - if specifically required in the configuration for the tool, otherwise this claim will be omitted;
* `https://purl.imsglobal.org/lti/claim/role_scope_mentor` - included where the user is a parent/caregiver to a student in the context of the tool being launched, in which case the claim is an array of student_uuid values;
* `https://purl.imsglobal.org/lti/claim/launch_presentation` - included by default, as per the configuration for the tool; and
* `https://purl.imsglobal.org/lti/claim/lis` - included by default.

Tokens issued by the IDaP are signed using a private key and RS256 encryption. The public key will be provided upon configuring the IDaP for the Tool to which LTI tokens are to be issued.

```json title="An example token with the IDaP as a Platform"
{
  "alg": "RS256",
  "typ": "JWT"
}
.
{
  "iss": "https://launchpad.school.edu",
  "sub": "bc9fe146-6883-403e-b1d6-5b1a28c5d29d",
  "aud": "https//lti-tool.com/",
  "iat": 1234567890,
  "exp": 1234567890,
  "nonce": "f69da4b8-a013-4715-a4fe-adc45a5f7372",
  "name": "Ms Jane Marie Doe",
  "given_name": "Jane",
  "family_name": "Doe",
  "middle_name": "Marie",
  "email": "jane@school.edu",
  "picture": "https://lms.school.edu/jane.jpg",
  "locale": "en-US",
  "https://purl.imsglobal.org/spec/lti/claim/deployment_id":
    "a05e369b-7448-49f5-9a7f-e45399f6978d",
  "https://purl.imsglobal.org/spec/lti/claim/message_type": 
    "LtiResourceLinkRequest",
  "https://purl.imsglobal.org/spec/lti/claim/version":
    "1.3.0",
  "https://purl.imsglobal.org/spec/lti/claim/lis": {
    "person_sourcedId": "school.edu:e3158a0b-7f36-41c1-a5b3-6970174f7bb9"
  },
  "https://purl.imsglobal.org/spec/lti/claim/roles": [
    "http://purl.imsglobal.org/vocab/lis/v2/institution/person#Student"
  ],
  "https://purl.imsglobal.org/spec/lti/claim/resource_link": {
    "id": "376848a1-fb7c-4d9a-82a6-97f723c1935d"
  },
  "https://purl.imsglobal.org/spec/lti/claim/target_link_uri":
    "https://lti-tool.com/path/to/resource",
  "https://purl.imsglobal.org/spec/lti/claim/launch_presentation": {
    "document_target": "iframe"
  }
}
. // JWT SIGNATURE
```