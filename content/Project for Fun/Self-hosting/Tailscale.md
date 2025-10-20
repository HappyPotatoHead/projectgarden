---
title: Tailscale
draft: false
tags:
description:
---

Initially, I wanted to lean into my masochistic nature and configure my own VPN protocols with [pfsense](https://www.pfsense.org/), but I only have one router and I didn't want to fuck it up. 

So, I opted for the simpler, quicker VPN setup - [Tailscale](https://tailscale.com/kb). It's absurdly simple - all you have to do is make an account, add your machine (s), click a couple of buttons for magic DNS, and you're golden. 

# 19/10/2025

> Why did I torture myself. 

It was worth it, though, since my connection is much more secure now. It turns out I had been exposing my [[Navidrome]], which I should have noticed much, much earlier. 

Also, I was stuck wondering what I should do after generating the certification and key. The Tailscale documentation doesn't really tell me anything other than the command to generate the TLS certification and key. [^1]

So, I wasted even more time, REFERRING TO ANOTHER SOURCE, [^2] when I could have just referred to an [[NextCloud#^a6575e|old source]]. 

Regardless, this deserves it's own [[Reverse Proxy with Nginx|topic]].


[^1]: https://tailscale.com/kb/1153/enabling-https
[^2]: https://medium.com/@TomVance/local-domains-with-https-469036775818