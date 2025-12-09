# AGENTS

## 核心概念

links/*.yml中

```yml
 site:
   name: 我的博客
   description: 分享编程和技术相关的文章
   url: https://example.com
   friends:
     - name: 编程小站
       url: https://codehub.example.com
     - name: 技术前沿
       url: https://techfrontier.example.com

```

这里的**yml**名字同时也是`site`的`url` 我们叫作**核心节点**

`friends`里面的节点数组我们统称**友链节点**

由于可能存在核心节点互相成为友链节点，所以在总统计时，需要排重


## 添加友链
 添加你的博客及其友链（建议为博客），汇聚到这个巨大的网络中吧！

 在 `links/{yoursite}.yml` 中填写

 格式：

 ```yml
 site:
   name: 我的博客
   description: 分享编程和技术相关的文章
   url: https://example.com
   friends:
     - name: 编程小站
       url: https://codehub.example.com
     - name: 技术前沿
       url: https://techfrontier.example.com
 ```
