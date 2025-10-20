---
title: Reverse Proxy with Nginx
draft: false
tags:
description:
---

Setting this up was a headache (*partly because I am a huge idiot*). In retrospect it was actually really simple. All I had to do was create a docker compose file that pulls the [nginx image](https://hub.docker.com/_/nginx) from the docker hub, open up ports 80 and 443, and point the container to the path of my certs and my nginx config file. 

>[!TIP] Hot tip
>Don't name the config file nginx.conf, there will be a conflict. 

Once, that is done, create a `.conf` file, which is also really simple. Or it should have been really simple IF I HAD FOLLOWED THIS [TUTORIAL](https://hostman.com/tutorials/how-to-install-nextcloud-with-docker/#setting-up-nginx-as-a-reverse-proxy)

Either way, after a couple of `proxy_set_headers` and restrictions, viola, the reverse proxy has been set up. 

Though, I have to periodically renew the certificates [^1], but it's completely free, so I won't complain.

One the TSL and reverse proxy has been set-up, my connections are now secure and safe.  

Instead of accessing specific servers with their port numbers, I only have to access 443 and nginx will reroute me to the right server. 


[^1]: https://tailscale.com/kb/1153/enabling-https