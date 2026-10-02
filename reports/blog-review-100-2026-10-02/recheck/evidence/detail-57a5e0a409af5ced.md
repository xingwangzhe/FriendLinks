[![花开陌上](https://assets.moshanghua.net/img/mshlogo.png) ](https://moshanghua.net/)[首页](https://moshanghua.net/)
分类
[学无止境](https://moshanghua.net/category/notes)[网站相关](https://moshanghua.net/category/blog-daily)[一份教程](https://moshanghua.net/category/Tool-use)[碎碎念](https://moshanghua.net/category/Ramblings)[Web](https://moshanghua.net/category/web)[Python](https://moshanghua.net/category/python)[前端探索](https://moshanghua.net/category/WebExplore)[萌化资源](https://moshanghua.net/category/moeresources)[还有音乐](https://moshanghua.net/category/e9-9f-b3-e4-b9-90-e5-88-86-e4-ba-ab)[不分类](https://moshanghua.net/category/uncategorized)
[归档](https://moshanghua.net/archives)[说说](https://moshanghua.net/tweet)[相册](https://moshanghua.net/albums)[友链](https://moshanghua.net/links)[个人介绍](https://moshanghua.net/60.html)[留言板](https://moshanghua.net/comments.html)[开往](https://www.travellings.cn/go)
# Yuelai Engine Blog的命令与更新
2026/5/18 00:13:43Chixm188 阅读2 点赞0 评论
**目录** 隐藏
  * [常用系统命令](https://moshanghua.net/archives/371.html#%E5%B8%B8%E7%94%A8%E7%B3%BB%E7%BB%9F%E5%91%BD%E4%BB%A4)
  * [Yuelai Engine 服务的命令](https://moshanghua.net/archives/371.html#yuelai-engine-%E6%9C%8D%E5%8A%A1%E7%9A%84%E5%91%BD%E4%BB%A4)
  * [Yuelai Engine Blog 服务的命令](https://moshanghua.net/archives/371.html#yuelai-engine-blog-%E6%9C%8D%E5%8A%A1%E7%9A%84%E5%91%BD%E4%BB%A4)
  * [Yuelai Engine 的更新](https://moshanghua.net/archives/371.html#yuelai-engine-%E7%9A%84%E6%9B%B4%E6%96%B0)
  * [手动更新](https://moshanghua.net/archives/371.html#%E6%89%8B%E5%8A%A8%E6%9B%B4%E6%96%B0)
  * [后端及后台更新](https://moshanghua.net/archives/371.html#%E5%90%8E%E7%AB%AF%E5%8F%8A%E5%90%8E%E5%8F%B0%E6%9B%B4%E6%96%B0)
  * [前端更新](https://moshanghua.net/archives/371.html#%E5%89%8D%E7%AB%AF%E6%9B%B4%E6%96%B0)
  * [从服务器上移除Yuelai Engine Blog](https://moshanghua.net/archives/371.html#%E4%BB%8E%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%A7%BB%E9%99%A4yuelai-engine-blog)
  * [1. 停止服务](https://moshanghua.net/archives/371.html#1-%E5%81%9C%E6%AD%A2%E6%9C%8D%E5%8A%A1)
  * [2. 删除 systemd 服务文件](https://moshanghua.net/archives/371.html#2-%E5%88%A0%E9%99%A4-systemd-%E6%9C%8D%E5%8A%A1%E6%96%87%E4%BB%B6)
  * [3. 删除程序文件](https://moshanghua.net/archives/371.html#3-%E5%88%A0%E9%99%A4%E7%A8%8B%E5%BA%8F%E6%96%87%E4%BB%B6)
  * [4. 删除数据库](https://moshanghua.net/archives/371.html#4-%E5%88%A0%E9%99%A4%E6%95%B0%E6%8D%AE%E5%BA%93)
  * [5. 删除日志文件](https://moshanghua.net/archives/371.html#5-%E5%88%A0%E9%99%A4%E6%97%A5%E5%BF%97%E6%96%87%E4%BB%B6)
  * [6. 删除其他残留](https://moshanghua.net/archives/371.html#6-%E5%88%A0%E9%99%A4%E5%85%B6%E4%BB%96%E6%AE%8B%E7%95%99)


## 常用系统命令
### Yuelai Engine 服务的命令
BASH复制

```
# 重新加载 systemd 配置
sudo systemctl daemon-reload

```

**重新加载 systemd 配置。** 当新增、修改或删除了 `/etc/systemd/system/` 目录下的 `.service` 文件后，需要执行此命令让 systemd 重新读取配置，否则 systemd 不会识别新服务或新改动。
BASH复制

```
# 设置开机自启动
sudo systemctl enable yuelai-engine

```

**设置开机自启动。** 将 `yuelai-engine` 服务加入系统启动项，服务器重启后会自动启动该服务。
BASH复制

```
# 立即启动服务
sudo systemctl start yuelai-engine

```

**立即启动服务。** 手动启动 `yuelai-engine` 服务，仅在当前会话生效（如果未设置 enable，重启后不会自动启动）。
BASH复制

```
# 查看服务状态
sudo systemctl status yuelai-engine

```

**查看服务状态。** 显示服务的运行状态（运行中/已停止/失败）、进程 PID、最近的日志输出、是否启用自启动等信息。
BASH复制

```
# 重启服务
sudo systemctl restart yuelai-engine

```

**重启服务。** 先停止（stop）再启动（start）服务。常用于配置文件修改后使更改生效，或服务出现异常需要重置时。
BASH复制

```
# 停止服务
sudo systemctl stop yuelai-engine

```

执行后，该服务会立即停止运行，但不会取消开机自启动（如果之前用 `enable` 设置过，下次开机仍会启动）。
BASH复制

```
#取消开机自启动
sudo systemctl disable yuelai-engine

# 查看服务的状态，并显示最近 50 行日志
sudo systemctl status yuelai-engine -n 50

# 实时查看服务日志
sudo journalctl -u yuelai-engine -f

# 查看最近的日志
sudo journalctl -u yuelai-engine --since "10 minutes ago"
sudo journalctl -u yuelai-engine --since today
sudo journalctl -u yuelai-engine -n 100 -f

```

### Yuelai Engine Blog 服务的命令
BASH复制

```
# 重新加载 systemd 配置
sudo systemctl daemon-reload

# 设置开机自启动
sudo systemctl enable yuelaiengine-blog

# 立即启动服务
sudo systemctl start yuelaiengine-blog

# 查看服务状态
sudo systemctl status yuelaiengine-blog

# 重启服务
sudo systemctl restart yuelaiengine-blog

# 实时查看服务日志
sudo journalctl -u yuelaiengine-blog -f

```

## Yuelai Engine 的更新
程序目前会修复问题或者增加新功能，有更新的时候，可以用以下方法体验到新版本。
### 手动更新
首先准备好更新要用到的文件，文件在对应的仓库可以下载到  
![](https://assets.moshanghua.net/images/2026/371/1.png)
#### 后端及后台更新
先更新后端，解压`backend-linux-amd64-v1-9-2.zip`  
![](https://assets.moshanghua.net/images/2026/371/2.png)  
把文件`yuelai-engine-server-linux-amd64`上传到服务器的后端目录  
![](https://assets.moshanghua.net/images/2026/371/3.png)
上传成功后，记得给一下权限，文件所在目录记得改成自己的
BASH复制

```
chmod +x /opt/yuelaiengine/yuelai-engine-server-linux-amd64

```

后端更新好了后，更新后台。解压 `web-dist-v...` 开头的文件  
![](https://assets.moshanghua.net/images/2026/371/4.png)
把它放在服务器的后端同级目录  
如果是在服务器上解压的，由于打包原因，记得使用 `mv` 把 `dist` 目录移除了
BASH复制

```
unzip web-dist-v1-9-2.zip
mv /opt/yuelaiengine/web/dist/ /opt/yuelaiengine/

```

解压完了后，重启一下服务
BASH复制

```
sudo systemctl restart yuelai-engine

```

#### 前端更新
![](https://assets.moshanghua.net/images/2026/371/5.png)  
解压 `nuxt-release-v1...` 开头的文件到前端的文件夹里面  
![](https://assets.moshanghua.net/images/2026/371/6.png)
然后重启一下前端的服务
BASH复制

```
sudo systemctl restart yuelaiengine-blog

```

当前后端都更新好了后，就可以体验新版本了  
由于本次更新了新功能，需要重新导入一下字段  
![](https://assets.moshanghua.net/images/2026/371/7.png)
把准备好的 `json` 文件在后台导入。注意导入的时候记得勾选删除原字段再导入新字段
![](https://assets.moshanghua.net/images/2026/371/8.png)
自此，更新就完成了！
## 从服务器上移除Yuelai Engine Blog
### 1. 停止服务
BASH复制

```
sudo systemctl stop yuelai-engine
sudo systemctl disable yuelai-enginesudo systemctl disable yuelai-engine

```

### 2. 删除 systemd 服务文件
BASH复制

```
sudo rm -f /etc/systemd/system/yuelai-engine.service
sudo systemctl daemon-reloadsudo systemctl daemon-reload

```

### 3. 删除程序文件
BASH复制

```
# 删除整个程序目录
sudo rm -rf /opt/yuelaiengine/

```

### 4. 删除数据库
注意：如果 yuelai-engine 使用的是系统级数据库（比如和其他服务共用 MySQL），删除数据库时要确认不会影响其他服务。  
如果不确定数据库名，先执行 SHOW DATABASES; 查看。
删除数据库：
SQL复制

```
DROP DATABASE engine;

```

### 5. 删除日志文件
BASH复制

```
# 删除 systemd 日志
sudo journalctl --vacuum-time=1s --unit=yuelai-engine

```

### 6. 删除其他残留
BASH复制

```
# 检查是否还有其他相关文件
sudo find / -name "*yuelai*" -type f 2>/dev/null
sudo find / -name "*yuelai*" -type d 2>/dev/null

# 删除找到的相关文件/目录（谨慎操作）

```

点赞 文章二维码  复制分享链接
## 评论区
昵称邮箱
网址（可选）评论内容
OωO 
提交评论当有回复时邮件通知我


### 博客正在进行迁移
  * 📮 首次提交评论的邮箱需要审核
  * ⚠️ 无法看清验证码点击刷新即可
  * 🐛 欢迎前往留言板提交 bug ~


### 最新评论
  * ![chixm](https://weavatar.com/avatar/b4edbc4a546aae421831011f4c3970d63e5ea1f58ddd32dd99be67773f383d20?d=mp&s=96)
chixm评论[留言板](https://moshanghua.net/comments.html#comment-1450 "留言板")
已添加。好久没看到你冒泡了
  * ![卡伊德](https://weavatar.com/avatar/d25140ab644de8d336aabaec496d5d914f8fc9fbfa73895da5c55c35938dc8ad?d=mp&s=96)
卡伊德评论[留言板](https://moshanghua.net/comments.html#comment-1446 "留言板")
友联里可以😇增加我的rss订阅嘛？感谢了😀 https://www.caidhome.cn/rss.xml
  * ![Henry](https://weavatar.com/avatar/74d400592a01def2a9542a2507a7cc49fd8f3675560dc86143ba730ee5093686?d=mp&s=96)
Henry评论[安装使用Yuelai Engine Blog - 后端篇](https://moshanghua.net/archives/366.html#comment-1445 "安装使用Yuelai Engine Blog - 后端篇")
这是什么破烂？没听说过！🤣
  * ![Chixm](https://weavatar.com/avatar/b4edbc4a546aae421831011f4c3970d63e5ea1f58ddd32dd99be67773f383d20?d=mp&s=96)
Chixm评论[安装使用Yuelai Engine Blog - 后端篇](https://moshanghua.net/archives/366.html#comment-1444 "安装使用Yuelai Engine Blog - 后端篇")
这是一整套yuelaiengine博客系统。如果感兴趣，可以前往开发者的这篇文章[字节星球终于全栈上新！](https://www.bytecho.net/archives/bytecho_refabricated.html)的评论区去交流一下。
  * ![卡伊德](https://weavatar.com/avatar/5892c2ef3ff7c103784a9d739d389f85c68cea035150b58a9d841873cb73bb18?d=mp&s=96)
卡伊德评论[安装使用Yuelai Engine Blog - 后端篇](https://moshanghua.net/archives/366.html#comment-1442 "安装使用Yuelai Engine Blog - 后端篇")
这个主题真炫酷啊，开源吗？
  * ![Henry](https://weavatar.com/avatar/74d400592a01def2a9542a2507a7cc49fd8f3675560dc86143ba730ee5093686?d=mp&s=96)
Henry评论[留言板](https://moshanghua.net/comments.html#comment-1441 "留言板")
谁说的？
  * ![xiaomo](https://weavatar.com/avatar/b4edbc4a546aae421831011f4c3970d63e5ea1f58ddd32dd99be67773f383d20?d=mp&s=96)
xiaomo评论[留言板](https://moshanghua.net/comments.html#comment-1440 "留言板")
因为检测结果一定程度下仅供参考😑
  * ![第一百零一次闯荡江湖的无名游侠](https://weavatar.com/avatar/dbcc60cdfa60834f0eeb7112f0c02c1e3873b565fb0abafd82f01cb877e2737e?d=mp&s=96)
第一百零一次闯荡江湖的无名游侠评论[留言板](https://moshanghua.net/comments.html#comment-1439 "留言板")
☺️原来如此，我把waf关了，现在就好了


### 站点统计
  * 标签**311**
  * 文章**145**
  * 页面**2**
  * 评论**1435**
  * 分类**10**
  * 更新**2026-10-02**


### 热门标签
[ #Python 20](https://moshanghua.net/tag/python)[ #JavaScript 17](https://moshanghua.net/tag/javascript)[ #css 15](https://moshanghua.net/tag/css)[ #洛天依 8](https://moshanghua.net/tag/%E6%B4%9B%E5%A4%A9%E4%BE%9D)[ #前端笔记 7](https://moshanghua.net/tag/%E5%89%8D%E7%AB%AF%E7%AC%94%E8%AE%B0)[ #CSS3 5](https://moshanghua.net/tag/css3)[ #QQ 5](https://moshanghua.net/tag/qq)[ #Ubuntu22.04 5](https://moshanghua.net/tag/ubuntu22-04)[ #函数 5](https://moshanghua.net/tag/%E5%87%BD%E6%95%B0)[ #Django5 4](https://moshanghua.net/tag/django5)[ #Linux 4](https://moshanghua.net/tag/linux)[ #MySQL 4](https://moshanghua.net/tag/mysql)[ #深谷Shintani 4](https://moshanghua.net/tag/%E6%B7%B1%E8%B0%B7shintani)[ #wordpress 3](https://moshanghua.net/tag/wordpress)[ #函数传参 3](https://moshanghua.net/tag/%E5%87%BD%E6%95%B0%E4%BC%A0%E5%8F%82)[ #基础知识 3](https://moshanghua.net/tag/%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86)[ #扯淡 3](https://moshanghua.net/tag/%E6%89%AF%E6%B7%A1)[ #数据类型 3](https://moshanghua.net/tag/%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)[ #杂谈 3](https://moshanghua.net/tag/%E6%9D%82%E8%B0%88)[ #美化 3](https://moshanghua.net/tag/%E7%BE%8E%E5%8C%96)[ #Bash 2](https://moshanghua.net/tag/bash)[ #Firefox 2](https://moshanghua.net/tag/firefox)[ #Git 2](https://moshanghua.net/tag/git)[ #Mac 2](https://moshanghua.net/tag/mac)[ #Nginx 2](https://moshanghua.net/tag/nginx)[ #Node 2](https://moshanghua.net/tag/node)[ #PHP 2](https://moshanghua.net/tag/php)[ #Vim 2](https://moshanghua.net/tag/vim)[ #float 2](https://moshanghua.net/tag/float)[ #for 2](https://moshanghua.net/tag/for)
Copyright © Chixm All Rights Reserved. 2016 -
[计算服务以及CDN存储服务均由阿里云提供](https://www.aliyun.com)|[萌ICP备20200527号](https://icp.gov.moe/?keyword=moshanghua.net)|[Travelling](https://www.travellings.cn/go)|[YuelaiGroup](https://www.yuelaigroup.com)|[字节星球](https://www.bytecho.net)
[](https://moshanghua.net/feed.xml "Feed")[](https://moshanghua.net/sitemap.xml "Sitemap")
[桂ICP备17003522号-1](http://beian.miit.gov.cn/)
[Powered by Yuelai Engine](https://www.yuelaigroup.com)
