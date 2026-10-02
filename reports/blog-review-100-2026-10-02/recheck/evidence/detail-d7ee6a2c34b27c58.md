[Skip to content](https://qing.su/article/automated-email-content-summary-stalwart.html#content "Skip to content")
Search for:
[香菇肥牛的博客](https://qing.su/)
Menu
  * [首页](https://qing.su)
  * [Linux新手教程](https://qing.su/article/automated-email-content-summary-stalwart.html)
    * [[新手教程]为Linux服务器设置主机名](https://qing.su/how-to-set-hostname)
    * [[新手教程]Linux更改SSH登录端口](https://qing.su/change-ssh-port)
    * [[新手教程]Linux设置允许root账户登录SSH](https://qing.su/linux-enable-ssh-root-login)
  * [邮件服务器系列教程](https://qing.su/mailservers)
  * [站长小工具](https://qing.su/article/automated-email-content-summary-stalwart.html)
    * [服务器内核参数一键优化](https://qing.su/sysctl)
    * [邮箱在线迁移工具](https://migration.webmail.love)
    * [香菇肥牛图床](https://tu.ax)
  * [个人开源项目](https://github.com/Har-Kuun/)
    * [一键搭建高性能的CDN节点服务器](https://qing.su/article/oneclick-cdn.html)
    * [一键安装可以使用浏览器访问的Linux桌面环境](https://qing.su/article/oneclick-desktop.html)
    * [Youtube音乐批量下载器](https://github.com/Har-Kuun/Youtube-Music-Downloader)
    * [用C语言写的全自动国别域名扫描器](https://qing.su/article/namebot.html)
  * [在线玩游戏](https://qing.su/game)
  * [关于香菇肥牛](https://qing.su/aboutme)


# 在邮件服务器中实现给收到的邮件自动生成AI总结
05/10/2025 by [香菇肥牛](https://qing.su/article/author/shc "View all posts by 香菇肥牛")
大家好！今天我给自己的邮件服务器添加了一个功能，可以给收到的邮件自动添加AI智能总结，这里简单做个分享，如果有需要的小伙伴们欢迎自行取用。
> 项目地址：<https://github.com/Har-Kuun/mail-summarizer-stalwart>
本文作者为香菇肥牛，原文链接为 <https://qing.su/article/automated-email-content-summary-stalwart.html>, 转载请注明原文链接。谢谢！
* * *
## 1. 邮件内容AI自动总结的服务器端实现方式
在服务器端实现邮件内容的AI自动总结其实并不困难。众所周知，SMTP入信流程分为下面的几个阶段：Connection, EHLO, AUTH, MAIL FROM, RCPT TO, DATA 以及最后的投递。其中，邮件的正文内容是在DATA阶段进行传递的。因此，我们只需要在DATA阶段截住入信，将内容请求API获得总结，并且将生成的AI总结添加到邮件正文内容的头部即可。
[![](https://qing.su/article/automated-email-content-summary-stalwart.html)](https://qing.su/wp-content/uploads/2025/05/example_summary_2-w.png)
对于传统的邮件服务器，比如基于Sendmail或者Postfix的各类邮件服务器，邮件正文内容的修改可以通过Milter协议实现。这里贴一个基于Python的Milter库 <https://pymilter.org/>，如果读者感兴趣，可以自行实现这个功能。
如果您和我一样使用的是[Stalwart Mail Server](https://github.com/stalwartlabs/mail-server), 那么Stalwart提供了基于HTTP协议的MTA Hook功能，可以更方便地实现DATA stage的内容修改。如果您想尝试Stalwart Mail Server, 可以参考我的部署教程 <https://qing.su/article/stalwart-mail-single-server-nginx.html>
* * *
## 2. Stalwart MTA Hook简介
Stalwart邮件服务器提供了[基于HTTP协议的MTA Hook功能](https://stalw.art/docs/api/mta-hooks/overview)。在SMTP的任何一个阶段，都可以用JSON格式向服务器提交一个POST请求，请求的内容包括邮件的各headers, content, meta data, 等等。
服务器接收到这个POST请求后，可以分析收到的JSON报文的内容，并且按照规定的格式返回对于收到的邮件的任何修改。这个功能给我们提供了处理邮件的极大的自由度。
比如，我们可以使用MTA-Hook修改邮件内容的功能，如果检测到附件包含病毒，就删除这个附件，从而实现邮件杀毒的功能。
再比如，使用MTA-Hook修改邮件头的功能，可以实现基于SRS的自动转发。
因此，在DATA阶段，我们使用MTA Hook截取邮件的内容，在邮件正文的开头添加AI总结，再将修改后的邮件正文回传给邮件服务器，就实现了给收到的邮件自动生成AI总结的功能。
* * *
## 3. 具体的实现与使用方法
这里，我直接用最简单的PHP写了一个MTA Hook, 实现了邮件自动添加AI总结，具体的代码我就不贴出来了，您可以去我的Github (<https://github.com/Har-Kuun/mail-summarizer-stalwart>) 查看，也欢迎星星叉叉。使用之前请填入您自己的API, 并且按照自己的需求修改提示词（比如，如果您需要生成中文的总结，就需要相应地修改提示词）。
如果您需要自行用其他语言实现，需要注意的有以下几点。
(1) 入信与出信的区分。对于MTA来说，本身并不能直接区分邮件是收信还是入信。显然，我们不希望给发出去的邮件添加自动AI总结，因此需要在MTA Hook中判断待处理的邮件是收信还是入信。判断的方式很多，比如收信地址、发信IP、验证信息等等。
(2) Plain Text与HTML邮件的区分。收到的邮件可能是基于Plain Text的，也可能是基于HTML的，需要使用不同的方式添加生成的AI总结。
写好MTA Hook之后，直接在Stalwart中接入，就完成了这个全自动的收信AI智能总结啦。
[![](https://qing.su/article/automated-email-content-summary-stalwart.html)](https://qing.su/wp-content/uploads/2025/05/stalwart-mta-hooks-settings-w.png)
下面是中文总结的示例。
[![](https://qing.su/article/automated-email-content-summary-stalwart.html)](https://qing.su/wp-content/uploads/2025/05/example_summary_3-w.png)
* * *
至此，我们通过MTA Hooks, 实现了入信邮件自动添加AI总结的功能。
如果您有任何疑问，欢迎在这里留言，我将尽力解答。
本文作者为香菇肥牛，原文链接为 <https://qing.su/article/automated-email-content-summary-stalwart.html>, 转载请注明原文链接。谢谢！
Categories [AI服务、资源与教程](https://qing.su/category/ai-services), [脚本与程序](https://qing.su/category/scripts) Tags [AI](https://qing.su/tag/ai), [MTA Hook](https://qing.su/tag/mta-hook), [SMTP](https://qing.su/tag/smtp), [Stalwart Mail Server](https://qing.su/tag/stalwart-mail-server), [大语言模型](https://qing.su/tag/llm)
[在Linux服务器中部署Kasm Workspace云端工作站](https://qing.su/article/browser-access-kasm-workspace.html)
[使用imapsync迁移与自动备份邮箱](https://qing.su/article/email-migration-backup-with-imapsync.html)
## 2 thoughts on “在邮件服务器中实现给收到的邮件自动生成AI总结”
  1. ![](https://qing.su/article/automated-email-content-summary-stalwart.html)
[365cent](https://rt.http3.lol)
[ 05/21/2025 at 11:18  ](https://qing.su/article/automated-email-content-summary-stalwart.html#comment-162684)
看上去不错，感谢分享
[Reply](https://qing.su/article/automated-email-content-summary-stalwart.html?replytocom=162684#respond)
  2. ![](https://qing.su/article/automated-email-content-summary-stalwart.html)
[codex中转站](https://anyaigc.com/)
[ 07/29/2026 at 12:35  ](https://qing.su/article/automated-email-content-summary-stalwart.html#comment-192946)
这个思路不错，用MTA Hook在DATA阶段拦截邮件然后修改内容确实比传统的Milter方案简洁多了。不过Plain Text和HTML邮件的处理逻辑应该会比较复杂吧？
[Reply](https://qing.su/article/automated-email-content-summary-stalwart.html?replytocom=192946#respond)


### Leave a Comment [Cancel reply](https://qing.su/article/automated-email-content-summary-stalwart.html#respond)
Comment
Name Email Website
## 朋友们的网站
[kvm.la](http://www.kvm.la/) | [HHTjim'S 部落格](http://www.hhtjim.com/) | [Madlaxcb的杂物房](http://madlax.pw/) | [EQblog](https://eqblog.com/) | [Eason Yang's Blog](https://easonyang.com/) | [Leonn的博客](https://liyuans.com/) | [阿七's Blog](https://www.aptx4869.org/) | [Mr. KevinH](https://www.mrkevin.net/) | [Ryan's Blog](https://blog.iplayloli.com/) | [凤梨酥](https://fengli.su/) | [主机搜](https://zhujisou.com/) | [开发说](https://www.kaifashuo.com/) | [无糖的小宇宙](https://sugarless.cn) | [邮件人](https://www.mailer.su/) | [九月的风](https://sep.cc/) | [小可の聚集地](https://keke.su/)
© 2025 香菇肥牛的博客 | [Mastodon Scott[@]space.ax](https://space.ax/@scott)
[ ](https://qing.su/article/automated-email-content-summary-stalwart.html "Scroll back to top")
