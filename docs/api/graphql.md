---
id: graphql
title: GraphQL
sidebar_label: GraphQL
---

The primary IDaP API is a GraphQL API. If you're new to GraphQL (GQL), there is a [great introduction here](https://graphql.org/learn/).

Intellischool chose to use GraphQL for the primary API due to its highly flexible nature. It's an adaptive standard, which facilitates our philosophy of continual improvement without causing a headache for our integrators when we add new fields or types to the API.

In order to connect to any GraphQL API, it's best practice to use a GQL library. These libraries have numerous features built-in that will make integrating your application simpler.

We use the [Apollo Client](https://www.apollographql.com/apollo-client) internally, and recommend that our integrators do so as well. It's compatible with any JavaScript environment (including Node.js, React, Angular and others), and also has native clients for iOS and Android.

If you're not developing in JavaScript or for iOS/Android, there's an [official list of GraphQL clients](https://graphql.org/code/#graphql-clients) that you can refer to. Any of them should work with the IDaP API.

---

## 1. Configure your GQL client

Most GQL clients require that you configure the connection to the GQL API separately and prior to making any calls to the API itself.

When configuring your client, there are five headers that should be included in each of your requests.

Header | Basic value | OAuth value
------ | ----------- | -----------
`Authorization` | Base-64 encoded API key and secret | Access token granted earlier
`x-intellischool-tenant` | Tenant ID provided | `tenant` claim retrieved from access token
`x-intellischool-app-id` | API key | Application's client ID
`x-intellischool-role` | Required role | Required scope
`x-intellischool-user-id` | Not required | User ID if acting on behalf of user

The `x-intellischool-user-id` header can be omitted if you are using `Basic` authentication, or if your application is not acting on behalf of a specific user.

:::tip

If you are unsure which role/scope is required for your API interactions, use the [API explorer](https://intellischool.dev/explorer) to see which roles are required for different queries and mutations.

:::


Consider this example to create a new server-side GraphQL client using Node:

```javascript
/* This example assumes you are using Node.js
   For client-side implementations, refer to the Apollo docs */
const { ApolloClient  } = require('apollo-client');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { createHttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');

const link = createHttpLink({
  `https://api.${region}/v1/graphql`,
  fetch,
  headers: {
    'Authorization': 'Bearer YOURTOKEN'
    'x-intellischool-tenant': 'YOURTENANTID',
    'x-intellischool-app-id': 'YOURCLIENTID',
    'x-intelliscchool-user-id': 'USERID'
  }
})

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})
```

---


## 2. Query the API

Once you have your client configured, you can query the API. The example here shows a simple GQL `query` that retrieves current the tenant's current students.

```javascript
const gql = require('graphql-tag');

await client.query({
  query: gql`
    query get_students($status: enum_StudentStatus_enum!) {
      students(where: {
        status: {_eq: $status}
      }) {
        stu_uuid
        current_year_level
        entity {
          entity_uuid
          given_name
          family_name
        }
      }
    }
  `,
  variables: {
    status: "current"
  }
})
.then(result => console.log(result))
```

The query also retrieves the associated `entity` record for the `student` record. The `entity` record contains the student's personal information, such as name, date of birth, and residential details, whereas the `student` record contains their current enrolment details, such as year level, entry date, and exit date.

The IDaP API is **large**; far too large to fully document here. The best way to learn how to interact with it is by using the [API explorer](https://intellischool.dev/explorer). The explorer provides contextual help in the *Documentation Explorer* pane, explaining the purpose of each component.

---

## 3. Mutate some data

A GraphQL *mutation* is effectively an `INSERT`, `DELETE` or `UPDATE` statement on the underlying IDaP. Depending on the roles/scopes that your application has access to, you *may* be able to perform mutations to update data.

```javascript
const gql = require('graphql-tag');

await client.mutate({
  mutation: gql`
    mutation mark_student_as_leaving(
      $exit_date: Date!, 
      $stu_uuid: uuid!
    ) {
      update_students(
        where: {
          stu_uuid: {_eq: $stu_uuid} },
        _set: {
          exit_date: $exit_date }
      ) {
        affected_rows
      }
    }
  `,
  variables: {
    "exit_date": "2020-08-30T05:30:00+09:30",
    "stu_uuid": "dbeb67f5-b83f-44e0-ad47-7b55d0af3e7b"
  }
})
.then(result => console.log(result))
```

As with queries, the best way to learn about how to mutate data via the API is by using the [API explorer](https://intellischool.dev/explorer).