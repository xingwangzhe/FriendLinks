[![](https://blog.slanterns.net/images/logo.png)](https://blog.slanterns.net)
[](javascript:void\(\))
[](https://twitter.com/slanterns1 "Twitter")
[](https://github.com/slanterns "GitHub")
[](https://blog.slanterns.net/atom.xml "RSS")
[](javascript:;)
  * [ 技术 ](https://blog.slanterns.net/categories/Tech/ "提高姿势水平")
  * [ 归档 ](https://blog.slanterns.net/archives/ "总览历史文章")
  * [ (๑˙Δ˙๑)╱ ](javascript:void; "点我点我")


#  [The QUICk Introduction to NGINX](https://blog.slanterns.net/The-QUICk-Introduction-to-NGINX/)
  1. [前言](https://blog.slanterns.net/The-QUICk-Introduction-to-NGINX/#%E5%89%8D%E8%A8%80)
  2. [BUILD](https://blog.slanterns.net/The-QUICk-Introduction-to-NGINX/#BUILD)


#  [](https://blog.slanterns.net/The-QUICk-Introduction-to-NGINX/#%E5%89%8D%E8%A8%80 "前言")前言
等待已久的 _内建_ quic 支持终于随 Nginx 1.25.0 落地（虽然 experimental），正好也来到了学期的末尾于是有时间尝试。
本文是 [The PUJI Introduction to NGINX](https://blog.slanterns.net/The-PUJI-Introduction-to-NGINX/)、[QUIC 实验](https://blog.slanterns.net/Quic-Test/)、[The PUJI Introduction to NGINX ver.2019.11](https://blog.slanterns.net/The-PUJI-Introduction-to-NGINX-ver-2019-11/) 的后继。
  

#  [](https://blog.slanterns.net/The-QUICk-Introduction-to-NGINX/#BUILD "BUILD")BUILD

```
export MakeThreads=8

apt install build-essential libpcre3 libpcre3-dev zlib1g-dev unzip git autoconf libtool automake

mkdir build_ngx && cd build_ngx

wget https://github.com/axboe/liburing/archive/liburing-2.3.zip
unzip liburing-2.3.zip
cd liburing-liburing-2.3/
./configure
make -j$MakeThreads && make install
cd ..

git clone --depth=1 --recursive https://github.com/google/ngx_brotli.git
git clone --depth=1 https://github.com/kn007/patch.git
git clone --depth=1 https://github.com/hakasenyang/openssl-patch
git clone --depth=1 https://github.com/quictls/openssl/ -b openssl-3.1.0+quic+locks quictls

wget https://nginx.org/download/nginx-1.25.0.tar.gz
tar zxf nginx-1.25.0.tar.gz

cd nginx-1.25.0
patch -p1 < ../patch/nginx.patch
patch -p1 < ../openssl-patch/nginx_io_uring.patch

./configure --with-cc-opt='-m64 -O3 -DTCP_FASTOPEN=23 -ffast-math -march=native -flto -fuse-ld=gold' --add-module=../ngx_brotli --with-openssl=../quictls --with-openssl-opt='no-ssl no-ssl3 no-tls1 no-tls1_1 no-tls1_2 no-ssl3-method no-tls1-method no-tls1_1-method no-tls1_2-method no-tests -m64 -O3 -ffast-math -march=native -flto -fuse-ld=gold' --with-http_v2_module --with-http_v3_module --with-http_ssl_module --with-http_v2_hpack_enc --with-file-aio --with-http_sub_module --without-http_ssi_module --without-http_scgi_module --without-http_uwsgi_module --without-http_gzip_module --without-http_auth_basic_module --without-http_autoindex_module --without-http_geo_module --without-http_map_module --without-http_split_clients_module --without-http_referer_module --without-http_memcached_module --without-http_limit_req_module --without-http_empty_gif_module --without-http_upstream_ip_hash_module --without-http_access_module --without-http_mirror_module --without-http_grpc_module --without-http_limit_conn_module --without-http_upstream_hash_module --without-http_upstream_least_conn_module --without-http_upstream_zone_module --without-mail_pop3_module --without-mail_imap_module --without-mail_smtp_module --without-stream_limit_conn_module --without-stream_access_module --without-stream_geo_module --without-stream_map_module --without-stream_split_clients_module --without-stream_return_module --without-stream_upstream_hash_module --without-stream_upstream_least_conn_module --without-stream_upstream_zone_module
make -j$MakeThreads
make install

```

(wip)
[技术](https://blog.slanterns.net/categories/Tech/) 2023-05-25 [TLS/HTTPS](https://blog.slanterns.net/tags/tls-https/), [nginx](https://blog.slanterns.net/tags/nginx/)
如果评论框加载不出来，那就说明 Disqus 被墙了，你看着办吧 |ー` ) 
[ ![](https://blog.slanterns.net/images/avatar.png)](https://blog.slanterns.net)
Slanterns' blog
连续发生的奇迹。
  * [ 我的小伙伴们 ](https://blog.slanterns.net/Friends "友情链接")
  * [ 关于我 ](https://blog.slanterns.net/about "\(*ﾟ∀ﾟ*\)")


### 文章目录
  1. [前言](https://blog.slanterns.net/The-QUICk-Introduction-to-NGINX/#%E5%89%8D%E8%A8%80)
  2. [BUILD](https://blog.slanterns.net/The-QUICk-Introduction-to-NGINX/#BUILD)


[Slanterns' blog](https://blog.slanterns.net) 2022 • [Creative Commons BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)  
Proudly published with [Hexo](https://hexo.io/).
