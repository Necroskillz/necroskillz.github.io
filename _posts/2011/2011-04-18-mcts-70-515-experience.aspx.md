---
layout: post
title: MCTS 70-515 experience
description:
modified: YYYY-04-DD
tags: [MCP, ASP.NET]
comments: true
---
I recently got myself a free TS: .NET 4 web applications certification;
and since before I did, I didn’t find too much information about what to
expect from the exam, what to do before and after, and what to look
into, I thought I would share my experiences.

First let me explain how I got it for free. If you are a student, you
can get one free Microsoft exam from
[dreamspark](https://www.dreamspark.com/Products/Product.aspx?ProductId=24&wa=wsignin1.0&lc=1033).
It’s a fairly complicated process, but there’s a step-by-step tutorial
on the site to walk you through it. I was a student until after a week
ago, dunno if someone actually checks to see if you really are a student
as long as you have valid ISIC card. You can choose from a ton of exams
with 72 prefix (these are for students and are cheaper, there is no
actual difference in their content). I went with the
[70-515](http://www.microsoft.com/learning/en/us/exam.aspx?ID=70-515)
TS: Web Applications Development with Microsoft .NET Framework 4, since
that is what I’ve been doing for past two years. You can choose which
testing center you want to use (should be several if you live in
moderately big city) and also choose the time and date. I chose a date
so I had more than a week to prepare for the exam.

So I was signed up, and went online to look for some materials to get
ready. One thing I noticed is there are some sites that sell some
materials and example test for about \$100. I just laughed at that,
because as an individual, I’m not about to spend \$100 to prepare for
\$40 exam (if it wasn’t for free). I also tried some free demos of
‘example exam’ software. Most of them were somewhat sketchy, although
some questions were in fact similar to the ones on the exam. Not too
helpful though.

Other than that, the only content I found were [CBT
nuggets](http://www.cbtnuggets.com/series/630) (snatched from
[torrent](http://thepiratebay.org/torrent/6016710/CBT_Nuggets_Microsoft_70-515_.NET_4_MCTS_Web_Applications_Develo)
of course, otherwise it’s kind of expensive) and [self-paced training
kit](http://www.amazon.com/MCTS-Self-Paced-Training-Exam-70-515/dp/0735627401)
that costs \$40 (I managed to get it from a torrent, but didn’t read it
anyway – way too much text). The CBT nuggets videos are worth watching I
guess, they only deal with basics, but it’s a nice overview of what to
expect. As I said, there was not much to go on. My only preparation was
the CBT nuggets and some sketchy looking practice exam software.

Fortunately the exam was easy enough for someone who *regularly* works
with ASP.NET or MVC (or both) that I have been able to pass it. Here’s
how is the exam structured: first you answer a few irrelevant questions,
and click about a hundred times through various terms and licenses and
whatnot before you get to answer the actual questions. Then there are
**51** questions that *matter*. ** All of these are either multiple or
single choice (no drag&drop and similar nonsense), and if it’s multiple
choice you know how many choices are correct. I personally like these
kinds of tests, since you can usually tell the correct answer by
comparing the choices with each other, looking for something that’s
wrong with them.

With that, let me tell you what kinds of questions you can expect:

1.  Typical usage of controls such as validators, custom user/web
    controls, data bound controls – pretty easy stuff
2.  Cache – how to set output cache in and cache dependency in page
    directive/web.config (VaryByParam, data caching)
3.  When is it correct to do certain things (Init, Load, PreRender etc.)
4.  Localization – remember to always set Current**UI**Culture, and know
    how to user resources in aspx code
5.  Master pages – access master page property from page, set master
    page type on page
6.  JavaScript – some jquery code to parse xml, selectors, AJAX, DOM
    manipulation; jquery and standard js – there really was quite a few
    JavaScript questions, JSON
7.  WCF services – this caught me by surprise – know how to call WCF
    services from JavaScript, how to setup service host etc.
8.  Web deploy
9.  Little LINQ
10. Some administration stuff, some was really simple, and some I didn’t
    know at all so I guessed
11. MVC 2 – That’s what I work with the most, so that was easiest for me
    – setup routes, know folder structure, how to add actions and views,
    areas, html helpers

That’s what I remember anyway. I don’t claim that it is everything there
is or could be, but should give you some idea. If you work with ASP.NET
and MVC on daily basis, you should have no trouble passing this exam.

I got 790/1000 points if you’re interested. And this is what I have to
show for it:

[![mcts]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/c4efe37aa574_1ABE/mcts_thumb.png "mcts")]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/c4efe37aa574_1ABE/mcts_2.png)
