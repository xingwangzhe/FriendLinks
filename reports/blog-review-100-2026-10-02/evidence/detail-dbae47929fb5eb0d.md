[ 雾时之森  ](https://fairysen.com/)
##### 雾时之森
![avatar](https://cravatar.cn/avatar/42e4d1e827479c50d7b31ee85ca70901)
## 蘑菇
Never give up your dreams.  
| 文章  | 评论  | 标签  |  
| --- | --- | --- |  
| 90  | 694  | 63  |  
  * [🌈 首页](https://fairysen.com/)
  * 🔥 文章
    * [💻 技术·编程](https://fairysen.com/category/code/)
    * [💽 软件·工具](https://fairysen.com/category/soft/)
    * [💭 杂谈·随记](https://fairysen.com/category/talk/)
    * [👋 日常·生活](https://fairysen.com/category/daily/)
  * [📂 归档](https://fairysen.com/archive/)
  * [📝 留言](https://fairysen.com/leave/)
  * [🍻 朋友](https://fairysen.com/friends/)
  * [❤️ 赞赏](https://fairysen.com/donate/)
  * 📌 关于
    * [👦 我?](https://fairysen.com/about/)
    * [📜 历史](https://fairysen.com/history/)
    * [📊 统计](https://stats.amogu.cn/share/0lAiA4gBHVx70UuW/fairysen.com)
    * [🌏 地图](https://fairysen.com/sitemap.xml)
  * [🚇 开往](https://www.travellings.cn/plain.html)


##### 搜点什么
点击搜索
### EasyTier 中心化组网全客户端部署指南
  * 技术
  * 2.7w阅读
  * 2025年08月18日
  * 10评论


![avatar](https://cravatar.cn/avatar/42e4d1e827479c50d7b31ee85ca70901)
## 蘑菇
Never give up your dreams.  
| 文章  | 评论  | 标签  |  
| --- | --- | --- |  
| 90  | 694  | 63  |  
最新回复
![好人](https://q1.qlogo.cn/g?b=qq&nk=3366836669&s=4)
好人  2026 年 05 月 17 日 
[ 请加我一下qq  ](https://fairysen.com/leave/#comment-864)
![michael](https://cravatar.cn/avatar/f96883a7c5101cbf70dea6b8ae88714f)
michael  2026 年 05 月 11 日 
[ 作者还在吗？  ](https://fairysen.com/leave/#comment-861)
![💵 +1.81919271764 Bitcoin Next 👉🏿 telegra.ph/Compensations-03-29?hs=1f3f01736f22ed445cc5fbc166899404& 💵](https://cravatar.cn/avatar/cd10da263273f18ae400516931ce42d1)
💵 +1.81919271764 Bitcoin Next 👉🏿 telegra.ph/Compensations-03-29?hs=1f3f01736f22ed445cc5fbc166899404& 💵  2026 年 04 月 01 日 
[ hj3gsm  ](https://fairysen.com/850.html#comment-804)
![🚿 Transfer 1.824222 BTC. Log In - yandex.com/poll/MHjpsbzYiRKpBEU48DzHgH?hs=1f3f01736f22ed445cc5fbc166899404& 🚿](https://cravatar.cn/avatar/8e606bcc867d8d5d265eb73c634a8fe3)
🚿 Transfer 1.824222 BTC. Log In - yandex.com/poll/MHjpsbzYiRKpBEU48DzHgH?hs=1f3f01736f22ed445cc5fbc166899404& 🚿  2026 年 02 月 28 日 
[ 2jb7a3  ](https://fairysen.com/850.html#comment-794)
![😩 Available Bitcoin. Next - yandex.com/poll/WRVjqbSX2yscgTuFhiPPi5?hs=b6331c36e54a56e8f0439016580f776c& 😩](https://cravatar.cn/avatar/5fc72e49103a06eb430b9a439d5f385a)
😩 Available Bitcoin. Next - yandex.com/poll/WRVjqbSX2yscgTuFhiPPi5?hs=b6331c36e54a56e8f0439016580f776c& 😩  2026 年 02 月 26 日 
[ t3lky8  ](https://fairysen.com/leave/#comment-793)
随便看看
[ ](https://fairysen.com/783.html)
[ 2022 年 05 月 03 日 海外服务器常用一键测试脚本 ](https://fairysen.com/783.html)
[ ](https://fairysen.com/307.html)
[ 2020 年 03 月 19 日 配了一台性能还算可以的主机 - 2019 ](https://fairysen.com/307.html)
[ ](https://fairysen.com/334.html)
[ 2020 年 05 月 27 日 WordPress博客展示你的Steam游戏库 ](https://fairysen.com/334.html)
[首页](https://fairysen.com/ "首页")
/ [技术](https://fairysen.com/category/code/ "技术") / 正文
AI摘要 
本文介绍 EasyTier 中心化组网全客户端部署指南。作者基于 ZeroTier 的经验，发现 EasyTier 的中心化组网方式更易上手，尤其适用于设备分散且需频繁网络变更的用户。本文详细阐述了使用两台服务器作为主备节点的部署方案，并简要提及了 FRP 的双重备份方案，弥补了 EasyTier 官网文档中中心化组网内容的不足。
本文
此内容根据文章生成，不代表个人观点，仅用于文章内容的解释与总结 
近期接触到一款新的组网工具 EasyTier，笔者此前一直通过[自建 Planet 服务](https://github.com/xubiaolin/docker-zerotier-planet)的 ZeroTier 实现异地组网。但这种方式存在明显短板：移动端体验糟糕 —— 官方移动端不支持修改 planet 文件，[安卓第三方客户端](https://github.com/kaaass/ZerotierFix)也早已停更；非移动端还需手动替换 planet 文件，操作颇为繁琐。
EasyTier 主打的去中心化组网，对设备数量不多的用户而言更简单高效，这部分内容在官网文档中已有较详尽的说明。
深入了解后发现，EasyTier 同样支持中心化组网，这对习惯了 ZeroTier 的用户来说无疑更易上手。笔者的设备分布较分散，若遇网络变更，逐台修改配置文件会严重影响效率，而通过中心化组网，可直接借助控制台下发配置，无需在每台设备上单独操作。
遗憾的是，官网文档中关于中心化组网的内容较为零散，缺乏系统详细的介绍。经过一天的研究与项目 issues 梳理，笔者总结出了这份部署教程。
## 准备工作
我计划用两台服务器作为主备节点，让其他组网设备同时连接这两个节点以实现冗余备份。当然，EasyTier 只是其中一种组网方式，另外我还通过 FRP 做了双重备份，这部分内容在此不做详述。
两台服务器分别是：
  * 腾讯云轻量锐驰型 2H4G 200M（以下简称为 gateway-cn）
  * 香港三网优化 4H4G 100M（以下简称为 gateway-hk）


为方便其他设备连接时无需记忆 IP，我给这两台服务器的 IP 分别绑定了域名，这里用 ez.cn.demo.net 和 ez.hk.demo.net 来示例。
## 部署中心服务
在部署时，我没有采用官方控制台，而是选择在 gateway-cn 上自建控制台。这样做的优势很突出：一来能使用简短的网络名称，不用担心和别人重复，二来可实现完全自主管理，避免受官方控制台故障的影响。不过目前自建控制台有个明显局限 ——**无法禁止其他用户注册** ，若他人知晓控制台地址，便能注册新用户（可以配置 Nginx 规则屏蔽注册路径），这一问题只能等待官方后续是否会提供支持了。
本部分部署将全程采用 Docker 方式，因此请大家提前自行安装好 Docker 环境。
先来看官方二进制文件说明：
  * easytier-core：这是 EasyTier 的核心程序。
  * easytier-cli：EasyTier 的管理程序，启动 easytier-core 后，可通过它查看虚拟网信息。
  * easytier-web：用于自建 EasyTier 的 Web 控制台后端，一般情况下无需自建，直接使用官方提供的 Web 控制台即可。
  * easytier-web-embed：功能和 easytier-web 相同，但内置了 Web 前端。


我们需要用到的是 `easytier-web-embed` 二进制文件，该文件已包含在官方容器中，只需修改官方容器的入口配置即可，通过 `--api-host` 参数可以指定前端的默认 API 接口。
[](https://img.amogu.cn/images/2025/08/18/Bq56.png)
接下来，需启动 easytier-core 作为服务节点。鉴于在同一台机器上进行部署，可通过 127.0.0.1 内网地址直接接入控制台。需特别注意，`--hostname` 参数用于配置控制台显示的主机名称。若未指定该参数，系统将默认获取机器的 `hostname`。截至 `v2.4.2` 版本，控制台仅支持修改组网网络列表中的显示名称，暂不支持修改控制台显示的主机名。因此，在部署过程中建议明确指定 `--hostname` 参数，以确保控制台显示信息的准确性与规范性。
[](https://img.amogu.cn/images/2025/08/18/BqHd.png)
以下为 EasyTier 节点部署所需的完整 docker-compose 配置文件。执行 `docker compose up -d` 命令后，服务将以守护进程模式启动。部署完成后，建议通过 Nginx 配置反向代理，并为管理控制台绑定域名，以实现安全、规范的访问。若需通过 IP 地址加端口的方式访问，可将配置文件中的 `127.0.0.1` 修改为 `0.0.0.0`，但此方式存在一定安全风险，从安全性角度考虑，仍推荐采用域名绑定方案。

```
# 生成一个 machine-id，防止设备 UUID 变更配置丢失
openssl rand -hex 16 | md5sum | awk '{print $1}' > ./easytier/machine-id

# docker-compose.yaml
# kinoko 是连接我控制台的用户名，gateway-cn 是我的设备名，请注意修改
services:
  easytier-web:
    image: easytier/easytier:latest
    container_name: easytier-web
    hostname: easytier-web
    restart: always
    entrypoint: easytier-web-embed
    command: --api-host https://你的控制台域名
    environment:
      - TZ=Asia/Shanghai
    ports:
      - "127.0.0.1:11211:11211"
      - "0.0.0.0:22020:22020/udp"
    volumes:
      - ./easytier/data:/app

  easytier-core:
    image: easytier/easytier:latest
    container_name: easytier-core
    hostname: easytier-core
    restart: always
    cap_add:
      - NET_ADMIN
      - NET_RAW
    devices:
      - /dev/net/tun:/dev/net/tun
    command: --config-server udp://127.0.0.1:22020/kinoko --hostname gateway-cn
    environment:
      - TZ=Asia/Shanghai
    network_mode: host
    volumes:
      - ./easytier/machine-id:/etc/machine-id:ro
    depends_on:
      - easytier-web
```

YAML
Copy
登录 EasyTier 控制台进行新用户注册操作，注册时请确保用户名与 `easytier-core` 容器配置的用户名完全一致。完成注册后，正常情况下，在控制台设备列表中即可查看到一台隶属于本地网络的设备，该设备名称与预先指定的 `hostname` 完全匹配。
### 配置服务节点
点击该设备进入配置界面，创建新网络的步骤如下：
  1. **基础设置**  
由于此设备仅作为服务节点，不参与实际组网，[无需配置 IP 地址](https://easytier.cn/guide/network/configurations.html)。
     * 设定网络名称（例如 `Skylink`）和对应密码
     * 网络模式选择「独立模式」
  2. **访问控制**
     * 若想限制仅特定网络使用该节点，可勾选「[启动私有模式](https://easytier.cn/guide/network/host-public-server.html)」，此时只有 `Skylink` 网络能接入（本质是[网络白名单为空](https://github.com/EasyTier/EasyTier/issues/1188)）。
     * 若需支持多个网络，可直接配置「网络白名单」，两者择一即可。
  3. **监听配置**  
默认监听地址为 `tcp://0.0.0.0:11010`、`udp://0.0.0.0:11010`、`wg://0.0.0.0:11010`，可按需修改：
     * 示例：这里我并未使用 WireGuard，所以删除了 `wg` 相关配置
     * 额外支持 `ws`/`wss` 协议连接，可根据需求添加
  4. **启动网络**  
其他参数可参考官网文档按需配置，完成后点击「运行网络」，节点将自动获取配置信息。


[](https://img.amogu.cn/images/2025/08/18/BECI.png)
使用云服务器时，要在安全组中放行对应的端口，其中 wg 协议使用 UDP 端口，ws 和 wss 协议则使用 TCP 端口，具体需根据实际配置的端口号来操作。
[](https://img.amogu.cn/images/2025/08/18/BEhN.png)
接下来部署 gateway-hk 节点，操作较为简便，直接启动下方对应的 docker-compose 文件即可。不过有两点需要留意，一是要固定好 `machine-id`，二是节点的各项配置可参考前面 gateway-cn 的设置来进行，确保配置的一致性和准确性。

```
# 生成一个 machine-id，防止设备 UUID 变更配置丢失
openssl rand -hex 16 | md5sum | awk '{print $1}' > ./easytier/machine-id

# docker-compose.yaml
# kinoko 是连接我控制台的用户名，gateway-hk 是我的设备名，ez.cn.demo.net 是我的控制服务器IP，请注意修改
services:
  easytier-core:
    image: easytier/easytier:latest
    container_name: easytier-core
    hostname: easytier-core
    restart: always
    cap_add:
      - NET_ADMIN
      - NET_RAW
    devices:
      - /dev/net/tun:/dev/net/tun
    command: --config-server udp://ez.cn.demo.net:22020/kinoko --hostname gateway-hk
    environment:
      - TZ=Asia/Shanghai
    network_mode: host
    volumes:
      - ./easytier/machine-id:/etc/machine-id:ro

```

YAML
Copy
## 安装各设备端
这里直接采用官方的 easytier-core 二进制文件即可，下载地址：<https://easytier.cn/guide/download.html>。下载完成后解压，即可得到二进制文件，其余文件可删除。截至本文发布时，由于当前版本（v2.4.2）的 GUI 程序不支持以中心化方式启动，且所有配置均通过控制台下发，因此无需使用 GUI 程序。
### Android
若设备已获取 root 权限，推荐使用官方提供的 Magisk 面具模块：
> 从 V2.4.3 开始，如果需要自定义启动参数，可以使用 [MT 管理器](https://mt2.cn/)将 `/data/adb/modules/easytier_magisk/config/command_args_sample` 重命名为 `command_args`，并修改其中内容，使用自定义启动参数时会忽略配置文件，无需修改模块文件。
  1. 下载模块后解压，找到并修改其中的 `easytier_core.sh` 文件，将对应部分替换为 `--config-server udp://ez.cn.demo.net:22020/kinoko --hostname Android`（需根据实际情况调整链接信息）。
[](https://img.amogu.cn/images/2025/08/18/BEWa.png)
  2. 按原文件层级重新打包为 zip 压缩包，在手机的 Magisk 软件中安装该模块（需重启一次手机），即可实现自动后台启动运行。
[](https://img.amogu.cn/images/2025/08/18/BEsQ.png)


若设备未 root，则需下载官方 GUI 程序，手动输入连接信息完成配置，具体操作可参考官网文档[手动组网](https://easytier.cn/guide/gui/manual.html)。
### iOS
目前尚未提供专用客户端，可参考 [WireGuard 接入教程](https://easytier.cn/guide/network/use-easytier-with-wireguard-client.html)，按照其中的步骤说明，通过 WireGuard 客户端完成接入操作。
### Windows
可以参考[官网文档](https://easytier.cn/guide/network/install-as-a-windows-service.html)，这里直接通过 Windows PowerShell（需管理员权限）操作，先下载对应系统的命令行程序压缩包，解压后将 `easytier_core.exe` 放置在任意目录（示例路径为 `D:\EasyTier`），然后以管理员身份打开终端，执行命令

```
# 开始菜单找到并右键以管理员身份打开 Windows PowerShell，Windows 10/11
# 使用 sc 命令创建系统服务，设为开机自启
sc.exe create EasyTierService binPath= "D:\EasyTier\easytier-core.exe --config-server udp://ez.cn.demo.net:22020/kinoko --hostname Windows" start= auto displayname= "EasyTier Service"

# 启动服务
sc.exe start EasyTierService

# 验证服务状态
# 或在「服务」面板中（按下 Win + R 输入 services.msc）查找 EasyTier Service，确认状态为「正在运行」。
sc.exe query EasyTierService

# 其他
sc.exe stop EasyTierService # 停止服务
sc.exe delete EasyTierService # 删除服务

```

Bash
Copy
### Linux
下载官方先下载官方的命令行程序，解压后可得到 easytier-core 二进制文件。启动时，在命令中加入`--config-server udp://ez.cn.demo.net:22020/kinoko --hostname Linux`（需根据实际情况调整链接信息），再将其注册为 Linux Systemd 服务即可，具体可参考[官方教程](https://easytier.cn/guide/network/install-as-a-systemd-service.html#%E5%B0%86%E6%9C%8D%E5%8A%A1%E5%AE%89%E8%A3%85%E4%B8%BA-linux-systemd-%E6%9C%8D%E5%8A%A1)。
这里为大家准备了一个脚本，兼容 CentOS、Debian、Ubuntu 等主流 Linux 发行版，能简化上述部署步骤，使用方法如下：

```
# 查看帮助信息
curl -sSL https://oss.amogu.cn/linux/deploy/net/easytier.sh | bash -s -- -h

# 安装部署（以用户名 kinoko、服务器地址 ez.cn.demo.net:22020、主机名 Linux 为例）
curl -sSL https://oss.amogu.cn/linux/deploy/net/easytier.sh | bash -s -- -u kinoko -s ez.cn.demo.net:22020 -n Linux

# 卸载服务
curl -sSL https://oss.amogu.cn/linux/deploy/net/easytier.sh | bash -s -- -x
```

Bash
Copy
该脚本会自动检测系统架构、网络位置（判断是否需要代理下载），并完成 easytier-core 的下载、安装及 Systemd 服务配置，无需手动处理复杂步骤。
### macOS
以下操作需要在终端进行

```
# 安装 serviceman
curl -sS https://webi.sh/serviceman | sh; \
source ~/.config/envman/PATH.env

# 下载对应系统架构的包，解压得到 easytier-core 文件
# 拷贝文件到系统的 /usr/local/bin/ 目录下（需要输入用户密码）
sudo cp ./easytier-core /usr/local/bin/

# 注册 easytier 为系统服务（serviceman add --help）
# udp://ez.cn.demo.net:22020/kinoko 根据实际情况调整
serviceman add --name easytier \
    --daemon \
    --user root --group wheel \
    --workdir /usr/local/bin \
    -- easytier-core --config-server udp://ez.cn.demo.net:22020/kinoko --hostname MacBook
```

Bash
Copy
### OpenWrt
官方支持 OpenWrt 插件，但需要自行编译。具体操作如下：先 fork [luci-app-easytier](https://github.com/EasyTier/luci-app-easytier) 插件仓库，然后利用 GitHub Actions 进行编译。编译完成后，找到与自身设备架构对应的插件，在路由器后台完成安装，详细步骤可参考《[EasyTier 在 openwrt 上部署教程【保姆级教程】](https://blog.csdn.net/qq_39736559/article/details/149099358)》。
安装完成后，需配置连接控制台：打开插件设置页面，将启动方式改为「Web 配置」，输入你的 Web 服务器地址和主机名，其他设置保持默认即可。
[](https://img.amogu.cn/images/2025/08/18/BO7x.png)
## 配置设备节点
完成设备端程序安装后，不出意外的话，控制台中会显示多个已接入设备。接下来需要为每个设备配置网络以实现组网，以下以其中一个设备的基础配置为例进行说明，其他高级操作可参考官网文档，其操作逻辑与[图形界面（GUI）组网](https://easytier.cn/guide/gui/)基本一致。
[](https://img.amogu.cn/images/2025/08/18/BIB8.png)
首先为客户端创建网络：IP 地址采用手动分配（便于记忆），此处示例使用 10.199.1.0/22 网段；网络名称和密码需与 gateway-cn、gateway-hk 两台服务器的配置保持一致，确保设备能加入同一虚拟网络。同理，也可创建多个网络以实现更复杂的拓扑结构。
由于采用一主一备两个服务节点（主机 IP 分别为 ez.cn.demo.net 和 ez.hk.demo.net），网络方式需选择「手动」，并分别添加这两个节点（协议类型根据服务端节点的设定选择，支持 tcp、ws、wss、wg 等）。
接着进行高级设置：
  * 若不希望网络被他人使用，可设置监听地址、开启网络白名单或启用私有模式；
  * 如需要代理局域网内设备，需将局域网网段填入「子网代理」中（参考[官网文档](https://easytier.cn/guide/network/point-to-networking.html)）；
  * 开启「自定义路由」（参考[手工指定路由](https://easytier.cn/guide/network/point-to-networking.html#%E6%89%8B%E5%B7%A5%E6%8C%87%E5%AE%9A%E8%B7%AF%E7%94%B1)），并保持下方配置项为空。若不开启自定义路由，子网代理信息会自动同步到虚拟网络的所有节点，节点会自动配置相应路由；留空则便于后续进行自定义配置。


[](https://img.amogu.cn/images/2025/08/18/BOwl.png)
完成上述设置后启动网络，在该设备的网络列表中即可查看其他设备的连接信息。
[](https://img.amogu.cn/images/2025/08/18/BOGo.png)
注意：若 OpenWrt 设备需要通过子网访问，需开启「系统转发」功能；若与 OpenClash 插件配合使用时出现异常，可尝试关闭「仅使用物理网卡」选项。
## 总结
以上介绍的便是中心化组网的方法，笔者使用下来发现它能完美替代 ZeroTier 的所有功能。顺便提一下，按照官网描述，似乎可以通过 easytier-web 自建 API 后端，再自行开发前端界面，不过目前官方尚未提供 API 文档，期待后续项目更新能补充这部分内容。
[网络](https://fairysen.com/tag/%E7%BD%91%E7%BB%9C/)
版权属于：蘑菇
本文链接：https://fairysen.com/850.html
作品采用 [ 知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议 ](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-Hans)进行许可 
[ GCP 谷歌云抢占式实例自动开机脚本 « 上一篇 ](https://fairysen.com/850.html)
[ 已经没有了 下一篇 » ](https://fairysen.com/850.html)
评论区 
![头像](https://fairysen.com/usr/themes/Cuteen/static/img/avatar.svg)
✪ω✪
提交评论
![头像](https://cravatar.cn/avatar/cd10da263273f18ae400516931ce42d1)
[💵 +1.81919271764 Bitcoin Next 👉🏿 telegra.ph/Compensations-03-29?hs=1f3f01736f22ed445cc5fbc166899404& 💵](https://telegra.ph/Compensations-03-29)  

2026年4月1日 09:38
[回复](https://fairysen.com/850.html?replyTo=804#respond-post-850) [取消](https://fairysen.com/850.html#respond-post-850)
hj3gsm
![头像](https://cravatar.cn/avatar/8e606bcc867d8d5d265eb73c634a8fe3)
[🚿 Transfer 1.824222 BTC. Log In - yandex.com/poll/MHjpsbzYiRKpBEU48DzHgH?hs=1f3f01736f22ed445cc5fbc166899404& 🚿](https://yandex.com/poll/MHjpsbzYiRKpBEU48DzHgH)  

2026年2月28日 20:49
[回复](https://fairysen.com/850.html?replyTo=794#respond-post-850) [取消](https://fairysen.com/850.html#respond-post-850)
2jb7a3
![头像](https://cravatar.cn/avatar/bb1f9d297ff5f00e88a34880aa789793)
zhyc998  

2025年11月30日 00:21
[回复](https://fairysen.com/850.html?replyTo=750#respond-post-850) [取消](https://fairysen.com/850.html#respond-post-850)
大佬好，下面这个文件老是报yml语法错误： 生成一个 machine-id，防止设备 UUID 变更配置丢失  
openssl rand -hex 16 | md5sum | awk '{print $1}' > ./easytier/machine-id
docker-compose.yamlkinoko 是连接我控制台的用户名，gateway-cn 是我的设备名，请注意修改
services:  
easytier-web:
image: easytier/easytier:latest container_name: easytier-web hostname: easytier-web restart: always entrypoint: easytier-web-embed command: --api-host https://你的控制台域名 environment: - TZ=Asia/Shanghai 
![头像](https://cravatar.cn/avatar/42e4d1e827479c50d7b31ee85ca70901)
[蘑菇](https://fairysen.com)  

2025年12月03日 18:56
[回复](https://fairysen.com/850.html?replyTo=751#respond-post-850) [取消](https://fairysen.com/850.html#respond-post-850)
[@zhyc998](https://fairysen.com/850.html#comment-750)
services: 及以下才是yaml文件，不要复制上面的，看下注释
![头像](https://cravatar.cn/avatar/c167a9285baf3ecbcddc7c6eb22453cc)
[dawn-lc](https://dawnlc.me)  

2025年11月19日 22:44
[回复](https://fairysen.com/850.html?replyTo=745#respond-post-850) [取消](https://fairysen.com/850.html#respond-post-850)
server { server_name example.com; listen 80; return 302 https://$http_host$request_uri$is_args$query_string; } server { server_name example.com; listen 443 quic; listen 443 ssl; ssl_certificate /certificate/example.com.pem; ssl_certificate_key /certificate/example.com.privkey.pem; location / { proxy_pass http://localhost:11211; proxy_set_header HOST $host; proxy_set_header X-Forwarded-Proto $scheme; proxy_set_header X-Real-IP $remote_addr; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; } location /api/v1/auth/register { return 444; } location /easytier.png { return 200; } }
禁止其他用户注册用nginx过滤一下就行
![头像](https://cravatar.cn/avatar/c167a9285baf3ecbcddc7c6eb22453cc)
[dawn-lc](https://dawnlc.me)  

2025年11月19日 23:39
[回复](https://fairysen.com/850.html?replyTo=747#respond-post-850) [取消](https://fairysen.com/850.html#respond-post-850)
[@dawn-lc](https://fairysen.com/850.html#comment-745)
另外自建控制台配置保存在运行目录下的et.db中是sqlite，建议创建一个其他名称的用户，然后找个sqlite编辑器把默认的那两个用户（admin、user）删掉。
![头像](https://cravatar.cn/avatar/c167a9285baf3ecbcddc7c6eb22453cc)
[dawn-lc](https://dawnlc.me)  

2025年11月19日 23:25
[回复](https://fairysen.com/850.html?replyTo=746#respond-post-850) [取消](https://fairysen.com/850.html#respond-post-850)
[@dawn-lc](https://fairysen.com/850.html#comment-745)
另外Windows的安装脚本我重写了  
https://github.com/dawn-lc/EasyTier/blob/dawn-lc-update/script/install.cmd
![头像](https://q1.qlogo.cn/g?b=qq&nk=1948863412&s=4)
醒梦  

2025年10月29日 18:21
[回复](https://fairysen.com/850.html?replyTo=733#respond-post-850) [取消](https://fairysen.com/850.html#respond-post-850)
准备按大佬的流程自建完整的带web的控制台，然后发现注册的验证码图裂了，查看发现默认是80端口  
http://域名/api/v1/auth/captcha，不知道怎么解决
![头像](https://cravatar.cn/avatar/42e4d1e827479c50d7b31ee85ca70901)
[蘑菇](https://fairysen.com)  

2025年10月29日 19:51
[回复](https://fairysen.com/850.html?replyTo=734#respond-post-850) [取消](https://fairysen.com/850.html#respond-post-850)
[@醒梦](https://fairysen.com/850.html#comment-733)
检查下 --api-host 后面的域名，如果端口不是默认的，需要加上端口，比如：--api-host http://38.5.5.5:11211
![头像](https://q1.qlogo.cn/g?b=qq&nk=1948863412&s=4)
醒梦  

2025年11月05日 08:51
[回复](https://fairysen.com/850.html?replyTo=740#respond-post-850) [取消](https://fairysen.com/850.html#respond-post-850)
[@蘑菇](https://fairysen.com/850.html#comment-734)
感谢可以了，加上端口就行了不然默认是80


© 2026 [雾时之森](https://fairysen.com/)
[ 苏ICP备20024928号-3](https://beian.miit.gov.cn/#/Integrated/index)
Powered by [Typecho](http://typecho.org) ※ Theme is [Cuteen](https://blog.zwying.com)
