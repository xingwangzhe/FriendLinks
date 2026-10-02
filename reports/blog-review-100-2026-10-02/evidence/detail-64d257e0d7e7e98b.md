[Back](https://www.gmero.com/)
# 每次装 Windows 时都必装的软件 
[gmero](https://www.gmero.com) · Apr 4, 2026
  * [Scoop - Github](https://www.gmero.com/posts/2026/0404-those-softs-i-always-installed-on-win/#scoop---github)
  * [其他软件](https://www.gmero.com/posts/2026/0404-those-softs-i-always-installed-on-win/#%E5%85%B6%E4%BB%96%E8%BD%AF%E4%BB%B6)


由于工作/学习需要, 我重装系统的次数非常多, 我一般使用网上搜集到的精简后的系统镜像, 极大的缩短了安装时间, 每次重装完都得装一下必备的软件, 这里记录一下, 方便以后重装系统时不需要一个一个搜索了
## Scoop - [Github](https://github.com/ScoopInstaller/Install#readme)
我的大部分编程环境以及一些工具都用 Scoop 来安装, 可以用下面的命令快速安装, 这里我一般只在虚拟机或者工控机那些不需要在意软件安装位置, 或者没有需要经常重装系统的计算机上运行

```
# 先设置 PowerShell 的执行策略, 以允许运行脚本
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# 方法一: 直接安装 Scoop
irm get.scoop.sh | iex
# 或者用镜像
irm https://gh-proxy.com/https://raw.githubusercontent.com/scoopinstaller/install/master/install.ps1 | iex

# 方法二: 管理员身份安装, 如果你的系统只有管理员账号用这个
iex "& {$(irm get.scoop.sh)} -RunAsAdmin"

```

但如果在个人电脑上安装, 还是得指定一下安装位置会更加优雅, 也方便如果重装系统, 能直接恢复软件

```
# 方法一: 手动下载脚本安装
irm get.scoop.sh -outfile 'install.ps1'
# 可以获取支持的参数
.\install.ps1 -?
# 软件全部安装到 D 盘, 也可以安装到其他盘符, 注意这里路径必须是绝对路径
.\install.ps1 -ScoopDir 'D:\Scoop' -ScoopGlobalDir 'D:\GlobalScoopApps' -NoProxy

# 方法二: 一行命令
iex "& {$(irm get.scoop.sh)} -ScoopDir 'D:\Scoop' -ScoopGlobalDir 'D:\GlobalScoopApps' -NoProxy"
# 用镜像
iex "& {$(irm https://gh-proxy.com/https://raw.githubusercontent.com/scoopinstaller/install/master/install.ps1)} -ScoopDir 'D:\Scoop' -ScoopGlobalDir 'D:\GlobalScoopApps' -NoProxy"

```

然后设置国内 bucket [scoop-cn](https://github.com/duzyn/scoop-cn), 安装一些常用的工具/程序

```
# 必备: 安装 Git, 因为 Scoop 是基于 Git 来管理软件的, 没有 Git 就无法正常使用 Scoop
scoop install git
# 可选: 替换为 scoop-cn, 这一个 bucket 包含了同时包含了 Scoop 官方的十个应用库：main、extras、versions、nirsoft、sysinternals、php、nerd-fonts、nonportable、java、games（可使用命令 scoop bucket known 查看），用一个库包含了各家的库，用户不用在多个地方搜索应用
scoop bucket rm main
scoop bucket add main https://gh-proxy.com/https://github.com/duzyn/scoop-cn.git

# 安装一些开发环境, rust 建议用官方脚本安装
scoop install sudo nodejs-lts go python zig

```

## 其他软件
  * winrar <https://www.mefcl.com/winrar.html>
  * Revo uninstaller pro <https://www.mefcl.com/revo-uninstaller-pro.html>
  * 微信 <https://pc.weixin.qq.com/>
  * QQ <https://im.qq.com/>
  * Office365 <https://m365.cloud.microsoft/apps/>
  * Onedrive <https://www.onedrive.com/download>
  * Jetbrains <https://softs.sxl.cc/jb>
  * Vmware Workstation <https://softs.sxl.cc/vm>


[#Windows](https://www.gmero.com/tags/windows/) [#软件](https://www.gmero.com/tags/%E8%BD%AF%E4%BB%B6/) [#推荐](https://www.gmero.com/tags/%E6%8E%A8%E8%8D%90/)
[我的 GitHub 账号被封了 ](https://www.gmero.com/posts/2026/0327-github-account-is-flagged-as-spam/ "我的 GitHub 账号被封了")
Themed by [Mori](https://www.gmero.com/ "0.3.0+1787022645965")
Light Dark
[皖ICP备20010301号](https://beian.miit.gov.cn/ "已备案") [皖公网安备34082702340940号](http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=34082702340940 "公安备案")
