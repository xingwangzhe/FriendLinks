![avatar](http://q1.qlogo.cn/g?b=qq&nk=1821475872&s=5)
[ 文章 33  ](https://www.iquegui.com/index.php/archives/180/#null) [ 标签 0 ](https://www.iquegui.com/index.php/archives/180/#null) [ 分类  5  ](https://www.iquegui.com/index.php/archives/180/#null)
* * *
[ 首页](https://www.iquegui.com/)
[ 友链 ](https://www.iquegui.com/index.php/links.html)
[ 关于本站 ](https://www.iquegui.com/index.php/about.html)
[ 留言吧 ](https://www.iquegui.com/index.php/msg.html)
# 拨号VPS 重拨换IP工具 
发表于2024-10-17 | 更新于 2024-10-17 | [碎语](https://www.iquegui.com/index.php/category/%E7%A2%8E%E8%AF%AD/) [技术](https://www.iquegui.com/index.php/category/%E6%8A%80%E6%9C%AF/) [瞎折腾](https://www.iquegui.com/index.php/category/%E7%9E%8E%E6%8A%98%E8%85%BE/)
| 字数总计: 511 | 阅读时长: 1分钟 | 阅读量:4471
[ 鹊归 ](https://www.iquegui.com/)
搜索
[ 首页](https://www.iquegui.com/)
[ 友链 ](https://www.iquegui.com/index.php/links.html "友链")
[ 关于本站 ](https://www.iquegui.com/index.php/about.html "关于本站")
[ 留言吧 ](https://www.iquegui.com/index.php/msg.html "留言吧")
这篇文章距离最后更新已过715 天,如果文章内容或图片资源失效，请留言反馈，我会及时处理，谢谢！ 
##  [](https://www.iquegui.com/index.php/archives/180/#cl-1)闲来无事
最近项目需要爬取目标特定数据，想使用代理，价格太贵，无论是根据流量还是次数收费都不划算，再者，目标风控措施不是很严格，所以我选择了一个折中的方案，使用拨号VPS运行项目，但是如何自动切换IP呢？网上找了一圈，除了断网自动重拨的脚本工具，似乎没再找到联网情况下也能自动重拨的（这里重拨的目的是换IP），所以使用Golang完成了该项目，测试平台为Windows10/11，7可能无法运行。逻辑为：运行程序后断开宽带连接 -> 使用自定义的账号密码重连宽带 -> 使用网络接口获取当前IP地址以及城市 -> 将上述步骤内容均输出在同目录日志文件里
##  [](https://www.iquegui.com/index.php/archives/180/#cl-2)使用方法
1.解压并将两个文件放在同一目录下  
2.文本编辑start.bat，将username和password修改为对应的宽带账号密码，保存  
3.双击start.bat即可运行  
4.百度一下windows如何设置定时任务，或者使用其他第三方工具
##  [](https://www.iquegui.com/index.php/archives/180/#cl-3)下载
[AutoNETConnect.zip](https://wwab.lanzouo.com/iwQWC2cqztlg)
作者:  [纪伯伦M4X](https://www.iquegui.com/index.php/author/1/)
文章链接:  [ https://www.iquegui.com/index.php/archives/180/](https://www.iquegui.com/index.php/archives/180/)
版权声明:  本博客所有文章除特别声明外，均采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。转载请注明来自[鹊归](https://www.iquegui.com/) ！ 
无标签
[ ![《黑神话：悟空（Black Myth: Wukong）》v1.0 四十二项修改器 By 风灵月影](https://www.iquegui.com/index.php/archives/180/) 上一篇 《黑神话：悟空（Black Myth: Wukong）》v1.0 四十二项修改器 By 风灵月影 ](https://www.iquegui.com/index.php/archives/176/ "《黑神话：悟空（Black Myth: Wukong）》v1.0 四十二项修改器 By 风灵月影")
[ ![资源网垃圾广告生成器](https://www.iquegui.com/index.php/archives/180/) 下一篇 资源网垃圾广告生成器 ](https://www.iquegui.com/index.php/archives/182/ "资源网垃圾广告生成器")
* * *
### 
评论
[](https://www.iquegui.com/index.php/archives/180/#respond-post-180)
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
### 仅有一条评论
  1. ![](https://www.iquegui.com/index.php/archives/180/)
Cvc  访客
[2024-11-06 20:14](https://www.iquegui.com/index.php/archives/180/#comment-43) [回复](https://www.iquegui.com/index.php/archives/180/?replyTo=43#respond-post-180)
感谢分享
Windows 10 / Microsoft Edge 


![avatar](http://q1.qlogo.cn/g?b=qq&nk=1821475872&s=5)
纪伯伦M4X 
月光让思念安静. 
[ 文章 33  ](https://www.iquegui.com/index.php/archives/180/#null) [ 标签 0 ](https://www.iquegui.com/index.php/archives/180/#null) [ 分类  5  ](https://www.iquegui.com/index.php/archives/180/#null)
[ https://www.timeletters.cn  ](https://www.timeletters.cn)
公告
[拾光 - 给未来写封信](https://www.timeletters.cn)  
[推荐雨云服务器](https://www.rainyun.com/MjE0NjA=_)  
[正规三网电话卡/流量卡/校园卡](https://simhaoka.com/phone/index?id=28566FFDBBC89CCC7C3D1277225BDCA9)  
联系我：admin@iquegui.com
目录
  1. [ 闲来无事 ](https://www.iquegui.com/index.php/archives/180/#cl-1)
  2. [ 使用方法 ](https://www.iquegui.com/index.php/archives/180/#cl-2)
  3. [ 下载 ](https://www.iquegui.com/index.php/archives/180/#cl-3)


最新文章
[ ![🚀 CS2 CFG BOX：你的专属 CS2 云端配置管家](https://www.iquegui.com/index.php/archives/180/) ](https://www.iquegui.com/index.php/archives/183/ "🚀 CS2 CFG BOX：你的专属 CS2 云端配置管家")
[🚀 CS2 CFG BOX：你的专属 CS2 云端配置管家](https://www.iquegui.com/index.php/archives/183/) 2026-01-07
[ ![资源网垃圾广告生成器](https://www.iquegui.com/index.php/archives/180/) ](https://www.iquegui.com/index.php/archives/182/ "资源网垃圾广告生成器")
[资源网垃圾广告生成器](https://www.iquegui.com/index.php/archives/182/) 2024-11-07
[ ![拨号VPS 重拨换IP工具](https://www.iquegui.com/index.php/archives/180/) ](https://www.iquegui.com/index.php/archives/180/ "拨号VPS 重拨换IP工具")
[拨号VPS 重拨换IP工具](https://www.iquegui.com/index.php/archives/180/) 2024-10-17
[ ![《黑神话：悟空（Black Myth: Wukong）》v1.0 四十二项修改器 By 风灵月影](https://www.iquegui.com/index.php/archives/180/) ](https://www.iquegui.com/index.php/archives/176/ "《黑神话：悟空（Black Myth: Wukong）》v1.0 四十二项修改器 By 风灵月影")
[《黑神话：悟空（Black Myth: Wukong）》v1.0 四十二项修改器 By 风灵月影](https://www.iquegui.com/index.php/archives/176/) 2024-08-27
[ ![CloudFlare自动开关盾程序](https://www.iquegui.com/index.php/archives/180/) ](https://www.iquegui.com/index.php/archives/162/ "CloudFlare自动开关盾程序")
[CloudFlare自动开关盾程序](https://www.iquegui.com/index.php/archives/162/) 2023-11-28
网站资讯
文章数目 :
33 
已运行时间 :
2395 天 
本站总字数 :
17.07 W 
本站总访问量 :
133227 
最后更新时间 :
8 个月前 
用户
[登录](https://www.iquegui.com/admin/login.php)
[文章 RSS](https://www.iquegui.com/index.php/feed/)
[评论 RSS](https://www.iquegui.com/index.php/feed/comments/)
©2026 By 纪伯伦M4X
由 [Typecho](http://www.typecho.org) 强力驱动 | 主题 [Butterfly](https://github.com/wehaox/Typecho-Butterfly)
[苏ICP备2021007429号-2](https://beian.miit.gov.cn/) | [苏公网安备32108102010502](https://beian.mps.gov.cn/#/query/webSearch?code=32108102010502)
本地搜索
搜索关键字
* * *
繁 
[ ](https://www.iquegui.com/index.php/archives/180/#comments "直达评论")
