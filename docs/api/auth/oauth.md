---
id: oauth2
title: OAuth 2.0
sidebar_label: OAuth 2.0
---

If you're developing an integration that will be used by more than one IDaP tenant, you can use OAuth 2.0 to gain access to an app.

To get started, you will need to register your application through [intellischool.dev](https://intellischool.dev). At the end of this process, you will receive a `client_id` and `client_secret`.

If you're developing a web app or a back-end web server app, you should select the __Auth Code__ grant type. If you're developing a native app (such as a desktop or mobile app), you should choose the __Auth Code with PKCE__ grant type.

At the successful completion of an OAuth flow you will be granted an access token to connect to an IDaP tenancy. If the authorizing user has access to more than one IDaP `tenant`, they will be prompted to select which tenant your application should be granted access to.

Once the user has completed the OAuth flow you can then use the granted token to interact with the appropriate API endpoint.

---


## 1. Authorize your app

Your app should initiate the OAuth flow by directing users to the consent endpoint. The table denotes the parameters that should be supplied, noting that the `code_challenge` and `code_challenge_method` fields are applicable to an *Auth Code with PKCE* flow only:

| Parameter               | Description |
| ----------------------- | ----------- |
| `response_type`         | This value should always be `code` |
| `client_id`             | The `client_id` issued when you created your app |
| `scope`                 | Permissions to request (see below) |
| `redirect_uri`          | The URL on your server to redirect back to |
| `state`                 | *Optional:* A unique string to be passed back on completion (see below) |
| `code_challenge`        | *PKCE only:* The code challenge your app has generated (see below) |
| `code_challenge_method` | *PKCE only:* This value should always be `S256` |

Your app should direct users to the following URL:
```
GET https://core.intellischool.net/connect/authorize
    ?response_type=code
    &client_id=YOURCLIENTID
    &redirect_uri=YOURREDIRECTURI
    &scope=openid community.read
    &state=123
```


### OAuth scopes

A `scope` in the context of IDaP authorization maps directly back to IDaP roles. A complete list of roles is available in the Scopes section of this documentation. For example, the `finance.read` role equates to the `finance.read` OAuth scope.

Additionally, your app may request the following scopes:
* `offline_access` - grants your app access to IDaP data if a user is not present;
* `openid` - to act on the user's behalf when interacting with the IDaP;
* `profile` - to gain access to the authorizing user's profile information; and
* `email` - to gain access to the authorizing user's email address.


### Redirect URIs

All redirect URIs must start with the `https` scheme, with the exception of `localhost`.

:::caution PKCE flow limitation

Custom URL schemes are not support for PKCE flows. Mobile clients should use [Claimed HTTPS Scheme URI Redirection](https://ldapwiki.com/wiki/Claimed%20Https%20Scheme%20URI%20Redirection) to register HTTPS redirect URIs. This is supported on both [Android](https://developer.android.com/training/app-links/verify-site-associations) and [iOS](https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html).

:::


### State

The `state` parameter, aside from being used to convey state information back to your app, should also be used to avoid forgery attacks. Pass in a value that is unique to the authorization flow for your app. It will be passed back after the user completes authorization.


### Code challenge (PKCE only)

Before starting the authorization flow, your app must generate a code verifier. This is a random string between 43 and 128 characters long, that consists of the characters A-Z, a-z, 0-9 and the punctuation -._~ (hypen, period, underscore, and tilde).

The *code challenge* is created by performing a SHA256 hash on the code verifier, and then Base64 URL encoding the hash.

---

## 2. Receive your code

If the user authorizes your app, the IDaP will redirect them back to your specified `redirect_uri` with the following query parameters:

| Parameter | Description |
| --------- | ----------- |
| `code`    | A temporary code that may only be exchanged once, and expires 5 minutes after issuance. |
| `state`   | If you provided a value, the IDaP will return this value to you in the `state` parameter. It is best practice to check that the parameter value matches what your application sent - if it does not, your request may have been subject to an attack by a third party and you should abort the flow. |

If any errors occur or the user denies the request, the IDaP will redirect the user back to your `redirect_uri` with an `error` parameter describing the problem.

---

## 3. Exchange the code

You can now exchange the verification code for an __access token__. You will also receive an __identity token__ if you've requested the `openid`, `profile` or `email` scopes, and a __refresh token__ if you've requested the `offline_access` scope.

The exchange URL is:

```
POST https://core.intellischool.net/connect/token
```

The request requires an authorization header containing your app's API key and secret:

```
Authorization: Basic + base64encode(client_id + ':' + client_secret)
```

You will need to provide the following parameters in the body of your `POST` request:

| Parameter       | Description |
| --------------- | ----------- |
| `grant_type`    | Always `authorization_code` |
| `code`          | The authorization code you received from the consent endpoint |
| `redirect_uri`  | The same redirect URI you provided to the consent endpoint |
| `client_id`     | *PKCE only:* the client ID of your app |
| `code_verifier` | *PKCE only:* the code verifier that you created during the authorization step |


Consider this example code that performs a code exchange:

```javascript title="oauth/codeExchange.js"
const fetch = require('node-fetch');
const credentials = "<client_id>:<client_secret>";
const token = new Buffer(credentials).toString('base64');

let response = await fetch('https://core.intellischool.net/connect/token',{
  method: 'post',
  headers: { Authorization: `Basic ${token}`},
  body: 'grant_type=authorization_code&code=CODE&redirect_uri=URI'
})
.then(res => res.json())
```

---

## 4. Receive your tokens

The connect endpoint will verify all the parameters in the request, ensuring the code hasn't expired and that the client ID and secret match. If everything passes verification, it will generate your tokens and return them in the response.

The response will contain the following parameters:

| Parameter       | Description |
| --------------- | ----------- |
| `access_token`  | The token you should use to call the IDaP API |
| `id_token`      | The token containing user identity details (if an OpenID scope was requested) |
| `expires_in`    | he amount of seconds until your `access_token` expires |
| `token_type`    | Always `Bearer` |
| `refresh_token` | The token you can use to refresh the `access_token` once it has expired (if your app requested the `offline_access` scope) |

An example access token:

```json
{
  "nbf": 1589543023,
  "exp": 1589544823,
  "iss": "https://core.intellischool.net/auth",
  "aud": "YOUR_CLIENT_ID",
  "sub": "YOUR_CLIENT_ID",
  "intellischool_tenant": "TENANT_ID",
  "intellischool_region": "vic.intellischool.com.au",
  "jti": "026609f2-4a23-4eae-a3a3-206452ddc4e2",
  "authentication_event_id": "001dc026-5d86-4869-98a6-624bef340a35",
  "scope": [
    "openid",
    "profile",
    "offline_access",
    "community.read"
  ]
}
```

---

## 5. Get the API endpoint

The IDaP is a multi-tenant platform, with data stored in various *regions* around the world. Because the data that the IDaP is storing is often quite sensitive, the jurisdictions in which our tenants operate regularly mandate that data must be stored at rest within that jurisdiction's borders.

To ensure that our tenants' data remains within their jurisdiction as much as is possible, there is a different API endpoint for each region.

To get the API endpoint for the tenant, extract the `intellischool_tenant` and `intellischool_region` claims from the returned `access_token`. Then apply the following:

```
https://api.(region)/v1/graphql
```

For example, if the tenant's region is `vic.intellischool.com.au`, the API endpoint would be:

```
https://api.vic.intellischool.com.au/v1/graphql
```

---

## 6. Interacting with the API

You now have everything you need to interact with the API. It is your responsibility to ensure that the issued tokens are kept safe.

More information on interacting with the API can be found in the GraphQL section of these docs.

---

## 7. Refreshing access tokens

Access tokens expire after 30 minutes. If your app requested the `offline_access` scope, you will need to refresh your access token once it has expired to continue interacting with the IDaP API.

To refresh your access token, you will need to `POST` your `refresh_token` to the token endpoint: 

```
POST https://core.intellischool.net/connect/token
```

The request has the same authorization requirements as step 4, being a `Basic` token containing your Base-64 encoded client ID and client secret.

In the request body, include the following parameters:

| Parameter       | Description |
| --------------- | ----------- |
| `grant_type`    | Always `refresh_token` when refreshing an existing token |
| `refresh_token` | The refresh token provided during the previous token grant |

Each time you perform a token refresh, you should save the new refresh token returned in the response. If, for some reason, your app doesn't receive the response, you can retry your existing token for a grace period of 30 minutes.

Consider this example code that refreshes an existing access token:

```javascript title="oauth/refreshToken.js"
const fetch = require('node-fetch');
const credentials = "<client_id>:<client_secret>";
const token = new Buffer(credentials).toString('base64');

let response = await fetch('https://core.intellischool.net/connect/token',{
  method: 'post',
  headers: { Authorization: `Basic ${token}`},
  body: 'grant_type=refresh_token&refresh_token=REFRESHTOKEN'
})
.then(res => res.json())
```

---

## 8. Revoking tokens

You can revoke a refresh token and remove all associations with your app by making a request to the revocation endpoint.

As with all interactions between your app and the connect endpoints, you will need to include your client ID and client secret as a Basic token in the Authorization header.

To revoke a token, `POST` to the revocation endpoint: 

```
POST https://core.intellischool.net/connect/revocation
```

You must include your most recent `refresh_token` in the body of the POST request, as the `token` parameter.

A successful revocation request will return a `HTTP 200 OK` response with an empty body.

Consider this example code that revokes an existing token:

```javascript title="oauth/revokeToken.js"
const fetch = require('node-fetch');
const credentials = "<client_id>:<client_secret>";
const token = new Buffer(credentials).toString('base64');

let response = await fetch('https://core.intellischool.net/connect/revocation',{
  method: 'post',
  headers: { Authorization: `Basic ${token}`},
  body: 'token=REFRESHTOKEN'
})
.then(res => res.json())
```