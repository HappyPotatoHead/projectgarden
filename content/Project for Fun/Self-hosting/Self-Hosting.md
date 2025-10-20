---
title: Self-Hosting
draft: false
tags:
description:
---
*Doing everything **BUT** my fyp part 1*

I started homelabbing! *or self-hosting*

Are you tired of the overwhelming and uncomfortably intrusive ads that companies are incessantly pushing towards you. Every major tech companies are being sued; if not for monopolising the market, it's breach of data privacy.[^1][^2][^3] Also, these companies KNOW that they're the major players in the market; who else are we going to rely on? So, they charge an exorbitant amount for their services. 

I refuse to pay 70 bucks a year just for 100 GB; I can get 1TB or more with the same price. 

![[google_drive_pricing.png]]

Thus, my self-hosting/homelabbing journey began. It started with [[NextCloud]], then my own [[Navidrome|music streaming server]]. But I was still oblivious to the number of features that [[Tailscale]] really has, so I was connecting to my servers in a less secure way (*It was still secure since it's a VPN, but I was exposing more ports than I had to and I didn't deploy https*)

Once the [[Reverse Proxy with Nginx|nginx]] configuration was done, I have a complete cloud server and music streaming server! 

There are other things that I wish to change or do - switching to [wireguard](https://www.wireguard.com/), using [open mediavault](https://www.openmediavault.org/) as an OS, hosting more servers, configuring remote access, and so much more. But, for now, I think I will just focus on learning the existing tool and optimising them as much as possible. 

*Todo:*
1. Learn more about tailscale
2. Make my servers fault tolerant
3. Make my servers distributed
	- Can I have multiple containers across different devices that access the same server?

I definitely recommend everyone to try self-hosting at least once; you learn a lot, and if it's not for you, just take everything down. 

[^1]: https://www.bbc.com/news/articles/c3dr91z0g4zo
[^2]: https://www.theguardian.com/technology/2025/sep/03/google-monopoly-case-ruling
[^3]: https://edition.cnn.com/2025/07/17/tech/meta-investors-zuckerberg-settlement-8-billion-trial-facebook-privacy
