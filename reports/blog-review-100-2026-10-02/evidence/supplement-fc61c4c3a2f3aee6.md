[ ![logo](https://fifcom.cn/avatar/?transparent=1)FIFCOM实验室](https://blog.fifcom.cn/ "FIFCOM实验室 \(Alt + H\)")
  * [ 标签 ](https://blog.fifcom.cn/tags/ "标签")
  * [ 主页 ](https://fifcom.cn/ "主页")
  * [ 朋友们 ](https://blog.fifcom.cn/tags/friends/ "朋友们")


[Home](https://blog.fifcom.cn/) » [Posts](https://blog.fifcom.cn/posts/)
#  Flume 常用Source 
May 11, 2022 · 1 min · FIFCOM | [支持我](https://fifcom.cn/aff/?from=61c389caa31f73f1601ace6ee9ebe3ed)
首先应确定master和slave上都安装了Flume，如果slave上没有，可以将master上的传过去

```
scp -r /opt/flume/ root@slave1:/opt/

```
copy
#### 配置一级Flume[#](https://blog.fifcom.cn/posts/flume-common-source/#%E9%85%8D%E7%BD%AE%E4%B8%80%E7%BA%A7flume)
在master上创建netcat-avro.conf，意思是一级flume从444端口收集信息，再从555端口以avro格式发到二级flume

```
cd /opt/flume/conf
vi netcat-avro.conf
=>
a1.sources = r1  
a1.channels = c1  
a1.sinks = k1

a1.sources.r1.type = netcat  
a1.sources.r1.bind = master  
a1.sources.r1.port = 444

a1.sinks.k1.type = avro  
a1.sinks.k1.channel = c1  
a1.sinks.k1.hostname=slave1  
a1.sinks.k1.port = 555

a1.channels.c1.type = memory  
a1.channels.c1.capacity = 100  
a1.channels.c1.transactionCapacity = 100

a1.sources.r1.channels = c1  
a1.sinks.k1.channel = c1
<=

```
copy
#### 配置二级Flume[#](https://blog.fifcom.cn/posts/flume-common-source/#%E9%85%8D%E7%BD%AE%E4%BA%8C%E7%BA%A7flume)
在slave上创建avro-logger.conf，意思是二级flume从555端口收集信息

```
cd /opt/flume/conf
vi avro-logger.conf
=>
a1.sources = r1  
a1.channels = c1  
a1.sinks = k1

a1.sources.r1.type = avro  
a1.sources.r1.bind = slave1  
a1.sources.r1.port = 555

  
a1.sinks.k1.type = logger

a1.channels.c1.type = memory  
a1.channels.c1.capacity = 100  
a1.channels.c1.transactionCapacity = 100

a1.sources.r1.channels = c1  
a1.sinks.k1.channel = c1
<=

```
copy
#### 启动一级和二级Flume[#](https://blog.fifcom.cn/posts/flume-common-source/#%E5%90%AF%E5%8A%A8%E4%B8%80%E7%BA%A7%E5%92%8C%E4%BA%8C%E7%BA%A7flume)
首先在slave上启动二级Flume

```
cd /opt/flume
bin/flume-ng agent --conf conf --conf-file conf/avro-logger.conf --name a1 -Dflume.root.logger=INFO,console

```
copy
![二级](https://cdn.fifcom.cn/blog/9jPRZa8.png)
接着在master上启动一级Flume

```
cd /opt/flume
bin/flume-ng agent --conf conf --conf-file conf/netcat-avro.conf --name a1 -Dflume.root.logger=INFO,console

```
copy
![一级](https://cdn.fifcom.cn/blog/McaCerv.png)
#### 测试[#](https://blog.fifcom.cn/posts/flume-common-source/#%E6%B5%8B%E8%AF%95)
使用telnet命令连接master

```
telnet master 444

```
copy
并在telnet中输入数据 ![telnet](https://cdn.fifcom.cn/blog/hUWA01L.png)
可以看到slave的二级Flume节点接受到了数据 ![slaveflume](https://cdn.fifcom.cn/blog/bDuxBKe.png)
  * [hadoop](https://blog.fifcom.cn/tags/hadoop/)
  * [flume](https://blog.fifcom.cn/tags/flume/)

[ Next Page »   
安装Flume ](https://blog.fifcom.cn/posts/flume-install/)
[ ](https://twitter.com/intent/tweet/?text=Flume%20%e5%b8%b8%e7%94%a8Source&url=https%3a%2f%2fblog.fifcom.cn%2fposts%2fflume-common-source%2f&hashtags=hadoop%2cflume) [ ](https://telegram.me/share/url?text=Flume%20%e5%b8%b8%e7%94%a8Source&url=https%3a%2f%2fblog.fifcom.cn%2fposts%2fflume-common-source%2f)
© 2022 [FIFCOM实验室](https://blog.fifcom.cn/) Powered by [Hugo](https://gohugo.io/) & [PaperMod](https://git.io/hugopapermod) [ ](https://blog.fifcom.cn/posts/flume-common-source/#top "Go to Top \(Alt + G\)")
