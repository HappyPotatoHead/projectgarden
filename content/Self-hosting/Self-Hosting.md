---
title: Self-Hosting
draft: false
tags: linux, docker, self-hosting, data ownership
description:
---

_Doing everything **BUT** my fyp part 1_

I started homelabbing!

# Why I started self-hosting

I've been seeing more and more discussions about intrusive ads, questionable and unwanted features, and actions that major companies, both inside and outside of tech. Every major tech company seems to be facing lawsuits; if not for monopolising the market, then for breaches of data privacy.[^1][^2][^3].

> Also, primarily because I thought it's interesting to self-host our own services. We've gone on and on about slow connections or crashing servers; I just wanted to have a glimpse of what it's like maintaining servers.

One answer is to self-host our own services.

I refuse to pay 70 bucks a year just for 100 GB; I can get 1TB or more with the same price. (_I'm broke_)

![[google_drive_pricing.png|400]]

# What I set up

Thus, my self-hosting journey began. It started with [[NextCloud|Nextcloud]], then my own [[Navidrome|music streaming server]]. Initially, I was oblivious to the number of features [[Tailscale]] offers, so I wasn't able to take full advantage of the tool.

> _For a time, I was accessing my servers with port numbers rather than names, but I got it figured out in [[Reverse Proxy with Nginx|Nginx]]_

# What's next

There are still things I'd like to change or try - switching to [WireGuard](https://www.wireguard.com/), using [OpenMediaVault](https://www.openmediavault.org/) as an OS, hosting more servers, configuring remote access more extensively, and much more. But, for now, I'll focus on learning the existing tools and optimising them as much as possible.

## **Todo:**

1. ~~Learn more about Tailscale~~
    - It's genuinely really simple. It's a set up and forget kind of service
    - A more interesting vpn tool would be wireguard
2. Make my servers fault tolerant
    - Honestly, I'm not sure how I should get started on this. I only have one laptop and a desktop
    - I'm guessing that I should focus on making the Docker containers fault tolerant as opposed to making the physical hardware fault tolerant
3. Make my servers distributed
    - Apparently I need a non-Docker tool to manage this, so this will be placed in my backlog for now

# Verdict

Although not everyone has the privilege to explore and break their machines, I definitely recommend everyone try self-hosting at least once. You'll learn a lot, and if it's not for you, taking everything down is just as easy.

[^1]: https://www.bbc.com/news/articles/c3dr91z0g4zo

[^2]: https://www.theguardian.com/technology/2025/sep/03/google-monopoly-case-ruling

[^3]: https://edition.cnn.com/2025/07/17/tech/meta-investors-zuckerberg-settlement-8-billion-trial-facebook-privacy
