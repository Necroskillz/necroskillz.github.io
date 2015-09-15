---
layout: post
title: Unit testing routes in ASP.NET MVC
description:
modified: 2010-04-04
tags: [ASP.NET MVC, Unit testing]
comments: true
---
There are some resources on unit testing incoming routes. Like you have
an URL and need to know which route will it map to. For example this
[post](http://haacked.com/archive/2007/12/17/testing-routes-in-asp.net-mvc.aspx)
from Phil Haack describes how to do it, or better yet, it’s part of
MvcContrib [TestHelper
library](http://mvccontrib.codeplex.com/wikipage?title=TestHelper&referringTitle=Documentation)
– which makes it really easy to test incoming urls, you just say (for
example):

```csharp
"~/".Route().ShouldMapTo<HomeController>(c => c.Index());
```

And you have a test that says if user requests a URL like
<http://www.example.com/> it should map to Index action of your Home
controller.\
What I also needed though, was to test the URLs that are generated from
these routes. Like say URL for an action link. So I came up with this
helper method. This is using rhino mocks and T4MVC – which I encourage
you to check out, because it’s just awesome to have almost everything
strongly typed.

```csharp
public static ActionResult ShouldGenerateUrl(this ActionResult result, string expectedUrl, RouteData previousRequestRouteData)
{
    var mocks = new MockRepository();

    var request = mocks.StrictMock<HttpRequestBase>();
    request.Stub(r => r.ApplicationPath).Return("/");
    request.Stub(r => r.ServerVariables).Return(new NameValueCollection());

    var response = mocks.StrictMock<HttpResponseBase>();

    Expect.Call(response.ApplyAppPathModifier(null))
          .Constraints(Is.Equal(expectedUrl))
          .Return(expectedUrl);

    var httpContext = mocks.StrictMock<HttpContextBase>();
    httpContext.Stub(c => c.Request).Return(request);
    httpContext.Stub(c => c.Response).Return(response);

    var urlHelper = new UrlHelper(new RequestContext(httpContext, previousRequestRouteData));

    var routeValues = result.GetRouteValueDictionary();

    mocks.ReplayAll();    urlHelper.RouteUrl(routeValues);

    return result;
}
```

So what am I doing here? After some digging I found this
[post](http://stackoverflow.com/questions/674458/asp-net-mvc-unit-testing-controllers-that-use-urlhelper)
on stack overflow that told me what I need to mock to use UrlHelper
outside of `HttpContext`. I also tell rhino mocks I’m expecting a call to
`response.ApplyAppPathModifier` with parameter equal to the URL I’m
expecting, because I know that this method gets called after the URL has
been constructed, just to make it fully qualified name. I’m passing in
an action result – that’s how it’s done in T4MVC – and calling extension
method defined by T4MVC `GetRouteValueDictionary` that gets route values
for that action result. Everything is set up now, so I make rhino mocks
enter replay mode and make an attempt to generate URL base on the route
values. If it generates an URL you expected, then nothing happens and
your unit test continues. If it generates different URL, however, you
will get an error message from rhino mocks saying I expected a call with
this parameter, but instead I got a call with a different one. Because
I’m using strict mock I don’t even need to call `mocks.VerifyAll()` – the
exception is thrown immediately after the `ApplyAppPathModifier` method is
called with wrong parameter.

For convenience I created some overloads:

```csharp
public static ActionResult ShouldGenerateUrl(this ActionResult result, string expectedUrl)
{
     return ShouldGenerateUrl(result, expectedUrl, new RouteData());
}

public static ActionResult ShouldGenerateUrl(this ActionResult result, string expectedUrl, object previousRequesRouteData)
{
    var routeData = new RouteData();
    foreach(PropertyDescriptor property in TypeDescriptor.GetProperties(previousRequesRouteData))
    {
        routeData.Values.Add(property.Name, property.GetValue(previousRequesRouteData));
    }
    
    return ShouldGenerateUrl(result, expectedUrl, routeData);
}
```

So now if I want to test what URL is generated I can use something like

```csharp
MVC.Home.About().ShouldGenerateUrl("/Home/About");
```

I could also specify route values from previous request if I wanted to
verify that those don’t interfere with the URL that is generated. If you
don’t want to use T4MVC, you could create your own method that would
take an object like

```csharp
new { controller = "Home", action = "About"}
```

Finally I’d like to add that routes are sometimes the biggest nightmare
in MVC, especially if you use ajax helpers. You just keep wondering “why
the hell it’s not working?” After a while you open firebug to see the
nice 500 – Internal server error, and find out it doesn’t work because
the routes are not working. I hope that combination of this method of
verifying generated URLs and TestHelper in `MvcContrib` will lead to
avoiding at least some of these issues.
