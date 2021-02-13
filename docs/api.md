---
id: api
title: IDaP API
sidebar_label: Introduction
---

Welcome to the Intellischool Data Platform (IDaP) API docs. You can use the IDaP API to interact with data stored on the IDaP, and (depending on the tenant) write back changes from the cloud to on-premises applications and databases.

This documentation currently includes examples in JavaScript only, but we'll be adding more examples shortly. As the IDaP API is GraphQL-based, the actual execution of tasks is similar across all programming languages.

---

## About the IDaP

The Intellischool Data Platform (IDaP) is a distributed, scalable data platform, capable of providing both transactional and warehouse data storage. Also incorporated into the IDaP are a number of back-end functions aligned with Intellischool's front-end products.

Albitros and Dextyr are front-end products that run on top of the IDaP, providing a graphical interface over the exact same API documented herein. With minimal exceptions, if you can achieve something in Dextyr, you can also achieve it via the IDaP API.

:::info Restricted scopes

Some API functionality used by Albitros is restricted in order to protect Intellischool's intellectual property. These functions relate primarily to visualising data, and do not restrict a third party's ability to query, extract or insert data via the API.

:::

---

## Accessing the API

In order to access the IDaP API, you must either have:

* a licensed IDaP tenancy, through one of Intellischool's products (Albitros, Dextyr or Wylba), or a whitelabelled solution; or
* an approved [intellischool.dev](https://intellischool.dev) Developer Hub account.

Any IDaP tenant is automatically licensed to use the IDaP API. Likewise, third-party integrators that wish to use the IDaP API are also able to do so at no cost.

You may obtain an API key by either:
* generating a new key through the Settings page of Albitros, Dextyr or Wylba (your API key will be limited to a the tenant for which is was generated); or
* registering a new application through [intellischool.dev](https://intellischool.dev).