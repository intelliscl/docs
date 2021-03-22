---
id: enhanced-embedding
title: Enhanced Embedding
---

In some situations, Intellischool products enable advanced embedding features. These are particularly useful for developers looking to embed a whitelabelled Intellischool product into another interface.

Enhancements are largely driven through JavaScript `postMessage` events between the parent application, and the Intellischool product embedded in either an `iframe` or a child window.

:::tip

Refer to this section if you are a **software developer** seeking to embed a compatible Intellischool product into your software.

:::

---

## Compatibility

### Albitros

Albitros supports enhanced functionality for all embedded dashboards and whitelabelled consoles.

### Dextyr

Dextyr supports enhanced functionality for:

* Contact update forms
* Electronic forms
* Parent-teacher interview/conference bookings
* Payments


---

## Using `postMessage` events

To take advantage of Intellischool's enhanced embedding capabilities, you will need to configure appropriate JavaScript functions within your application. This usually consists of two functions:

1. A **listener** that listens for events and emits an action accordingly; and
2. A **dispatcher** that send events back to the embedded Intellischool product.

### Listener example

This example listens for events from an Albitros embedded component, ensuring that the event is genuinely from Albitros and triggers a function in response to the event.

```javascript
window.addEventListener("message", event => {

  // Check that the event is from a trusted source
  if (![
      "https://analytics.intellischool.cloud",
      "https://analytics.intellischool.xyz"
    ].includes(event.origin)
  )
    return;
  
  // Act on the event
  if (event.data && event.data.intellischool && typeof(event.data.intellischool) === "object")
  {

    switch (event.data.intellischool.action)
    {

      case "navigate":
        let { url, path } = event.data.intellischool;
        // Do something with the url and/or path received
        return;

      default:
        // Unknown event, do nothing
        return;

    }
  }
}, false);
```


### Dispatcher example

This example dispatches `navigate` events to an embedded Intellischool product, telling it to navigate to the given destination.

```javascript
const embedded_iframe = document.getElementById('embedded-iframe-id');

const onButtonClicked = () => 
  dispatchIntellischoolEvent('navigate',{ path: '/new/path' });

function dispatchIntellischoolEvent( action, data = {} )
{

  embedded_iframe.postMessage({
    intellischool: {
      action,
      ...data
    }
  }, window.location.url);

}
```

---

## Object definitions

### Launch

Represents a launch event - for example, a user launching into a dashboard in Albitros. When configured, the `launch` event takes precedence over a `navigate` event.

:::note
This object is only available for partners with a whitelabel agreement, and is emitted by embedded consoles only - for example, a whitelabelled Albitros console within another product.
:::

The launch event is only ever _emitted from_ an embedded Intellischool product. Launch events dispatched to an embedded product will be ignored.

```json title="Launch event object"
{
  "intellischool": {
    "action": "launch",
    "url": "https://hostname.net/pathname",
    "path": "/pathname",
    "title": "My dashboard",
    "authenticated": true
  }
}
```

The `url` and `path` values can be used to determine where your application should be directing the user to launch the dashboard.

The `title` value provides a meaningful name for the resource being launched in to. It can be used for naming modals or windows, or providing other context to your users.

The `authenticated` value defines whether or not the user has already been authenticated at the destination `url` through a browser session, cookie or other authentication mechanism. When `true`, your application should not attempt to alter or attach a token to the given `url`.

If the `authenticated` value is `false`, your application should launch the given `url` using LTI Launch.



### Navigation

Represents a navigational event - a user changing routes within an embedded application.

These events are **bi-directional**:
* Events _emitted from_ an embedded Intellischool product can be used to track a user's location within an `iframe` element (or other window). This can be particularly useful if integrating Intellischool routes with your own product's routing system in single-page apps.
* Events _dispatched to_ an embedded Intellischool product inform the product to navigate to the given URL or path.

```json title="Navigation event object"
{
  "intellischool": {
    "action": "navigate",
    "url": "https://hostname.net/pathname",
    "path": "/pathname"
  }
}
```

Events _emitted from_ an embedded Intellischool product will _always_ contain both `url` and `path` values.

Events _dispatched to_ an embedded Intellischool product _may_ container either or both of the `url` and `path` values.