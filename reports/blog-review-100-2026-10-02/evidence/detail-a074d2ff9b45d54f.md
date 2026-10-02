[ ![了一昂梁](https://imgl.zhsher.cn/blog/config/avatar-liang.webp) ](https://blog.zhsher.cn/) 小梁&小张 
  * [ ](https://blog.zhsher.cn/ "首页") 首页 
  * [ ](https://blog.zhsher.cn/about.html "关于") 关于 
  * [ ](https://blog.zhsher.cn/hundred.html "一百件事") 一百件事 
  * [ ](https://blog.zhsher.cn/archive.html "归档") 归档 
  * [ ](https://blog.zhsher.cn/photos.html "相册") 相册 
  * [ ](https://blog.zhsher.cn/random.html "随机") 随机 
  * [ ](https://blog.zhsher.cn/link.html "友链") 友链 
  * [ ](https://zhsher.cn "之昂张") 之昂张 


  * 切换模式 
  * 返回顶部 


  * [首页](https://blog.zhsher.cn/ "首页")
  * [ 说说 ](https://blog.zhsher.cn/category/talk/ "说说")


  * 

  * [ ![了一昂梁](https://imgl.zhsher.cn/blog/config/avatar-liang.webp) ](https://blog.zhsher.cn/) 小梁&小张 


  * 

  * [首页](https://blog.zhsher.cn/ "首页")
  * [ 说说 ](https://blog.zhsher.cn/category/talk/ "说说")


  * [ 首页 ](https://blog.zhsher.cn/ "首页")
  * [ 关于 ](https://blog.zhsher.cn/about.html "关于")
  * [ 一百件事 ](https://blog.zhsher.cn/hundred.html "一百件事")
  * [ 归档 ](https://blog.zhsher.cn/archive.html "归档")
  * [ 相册 ](https://blog.zhsher.cn/photos.html "相册")
  * [ 随机 ](https://blog.zhsher.cn/random.html "随机")
  * [ 友链 ](https://blog.zhsher.cn/link.html "友链")
  * [ 之昂张 ](https://zhsher.cn "之昂张")


#  Typecho搭建杂记 
[一百件小事](https://blog.zhsher.cn/category/hundred/) ·  2023-03-06
[ 了一昂梁 ](https://blog.zhsher.cn/author/1/)
[ ![Typecho搭建杂记](https://imgl.zhsher.cn/blog/article/2023/05/top1.webp) ](https://blog.zhsher.cn/start.html "Typecho搭建杂记")
> 挑长期维护的主题、插件，第一次搭建Ty很多不懂，用Jasmine过渡一段时间
## Typecho安装配置
[Typecho源码](https://typecho.org/download)
debug模式`config.inc.php`

```
define('__TYPECHO_DEBUG__', TRUE);
```

PHP
点击复制
nginx配置rewrite 永久链接`{slug}.html`

```
if (-f $request_filename/index.html){
    rewrite (.*) $1/index.html break;
}
if (-f $request_filename/index.php){
    rewrite (.*) $1/index.php;
}
if (!-f $request_filename){
    rewrite (.*) /index.php;
}
```

nginx
点击复制
## 主题配置
### 主题选择  
| 主题  | 最后更新于  |  
| --- | --- |  
| [Jasmine](https://github.com/liaocp666/Jasmine)  | 2023.06.17  |  
| [Cuteen](https://blog.zwying.com/archives/76.html)  | 2023.06.05  |  
| [Mirages](https://get233.com/archives/mirages-intro.html)  | 2023.04.23  |  
| [handsome](https://www.ihewro.com/archives/489/)  | 2022.10.29  |  
| [Akina](https://github.com/Zisbusy/Akina-for-Typecho)  | 2022.08.05  |  
| [Nabo](https://github.com/krait-team/Nabo-theme-typecho)  | 2020.08.20  |  
| [initial](https://github.com/jielive/initial)  | 2022.02.20  |  
暂定Jasmine，Mirages比较简约好看，可能受关关哥影响。Cuteen、Handsome复杂但有时光机，问题也不大，自建memos
### 菜单配置

```
[
  {
    "name": "首页",
    "icon": "tabler:home",
    "url": "/",
    "newTab": false
  },
  {
    "name": "关于",
    "icon": "tabler:user-circle",
    "url": "/about.html",
    "newTab": false
  },
  {
    "name": "一百件事",
    "icon": "tabler:heartbeat",
    "url": "/hundred.html",
    "newTab": false
  },
  {
    "name": "归档",
    "icon": "tabler:archive",
    "url": "/archive.html",
    "newTab": false
  },
  {
    "name": "相册",
    "icon": "tabler:photo",
    "url": "/photos.html",
    "newTab": false
  },
  {
    "name": "随机",
    "icon": "tabler:arrows-random",
    "url": "/random.html",
    "newTab": false
  },
  {
    "name": "友链",
    "icon": "tabler:plane-tilt",
    "url": "/link.html",
    "newTab": false
  },
  {
    "name": "之昂张",
    "icon": "tabler:mood-boy",
    "url": "https://zhsher.cn",
    "newTab": false
  }
]
```

JavaScript
点击复制
## 域名配置
  * 域名选择、备案、提交管局、配ssl，暂定`blog.zhsher.cn`
  * 备案号 晋ICP备2022005322号
  * cdn网络分发


## 插件
  * [RSS订阅](https://blog.zhsher.cn/index.php/feed/)
  * [AAEditor](https://xiamp.net/archives/aaeditor-is-another-typecho-editor-plugin.html)：编辑器优化
  * 数据库备份
    * [benzBrake/AutoBackup](https://github.com/benzBrake/AutoBackup)
    * [jrotty/AutoBackup](https://github.com/jrotty/AutoBackup)：作者已不维护
    * 宝塔COS插件✅
  * 邮件 1、2UI相同
  * [Typecho-Plugin-Notice](https://github.com/Rainshaw/Typecho-Plugin-Notice)支持Server、Qmsg、SMTP
  * [LoveKKCommentModify](https://github.com/gogobody/LoveKKCommentModify)支持SMTP、Send Cloud、阿里云邮件
  * [Comment2Mail](https://plugins.typecho.me/plugins/Comment2Mail.html)支持SMTP，可以配置收件人✅
  * [CommentNotifier](https://github.com/jrotty/CommentNotifier)支持 SMTP 阿里云推送，可以配置收件人
  * 百度、谷歌、bing的分析
  * 百度、谷歌、51la的统计，51la灵鹊
    * 自定义头部`/www/wwwroot/blog/usr/themes/Jasmine/header.php`

```
<!--自定义-->
    <!-- Google tag (gtag.js) -->
    <!--百度统计-->
    <!--灵鹊检测-->
```

PHP
点击复制
    * [51la-Analysis-Typecho-Plugin](https://github.com/51la/51la-Analysis-Typecho-Plugin)：51la分析
  * [MoePlayer/APlayer-Typecho](https://github.com/MoePlayer/APlayer-Typecho)：播放器
  * [Mourn](https://github.com/ponycool/typecho-plugins/tree/master/Mourn)：全站变灰
  * ~~[BaiduSubmit](https://github.com/phpgao/BaiduSubmit)~~ 、[Sitemap-For-Typecho](https://github.com/ethanzhao2001/Sitemap-For-Typecho)：百度主动推送
  * [tagshelper](https://www.52txr.cn/2022/typechoPlugins.html)：标签管理


  * 评论脱敏
    * [SmartSpam](https://plugins.typecho.me/plugins/smart-spam.html)
    * [Lopwon 评论脱敏](http://www.lopwon.com/lopwon-oops.html)
    * [ty-baidu-textcensor 百度文本内容审核，过滤评论中的敏感内容](https://github.com/sy-records/ty-baidu-textcensor)
  * 图片管理
    * [typecho-cos-plugin](https://github.com/cnhongv/typecho-cos-plugin)
    * [Typecho 腾讯云 COS](https://yzfyd.cn/257.html)：附件上传COS

```
//获取文件名
$filePath='/blog/'.date('Y').'/'.date('m').'/'.date('d').'/';
$fileName=$file['name'];
```

PHP
点击复制
  * [typecho-markdown](https://github.com/mrgeneralgoo/typecho-markdown)：markdown解析
  * 友链
    * [Mejituu/Links](https://github.com/Mejituu/Links)
    * [Lopwon Links](http://www.lopwon.com/lopwon-links.html)
  * [外链自动转换插件 ShortLinks - Typecho插件](https://plugins.typecho.me/plugins/shortlinks.html)：外链转内链
  * [Typecho-AMP](https://github.com/holmesian/Typecho-AMP)：Google AMP/Baidu MIP 标准页面，进一步优化谷歌和百度的搜索结果
  * [Lopwon IP](http://www.lopwon.com/lopwon-ip.html)：评论IP
  * [typecho-AliceStyle](https://github.com/racns/AliceStyle)：美化插件 报错`defined() expects exactly 1 argument, 2 given`


相关资源
  * [ty之家](https://tyzj.cc/)
  * [Typecho Wiki](https://www.typecho.wiki/)
  * [typecho-fans/plugins](https://github.com/typecho-fans/plugins)
  * [Typecho论坛](https://forum.typecho.org/viewforum.php?f=6&sid=3ca2b873fc9e361e973d13705c5b33a1&start=25)


## 魔改
### 统计
自定义头部`/www/wwwroot/blog/usr/themes/Jasmine/header.php`
### 自定义JS

```
//修改侧边栏信息
var right_img = document.querySelector("#sidebar-right .sidebar__right__inner .flex .gap-x-3");
right_img.querySelectorAll('img')[0].setAttribute("alt", "了一昂梁");
right_img.querySelectorAll('.jasmine-primary-color')[0].innerHTML = "了一昂梁";
//设置头像
var imgElements = document.querySelectorAll("img[alt='之昂张']");
imgElements.forEach(function(element) {
    element.setAttribute("src", "https://imgl.zhsher.cn/blog/config/avatar-zhang.webp");
});
```

JavaScript
点击复制
### 灯箱
自定义css

```
.z-\[999\] {
    z-index: 500;
}
```

CSS
点击复制
自定义js

```
//图片灯箱
window.ViewImage && ViewImage.init('.markdown-body img');
```

JavaScript
点击复制
`footer.php`

```
+<script src="https://jsd.onmicrosoft.cn/gh/Tokinx/ViewImage/view-image.min.js"></script>
<script>
    <?php $this->options->customScript(); ?>
</script>
```

Diff
点击复制
### 友链
由于主题没有友链，自己小撕了一个
### 相册
[基于腾讯存储桶/Lsky实现动态相册 | 张时贰](http://zhsher.cn/posts/23204/)
[惊喜](https://blog.zhsher.cn/tag/surprise/)
[取消回复](https://blog.zhsher.cn/start.html#respond-post-1) 提交评论
  1. ![](https://cravatar.cn/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm)
[Typecho](https://typecho.org) 2023-06-23 
[回复](https://blog.zhsher.cn/start.html?replyTo=1#respond-post-1)
欢迎加入 Typecho 大家族


![了一昂梁](https://imgl.zhsher.cn/blog/config/avatar-liang.webp)
了一昂梁
从心
  * 小张
  * 小梁


热门文章
  * [命运齿轮](https://blog.zhsher.cn/ming-yun-chi-lun.html "命运齿轮")
  * [Typecho搭建杂记](https://blog.zhsher.cn/start.html "Typecho搭建杂记")
  * [香香软软的蛋糕](https://blog.zhsher.cn/xiang-xiang-ruan-ruan-de-dan-gao.html "香香软软的蛋糕")
  * [是喜欢更是心动！](https://blog.zhsher.cn/shi-xi-huan-geng-shi-xin-dong.html "是喜欢更是心动！")
  * [慢慢即漫漫](https://blog.zhsher.cn/man-man-ji-man-man.html "慢慢即漫漫")
  * [青岛](https://blog.zhsher.cn/qing-dao.html "青岛")
  * [Box Plan](https://blog.zhsher.cn/boxplan.html "Box Plan")


最新评论
  * [ 柳橙睿: 好有心啊！](https://blog.zhsher.cn/xiang-xiang-ruan-ruan-de-dan-gao.html#comment-5 "好有心啊！")
  * [ Gmc: 真是一对靓仔靓女呀~](https://blog.zhsher.cn/ming-yun-chi-lun.html#comment-2 "真是一对靓仔靓女呀~")
  * [ Typecho: 欢迎加入 Typecho 大家族](https://blog.zhsher.cn/start.html#comment-1 "欢迎加入 Typecho 大家族")


热门标签
  * [惊喜](https://blog.zhsher.cn/tag/surprise/ "惊喜")
  * [日常](https://blog.zhsher.cn/tag/daily/ "日常")
  * [说说](https://blog.zhsher.cn/tag/talk/ "说说")
  * [旅行](https://blog.zhsher.cn/tag/travel/ "旅行")
  * [露营](https://blog.zhsher.cn/tag/camp/ "露营")
  * [生日](https://blog.zhsher.cn/tag/birthday/ "生日")


关于站长
  * [晋ICP备2022005322号](https://beian.miit.gov.cn/)


2023 - 2026 了一昂梁. All Rights Reserved.
Theme [Jasmine](https://github.com/liaocp666/Jasmine "Jasmine") by [Kent Liao](https://www.liaocp.cn/ "Kent Liao")
