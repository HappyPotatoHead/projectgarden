---
title: NextCloud
draft: false
tags:
description:
---

The first thing I replaced was Google Drive with Nextcloud. Initially, I wanted to use OpenMediaVault on my laptop to host a NAS and build Nextcloud over it, but I found out that it's an OS and not a software. So, it would mean that I would have to dual boot or do virtualisation; but, I decided to host Nextcloud in docker. (*Partly because dual boot and virtualisation is a hassle and I wanted to learn more about docker anyway*).

>[!NOTE] Future
>The real plan is to get a workstation

![[Nextcloud_logo.jpg]]

Setting up Nextcloud in docker (*or anything in docker really*), is, surprisingly, really simple. 

*It's simple because I followed a tutorial, but upon introspection, it's really simple*

There are two ways to set up Nextcloud in docker:
1. [All-in-One](https://nextcloud.com/blog/how-to-install-the-nextcloud-all-in-one-on-linux/)
2. Manual approach[^1]

I opted for the more manual approach since I believe that I would learn more.  ^22dd81

When I was *referring* to [^1], I actually skipped the setting up reverse proxy since I thought I would have to pay - domain name costs money; I wasn't wrong, but I didn't know [[Tailscale]] had magic DNS and they provide TSL certificates for FREE.  ^a6575e

Once I got it up and running, I decided to configure [[Tailscale]] next for remote access. (*But no TSL or reverse proxy yet, because I'm an idiot*)

Once I realise I can create a much more secure connection with Tailscale, I did exactly that with [[Reverse Proxy with Nginx|Nginx]]. *This was a headache of its own*

Putting that aside, after some tinkering with NextCloud, these are the results, 

![[dashboard_browser.png]]

![[dashboard_browser_vertical.png]]

![[files_page.png]]

Pretty cool, eh. There is also a mobile client, 

![[mobile_dashboard.jpg]]

![[mobile_sidebar.jpg]]

Uploading from mobile to Nextcloud is also much more user-friendly and intuitive compared to Google cloud. 

# 19/10/2025

The day I realise I can setup reverse proxy without money. Check out [[Reverse Proxy with Nginx|this page]] to learn more!


[^1]: https://hostman.com/tutorials/how-to-install-nextcloud-with-docker/
