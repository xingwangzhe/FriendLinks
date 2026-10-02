![avatar](https://tu.oxoz.cn/i/2026/01/19/696de00139326.webp)
[ 文章 82  ](https://www.xreak.top/index.php/archives/326/#null) [ 标签 0 ](https://www.xreak.top/index.php/archives/326/#null) [ 分类  6  ](https://www.xreak.top/index.php/archives/326/#null)
* * *
[ 首页](https://www.xreak.top/)
[ 友链 ](https://www.xreak.top/index.php/%E5%8F%8B%E9%93%BE.html)
[ StarTime--星辰时间 ](https://www.xreak.top/index.php/tarTime.html)
# 网站建设总结 
发表于2026-01-07 | 更新于 2026-01-07 | [作者说说](https://www.xreak.top/index.php/category/Note/)
| 字数总计: 1568 | 阅读时长: 3分钟 | 阅读量:645
[ Xreak's Blog |创造|分享| ](https://www.xreak.top/)
[ 首页](https://www.xreak.top/)
[ 友链 ](https://www.xreak.top/index.php/%E5%8F%8B%E9%93%BE.html "友链")
[ StarTime--星辰时间 ](https://www.xreak.top/index.php/tarTime.html "StarTime--星辰时间")
这篇文章距离最后更新已过267 天,如果文章内容或图片资源失效，请留言反馈，我会及时处理，谢谢！ 
闲着无聊也把2025年的网站建设总结了吧  
2025年也是正式把自己的网站建起来了，其中也是遇到了一堆问题，但是也是解决了很多吧，一开始用的halo部署(域名xreak.konyu.top)在一台上海华为云上面带宽只有可怜的5M，配置2c2g(我都不知道那玩意咋跑起来的估计是访问量小吧)，halo这个框架也是够吃内存的(不愧是java)，换框架的契机也是很抽象，网站被不小心删了，结果发现前一次备份也被删了，后面只能翻到大约3个月前的备份。于是干脆决定换架构了直接全部重构，ok也是重构了第二次用的wordpress(域名xreak.upp.pw)，同时也购入了xreak.top这个域名,也是vercal建了个静态主页（本来准备给博客用但是没备案没法用国内服务器),wordpress这玩意部署在国内必须要优化，否则访问太慢了，把一堆东西都禁用了大致能用了，然后5mbps的小水管发力了，人一多访问速度直线下降，好处这玩意至少比抽象的halo好多了，也是过了段时间这个上海华为云也是到期了，于是开始着手准备迁移，然后选服务器，主服务器用日本腾讯云2c2g 20mbps（当时走的是日本kddi现在走的pccw几乎没可用性了不知道能干哈现在)然后选择了一台香港阿里云做转发，就是这个byd阿里云后面给我拉了波大的，一开始觉得这阿里云香港有大陆优化能当个好用的转发,结果后面用了一段时间发现电信访问慢到窒息，一看丢包40%，一看黑龙江电信都奔60%去了，这给我愁的，当时edgeone我记得刚好上线就只能套个edgeone勉强应付了(走的绕美我记得)平均大约4s，没edgeone正常地区大约2s以内,同时因为xreak.upp.pw域名到期同时更换到了blog.xreak.top，这下所有我的服务也是都转移到了xreak.top上，又是安稳过了几个月，因为这个wordpress让我觉得访问太慢了,于是隔壁的站长推荐我干脆换成typecho于是又是个惊天地泣鬼神的折腾开始了，一开始用的插件迁移的然后给我爆了一堆问题，先是显示无法访问到数据库，然后发现是密码错了，然后迁移过去了发现数据库又有问题 (这个laji宝塔) 不知道莫名其妙又好了，然后加了个友链的插件一加进去数据库直接原地飞升也是抽象玩意，后面让隔壁站长给我备份了个插件发给我发现可以用了,然后过了几天发现整个网站js一直在挂起状态访问慢的起飞，估计是主题问题,于是又换了个主题找了好久才找到了这个由haxo butterfly移植过过来的主题也是感谢大佬移植,但是发现也是有一些问题的，我也是做了些修改后面问题都得到了解决,访问速度也是直线上升，可以到2s内了，后面又对资源进行了储存优化,极大的提升了访问速度。又过了一段时间我感觉这seo优化有问题,于是决定从blog.xreak.top迁移到xreak.top就是目前这样,当时为了加快访问速度用的灵车cdn,结果又给我拉了波大的给江苏反诈这个敏感肌给碰上了直接干了个96110了，给我吓到了，后面申请了一天就过了审核也是有惊无险，后面立马也是切到阿里的esa了,但是速度明显拉了，于是又是开始想办法购进服务器了,于是服务器大搬迁还有小型重建，主服务器换到了新加坡华为云，同时也升级了cc防护ddos防护，这里感谢[GTX690战术核显卡](https://www.xreak.top/index.php/go/aHR0cHM6Ly9uZWtvcGFyYS51aw)大佬的技术支持,同时网站也对静态资源进行了大规模优化，最后达成了移动联通海外都差不多在1s内,电信2s以内的好成绩，看后面想办法把电信也优化了想办法找个cn2优化的机子，去年也是折腾了这么多，后面考虑看看要不要把域名换了，打算长久运营,也是祝读到这里的人2026年一路顺风!
作者:  [xreak](https://www.xreak.top/index.php/author/1/)
文章链接:  [ https://www.xreak.top/index.php/archives/326/](https://www.xreak.top/index.php/archives/326/)
版权声明:  本博客所有文章除特别声明外，均采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。转载请注明来自[Xreak's Blog |创造|分享|](https://www.xreak.top/) ！ 
无标签
[ ![Venus_3.0.7_xreak_ver49fix3\(小米11\)](https://www.xreak.top/index.php/archives/326/) 上一篇 Venus_3.0.7_xreak_ver49fix3(小米11) ](https://www.xreak.top/index.php/archives/322/ "Venus_3.0.7_xreak_ver49fix3\(小米11\)")
[ ![Venus_3.0.40_xreak_ver50\(小米11\)](https://www.xreak.top/index.php/archives/326/) 下一篇 Venus_3.0.40_xreak_ver50(小米11) ](https://www.xreak.top/index.php/archives/328/ "Venus_3.0.40_xreak_ver50\(小米11\)")
* * *
### 
评论
[](https://www.xreak.top/index.php/archives/326/#respond-post-326)
  * OωO
  * |´・ω・)ノ
  * ヾ(≧∇≦*)ゝ
  * (☆ω☆)
  * （╯‵□′）╯︵┴─┴
  * ￣﹃￣
  * (/ω＼)
  * ∠( ᐛ 」∠)＿
  * (๑•̀ㅁ•́ฅ)
  * →_→
  * ୧(๑•̀⌄•́๑)૭
  * ٩(ˊᗜˋ*)و
  * (ノ°ο°)ノ
  * (´இ皿இ｀)
  * ⌇●﹏●⌇
  * (ฅ´ω`ฅ)
  * (╯°A°)╯︵○○○
  * φ(￣∇￣o)
  * ヾ(´･ ･｀｡)ノ"
  * ( ง ᵒ̌皿ᵒ̌)ง⁼³₌₃
  * (ó﹏ò｡)
  * Σ(っ °Д °;)っ
  * ( ,,´･ω･)ﾉ"(´っω･｀｡)
  * ╮(╯▽╰)╭ 
  * o(*////▽////*)q 
  * ＞﹏＜
  * ( ๑´•ω•) "(ㆆᴗㆆ)
  * (｡•ˇ‸ˇ•｡)


  * 😂
  * 😀
  * 😅
  * 😊
  * 🙂
  * 🙃
  * 😌
  * 😍
  * 😘 
  * 😜
  * 😝
  * 😏
  * 😒
  * 🙄
  * 😳 
  * 😡
  * 😔
  * 😫
  * 😱
  * 😭
  * 💩
  * 👻
  * 🙌
  * 🖕
  * 👍
  * 👫
  * 👬
  * 👭
  * 🌚
  * 🌝
  * 🙈
  * 💊
  * 😶
  * 🙏
  * 🍦
  * 🍉
  * 😣


  * 颜文字
  * Emoji


评论
![avatar](https://tu.oxoz.cn/i/2026/01/19/696de00139326.webp)
xreak 
致力于纯净分享 
[ 文章 82  ](https://www.xreak.top/index.php/archives/326/#null) [ 标签 0 ](https://www.xreak.top/index.php/archives/326/#null) [ 分类  6  ](https://www.xreak.top/index.php/archives/326/#null)
[ 个人网站  ](https://www.xreak.top/index.php/archives/326/#null)
公告
IP信息卡片 - 精简版
### 您的 IP 信息
### Your IP Information
IP地址: 45.253.244.137
国家: 中国
地区: 香港
城市: 未知
运营商: 未知
目录
©2026 By xreak
由 [Typecho](http://www.typecho.org) 强力驱动 | 主题 [Butterfly](https://github.com/wehaox/Typecho-Butterfly)
本站已运行 362 天 6 小时 50 分 35 秒
本地搜索
搜索关键字
* * *
繁 
[ ](https://www.xreak.top/index.php/archives/326/#comments "直达评论")
