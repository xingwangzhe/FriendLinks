![Avatar](https://tntxz.starsfire.top/assets/img/head.png)
![Taichi](https://tntxz.starsfire.top/assets/img/taichi.svg)
[TNTXZ's blog](https://tntxz.starsfire.top/)
文章
  * [隧道](https://tntxz.starsfire.top/archives)
  * [标签](https://tntxz.starsfire.top/tags)
  * [随机](https://tntxz.starsfire.top/2026/02/08/%E9%A3%9E%E7%89%9BNas%E5%AE%89%E8%A3%85%E6%A1%8C%E9%9D%A2%E5%8F%8A%E5%BA%94%E7%94%A8%E5%B8%82%E5%9C%BA%E6%95%99%E7%A8%8B/)


我的
  * [小说](https://tntxz.starsfire.top/me/novel)
  * [视频](https://tntxz.starsfire.top/me/video)
  * [游戏](https://tntxz.starsfire.top/me/game)
  * [音乐](https://tntxz.starsfire.top/me/music)
  * [绘画](https://tntxz.starsfire.top/me/drawing)


[友链](https://tntxz.starsfire.top/friends)
[关于](https://tntxz.starsfire.top/about)
![Search](https://tntxz.starsfire.top/assets/img/search.svg)
# 飞牛Nas安装桌面及应用市场教程
2026-02-08
[飞牛](https://tntxz.starsfire.top/tags/%E9%A3%9E%E7%89%9B)[Nas](https://tntxz.starsfire.top/tags/Nas)[科技](https://tntxz.starsfire.top/tags/%E7%A7%91%E6%8A%80)[Linux](https://tntxz.starsfire.top/tags/Linux)[教程](https://tntxz.starsfire.top/tags/%E6%95%99%E7%A8%8B)
# 飞牛Nas安装桌面及应用市场教程
当我们装完飞牛后看着这个画面是不是非常难受，于是主包准备给他装个桌面。
![飞牛初始界面](https://image.starsfire.top/blog/2026/2/8/0.jpg)
## 安装肉桂桌面
### 1. 开启SSH服务
首先网页打开飞牛：
![打开飞牛](https://image.starsfire.top/blog/2026/2/8/1.png)
在设置中找到SSH并打开：
![开启SSH](https://image.starsfire.top/blog/2026/2/8/2.png)
### 2. 连接NAS
电脑打开终端SSH连接上NAS，（为什么用终端呢？很简单，怕有的人不会用ssh软件）
（Windows终端总是人手一个吧）
连接命令：
bash 复制

```
1
```

```
ssh <用户名>@<Nas地址>
```

（注意：<>中的内容根据实际情况填写）
![连接NAS](https://image.starsfire.top/blog/2026/2/8/3.png)
### 3. 更新软件包列表
更新一下软件包列表：
更新命令：
bash 复制

```
123
```

```
sudo -i
# 然后输入密码
apt update
```

![更新软件包](https://image.starsfire.top/blog/2026/2/8/4.png)
### 4. 安装肉桂桌面
安装肉桂桌面，这时候又有人会问了，为什么不用gnome或kde，很简单，肉桂轻量，老设备也带得动
况且主包后台还挂了机器人、MC服务器等，如需其他桌面等待博客后续更新：
安装命令：
bash 复制

```
1
```

```
apt install cinnamon -y
```

![安装肉桂桌面](https://image.starsfire.top/blog/2026/2/8/5.png)
### 5. 更换语言
接下来换语言：
更换语言命令：
bash 复制

```
1
```

```
dpkg-reconfigure locales
```

![更换语言](https://image.starsfire.top/blog/2026/2/8/6.png)
↓键下去找到中文：
![找到中文](https://image.starsfire.top/blog/2026/2/8/7.png)
按空格勾选然后enter：
![勾选中文](https://image.starsfire.top/blog/2026/2/8/8.png)
选中文然后enter：
![选择中文](https://image.starsfire.top/blog/2026/2/8/9.png)
### 6. 重启NAS
reboot重启一下：
重启命令：
bash 复制

```
1
```

```
reboot
```

![重启NAS](https://image.starsfire.top/blog/2026/2/8/10.png)
### 7. 登录桌面
ok了，登上nas设置的号：
![登录桌面](https://image.starsfire.top/blog/2026/2/8/11.jpg)
## 安装应用市场
### 1. 传输安装包
接下来安装应用市场，下载deb后在当前文件夹打开终端：
![打开终端](https://image.starsfire.top/blog/2026/2/8/12.png)
输指令将文件用sftp传到nas上：
传输命令：
bash 复制

```
1
```

```
scp <星火应用市场>.deb <用户名>@<Nas地址>:/home/<用户名>
```

（注意：<>中的内容根据实际情况填写）
![传输文件](https://image.starsfire.top/blog/2026/2/8/13.png)
### 2. 安装依赖
再次ssh连上nas安装依赖，注意用root用户，或者指令前加sudo：
安装依赖命令：
bash 复制

```
1
```

```
apt install libdtkcore5 libdtkgui5 libdtkwidget5 libqt5concurrent5 libqt5positioning5 libqt5printsupport5 libqt5webchannel5 libqt5webenginecore5 libqt5webenginewidgets5 dde-qt5integration libnotify-bin dpkg-dev
```

![安装依赖](https://image.starsfire.top/blog/2026/2/8/14.png)
### 3. 安装星火应用市场
用dpkg安装星火应用市场，注意用root用户，或者指令前加sudo：
安装命令：
bash 复制

```
1
```

```
dpkg -i /home/<用户名>/<星火应用市场>.deb
```

（注意：<>中的内容根据实际情况填写）
![安装应用市场](https://image.starsfire.top/blog/2026/2/8/15.png)
### 4. 打开应用市场
菜单中可以找到星火应用市场，打开，大功告成，然后安装你想要的软件吧：
![打开应用市场](https://image.starsfire.top/blog/2026/2/8/16.jpg)
## 一键安装脚本
为了方便用户，我写了一个一键安装脚本，只需一行代码即可完成所有安装步骤：
bash 复制

```
1
```

```
wget -O install.sh https://image.starsfire.top/blog/2026/2/8/install.sh && chmod +x install.sh && sudo bash install.sh
```

## 总结
通过以上步骤，我们成功为飞牛Nas安装了肉桂桌面和星火应用市场，让NAS的使用体验更加友好。肉桂桌面轻量高效，适合各种设备使用，而星火应用市场则为我们提供了丰富的软件资源。
如果你有任何问题或建议，欢迎在评论区留言讨论！
![TNTXZ](https://tntxz.starsfire.top/assets/img/head.png)
TNTXZ
一个成分复杂的生物的个人博客。写代码、搞硬件、玩MC、偶尔画画。
[GH](https://github.com/TNTXZ "GitHub")[B](https://space.bilibili.com/1515387402 "B站")[X](https://x.com/_TNTXZ_ "X")
网站信息
254
运行天数
6
文章数量
13
标签数量
3
归档月份
标签
[Linux](https://tntxz.starsfire.top/tags/Linux)[MC](https://tntxz.starsfire.top/tags/MC)[MC服务器](https://tntxz.starsfire.top/tags/MC%E6%9C%8D%E5%8A%A1%E5%99%A8)[Nas](https://tntxz.starsfire.top/tags/Nas)[Nuitka](https://tntxz.starsfire.top/tags/Nuitka)[Python](https://tntxz.starsfire.top/tags/Python)[主题修改](https://tntxz.starsfire.top/tags/%E4%B8%BB%E9%A2%98%E4%BF%AE%E6%94%B9)[技术记录](https://tntxz.starsfire.top/tags/%E6%8A%80%E6%9C%AF%E8%AE%B0%E5%BD%95)[推荐](https://tntxz.starsfire.top/tags/%E6%8E%A8%E8%8D%90)[教程](https://tntxz.starsfire.top/tags/%E6%95%99%E7%A8%8B)[科技](https://tntxz.starsfire.top/tags/%E7%A7%91%E6%8A%80)[踩坑](https://tntxz.starsfire.top/tags/%E8%B8%A9%E5%9D%91)[飞牛](https://tntxz.starsfire.top/tags/%E9%A3%9E%E7%89%9B)
归档
  * [2026年07月](https://tntxz.starsfire.top/archives/)1篇
  * [2026年02月](https://tntxz.starsfire.top/archives/)1篇
  * [2025年11月](https://tntxz.starsfire.top/archives/)4篇


友链
[星火](https://starsfire.top)[RhoPaper](https://blog.rhopaper.top)
自定义鼠标✓
