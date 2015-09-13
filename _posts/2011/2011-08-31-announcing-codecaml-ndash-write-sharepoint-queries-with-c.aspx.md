---
layout: post
title: Announcing CodeCaml - write SharePoint queries with C#
description:
modified: YYYY-08-DD
tags: [SharePoint, CAML, CodeCaml]
comments: true
---
If you are a SharePoint developer, and hate having XML/HTML or any other
kind of markup/magic string then keep reading. If not, keep reading
anyway, you might change your mind ;).

One of these messy things in SharePoint are CAML queries. Since LINQ to
SharePoint is far from being reasonably usable, you can’t really avoid
them. And they make my code look ugly. So I developed a tool, which can
be used to generate CAML queries and statements with C\# code.

This is an example of how you would write a simple query using CodeCaml:

```csharp
query.Query = CQ.Where(CQ.Eq.FieldRef(fieldId).Value(value));
```

That’s the same as:

```csharp
query.Query = string.Format("<Where><Eq><FieldRef ID='{0}' /><Value Type='Text'>" + 
                            "{1}</Value></Eq></Where>", fieldId, value);
```

You can read more on syntax on [the project
wiki](https://github.com/Necroskillz/CodeCaml/wiki/CodeCaml).

Check the source code on
[github](https://github.com/Necroskillz/CodeCaml) or start using
immediately with [NuGet](http://www.nuget.org/List/Packages/CodeCaml).

Disclaimer: The tool is in BETA stage at the moment, so use in
production at your own risk. I would also appreciate any feedback.
