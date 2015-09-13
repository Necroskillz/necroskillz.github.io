---
layout: post
title: Using application page as script service in SharePoint 2010
description:
modified: YYYY-07-DD
tags: [SharePoint 2010]
comments: true
---
This is sort of a follow-up to my [last
post](http://www.necronet.org/archive/2011/07/25/enable-or-disable-ribbon-custom-action-based-on-user-permissions.aspx).
There are few ways to call server methods from javascript other than the
one I used. You could also use web services, page methods, http handlers
and maybe something else. For something as simple as I was trying to
achieve, I didn’t want to go through the bother of setting that up.

Here’s why: web service, either “good” old .asmx or WCF, both require
some setting up. Check how to create WCF service
[here](http://dotnetbyexample.blogspot.com/2008/02/calling-wcf-service-from-javascript.html)…
that’s a lot of steps not to mention you also have to care about how to
deploy it to SharePoint.
[Here](http://www.thesharepointblog.net/Lists/Posts/Post.aspx?List=815f255a-d0ef-4258-be2a-28487dc9975c&ID=67)
is an example of setting .asmx up – and you have to take additional
steps if you want to easily call it from javascript.

I couldn’t get page methods to work (EnablePageMethods=”false” in
v4.master doesn’t help with the matter), and http handler requires a
change to web config. After some considerations, I decided against all
of those things, since they are just too complicated for one simple web
method, and could be unreliable (we all know SharePoint likes to deploy
things wrong all the time).

So I wanted something simple, something I could relate to from MVC,
where you can use action method as a web method directly and where are
built in methods to return html, string or json. My last post contains
my first try at something like that. Since then I refactored it a bit,
and moved the core functionality to a base class.

```csharp
public abstract class ScriptServicePageBase : LayoutsPageBase
{
    private const string MethodParameter = "method";

    protected void Page_Load(object sender, EventArgs e)
    {
        var methodName = Request.Params[MethodParameter];

        var method = GetType().GetMethod(methodName);
        var parameters = method.GetParameters().Select(pn => Request.Params[pn.Name]).ToArray();
        var result = method.Invoke(this, parameters);

        Response.Clear();
        Response.Write(result);
        Response.End();
    }
}
```

This is just a simple example without any checks, and parameters has to
be strings. That could be fixed and extended with some kind of model
binder implementation. Just bear with me for now.

Here is a sample script service (code-behind):

```csharp
public partial class _service : ScriptServicePageBase
{
    public string GetTime(string format)
    {
        return DateTime.Now.ToString(format);
    }
}
```

And how you call it from javascript with jQuery:

```js
$.post('_layouts/YourProject/_service.aspx', { method: 'GetTime', format: 'dd.MM.yyyy' }, function (data) {
    $('#text').text(data);
});
```

This is really simple to setup and use, compared to the other options.
So I ask, is it really worth it going to all the trouble just to check
some permissions or get data for a drop down list? Is there a better
solution for this problem in SharePoint? If there is, let me know in
comments, otherwise I’m just going to extend this solution, maybe add a
method for json conversion and a model binder for parameters, and be
happy with that.
