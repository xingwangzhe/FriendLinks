[Oyiso's Blog](https://oyiso.cn)
  * 档案馆
    * [文章列表](https://oyiso.cn/posts)
    * [文章分类](https://oyiso.cn/categories)
    * [文章标签](https://oyiso.cn/tags)
    * [文章归档](https://oyiso.cn/archives)
  * 更多内容
    * [片刻瞬间](https://oyiso.cn/moments)
    * [臻藏家画展](https://oyiso.cn/galleries)
    * [关于本站](https://oyiso.cn/about)
    * [开往](https://www.travellings.cn/go.html)
  * [友人帐](https://oyiso.cn/friends)
  * [主题教程](https://oyiso.cn/guide)
  * [关于主题](https://oyiso.cn/buy "活动价99元一份喵~（原价128）")


![](https://oyiso.cn/wp-content/uploads/2024/03/20240315031342418.jpg)
## 神秘布偶猫
简单记录在IT生活中遇到的各种有趣的事！
[登录](https://oyiso.cn/wp-login.php?redirect_to=https%3A%2F%2Foyiso.cn%2F371.html)
JS中使用getBoundingClientRect()方法获取精确的元素距离 
返回顶部
[ JavaScript](https://oyiso.cn/category/front/js)[ 前端](https://oyiso.cn/category/front)
2023年5月17日 ·1 Min read · 5953 Views
JS中使用getBoundingClientRect()方法获取精确的元素距离
在某些场景确实比offset好用
* * *
This post was updated **516 days ago** and some of the ideas may be out of date.
使用 `node.offsetWidth` 方法可以获取到元素的宽度，类似的方法如下：
  * `offsetHeight`
  * `offsetTop`
  * `offsetBottm`
  * `offsetLeft`
  * `offsetRight`


## 问题诞生
我们通过offset方法获取的数值会以四舍五入方式取整，然而在我们开发的时候，有些地方需要精准的数值，这时候，用offset方法就不太可行。
## 解决办法
通过 `getBoundingClientRect()` 方法就能获取到元素的精确数值 (精确到小数点后6位) 。
### 用法
如 `node.getBoundingClientRect().width` 就可以获取到元素的宽度，类似的方法如下：
  * `getBoundingClientRect().height`
  * `getBoundingClientRect().top`
  * `getBoundingClientRect().bottom`
  * `getBoundingClientRect().left`
  * `getBoundingClientRect().right`


精确到两位：`getBoundingClientRect().height.toFixed(2)`
### 详解
`getBoundingClientRect()` 返回的是矩形的集合。表示当前元素在浏览器中的位置以及占用的空间大小，除 `width` 和 `height` 外，其他属性是相对于视图窗口的左上角进行计算，如下图：
[![](https://oyiso.cn/wp-content/themes/oyiso/assets/images/loading/loading3.gif)](https://oyiso.cn/wp-content/uploads/2023/05/20230517165624470.png)
  * [1. 问题诞生](https://oyiso.cn/371.html#title-1)
  * [2. 解决办法](https://oyiso.cn/371.html#title-2)
  * [2.1. 用法](https://oyiso.cn/371.html#title-3)
  * [2.2. 详解](https://oyiso.cn/371.html#title-4)


JS中使用getBoundingClientRect()方法获取精确的元素距离
[oyiso.cn/371.html](https://oyiso.cn/371.html)
* 作者
神秘布偶猫
* 发布于
May 17, 2023
* 更新于
May 4, 2025
* 版权协议
[](https://creativecommons.org "Creative Commons") [](https://creativecommons.org/licenses/by/4.0/ "Attribution") [](https://creativecommons.org/licenses/by-nc/4.0/ "NonCommercial") [](https://creativecommons.org/licenses/by-nc-sa/4.0/ "ShareAlike")
[ ![](https://oyiso.cn/wp-content/themes/oyiso/assets/images/loading/loading3.gif) 上一篇 实现元素hover效果：从左出现从右离开的下划线 ](https://oyiso.cn/315.html) [ ![](https://oyiso.cn/wp-content/themes/oyiso/assets/images/loading/loading3.gif) 下一篇 最近在研究新的主题，这是属于own的主题，2024年新年主题 Oyiso's Theme 首次亮相 ](https://oyiso.cn/471.html)
### 参与讨论
左滑关闭
没有更多评论了！
  * 😀
  * 颜文字


  *     * 😀
    * 😁
    * 😂
    * 🤣
    * 😃
    * 😄
    * 😅
    * 😆
    * 😉
    * 😊
    * 😋
    * 😎
    * 😍
    * 😘
    * 🥰
    * 😗
    * 😙
    * 🥲
    * 😚
    * 🧐
    * 🙂
    * 🤗
    * 🤩
    * 🤔
    * 🫡
    * 🤨
    * 😐
    * 😑
    * 😶
    * 🫥
    * 😶‍🌫️
    * 🙄
    * 😏
    * 😣
    * 😥
    * 😮
    * 🤐
    * 😯
    * 😪
    * 😫
    * 🥱
    * 😴
    * 😌
    * 😛
    * 😜
    * 😝
    * 🤤
    * 😒
    * 😓
    * 😔
    * 😕
    * 🫤
    * 🙃
    * 🫠
    * 🤑
    * 😲
    * ☹️
    * 🙁
    * 😖
    * 😞
    * 😟
    * 😤
    * 😢
    * 😭
    * 😦
    * 😧
    * 😨
    * 😩
    * 🤯
    * 😬
    * 😮‍💨
    * 😰
    * 😱
    * 🥵
    * 🥶
    * 😳
    * 🤪
    * 😵
    * 😵‍💫
    * 🥴
    * 😠
    * 😡
    * 🤬
    * 😷
    * 🤒
    * 🤕
    * 🤢
    * 🤮
    * 🤧
    * 😇
    * 🥳
    * 🥸
    * 🥺
    * 🥹
    * 🤠
    * 🤡
    * 🤥
    * 🤫
    * 🤭
    * 🫢
    * 🫣
    * 🤓
    * 💀
    * 💩
    * 👻
  *     * (*>.<*)
    * ・ࡇ・
    * ´༥`
    * ᵕ᷄≀ ̠ᵕ᷅ 
    * ˙ϖ˙
    * ฅ ˘ฅ
    * ˙Ⱉ˙ฅ
    * ˃̶͈ ˂̶͈ 
    * ଲଇଉକ
    * ꈍ◡ꈍ
    * ꒰⑅•ᴗ•⑅꒱
    * (•̤̀ᵕ•̤́๑)ᵒᵏᵎᵎᵎᵎ
    * ฅ(๑ ̀ㅅ ́๑)ฅ
    * ꒰ᐢ⸝⸝•༝•⸝⸝ᐢ꒱
    * u (҂`･ｪ･´) <,︻╦̵̵̿╤─ ҉ - --
    * (* ⁰̷̴͈꒨⁰̷̴͈)=͟͟͞͞➳♥
    * ˃̣̣̥᷄⌓˂̣̣̥᷅ 
    * ♪⸜(๑ ॑꒳ ॑๑)⸝♪✰
    * (๑ᵒ̴̶̷͈᷄ᗨᵒ̴̶̷͈᷅) (৹ᵒ̴̶̷᷄́ฅᵒ̴̶̷᷅৹) (⸝⸝⸝ᵒ̴̶̷̥́ ⌑ ᵒ̴̶̷̣̥̀⸝⸝⸝)
    * ꉂ೭(˵¯̴͒ꇴ¯̴͒˵)౨
    * ( ง⁼̴̀ω⁼̴́)ง⁼³₌₃
    * ( ๑╹ ꇴ╹) ｸﾞｯ!
    * ✧(≖ ◡ ≖✿)
    * Σ(๑º㉨º๑ ) d(ŐдŐ๑) Σ(ﾟдﾟlll)
    * (๑♡3♡๑)
    * (｡˘•ε•˘｡)
    * ฅ՞•ﻌ•՞ฅ
    * ฅฅ*~
    * (♡ര‿ര)
    * ԅ(≖‿≖ԅ)
    * | ू•ૅω•́)ᵎᵎᵎ
    * (｡•ˇ‸ˇ•｡)
    * ¦•ˇ₃ˇ•｡)
    * °꒰๑'ꀾ'๑꒱°
    * ( ॢꈍ૩ꈍ) ॢḟ৹ʳᵧ৹ᵤ
    * ☂꒰´•௰•`๑꒱…
    * ⚆_⚆？
    * ( ˃̶͈◡˂̶͈ ) hi!


返回底部
勾选保存信息
取消回复 Emoji 发送
![](https://cravatar.cn/avatar/d41d8cd98f00b204e9800998ecf8427e?s=400&d=mp) 点击填写用户信息
  * 点赞 16
  * 评论 0
  * TOP
  * 分享


[ ![](https://oyiso.cn/wp-content/uploads/2023/05/20230511123843283.png) Oyiso's Blog ](https://oyiso.cn)
  * Light
  * Dark
  * Auto


Powered by [WordPress](https://wordpress.org/) & Designed by [Oyiso](https://oyiso.cn)
本站已运行: 1263天14小时37分19秒
Copyright © 2023-2026 [Oyiso's Blog](https://oyiso.cn)
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[渝ICP备20008942号-12](https://beian.miit.gov.cn)
###  网站公告
本站已更新至最新版1.5.2 如果后台在线更新失败请前往授权官网下载完整的压缩包
我记住啦~ 确认
