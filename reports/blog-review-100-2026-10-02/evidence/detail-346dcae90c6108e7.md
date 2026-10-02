[Zuoye's Blog](https://blog.zuoye.win/)
  * [ 首页](https://blog.zuoye.win/)
  * [ 归档](https://blog.zuoye.win/archives)
  * [ 关于](https://blog.zuoye.win/about)
  * [ 友链](https://blog.zuoye.win/friends)
  * [ 其他 ](https://blog.zuoye.win/post/zai-yun-xing-you-xi-de-proton-zhong-shi-yong-xiu-gai-qi/)
    * [状态监控](https://status.zuoye.win)
    * [我的资源](https://list.zuoye.win)
    * [RSS订阅](https://blog.zuoye.win/rss.xml)


  * [首页 ](https://blog.zuoye.win/)
  * [归档 ](https://blog.zuoye.win/archives)
  * [关于 ](https://blog.zuoye.win/about)
  * [友链 ](https://blog.zuoye.win/friends)
  * 其他 
[状态监控](https://status.zuoye.win)
[我的资源](https://list.zuoye.win)
[RSS订阅](https://blog.zuoye.win/rss.xml)


[17 标签](https://blog.zuoye.win/tags)[4 分类](https://blog.zuoye.win/categories)[8 文章](https://blog.zuoye.win/archives)
# 在运行游戏的Proton中使用修改器
![](https://static.zuoye.win/img/16f4b0a54666c5c4.webp)
一大堆作业
2025-06-15 20:02:17 2025-06-15 20:02:17 创建 2025-06-15 20:02:17 2025-06-15 20:02:17 更新
  * [笔记本](https://blog.zuoye.win/categories/%E7%AC%94%E8%AE%B0%E6%9C%AC/)


  * [Proton](https://blog.zuoye.win/tags/Proton/)
  * | [Steam](https://blog.zuoye.win/tags/Steam/)


这篇文章最后更新于 473 天前，内容可能已经过时。
《剑星》在 PC 端发售后第一时间买来品鉴了下，玩到后面本手残党表示受不了了，~~我是来色色的，不是来坐牢的~~ 。
但游戏都是在 Proton 中直接运行，然后意识到运行游戏后我似乎没办法再打开修改器。后面在 B 站评论区搜到了解决办法，可以在游戏启动参数中写上：  
| 
```
1  

```
 | 
```
PROTON_REMOTE_DEBUG_CMD="/path/to/Trainer.exe" PRESSURE_VESSEL_FILESYSTEMS_RW="/path/to/Trainer.exe" %command%  

```
 |  
| --- | --- |  
如果要以游戏模式启动则在最前面添加启动命令即可：  
| 
```
1  

```
 | 
```
gamemoderun PROTON_REMOTE_DEBUG_CMD="/path/to/Trainer.exe" PRESSURE_VESSEL_FILESYSTEMS_RW="/path/to/Trainer.exe" %command%  

```
 |  
| --- | --- |  
  * **标题:** 在运行游戏的Proton中使用修改器
  * **作者:** 一大堆作业
  * **创建于 :** 2025-06-15 20:02:17
  * **更新于 :** 2025-06-15 20:02:17
  * **链接:** https://blog.zuoye.win/post/zai-yun-xing-you-xi-de-proton-zhong-shi-yong-xiu-gai-qi/
  * **版权声明:** 本文章采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0) 进行许可。


  * [#Proton](https://blog.zuoye.win/tags/Proton/)
  * [#Steam](https://blog.zuoye.win/tags/Steam/)


[简单自用的自动化AUR 下一篇 ](https://blog.zuoye.win/post/jian-dan-zi-yong-de-zi-dong-hua-aur/)
评论
昵称
邮箱
网址
0/500
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


  * ![](https://owo.imaegoo.com/bilibili/6ea59c827c414b4a2955fe79e0f6fd3dcd515e24.png)
  * ![](https://owo.imaegoo.com/bilibili/a8111ad55953ef5e3be3327ef94eb4a39d535d06.png)
  * ![](https://owo.imaegoo.com/bilibili/bb690d4107620f1c15cff29509db529a73aee261.png)
  * ![](https://owo.imaegoo.com/bilibili/180129b8ea851044ce71caf55cc8ce44bd4a4fc8.png)
  * ![](https://owo.imaegoo.com/bilibili/b9cbc755c2b3ee43be07ca13de84e5b699a3f101.png)
  * ![](https://owo.imaegoo.com/bilibili/34ba3cd204d5b05fec70ce08fa9fa0dd612409ff.png)
  * ![](https://owo.imaegoo.com/bilibili/34db290afd2963723c6eb3c4560667db7253a21a.png)
  * ![](https://owo.imaegoo.com/bilibili/9e55fd9b500ac4b96613539f1ce2f9499e314ed9.png)
  * ![](https://owo.imaegoo.com/bilibili/09dd16a7aa59b77baa1155d47484409624470c77.png)
  * ![](https://owo.imaegoo.com/bilibili/fe1179ebaa191569b0d31cecafe7a2cd1c951c9d.png)
  * ![](https://owo.imaegoo.com/bilibili/9f996894a39e282ccf5e66856af49483f81870f3.png)
  * ![](https://owo.imaegoo.com/bilibili/241ee304e44c0af029adceb294399391e4737ef2.png)
  * ![](https://owo.imaegoo.com/bilibili/1f0b87f731a671079842116e0991c91c2c88645a.png)
  * ![](https://owo.imaegoo.com/bilibili/093c1e2c490161aca397afc45573c877cdead616.png)
  * ![](https://owo.imaegoo.com/bilibili/23269aeb35f99daee28dda129676f6e9ea87934f.png)
  * ![](https://owo.imaegoo.com/bilibili/d04dba7b5465779e9755d2ab6f0a897b9b33bb77.png)
  * ![](https://owo.imaegoo.com/bilibili/a37683fb5642fa3ddfc7f4e5525fd13e42a2bdb1.png)
  * ![](https://owo.imaegoo.com/bilibili/7cfa62dafc59798a3d3fb262d421eeeff166cfa4.png)
  * ![](https://owo.imaegoo.com/bilibili/70dc5c7b56f93eb61bddba11e28fb1d18fddcd4c.png)
  * ![](https://owo.imaegoo.com/bilibili/90cf159733e558137ed20aa04d09964436f618a1.png)
  * ![](https://owo.imaegoo.com/bilibili/0d15c7e2ee58e935adc6a7193ee042388adc22af.png)


  * 颜文字
  * Emoji
  * Bilibili


[](https://guides.github.com/features/mastering-markdown/) 预览 发送
0 条评论
没有评论
Powered by [Twikoo](https://twikoo.js.org) v1.6.10 
Twikoo 评论管理
密码
登录
© 2021 - 2026 [一大堆作业](https://blog.zuoye.win/)
由 [Hexo](https://hexo.io) 驱动 主题 [Redefine v2.9.0](https://github.com/EvanNotFound/hexo-theme-redefine)
[萌ICP备20220845号](https://icp.gov.moe/?keyword=20220845)
  * [](https://blog.zuoye.win/rss.xml)


![](https://blog.zuoye.win/post/zai-yun-xing-you-xi-de-proton-zhong-shi-yong-xiu-gai-qi/)
EXIF
EXIF
