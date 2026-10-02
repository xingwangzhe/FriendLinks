[跳到正文](https://www.imcxx.com/post/45#main)
[ ![](https://www.imcxx.com/5cd6687e4e5e7.jpg) 轻风伴梦 ](https://www.imcxx.com/)
[网盘](https://one.imcxx.com)
[管理](https://www.imcxx.com/admin)
# Rclone+Nginx配置WebDav
发布于 2026-04-22 更新于 2026-04-23
  * [rclone配置](https://www.imcxx.com/post/45#rclone)
  * [nginx配置](https://www.imcxx.com/post/45#nginx)


轻量化配置WebDav
## rclone配置
安装rclone：

```
apt install rclong -y

```

配置守护程序： `nana /etc/systemd/system/rclone-dav.service`

```
[Unit]
Description=Rclone WebDAV Service
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/rclone serve webdav /home/webdav \
    --addr 127.0.0.1:8080 \
    --user username \
    --pass password \
    --vfs-cache-mode writes \
    --buffer-size 32M

Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target

```

启动:

```
systemctl enable rclone-dav
systemctl start rclone-dav

```

## nginx配置

```
server {
    listen 80;
    server_name dav.imcxx.com;

    client_max_body_size 10G;

    location / {
        proxy_pass http://127.0.0.1:8080/;

        # 核心修复：强制使用 HTTP 1.1 并处理 Host
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;

        # WebDAV 必须透传的头
        proxy_set_header Authorization $http_authorization;
        proxy_pass_header Authorization;
        proxy_set_header Destination $http_destination;

        # 辅助信息
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # 性能优化：禁用缓存
        proxy_buffering off;
        proxy_request_buffering off;
    }
}

```

重启nginx

```
systemctl restart nginx

```

测试配置： 在/home/webdav目录下生成test.txt文件，内容为hello 内网测试：

```
curl -u username:password -X PUT http://127.0.0.1:8080/test.txt -d "hello"

```

公网测试：

```
curl -u username:password -X PUT http://dav.imcxx.com/test.txt -d "hello"

```

没问题会返回 Created
上一篇[HAProxy配置记录](https://www.imcxx.com/post/44)
## 评论
0 条
暂无已通过的评论。
这篇文章未开放评论。
© 轻风伴梦 由 Flask 与 Markdown 驱动
