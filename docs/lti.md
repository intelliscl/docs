---
id: lti
title: Learning Tools Interoperability
sidebar_label: Introduction
---

## Overview

The Intellischool Data Platform (IDaP) and (by extension) the products built on top of the platform - including Albitros, Dextyr, and Wylba - are Learning Tools Interoperability (LTI) v.1.3.0 compliant.

An authorised LTI-compatible *Platform* can link to and launch into IDaP tools, effectively providing Single Sign-On. Likewise, the IDaP can launch LTI-compatible *Tools* through some products.

:::important

This documentation assumes you are familiar with the [Learning Tools Interoperability specification](https://www.imsglobal.org/spec/lti/v1p3/), specifically version 1.3.0.

:::

---

## Platforms and tools

As the components of the IDaP vary significantly in their purpose, their respective [software service types](http://www.imsglobal.org/spec/lti/v1p3/#platforms-and-tools) in terms of the [LTI specification](https://www.imsglobal.org/spec/lti/v1p3/) vary. In some cases a component may be able to be used as both a Platform or Tool.

For clarity, all Intellischool products (with the exception of Launchpad) are considered a *tool* for the purposes of LTI. Launchpad is considered a *platform*.

---

## Messages and services

The IDaP supports two types of LTI integration methods:
* __Messages__, intermediated by a user's web browser; and
* __Services__, being direct connections between a platform and a tool via an API.

An example of an LTI *message* in terms of the IDaP is an LTI Launch link. This facilitates single sign-on for a resource that is part of a tool when a user clicks on the link in a supported platform.

An example of an LTI *service* is a notification from the IDaP's Analytics component to a third party platform. This happens between two servers and does not involve a user's browser.

---

## Deployments

The LTI specification explains in detail the concept of tool deployments, including support for multiple deployments of the same tool within a platform.

This is particularly useful where a platform is a Learning Management System (LMS) or similar where a tool might be deployed in different ways for different groups of users.

:::important
 
Because the IDaP designed for adoption by an entire institution rather than just a department or team, __multiple deployments within an institution are not required__ nor supported.

:::

### Platform deployments

Where the IDaP is acting as a LTI platform (or identity provider), the IDaP requires at least two pieces of information, being the:
* `key_id` supplied by the tool to be integrated; and the
* `deployment_id`.

Optionally, the following can also be provided:
* A `public_key` and `private_key` (if not supplied the IDaP will generate a key pair); and the
* type of tool being integrated, if LTI Advantage features are to be supported.

Where the type of tool being integrated is not supplied, the IDaP will limit the LTI integration to messages only. Services are supported only for known tool integrations.

### Tool deployments

Deployment of an LTI integration with an IDaP component requires at least two pieces of information, being the:
1. URI namespace of the platform (e.g. https://lms.school.edu); and the
2. Type of platform.

Optionally a `public_key` supplied by the platform can also be provided. If not provided, the IDaP will generate a key pair to use for the integration.

The URI namespace of the platform must start with `https`. As per the LTI specification: *LTI v1.3 requires the use of HTTPS (using TLS) for both messages and services. Additionally, implementers MUST use HTTPS for all URLs to resources included in messages and services (for example, URLs to service endpoints, or to static content like images and thumbnails)*.

Once supplied, the IDaP will return a `deployment_id` value. If a `public_key` was not supplied, the IDaP will generate and return a new private_key for the Platform to use when signing tokens.