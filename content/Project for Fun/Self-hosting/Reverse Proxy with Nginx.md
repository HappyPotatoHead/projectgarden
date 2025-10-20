---
title: Reverse Proxy with Nginx
draft: false
tags:
description:
---

Setting this up was a headache (*partly because I am an idiot*). In retrospect, it was actually really simple; all I had to do was create a Docker compose file that pulls the [nginx image](https://hub.docker.com/_/nginx), open up ports 80 and 443, and insert the path to my certs and nginx config file. 

>[!TIP] Hot tip
>Don't name the config file `nginx.conf`, there will be a conflict. 

Once, that is done, create a `.conf` file, which is also really simple. Or it should have been really simple IF I HAD FOLLOWED THIS [TUTORIAL](https://hostman.com/tutorials/how-to-install-nextcloud-with-docker/#setting-up-nginx-as-a-reverse-proxy)

Either way, after a couple of `proxy_set_headers` and restrictions, viola, the reverse proxy has been set up. 

Though, I have to periodically renew the certificates [^1], but it's completely free, so I won't complain.

Now, instead of accessing specific servers with their port numbers, I only have to access 443 and nginx will reroute me to the right server.

[^1]: https://tailscale.com/kb/1153/enabling-https