---
title: Reverse Proxy with Nginx
draft: false
tags:
description:
---

Setting this up for the first time was a headache. However, like anything viewed in retrospect, it turned out to be surprisingly simple; all I had to do was create a Docker Compose file that pulls the [Nginx image](https://hub.docker.com/_/nginx), open ports 80 and 443, and insert the path to my certificates and nginx config file. 

> _I guess the difficult part was figuring out which header was best?_

>[!TIP] Hot tip
>Don't name the config file `nginx.conf`, there will be a conflict. 

Once, that is done, create a `.conf` file, which is also really simple. Or at least, it would have been if I had followed this [tutorial](https://hostman.com/tutorials/how-to-install-nextcloud-with-docker/#setting-up-nginx-as-a-reverse-proxy)

Either way, after a couple of `proxy_set_headers` directives and restrictions, voilà, the reverse proxy has been set up. I do have to periodically renew the certificates [^1], but since it's completely free, I can't complain. 

Now, instead of memorising port numbers to access specific servers, I only need to remember the names assigned to those servers, which is much easier.  

[^1]: https://tailscale.com/kb/1153/enabling-https