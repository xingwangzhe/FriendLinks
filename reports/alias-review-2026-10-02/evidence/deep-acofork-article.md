工作区
  * [首页](https://www.acofork.com/)
  * [博客](https://www.acofork.com/posts/)
  * [AI 绘图](https://www.acofork.com/create/)
  * [LLM API](https://www.acofork.com/llm/)
  * [交互小说](https://www.acofork.com/novels/)
  * [游戏](https://www.acofork.com/games/)
  * [工具集](https://www.acofork.com/tools/)
  * [公告未读](https://www.acofork.com/announcements/)


更多
  * [连接](https://www.acofork.com/links/)
  * [文件](https://www.acofork.com/files/)
  * [课程表](https://www.acofork.com/timetable/)
  * [游戏资讯](https://www.acofork.com/game-news/)
  * [追番](https://www.acofork.com/anime/)
  * [Galgame](https://www.acofork.com/galgame/)
  * [旧站归档](https://www.acofork.com/archives/)
  * [状态](https://status.2x.nz/)
  * 反馈


  * [钱包](https://www.acofork.com/wallet/)
  * [账号](https://www.acofork.com/account/)


[皖ICP备2025099787号-2](https://beian.miit.gov.cn/ "皖ICP备2025099787号-2")Designed by ClaudeLogo by WalkerKiller
博客
返回博客
2026-06-12·523 字
# 迁移Linux到新硬盘
从旧硬盘迁移Linux到新硬盘，包括硬盘对拷、UUID修复、GRUB引导重建和fstab更新
服务器
* * *
![](https://www.acofork.com/posts/move-linux/)![](https://raw-blog.acofork.com/img/move-linux-cover7.webp)
## 第一步：硬盘对拷
将新旧硬盘都接入目标作业系统，并插入PE U盘，进入WinPE（FirPE）
打开DiskGenius，启动硬盘对拷，将旧盘的所有数据对拷进新盘，如有需要，可将Linux主分区扩容
![](https://raw-blog.acofork.com/img/move-linux-diskgenius-clone.webp)
## 第二步：迁移硬盘分区UUID
> 由于Linux启动的时候认硬盘的UUID。由于我们刚刚进行了硬盘对拷，则会将Linux在曾经创建的分区UUID映射一并拷贝过来，但新硬盘中新的分区自身的UUID不会改变。所以我们需要临时外挂一个Linux系统来chroot进原系统，然后迁移UUID
接下来，重启，进入Ubuntu Server 安装镜像。进入安装向导界面
按 `Alt+F2` 进入命令行界面，输入 `sudo -i` 切换为 `root` 用户
bash

```
sudo -i
```

查看新硬盘的分区信息
bash

```
lsblk -f
```

挂载根分区和EFI分区
bash

```
mount /dev/nvme0n1p2 /mnt
mount /dev/nvme0n1p1 /mnt/boot/efi
```

## 第三步：更新UUID
chroot 进入原系统
bash

```
mount --bind /dev /mnt/dev
mount --bind /proc /mnt/proc
mount --bind /sys /mnt/sys
chroot /mnt
```

更新 grub 引导和 initramfs
bash

```
update-grub
update-initramfs -u
```

## 第四步：更新 fstab
查看当前分区 UUID
bash

```
blkid
```

编辑 `/etc/fstab`，将旧的 UUID 替换为新的
bash

```
nano /etc/fstab
```

## 第五步：重启验证
bash

```
exit
umount -R /mnt
reboot
```

重启后确认系统正常启动，所有分区正确挂载。
## 思考
### 为什么要迁移 UUID？
Linux 系统通过 `/etc/fstab` 文件记录每个分区的 UUID 来挂载。硬盘对拷后，旧盘的 fstab 里仍然是旧盘的 UUID。如果直接启动，内核找不到对应 UUID 的分区，会进入 emergency mode。
### 为什么不用 dd？
dd 是逐扇区拷贝，包括空扇区。对于不同容量的新旧硬盘，dd 需要额外处理分区表。DiskGenius 的对拷功能更智能，只拷贝有效数据，且能自动调整分区大小。
## 目录
  * [第一步：硬盘对拷](https://www.acofork.com/posts/move-linux/#%E7%AC%AC%E4%B8%80%E6%AD%A5-%E7%A1%AC%E7%9B%98%E5%AF%B9%E6%8B%B7)
  * [第二步：迁移硬盘分区UUID](https://www.acofork.com/posts/move-linux/#%E7%AC%AC%E4%BA%8C%E6%AD%A5-%E8%BF%81%E7%A7%BB%E7%A1%AC%E7%9B%98%E5%88%86%E5%8C%BAuuid)
  * [第三步：更新UUID](https://www.acofork.com/posts/move-linux/#%E7%AC%AC%E4%B8%89%E6%AD%A5-%E6%9B%B4%E6%96%B0uuid)
  * [第四步：更新 fstab](https://www.acofork.com/posts/move-linux/#%E7%AC%AC%E5%9B%9B%E6%AD%A5-%E6%9B%B4%E6%96%B0-fstab)
  * [第五步：重启验证](https://www.acofork.com/posts/move-linux/#%E7%AC%AC%E4%BA%94%E6%AD%A5-%E9%87%8D%E5%90%AF%E9%AA%8C%E8%AF%81)
  * [思考](https://www.acofork.com/posts/move-linux/#%E6%80%9D%E8%80%83)
  * [为什么要迁移 UUID？](https://www.acofork.com/posts/move-linux/#%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E8%BF%81%E7%A7%BB-uuid)
  * [为什么不用 dd？](https://www.acofork.com/posts/move-linux/#%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E7%94%A8-dd)


## 评论
登录本站账号即可发表评论。[登录 / 注册](https://www.acofork.com/account/?next=%2Fposts%2Fmove-linux%2F%23blog-comments)
当前章节第一步：硬盘对拷
## 站点有更新
有奖反馈 · 2026-10-02
### 全民找洞！来就给钱！
新版网站已经完全落地，UI 全部手动重写过，因此可能还藏着一些体验上的小 bug。欢迎大家一起找问题！
  * 不管是文字偏了、图标错位，还是布局坏了、交互不顺，都欢迎通过任意方式联系我反馈。
  * 只要反馈的 bug 经核实并且完成修复，就给予 5～50 元现金奖励，也可以转为站点内的积分。
  * 反馈时可以附上截图、页面地址和复现步骤，方便我定位并修复问题。


![修复前：文字被截断，卡片布局异常](https://www.acofork.com/announcements/bug-bounty-before.png)修复前：文字被截断，卡片布局异常![修复后：文字与卡片布局恢复正常](https://www.acofork.com/announcements/bug-bounty-after.png)修复后：文字与卡片布局恢复正常
小问题也值得反馈，下面这组修复前后对比就是例子。
查看全部公告知道了
