---
layout: post
title: The time to upgrade your PC is now
description:
modified: YYYY-08-DD
tags: [Hardware, PC Construction]
comments: true
---
The SSD drive technology, processors with 4 cores with hyperthreading
(now becoming 6 core), DDR 3 memory sticks, powerful graphic cards. If
you’ve been waiting to upgrade you PC for a few years, there’s now time
like today to start thinking about it. For a developer, having powerful
machine is essential for him to be more efficient, faster, more
effective, less stressed…. and the list goes on. Take a simple example –
when I opened a project in Visual Studio 2010 on my old PC, I could go
get something to drink, and when I came back it still wouldn’t be loaded
(ok maybe I’m exaggerating a bit, but it took some 15 to 30 seconds for
a *small* project). With my new PC I will be describing later on, the
same project takes about 5 seconds to load.

I was displeased with my old PC for a while, so I decided (with a little
kick from this [post from Scott
Hanselman](http://www.hanselman.com/blog/UltimateDeveloperPC20Part3UPDATEOnBuildingAWEI79AndRFCForBuildingAGOMGodsOwnMachine.aspx))
to build a new one. I would like to walk you through what I bought and
did to make the new PC happen, and how it turned out. First, let’s start
with a summary of what I had:

[![start]({{site.url}}/images/www_necronet_org/WindowsLiveWriter/ThetimetoupgradeyouPCisnow_18CE/start_thumb.png "start")]({{site.url}}/images/www_necronet_org/WindowsLiveWriter/ThetimetoupgradeyouPCisnow_18CE/start_2.png)

I had a pretty good graphic card, that’s because the one I had burned
out about a half a year ago so I had to buy a new one. I also had a
decent power supply (guess what, it also burned out). But the rest of
the system was no good. Although 3 years ago, when I bought it, I wasn’t
bad – I always buy stuff that is just a bit under the high end, that was
true then, and also when I bought my new graphic card. The processor
scored lowest (who the hell uses only 2 core processors nowadays?), 4GB
(actually my system used only 3 for some reason) DDR2 memory also no
good, and a slow disk to top it off.

Before I started the search for parts, I established a few goals for
what I want inside my new PC:

-   4 core processor (1366 socket, so I can change to 6 cores)
-   12 gigs of ram
-   SSD HDD for system files, 3,5" HDD for data

With that in mind, using before mentioned post from Scott Hanselman as
an inspiration, I begun my search.

### The processor

By simply applying some facts about processors, I was able to easily
narrow it down to a few models. I always liked Intel better, 4 cores,
1366 socket, find a price range that’s comfortable and I’m done.
Applying this left me with two models: [core
i7-930](http://www.newegg.com/Product/Product.aspx?Item=N82E16819115225&cm_re=core_i7-930-_-19-115-225-_-Product)
and an older 920 model that apparently isn’t manufactured anymore.

Price estimate: 6000 CZK (\~\$300)

### The motherboard

Now that I had my processor picked out, I had to find a suitable
motherboard that supports LGA 1366 socket, and also has USB 3 and other
latest techs. I liked the one [Scott
suggested](http://www.newegg.com/Product/Product.aspx?Item=N82E16813128446&cm_re=gigabyte_x58a-_-13-128-446-_-Product),
either
[UD5](http://www.newegg.com/Product/Product.aspx?Item=N82E16813128422&cm_re=gigabyte_x58a-_-13-128-422-_-Product)
or
[UD7](http://www.newegg.com/Product/Product.aspx?Item=N82E16813128413&cm_re=gigabyte_x58a-_-13-128-413-_-Product)
models.

Price estimate: 5800 CZK  (\~\$300) for UD5, 6700 CZK  (\~\$350) for UD7

### RAM

I really, really like [the ones Scott
got](http://www.newegg.com/Product/Product.aspx?Item=N82E16820227538&cm_re=ocz_reaper_ddr3_1333-_-20-227-538-_-Product),
but unfortunately I wasn’t able to get these on a short notice. So
instead I got some Kingston with the same parameters (3x4 GB, 1333 MHz,
CL9).

Price estimate: 10000 CZK (\~\$525) – these are expensive as hell in our
country :(

### HDD

SSD is really the highlight of the whole upgrade. It runs fast, which is
good for Visual Studio (I hear it spends most of it’s time on disk I/O
operations) and it quiet. Like really quiet, it doesn’t make any noise
at all. Well of course, it’s basically a big flash memory, but not
hearing the constant rustling noise of standard hard drive is a bliss. I
felt comfortable with the [160 GB one that Intel
makes](http://www.newegg.com/Product/Product.aspx?Item=N82E16820167024&cm_re=x25-m-_-20-167-024-_-Product).
For random data (like movies, TV shows, etc. I’ll keep my 300 GB
standard SATA drive).

Price estimate: 9400 CZK  (\~\$500)

### 

### GPU

My [GTX
285](http://www.newegg.com/Product/Product.aspx?Item=N82E16814125280&cm_re=gtx_285-_-14-125-280-_-Product)
that I already have.

Price estimate: 0

So if I sum this up, I end up with about 32000 CZK (\~\$1700). That’s
not counting the value added tax. I was able to buy this through my
mothers company for 28000 CZK (\~\$1500), and using untaxed money to buy
this, I got another 25% off, leaving the price at 21000 CZK (\~\$1100).
I admit, I wouldn’t want to buy it in a standard store, because I would
have to pay almost twice as much. I assume though that most of you
(developers) have a similar way of buying hardware.

### The construction

Since this was the first time I was building the PC myself, I carefully
followed the motherboard manual to connect everything to the right
places. Connecting front panel was a bit of a nightmare, and the power
led didn’t work afterwards, but overall I successfully connected
everything right. I started the PC, installed fresh copy of windows to
my SSD drive, installed some basic programs using this cool site:
<http://ninite.com/>, and setup my [CPU meter
widget](http://addgadget.com/all_cpu_meter/). I noticed that there’s a
new feature in that widget that displays CPU core temperatures. The
moment I did that it stopped being fun. My CPU was running at almost 60
°C while idle. And when I tried to install Visual Studio, it reached
over a hundred degrees. That’s not something I wanted to see, so I
immediately canceled the installation, a turned off 2 cores in BIOS.

The temperature wasn’t as high as with 4 cores, but still quite high,
and I really didn’t want to have a 4 core processor running only 2
cores. So the next day, I went to the nearest computer shop, and bought
[Cooler Master Hyper 212
plus](http://www.newegg.com/Product/Product.aspx?Item=N82E16835103065&Tpk=cooler%20master%20hyper%20212%20plus)
and [Artic Silver
5](http://www.newegg.com/Product/Product.aspx?Item=N82E16835100007&cm_re=artic_silver_5-_-35-100-007-_-Product).
I went trough all the fun of removing the motherboard and inserting it
back again. Moreover I also had to clean the CPU (remove the old thermal
paste), apply new one, mount the cooler (that is a lot more complicated
then installing the stock one, it has a back piece – reason why I had to
remove the motherboard).

The results were quite satisfying. CPU was now idling at about 40 °C,
but it went to 50 after a while. Day after that I noticed the case was
warming up on front side (i mean on the side but in front ;)). I tried
to remove the side panel, and few moments later, CPU temperature was
back at 40 °C when idle.

Of course I didn’t like the idea of having the case open all the time,
so I started looking for a new case. I was considering [Antec Nine
Hundred](http://www.newegg.com/Product/Product.aspx?Item=N82E16811129021),
until I saw his big brother [Antec Twelve
Hundred](http://www.newegg.com/Product/Product.aspx?Item=N82E16811129043).
This beast weights 14 kilograms, but since I don’t move my PC very
often, that doesn’t really matter to me, and I figured 6 fans will cool
better than 4.

Naturally I had to remove all the hardware from my old case, and install
it into the new one. Let me tell you that was some hard work. You can
route cables behind the panel that holds motherboard in place – I took
me a while to figure out how to do that right, and also to find out, the
some cable just won’t fit there, or aren’t long enough. I managed to put
it together after some 3 or 4 hours.

A few thing I like about this case that I discovered after it was
delivered: cleanable air filters on intake fans, easily removable hard
drive cages through front (though screwed in with 8 screws ;)). I was
also surprised by the lighting, which I didn’t care about at all at the
time I was ordering it, but it actually looks quite nice.

 

 [![newpc]({{site.url}}/images/www_necronet_org/WindowsLiveWriter/ThetimetoupgradeyouPCisnow_18CE/newpc_thumb.jpg "newpc")]({{site.url}}/images/www_necronet_org/WindowsLiveWriter/ThetimetoupgradeyouPCisnow_18CE/newpc_2.jpg)

 

### Recap

A final list of hardware I have now:

-   [Intel Core i7-930 Bloomfield
    2.8GHz](http://www.newegg.com/Product/Product.aspx?Item=N82E16819115225)
-   [GIGABYTE
    GA-X58A-UD5](http://www.newegg.com/Product/Product.aspx?Item=N82E16813128422)
-   3x [Kingston 4GB 240-Pin DDR3 SDRAM ECC Registered DDR3
    1333](http://www.newegg.com/Product/Product.aspx?Item=N82E16820139141)
-   [Intel X25-M Mainstream SSDSA2MH160G2R5 2.5"
    160GB](http://www.newegg.com/Product/Product.aspx?Item=N82E16820167024)
-   [Seagate Barracuda 7200.10 ST3300820AS 300GB 7200
    RPM](http://www.newegg.com/Product/Product.aspx?Item=N82E16822148602)
    – my old disk
-   [NVidia GeForce GTX
    285](http://www.newegg.com/Product/Product.aspx?Item=N82E16814125280)
-   [Cooler Master Hyper 212
    plus](http://www.newegg.com/Product/Product.aspx?Item=N82E16835103065&Tpk=cooler%20master%20hyper%20212%20plus)
-   [Antec Twelve
    Hundred](http://www.newegg.com/Product/Product.aspx?Item=N82E16811129043)
-   [Cooler Master Real Power
    M620](http://www.coolermaster.com/product.php?product_id=2573)

My WEI looks a lot better now, mission accomplished.

[![end]({{site.url}}/images/www_necronet_org/WindowsLiveWriter/ThetimetoupgradeyouPCisnow_18CE/end_thumb.png "end")]({{site.url}}/images/www_necronet_org/WindowsLiveWriter/ThetimetoupgradeyouPCisnow_18CE/end_2.png) 

Next mission: pick up all the leftover hardware, and tune up my server.
