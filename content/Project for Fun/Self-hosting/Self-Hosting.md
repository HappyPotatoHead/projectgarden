---
title: Self-Hosting
draft: false
tags:
description:
---
*Doing everything **BUT** my fyp part 1*

I started homelabbing! *or self-hosting*

Companies, realising there are no alternatives, are becoming bolder and more predatory as the days go by. Every major tech companies are being sued; if not for monopolising the market, it's breach of data privacy, which I don't know about you, but it's definitely concerning. Also, these companies KNOW that they're the only providers of the services that we rely on in our day to day work, so they charge more and more for these services. 

I refuse to pay 70 bucks a year just for 100 GB; I can get 1TB or more with the same price. 

![[google_drive_pricing.png]]

Th
us, my self-hosting/homelabbing journey began. It started with [[NextCloud]]. Once I have made my cloud storage, I moved on to my own [[Navidrome|music streaming server]]. But I was still oblivious to the number of features that [[Tailscale]] really has, so I was connecting to my servers in a less secure way (*It was still secure since it's a VPN, but I was exposing more ports than I had to and I didn't have https*)

So after the [[Reverse Proxy with Nginx|nginx]] configuration was done, I now have a complete cloud server and music streaming server! 

There are other things that I wish to change or do - switching to [wireguard](https://www.wireguard.com/), using [open mediavault](https://www.openmediavault.org/) as an OS, hosting more servers, configuring remote access, and so much more. But, for now, I think I will just focus on learning the existing tool and optimising them as much as possible. 

*Todo:*
1. Learn more about tailscale
2. Make my servers fault tolerant
3. Make my servers distributed
	- Can I have multiple containers across different devices that access the same server?

I definitely recommend everyone to try self-hosting at least once; you learn a lot, and if it's not for you and you're ok with predatory companies, just take everything down. 