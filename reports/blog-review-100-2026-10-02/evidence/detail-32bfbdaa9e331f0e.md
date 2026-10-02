## LinkedHashSet源码解析
2020-09-03  | Visit count 
我们知道，HashSet内部使用HashMap存储元素，所以HashSet遍历数据时是无序的，要保证插入的元素有序，我们可以使用LinkedHashSet。本节记录LinkedHashSet源码解析，基于JDK1.8。
LinkedHashSet类层级关系如下所示：
![QQ20210225-182300@2x](https://mrbird.cc/img/QQ20210225-182300@2x.png)
LinkedHashSet继承自HashSet。查看LinkedHashSet的构造方法源码会发现内部都是调用父类的`HashSet(int initialCapacity, float loadFactor, boolean dummy)`方法：  
| 
```
1  
2  
3  

```
 | 
```
HashSet(int initialCapacity, float loadFactor, boolean dummy) {  
    map = new LinkedHashMap<>(initialCapacity, loadFactor);  
}  

```
 |  
| --- | --- |  
dummy参数没有任何意义，仅用于和别的入参为(int,float)的构造器区分开。方法内部创建的是LinkedHashMap，所以LinkedHashSet就是用LinkedHashMap来保证插入元素有序的，对LinkedHashMap不熟悉的请参考[LinkedHashMap源码解析](https://mrbird.cc/LinkedHashMap%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90.html)。
从上面的代码我们还可以发现，LinkedHashSet无法改变linkedHashMap的accessOrder属性值，所以在LinkedHashSet中，元素的顺序只能和插入顺序一致：  
| 
```
1  
2  
3  
4  
5  
6  

```
 | 
```
LinkedHashSet<String> set = new LinkedHashSet<>();  
set.add("apple");  
set.add("orange");  
set.add("watermelon");  
set.add("strawberry");  
System.out.println(set);  

```
 |  
| --- | --- |  
输出顺序和插入顺序一致：  
| 
```
1  

```
 | 
```
[apple, orange, watermelon, strawberry]  

```
 |  
| --- | --- |  
请作者喝瓶肥宅水🥤
￥
![MrBird WeChat Pay](https://mrbird.cc/img/wechat_pay.png)
![MrBird Alipay](https://mrbird.cc/img/ali_pay.png)
  * **本文作者：** MrBird
  * **本文链接：** [http://mrbird.cc/LinkedHashSet源码解析.html](http://mrbird.cc/LinkedHashSet%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90.html "LinkedHashSet源码解析")
  * **版权声明：** 本博客所有文章除特别声明外，均采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。转载请注明出处！


[# Java](https://mrbird.cc/tags/Java/)
[ LinkedHashMap源码解析](https://mrbird.cc/LinkedHashMap%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90.html "LinkedHashMap源码解析")
[Spring Cloud 微服务权限系统搭建教程 ](https://mrbird.cc/book.html "Spring Cloud 微服务权限系统搭建教程")
* * *
[![](https://image.uisdc.com/wp-content/uploads/2018/06/uisdc-chat-chicken.gif)](https://mrbird.cc/LinkedHashSet%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90.html)
[MarkDown](https://segmentfault.com/markdown) is support, [powered by Valine](https://valine.js.org)I'm not a Robot!
回复
Powered By [Valine](https://valine.js.org)  
v1.1.8-rc2
![MrBird](https://mrbird.cc/images/blogImage.jpg)
MrBird
A simple blog, code repository, just keep blogging
[14 Archives ](https://mrbird.cc/archives)[2 Labels](https://mrbird.cc/tags)
  * [🏠 Home](https://mrbird.cc/)
  * [📦 Archives](https://mrbird.cc/archives)
  * [🔖 Labels](https://mrbird.cc/tags)
  * [👬 Friends](https://mrbird.cc/friends)
  * [🔍 Search](javascript:;)


* [](https://love.mrbird.cc)
* [](https://cloud.mrbird.cn)
* [](https://gitee.com/mrbirdd)
* [](https://github.com/wuyouzhuguli)
@ 2016 - 2026 MrBird
UV PV 
0
