[云萧的咕咕屋](https://blog.crrashh.com/) [主站](https://www.crrashh.com)[友人帐](https://blog.crrashh.com/friends)[关于](https://blog.crrashh.com/about)[归档](https://blog.crrashh.com/posts)
[主站](https://www.crrashh.com)[友人帐](https://blog.crrashh.com/friends)[关于](https://blog.crrashh.com/about)[归档](https://blog.crrashh.com/posts)
云萧的咕咕屋
以万象之不息，致不息之万象
![博主头像](https://i.cdn.crrashh.com/avatar.jpg)
云萧是个咕咕怪
大二狗，在前端路上奋斗的一只人类
[ 21 文章 ](https://blog.crrashh.com/posts)
4
分类
7
标签
本页内容
分类
[ 前端 5 ](https://blog.crrashh.com/posts?category=%E5%89%8D%E7%AB%AF)[ 搞机 5 ](https://blog.crrashh.com/posts?category=%E6%90%9E%E6%9C%BA)[ 折腾 9 ](https://blog.crrashh.com/posts?category=%E6%8A%98%E8%85%BE)[ 闲谈 2 ](https://blog.crrashh.com/posts?category=%E9%97%B2%E8%B0%88)
标签
[技术16](https://blog.crrashh.com/posts?tag=%E6%8A%80%E6%9C%AF "技术（16）")[折腾11](https://blog.crrashh.com/posts?tag=%E6%8A%98%E8%85%BE "折腾（11）")[前端5](https://blog.crrashh.com/posts?tag=%E5%89%8D%E7%AB%AF "前端（5）")[安卓4](https://blog.crrashh.com/posts?tag=%E5%AE%89%E5%8D%93 "安卓（4）")[碎碎念2](https://blog.crrashh.com/posts?tag=%E7%A2%8E%E7%A2%8E%E5%BF%B5 "碎碎念（2）")[闲谈2](https://blog.crrashh.com/posts?tag=%E9%97%B2%E8%B0%88 "闲谈（2）")[Windows1](https://blog.crrashh.com/posts?tag=Windows "Windows（1）")
  

分享一下字节跳动内部的前端 cdn
2026-08-13  9 分钟  6033 字  [前端](https://blog.crrashh.com/posts?category=%E5%89%8D%E7%AB%AF)
[前端](https://blog.crrashh.com/posts?category=%E5%89%8D%E7%AB%AF) [#技术](https://blog.crrashh.com/posts?tag=%E6%8A%80%E6%9C%AF)[#前端](https://blog.crrashh.com/posts?tag=%E5%89%8D%E7%AB%AF)
咕咕负责的某项目由于正式上线后访问人数增加，加上我自己的其它网站的流量，dogecloud 家的免费 CDN 额度很快就跑完了。进后台一看，流量大头在第三方库的 chunk，于是就想着使用公共 CDN 分流一下。不过境内除了阿里的 [npmmirror 镜像站](https://www.npmmirror.com/)，似乎就没啥大厂在做前端资源镜像了。
之前字节有一个旧的 CDNJS 镜像为：[静态资源公共库](https://cdn.bytedance.com/)，虽然现在关停了，但经过实测，将域名改为以下域名之后仍然可用，不过版本几乎都停在 2022 年了。
  * lf[3|6|9|26]-cdn-tos.bytedcdn.com
  * s[0-4].pstatp.com


然后就是偶然发现字节内部维护了一个 unpkg 系统，探索了一下发现，相比起旧的 CDNJS 镜像，虽然这个 unpkg 里面也不是最新的，但多数库的版本也是最近半年内的版本，相比起来新了很多。故此处整理一下，分享给各位使用。
**本文仅做技术分享，由此产生的纠纷或其它问题，博主概不负责。**
资源 Base URL：
  * <https://unpkg.byted-static.com/>
  * https:// 【访问字节旗下任意网站，找一个以 `sf` 开头的资源域名】/obj/unpkg/


资源访问格式：`{BaseURL}/{npm 包名}/{包版本}/{文件路径}`
举个例子：
  * <https://unpkg.byted-static.com/react/19.2.8/index.js>
  * <https://sf3-ttcdn-tos.pstatp.com/obj/unpkg/react/19.2.8/index.js>


提醒
  * 部分包带 `@` 前缀的，使用时需要去掉此符号
  * 版本为斜体的，说明其已长期无更新，或字节收录的版本太旧
  * 版本打了横杠的，说明其提供的版本比旧版 CDNJS 镜像更老，不建议使用
  * 另外，部分包虽然存在，但是其 npm 包内并没有浏览器环境可直接引用的 umd/iife 版本（如 highlight.js），故不在下表统计之内，或者不用超链接标记。


更新时间：2026-08-16  
收录数量：43  
| vue (v2)  |  2.7.16[](https://unpkg.byted-static.com/vue/2.7.16/dist/vue.min.js "新标签页打开链接")  |  
| --- | --- |  
| vue  |  3.5.40[](https://unpkg.byted-static.com/vue/3.5.40/dist/vue.global.prod.js "新标签页打开链接")  |  
| --- | --- |  
| vue-router  |  4.6.4[](https://unpkg.byted-static.com/vue-router/4.6.4/dist/vue-router.global.prod.js "新标签页打开链接")  |  
| --- | --- |  
| element-ui  |  2.15.14[](https://unpkg.byted-static.com/element-ui/2.15.14/lib/index.js "新标签页打开链接")  |  
| --- | --- |  
| element-plus  |  2.14.3[](https://unpkg.byted-static.com/element-plus/2.14.3/dist/index.full.min.js "新标签页打开链接")  |  
| --- | --- |  
| react  |  18.3.1[](https://unpkg.byted-static.com/react/18.3.1/umd/react.production.min.js "新标签页打开链接")  |  
| --- | --- |  
| react (v19+)  | 19.2.8  |  
| --- | --- |  
| react-dom  |  18.3.1[](https://unpkg.byted-static.com/react-dom/18.3.1/umd/react-dom.production.min.js "新标签页打开链接")  |  
| --- | --- |  
| react-dom (v19+)  | 19.2.6  |  
| --- | --- |  
| react-router  |  6.30.1[](https://unpkg.byted-static.com/react-router/6.30.1/dist/umd/react-router.production.min.js "新标签页打开链接")  |  
| --- | --- |  
| react-router-dom  |  6.30.1[](https://unpkg.byted-static.com/react-router-dom/6.30.1/dist/umd/react-router-dom.production.min.js "新标签页打开链接")  |  
| --- | --- |  
| @remix-run/router  |  1.23.0[](https://unpkg.byted-static.com/remix-run/router/1.23.0/dist/router.umd.min.js "新标签页打开链接")  |  
| --- | --- |  
| preact  |  10.29.1[](https://unpkg.byted-static.com/preact/10.29.1/dist/preact.min.umd.js "新标签页打开链接")  |  
| --- | --- |  
| antd  |  5.29.3[](https://unpkg.byted-static.com/antd/5.29.3/dist/antd.min.js "新标签页打开链接")  |  
| --- | --- |  
| @douyinfe/semi-ui  |  见 npm 详情页[](https://www.npmjs.com/package/@douyinfe/semi-ui "新标签页打开链接")  |  
| --- | --- |  
| @arco-design/web-react  |  见 npm 详情页[](https://www.npmjs.com/package/@arco-design/web-react "新标签页打开链接")  |  
| --- | --- |  
| @arco-design/web-vue  |  见 npm 详情页[](https://www.npmjs.com/package/@arco-design/web-vue "新标签页打开链接")  |  
| --- | --- |  
| axios  |  1.19.0[](https://unpkg.byted-static.com/axios/1.19.0/dist/axios.min.js "新标签页打开链接")  |  
| --- | --- |  
| lodash  |  4.17.21[](https://unpkg.byted-static.com/lodash/4.17.21/lodash.min.js "新标签页打开链接")  |  
| --- | --- |  
| less  |  4.2.0[](https://unpkg.byted-static.com/less/4.2.0/dist/less.min.js "新标签页打开链接")  |  
| --- | --- |  
| js-cookie  |  3.0.5[](https://unpkg.byted-static.com/js-cookie/3.0.5/dist/js.cookie.min.js "新标签页打开链接")  |  
| --- | --- |  
| marked  |  18.0.4[](https://unpkg.byted-static.com/marked/18.0.4/lib/marked.umd.js "新标签页打开链接")  |  
| --- | --- |  
| echarts  |  6.1.0[](https://unpkg.byted-static.com/echarts/6.1.0/dist/echarts.min.js "新标签页打开链接")  |  
| --- | --- |  
| qs  |  6.11.2[](https://unpkg.byted-static.com/qs/6.11.2/dist/qs.js "新标签页打开链接")  |  
| --- | --- |  
| dayjs  |  1.11.21[](https://unpkg.byted-static.com/dayjs/1.11.21/dayjs.min.js "新标签页打开链接")  |  
| --- | --- |  
| prismjs  |  1.29.0[](https://unpkg.byted-static.com/prismjs/1.29.0/prism.js "新标签页打开链接")  |  
| --- | --- |  
| animejs  |  3.2.1[](https://unpkg.byted-static.com/animejs/3.2.1/lib/anime.min.js "新标签页打开链接")  |  
| --- | --- |  
| pdfjs-dist  |  5.4.530[](https://unpkg.byted-static.com/pdfjs-dist/5.4.530/dist/pdf.min.mjs "新标签页打开链接")  |  
| --- | --- |  
| highlight.js  | 11.11.1  |  
| --- | --- |  
| docsify  |  4.13.1[](https://unpkg.byted-static.com/docsify/4.13.1/lib/docsify.min.js "新标签页打开链接")  |  
| --- | --- |  
| swiper  |  11.2.10[](https://unpkg.byted-static.com/swiper/11.2.10/swiper-bundle.min.js "新标签页打开链接")  |  
| --- | --- |  
| xgplayer  |  3.0.24[](https://unpkg.byted-static.com/xgplayer/3.0.24/dist/index.min.js "新标签页打开链接")  |  
| --- | --- |  
| aplayer  |  1.10.0[](https://unpkg.byted-static.com/aplayer/1.10.0/dist/APlayer.min.js "新标签页打开链接")  |  
| --- | --- |  
| dplayer  |  1.10.0[](https://unpkg.byted-static.com/aplayer/1.10.0/dist/APlayer.min.js "新标签页打开链接")  |  
| --- | --- |  
| cropperjs  |  1.6.1[](https://unpkg.byted-static.com/cropperjs/1.6.1/dist/cropper.min.js "新标签页打开链接")  |  
| --- | --- |  
| quill  |  1.3.7[](https://unpkg.byted-static.com/quill/1.3.7/dist/quill.min.js "新标签页打开链接")  |  
| --- | --- |  
| d3  |  7.9.0[](https://unpkg.byted-static.com/d3/7.9.0/dist/d3.min.js "新标签页打开链接")  |  
| --- | --- |  
| moment  |  2.30.1[](https://unpkg.byted-static.com/moment/2.30.1/min/moment.min.js "新标签页打开链接")  |  
| --- | --- |  
| flv.js  |  1.6.2[](https://unpkg.byted-static.com/flv.js/1.6.2/dist/flv.min.js "新标签页打开链接")  |  
| --- | --- |  
| jquery  |  4.0.0[](https://unpkg.byted-static.com/jquery/4.0.0/dist/jquery.min.js "新标签页打开链接")  |  
| --- | --- |  
| normalize.css  |  8.0.1[](https://unpkg.byted-static.com/normalize.css/8.0.1/normalize.css "新标签页打开链接")  |  
| --- | --- |  
| nprogress  |  0.2.0[](https://unpkg.byted-static.com/nprogress/0.2.0/nprogress.js "新标签页打开链接")  |  
| --- | --- |  
| bootstrap  |  5.3.8[](https://unpkg.byted-static.com/bootstrap/5.3.8/dist/js/bootstrap.min.js "新标签页打开链接")  |  
| --- | --- |  
**分享一下字节跳动内部的前端 cdn**
<https://blog.crrashh.com/posts/21-bytedance-unpkg.html>
除特殊声明转载之外，本文由博主云萧原创且非 AI 生成内容，依据 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 许可协议授权，若需转载请注明出处及本声明。 
[ 上一篇 利用漏洞给 OPPO Find X8 解 BL 锁 ](https://blog.crrashh.com/posts/20-root-my-finx8)
发送
  * 最新
  * 最热
  * 最早
  * 作者


加载更多
Powered By [Artalk](https://artalk.js.org "Artalk v2.10.0")
发送
  * 最新
  * 最热
  * 最早
  * 作者


加载更多
Powered By [Artalk](https://artalk.js.org "Artalk v2.10.0")
© 2022-2026 crrashh1542.
[蜀ICP备2022029657号-2](https://beian.miit.gov.cn) | [萌ICP备20220551号](https://icp.gov.moe/?keyword=20220551)
Powered by Astro & [ Rudeus Theme ](https://github.com/crrashh1542/astro-theme-rudeus) v0.4.3-o-s2prod+ 
