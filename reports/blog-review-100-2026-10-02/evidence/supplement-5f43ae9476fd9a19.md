[跳转到内容](https://note-of-me.top/post/Nuxt-And-Vue-Report#VPContent)
[ノート of 我](https://note-of-me.top/ "ノート of 我")
  * [文章](https://note-of-me.top/post/Nuxt-And-Vue-Report)
  * [规范](https://note-of-me.top/spec)
  * [友链](https://note-of-me.top/friend)
  * [Minecraft](https://note-of-me.top/Minecraft)
  * [应用](https://app.note-of-me.top)


简体中文 (zh-CN)
  * [English (en)](https://note-of-me.top/en/post/Nuxt-And-Vue-Report)
  * [日本語 (ja)](https://note-of-me.top/ja/post/Nuxt-And-Vue-Report)


  * [](https://github.com/Cierra-Runis)


### 布局切换
### 页面最大宽度
100%
### 内容最大宽度
80%
菜单
页面导航
Sidebar Navigation 
  * [Nuxt 和 Vue 使用报告 ](https://note-of-me.top/post/Nuxt-And-Vue-Report)
[新主页，新气象 ](https://note-of-me.top/post/New-Blog-New-Life)
[爱好 ](https://note-of-me.top/post/Hobbies)
[编程语言杂谈 ](https://note-of-me.top/post/Programming-Languages-Talk)
[如何学习编程语言 ](https://note-of-me.top/post/How-To-Learning-Programming-Language)
[GB? GiB~ GeB! ](https://note-of-me.top/post/GB-GiB-GeB)
[Prettier 与 ESLint ](https://note-of-me.top/post/Prettier-And-ESLint)
[网络 ](https://note-of-me.top/post/Network)
[多设备协同与自定义 ](https://note-of-me.top/post/Multi-Device-Collaboration-And-Customize)
[计算机教育中缺失的一课 ](https://note-of-me.top/post/Missing-Semester)
[Git ](https://note-of-me.top/post/Git)
[Next.js 和 React 使用报告（二） ](https://note-of-me.top/post/NextJs-And-React-Report-2)
[SSH ](https://note-of-me.top/post/SSH)
[Minecraft ](https://note-of-me.top/post/Minecraft)
[大家好啊，我是日本游学 ](https://note-of-me.top/post/Japan-Exposure)
[ArkUI 使用报告（二） ](https://note-of-me.top/post/ArkUI-Report-2)
[ArkUI 使用报告 ](https://note-of-me.top/post/ArkUI-Report)
[SwiftUI 使用报告 ](https://note-of-me.top/post/SwiftUI-Report)
[更好的排版 ](https://note-of-me.top/post/Better-Typography)
[Next.js 和 React 使用报告 ](https://note-of-me.top/post/NextJs-And-React-Report)
[React Native 使用报告（二） ](https://note-of-me.top/post/React-Native-Report-2)
[杂货 ](https://note-of-me.top/post/Rubbish)
[React Native 使用报告 ](https://note-of-me.top/post/React-Native-Report)
[LaTeX 使用报告 ](https://note-of-me.top/post/LaTeX-Report)
[Python 包与 Email 提醒 ](https://note-of-me.top/post/Python-Package-With-Email-Notification)
[有关符号链接的小问题 ](https://note-of-me.top/post/Issue-With-Symbolic-Link)
[云盘同步及 Obsidian 相关 ](https://note-of-me.top/post/Cloud-Drive-Sync-And-Obsidian-Related)
[Flutter 使用报告 ](https://note-of-me.top/post/Flutter-Report)


页面导航
  * [Vue](https://note-of-me.top/post/Nuxt-And-Vue-Report#vue "Vue")
  * [Nuxt](https://note-of-me.top/post/Nuxt-And-Vue-Report#nuxt "Nuxt")
  * [总结](https://note-of-me.top/post/Nuxt-And-Vue-Report#%E6%80%BB%E7%BB%93 "总结")


# Nuxt 和 Vue 使用报告 [​](https://note-of-me.top/post/Nuxt-And-Vue-Report#nuxt-%E5%92%8C-vue-%E4%BD%BF%E7%94%A8%E6%8A%A5%E5%91%8A)
使用报告系列来到 [Nuxt](https://nuxt.com) 和 [Vue.js](https://vuejs.org) 啦！稍微谈谈使用感受和与 [Next.js 和 React](https://note-of-me.top/post/NextJs-And-React-Report) 的对比。
## Vue [​](https://note-of-me.top/post/Nuxt-And-Vue-Report#vue)
Vue 将代码部分 `<template>` 和 `<script>` 分开，这一点与 React 的 JSX/TSX 不同，完全写在 JavaScript/TypeScript 文件里，而 Vue 为了实现这种写法，单独创立了 `.vue` 文件格式。
我先谈谈 `<template>` 的优点吧 —— 在使用如 [Nuxt UI](https://ui.nuxt.com) 这种组件库时，能使用如 `<template header>` 这样的插槽语法，对于页面的布局，是非常方便的。相比之下，React 就需要结合使用 CSS 来实现类似的布局，然而 CSS 嘛…… 我是很难写懂的。
此外扯一点 Edge 和 Chrome 浏览器的开发者工具，对于 CSS 样式的问题排查，支持真的实在是太差劲了。某个元素的样式为什么不生效，它只置灰，但完全不会告诉你原因。据说 Firefox 的开发者工具做得更好一些，虽然我没有亲自使用过。
`<script>` 部分的代码和 React 的写法差不多，都是 JavaScript/TypeScript 代码，状态管理也差不多 —— 现在的很多大前端框架都在向函数式组件和 Hooks 这种写法靠拢了，Vue 也不例外。就是组合起来，可能会出现某些问题，比如重复渲染、死循环等。就我最近工作上参与的同一家公司的两个项目而言，会出现 `Ctrl` + `S` 保存后，热更新的页面失去状态，且无法再向后端发起 HTTP 请求的问题。我大致猜测是它把某些状态放在了某个组件里，在热更新时重置了这个组件的状态，导致整个页面的状态丢失。
此外实际上还有 `<style>` 部分，但我并不认为这是好的写法，我还是觉得样式离组件应该越近越好，也就是，应该使用 Tailwind CSS 这种写法，直接在 `<template>` 里写样式。
需要吐槽的地方来了。
一是组件的属性通常定义在 `<script>` 里的 `defineProps` 中。虽然 IDE 能提供提示，但如果只是打开源码阅读，还是得先找到 `defineProps` 的位置，才能知道这个组件到底有哪些属性。尤其是组件代码比较长的时候，经常需要来回滚动查找。
此外，Vue 本身其实也需要导入组件，只不过很多项目都会使用自动导入方案，例如 Nuxt 或各种组件自动注册插件。这样一来，模板里确实可以直接写组件名，不用手动写 `import`。但代价是组件名称往往和文件名、目录结构绑定得比较紧。重命名组件时，经常需要同步调整文件名；遇到名称冲突时，也往往要通过修改文件名或目录结构来解决。相比之下，React 更倾向于显式导入和导出，组件名称与文件名没有那么强的关联，在重构时通常会更灵活一些。
## Nuxt [​](https://note-of-me.top/post/Nuxt-And-Vue-Report#nuxt)
这么好框架，我非常喜欢。它和 Next.js 非常相似，因此好处什么的我也不多说。
但我此外还得多说说它的模块系统，Nuxt 的模块系统非常强大，提供了很多官方和第三方的模块，可以轻松地集成各种功能，比如认证、国际化、PWA 支持等等。这样的生态，Next.js 是没有的。
就它的 [Nuxt Content](https://content.nuxt.com/) 模块而言，是最触动我的一点。Next.js 还得结合 [Contentlayer](https://contentlayer.dev) 这种第三方库来实现类似的功能 —— 注意，官方确实支持 SSG，但并没有提供一个专门的内容管理系统来处理 Markdown 文件等内容资源。
现在 [note-of-me.top](https://note-of-me.top) 的博客使用的是 VitePress，但如果以后想要对标 Next.js 时期的博客，Nuxt Content 必然会是我的下一个选择 —— 这样复杂度必然会上去就是了（（。
## 总结 [​](https://note-of-me.top/post/Nuxt-And-Vue-Report#%E6%80%BB%E7%BB%93)
竟然不坏！竟然远超预期！
那么恭喜 Nuxt 成为我喜欢的仅次于或者说并列于 Next.js 的前端框架了！
[ 在 GitHub 上编辑此页](https://github.com/Cierra-Runis/note-of-me.top/edit/main/docs/zh-CN/post/Nuxt-And-Vue-Report.md)
最后更新于: 2026年9月15日 21:22:21
Pager
[下一页新主页，新气象](https://note-of-me.top/post/New-Blog-New-Life)
0 / 0
#### 布局切换
调整 VitePress 的布局样式，以适配不同的阅读习惯和屏幕环境
##### 全部展开
使侧边栏和内容区域占据整个屏幕的全部宽度
##### 全部展开，但侧边栏宽度可调
侧边栏宽度可调，但内容区域宽度不变，调整后的侧边栏将可以占据整个屏幕的最大宽度
##### 全部展开，且侧边栏和内容区域宽度均可调
侧边栏宽度可调，但内容区域宽度不变，调整后的侧边栏将可以占据整个屏幕的最大宽度
##### 原始宽度
原始的 VitePress 默认布局宽度
#### 页面最大宽度
调整 VitePress 布局中页面的宽度，以适配不同的阅读习惯和屏幕环境
##### 调整页面最大宽度
一个可调整的滑块，用于选择和自定义页面最大宽度
#### 内容最大宽度
调整 VitePress 布局中内容区域的宽度，以适配不同的阅读习惯和屏幕环境
##### 调整内容最大宽度
一个可调整的滑块，用于选择和自定义内容最大宽度
