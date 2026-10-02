![站点所有者头像](https://ling.crashvibe.cn/_next/image?url=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F90316914%3Fv%3D4&w=96&q=75)
站点所有者头像
[工具](https://ling.crashvibe.cn/categories/tool)
# 我把 VSCode 删了，换成了 Zed
2026年7月2日星期四·(已编辑)·工具 / 工具分享, 吐槽·2233 阅读·11 喜欢0简体中文
这篇文章上次修改于2026年7月2日星期四，可能部分内容已经不适用，如有疑问可询问作者。
其实 Zed 我不是第一次用。2025 年的时候就装过，用了没几天就灰溜溜地跑回 VSCode 了。原因很简单，当时的 Zed 太简陋了，很多语言服务器支持也还没跟上，我写的那些语言当时基本还得靠 VSCode 扛着。工具这东西，功能不够就是不够，情怀没法当饭吃。
##  但是现在情况不一样了[](https://ling.crashvibe.cn/posts/tool/switched-from-vscode-to-zed#%E4%BD%86%E6%98%AF%E7%8E%B0%E5%9C%A8%E6%83%85%E5%86%B5%E4%B8%8D%E4%B8%80%E6%A0%B7%E4%BA%86)
一年过去，两件事同时发生了变化。
第一，我自己的开发工具链变了。现在我写的语言基本都进了 JetBrains 全家桶：WebStorm（配合 TypeScript 7 native）、IDEA（Java 不用说了，毋庸置疑）、RustRover、PyCharm。这些语言原本就是 VSCode 的重灾区（靠插件硬凑出来的体验），现在都迁走了，VSCode 在我这里的核心竞争力直接被抽掉了一半。
第二，VSCode 自己也变了很多，而且是往我不喜欢的方向变。以前它是一张白纸，靠扩展生态把自己拼成一个 IDE，这是它的优点——你可以决定它长成什么样。现在它变成了一个 AI editor，各种 AI 功能往里堆，整个应用越来越臃肿。问题是它本质上还是个文本编辑器（基于 Electron 的文本编辑器），现在却被塞得像个什么都要管的全能选手，两头都没讨好。
于是我把它删了。删之前我心里其实也有预期：过几天肯定又会灰溜溜地装回来（毕竟有前科 = =）。
结果没有！
##  Zed 到底赢在哪[](https://ling.crashvibe.cn/posts/tool/switched-from-vscode-to-zed#zed-%E5%88%B0%E5%BA%95%E8%B5%A2%E5%9C%A8%E5%93%AA)
最直观的感受是快，非常的快。同样是写代码，Zed 占用比 VSCode 这种 Electron 应用低得多，几乎感受不到 VSCode 那种若有若无的延迟感。补全窗口弹出来的速度是那种一瞬间的、几乎没有等待感的快，用久了会上瘾，回头再看 VSCode 会觉得它是不是在思考人生。
界面也简洁，没有太多多余的东西在抢注意力。
##  上手门槛这件事[](https://ling.crashvibe.cn/posts/tool/switched-from-vscode-to-zed#%E4%B8%8A%E6%89%8B%E9%97%A8%E6%A7%9B%E8%BF%99%E4%BB%B6%E4%BA%8B)
第一次配置真的复杂。扩展、主题、字体，这些东西都要自己一点点折腾，不像 VSCode 那样开箱即用（毕竟人家插件生态摆在那里，随手一装什么都有）。
但折腾完之后回过头想想，这个「复杂」其实也是 Zed 的优点。正是因为它的配置颗粒度足够细，什么都能自己一项项调，配出来的东西才真的是「自己的编辑器」，而不是装了一堆插件拼凑出来的样子。VSCode 靠插件生态堆出万能感，Zed 靠配置项本身给你掌控感，两种路子，但后者这种「亲手调出来」的感觉，反而更让人上瘾（不过因人而异哦）。
##  关于 Vim Mode 的一点私货[](https://ling.crashvibe.cn/posts/tool/switched-from-vscode-to-zed#%E5%85%B3%E4%BA%8E-vim-mode-%E7%9A%84%E4%B8%80%E7%82%B9%E7%A7%81%E8%B4%A7)
我个人觉得 Zed 是目前最适合用 Vim Mode 的编辑器，没有之一。原因很直接：Vim Mode 的优点建立在「快」这个前提上，如果编辑器本身反应慢、按键有延迟，那 Vim Mode 的那套跳转逻辑体验会大打折扣（这时候用不用 Vim 意义都不大了）。Zed 够快，反应速度跟得上，Vim Mode 在这里才真正称得上是优点，而不是一种自我惩罚。
##  写在最后[](https://ling.crashvibe.cn/posts/tool/switched-from-vscode-to-zed#%E5%86%99%E5%9C%A8%E6%9C%80%E5%90%8E)
这篇不是要说 VSCode 不行了，或者谁必须换 Zed。只是想说，如果你和我一样，主力开发语言慢慢转移到了 JetBrains 全家桶，只剩下轻量编辑的场景需要一个通用编辑器，那 Zed 值得认真试一次——尤其是现在，不是以前那个简陋版本了。
至于我自己，这次是真的不打算回去了。
我把 VSCode 删了，换成了 Zed · wling · 2026/07/02
https://ling.crashvibe.cn/posts/tool/switched-from-vscode-to-zed
本文采用[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)进行许可。
[回到工具](https://ling.crashvibe.cn/categories/tool)[查看全部文稿](https://ling.crashvibe.cn/posts)
切换到旧版评论
免登录评论
* Loading...
* Loading...
* Loading...
* Loading...
* Loading...
    * [但是现在情况不一样了](https://ling.crashvibe.cn/posts/tool/switched-from-vscode-to-zed#%E4%BD%86%E6%98%AF%E7%8E%B0%E5%9C%A8%E6%83%85%E5%86%B5%E4%B8%8D%E4%B8%80%E6%A0%B7%E4%BA%86 "但是现在情况不一样了")
    * [Zed 到底赢在哪](https://ling.crashvibe.cn/posts/tool/switched-from-vscode-to-zed#zed-%E5%88%B0%E5%BA%95%E8%B5%A2%E5%9C%A8%E5%93%AA "Zed 到底赢在哪")
    * [上手门槛这件事](https://ling.crashvibe.cn/posts/tool/switched-from-vscode-to-zed#%E4%B8%8A%E6%89%8B%E9%97%A8%E6%A7%9B%E8%BF%99%E4%BB%B6%E4%BA%8B "上手门槛这件事")
    * [关于 Vim Mode 的一点私货](https://ling.crashvibe.cn/posts/tool/switched-from-vscode-to-zed#%E5%85%B3%E4%BA%8E-vim-mode-%E7%9A%84%E4%B8%80%E7%82%B9%E7%A7%81%E8%B4%A7 "关于 Vim Mode 的一点私货")
    * [写在最后](https://ling.crashvibe.cn/posts/tool/switched-from-vscode-to-zed#%E5%86%99%E5%9C%A8%E6%9C%80%E5%90%8E "写在最后")


0%  

回到顶部
1点赞这篇文章分享这篇文章订阅向作者捐赠评论这篇文章
0%
[wling](https://ling.crashvibe.cn/)
Stay hungry. Stay foolish.
© 2023-2026 wling·[783ac1a0↗](https://github.com/innei-dev/Yohaku/commit/783ac1a031674073de107f560e44100de6ba3af6)·印于 2026/10/1·[Mix Space↗](https://github.com/mx-space)·[余白 / Yohaku↗](https://github.com/Innei/Yohaku)·[萌 ICP 备 20252336 号↗](https://icp.gov.moe/?keyword=20252336)
00人此刻在读
[关于我](https://ling.crashvibe.cn/about)·[时间线](https://ling.crashvibe.cn/timeline)·[友链](https://ling.crashvibe.cn/friends)·[Xlog↗](https://xling.crashvibe.cn)·[监控↗](https://uptime.crashvibe.cn/status/main)·[写留言](https://ling.crashvibe.cn/message)·发邮件↗·[GitHub↗](https://github.com/wling-art)|[RSS 订阅](https://ling.crashvibe.cn/feed)·[站点地图](https://ling.crashvibe.cn/sitemap.xml)·订阅主题浅色·随系统·深色·语言简简体体中中文文·背景效果开开
  * [首页](https://ling.crashvibe.cn/)
  * [文稿](https://ling.crashvibe.cn/posts?view_mode=loose)
  * [手记](https://ling.crashvibe.cn/notes)
  * [时光](https://ling.crashvibe.cn/timeline)
  * [思考](https://ling.crashvibe.cn/thinking)
  * [更多](https://ling.crashvibe.cn/posts/tool/switched-from-vscode-to-zed)


