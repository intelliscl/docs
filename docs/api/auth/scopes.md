---
id: scopes
title: Authentication scopes
sidebar_label: Scopes
---

The term scope can be interchanged with the term role in terms of IDaP front-end products. Where a front-end product refers to a role, it is the same as an API scope.

External application providers can access most API scopes. However, some scopes are restricted due to the nature of data available, or to protect Intellischool's intellectual property. If you would like to access a restricted scope, please contact [Developer Support](mailto:help@intellischool.dev).

In order for a scope to become available for an external app to consume, the IDaP tenant must have purchased the relevant module. Scopes in the table below are grouped by the module required to use them.

---

## Scope types

A scope may be one of three types:
1. `admin` - grants access to all features and configuration options for that particular module;
2. `write` - grants access to view and make changes to all data within the scope; and
3. `read` - grants access to view data within the scope, but not make any changes.


The exceptions to these are the:
* __Albitros__ `analytics` scope, which uses a number of sub-scopes to restrict access to different components;
* `caregiver` scope, which limits access to view data related only to that caregiver's children, and make changes to that caregiver's contact and payment information; and the
* `superuser` scope, which effectively grants root permissions to an IDaP tenancy.

---

## LTI / LIS scopes

The IDaP supports __all__ of the roles specified in the Learning Tools Interoperability / Learning Information Services specifications. These roles are mapped to internal IDaP roles automatically.

LTI/LIS roles are mapped in the context of the application being launched. For example, if launching into the Scheduler app, a LTI/LIS role of `person#Administrator` would be assigned a `scheduler.admin` IDaP role.

If a tenant wishes to customise the LTI/LIS role mappings, they can do so via the Settings page in Albitros, Dextyr or Wylba, or the equivalent whitelabelled product.

LTI/LIS roles are never mapped to the `superuser` role unless overridden by a tenant.

---

## Available scopes

Module | Restricted | Scopes
------ | ---------- | ------
**Admissions** | No | `admissions.admin`, `admissions.read`, `admissions.write`
**Analytics** | Yes | `analytics.admin`, `analytics.creator`, `analytics.self`, plus others
**Attendance** | No | `attendance.admin`, `attendance.read`, `attendance.write`
**Community** | No | `community.admin`, `community.read`, `community.write`
**CRM** | No | `crm.admin`, `crm.read`, `crm.write`
**Events & Ticketing** | No | `events.admin`, `events.read`, `events.write`
**Finance Hub** | No | `finance.admin`, `finance.read`, `finance.write`
**Forms** | No | `forms.admin`, `forms.read`, `forms.write`
**Integration Hub** | No | `sync.admin`, `sync.read`, `sync.write`
**Launchpad** | No | `launchpad.admin`, `launchpad.read`, `launchpad.write`
**Medical Centre** | Yes | `medical.admin`, `medical.read`, `medical.write`
**Scheduler** | No | `scheduler.admin`, `scheduler.read`, `scheduler.write`
**Visitor Manager** | No | `visitor.admin`, `visitor.read`, `visitor.write`
**Voice** | No | `voice.admin`, `voice.read`, `voice.write`