---
layout: post
title: A take on generic RssResult for MVC
description:
modified: YYYY-05-DD
tags: [ASP.NET MVC, RSS, NecroNetToolkit]
comments: true
---
When I first needed to support RSS in a MVC web application, it was
around the time of MIX 2010. There was a [talk by Scott
Hanselman](http://channel9.msdn.com/events/MIX/MIX10/FT07), where he
explained how to create RSS feed by using a class derived from
FileResult. I used it a few times since, but had to always copy+paste it
into my new project, and rewrite it to fit my model. So naturally I
thought if there was a way to generalize it, and make it reusable across
applications. Lately I got into a habit of using Func&lt;&gt; delegates
a lot. This is what I came up with:

```csharp
public class RssResult<T> : FileResult
{
    public IEnumerable<T> Items { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }

    public Func<T, string> GetItemTitle { get; set; }
    public Func<T, UrlHelper, string> GetItemUrl { get; set; }
    public Func<T, UrlHelper, string> GetItemContent { get; set; }
    public Func<T, UrlHelper, string> GetItemSummary { get; set; }
    public Func<T, DateTime> GetItemPusblished { get; set; }
    public Func<T, DateTime> GetItemUpdated { get; set; }

    private RequestContext _requestContext;

    protected RssResult() : base("application/rss+xml") { }

    public RssResult(IEnumerable<T> items, string title, string description, Func<T, string> getItemTitle,
                            Func<T, UrlHelper, string> getItemUrl, Func<T, UrlHelper, string> getItemContent,
                            Func<T, DateTime> getItemPublished, Func<T, UrlHelper, string> getItemSummary = null,
                            Func<T, DateTime> getItemUpdated = null)
        : this()
    {
        Items = items;
        Title = title;
        Description = description;

        GetItemTitle = getItemTitle;
        GetItemUrl = getItemUrl;
        GetItemContent = getItemContent;
        GetItemPusblished = getItemPublished;
        GetItemSummary = getItemSummary ?? getItemContent;
        GetItemUpdated = getItemUpdated ?? getItemPublished;
    }

    public override void ExecuteResult(ControllerContext context)
    {
        _requestContext = context.RequestContext;
        base.ExecuteResult(context);
    }

    protected override void WriteFile(HttpResponseBase response)
    {
        var url = new UrlHelper(_requestContext);
        var items = from item in Items
                    select new SyndicationItem(title: GetItemTitle(item),
                                               content: GetItemContent(item, url),
                                               itemAlternateLink: new Uri(GetItemUrl(item, url)),
                                               id: GetItemUrl(item, url),
                                               lastUpdatedTime: GetItemUpdated(item))
                    {
                        PublishDate = GetItemPusblished(item),
                        Summary = new TextSyndicationContent(GetItemSummary(item, url), TextSyndicationContentKind.XHtml)
                    };


        var feed = new SyndicationFeed(
            Title,
            Description,
            _requestContext.HttpContext.Request.Url,
            items);

        var formatter = new Rss20FeedFormatter(feed);

        using (var writer = XmlWriter.Create(response.Output))
        {
            formatter.WriteTo(writer);
        }
    }
}
```

Most of this is pretty straight-forward – we have a collection of
models, feed title and description, and some delegates to dig
information needed for each feed item from a model item. I also pass in
an instance of UrlHelper for url, content and summary, because I often
generate urls in these fields. Once you have this set up, you can easily
create multiple RSS feeds in multiple web applications using this class
directly or deriving from it.

Direct approach:

```csharp
public ActionResult Rss()
{
    var people = _personRepository.GetList();
    return new RssResult<Person>(people, "People list", "A list of people",
                                    p => string.Format("{0} {1}", p.Name, p.Surname),
                                    (p, u) => u.Action("Details", "People", new {id = p.Id}, "http"),
                                    (p, u) => string.Format("This is a description of {0} {1}", p.Name, p.Surname),
                                    p => p.DateCreated);
}
```

This is a little messy, but gets the job done. A neater solution is to
derive from RssResult&lt;T&gt;. You are back to a class per feed
scenario, but it’s a lot simpler.

```csharp
public class PeopleRssResult : RssResult<Person>
{
    public PeopleRssResult(IEnumerable<Person> people, string title, string description)
    {
        Items = people;
        Title = title;
        Description = description;

        GetItemContent = GetItemSummary = (p, u) => string.Format("This is a description of {0} {1}", p.Name, p.Surname);
        GetItemTitle = p => string.Format("{0} {1}", p.Name, p.Surname);
        GetItemUrl = (p, u) => u.Action("Details", "People", new { id = p.Id }, "http");
        GetItemPusblished = GetItemUpdated = p => p.DateCreated;
    }
}
```

```csharp
public ActionResult Rss()
{
    var people = _personRepository.GetList();
    return new PeopleRssResult(people, "People list", "A list of people");
}
```

Another possible refactoring is to extend your controller base class
with methods that return your RssResult, and then just say something
like return Rss(people); but that has been mentioned about a thousand
times already on various blogs, so I’m not going to repeat that.

This class only supports simple feeds, but can serve as a baseline if
you need to add some custom stuff as well. Also it should be fairly
simple to unit test, since you can just test a bunch of Func&lt;&gt;
delegates a check their return value. I will be including this in the
next version of
[NecroNetToolkit](https://github.com/Necroskillz/NecroNetToolkit) which
you can now get as a [NuGet
package](http://www.nuget.org/List/Packages/NecroNetToolkit).
