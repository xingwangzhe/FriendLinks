[ the5fire ](https://www.the5fire.com/) [ 前端开发 ](https://www.the5fire.com/category/frontend/) [ Django ](https://www.the5fire.com/category/django/) [ Python ](https://www.the5fire.com/category/python/) [ 阶段总结 ](https://www.the5fire.com/category/%E9%98%B6%E6%AE%B5%E6%80%BB%E7%BB%93/) [ 读书 ](https://www.the5fire.com/category/dushux/) [ Vim ](https://www.the5fire.com/category/vim/) [ 工作录 ](https://www.the5fire.com/category/%E5%B7%A5%E4%BD%9C%E5%BD%95/) [ Linux ](https://www.the5fire.com/category/linux/) [ Nginx ](https://www.the5fire.com/category/nginx/) [ Golang ](https://www.the5fire.com/category/golang/) [ 算法 ](https://www.the5fire.com/category/algorithms/) [ 随笔 ](https://www.the5fire.com/category/suibi/)
[ ](https://www.the5fire.com/)
[首页](https://www.the5fire.com/) / [Django](https://www.the5fire.com/category/django/) / 正文
#  【置顶】《Django企业开发实战》「勘误」 
置顶 
作者: the5fire 标签: [Django](https://www.the5fire.com/tag/Django/) [Django图书](https://www.the5fire.com/tag/Django%E5%9B%BE%E4%B9%A6/) [Django教程](https://www.the5fire.com/tag/Django%E6%95%99%E7%A8%8B/) 发布: 2019-03-20 阅读: 26321
### 第一次印刷
  * 第3章 - 3.4.2 - 52 页，感谢 @止沸 的指正
    * 拼写错误，少了个s，错误内容：

```
  MIDDLEWARE = [
      'student.middleware.TimeItMiddleware',
      # 省略其他
  ]

```

    * 修订为:

```
  MIDDLEWARE = [
      'student.middlewares.TimeItMiddleware',

      # 省略其他
  ]

```

  * 第4章 - 4.2.1 小节 - 70页，感谢 @Yangzhedi 的指正
    * 拼写错误，错误内容： `$ source bin/activite`
    * 修订为： `$ source bin/activate`
  * 第5章 - 5.4.5 - 106 页, 感谢 @jasonqiao36 的指正
    * 缩进问题，错误内容：

```
  from django.db.models import F
      post = Post.objects.get(id=1)
      post.pv = F('pv') + 1
      pos.save()

```

    * 修订为:

```
  from django.db.models import F
  post = Post.objects.get(id=1)
  post.pv = F('pv') + 1
  post.save()

```

  * 第7章 - 7.2.2 小节 - 147页，感谢 @092113219，@faple 的指正
    * 缺少返回值，错误内容：

```
  @classmethod
  def latest_posts(cls):
      queryset = cls.objects.filter(status=cls.STATUS_NORMAL)| $ source bin/activate |

```

    * 修订为：

```
  @classmethod
  def latest_posts(cls):
      queryset = cls.objects.filter(status=cls.STATUS_NORMAL)
      return queryset

```



  * 第9章 - 9.5.2 - 205 页，感谢 @moneys 的指正
    * 拼写错误，错误内容：

```
  if not cache.get(uv_key):
      increase_uv = True
      cache.set(pv_key, 1, 24*60*60)

```

    * 修订为:

```
  if not cache.get(uv_key):
      increase_uv = True
      cache.set(uv_key, 1, 24*60*60)

```



### 第二印
  * 第 3 章 - 3.4.3 - 56 页 - 漏写括号， 感谢 @weixianshan 的指正
    * 错误内容：
读者可以尝试把test.py文件中的 student.sex_show 改为student.get_sex_display试试。
      * 修改为：
读者可以尝试把test.py文件中的 student.sex_show 改为student.get_sex_display()试试。
  * 第 6 章 - 6.2.2 - 122 页 typo，感谢 图灵社区 @zerosail @PaperSheep 的指正
    * 错误内容：
```
filter_horizontal = ('tags', )
filter_vertical = ('tags', )

```

    * 应改为：
```
filter_horizontal = ('tag', )
filter_vertical = ('tag', )

```

  * 第 6 章 - 6.3.1 - 130 页 - 重复，感谢 图灵社区 @zerosail 的指正
    * 错误内容： save_on_top = True
    * 该行代码与第129页的倒数第三行代码重复了
  * 第8章 - 8.2.2 - 179 页，感谢「Django企业开发实战」 @秋 的指正
    * 拼写错误，错误内容：

```
  <span class="card-link">分类:<a href="{% url 'category-list' cate.id %}">{{ post.category.name }}</a></span>

```

    * 修订为:

```
  <span class="card-link">分类:<a href="{% url 'category-list' post.category.id %}">{{ post.category.name }}</a></span>

```

  * 第11章 - 11.1.1 - 237 页，感谢 [@eat](https://github.com/eat-fan) 的指正
    * djangorestframewrok 包错写为 django-rest-framework,错误内容:

```
  pip install django-rest-framework==3.8.2

```

    * 修订为:

```
  pip install djangorestframework==3.8.2

```

  * 第 14 章 - 14.3.4 - 308 页 supervisor 已经支持 Python 3
    * 需要修改内容：

```
对这些配置有了大概的了解后，需要先来安装: ``pip install supervisor``这里需要注意的是，我们对于目前的使用方式有两种，主要是在Python 2和Python 3项目中的差别，对于Python 2的项目，我们会在虚拟环境中安装supervisor。而在Python 3中会在系统上安装，虚拟环境使用系统（全局）的supervisor来管理进程。这么用的原因在于supervisor针对Python 3的版本还没有最终release。

不过对于个人项目可以尝试直接从github安装最新的包: ``pip install git+https://github.com/Supervisor/supervisor``，使用基于兼容了Python3的版本。我们这里也是从github安装目前最新的supervisor（4.0.0dev0）。

或者使用作者fork出来的分支做的release：

  pip install https://github.com/the5fire/supervisor/archive/4.0.0dev0.zip

```

    * 修改为：

```
对这些配置有了大概的了解后，需要先来安装: ``pip install supervisor==4.0.2``。

```

  * 第14章 - 14.3.6 - 312 页
    * djangorestframewrok 包错写为 django-rest-framework,错误内容:

```
  django-rest-framework==0.1.0

```

    * 修订为:

```
  djangorestframework==3.8.2

```



### 第三印
  * 第1章 - 1.4.1 - 10 页，数据库实体对象图中 datetime 字段类型错误，感谢 Github 网友：@panxingj 的反馈
    * 错误内容为：
图中 SideBar 实体中的 created_time 字段类型设置为 str
    * 修订为
SideBar 中的 created_time 字段类型应该为 datetime
  * 第1章 - 1.4.2 - 11 页，脑图部分在线链接问题，感谢公众号读者：sky 的反馈
    * 短网址被新浪限频了，错误内容： 上图使用百度脑图工具制作，在线版：<http://t.cn/R14lkXe> 密码: GTDL
    * 修正为:
上图使用百度脑图工具制作，在线版：<http://naotu.baidu.com/file/3f7f8238a936155341cac37aaac40a66?token=96dd1b636b4bc558> 密码: GTDL
  * 第3章 - 3.4.2 - 52 页，感谢 图灵社区@hanshanjie 提醒
    * 英文语法错误，错误内容：

```
  print('request to response cose: {:.2f}s'.format(costed))

```

    * 修订为:

```
  print('request to response cost: {:.2f}s'.format(costed))

```

  * 第5章 - 5.4.2 - 103页，感谢 Github 网友 @jpch89 的指正
    * 第二行代码少了缩进：

```
try:
post = Post.objects.get(id=1)
# 其余代码省略

```

    * 修订为：

```
try:
  post = Post.objects.get(id=1)
# 其余代码省略

```

  * 第6章 - 6.1.1 - 114 页, 感谢 Github 网友 @jpch89 的指正
    * 内容优化，原内容为：

```
list_display_links: 用来配置哪些字段可以作为链接，点击它们，可以进入编辑页面。

```

    * 优化为

```
list_display_links: 用来配置哪些字段可以作为链接，点击它们，可以进入编辑页面。如果设置为 None，则表示不配置任何可点击的字段。

```

  * 第6章 - 6.2.1 - 119 页，感谢 图灵社区@limyel 提醒
    * 代码优化，待优化内容：

```
  def queryset(self, request, queryset):
      category_id = self.value()
      if category_id:
          return queryset.filter(category_id=self.value())
      return queryset

```

    * 修订为:

```
  def queryset(self, request, queryset):
      category_id = self.value()
      if category_id:
          return queryset.filter(category_id=category_id))
      return queryset

```

  * 第6章 - 6.2.4 - 123 页, 感谢 Github 网友 @jpch89 的指正
    * 字段名写错，原内容：

```
我们通过 Form 来定制 status 这个字段的展示：

```

    * 修订为：

```
我们通过 Form 来定制 desc 这个字段的展示：

```

  * 第6章 - 6.3 - 127 页, 感谢 Github 网友 @jpch89 的指正
    * 方法名写错

```
之前我们在 PostAdmin 中重写了 save 方法

```

    * 修订为

```
之前我们在 PostAdmin 中重写了 save_model 方法

```

  * 第6章 - 6.3.1 - 129 页
    * 代码优化，待优化内容：

```
  def queryset(self, request, queryset):
      category_id = self.value()
      if category_id:
          return queryset.filter(category_id=self.value())
      return queryset

```

    * 修订为:

```
  def queryset(self, request, queryset):
      category_id = self.value()
      if category_id:
          return queryset.filter(category_id=category_id))
      return queryset

```



  * 第8章 - 8.2.2 - 178 页, 感谢 Github 网友 @jpch89 的指正
    * 代码错误，action 修改为 method 原内容为：

```
<form class="form-inline my-2 my-lg-0" action='GET'>

```

    * 修订为:

```
<form class="form-inline my-2 my-lg-0" method='GET'>

```

  * 第9章 - 9.1.1 - 185页, 感谢 Github 网友 [@jpch89](https://github.com/jpch89) 的指正
    * SQL 字段写错，原内容为：

```
SELECT * FROM post WHERE title ILIKE '%<keyword>%' or title ILIKE '%<keyword>%'

```

    * 修订为:

```
SELECT * FROM post WHERE title ILIKE '%<keyword>%' or desc ILIKE '%<keyword>%'

```



未归类：
<https://github.com/the5fire/django-practice-book/issues/34>
<https://github.com/the5fire/django-practice-book/issues/35>
<https://github.com/the5fire/django-practice-book/issues/40>
提交勘误渠道：
  * Github： <https://github.com/the5fire/django-practice-book/issues>
  * 图灵社区：<http://www.ituring.com.cn/book/2663>


《Django企业开发实战》购买地址：
  * 京东：<https://item.jd.com/12537842.html>
  * 当当：<http://product.dangdang.com/26509799.html>


---- EOF ---- 
微信公众号：Python程序员杂谈 
### 相关文章
  * [ Django源码解析第一季 剧终 ](https://www.the5fire.com/999.html)
  * [ 【Django源码阅读】Django 自定义异常处理页面源码解读 ](https://www.the5fire.com/django-error-handler-source-code.html)
  * [ 知乎回答：你是如何学习Django的 ](https://www.the5fire.com/how-to-learn-django.html)
  * [ 中奖名单|《Django企业开发实战》重印之赠书活动 ](https://www.the5fire.com/991.html)
  * [ 赠书福利|《Django企业开发实战》重印了 ](https://www.the5fire.com/990.html)
  * [ 《Django企业开发实战》FAQ - 持续更新 ](https://www.the5fire.com/django-book-faq.html)
  * [ 听说你出了本书，花了多少钱？ ](https://www.the5fire.com/985.html)
  * [ 《Django企业开发实战》读者福利 & 交流群 ](https://www.the5fire.com/984.html)
  * [ 《Django企业开发实战》正式开售 ](https://www.the5fire.com/983.html)
  * [ 新增第五章模板专题【Django源码解析视频】 ](https://www.the5fire.com/979.html)


上一篇 [ 【招聘】知乎 Python工程师招聘 ](https://www.the5fire.com/986.html)
下一篇 [ 「知乎」Python 爬虫工程师招聘 ](https://www.the5fire.com/988.html)
###  公告 
微信公众号  
![](https://sss.the5fire.com/staticfile/getqrcode.jpeg)
* * *
社交账号：[知乎](https://www.zhihu.com/people/the5fire/) - [GitHub](https://github.com/the5fire/)  

* * *
  

#### 个人作品
[《Django企业开发实战》](https://book.douban.com/subject/30434690/)   
[基于Django的网站系统: Typeidea](https://github.com/the5fire/typeidea)   
  

###  热门排行（时间加权） 
  * [ python项目练习一：即时标记 ](https://www.the5fire.com/python-practice-1.html)
  * [ 知乎回答：程序员应该怎么提高自己 ](https://www.the5fire.com/self-promotion.html)
  * [ python项目练习十：DIY街机游戏 ](https://www.the5fire.com/python-project10-diy-game.html)
  * [ python项目练习二：画幅好画 ](https://www.the5fire.com/python-reportlab.html)
  * [ 自动化工具——ansible中文指南 ](https://www.the5fire.com/ansible-guide-cn.html)
  * [ bootstrap入门-做一个简单的页面 ](https://www.the5fire.com/bootstrap-introduce.html)
  * [ python对list去重的各种方法 ](https://www.the5fire.com/python-remove-duplicates-in-list.html)
  * [ 动手实现m3u8的浏览器播放器 ](https://www.the5fire.com/m3u8-web-player.html)
  * [ 知乎回答：你是如何学习Django的 ](https://www.the5fire.com/how-to-learn-django.html)
  * [ 终于录完了，112G的Django视频教程 ](https://www.the5fire.com/django-practice-video.html)
  * [ 【置顶】《Django企业开发实战》「勘误」 ](https://www.the5fire.com/987.html)
  * [ 使用virtualenv创建虚拟python环境 ](https://www.the5fire.com/virtualenv-python-env.html)
  * [ python项目练习四：新闻聚合 ](https://www.the5fire.com/python-pro4-newsagent.html)
  * [ backbone.js入门教程PDF下载 ](https://www.the5fire.com/backbone-js-tutorials-pdf-download.html)
  * [ Backbone.js入门学习笔记目录 ](https://www.the5fire.com/backbone-tutorials-catalogue.html)


###  系列文章 
  * [《python实战》](https://www.the5fire.com/category/python%E5%AE%9E%E6%88%98)
  * [《webservice深入学习》](https://www.the5fire.com/tag/webservice%E6%B7%B1%E5%85%A5%E5%AD%A6%E4%B9%A0)
  * [《backbone.js入门笔记》](https://www.the5fire.com/tag/backbone.js%E5%85%A5%E9%97%A8)
  * [《backbone.js入门笔记第二版》](https://github.com/the5fire/backbonejs-learning-note)
  * [《读书计划》](https://www.the5fire.com/category/dushux)
  * [《python面试记》](https://www.the5fire.com/?s=python%E7%A8%8B%E5%BA%8F%E5%91%98%E6%89%BE%E5%B7%A5%E4%BD%9C%E4%B9%8B%E6%97%85)


###  最新文章 
  * [ 通过github actions部署aws lambda记录 - s3部署、ECR部署 以及固定出口IP ](https://www.the5fire.com/aws_lambda_s3_ecr_github_actions.html)
  * [ No more authentication methods to try,Permission denied (publickey) ](https://www.the5fire.com/permission-denied.html)
  * [ 创作者滞后的快乐 ](https://www.the5fire.com/creator-s-happy-life.html)
  * [ Django源码解析第一季 剧终 ](https://www.the5fire.com/999.html)
  * [ 【Django源码阅读】Django 自定义异常处理页面源码解读 ](https://www.the5fire.com/django-error-handler-source-code.html)


###  点击排行 
  * [ python项目练习一：即时标记 ](https://www.the5fire.com/python-practice-1.html)
  * [ python项目练习十：DIY街机游戏 ](https://www.the5fire.com/python-project10-diy-game.html)
  * [ python项目练习二：画幅好画 ](https://www.the5fire.com/python-reportlab.html)
  * [ python对list去重的各种方法 ](https://www.the5fire.com/python-remove-duplicates-in-list.html)
  * [ bootstrap入门-做一个简单的页面 ](https://www.the5fire.com/bootstrap-introduce.html)


###  推荐阅读 
  * [个人回忆录之年度总结索引](https://www.the5fire.com/%E7%BD%AE%E9%A1%B6--%E4%B8%AA%E4%BA%BA%E5%9B%9E%E5%BF%86%E5%BD%95%E4%B9%8B%E5%B9%B4%E5%BA%A6%E6%80%BB%E7%BB%93%E7%B4%A2%E5%BC%95.html)
  * [程序员和音乐家](https://www.the5fire.com/programmer-and-musician.html)


###  . 
© 2026 the5fire. All rights reserved.
CC BY-NC-SA 3.0
[网站地图](https://www.the5fire.com/sitemap.xml) · [友情链接](https://www.the5fire.com/links/) · [关于博主](https://www.the5fire.com/about/)
[京ICP备18049216号-1](https://beian.miit.gov.cn/)
![beian](https://sss.the5fire.com/staticfile/beian_icon.png) [京公网安备 11010502036736号](http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502036736)
