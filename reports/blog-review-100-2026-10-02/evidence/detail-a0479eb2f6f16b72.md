[rvalue's blog](https://blog.rvalue.moe/ "rvalue's blog")
[ 文章 ](https://blog.rvalue.moe/posts/)[ 标签 ](https://blog.rvalue.moe/tags/)[ 分类 ](https://blog.rvalue.moe/categories/)[ 个人 ](https://rvalue.moe "Personal Index")[ About ](https://blog.rvalue.moe/about/ "关于")[ Friends ](https://blog.rvalue.moe/friends/ "关于") [ ](javascript:void\(0\); "搜索") [ ](javascript:void\(0\); "清空") [ ](javascript:void\(0\); "切换主题")
[rvalue's blog](https://blog.rvalue.moe/ "rvalue's blog")
[ ](javascript:void\(0\); "搜索") [ ](javascript:void\(0\); "清空")
[ 取消 ](javascript:void\(0\);)
[文章](https://blog.rvalue.moe/posts/)[标签](https://blog.rvalue.moe/tags/)[分类](https://blog.rvalue.moe/categories/)[个人](https://rvalue.moe "Personal Index")[About](https://blog.rvalue.moe/about/ "关于")[Friends](https://blog.rvalue.moe/friends/ "关于")[ ](javascript:void\(0\); "切换主题")
## 目录
# 博客搭建踩坑日志
[rvalue](https://rvalue.moe "Author") 收录于 [其他技术](https://blog.rvalue.moe/categories/%E5%85%B6%E4%BB%96%E6%8A%80%E6%9C%AF/)
2021-08-11 约 4068 字 预计阅读 9 分钟 
目录
  * [根域索引页](https://blog.rvalue.moe/migration-traps/#%E6%A0%B9%E5%9F%9F%E7%B4%A2%E5%BC%95%E9%A1%B5)
  * [博客本体](https://blog.rvalue.moe/migration-traps/#%E5%8D%9A%E5%AE%A2%E6%9C%AC%E4%BD%93)
    * [图床](https://blog.rvalue.moe/migration-traps/#%E5%9B%BE%E5%BA%8A)
    * [文章迁移](https://blog.rvalue.moe/migration-traps/#%E6%96%87%E7%AB%A0%E8%BF%81%E7%A7%BB)
      * [内容提取](https://blog.rvalue.moe/migration-traps/#%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96)
      * [后处理](https://blog.rvalue.moe/migration-traps/#%E5%90%8E%E5%A4%84%E7%90%86)
      * [数学公式修复](https://blog.rvalue.moe/migration-traps/#%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8F%E4%BF%AE%E5%A4%8D)
      * [mermaid 图修复](https://blog.rvalue.moe/migration-traps/#mermaid-%E5%9B%BE%E4%BF%AE%E5%A4%8D)
    * [评论系统](https://blog.rvalue.moe/migration-traps/#%E8%AF%84%E8%AE%BA%E7%B3%BB%E7%BB%9F)
    * [Algolia 搜索](https://blog.rvalue.moe/migration-traps/#algolia-%E6%90%9C%E7%B4%A2)
    * [主题 JS 的 TOC 错误](https://blog.rvalue.moe/migration-traps/#%E4%B8%BB%E9%A2%98-js-%E7%9A%84-toc-%E9%94%99%E8%AF%AF)
  * [旧站跳转引流](https://blog.rvalue.moe/migration-traps/#%E6%97%A7%E7%AB%99%E8%B7%B3%E8%BD%AC%E5%BC%95%E6%B5%81)
  * [Google Analytics](https://blog.rvalue.moe/migration-traps/#google-analytics)
  * [代码仓库](https://blog.rvalue.moe/migration-traps/#%E4%BB%A3%E7%A0%81%E4%BB%93%E5%BA%93)


由于最近开始学东西了所以打算继续维护一下博客
但是想到 cnblogs 的不稳定性以及买了一个 rvalue.moe 的域名却一直闲置, 于是就有了重新构造一个博客的想法
这里记录一下前后一个月左右时间断断续续做的过程中踩的各种坑(
## 根域索引页
不知道哪根筋搭错了于是打算把根域名做成类似索引的东西
大概主要原因是在选解决方案的时候看到了 jekyll 的 [Fuse-Core](https://github.com/tsjensen/fuse-core), 还是响应式的
fork 了一份准备先试着往 CF Pages 上部署结果就发现它拉了

```
11:26:16.794	Executing user command: jekyll build
11:26:16.795	/opt/build/bin/build: line 39: jekyll: command not found
11:26:16.797	Failed: build command exited with code: 127

```

想了想感觉应该是依赖假了, 仔细一看发现仓库里没 `Gemfile`
彳亍口巴
把 `Gemfile` 补上了大概 build 起来了
配置文件倒是格式挺好, `href` 和 font-awesome 的 class 都直接在配置文件里
然后我就发现它没看上去那么好看了: 4K 分辨率下所有的内容都挤在屏幕最上面 1/3 的位置
想了想, 感觉把这个 panel 垂直居中一下应该会好一些CSS is Awesome 警告
因为这个 panel 长宽都不定再加上懒于是只好 `flex`, 最后终于在对的地方加了个 `flex` 然后把它居中了
~~(中间略过大量在浏览器中xjb试的过程)~~
接着我发现它有个缺陷, 就是链接没有 title (鼠标放上去莫得提示), 感觉会让人不知道一些图标在干啥, 于是去模板里[补了一下](https://github.com/r-value/site-root/commit/eac0dbca784baea42ea24b0bb1bedec9568679b8)
然后就扔那不管了, 看上去效果海星At least on my browser
## 博客本体
最开始选定的是 jekyll 的 [TeXt](https://github.com/kitian616/jekyll-TeXt-theme), 感觉看上去很香的亚子
然后发现这个东西它的文件名格式定的非常死, 必须 `YYYY-MM-DD-title.md`, 感觉不太舒服
再加上在 CF pages 部署的时候发现 jekyll 的部署环境跑得慢得要死, 于是决定换 Hugo, 选定了 [LoveIt](https://github.com/dillonzq/LoveIt) 作为 theme
不过空站试部署的时候就踩坑了: CF Pages 默认的 Hugo 依赖是上古 `0.54.0`, LoveIt 的要求是 `^0.62.0`…
这个版本看上去通过 CF Pages 的部署环境变量控制, 把 `HUGO_VERSION` 改成 `0.87.0` 就好了
不过好像设置成 `latest` 或者 `LATEST` 都是假的…迷惑…
这个事情甚至出现在了 Cloudflare 官方文档的 [Known Issues](https://developers.cloudflare.com/pages/platform/known-issues) 里…明明都列出来了还不更新让我感觉十分迷惑…
### 图床
迁文章之前必然得先把图床备好(
主要是 cnblogs 的图床是有防盗链的, 直接搬过来图肯定全炸
图床控制台用的是以前校赛的时候在校内用过的 [lsky-pro](https://github.com/wisp-x/lsky-pro), 因为支持多个储存策略并且还可以抽象出统一的 API 所以感觉应该会比较合适
最开始的时候是想弄个便宜的对象存储服务的, 有国内的 CDN 是最好
转了几圈发现 upyun 好像很便宜而且还只计储存空间没有流量费的亚子(←眼瞎), 于是就尝试了一下
紧接着就发现绑不上域名, 告诉我得备案
草 我这 `.moe` 域名上哪备案去
心一横用 CF worker 写了个到测试 CDN 域名的 `fetch` 来绕路, 发现也不是不能用
> 群友: 你这个东西它流量费算在 CDN 里了啊
> 我: 草
因为担心房子被打没所以还是放弃 upyun 用了 local storage 作为储存策略
然后用 py 的 regex 写了个替换 md 图片链接的脚本备用  
|  
```
 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24

```
 |  
```
import re
import os
import sys
import requests

token = '${{secrets.token}}'
count = 0

def upload(match):
    link = match.group(1)
    extend = match.group(2)
    os.system('curl ' + link + ' > tmp.' + extend)
    r = requests.post('https://lsky.domain.name/api/upload', data={'token':token}, files={'image':open('tmp.'+extend, 'rb')})
    return match.group(0).replace(link, r.json()['data']['url'])
#   return match.group(0).replace(link, 'https://example.com/image')


with open(sys.argv[1],'r+') as f:
    txt = f.read()

txt = re.sub(r'!\[.*\]\((http.*\.(.*))\)',upload,txt)

with open(sys.argv[1],'w') as f:
    f.write(txt)

```
 |  
| --- | --- |  
~~别问我为什么用`curl` 来下载图片 问就是懒得查文档~~
### 文章迁移
从 cnblogs 迁移的话有一个好, 就是 cnblogs 提供了一个文章备份的功能, 可以导出一个 XML 文件, 包含标题/日期/链接等元数据
但是也有一些问题, 比如说不包含文章的 `tag` 和 `category` 信息以及文章格式信息, 再加上非 Markdown 文章里面是一坨 HTML, 而且代码还是高亮过的一大坨, 实在没有解析的欲望
最后决定只迁移后期的 Markdown 文章
#### 内容提取
因为 cnblogs 自从某一个版本之后就不能在文章页面的某个不可见标签下面获取 Markdown 了, 只好从导出的 XML 里摘
于是从网上随便弄了个十分 naive 的解析脚本改了改输出格式就用了, 用的是 `xmllint` 做的解析:  
|  
```
 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
14
15
16
17
18
19
20
21

```
 |  
```
#!/bin/bash
set -e
for num in {1..194}
do
  title=$(echo "cat /rss/channel/item[${num}]/title/text()" |xmllint --shell cnblogs.xml | sed '1d;$d')
  pubDate=$(echo "cat /rss/channel/item[${num}]/pubDate/text()"|xmllint --shell cnblogs.xml | sed '1d;$d')
  link=$(echo "cat /rss/channel/item[${num}]/link/text()"|xmllint --shell cnblogs.xml | sed '1d;$d')
  id=$(echo "cat /rss/channel/item[${num}]/link/text()" | xmllint --shell cnblogs.xml | sed -n '2p' | awk -F '[/.]' '{print $11}')
  datestr=$(date -d "$pubDate" +"%FT%T%:z")
  description=$(echo "cat /rss/channel/item[${num}]/description/text()" |xmllint --shell cnblogs.xml | sed -e '1d;$d' -e '2 s/<!\[CDATA\[//' | sed -e '$s/]]>$//')
  echo -n ''                    > "${id}.md"
  echo '---'                   >> "${id}.md"
  echo "title: '${title}'"     >> "${id}.md"
  echo "date: ${datestr}"      >> "${id}.md"
  echo '_TAGS_'                >> "${id}.md"
  echo 'categories: [cnblogs]' >> "${id}.md"
  echo '---'                   >> "${id}.md"
  echo ''                      >> "${id}.md"
  echo "$description"          >> "${id}.md"
done


```
 |  
| --- | --- |  
按 ID 来标记也保留了在旧博客以比较简单的方式获取新博客的文章 URL 的方法, 感觉不戳
不过问题在于无法区分文章格式, 所以 Markdown 和非 Markdown 的文章都一起提取出来了
#### 后处理
刚刚说过, 博客园导出的 XML 是没有标签元数据的
于是继续上网冲浪寻找能用的博客园相关脚本, 发现了一个按分页爬取某个博主所有文章标题的[爬虫](https://blog.csdn.net/weijiaxin2010/article/details/90020673), 于是拿来稍微改了改让它可以抓取文章的链接并跟着链接爬取对应页面的 HTML
(顺便吐槽下原版的变量名这写的都是啥)
然后分析了一下博客园的文章页面结构, 发现 Markdown 文章会在响应中有带 `.cnblogs-markdown` 的 class 的标签, 于是利用其判断是否是可迁移的文章并将已经提取出的内容分离到另一目录
就在接着尝试用选择器来选择文章的 `tag` 和 `category` 的时候, 我发现它选择出来的是空的
分析了一下网络请求发现博客园的 `tag` 和 `category` 居然是异步加载的
草
还好只是个简单的 GET 请求, 稍微重放一下就弄到了, 出来是个 HTML 片段, 丢给 bs4 问题不大(
本来以为后处理之后丢到 `posts/` 之后就万事大吉了, 结果发现问题远不止这些…
#### 数学公式修复
这个大概是折腾得最痛苦的一个
把原来的 Markdown 文本丢进去才发现 **Hugo 内部的 Markdown 解析器 Goldmark 并不支持特殊对待数学公式** , 于是会把公式中的 `\\` 换行连带换行符一起解析成一个 `<br>`, 导致 $\KaTeX$ 看见 $\TeX$ 里面的 HTML 标签直接不渲染了
折腾了半天尝试给 Goldmark 装数学插件, 翻了翻源码才意识到事情的严重性: Hugo 带来的不需要一坨 `node` 依赖的优点也带来了巨大的缺陷, 就是 Markdown 解析的部分是编译死的
这谁顶得住啊
块公式通过脚本在 `$$` 外面套了一层 `<div>` 标签让这部分文本被识别为嵌入 HTML, 部分 Markdown 语法被自动禁用于是修好了
翻了翻其它的文章, 发现[卷积](https://blog.rvalue.moe/10120714/)那一篇的行内公式中的 `*` 好像套 `<span>` 也不能禁用这部分 Markdown 语法, 于是只好给它替换成 `\*` 了
~~不过处理完之后一想, 可能还是用`\ast` 比较好~~
#### mermaid 图修复
LoveIt 提供了一个 `{{< mermaid >}}` 的 Shortcode 用来画 mermaid 图
但是我那篇[网络流](https://blog.rvalue.moe/10650849/)里面的 mermaid 图都是用 code fence 来写的
查了查用 code fence 写 mermaid 图也不是没有[解决方案](https://discourse.gohugo.io/t/use-mermaid-with-code-fences/17211), 就是直接把 `.language-mermaid` 喂给 `mermaidJS`
实操的时候发现它给我渲染了个 `.language-fallback`, 尝试枚举配置参数发现是 `guessSyntax` 的锅
警告 
`markup.highlight.guessSyntax` 设置为 `true` 时会猜测未标记语言或者标记的语言无法识别的 code fence, 如果猜测失败会添加 class `.language-fallback`. 如果未开启这个选项则会设置为 `.language-<hint>`
关了之后尝试把解决方案里的脚本加到页面里, 发现 LoveIt 是按需链接外部资源, 没有 `{{< mermaid >}}` 不给链 `mermaidJS`
投降了投降了, 写了个脚本把 mermaid 的 code fence 替换成 Shortcode 了
感觉有点破坏我平时用 Typora 写文章的工具链, 因为 Typora 的 mermaid 图是正常用 code fence 处理的
考虑到需要用 mermaid 图的文章可能不会很多, 暂且先用非标准的了
### 评论系统
本来是想用 [valine.js](https://valine.js.org) 的, 但是发现 LeanCloud 强制实名于是就咕了, 转向 [Gitalk](https://gitalk.github.io)
走了一遍流程把 API key 之类的东西丢进配置文件, build 了一下发现 Network Error
查了一遍相关 issue 发现是 gitalk 的默认 CORS Proxy 假掉了
再一看, 发现 Fixed since `1.7.2`, 而 LoveIt 还在用 `1.6.2`…于是就把 CDN 打开顺便把 CDN 的配置文件里面链接的 Gitalk 版本[改了一下](https://github.com/r-value/LoveIt/commit/a1ae49bb71555b46c44732b0f5e9a6fc8dd02def)
### Algolia 搜索
LoveIt 支持基于 [Lunr.js](https://github.com/olivernn/lunr.js/) 和基于 [Algolia](https://resources.algolia.com/) 的文章内容搜索, 而 Lunr.js 虽然开箱即用但是性能非常拉胯(点击搜索的时候会阻塞上秒, 需要加载一个随博客更新逐渐增大的 `index.json` 和一个分词库), 所以有了换 Algolia 的想法
本质上实际上是把搜索的工作从前端 JS 移动到后端
部署需要做的是在每次站点 build 之后将构建出来的 `index.json` 通过 API 或者手动 import 给 Algolia
显然每次 build 完手动上传 `index.json` 非常的不清真, 于是尝试用 GitHub Actions 自动化这个过程
此处赞美 GitHub Actions, Marketplace 随便找找就找到了可以直接用的 step. 我在[我的workflow](https://github.com/r-value/hugo-blog/blob/master/.github/workflows/main.yml)用了 [Hugo setup](https://github.com/marketplace/actions/hugo-setup) 和 [Algolia Uploader](https://github.com/marketplace/actions/algolia-uploader).
不过最开始的几次尝试踩坑了, 原因是 GitHub Action 默认的 `checkout` 是不会递归 `submodule` 的, 需要在 `with:` 里面加 `submodule: recursive` 才能正确 `checkout` 出整个仓库用来 build.
### 主题 JS 的 TOC 错误
在写 [Migration Todo](https://blog.rvalue.moe/migration-todo/) 的时候忽然注意到下面的 Gitalk 不见了
果断打开控制台, 发现这个 LoveIt 本身的 JS 写寄了…它没考虑 TOC 为空的情况
于是一个 unhandled exception 栈回溯把剩下的加载项全寄了, 好家伙
看着 dev tools 的代码不像 uglify 过的样子于是就去直接改 `src/js/theme.js`, build 之后无明显现象才发现原来是自动加载了 minify 之后的代码的 source map…
接着发现这个 LoveIt 它没配置 minify 的 workflow…阿↑西↓, 这 minify 还得我手动做啊…
贯彻遇到困难找插件的优良传统弄了个 Minify 插件把 `assets/js/theme.min.js` 和对应的 source map 也[改了](https://github.com/r-value/LoveIt/commit/0e68db3c9d1fb8521ea9651a9a5a3d02041cca93)
## 旧站跳转引流
~~引 流 之 主~~
想法大概是用 cnblogs 添加 JavaScript 的功能做一个模态框, 在访问已经迁移过的文章的时候显示一个模态质询来跳转
因为之前迁移的时候保留了文章 ID 所以感觉不会太困难
模态框库的话选择了 [vex.js](https://github.hubspot.com/vex/docs/welcome/), 看上去还算比较舒适  
|  
```
1
2
3
4
5
6
7
8

```
 |  
```
if($('#cnblogs_post_body').hasClass('cnblogs-markdown') && window.location.href.split('/').pop().split('.')[0] != '15092616'){
    vex.defaultOptions.className = 'vex-theme-default'
    vex.dialog.confirm({message: '本博客已经弃用, 是否跳转到新博客的该文章?', callback: function(value){
        if(value){
            window.location.href = 'https://blog.rvalue.moe/' + window.location.href.split('/').pop().split('.')[0];
        }
    }})
}

```
 |  
| --- | --- |  
## Google Analytics
这篇博客最开始发出去之后在 GA 报表里发现其他人的文章标题的我还不知道 我已经踏进了怎样的一个大坑
TL;DR 
GA4 统计无法做到基于源域的筛选或者白名单, 不要在个人博客用
事情开始是因为我偶然翻 GA 后台实时报表的时候发现了一些 title 后缀并不是我博客的记录, 意识到应该是不知道哪个憨憨把我博客配置文件扒走了还没改 GA 的 ID
感到震惊 GA 没有验证源域之余开始尝试做白名单, 然后就非常绝望地发现 “数据流网址” / “网域配置” 这些根本不包含限制语义
然后寻思着能不能把它过滤掉, 于是试着用 GA4 的数据过滤器, 结果一看好家伙, 过滤规则只有请求带 debug 的和内网流量这两种, 直接给我整不会了
回去翻 GA4 的官方文档, 写的那叫一个锤子, 根本不说人话
咕咕噜了一波外部资料, 发现全都是说什么 GA4 可以做 cross-domain 但是从来没有告诉我怎么限制 domain 的
换了一下 keyword 查到了[一个 GA4 tip](https://www.nwsdigital.com/Blog/GA4-Setup-tips), 它是这么写的:
> A hostname filter has been an essential part of a good GA setup for years.
> The hostname filter verifies that a user is on your website when their visit is recorded. It will block both spam traffic and traffic from your test, staging, or development environments.
> If you’ve already set up a hostname filter in your Universal Analytics (UA) account, you may think you can apply it to your GA4 property. But no – none of the UA filters will work in GA4.
> So far, there’s actually no way to create a valid hostname filter in GA4.
好家伙 直接退化了是吧
这篇文章倒是介绍了一个用 GTM 做 filter 的解决方案, 但是有折腾这个的时间我还不如换回 UA…
查了查追踪 ID 被其他人使用的情况, 发现果然不止我一个有这个问题, 比如这个 [How does Google Analytics restrict domains?](https://stackoverflow.com/questions/8899690/how-does-google-analytics-restrict-domains)
结论是:
> Google Analytics, in its default behavior, **does not** differentiate or validate the source of the data.
> If someone were to maliciously put your GA account ID on their site, you’d get their data transmitted back to your account as if you’d put it on your site yourself.
> If this becomes an issue, you could configure a Google Analytics filter to either exclude traffic from specific malicious domains, or include traffic to your specific domains.
> This is very rarely an issue that comes up for people.
考虑到这是一个 ⑨ 年前的问题, 大概指的是 UA 时期的 Google Analytics. 那个时候确实可以以比较精细的方式做 filter
其实不太理解为什么咕咕噜要在 GA4 里把 filter 砍成这个德行…而且相对 UA 更 “先进” 的数据对于个人博客来说看上去并没有什么卵用…
结论就是, 不要在个人博客用 GA4…
现在已经把站里的 GA4 统计都换成 UA 了…
## 代码仓库
各种微调过的代码都在 [@r-value](https://github.com/r-value) 名下的 repo
根域在 [r-value/site-root](https://github.com/r-value/site-root), 微调过的主题在 [r-value/LoveIt](https://github.com/r-value/LoveIt), 站点源码在 [r-value/hugo-blog](https://github.com/r-value/hugo-blog)
![https://pic.rvalue.moe/2021/08/12/fbe6d70ee9b46.jpg](https://blog.rvalue.moe/svg/loading.min.svg)
更新于 2021-08-11
[阅读原始文档](https://blog.rvalue.moe/migration-traps/index.md)
[](javascript:void\(0\); "分享到 Twitter")[](javascript:void\(0\); "分享到 Facebook")[](javascript:void\(0\); "分享到 WhatsApp")[](javascript:void\(0\); "分享到 Line")[](javascript:void\(0\); "分享到 微博")[](javascript:void\(0\); "分享到 Blogger")[](javascript:void\(0\); "分享到 Evernote")
[Hugo](https://blog.rvalue.moe/tags/hugo/), [LoveIt](https://blog.rvalue.moe/tags/loveit/) [返回](javascript:void\(0\);) | [主页](https://blog.rvalue.moe/)
[Migration Todo List](https://blog.rvalue.moe/migration-todo/ "Migration Todo List") [数字电路: 锁存器/触发器的构造设计](https://blog.rvalue.moe/structure-and-design-of-latches-and-flip-flops/ "数字电路: 锁存器/触发器的构造设计")
由 [Hugo](https://gohugo.io/ "Hugo 0.87.0") 强力驱动 | 主题 - [ LoveIt](https://github.com/dillonzq/LoveIt "LoveIt 0.2.11")
2021 - 2024 [rvalue](https://rvalue.moe) | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)
[ ](https://blog.rvalue.moe/migration-traps/ "回到顶部")[ ](https://blog.rvalue.moe/migration-traps/ "查看评论")
