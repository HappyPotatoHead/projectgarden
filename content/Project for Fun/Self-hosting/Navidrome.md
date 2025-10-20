---
title: Navidrome
draft: false
tags:
description:
---

I just want an ad-free music listening experience on my phone - is that too much to ask for. I heard about [navidrome](https://www.navidrome.org/) from this [video](https://youtu.be/cMVcclMkp7g?si=HxVnNkUfsyelMVQX). It's simple and really easy to setup. 

![[navidrome_logo.png]]

The documentation even provides a [docker-compose file](https://www.navidrome.org/docs/installation/docker/) for me to paste. It's literally just that simple. 

But, the harder part is downloading music *legally*. (**ALL MY METHODS ARE LEGAL**). After searching online on how people download their music, I decided to go for [`yt-dlp`](https://github.com/yt-dlp/yt-dlp). It's basically a package that lets you download videos from YouTube in the command line. This works because YouTube does not enforce DRM. 

However, this also brings about a challenge - metadata. Because YouTube isn't a music streaming site, the metadata of albums, songs, and artists are not available. So, I would have to do these manually. (*Well, not really manual; I wrote a script*)

After downloading these songs *legally*, I now have my very own **ad-free** music streaming experience. 

![[navidrome_vertical.png]]

![[you.png]]

To use this server on my phone, I downloaded [Symfonium](https://symfonium.app/) and use OpenSubsonic from Navidrome to connect to the server. It has no subscription and no ads. Just a one-time purchase of its license and it's mine. Also, side note, it. looks. amazing.

I've been using for a couple of days now, and it's been a great experience - it's smooth; it's seamless; it's very customisable; overall, it's been great. 

![[symfonium.jpg]]

![[you_phone.jpg]]