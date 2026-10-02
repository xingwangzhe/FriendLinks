[ ![🥕萝卜兔农场🐇](https://blog.nepakina.cn/upload/logo1.0.png) ![🥕萝卜兔农场🐇](https://blog.nepakina.cn/upload/logo1.0.png) ](https://blog.nepakina.cn/) [首页](https://blog.nepakina.cn/ "首页") [归档](https://blog.nepakina.cn/archives "归档") [分类](https://blog.nepakina.cn/categories "分类") [算法](https://blog.nepakina.cn/s/algorithm "算法") [动态](https://blog.nepakina.cn/journals "动态") [书籍](https://blog.nepakina.cn/s/books "书籍") [相册](https://blog.nepakina.cn/photos "相册") [收录](https://blog.nepakina.cn/s/resource "收录") [友链](https://blog.nepakina.cn/links "友链") [友链申请](https://blog.nepakina.cn/s/links-request "友链申请") [关于](https://blog.nepakina.cn/s/about "关于") [ 1 算法思维训练（四）| 哈希表🎈 ](https://blog.nepakina.cn/archives/algorithm-hash "算法思维训练（四）| 哈希表🎈") [ 2 Java 开发者常用工具 ](https://blog.nepakina.cn/archives/java-devtool-init "Java 开发者常用工具") [ 3 Spring 通用框架模板 ](https://blog.nepakina.cn/archives/spring-demo "Spring 通用框架模板") [ 4 算法思维训练（一）| 整数&数组🎈 ](https://blog.nepakina.cn/archives/algorithm-intnarray "算法思维训练（一）| 整数&数组🎈") [ 5 算法思维训练（七）| 树🎈 ](https://blog.nepakina.cn/archives/algorithm-tree "算法思维训练（七）| 树🎈")
![斐波那契兔](https://q1.qlogo.cn/g?b=qq&nk=1420935912&s=640)
斐波那契兔
幸福不会走过来，所以你要自己走过去。
  * 累计撰写 **27** 篇文章
  * 累计创建 **18** 个标签
  * 累计收到 **2** 条评论


  * [ 导航 ](https://blog.nepakina.cn/archives/%E5%BC%80%E6%94%BE%E7%A9%BA%E9%97%B4ux%E4%BD%93%E9%AA%8C)
    * [首页](https://blog.nepakina.cn/ "首页")
    * [归档](https://blog.nepakina.cn/archives "归档")
    * [分类](https://blog.nepakina.cn/categories "分类")
    * [算法](https://blog.nepakina.cn/s/algorithm "算法")
    * [动态](https://blog.nepakina.cn/journals "动态")
    * [书籍](https://blog.nepakina.cn/s/books "书籍")
    * [相册](https://blog.nepakina.cn/photos "相册")
    * [收录](https://blog.nepakina.cn/s/resource "收录")
    * [友链](https://blog.nepakina.cn/links "友链")
    * [友链申请](https://blog.nepakina.cn/s/links-request "友链申请")
    * [关于](https://blog.nepakina.cn/s/about "关于")

[目录](https://blog.nepakina.cn/archives/%E5%BC%80%E6%94%BE%E7%A9%BA%E9%97%B4ux%E4%BD%93%E9%AA%8C)
    * 前言
    * UX分析
      * 主界面
      * 角色列表
      * 糟糕的抽卡界面
      * 奇怪的主菜单（这块说不好，但是就是怪）


搜索
标签搜索 
  * [理论知识](https://blog.nepakina.cn/tags/theoretical-knowledge "理论知识")
  * [分布式](https://blog.nepakina.cn/tags/distributed "分布式")
  * [随笔](https://blog.nepakina.cn/tags/note "随笔")
  * [算法](https://blog.nepakina.cn/tags/algorithm "算法")
  * [体验](https://blog.nepakina.cn/tags/experience "体验")
  * [交互设计](https://blog.nepakina.cn/tags/gameux "交互设计")
  * [其他](https://blog.nepakina.cn/tags/other "其他")
  * [转载](https://blog.nepakina.cn/tags/reprinted "转载")
  * [原创](https://blog.nepakina.cn/tags/original "原创")
  * [定时任务](https://blog.nepakina.cn/tags/schedule "定时任务")
  * [Spring](https://blog.nepakina.cn/tags/spring "Spring")
  * [Redis](https://blog.nepakina.cn/tags/redis "Redis")
  * [分布式存储](https://blog.nepakina.cn/tags/distributed-storage "分布式存储")
  * [IDE](https://blog.nepakina.cn/tags/ide "IDE")
  * [三方集成](https://blog.nepakina.cn/tags/tripartite-function-integration "三方集成")
  * [分布式事务](https://blog.nepakina.cn/tags/distributed-transaction "分布式事务")
  * [MyBatis](https://blog.nepakina.cn/tags/mybatis "MyBatis")
  * [Java](https://blog.nepakina.cn/tags/java "Java")


🥕萝卜兔农场🐇
重要
# 开放空间—UX体验分析
  * 1 年前 
  * 1468
  * 0
  * 2
  * 1888


[游戏交互设计](https://blog.nepakina.cn/categories/game-ux)
* * *
## 前言
《开放空间》于2025.03.10开启付费测试，简单体验了一下，在此记录一下体验过程中发现的**基础问题** 🤦‍♂️，供自己学习使用，如果您有不同意见，欢迎交流讨论。学习是自己的事情，不要害怕出丑和批评
## UX分析
#### 主界面
![开放空间主界面](https://oss.nepakina.cn/blog/Screenshot_20250311_215230.jpg)
开放空间主界面
  * **屏幕适配** ：通过截图，能够看到UI两侧非常空旷，没有进行短边适配，在设置中，**没有支持适配异形屏的设置，美观度差** ；基本功能，在设计过程中应该考虑到。
  * **UI控件** ：UI控件大小方面，个人认为偏小，容易导致玩家误触；部分按键过于贴近屏幕边缘（例如奔跑按钮，最右下角，真的很难长按），不便于玩家交互；ui层级低，与游戏场景对比不明显，视觉上不利于玩家快速捕获信息,被淡化了，推测是策划为最低程度干扰游戏内容或玩家间交互，减弱了ui层面的视觉干扰，为了更多**展示游戏场景内容但是削弱了交互体验** ，ui上有优化空间，适当调大，尝试其他颜色，能够增加交互体验。
  * **文本** ：文本采用的多是白色，在游戏场景复杂的情况下会导致文本辨识度低，当然也有按钮底板是透明的缘故，根本原因是**文本对比度低，文本字体偏小** ；在文本背景复杂的情况下，可以增加文本描边，形成对比，增加辨识度，也可以适当增加文本大小；笔者上一个项目规范，文本字体最小为18号，可供参考，个人认为尽量不能够小于16号，当然也要根据实际使用情况而定


#### 角色列表
![角色列表](https://oss.nepakina.cn/blog/Screenshot_20250311_015021.jpg)
角色列表
  * **排列规则** ：角色列表排序采用的是固定顺序。根据功能定位，该功能是玩家养成角色入口，应该考虑玩家使用过程中的便利性，快速定位玩家可能需要查看的角色；目前表现更像是图鉴系统。对于玩家，展示玩家已经拥有的角色应当有着更高的优先级 ，不必着急将玩家未拥有的角色展示给玩家，没有的角色，且不能查看信息，会增加玩家挫败感，基于此就可以将排序改为：优先展示玩家已获取的角色，再根据玩家常用角色（等级、好感等）进行优先度的区分 ；抽取的新角色也可以优先展示。。哪怕你抄也行啊，求求你别原创了；何必为了每个画师而单独分一栏，是为玩家考虑还是为画师考虑，looking my eyes，回答我！ 
  * **辨识度** ：角色按钮的辨识度不够突出，主要元素为：名称+立绘；名称文本由于复杂的立绘背景，导致可阅读性降低；可以将立绘部分进行遮盖，提供一个干净的文本背景，或增加描边，目的是增加文本的辨识度。笔者认为文本能够比立绘更快识别 
  * **滑动方向** ：由于按钮长度较长，横向滑动需要更长的时间才能够完成一列的滑动，再基于双手持屏时，玩家手指不利于横向滑动，故更推荐采用竖向滑动的方式。


#### 糟糕的抽卡界面
![抽卡结果](https://oss.nepakina.cn/blog/Screenshot_20250311_001330.jpg)
抽卡结果
  * 类型区分：图中难以直接区分抽卡结果，除第一张卡是角色以外，其余卡片皆为装备；途中主要通过卡片背景微弱的紫光以及抽卡回馈的服装票数量来区分，对比表现不明显。
  * 图片边缘：图片边界模糊，两张图片之间完全链接在一起，仅通过立绘颜色对比进行区分，甚至能够看到部分立绘边缘接近融入背景中（如第四、第十张）。为更好让玩家集中注意力，可以将立绘进行封边，以更好地区分。
  * 锯齿状排布：立绘成锯齿状排布，没有一条对齐，玩家视线时从左到右的，但是锯齿状排布会干扰玩家视线；例如我如果对齐排布的话，玩家视线从左到右趋于一条直线，一扫而过顺畅无比；图中锯齿状会呈现从左到右的一条波浪线，视线动荡不利于玩家获取信息。总觉得游戏美术喜欢搞一些若有若无的设计在里面，为了更好看更有设计感，但是一点也不好用
  * 按钮：抽卡按钮和底图的对比度偏低，也没有层次感，会导致其不明显（就和我所使用的黄色字体一样看不清是一个道理）。


#### 奇怪的主菜单（这块说不好，但是就是怪）
![菜单](https://oss.nepakina.cn/blog/Screenshot_20250312_150136.jpg)
菜单
  * 风格变化：游戏内整体ui风格呈现扁平化，用色谨慎，对比度低的特点；菜单界面，风格变化较大，使用色彩也更加丰富，与游戏场景等内容对比过于突出/违和。
  * 功能重复：菜单采用左侧弹窗的形式表现，这样做可以大幅度减轻打开菜单而对游戏内容的打断感，玩家仍然可以关注游戏内容，但界面的其他信息仍然存在，图中角色、活动在左侧窗口菜单和右上角都有显示，出现部分重复；并非不能重复，将菜单作为游戏内功能集合，会使菜单使用便捷性大大提升，个人推荐可以将游戏主界面ui常用功能放置于菜单第二个分页内，使菜单的引导功能更加完整，参考原神、鸣潮那种。
  * 优先级：前面有提到阅读顺序是从左往右的，底部操作栏共四个功能：拍照、公告、邮件、设置，拍照功能排在第一位，交互更快，也就显得更重要，就和你去迪卡龙他们会把热销产品放在最前端让用户一眼看到一样；这里的摆放顺序仁者见仁，从策划角度来看，可能是希望让玩家多用拍照（玩法缺广度，只能调景深）；摆放顺序应该考虑功能的使用频率，分类等客观条件，主观意见有说服力就行。
  * icon设计：icon设计与游戏缺乏关联度，通过“探索员”的两种图案对比就能够看出，一个功能，两种图案，没有统一性，增加认知成本。


赞2
如果觉得文章对你有用，请随意赞赏
[交互设计](https://blog.nepakina.cn/tags/gameux)
* * *
开放空间—UX体验分析
[https://blog.nepakina.cn/archives/开放空间ux体验](https://blog.nepakina.cn/archives/%E5%BC%80%E6%94%BE%E7%A9%BA%E9%97%B4ux%E4%BD%93%E9%AA%8C)
###### 作者
斐波那契兔
###### 发布于
2025-03-11
###### 更新于
2025-04-15
###### 许可协议
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.zh "CC BY 4.0")
[](http://connect.qq.com/widget/shareqq/index.html?url=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2F%25E5%25BC%2580%25E6%2594%25BE%25E7%25A9%25BA%25E9%2597%25B4ux%25E4%25BD%2593%25E9%25AA%258C&title=%E5%BC%80%E6%94%BE%E7%A9%BA%E9%97%B4%E2%80%94UX%E4%BD%93%E9%AA%8C%E5%88%86%E6%9E%90%20-%20%F0%9F%A5%95%E8%90%9D%E5%8D%9C%E5%85%94%E5%86%9C%E5%9C%BA%F0%9F%90%87%7C%E6%8B%BE%E8%8D%92%E5%9F%BA%E5%9C%B0&source=https%3A%2F%2Fblog.nepakina.cn&desc=%E5%8D%B7%E6%AF%9B%E7%9A%84%E4%BA%A4%E4%BA%92%E8%AE%BE%E8%AE%A1%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0&pics=https%3A%2F%2Foss.nepakina.cn%2Fblog%2FScreenshot_20250311_215230.jpg&summary=%E5%8D%B7%E6%AF%9B%E7%9A%84%E4%BA%A4%E4%BA%92%E8%AE%BE%E8%AE%A1%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0 "QQ")[](http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2F%25E5%25BC%2580%25E6%2594%25BE%25E7%25A9%25BA%25E9%2597%25B4ux%25E4%25BD%2593%25E9%25AA%258C&title=%E5%BC%80%E6%94%BE%E7%A9%BA%E9%97%B4%E2%80%94UX%E4%BD%93%E9%AA%8C%E5%88%86%E6%9E%90%20-%20%F0%9F%A5%95%E8%90%9D%E5%8D%9C%E5%85%94%E5%86%9C%E5%9C%BA%F0%9F%90%87%7C%E6%8B%BE%E8%8D%92%E5%9F%BA%E5%9C%B0&desc=%E5%8D%B7%E6%AF%9B%E7%9A%84%E4%BA%A4%E4%BA%92%E8%AE%BE%E8%AE%A1%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0&summary=%E5%8D%B7%E6%AF%9B%E7%9A%84%E4%BA%A4%E4%BA%92%E8%AE%BE%E8%AE%A1%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0&site=https%3A%2F%2Fblog.nepakina.cn&pics=https%3A%2F%2Foss.nepakina.cn%2Fblog%2FScreenshot_20250311_215230.jpg "QQ空间") 微信扫一扫：分享 ![微信分享](https://blog.nepakina.cn/archives/%E5%BC%80%E6%94%BE%E7%A9%BA%E9%97%B4ux%E4%BD%93%E9%AA%8C) [](https://service.weibo.com/share/share.php?url=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2F%25E5%25BC%2580%25E6%2594%25BE%25E7%25A9%25BA%25E9%2597%25B4ux%25E4%25BD%2593%25E9%25AA%258C&title=%E5%BC%80%E6%94%BE%E7%A9%BA%E9%97%B4%E2%80%94UX%E4%BD%93%E9%AA%8C%E5%88%86%E6%9E%90%20-%20%F0%9F%A5%95%E8%90%9D%E5%8D%9C%E5%85%94%E5%86%9C%E5%9C%BA%F0%9F%90%87%7C%E6%8B%BE%E8%8D%92%E5%9F%BA%E5%9C%B0&pic=https%3A%2F%2Foss.nepakina.cn%2Fblog%2FScreenshot_20250311_215230.jpg&appkey= "新浪微博")[](http://shuo.douban.com/!service/share?href=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2F%25E5%25BC%2580%25E6%2594%25BE%25E7%25A9%25BA%25E9%2597%25B4ux%25E4%25BD%2593%25E9%25AA%258C&name=%E5%BC%80%E6%94%BE%E7%A9%BA%E9%97%B4%E2%80%94UX%E4%BD%93%E9%AA%8C%E5%88%86%E6%9E%90%20-%20%F0%9F%A5%95%E8%90%9D%E5%8D%9C%E5%85%94%E5%86%9C%E5%9C%BA%F0%9F%90%87%7C%E6%8B%BE%E8%8D%92%E5%9F%BA%E5%9C%B0&text=%E5%8D%B7%E6%AF%9B%E7%9A%84%E4%BA%A4%E4%BA%92%E8%AE%BE%E8%AE%A1%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0&image=https%3A%2F%2Foss.nepakina.cn%2Fblog%2FScreenshot_20250311_215230.jpg&starid=0&aid=0&style=11 "豆瓣")[](http://www.linkedin.com/shareArticle?mini=true&ro=true&title=%E5%BC%80%E6%94%BE%E7%A9%BA%E9%97%B4%E2%80%94UX%E4%BD%93%E9%AA%8C%E5%88%86%E6%9E%90%20-%20%F0%9F%A5%95%E8%90%9D%E5%8D%9C%E5%85%94%E5%86%9C%E5%9C%BA%F0%9F%90%87%7C%E6%8B%BE%E8%8D%92%E5%9F%BA%E5%9C%B0&url=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2F%25E5%25BC%2580%25E6%2594%25BE%25E7%25A9%25BA%25E9%2597%25B4ux%25E4%25BD%2593%25E9%25AA%258C&summary=%E5%8D%B7%E6%AF%9B%E7%9A%84%E4%BA%A4%E4%BA%92%E8%AE%BE%E8%AE%A1%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0&source=https%3A%2F%2Fblog.nepakina.cn&armin=armin "Linkedin")[](https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2F%25E5%25BC%2580%25E6%2594%25BE%25E7%25A9%25BA%25E9%2597%25B4ux%25E4%25BD%2593%25E9%25AA%258C "FaceBook")[](https://twitter.com/intent/tweet?text=%E5%BC%80%E6%94%BE%E7%A9%BA%E9%97%B4%E2%80%94UX%E4%BD%93%E9%AA%8C%E5%88%86%E6%9E%90%20-%20%F0%9F%A5%95%E8%90%9D%E5%8D%9C%E5%85%94%E5%86%9C%E5%9C%BA%F0%9F%90%87%7C%E6%8B%BE%E8%8D%92%E5%9F%BA%E5%9C%B0&url=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2F%25E5%25BC%2580%25E6%2594%25BE%25E7%25A9%25BA%25E9%2597%25B4ux%25E4%25BD%2593%25E9%25AA%258C&via=https%3A%2F%2Fblog.nepakina.cn "Twitter")[](https://plus.google.com/share?url=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2F%25E5%25BC%2580%25E6%2594%25BE%25E7%25A9%25BA%25E9%2597%25B4ux%25E4%25BD%2593%25E9%25AA%258C "Google")
[ 游戏随笔-荒野的伤口机制 ](https://blog.nepakina.cn/archives/%E6%B8%B8%E6%88%8F%E9%9A%8F%E7%AC%94-%E8%8D%92%E9%87%8E%E7%9A%84%E4%BC%A4%E5%8F%A3%E6%9C%BA%E5%88%B6) [ 算法思维训练（七）| 树🎈 ](https://blog.nepakina.cn/archives/algorithm-tree)
### 评论
![斐波那契兔](https://q1.qlogo.cn/g?b=qq&nk=1420935912&s=640)
斐波那契兔
0R
四川 · 成都
文章
27
分类
7
标签
18
[ ](https://github.com/nepakina "Github主页") [ ](tencent://message/?uin=1476911135&Site=&Menu=yes "QQ聊天") [ ](https://blog.nepakina.cn/rss.xml "RSS订阅")
音乐
分类
  * [ 默认分类 2 ](https://blog.nepakina.cn/categories/default)
  * [ 基础理论 6 ](https://blog.nepakina.cn/categories/basic-theory)
  * [ 学习笔记 7 ](https://blog.nepakina.cn/categories/study-note)
  * [ 算法笔记 15 ](https://blog.nepakina.cn/categories/algorithm)
  * [ 兴趣爱好 2 ](https://blog.nepakina.cn/categories/hobbies)
  * [ 游戏体验随笔 3 ](https://blog.nepakina.cn/categories/game-log)
  * [ 游戏交互设计 1 ](https://blog.nepakina.cn/categories/game-ux)


标签
[理论知识](https://blog.nepakina.cn/tags/theoretical-knowledge) [分布式](https://blog.nepakina.cn/tags/distributed) [随笔](https://blog.nepakina.cn/tags/note) [算法](https://blog.nepakina.cn/tags/algorithm) [体验](https://blog.nepakina.cn/tags/experience) [交互设计](https://blog.nepakina.cn/tags/gameux) [其他](https://blog.nepakina.cn/tags/other) [转载](https://blog.nepakina.cn/tags/reprinted) [原创](https://blog.nepakina.cn/tags/original) [定时任务](https://blog.nepakina.cn/tags/schedule) [Spring](https://blog.nepakina.cn/tags/spring) [Redis](https://blog.nepakina.cn/tags/redis) [分布式存储](https://blog.nepakina.cn/tags/distributed-storage) [IDE](https://blog.nepakina.cn/tags/ide) [三方集成](https://blog.nepakina.cn/tags/tripartite-function-integration) [分布式事务](https://blog.nepakina.cn/tags/distributed-transaction) [MyBatis](https://blog.nepakina.cn/tags/mybatis) [Java](https://blog.nepakina.cn/tags/java)
公告
过去已经不能改变，但或许，我们可以改变未来。
人生倒计时
今日已经过去15 小时
63%
这周已经过去5 天
71%
本月已经过去2 天
6%
今年已经过去10 个月
83%
目录
  * 前言
  * UX分析
    * 主界面
    * 角色列表
    * 糟糕的抽卡界面
    * 奇怪的主菜单（这块说不好，但是就是怪）


最新文章
  * [法线贴图的叠加处理 · 随笔](https://blog.nepakina.cn/archives/normal-combine "法线贴图的叠加处理 · 随笔")
  * [算法思维训练（九）| 前缀树🎈](https://blog.nepakina.cn/archives/algorithm-prefixtree "算法思维训练（九）| 前缀树🎈")
  * [【Java】AtCoder Beginner Contest 402](https://blog.nepakina.cn/archives/abc402 "【Java】AtCoder Beginner Contest 402")
  * [算法思维训练（八）| 堆🎈](https://blog.nepakina.cn/archives/algorithm-heap "算法思维训练（八）| 堆🎈")
  * [游戏随笔-荒野的伤口机制](https://blog.nepakina.cn/archives/%E6%B8%B8%E6%88%8F%E9%9A%8F%E7%AC%94-%E8%8D%92%E9%87%8E%E7%9A%84%E4%BC%A4%E5%8F%A3%E6%9C%BA%E5%88%B6 "游戏随笔-荒野的伤口机制")


友链
  * [ 小余同学技术分享站 www.nafees.top ](https://www.nafees.top/)
  * [ 追梦算法 acm.mangata.ltd ](http://acm.mangata.ltd/)
  * [ 玖涯博客 blog.nineya.com ](https://blog.nineya.com/)
  * [ 华岁云小屋 www.vlo.cc ](https://www.vlo.cc/)
  * [ BruisesL's blog bruisesl.github.io ](https://bruisesl.github.io/)
  * [ nukix的工具箱 blog.uso6.com ](https://blog.uso6.com)
  * [ 漫宅博客 blog.mangata.ltd ](http://blog.mangata.ltd/)
  * [ TG小站 3322898.cn ](https://3322898.cn)


最新评论
  * ![智慧的猪儿虫](https://cravatar.cn/avatar/d41d8cd98f00b204e9800998ecf8427e?s=256&d=monsterid)
智慧的猪儿虫
2025-04-24
[tql](https://blog.nepakina.cn/archives/abc402#comment-wrapper)
  * ![浩瀚星河](https://cravatar.cn/avatar/1941d2251ac38404065a1efc825b2dc9?s=256&d=monsterid)
浩瀚星河
2024-11-29
[大佬好，我更换域名了(原域名为https://blog.codepzj.cn)，麻烦修改下友链信息，谢谢 { “title”: “浩瀚星河”, “url”: “https://haohanxinghe.com", “avatar”: “https://haohanxinghe.com/assets/images/avatar.jpg", “screenshot”: “https://image.codepzj.cn/image/202410022148697.png", “description”: “代码，日常，生活” }](https://blog.nepakina.cn/archives/algorithm-tree#comment-wrapper)


公告
过去已经不能改变，但或许，我们可以改变未来。
人生倒计时
今日已经过去15 小时
63%
这周已经过去5 天
71%
本月已经过去2 天
6%
今年已经过去10 个月
83%
目录
  * 前言
  * UX分析
    * 主界面
    * 角色列表
    * 糟糕的抽卡界面
    * 奇怪的主菜单（这块说不好，但是就是怪）


最新文章
  * [法线贴图的叠加处理 · 随笔](https://blog.nepakina.cn/archives/normal-combine "法线贴图的叠加处理 · 随笔")
  * [算法思维训练（九）| 前缀树🎈](https://blog.nepakina.cn/archives/algorithm-prefixtree "算法思维训练（九）| 前缀树🎈")
  * [【Java】AtCoder Beginner Contest 402](https://blog.nepakina.cn/archives/abc402 "【Java】AtCoder Beginner Contest 402")
  * [算法思维训练（八）| 堆🎈](https://blog.nepakina.cn/archives/algorithm-heap "算法思维训练（八）| 堆🎈")
  * [游戏随笔-荒野的伤口机制](https://blog.nepakina.cn/archives/%E6%B8%B8%E6%88%8F%E9%9A%8F%E7%AC%94-%E8%8D%92%E9%87%8E%E7%9A%84%E4%BC%A4%E5%8F%A3%E6%9C%BA%E5%88%B6 "游戏随笔-荒野的伤口机制")


友链
  * [ 小余同学技术分享站 www.nafees.top ](https://www.nafees.top/)
  * [ 追梦算法 acm.mangata.ltd ](http://acm.mangata.ltd/)
  * [ 玖涯博客 blog.nineya.com ](https://blog.nineya.com/)
  * [ 华岁云小屋 www.vlo.cc ](https://www.vlo.cc/)
  * [ BruisesL's blog bruisesl.github.io ](https://bruisesl.github.io/)
  * [ nukix的工具箱 blog.uso6.com ](https://blog.uso6.com)
  * [ 漫宅博客 blog.mangata.ltd ](http://blog.mangata.ltd/)
  * [ TG小站 3322898.cn ](https://3322898.cn)


最新评论
  * ![智慧的猪儿虫](https://cravatar.cn/avatar/d41d8cd98f00b204e9800998ecf8427e?s=256&d=monsterid)
智慧的猪儿虫
2025-04-24
[tql](https://blog.nepakina.cn/archives/abc402#comment-wrapper)
  * ![浩瀚星河](https://cravatar.cn/avatar/1941d2251ac38404065a1efc825b2dc9?s=256&d=monsterid)
浩瀚星河
2024-11-29
[大佬好，我更换域名了(原域名为https://blog.codepzj.cn)，麻烦修改下友链信息，谢谢 { “title”: “浩瀚星河”, “url”: “https://haohanxinghe.com", “avatar”: “https://haohanxinghe.com/assets/images/avatar.jpg", “screenshot”: “https://image.codepzj.cn/image/202410022148697.png", “description”: “代码，日常，生活” }](https://blog.nepakina.cn/archives/algorithm-tree#comment-wrapper)


弹
  * [ ![🥕萝卜兔农场🐇](https://blog.nepakina.cn/upload/logo1.0.png) ![🥕萝卜兔农场🐇](https://blog.nepakina.cn/upload/logo1.0.png) ](https://blog.nepakina.cn/)
  * © 2026 斐波那契兔[蜀ICP备2023028534号-1](http://beian.miit.gov.cn/publish/query/indexFirst.action)Powered by [Halo](https://github.com/nineya/halo-plus) & [Dream](https://github.com/nineya/halo-theme-dream)
建站00天0时0分0秒
[![公网安备](https://blog.nepakina.cn/themes/dream/source/img/ga.png)川公网安备 51010702003573号](https://beian.mps.gov.cn/#/query/webSearch?code=51010702003573)
本站由[![云服务商](https://ts4.cn.mm.bing.net/th?id=ODLS.630ccce4-f7e5-4ff9-96a7-3168d9680493&w=32&h=32)](https://cloud.tencent.com/)提供云服务


