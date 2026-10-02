#  [汐涌及岸](https://coderxi.com/)
[ BLOG ](https://coderxi.com/)
[ 归档 ](https://coderxi.com/archives)[ 分类 ](https://coderxi.com/categories)[ 标签 ](https://coderxi.com/tags)
[ 友链 ](https://coderxi.com/links)
[ 我的 ](https://coderxi.com/about)
[ 关于我 ](https://coderxi.com/about)[ Github ](https://github.com/coderxi1)
![](https://coderxi.com/avatar.png)
汐涌及岸
* * *
[ BLOG ](https://coderxi.com/)
[ 归档 ](https://coderxi.com/archives)[ 分类 ](https://coderxi.com/categories)[ 标签 ](https://coderxi.com/tags)
[ 友链 ](https://coderxi.com/links)
[ 我的 ](https://coderxi.com/about)
[ 关于我 ](https://coderxi.com/about)[ Github ](https://github.com/coderxi1)
#  目录
  1. 红米k50线刷MIUI14+root记录
  2. [1. 前言](https://coderxi.com/posts/redmi-k50-root-note#%E5%89%8D%E8%A8%80)
  3. [2. 步骤](https://coderxi.com/posts/redmi-k50-root-note#%E6%AD%A5%E9%AA%A4)
    1. [2.1. 解BL锁](https://coderxi.com/posts/redmi-k50-root-note#%E8%A7%A3bl%E9%94%81)
    2. [2.2. 刷rom](https://coderxi.com/posts/redmi-k50-root-note#%E5%88%B7rom)
    3. [2.3. Magisk拿root权限](https://coderxi.com/posts/redmi-k50-root-note#magisk%E6%8B%BFroot%E6%9D%83%E9%99%90)
  4. [3. 后记](https://coderxi.com/posts/redmi-k50-root-note#%E5%90%8E%E8%AE%B0)
    1. [3.1. 刷欧版MIUI](https://coderxi.com/posts/redmi-k50-root-note#%E5%88%B7%E6%AC%A7%E7%89%88miui)
    2. [3.2. 折腾完被各种限制](https://coderxi.com/posts/redmi-k50-root-note#%E6%8A%98%E8%85%BE%E5%AE%8C%E8%A2%AB%E5%90%84%E7%A7%8D%E9%99%90%E5%88%B6)


#  最新文章 [ ](https://coderxi.com/)
  * [Win11此电脑下没有文件夹选项](https://coderxi.com/posts/toggle-folders-under-this-pc-in-windows-11/) 2025-07-09
  * [红米k50线刷MIUI14+root记录](https://coderxi.com/posts/redmi-k50-root-note/) 2025-03-13
  * [利用Cloudflare Worker自建短链接服务](https://coderxi.com/posts/url-shortener-with-cloudflare-worker/) 2025-02-11
  * [Astro博客中使用remark-markmap优雅的创建思维导图](https://coderxi.com/posts/remark-markmap-doc/) 2024-12-31
  * [Custom Astro Component Sample](https://coderxi.com/posts/custom-astro-component-sample/) 2024-07-29


#  红米k50线刷MIUI14+root记录
* * *
发表于 2025-03-13 修改于 2025-03-13 [其他](https://coderxi.com/categories/%E5%85%B6%E4%BB%96)丨[折腾记录](https://coderxi.com/categories/%E5%85%B6%E4%BB%96/%E6%8A%98%E8%85%BE%E8%AE%B0%E5%BD%95) 798 字 5 分钟
# 前言
之前是刷过一次MIUI13的，但是手贱开了一下系统自动更新把我的root搞没了，故又折腾了一遍。
**刷机有风险**
  * 请**务必备份重要数据** ，避免丢失。
  * 刷机有可能导致设备变砖，请**务必按照步骤操作** ，并确保下载的固件与设备型号匹配。


# 步骤
## 解BL锁
  * 首先是解锁BL锁，我已经解过了所以只是简单记录下（注意：现在解BL锁需要小米社区等级5） 
    * 打开开发者模式，`我的设备` → `全部参数与信息` → `连续点击MIUI版本`。
    * 到 <http://www.miui.com/unlock/index.html> 下载解锁工具，在Fastboot模式(按住 声音down + 开机按扭)下，连接到解锁工具。
    * 点解锁会提示等待168小时(7天)，7天后再点击解锁就可以了。


## 刷rom
  * 下载设备型号对应的 Fastboot 线刷包 
    * <https://xiaomirom.com> 搜索K50 （代号：rubens）
    * 我这里选择了 [V14.0.10.0.TLNCNXM](https://xiaomirom.com/rom/redmi-k50-rubens-china-fastboot-recovery-rom/#v140100tlncnxm-span-classbadge-badge-warningmiui14span-span-classbadge-badge-success130span)
  * 下载[小米刷机工具](https://xiaomirom.com/download-xiaomi-flash-tool-miflash/#%E4%B8%8B%E8%BD%BD%E5%B0%8F%E7%B1%B3%E5%88%B7%E6%9C%BA%E5%B7%A5%E5%85%B7)（MiFlash） 
    * 解压下载好的线刷包，打开MiFlash选择线刷包文件夹。
    * 手机进入Fastboot模式，MiFlash中点击加载设备
    * **右下角勾选`全部删除`** ，默认是全部删除并lock 你也不想被锁回去吧😈
    * 点击刷机，静待状态变为绿色的`success`，大概5分钟左右，(显示为红色的`error`也不要紧，这是由于bl锁的问题)  

    * 然后拔掉数据线，手机会自动开机（开机后提示本设备已被锁定也没关系，输入密码登录就好）


## Magisk拿root权限
  * 下载Magisk安装包 <https://github.com/topjohnwu/Magisk/releases/latest> 并安装
  * 从解压的下载好的线刷包的`/images/`文件夹中 复制 **`boot.img`**丢到手机里
  * 进入Magisk -> `Magisk安装` -> `选择并修补一个文件` 选择 `boot.img`
  * 修补好的img文件路径会输出在log里，复制到电脑上
  * 手机进入Fastboot模式，终端输入`fastboot devices`确认设备链接（fastboot命令需要安装adb，具体自行搜索）
  * 刷入修补好的img文件 

```


fastboot flash boot_ab <修补好的IMG文件路径>


```

boot_ab：代表a、b分区都刷入，图省事  
IMG文件路径示例：C:\Users\coderxi\Desktop\xxxxxx.img>


# 后记
## 刷欧版MIUI
  * 其实是想刷欧版MIUI的，但是Redmi K50只支持欧版MIUI13 版本比较低就作罢了。 
    * 要是刷的话，要确保要刷入的手机没有登陆小米账户，没有开启「找回手机」功能，然后拔下手机卡。
    * K50版本的MIUI13线刷包下载地址在 <https://sourceforge.net/projects/xiaomi-eu-multilang-miui-roms/files/xiaomi.eu/MIUI-STABLE-RELEASES/MIUIv13/> ，搜索rubens
    * 其他版本线刷包下载地址在 <https://xiaomi.eu/community/forums/rom-releases.103/>
    * 解压缩之后，在Fastboot模式下，点击压缩包里的windows_fastboot_first_install_with_data_format.bat既可
    * 激活手机需要连接能翻墙的Wifi。


## 折腾完被各种限制
  * 这大概是我最后一次折腾了，折腾完遇到了很多问题，单纯用shamiko绕不开 
    * 腾讯QQ检测到root冻结了账号 
    * 支付宝/铁路12306 无法刷脸  似乎是要用[Momo](https://github.com/apkunpacker/MagiskDetection/blob/main/Momo-v4.4.1.apk)检测后逐步修复，实在是懒得弄了，就这样吧


# 评论 2
昵称
邮箱
网址
* * *
#### 预览:
[](https://guides.github.com/features/mastering-markdown/ "Markdown Guide")
0  字
登录发布
![小黄脸](https://coderxi.com/emojis/%E5%B0%8F%E9%BB%84%E8%84%B8/icon.20x20.png)![2233娘](https://coderxi.com/emojis/2233%E5%A8%98/icon.50x50.png)![蛆音娘](https://coderxi.com/emojis/%E8%9B%86%E9%9F%B3%E5%A8%98/icon.50x50.png)
评论
  * 按正序
  * 按倒序
  * 按热度


Powered by [ Waline ](https://github.com/walinejs/waline) v3.4.2
Copyright © 2019 ~ 2025 By 汐涌及岸. All rights reserved. 
框架: Astro 5.2.5 框架Astro 5.2.5主题: Antares 1.0.0 主题Antares 1.0.0版权: BY-NC-SA 4.0 版权BY-NC-SA 4.0RSS RSSATOM ATOM
萌ICP备20210307号冀ICP备: 待重新备案 冀ICP备待重新备案
