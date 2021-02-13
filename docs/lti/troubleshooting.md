---
id: troubleshooting
title: Troubleshooting LTI
sidebar_label: Troubleshooting
---

## LTI Launch error codes

The IDaP provides error codes that help you track down why an identity token isn’t being processed as expected. 

### A480

An HTTP verb other than `POST` was used to make the request, OR the body of the `POST` request was empty.

### A481A

The token was not correctly passed to the authentication endpoint in the body of a POST request. Ensure that the token is present in either the `id_token` or `JWT` fields, and that the form is submitted with a MIME type of either `application/x-www-form-urlencoded` OR `application/json`.

### A481B

The IDaP could not interpret the contents of the JWT provided. Ensure that the JWT meets the format requirements. Consider using an open source library to build your tokens if you are not already doing so.

### A481C

The provided token was missing one or more required claims. Ensure that all LTI fields are prefixed with https://purl.imsglobal.org/spec/lti/claim/. Refer to the Compulsory claims section above.

### A482

The token has been issued with a `deployment_id` that is unknown to the IDaP. Ensure that LTI is appropriately configured in the IDaP tenancy.

### A483

The token failed validation. Ensure that it was signed with the correct private key, the algorithm is valid (either `RS256`, `RS384` or `RS512`) and that the required claims match their expected values as defined in the Compulsory claims section of this document.

### A484

The user could not be found, and the tenant's LTI settings prevent new users from being provisioned on-demand. Check your `sub` claim and make sure it can be resolved to a unique identifier.

### A485A

There was an error while retrieving the user details by UUID. Check the error message for a resolution hint.

### A485B

There was an error while retrieving the user details by e-mail address. Check the error message for a resolution hint.

### A488

The tenant is not licensed to use the application being launched into.