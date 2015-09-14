---
layout: post
title: Animated transitions between pages in WPF/Silverlight without any code
description:
modified: 2010-04-29
tags: [Expression Blend, WPF, Silverlight]
comments: true
---
First of all, let me just start by saying this: if you are doing
WPF/Silverlight and are not using Expression Blend, go to [this
page](http://www.microsoft.com/downloads/details.aspx?FamilyID=88484825-1b3c-4e8c-8b14-b05d025e1541&displaylang=en)
and download it right away – you won’t regret it. I don’t know how I
would be able to create UI without it, especially when it comes to
animations and templates. Today I want to show you how easy it is to
create animated transitions when you navigate between pages in Frame
control. And, as title suggest, you won’t have to write a single line of
code to do it.\
Let’s start by inserting a frame and creating a new storyboard called
FadeOut.

[![insert frame
demonstration]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/1_thumb.jpg "insert frame demonstration")]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/1_2.jpg)

Storyboard recording will start right away. Now move to the 0.5 seconds
of the storyboard (the yellow marker) and set the opacity of the frame
to 0. This means that this storyboard will make the frame change its
opacity from 100% to 0 in 0.5 seconds.

[![fade out storyboard
demonstration]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/2_thumb.jpg "fade out storyboard demonstration")]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/2_2.jpg)

Let’s also add an easing function to make it fade away quicker.

[![easing function
demonstration]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/1_1_thumb_1.jpg "easing function demonstration")]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/1_1_4.jpg)

Next, create another storyboard. I called this one FadeIn. I set the
opacity to 0 and transform X axis by -40 at the beginning of the
storyboard. Then at 0.5 I transform X axis back to 0 and at 1 second I
set opacity to 100%. This will create an effect that will slide the
frame in and fade in at the same time. Feel free to customize the
animations as you want.

[![fade in story board
demonstration]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/7_thumb.jpg "fade in story board demonstration")]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/7_2.jpg)

Set easing on both opacity and transform to make it look nice.

[![easing function
demonstration]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/2_2_thumb_1.jpg "easing function demonstration")]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/2_2_4.jpg)

We’re done creating storyboards, now it’s time to wire them up. Go to
Assets tab, select behaviors and drag & drop two ControlStoryboardAction
behaviors onto the frame.

[![ControlStoryboardAction behavior
demonstration]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/3_thumb.jpg "ControlStoryboardAction behavior demonstration")]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/3_2.jpg)

 

[![adding ControlStoryboardActions
demonstration]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/4_thumb.jpg "adding ControlStoryboardActions demonstration")]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/4_2.jpg)

Set the first to react to event Navigating and play storyboard FadeOut
and the second to react to event Navigated and play storyboard FadeIn.

[![setting behavior proporties
demonstration]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/6_thumb.jpg "setting behavior proporties demonstration")]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/6_2.jpg)

 

[![setting behavior proporties
demonstration]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/5_thumb.jpg "setting behavior proporties demonstration")]({{site.url}}/images/www_necronet_org/Windows-Live-Writer/Animated-transitions-between-pages-in-WP_107D1/5_2.jpg)

And you’re done! If you’re not using blend, I hope I convinced you to
give it a try. It’s one of a few (if not the only one) designer tools I
actually enjoy using.
