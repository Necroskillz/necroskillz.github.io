---
layout: post
title: Unit testing code that uses HttpContext.Current.Session
title_font_size: 3.575rem
description:
modified: 2010-07-28
tags: [Unit testing, NecroNetToolkit]
comments: true
---
In process of writing unit test for NecroNetToolkit (yes, I know I
should have written tests first) I needed to test a proxy class that
stores and retrieves values from `HttpContext.Current.Session`. It’s kind
of pain, because you can’t mock `HttpContext` or the session state object.
You could in MVC, where controllers have `HttpContextBase`, but you can’t
do it with `HttpContext.Current`. I already had code for instantiating
`HttpContext`, so I decided to try and ‘Inject’ the session into it.

I used reflector to find out, that the Session property actually returns
`HttpContext.Items["AspSession"]`. So I created
`ttpSessionStateContainer`, which is only parameter to `HttpSessionState`
object. Only problem is that `HttpSessionBase` has internal constructors,
so a little reflection magic is needed to instantiate it. And it worked!
Now I can use `HttpContext.Current.Session` (at least to some extent) in
unit tests. Here’s the code:

```csharp
var httpRequest = new HttpRequest("", "http://mySomething/", "");
var stringWriter = new StringWriter();
var httpResponce = new HttpResponse(stringWriter);
var httpContext = new HttpContext(httpRequest, httpResponce);

var sessionContainer = new HttpSessionStateContainer("id", new SessionStateItemCollection(),
                                                     new HttpStaticObjectsCollection(), 10, true,
                                                     HttpCookieMode.AutoDetect,
                                                     SessionStateMode.InProc, false);

httpContext.Items["AspSession"] = typeof (HttpSessionState).GetConstructor(
                                         BindingFlags.NonPublic | BindingFlags.Instance,
                                         null, CallingConventions.Standard,
                                         new[] {typeof (HttpSessionStateContainer)},
                                         null)
                                    .Invoke(new object[]{ sessionContainer});

HttpContext.Current = httpContext;
```
