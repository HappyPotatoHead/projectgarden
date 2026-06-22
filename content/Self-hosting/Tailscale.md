---
title: Tailscale
draft: false
tags: self-hosting, vpn, remote acccess
description:
---

Initially, I wanted to configure my own VPN protocols with [pfsense](https://www.pfsense.org/), but since I only have one router, I didn't want to risk messing it up. 

Instead, I opted for the simpler, quicker VPN setup with [Tailscale](https://tailscale.com/kb). It's absurdly simple; just create an account, add your machine(s), click a couple of buttons for Magic DNS, and you're all set. If you wish to share your machine(s) with other people, that's also [possible](https://tailscale.com/kb/1084/sharing) 

# Updates
## 19/10/2025

> _Why did I torture myself._ 

I decided to [[Reverse Proxy with Nginx|configure a reverse proxy with Nginx]], but I was stuck wondering what to do after generating the certification and key. The Tailscale documentation doesn't really explain much beyond the command to generate the TLS certification and key. [^1]

Having forgotten that I had an [[NextCloud#^a6575e|old source]] explaining how to set it up, I spent quite a while confused, relying instead to another source [^2] that doesn't explain any of the lines written. 

[^1]: https://tailscale.com/kb/1153/enabling-https
[^2]: https://medium.com/@TomVance/local-domains-with-https-469036775818