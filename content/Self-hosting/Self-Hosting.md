---
title: Self-Hosting
draft: false
tags: linux, docker, self-hosting, data ownership
description:
---
*Doing everything **BUT** my fyp part 1*

I started homelabbing!

# Why I started self-hosting 

I've been seeing more and more discussions about intrusive ads, questionable and unwanted features, and actions that major companies, both inside and outside of tech. Every major tech company seems to be facing lawsuits; if not for monopolising the market, then for breaches of data privacy.[^1][^2][^3] These companies are _likely_ aware they're the dominant players, so who else are we supposed to rely on?

One answer is to self-host our own services. 

I refuse to pay 70 bucks a year just for 100 GB; I can get 1TB or more with the same price. 

![[google_drive_pricing.png|400]]

# What I set up

Thus, my self-hosting journey began. It started with [[NextCloud|Nextcloud]], then my own [[Navidrome|music streaming server]]. Initially, I was oblivious to the number of features [[Tailscale]] offers, so I wasn't able to take full advantage of the tool. 

> _For a time, I was accessing my servers with port numbers rather than names, but I got it figured out in [[Reverse Proxy with Nginx|Nginx]]_

# What's next

There are still things I'd like to change or try - switching to [WireGuard](https://www.wireguard.com/), using [OpenMediaVault](https://www.openmediavault.org/) as an OS, hosting more servers, configuring remote access more extensively, and much more. But, for now, I'll focus on learning the existing tools and optimising them as much as possible. 

## **Todo:**
1. Learn more about Tailscale
2. Make my servers fault tolerant
3. Make my servers distributed
	- Can I have multiple containers across different devices that access the same server?

# Verdict 

Although not everyone has the privilege to explore and break their machines, I definitely recommend everyone try self-hosting at least once. You'll learn a lot, and if it's not for you, taking everything down is just as easy. 

[^1]: https://www.bbc.com/news/articles/c3dr91z0g4zo
[^2]: https://www.theguardian.com/technology/2025/sep/03/google-monopoly-case-ruling
[^3]: https://edition.cnn.com/2025/07/17/tech/meta-investors-zuckerberg-settlement-8-billion-trial-facebook-privacy
