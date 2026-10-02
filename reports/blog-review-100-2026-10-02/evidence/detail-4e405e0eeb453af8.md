|  ![](http://st.auiou.com/g/a.gif) [订阅本博客](http://www.auiou.com/feed/)  |   | [![](http://st.auiou.com/g/rss.gif)](http://www.auiou.com/feed/)  |   |  ![](http://st.auiou.com/g/a.gif) [如何订阅博客？](http://www.auiou.com/relevant/00001470.jsp)  |  
| --- | --- | --- | --- | --- |  
[![](http://st.auiou.com/g/l.gif)](http://www.auiou.com/)
[Blog首页](http://www.auiou.com/)[关于作者](http://www.auiou.com/about/)[Blog存档](http://www.auiou.com/archives/)[联系自由勇](http://www.auiou.com/contact/)[网站地图](http://www.auiou.com/sitemap/)
[这一次的程序设计速度和防攻思路](http://www.auiou.com/relevant/00002210.jsp)
![](http://st.auiou.com/g/1.gif) [王志勇](http://www.auiou.com) 发表于 2026年10月02日 09:15
(本文含最新作品，部分程序截图的珍贵留念，含VPS自动“软关机”的关键语句，防止超大规模的攻击) 这一次其实是日常的开发速度，说快就很快，说慢也慢。所不同的是，这次实现的功能十分特殊：**实现一个防止DDoS攻击的特大工程** 。没想到3天的时间，就完成了，**都是手工编程，这种功能不可能由AI实现** ，因为AI编程无法做到那样细致，有很多细节必须人工完成。除去数据库部分，主体的程序文件目前仅3.08K，这几天又改了很多次。这个程序涵盖了判断针对访问日志里，多种攻击类型的识别。(非隔开法链接的判断类型，是写在数据库里，**可实时在线更新** ，在程序里没有体现。)
这个程序设计实现的功能是判断用户的访问，是否为非隔开法行为、正常访问，非隔开法行为则立刻自动启动iptables，阻止继续疯狂刷新，高峰时可能高达1秒钟100次以上的刷新。攻击者会在链接添加参数，或者空链接，这都是非隔开法访问。编程的语言，使用“第三方语言+Shell命令”。第三方语言，主要是编程者熟悉的语言，可以是PHP、Node.js、Java、Python、Golang、CGI(Perl)，只要是能运行于Linux系统下的任何语言。
Shell程序本来也能实现大部分的功能，虽然Shell命令无比强大，能实现很多系统级(不可思议)的功能，但用于编程的话，Shell程序的语法真的太啰嗦，如果过段时间，**再次回读Shell程序的时候，会十分困难** ，真的有一种崩溃感。
用Shell编程的方法来实现这些功能，花费的时间，至少是第三方语言的10倍～20倍，纯粹是因为语法的简洁性、可读性。
我个人熟悉的语言是PHP，所以使用“PHP+Shell命令”的方式，**本质上属于0开销，不额外占用任何资源** ，因为这个实例里，不需要再安装任何依赖包，只要有PHP即可，本质上就是一个普通的PHP页面。
这个程序需要嵌套到所有的PHP文件，甚至是需要用Rewrite把静态文件自动转成PHP动态文件，实现嵌套这个防护程序。实测所有的文件类型的静态文件，甚至是MP3文件，也能嵌套，嵌套后的静态非文本文件测试SHA256和SHA1的值均正常，但前提是嵌套非文本文件的PHP程序，不能有任何文本输出、不能有报错。不能预留一点被攻击的窗口。
(静态文件自动转成PHP动态文件，除了用Rewrite，也可以用.htaccess+404错误页(改成200代码)，作用相同，但404错误页更省资源，因为少调用一个Rewrite模块。)
这次的程序设计，预计可能需要15～30天完成，**实际操作起来，用时3天** ，后面再做精细的修改、功能升级和完善，**又用了2天** 。这个防DDoS的程序，目前来说功能相对还是比较全面的，当然欠缺的是对于要求不能断线关机的服务器、例如网络游戏的服务器，暂时解决不了。
因为攻击者的很多访问来源，在访问日志里可以看到是模拟真实的访问，无论是访问页面、还是UA，都像是真实访问。但从短期内出现大量的这类访问记录，80%的可能性又像是在攻击，这类攻击是采用一个访问，使用一个IP地址，所以对这类访问进行自动封禁，会出现误伤，出现大面积的不能正常访问。
所以对于个人网站、个人博客、小型企业网站，我采用的规则是当短时间内出现超大量的这种攻击，一个访问、一个IP地址的这种，1秒钟的请求达到100次以上，进行统一自动白名单，也就是“软关机”。(这个规则的程序编写和调试、测试，实际大约用5个多小时完成。)
这个“软关机”的高危参数，是总访问量，而非个人的刷新次数， **因为每次的IP地址不同，所以只能从总访问量着手** ，实际的参数设定阀值，对于博客、小型网站，要远低于1秒钟100次，例如1秒钟10次，这种设定会出现误伤，所以改为2秒钟20次、3秒钟30次类似的宽限范围，**能大大减少误伤，维持博客的正常访问** 。
3秒钟30次是属于访问量比较大的大型博客，我设定为1分钟200次这个值更加安全，因为要按照实际的日常访问量。大型网站可设定为1分钟2000次。这个阀值设定越高，当攻击出现的时候，**浪费的流量就越多** 。阀值设定越低，越安全。
这些阀值，都设置为可修改参数，可以在线随时修改，随时改变安全级别。
否则，这种攻击能在短时间内消耗远超10Gbps以上的流量，流量的消耗完全取决于VPS、或独立主机的带宽，是30Mbps，还是100Mbps，还是1Gbps，美国主机普遍是1G带宽。
就以30Mbps的VPS为例，1秒钟的峰值上行/下行流量总和是30Mbps，1分钟就能达到1.8Gbps。但由于VPS有一定的抗压能力，或者有单位时间的峰值限制，1G流量消耗可能实际需要10分钟～15分钟左右。
出现这种攻击的时候，博主会发现自己的博客会特别卡，我就是这样发现的，已经消耗了将近1G的流量，于是手动关机。
如果不手动关机，流量会一直消耗下去。自动“软关机”，就是代替手动关机，且非常及时，一旦异常，**立刻断开流量，非常灵敏** 。
并在程序设计里做一个日志，查看什么时候曾经“软关机”。
**截图珍贵留念**  
这是这个程序的部分截图珍贵留念，程序完成的作品就是这样模块化的风格。在实际的程序开发中，**程序书写顺序并不是像写文章一样，从前到后** ，而是有大量的“插播”，很多后面需要的变量、或者需要经过处理的数据，都是需要的时候，在前面插播。正是由于这种被迫的“插播”方式，使程序的开发思路，较难被完全读懂，别人这样写，我也看不懂。
这些程序将来都是完全公开的，即使源代码全部公开，一旦放置在服务器上，无法被破解、攻击，因为绝大多数的语句都是赋值、或者处理、调用，没法破解、攻击，实在是个别需要加强隐私的参数，可以添加个参数、或者稍微加密一下即可降低可读性，数据库是禁止访问、不可修改的：
[![](http://st.auiou.com/f/2/652s.gif)](http://st.auiou.com/f/2/652.gif)
VPS自动“软关机”的关键语句，防止超大规模的DDoS攻击：
[![](http://st.auiou.com/f/2/653s.gif)](http://st.auiou.com/f/2/653.gif)
**本博客的博客首页源代码**  
本博客的博客首页源代码，在5年前公布，如前文《[秒会+实战PHP程序设计(1-2)：auiou.com的源代码](http://www.auiou.com/relevant/00001888.jsp)》，我不介意公开自己的源代码。**永远不能公开的是用户的隐私数据** ，这是超级红线。
当时公开的这个首页源代码，就是首页的全部核心程序代码，就是这么简单，现在是用PHP写的，这个博客程序是2010年重新重构，改为PHP程序，大约用了4天完成整个前后台程序，从0人工编写。
我的中文博客本来可以在2005年的时候上线，但正如现在一样，真的有很多事情压着，所以一直拖到2006年才正式上线。
我的英文博客是在2005年过年的时候上线，那时候必须做这个英文博客，当时是随机注册只要有一点含义就可以，是属于急需注册，那个博客的作用是跳板作用，内容也全部是自己的原创文章，偏技术话题为主。
为什么说是跳板作用？因为当时国内个人网站的PR值最高是4，极少数人是5。而当时的英文博客，PR值普遍都是6以上，最低都是5，有几十个PR值为7的英文博客，全球也有个位数的英文博客PR值达到8，例如simplebits，mikeindustries，总数不超过5个。
英文博客的PR值特别高，主要是因为互相的友情链接。
当时的大多数英文博客还没有启用nofollow，这些英文博客很多单篇的PR值都达到6、或者5，甚至7，**这些单页PR值高的原因是按月存档的链接** ，只要在这些英文博客上留言，留个链接，自己的博客的PR值能轻易到达5。
后来过了几年，Wordpress、Typecho，启用了nofollow，这个快速提升PR值的方法也就失效了。
我的中文博客是由于当时的网络环境，主要原因也还是由于中文博客的PR值也特别高，所以在2005年秋天在我原有的个人主页上，做了一个博客的二级目录，这个博客其实是一个真正的博客。
但是，我在2005年秋天建的中文博客，以及2005年过年建的英文博客，这2个博客，是全静态的HTML页，**那时候还没想出怎么写博客程序** 。
当时这种强制搭建的全静态HTML博客站，更新是非常吃力的，所有的关联页面都是手动修改、再用FTP上传，仅仅是每次写文章，**而造成的手动修改，就需要额外10多分钟** ，一点都不夸张，这导致当时的博客非常低产，我只写了4篇博客。
不像后来，有了博客程序，博客一键发布，所有的关联页面全部自动更新，每次都能节省10多分钟。
经过了整整半年的思考，我终于想出了博客程序的设计方法，就是列表，每篇文章为一个数据库，首页提取10个数据库，就是像上述截图这样。
第一个程序其实是用ASP编写的，用了整整10天，程序从0编写完成，在2006年5月底完成。
由于ASP的语法太啰嗦，同样的程序，PHP的开发速度至少是ASP的3～5倍，PHP开发速度快，纯粹是因为语法简洁。
**“软关机”功能的改进**  
由于开发时间急促，对于短时间内的超高频的DDos攻击，我采用“软关机”一段时间的方法，限制所有人访问。普通的非隔开法链接、高频刷新，采用部分限制。
其实可以改进，将来有时间再改吧，改成“软降速”，把原来的30M带宽，让程序自动调为1M，过一小段时间再自动调回来，至少博客、网站还能勉强访问，这些都是依赖PHP+Shell命令完成。
但是，“软降速”可能效果没那么好，博客还是不能访问，因为这仅有的1M带宽，被DDoS占着，干脆还是不如“软关机”。
**功能总结**  
这种防止超大规模的DDoS攻击的程序，最简单的设计原理就是制作一个计数器，对于博客，如果近期的30秒内的访问次数达到100次，或者60秒内的访问次数达到200次，**则自动启动iptables的白名单语句**(Shell命令里的iptables)，并写入sleep命令，设定为20分钟、或30分钟后自动解除白名单，实现自动“软开机”。
这个计数器由于是高频写入数据，需要用高速缓存，建立虚拟硬盘，Linux系统建立虚拟硬盘比Windows容易得多，一条Shell命令就能建立，百度关键词：Debian ramdisk
有了这个自动“软关机”的功能，能抵挡超大量的DDoS攻击，迅速自动关闭所有的流量消耗，实现“高枕”的功能，**博主能安心地去睡觉、安心地随时出行、安心地K歌** ，是真正的“高枕”牌防护程序，是居家、旅行的必备良药，敬请观看《唐伯虎点秋香》。
一齐再唱歌，一齐再抛开一切嘅压力，抛开一切嘅苦恼，烦恼。(《光辉岁月》的开场独白)  
[http://www.auiou.com/relevant/00001496.jsp](http://www.auiou.com/relevant/00001496.jsp#guanghui) (《光辉岁月》，含手工亲手翻译。)
**0条评论：**
抱歉，评论已关闭。
**文章分类 Category：**  
[编程](http://www.auiou.com/category/program/) | [PHP](http://www.auiou.com/category/php/) | [互联网](http://www.auiou.com/category/internet/) | [Blog的发展](http://www.auiou.com/category/blog/)  
[电脑](http://www.auiou.com/category/computer/) | [服务器和调试](http://www.auiou.com/category/server/) | [平面设计](http://www.auiou.com/category/design/)  
[Webshu项目](http://www.auiou.com/category/eonval/) | [生活](http://www.auiou.com/category/life/) | [手机和通信](http://www.auiou.com/category/mobile/) | [BBS](http://www.auiou.com/category/community/) | [QQ研究](http://www.auiou.com/category/qq/) | [人生与真相](http://www.auiou.com/category/philosophy/) | [社会](http://www.auiou.com/category/society/)
**置顶的文章：**  
[股骨头坏死的中早期修复方法](http://www.auiou.com/relevant/00002202.jsp)  
[Windows流畅度300%以上体感的操作](http://www.auiou.com/relevant/00002182.jsp)  
[超低价享受i7-7700的体验](http://www.auiou.com/relevant/00002169.jsp)  
[家用电脑理性优化升级天梯图之2026](http://www.auiou.com/relevant/00002162.jsp)  
[服务器版Linux系统的选择之2026](http://www.auiou.com/relevant/00002159.jsp)  
[秒会+实战PHP程序设计培训(2)](http://www.auiou.com/relevant/00002151.jsp)  
[如何快速自制CPU天梯图？](http://www.auiou.com/relevant/00002123.jsp)  
[我不明白你明不明白我明白(明白不)](http://www.auiou.com/relevant/00002148.jsp)
**近期的主题：**  
[这一次的程序设计速度和防攻思路](http://www.auiou.com/relevant/00002210.jsp)  
[关于是否撤文章的问题](http://www.auiou.com/relevant/00002209.jsp)  
[程序的及时作用](http://www.auiou.com/relevant/00002208.jsp)  
[数码评测(76)：万元的折叠屏手机](http://www.auiou.com/relevant/00002207.jsp)  
[数码评测(75)：DDR 3/4/5的性能测试](http://www.auiou.com/relevant/00002206.jsp)  
[健康维护(3)：为什么股骨头坏死中期可能能治疗？](http://www.auiou.com/relevant/00002205.jsp)  
[博客近期大调整已经初步完成](http://www.auiou.com/relevant/00002204.jsp)  
[本机安装PHP 8](http://www.auiou.com/relevant/00002203.jsp)  
[健康维护(2)：股骨头坏死有多接近？](http://www.auiou.com/relevant/00002202.jsp)  
[北京之行2026](http://www.auiou.com/relevant/00002201.jsp)  
[健康维护(1)：为什么晚上睡觉时会肚子疼？](http://www.auiou.com/relevant/00002200.jsp)  
[https利弊(5)：技术上的定向安全与垄断本质](http://www.auiou.com/relevant/00002199.jsp)  
[博客正在加紧调整中](http://www.auiou.com/relevant/00002198.jsp)  
[十分感谢博友点评：自由勇 二十年博客的老程序员](http://www.auiou.com/relevant/00002197.jsp)  
[DIY(35-3)：6路×2 USB全自动电脑切换器](http://www.auiou.com/relevant/00002196.jsp)  
[这次突然特别理解老罗](http://www.auiou.com/relevant/00002195.jsp)  
[支架设计(1)：船型开关固定](http://www.auiou.com/relevant/00002194.jsp)  
[DIY(35-2)：6路×2 USB全自动电脑切换器](http://www.auiou.com/relevant/00002193.jsp)  
[今天起名未成功](http://www.auiou.com/relevant/00002192.jsp)  
[DIY(37)：我是如何坚持完成这些DIY作品的？](http://www.auiou.com/relevant/00002191.jsp)
王志勇：1980-09-26 (46周岁)
[![](http://st.auiou.com/g/013.jpg)](http://st.auiou.com/f/2/000383.jpg)
版权声明：本博客所有文章，均符合原创的定义，[禁止转载](http://www.auiou.com/relevant/00000506.jsp)，违者将必究；正确的方法是贴原文的标题和网址即可。
**与此相关的链接**  
[自由勇专栏](http://www.webshu.com/column/102/)
[Gratitude](http://acc.webshu.com)
**Blog存档 Archives**
[2025年-2026年03月(10)](http://www.auiou.com/archives/202505/)  
[2024年(13)](http://www.auiou.com/archives/202401/)  
2023年 +  

[2023年09月-11月(14)](http://www.auiou.com/archives/202309/)  
[2023年06月-8月(14)](http://www.auiou.com/archives/202306/)  
[2023年05月(9)](http://www.auiou.com/archives/202305/)  
[2023年04月(8)](http://www.auiou.com/archives/202304/)  
[2023年01月-04月(13)](http://www.auiou.com/archives/202301/)  
[2023年01月](http://www.auiou.com/archives/202301/)
2022年 +  

[2022年12月(8)](http://www.auiou.com/archives/202212/)  
[2022年11月(5)](http://www.auiou.com/archives/202211/)  
[2022年10月(21)](http://www.auiou.com/archives/202210/)  
[2022年09月(10)](http://www.auiou.com/archives/202209/)  
[2022年08月(6)](http://www.auiou.com/archives/202208/)  
[2022年07月(14)](http://www.auiou.com/archives/202207/)  
[2022年06月(15)](http://www.auiou.com/archives/202206/)  
[2022年05月(20)](http://www.auiou.com/archives/202205/)  
[2022年04月(16)](http://www.auiou.com/archives/202204/)  
[2022年03月(9)](http://www.auiou.com/archives/202203/)  
[2022年02月(9)](http://www.auiou.com/archives/202202/)  
[2022年01月(10)](http://www.auiou.com/archives/202201/)
2021年 +  

[2021年12月(11)](http://www.auiou.com/archives/202112/)  
[2021年11月(16)](http://www.auiou.com/archives/202111/)  
[2021年10月(18)](http://www.auiou.com/archives/202110/)  
[2021年09月(14)](http://www.auiou.com/archives/202109/)  
[2021年08月(19)](http://www.auiou.com/archives/202108/)  
[2021年07月(15)](http://www.auiou.com/archives/202107/)  
[2021年06月(9)](http://www.auiou.com/archives/202106/)  
[2021年05月(17)](http://www.auiou.com/archives/202105/)  
[2021年04月(25)](http://www.auiou.com/archives/202104/)  
[2021年03月(6)](http://www.auiou.com/archives/202103/)  
[2021年02月(17)](http://www.auiou.com/archives/202102/)  
[2021年01月(30)](http://www.auiou.com/archives/202101/)
2020年 +  

[2020年12月(19)](http://www.auiou.com/archives/202012/)  
[2020年11月(18)](http://www.auiou.com/archives/202011/)  
[2020年10月(15)](http://www.auiou.com/archives/202010/)  
[2020年09月(14)](http://www.auiou.com/archives/202009/)  
[2020年08月(14)](http://www.auiou.com/archives/202008/)  
[2020年07月(14)](http://www.auiou.com/archives/202007/)  
[2020年06月(16)](http://www.auiou.com/archives/202006/)  
[2020年05月(13)](http://www.auiou.com/archives/202005/)  
[2020年04月(18)](http://www.auiou.com/archives/202004/)  
[2020年03月(14)](http://www.auiou.com/archives/202003/)  
[2020年02月(15)](http://www.auiou.com/archives/202002/)  
[2020年01月(16)](http://www.auiou.com/archives/202001/)
2019年 +  

[2019年12月(11)](http://www.auiou.com/archives/201912/)  
[2019年11月(26)](http://www.auiou.com/archives/201911/)  
[2019年10月(25)](http://www.auiou.com/archives/201910/)  
[2019年09月(30)](http://www.auiou.com/archives/201909/)  
[2019年08月(10)](http://www.auiou.com/archives/201908/)  
[2019年07月(29)](http://www.auiou.com/archives/201907/)  
[2019年06月(30)](http://www.auiou.com/archives/201906/)  
[2019年05月(26)](http://www.auiou.com/archives/201905/)  
[2019年04月(30)](http://www.auiou.com/archives/201904/)  
[2019年03月(30)](http://www.auiou.com/archives/201903/)  
[2019年02月(30)](http://www.auiou.com/archives/201902/)  
[2019年01月(30)](http://www.auiou.com/archives/201901/)
2018年 +  

[2018年12月(30)](http://www.auiou.com/archives/201812/)  
[2018年11月(30)](http://www.auiou.com/archives/201811/)  
[2018年10月(30)](http://www.auiou.com/archives/201810/)  
[2018年09月(17)](http://www.auiou.com/archives/201809/)
[2016年-2017年(9)](http://www.auiou.com/archives/201608/)  
[2014年06月-09月(10)](http://www.auiou.com/archives/201406/)  
2013年 +  

[2013年09月(3)](http://www.auiou.com/archives/201309/)  
[2013年08月(9)](http://www.auiou.com/archives/201308/)  
[2013年07月(6)](http://www.auiou.com/archives/201307/)  
[2013年06月(7)](http://www.auiou.com/archives/201306/)  
[2013年05月(22)](http://www.auiou.com/archives/201305/)  
[2013年04月(17)](http://www.auiou.com/archives/201304/)  
[2013年03月(20)](http://www.auiou.com/archives/201303/)  
[2013年02月(21)](http://www.auiou.com/archives/201302/)  
[2013年01月(6)](http://www.auiou.com/archives/201301/)
2012年 +  

[2012年12月(3)](http://www.auiou.com/archives/201212/)  
[2012年08月(8)](http://www.auiou.com/archives/201208/)  
[2012年07月(4)](http://www.auiou.com/archives/201207/)  
[2012年06月(4)](http://www.auiou.com/archives/201206/)  
[2012年05月(6)](http://www.auiou.com/archives/201205/)  
[2012年04月(13)](http://www.auiou.com/archives/201204/)  
[2012年03月(11)](http://www.auiou.com/archives/201203/)  
[2012年01月(7)](http://www.auiou.com/archives/201201/)
2011年 +  

[2011年10月(8)](http://www.auiou.com/archives/201110/)  
[2011年09月(4)](http://www.auiou.com/archives/201109/)  
[2011年08月(2)](http://www.auiou.com/archives/201108/)  
[2011年06月(2)](http://www.auiou.com/archives/201106/)  
[2011年05月(6)](http://www.auiou.com/archives/201105/)  
[2011年04月(10)](http://www.auiou.com/archives/201104/)  
[2011年03月(16)](http://www.auiou.com/archives/201103/)  
[2011年02月(16)](http://www.auiou.com/archives/201102/)  
[2011年01月(15)](http://www.auiou.com/archives/201101/)
2010年 +  

[2010年12月(12)](http://www.auiou.com/archives/201012/)  
[2010年11月(9)  
](http://www.auiou.com/archives/201011/)[2010年10月(3)  
](http://www.auiou.com/archives/201010/)[2010年05月(4)  
](http://www.auiou.com/archives/201005/)[2010年01月(7)](http://www.auiou.com/archives/201001/)
2009年 +  

[2009年12月(10)  
](http://www.auiou.com/archives/200912/)[2009年11月(4)  
](http://www.auiou.com/archives/200911/)[2009年10月(8)  
](http://www.auiou.com/archives/200910/)[2009年09月(24)  
](http://www.auiou.com/archives/200909/)[2009年08月(20)  
](http://www.auiou.com/archives/200908/)[2009年07月(6)](http://www.auiou.com/archives/200907/)  
[2009年06月(11)](http://www.auiou.com/archives/200906/)  
[2009年05月(16)](http://www.auiou.com/archives/200905/)  
[2009年04月(20)](http://www.auiou.com/archives/200904/)  
[2009年03月(29)](http://www.auiou.com/archives/200903/)  
[2009年02月(18)](http://www.auiou.com/archives/200902/)  
[2009年01月(15)](http://www.auiou.com/archives/200901/)
2008年 +  

[2008年12月(17)](http://www.auiou.com/archives/200812/)  
[2008年11月(10)](http://www.auiou.com/archives/200811/)  
[2008年10月(13)](http://www.auiou.com/archives/200810/)  
[2008年09月(8)](http://www.auiou.com/archives/200809/)  
[2008年08月(4)](http://www.auiou.com/archives/200808/)  
[2008年07月(5)](http://www.auiou.com/archives/200807/)  
[2008年06月(9)](http://www.auiou.com/archives/200806/)  
[2008年05月(12)](http://www.auiou.com/archives/200805/)  
[2008年04月(15)](http://www.auiou.com/archives/200804/)  
[2008年03月(26)](http://www.auiou.com/archives/200803/)  
[2008年02月(22)](http://www.auiou.com/archives/200802/)  
[2008年01月(29)](http://www.auiou.com/archives/200801/)
2007年 +  

[2007年12月(30)](http://www.auiou.com/archives/200712/)  
[2007年11月(28)](http://www.auiou.com/archives/200711/)  
[2007年10月(30)](http://www.auiou.com/archives/200710/)  
[2007年09月(8)](http://www.auiou.com/archives/200709/)  
[2007年08月(8)](http://www.auiou.com/archives/200708/)  
[2007年07月(21)](http://www.auiou.com/archives/200707/)  
[2007年06月(28)](http://www.auiou.com/archives/200706/)  
[2007年05月(30)](http://www.auiou.com/archives/200705/)  
[2007年04月(30)](http://www.auiou.com/archives/200704/)  
[2007年03月(29)](http://www.auiou.com/archives/200703/)  
[2007年02月(18)](http://www.auiou.com/archives/200702/)  
[2007年01月(41)](http://www.auiou.com/archives/200701/)
2006年 +  

[2006年12月(23)](http://www.auiou.com/archives/200612/)  
[2006年11月(10)](http://www.auiou.com/archives/200611/)  
[2006年10月(10)](http://www.auiou.com/archives/200610/)  
[2006年09月(29)](http://www.auiou.com/archives/200609/)  
[2006年08月(33)](http://www.auiou.com/archives/200608/)  
[2006年07月(17)](http://www.auiou.com/archives/200607/)  
[2006年06月(30)](http://www.auiou.com/archives/200606/)  
[2006年05月(4)](http://www.auiou.com/archives/200605/)  
[2006年01月(3)](http://www.auiou.com/archives/200601/)
[2005年09月(4)](http://www.auiou.com/archives/200509/)
* * *
Copyright © 2006-2026 auiou.com All rights reserved.  
此Blog程序由王志勇编写
