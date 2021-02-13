---
id: basic
title: Basic authentication
sidebar_label: Basic
---

Basic authentication is supported in situations where a single tenant is solely accessing their own data. API keys issued for Basic authentication are limited to interacting with data within the tenant for which the key was generated.

:::warning Not suitable for multi-tenancy apps

Multi-tenant integrations, or developers integrating with multiple schools, must *not* use Basic authentication. Instead, register for a Developer account and use another authentication method.

:::

---

## Token generation example

To generate a Basic token:
```javascript
const credentials = "<api_key>:<api_secret>";
const token = new Buffer(credentials).toString('base64');

const authentication = `Basic ${token}`;
```