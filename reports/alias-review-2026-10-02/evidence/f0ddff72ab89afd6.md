![avatar](https://www.heyiki.top/)
[文章 62](https://www.heyiki.top/archives/)[标签 66](https://www.heyiki.top/tags/)[分类 19](https://www.heyiki.top/categories/)
* * *
[ 首页](https://www.heyiki.top/)
[ 文章](javascript:void\(0\);)
  * [ 时间轴](https://www.heyiki.top/archives/)
  * [ 标签](https://www.heyiki.top/tags/)
  * [ 分类](https://www.heyiki.top/categories/)


[ 友链](javascript:void\(0\);)
  * [ 友链](https://www.heyiki.top/link/)
  * [ 朋友圈](https://www.heyiki.top/fcircle/)
  * [ 工具](https://www.heyiki.top/tools/)


[ 关于](https://www.heyiki.top/about/)
[ 后台](https://qexo.heyiki.top)
[小Q同学](https://www.heyiki.top/)
搜索
[ 首页](https://www.heyiki.top/)
[ 文章](javascript:void\(0\);)
  * [ 时间轴](https://www.heyiki.top/archives/)
  * [ 标签](https://www.heyiki.top/tags/)
  * [ 分类](https://www.heyiki.top/categories/)


[ 友链](javascript:void\(0\);)
  * [ 友链](https://www.heyiki.top/link/)
  * [ 朋友圈](https://www.heyiki.top/fcircle/)
  * [ 工具](https://www.heyiki.top/tools/)


[ 关于](https://www.heyiki.top/about/)
[ 后台](https://qexo.heyiki.top)
[Nginx安装nginx-http-concat模块方法](https://www.heyiki.top/posts/feb4a903.html "Nginx安装nginx-http-concat模块方法")
发表于2025-4-9|[Nginx](https://www.heyiki.top/tags/Nginx/)•[nginx-http-concat](https://www.heyiki.top/tags/nginx-http-concat/)
nginx-http-concat 是一个用于合并多个 CSS/JS 文件的 Nginx 模块，类似于 Apache 的 mod_concat。可以避免一个页面加载多个js或css导致页面加载耗时较长。 nginx-http-concat是阿里云开发的nginx开源组件，可以在nginx编译安装时添加模块，也可以在已安装的nginx中重新添加模块。 对已安装的Nginx添加nginx-http-concat模块已安装的nginx添加module，需要重新进行编译覆盖，这点与apache不同，apache只需要添加module，然后添加引用即可。 添加nginx编译脚本 查看当前nginx版本，命令：/usr/local/sbin/nginx -v 下载相应的nginx源码版本，地址：http://nginx.org/download/ 上传到服务器并解压 添加nginx-http-concat源码 下载module，git地址：https://github.com/alibaba/nginx-http-concat 上传到服务器并解压，本实验解压地址：/usr/local/ngi ...
[Disposable Email Verifier 进行一次性邮件验证](https://www.heyiki.top/posts/443a7741.html "Disposable Email Verifier 进行一次性邮件验证")
发表于2024-8-7|[Golang](https://www.heyiki.top/tags/Golang/)•[Disposable Email](https://www.heyiki.top/tags/Disposable-Email/)•[一次性邮件](https://www.heyiki.top/tags/%E4%B8%80%E6%AC%A1%E6%80%A7%E9%82%AE%E4%BB%B6/)•[验证](https://www.heyiki.top/tags/%E9%AA%8C%E8%AF%81/)
在今天的互联网环境中，垃圾邮件和虚假注册是常见的问题。为了应对这些挑战，我们可以使用一次性邮件验证工具来确保电子邮件地址的有效性。 Disposable Email Verifier 是一个用于验证电子邮件是否为一次性邮件服务提供商（如 TempMail、Mailinator 等）地址的开源工具。本文将介绍如何使用这个工具进行一次性邮件验证。 介绍Disposable Email Verifier 是一个用 Golang 编写的项目，旨在识别和过滤一次性邮件地址。一次性邮件地址通常用于临时注册和避免垃圾邮件，因此在很多应用中需要进行过滤，以保证用户注册的邮箱真实有效。 特性 支持多种一次性邮件服务提供商的识别。 轻量级且易于集成。 高效的邮箱验证机制。 功能 一次性电子邮件检查：验证电子邮件地址是否来自一次性电子邮件提供商。 速率限制：支持每日请求限制以防止滥用。 自动域更新：定期更新一次性电子邮件域列表。 要求 Go 1.18 或更高版本 用于部署的 Vercel 帐户 数据源https://github.com/disposable/disposable-email-doma ...
[golang使用protobuf](https://www.heyiki.top/posts/8c5a24c7.html "golang使用protobuf")
发表于2023-8-30|[Golang](https://www.heyiki.top/tags/Golang/)•[protobuf](https://www.heyiki.top/tags/protobuf/)•[protoc](https://www.heyiki.top/tags/protoc/)•[微服务](https://www.heyiki.top/tags/%E5%BE%AE%E6%9C%8D%E5%8A%A1/)
下载地址https://github.com/protocolbuffers/protobuf/releases 找到对应系统版本下载，如window（mac 可以用brew包管理）下载之后解压，在环境变量中path增加protobuf的解压之后的路径D:\Program Files\protoc-24.2-win64\bin 查看是否安装成功 12终端输入命令：protoc --version终端返回：libprotoc 3.11.4 利用protoc生成文件 下载go插件（这里是新版操作） 123go get google.golang.org/grpcgo install google.golang.org/protobuf/cmd/protoc-gen-go@latestgo install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest 创建 .proto 后缀的文件名 12345678910111213141516171819202122232425// 版本号，不声明默认proto2版本syntax = & ...
[js文件上传中file、bolb、base64图片之间的相互转化](https://www.heyiki.top/posts/12a146bb.html "js文件上传中file、bolb、base64图片之间的相互转化")
发表于2023-6-6|[Javascript](https://www.heyiki.top/tags/Javascript/)•[文件流](https://www.heyiki.top/tags/%E6%96%87%E4%BB%B6%E6%B5%81/)•[上传](https://www.heyiki.top/tags/%E4%B8%8A%E4%BC%A0/)
介绍 file(文件流)、bolb(本地流)、base64(二进制流) file File 接口提供有关文件的信息，并允许网页中的 JavaScript 访问其内容。 通常情况下， File 对象是来自用户在一个 元素上选择文件后返回的 FileList 对象,也可以是来自由拖放操作生成的 DataTransfer 对象，或者来自 HTMLCanvasElement 上的 mozGetAsFile() API。在Gecko中，特权代码可以创建代表任何本地文件的File对象，而无需用户交互 File 对象是特殊类型的 Blob，且可以用在任意的 Blob 类型的 context 中。比如说， FileReader, URL.createObjectURL(), createImageBitmap(), 及 XMLHttpRequest.send() 都能处理 Blob 和 File。 blob Blob 对象表示一个不可变、原始数据的类文件对象。指向的是本地的临时地址，Blob 表示的不一定是JavaScript原生格式的数据。File 接口基于Blob，继承了 blob 的功能并 ...
[Golang Gin框架的路由使用](https://www.heyiki.top/posts/fb2ef2c2.html "Golang Gin框架的路由使用")
发表于2023-5-25|[Golang](https://www.heyiki.top/tags/Golang/)•[Gin框架](https://www.heyiki.top/tags/Gin%E6%A1%86%E6%9E%B6/)•[路由](https://www.heyiki.top/tags/%E8%B7%AF%E7%94%B1/)
在 Gin 框架中，路由是指 Web 应用程序中的 URL。Gin 框架中的路由定义了客户端请求的 URL 和处理该请求的函数之间的映射关系。Gin 框架支持多种类型的路由，包括 GET、POST、PUT、DELETE 等，可以根据需要进行选择。 路由基础下面是一个使用 Gin 框架的路由的示例：首先，导入 Gin 包，然后，创建一个 Gin 实例 12import "github.com/gin-gonic/gin"r := gin.Default() 接着，定义路由： 123r.GET("/", func(c *gin.Context) { c.String(http.StatusOK, "Hello, Gin!")}) 这里使用 r.GET() 定义了一个 GET 请求路由，当客户端请求根路径时，返回一个字符串 “Hello, Gin!”。 除了 GET 请求之外，Gin 框架还支持其他类型的请求，例如，定义一个 POST 请求路由： 12345r.POST("/user", ...
[一次性邮箱列表](https://www.heyiki.top/posts/e469bd5c.html "一次性邮箱列表")
发表于2023-5-24|[一次性邮箱](https://www.heyiki.top/tags/%E4%B8%80%E6%AC%A1%E6%80%A7%E9%82%AE%E7%AE%B1/)
市面上的邮箱校验价格有些许贵，而且暂时所需的功能暂时不用那么多，为了避免部分使用一次性邮箱占用内存空间，在github找到这个（有不定期更新） https://disposable.github.io/disposable-email-domains/domains.json
[Golang 中的 base64.DecodeString()函数示例](https://www.heyiki.top/posts/35a19081.html "Golang 中的 base64.DecodeString\(\)函数示例")
发表于2023-5-23|[Golang](https://www.heyiki.top/tags/Golang/)•[base64](https://www.heyiki.top/tags/base64/)
Go 语言为 base64 编码/解码提供内置支持，并具有可用于使用 base64 包对给定数据执行操作的函数。该包提供了DecodeString()函数，用于将 base64字符串解码为其明文形式。它支持使用标准和 URL 兼容的 base64 标准进行解码。 句法： 1func (enc *Encoding) DecodeString(s string) ([]byte, error) 与解码器一起使用的编码类型有 4 种变化： StdEncoding：它是 RFC 4648 标准定义的标准编码。 RawStdEncoding：它是 RFC 4648 标准定义的标准编码，只是省略了填充字符。 URLEncoding：它是 RFC 4648 标准定义的 URL 编码。它通常用于编码 URL 和文件名。 RawURLEncoding：它是 RFC 4648 标准定义的 URL 编码。它通常用于对 URL 和文件名进行编码，只是省略了填充字符。 返回值：它返回给定 base64字符串表示的字节。
[坑：golang xorm Update为0不更新处理](https://www.heyiki.top/posts/bfe4b216.html "坑：golang xorm Update为0不更新处理")
发表于2023-5-23|[Golang](https://www.heyiki.top/tags/Golang/)•[xorm](https://www.heyiki.top/tags/xorm/)
更新数据使用Update方法，Update方法的第一个参数为需要更新的内容，可以为一个结构体指针或者一个Map[string]interface{}类型。当传入的为结构体指针时，只有非空和0的field才会被作为更新的字段。当传入的为Map类型时，key为数据库Column的名字，value为要更新的内容。 123user := new(User)user.Name = "myname"affected, err := engine.Id(id).Update(user) 这里需要注意，Update会自动从user结构体中提取非0和非nil得值作为需要更新的内容，因此，如果需要更新一个值为0，则此种方法将无法实现，因此有两种选择： 通过添加Cols函数指定需要更新结构体中的哪些值，未指定的将不更新，指定了的即使为0也会更新。 1affected, err := engine.Id(id).Cols("age").Update(&user) 通过传入map[string]interface{}来进行更新，但这时需要额外指定更新到哪个表 ...
[异步加载js的方式](https://www.heyiki.top/posts/d6ed8f1b.html "异步加载js的方式")
发表于2023-5-22|[Javascript](https://www.heyiki.top/tags/Javascript/)•[异步加载](https://www.heyiki.top/tags/%E5%BC%82%E6%AD%A5%E5%8A%A0%E8%BD%BD/)
异步加载js的三种方式1.defer 异步加载 特点 ：只有IE适用，需等到dom文档全部解析完（dom树生成完，才会被执行） 1<script type="text/javascript" src="xxx.js" defer></script> 2.async异步加载 特点：加载完就执行，async 只能加载外部脚本，不能把js代码写在script标签里 1<script type="text/javascript" src="xxx.js" async></script> 3.动态创建script标签 特点：避免HTML文件过大，提高页面加载速度 123456789101112131415161718192021222324/** * 异步加载js，通过加载完成js之后，再执行callback方法 * @param url * @param callback */export function loadScript(url,callback) ...
[golang使用结构标签启用具有默认值的结构](https://www.heyiki.top/posts/3f9ead7c.html "golang使用结构标签启用具有默认值的结构")
发表于2023-5-22|[Golang](https://www.heyiki.top/tags/Golang/)•[struct](https://www.heyiki.top/tags/struct/)
https://github.com/mcuadros/go-defaults 效果原golang结构体订单的字符串或布尔值，序列化得到的默认值会是空字符串或false；golang json序列化结构体的时候，json存在的字段会保留，如果json不存在的字段，将会拿结构体tags标签的default为默认值 坑：如果有用json.Unmarshal，defaults.SetDefaults必须在其前面执行安装go get github.com/mcuadros/go-defaults 例子12345678910111213141516171819202122232425262728type SetDefault struct { Name string `json:"name"` Gender int `json:"gender" default:"1"` InSchool bool `json:"in_school" default:"true"`& ...
1[2](https://www.heyiki.top/page/2/#content-inner)…[7](https://www.heyiki.top/page/7/#content-inner)[](https://www.heyiki.top/page/2/#content-inner)
![avatar](https://npm.elemecdn.com/heyiki-cdn/img/avatar.webp)
Heyiki
梦在旅途，永不止步。
[文章 62](https://www.heyiki.top/archives/)[标签 66](https://www.heyiki.top/tags/)[分类 19](https://www.heyiki.top/categories/)
[收藏我的博客](JavaScript:AddFavorite\('https://www.heyiki.top','Heyiki%E5%8D%9A%E5%AE%A2'\))
[](https://github.com/Heyiki "Github")[](https://gitee.com/Heyiki "Gitee")[](http://wpa.qq.com/msgrd?v=3&uin=1186933877&site=qq&menu=yes "联系我")[](https://www.heyiki.top/atom.xml "SSR")
最新文章
[Nginx安装nginx-http-concat模块方法](https://www.heyiki.top/posts/feb4a903.html "Nginx安装nginx-http-concat模块方法")2025-04-09
[Disposable Email Verifier 进行一次性邮件验证](https://www.heyiki.top/posts/443a7741.html "Disposable Email Verifier 进行一次性邮件验证")2024-08-07
[golang使用protobuf](https://www.heyiki.top/posts/8c5a24c7.html "golang使用protobuf")2023-08-30
[js文件上传中file、bolb、base64图片之间的相互转化](https://www.heyiki.top/posts/12a146bb.html "js文件上传中file、bolb、base64图片之间的相互转化")2023-06-06
[Golang Gin框架的路由使用](https://www.heyiki.top/posts/fb2ef2c2.html "Golang Gin框架的路由使用")2023-05-25
标签
[Ajax](https://www.heyiki.top/tags/Ajax/)[PHP](https://www.heyiki.top/tags/PHP/)[Hexo](https://www.heyiki.top/tags/Hexo/)[叨叨](https://www.heyiki.top/tags/%E5%8F%A8%E5%8F%A8/)[Linux](https://www.heyiki.top/tags/Linux/)[FFmpeg](https://www.heyiki.top/tags/FFmpeg/)[Golang](https://www.heyiki.top/tags/Golang/)[版本管理](https://www.heyiki.top/tags/%E7%89%88%E6%9C%AC%E7%AE%A1%E7%90%86/)[工具](https://www.heyiki.top/tags/%E5%B7%A5%E5%85%B7/)[Gin框架](https://www.heyiki.top/tags/Gin%E6%A1%86%E6%9E%B6/)[路由](https://www.heyiki.top/tags/%E8%B7%AF%E7%94%B1/)[Nginx](https://www.heyiki.top/tags/Nginx/)[nginx-http-concat](https://www.heyiki.top/tags/nginx-http-concat/)[CURL](https://www.heyiki.top/tags/CURL/)[phpword](https://www.heyiki.top/tags/phpword/)[支付](https://www.heyiki.top/tags/%E6%94%AF%E4%BB%98/)[数组](https://www.heyiki.top/tags/%E6%95%B0%E7%BB%84/)[Python](https://www.heyiki.top/tags/Python/)[Swoole](https://www.heyiki.top/tags/Swoole/)[ThinkPHP5](https://www.heyiki.top/tags/ThinkPHP5/)
网站资讯
文章数目 :
62
已运行时间 :
2891 天
本站总字数 :
39.8k
本站访客数 :
本站总访问量 :
最后更新时间 :
2025-4-10
©2018 - 2025 By Heyiki
[![](https://www.heyiki.top/)](https://hexo.io/)[![](https://www.heyiki.top/)](https://butterfly.js.org/)[![](https://www.heyiki.top/)](https://www.jsdelivr.com/)[![](https://www.heyiki.top/)](https://coding.net/)[![](https://www.heyiki.top/)](https://github.com/)[![](https://www.heyiki.top/)](http://creativecommons.org/licenses/by-nc-sa/4.0/)
搜索
数据库加载中
* * *
