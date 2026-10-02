[ ![🥕萝卜兔农场🐇](https://blog.nepakina.cn/upload/logo1.0.png) ![🥕萝卜兔农场🐇](https://blog.nepakina.cn/upload/logo1.0.png) ](https://blog.nepakina.cn/) [首页](https://blog.nepakina.cn/ "首页") [归档](https://blog.nepakina.cn/archives "归档") [分类](https://blog.nepakina.cn/categories "分类") [算法](https://blog.nepakina.cn/s/algorithm "算法") [动态](https://blog.nepakina.cn/journals "动态") [书籍](https://blog.nepakina.cn/s/books "书籍") [相册](https://blog.nepakina.cn/photos "相册") [收录](https://blog.nepakina.cn/s/resource "收录") [友链](https://blog.nepakina.cn/links "友链") [友链申请](https://blog.nepakina.cn/s/links-request "友链申请") [关于](https://blog.nepakina.cn/s/about "关于") [ 1 算法思维训练（四）| 哈希表🎈 ](https://blog.nepakina.cn/archives/algorithm-hash "算法思维训练（四）| 哈希表🎈") [ 2 Java 开发者常用工具 ](https://blog.nepakina.cn/archives/java-devtool-init "Java 开发者常用工具") [ 3 Spring 通用框架模板 ](https://blog.nepakina.cn/archives/spring-demo "Spring 通用框架模板") [ 4 算法思维训练（一）| 整数&数组🎈 ](https://blog.nepakina.cn/archives/algorithm-intnarray "算法思维训练（一）| 整数&数组🎈") [ 5 算法思维训练（七）| 树🎈 ](https://blog.nepakina.cn/archives/algorithm-tree "算法思维训练（七）| 树🎈")
![斐波那契兔](https://q1.qlogo.cn/g?b=qq&nk=1420935912&s=640)
斐波那契兔
幸福不会走过来，所以你要自己走过去。
  * 累计撰写 **27** 篇文章
  * 累计创建 **18** 个标签
  * 累计收到 **2** 条评论


  * [ 导航 ](https://blog.nepakina.cn/archives/algorithm-hash)
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

[目录](https://blog.nepakina.cn/archives/algorithm-hash)
    * 一、哈希表基础知识
      * 1. 哈希表概念
      * 2. 哈希表常用函数
        * 2.1 HashSet常见函数
        * 2.2 HashMap常见函数
      * 3. 哈希表后记
    * 二、哈希表知识扩展
      * 1. 哈希表的设计
        * 哈希表题目 | 哈希表的设计
          * 题目一：插入、删除和随机访问都是O(1)的容器
          * 题目二：最近最少使用缓存
      * 2. 哈希表的应用
        * 哈希表题目 | 哈希表的应用
          * 题目一：有效的变位词
          * 题目二：变位词组
          * 题目三：外星语言是否排序
          * 题目四：最小时间差
    * 三、章节小结


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
重
[算法笔记](https://blog.nepakina.cn/categories/algorithm)
# 算法思维训练（四）| 哈希表🎈
  * 2 年前 
  * 7541
  * 0
  * 1
  * 6006


## 一、哈希表基础知识
#### 1. 哈希表概念
哈希表是一种常见的数据结构，在解决算法面试题的时候经常需要用到哈希表。哈希表最大的优点是高效，在哈希表中插入、删除或查找一个元素都只需要`O(1)`的时间。因此，哈希表经常被用来优化时间效率。  
在`Java`中，哈希表有两个对应的类型，即`HashSet`和`HashMap`。如果每个元素都只有一个值，则用`HashSet`。例如，`HashSet`在图搜索时经常用来存储已经搜索过的节点。
#### 2. 哈希表常用函数
##### 2.1 HashSet常见函数  
| 序号  | 函数  | 描述  |  
| --- | --- | --- |  
| 1  | `add`  | 在`HashSet`中添加一个元素  |  
| 2  | `contains`  | 判断`HashSet`中是否包含某个元  |  
| 3  | `remove`  | 移除`HashSet`中的一个元素  |  
| 4  | `size`  | 返回`HashSet`中的元素个数  |  
##### 2.2 HashMap常见函数  
| 序号  | 函数  | 描述  |  
| --- | --- | --- |  
| 1  | `containKey`  | 判断`HashMap`是否包含某个键  |  
| 2  | `get`  | 如果键存在，则返回对应的值，如果不存在，返回`null`  |  
| 3  | `getOrDefault`  | 如果键存在，则返回对应的值，如果不存在，返回指定的值  |  
| 4  | `put`  | 如果数据不存在，则添加一组键值的映射，否则修改键映射的值  |  
| 5  | `putIfAbsent`  | 当前不存在时添加一组键到值得映射  |  
| 6  | `remove`  | 删除某个键  |  
| 7  | `replace`  | 修改某个键的值  |  
| 8  | `size`  | 返回`HashMap`中键到值得映射数目  |  
#### 3. 哈希表后记
尽管哈希表是很高效的数据结构，但这并不意味着哈希表能解决所有的问题。如果用哈希表作为字典存储若干单词，那么只能输入完整的单词在字典中查找。如果对数据集中的元素排序能够有助于解决问题，那么用`TreeSet`或`TreeMap`可能更合适。如果需要知道一个动态数据集中的最大值或最小值，那么堆的效率可能更好。如果希望能够根据前缀进行单词查找，如查找字典中所有以`ex`开头的单词，那么应该用前缀树作为实现字典的数据结构。
* * *
## 二、哈希表知识扩展
### 1. 哈希表的设计
设计哈希表的前提是待存入的元素需要一个能计算自己哈希值的函数。在 Java 中所有类型都继承了类型 Object，每个 Object 的实例都可以通过定义函数 hashCode 来计算哈希值。哈希表根据每个元素的哈 希值把它存储到合适的位置。  
哈希表最重要的特点就是高效，只需要 O(1) 的时间就可以把一个元素存入或读出。在常用的基础数据结构中，数组满足这个要求。只要知道数组中的下标，就可以用 O(1) 的时间存入或读出一个元素。因此，可以考虑基于数组实现哈希表。  
把哈希值转换成数组下标可以采用的方法是对数组的长度求余数。如果数组的长度为 4，待存入的元素的哈希值为 5，由于 5 除以 4 的余数为 1，那么它将存入数组下标为 1 的位置。同理，如果待存入的元素的哈希值为 2 和 3，那么它们分别存入下标为 2 和 3 的位置。如图 2.1(a) 所示  

![图 2.1](https://oss.nepakina.cn/blog/algorithm-hash-2.1.jpg)
图 2.1
  
再在哈希表中存入一个哈希值为 7 的元素。由于 7 除以 4 的余数为 3，因此它存入的位置应该是 3。下标为 3 的位置之前已经被下标为 3 的元素占用。如果将两个哈希值不同的元素存入数组中的同一位置，就会引起冲突。  
为了解决这种冲突，可以把存入数组中同一位置的多个元素用链表存储。也就是说，数组中每个位置对应的不是一个元素，而是一个链表。哈希值为 3 和 7 的这两个元素都存放在数组中下标为 3 的位置，因此它们实际上存入了同一个链表中。接下来如果再添加哈希值分别为 4 和8 的两个元素，那么它们都将被存入数组下标为 0 的位置对应的链表中。此时哈希表的状态如图 2.1(b) 所示。不难想象，如果在哈希表中添加更多的元素，那么就会有更多的冲突，有更多的元素被存入同一个链表中。  
接着考虑如何判断哈希表中是否包含一个元素。例如，为了判断 哈希表中是否包含哈希值为 7 的元素，由于 7 除以 4 的余数是 3，因此先找到数组下标为 3 的位置对应的链表，然后从头到尾扫描这个链表查看是否有哈希值为 7 的元素。  
在链表中做顺序扫描的时间复杂度为 O(n)，链表越长查找需要的时间就越长。这就违背了设计哈希表最重要的一个初衷：存入和读取一个元素的时间复杂度为 O(1)。因此，必须确保链表不能太长。  
可以计算哈希表中元素的数目与数组长度的比值。显然，在数组长度一定的情况下，存入的元素越多，这个比值就越大；在存入元素的数目一定的情况下，数组的长度越长，这个比值就越小。  
当哈希表中元素的数目与数组长度的比值超过某一阈值时，就对数组进行扩容（通常让数组的长度翻倍），然后把哈希表中的每个元素根据新的数组大小求余数并存入合适的位置。例如，在图 2.1(c) 中，扩容之后数组的长度为 8，这个时候原本被存入同一链表的 3 和 7 被分别存入下标为 3 和 7 的位置。  
通过对数组进行扩容，原本存入同一链表的不同元素就可能会被分散到不同的位置，从而减少链表的长度。当再在哈希表中添加新的元素时，元素的数目与数组长度的比值可能会再次超过阈值，于是需要再次对数组进行扩容。只要阈值设置得合理，哈希表中的链表就不会太长，仍然可以认为存入和读取的时间复杂度都是 O(1)。  
由此可知，设计哈希表有3个要点。为了快速确定一个元素在哈希表中的位置，可以使用一个数组，元素的位置为它的哈希值除以数组长度的余数。由于多个哈希值不同的元素可能会被存入同一位置，数组的每个位置都对应一个链表，因此存入同一位置的多个元素都被添加到同一链表中。为了确保链表不会太长，就需要计算哈希表中元素的数目与数组长度的比值。当这个比值超过某个阈值时，就对数组进行扩容并把哈希表中的所有元素重新分配位置。 
#### 哈希表题目 | 哈希表的设计
##### 题目一：插入、删除和随机访问都是O(1)的容器
###### 题目描述
设计一个数据结构，使如下三个操作的时间复杂度都是`O(1)`；`insert(value)`：如果数据集中不包含一个数值，则把它添加到数据集中；`remove(value)`：如果数据集中包含一个数值，则把它删除；`getRandom()`：随机返回数据集中的一个数值，要求数据集中每个数字被返回的概率都相同。
###### 题目分析
> **难度：** ⭐🐇🐇🐇🐇  
>  **思路：** 插入和删除的随机访问均是`O(1)`，很容易便想到`HashMap`，但问题在于随机访问并不能实现`O(1)`，对于数组而言，通过指针访问的复杂度也是`O(1)`，所以，可以将数组和`HashMap`一起使用。通过 `HashMap`记录值和数组下标的关系，而数组中对应下标有存放该值。这样在插入和删除时，通过`HashMap`可以快速判断是否存在，并找到该值。而随机访问时，只需要做一个随机函数运算，按照数组数据长度随机生成下标，通过下标进行访问数据，这样便可实现随机访问概率相同。如果删除是移动元素，那么此时只有删除的复杂度是`O(n)`，但如果只是将末尾元素放到被删除元素处进行补位，然后删除末尾元素，此时就能实现`O(1)`了。
###### 参考代码
java
  * 01
  * 02
  * 03
  * 04
  * 05
  * 06
  * 07
  * 08
  * 09
  * 10
  * 11
  * 12
  * 13
  * 14
  * 15
  * 16
  * 17
  * 18
  * 19
  * 20
  * 21
  * 22
  * 23
  * 24
  * 25
  * 26
  * 27
  * 28
  * 29
  * 30
  * 31
  * 32
  * 33

`List<Integer> list = new ArrayList<>(); Map<Integer, Integer> map = new HashMap<>(); public void insert(int value) {     if (!map.containsKey(value)) {         map.put(value, list.size());         list.add(value);     } }  public void remove(int value) {     Integer index = map.get(value);     if (index != null) {         // 将最后一位元素放到找到的下标出         Integer last = list.get(list.size() - 1);         list.set(index, last);          // 将最后元素删除         list.remove(list.size() - 1);         map.remove(value);         map.put(last, index);     } }  public int getRandom() {     int baseNum = list.size();     if (baseNum == 0) {         return -1;     } else {         Random random = new Random();         int index = random.nextInt(baseNum - 1);         return list.get(index);     } } `
###### Tips：2024-02-05 22:03
* * *
##### 题目二：最近最少使用缓存
###### 题目描述
请设计实现一个最近最少使用`(Least Recently Used, LRU)`缓存，要求如下两个操作的时间复杂度都是`O(1)`：  
`get(key)`：如果缓存中存在键`key`，则返回它对应的值；否则返回`-1`。  
`put(key, value)`：如果缓存中之前包含键`key`，则它的值设为`value`；否则添加键`key`及对应的值`value`。  
在添加一个键时，如果缓存容量已经满了，则在添加新键之前删除最近最少使用的键（缓存中最长时间没有被使用过的元素）。
###### 题目分析
> **难度：** ⭐🐇🐇🐇🐇  
>  **思路：** 同上题一样，首先想到可以通过`HashMap`实现取值、放值得过程。其次需要满足溢出移除最近最少使用的值，这时可以使用一个辅助控件来记录最近最少使用的元素。此处选择双向链表比较合适，当元素被使用到，则将元素移动至链尾，如果溢出，则删除链首元素，随后将新元素添加到链尾。
###### 参考代码
java
  * 01
  * 02
  * 03
  * 04
  * 05
  * 06
  * 07
  * 08
  * 09
  * 10
  * 11
  * 12
  * 13
  * 14
  * 15
  * 16
  * 17
  * 18
  * 19
  * 20
  * 21
  * 22
  * 23
  * 24
  * 25
  * 26
  * 27
  * 28
  * 29
  * 30
  * 31
  * 32
  * 33
  * 34
  * 35
  * 36
  * 37
  * 38
  * 39
  * 40
  * 41
  * 42
  * 43
  * 44
  * 45
  * 46
  * 47
  * 48
  * 49
  * 50
  * 51
  * 52
  * 53
  * 54
  * 55
  * 56
  * 57
  * 58
  * 59
  * 60
  * 61
  * 62
  * 63
  * 64
  * 65
  * 66
  * 67
  * 68
  * 69
  * 70
  * 71
  * 72
  * 73
  * 74
  * 75
  * 76
  * 77
  * 78
  * 79
  * 80
  * 81
  * 82
  * 83
  * 84
  * 85
  * 86
  * 87

`import java.util.HashMap; import java.util.Map;  /**  * 最少使用缓存  * @author nepakina  */ public class LRULCache {      private final int maxCache;     private final Map<Integer, MapListNode> cache = new HashMap<>();     private final MapListNode head;     private final MapListNode tail;      public LRULCache(int maxCache) {         this.maxCache = maxCache;         // 定义两个空节点         this.head = new MapListNode(-1, -1);         this.tail = new MapListNode(-1, -1);         head.next = tail;         tail.last = head;     }      /**      * 双指双向节点      */     public static class MapListNode {         public int key;         public int val;         public MapListNode last;         public MapListNode next;          public MapListNode(int key, int val) {             this.key = key;             this.val = val;         }     }      public int getKey(int key) {         MapListNode res = cache.get(key);         if (res == null) {             return -1;         }         // 移动到 tail 前         moveToTail(res, res.val);         return res.val;     }      public void put(int key, int value) {         MapListNode node = cache.get(key);         if (node != null) {             // 添加元素到 tail 前             moveToTail(node, value);         } else {             node = new MapListNode(key, value);             // 在末尾插入             insertToTail(node);             cache.put(key, node);             // 移除 head 后的第一个元素             if (cache.size() > maxCache) {                 cache.remove(head.next.key);                 deleteNode(head.next);             }         }     }      public void moveToTail(MapListNode node, int value) {         // 先移除列表，再更新值，最后插入到 tail 之前         deleteNode(node);         node.val = value;         insertToTail(node);     }      public void deleteNode(MapListNode node) {         // 将当前元素抹除出链表         node.last.next = node.next;         node.next.last = node.last;     }      public void insertToTail(MapListNode node) {         // 将元素 node 插入到 tail 前         tail.last.next = node;         node.last = tail.last;         node.next = tail;         tail.last = node;     } } `
###### Tips：2024-02-05 22:11
* * *
### 2. 哈希表的应用
由于哈希表的插入、查找和删除操作的时间复杂度都是 O(1)，因此是效率很高的数据结构。在算法面试中哈希表是经常被使用的数据结构，如用哈希表来记录字符串中每个字符出现的次数或每个字符出现的位置。  
如果哈希表的键的取值范围是固定的，并且范围不是很大，则可 以用数组来模拟哈希表。数组的下标和哈希表的键相对应，而数组的值和哈希表的值相对应。  
例如，可以用哈希表来记录单词中每个字母出现的次数，键为字 母，值为字母出现的次数。如果单词中只包含英文小写字母，也就是说，键所有可能的值是已知的，只可能是从`a`到`z`的字母，总共只有 26 个字母，那么可以用一个长度为 26 的数组来模拟这个哈希表，数组中下标为 0 的值对应字母`a`出现的次数，下标为 1 的值对应字母`b`出现的次数，其余的以此类推。
#### 哈希表题目 | 哈希表的应用
##### 题目一：有效的变位词
###### 题目描述
给定两个字符串`s`和`t`，请判断它们是不是一组变位词。在一组变位词中，它们中的字符及每个字符出现的次数都相同，但字符的顺序不能相同。例如，`anagram`和`nagaram`就是一组变位词。
###### 题目分析
> **难度：** ⭐🐇🐇🐇🐇  
>  **思路：** 要判断是否是变位词，可以转化为比较两个字符串是否存在相同的元素，且元素个数相等。如果只存在字母，可以通过数组模拟哈希表进行出现次数的缓存。考虑场景的通用性，可以采用哈希表以字符为建，出现次数为值进行缓存；最后比较两个字符所对应的哈希表缓存的数据是否一直即可。
###### 参考代码
java
  * 01
  * 02
  * 03
  * 04
  * 05
  * 06
  * 07
  * 08
  * 09
  * 10
  * 11
  * 12
  * 13
  * 14
  * 15
  * 16
  * 17
  * 18
  * 19
  * 20
  * 21
  * 22
  * 23
  * 24

`// 这里也可以使用数组处理，将字母转化为 0-25 的下标； // 遍历 s 记录每个字母出现次数；长度不一致如果非变位 // 词那么一定有一个元素的计数为 0，遍历 t 时先判断字 // 母计数是否为 0，为 0 判为 false。 public boolean isAnagram(String s, String t) {     if (s.length() != t.length()) {         return false;     }     boolean allEqual = true;     Map<Character, Integer> map = new HashMap<>();     for (int i = 0; i < s.length(); i++) {         char sc = s.charAt(i);         char tc = t.charAt(i);         if (sc != tc) {             allEqual = false;             map.put(sc, map.getOrDefault(sc, 0) + 1);             Integer tcCount = map.get(tc);             if (tcCount == 1) {                 map.remove(tc);             }         }     }     return !allEqual && map.isEmpty(); } `
###### Tips：2024-02-05 22:12
* * *
##### 题目二：变位词组
###### 题目描述
给定一组单词，只包含英文小写字母，请将它们按照变位词分组。例如，输入一组单词：  
`["eat", "tea", "tan"，"ate", "nat", "bat"]`  
这组单词可以分成3组，分别是：  
`["eat", "tea", "ate"]`、`["tan", "nat"]`、`["bat"]`
###### 题目分析
> **难度：** ⭐⭐🐇🐇🐇  
>  **思路：**  
>  方案一：质数换算  
>  该题主要的问题就在于，即使使用哈希表存放字母出现的次数依旧无法对其进行分组，暴力分组复杂度过高。因此可以根据变位词的共性借助乘法交换律的特性以及质数无公倍数的特性对哈希表进行转化处理，定义一个质数数组用以代替字母（2 代表 a，3 代表 b，5 代表 c ......），字符串按字母换算成质数后相乘，其结果作为字符串的所属分组标识，标识一样则说明是变位词，通过这个特性来对字符串进行分组。不难看出方案一存在一个致命缺陷，乘积容易越界。  
>  方案二：字符串排序  
>  将每个元素按字母重新排序，排序后的新字符串作为 key 从而实现分组。
###### 参考代码
java
  * 01
  * 02
  * 03
  * 04
  * 05
  * 06
  * 07
  * 08
  * 09
  * 10
  * 11
  * 12
  * 13
  * 14
  * 15
  * 16
  * 17
  * 18
  * 19
  * 20
  * 21
  * 22
  * 23
  * 24
  * 25
  * 26
  * 27
  * 28
  * 29
  * 30
  * 31
  * 32
  * 33
  * 34

`// 方案一 public List<List<String>> groupAnagrams(String[] strArr) {     int hash[] = {2, 3, 5, 7, 11, 13, 17, 19, 23,             29, 31, 37, 41, 43, 47, 53, 59, 61,             67, 71, 73, 79, 83, 89, 97, 101};     Map<Long, List<String>> map = new HashMap<>();     for (String s : strArr) {         int len = s.length();         long hashVal = 1;         // 计算字母新的 hash 值(质数积)         for (int j = 0; j < len; j++) {             hashVal *= hash[s.charAt(j) - 'a'];         }         // 用质数积作为 key 对字符串进行分组         List<String> list = map.getOrDefault(hashVal, new ArrayList<>());         list.add(s);         map.put(hashVal, list);     }     return new ArrayList<>(map.values()); }  // 方案二 public List<List<String>> groupAnagrams2(String[] strArr) {     Map<String, List<String>> map = new HashMap<>();     for (String s : strArr) {         char[] charArray = s.toCharArray();         Arrays.sort(charArray);         String sorted = new String(charArray);         List<String> list = map.getOrDefault(sorted, new ArrayList<>());         list.add(s);         map.put(sorted, list);     }     return new ArrayList<>(map.values()); } `
###### Tips：2024-02-05 22:12
* * *
##### 题目三：外星语言是否排序
###### 题目描述
有一门外星语言，它的字母表刚好包含所有的英文小写字母，只是字母表的顺序不同。给定一组单词和字母表顺序，请判断这些单词是否按照字母表的顺序排序。例如，输入一组单词`["offer"，"is"，"coming"]`，以及字母表顺序`"zyxwvutsrqponmlkjihgfedcba"`，由于字母`o`在字母表中位于`i`的前面，因此单词`"offer"`排在`"is"`的前面；同样，由于字母`i`在字母表中位于`c`的前面，因此单词`"is"`排在`"coming"`的前面。因此，这一组单词是按照字母表顺序排序的，应该输出`true`。
###### 题目分析
> **难度：** ⭐⭐🐇🐇🐇  
>  **思路：** 题意仅要求判断是否是按照已知字母序列排序，如果可以只管的比较字母序列下字母的大小，那么就只需要考虑如何判断两个字符串的顺序是否合适。所有问题被拆解为两部分。第一步，根据字母表序列将其映射到顺序上，这样更加直观；第二步，对字符数组进行遍历，比较前一项和后一项元素是否满足顺序要求。  
>  第一步：计算`ASCII`码差值（减去字母`a`），作为键，而字母出现的位置下标作为值。以此记录字母的大小来作为顺序比较的依据。  
>  第二步：通过比较前后两个字符串的每一位字母的大小，判断是否符合要求即可。当后一个字符串字母映射值小于前一个字符串的同位字母时，顺序一定不对；而大于时，顺序一定符合；等于时，最后如果长度一致，也是符合的；且如果是前缀关系，短的元素应该排在前。
###### 参考代码
java
  * 01
  * 02
  * 03
  * 04
  * 05
  * 06
  * 07
  * 08
  * 09
  * 10
  * 11
  * 12
  * 13
  * 14
  * 15
  * 16
  * 17
  * 18
  * 19
  * 20
  * 21
  * 22
  * 23
  * 24
  * 25
  * 26

`public boolean isOrder(String[] strArr, String order) {     int[] orderArr = new int[26];     for (int i = 0; i < order.length(); i++) {         orderArr[order.charAt(i) - 'a']++;     }      String pre = strArr[0];     for (int i = 1; i < strArr.length; i++) {         String cur = strArr[i];         for (int j = 0; j < pre.length(); j++) {             if (j >= cur.length()) {                 return false;             }             int flag = orderArr[cur.charAt(j) - 'a'] - orderArr[pre.charAt(j) - 'a'];             if (flag < 0) {                 // 如果同位，前字母大于后字母，必定是false                 return false;             } else if (flag > 0) {                 // 如果同为，前字母小于后字母，必定符合要求                 break;             }         }         pre = cur;     }     return true; } `
###### Tips：2024-02-05 22:15
* * *
##### 题目四：最小时间差
###### 题目描述
给定一组范围在`00：00`至`23：59`的时间，求任意两个时间之间的最小时间差。例如，输入时间数组`["23：50"，"23：59"，"00：00"]`、`"23：59"`和`"00：00"`之间只有`1`分钟的间隔，是最小的时间差。
###### 题目分析
> **难度：** ⭐⭐🐇🐇🐇  
>  **思路：** 如果将时间转化为数值，那么会更加的便于比较和计算差值；一天有`24 * 60`分钟，所以可以分配一个`1440`大小的数组表示一天的所有时间，对应的时间出现则记录加一（如果时间值不会重复，记录为`true`也可）；遍历数组，记录两个值为大于`0`的相邻元素下标差值，求出最小差值即可。由于时间是首位相连的，所以最后要比较首段元素和末端元素的反向差值，即：`value = 1400 + firstIndex - lastIndex`。
###### 参考代码
java
  * 01
  * 02
  * 03
  * 04
  * 05
  * 06
  * 07
  * 08
  * 09
  * 10
  * 11
  * 12
  * 13
  * 14
  * 15
  * 16
  * 17
  * 18
  * 19
  * 20
  * 21
  * 22
  * 23
  * 24
  * 25
  * 26
  * 27
  * 28
  * 29
  * 30
  * 31
  * 32
  * 33
  * 34
  * 35
  * 36
  * 37
  * 38
  * 39

`public int findMinDifference(String[] timeArr) {     if (timeArr == null || timeArr.length <= 1) {         return -1;     }      int res = Integer.MAX_VALUE;     int[] times = new int[1440];     for (String s : timeArr) {         String[] split = s.split("：");         int hour = Integer.parseInt(split[0]);         int min = Integer.parseInt(split[1]);         times[hour * 60 + min]++;     }      int first = -1, end = -1;     for (int i = 0; i < times.length; i++) {         if (times[i] == 0) {             continue;         }         // 如果出现相同的时间，最小间隔为0         if (times[i] > 1) {             res = 0;             break;         }         // 记录第一个不为0的时间         if (first == -1) {             first = i;         }         // 已记录上一个时间节点是，计算时间间隔         if (end != -1) {             // 计算间隔             res = Math.min(res, i - end);         }         end = i;     }     // 计算边界时间差     res = Math.min(res, 1440 + first - end);     return res; } `
###### Tips：2024-02-05 22:16
* * *
## 三、章节小结
哈希表的时间效率很高，添加、删除和查找操作的时间复杂度都是 O(1)。  
为了设计一个哈希表，首先需要一个数组，把每个键的哈希值映射到数组的一个位置。为了解决冲突，可以把映射到同一位置的多个键用链表存储。同时，为了避免链表太长，当哈希表中元素的数目与数组的长度的比值超过一定的阈值时，则增加数组的长度并根据新的长度重新映射每个键的位置。  
如果结合哈希表和其他数据结构的特点，则还可以设计出很多更加高级、更加复杂的数据结构，如最近最少使用缓存。  
哈希表是经常被用来记录字符串中字母出现的次数、字符串中字符出现的位置等信息。  
如果哈希表的键的数目是固定的，并且数目不太大，那么也可以用数组来模拟哈希表，数组的下标对应哈希表的键，而数组的值与哈希表的值对应。
* * *
赞1
如果觉得文章对你有用，请随意赞赏
[Java](https://blog.nepakina.cn/tags/java) [算法](https://blog.nepakina.cn/tags/algorithm)
* * *
算法思维训练（四）| 哈希表🎈
[https://blog.nepakina.cn/archives/algorithm-hash](https://blog.nepakina.cn/archives/algorithm-hash)
###### 作者
斐波那契兔
###### 发布于
2024-08-06
###### 更新于
2025-05-25
###### 许可协议
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.zh "CC BY 4.0")
[](http://connect.qq.com/widget/shareqq/index.html?url=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2Falgorithm-hash&title=%E7%AE%97%E6%B3%95%E6%80%9D%E7%BB%B4%E8%AE%AD%E7%BB%83%EF%BC%88%E5%9B%9B%EF%BC%89%7C%20%E5%93%88%E5%B8%8C%E8%A1%A8%F0%9F%8E%88%20-%20%F0%9F%A5%95%E8%90%9D%E5%8D%9C%E5%85%94%E5%86%9C%E5%9C%BA%F0%9F%90%87%7C%E6%8B%BE%E8%8D%92%E5%9F%BA%E5%9C%B0&source=https%3A%2F%2Fblog.nepakina.cn&desc=%E5%89%91%E6%8C%87offer%E7%AE%97%E6%B3%95%E8%AE%AD%E7%BB%83%EF%BC%8C%E5%93%88%E5%B8%8C%E8%A1%A8%E7%B1%BB%E9%A2%98%E7%9B%AE%E7%BB%83%E4%B9%A0%EF%BC%8C%E5%85%B1%E8%AE%A1%E6%94%B6%E5%BD%95%E9%A2%98%E7%9B%AE6%E9%81%93%E3%80%82&pics=https%3A%2F%2Foss.nepakina.cn%2Fblog%2Far15-light-field-release.jpg&summary=%E5%89%91%E6%8C%87offer%E7%AE%97%E6%B3%95%E8%AE%AD%E7%BB%83%EF%BC%8C%E5%93%88%E5%B8%8C%E8%A1%A8%E7%B1%BB%E9%A2%98%E7%9B%AE%E7%BB%83%E4%B9%A0%EF%BC%8C%E5%85%B1%E8%AE%A1%E6%94%B6%E5%BD%95%E9%A2%98%E7%9B%AE6%E9%81%93%E3%80%82 "QQ")[](http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2Falgorithm-hash&title=%E7%AE%97%E6%B3%95%E6%80%9D%E7%BB%B4%E8%AE%AD%E7%BB%83%EF%BC%88%E5%9B%9B%EF%BC%89%7C%20%E5%93%88%E5%B8%8C%E8%A1%A8%F0%9F%8E%88%20-%20%F0%9F%A5%95%E8%90%9D%E5%8D%9C%E5%85%94%E5%86%9C%E5%9C%BA%F0%9F%90%87%7C%E6%8B%BE%E8%8D%92%E5%9F%BA%E5%9C%B0&desc=%E5%89%91%E6%8C%87offer%E7%AE%97%E6%B3%95%E8%AE%AD%E7%BB%83%EF%BC%8C%E5%93%88%E5%B8%8C%E8%A1%A8%E7%B1%BB%E9%A2%98%E7%9B%AE%E7%BB%83%E4%B9%A0%EF%BC%8C%E5%85%B1%E8%AE%A1%E6%94%B6%E5%BD%95%E9%A2%98%E7%9B%AE6%E9%81%93%E3%80%82&summary=%E5%89%91%E6%8C%87offer%E7%AE%97%E6%B3%95%E8%AE%AD%E7%BB%83%EF%BC%8C%E5%93%88%E5%B8%8C%E8%A1%A8%E7%B1%BB%E9%A2%98%E7%9B%AE%E7%BB%83%E4%B9%A0%EF%BC%8C%E5%85%B1%E8%AE%A1%E6%94%B6%E5%BD%95%E9%A2%98%E7%9B%AE6%E9%81%93%E3%80%82&site=https%3A%2F%2Fblog.nepakina.cn&pics=https%3A%2F%2Foss.nepakina.cn%2Fblog%2Far15-light-field-release.jpg "QQ空间") 微信扫一扫：分享 ![微信分享](https://blog.nepakina.cn/archives/algorithm-hash) [](https://service.weibo.com/share/share.php?url=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2Falgorithm-hash&title=%E7%AE%97%E6%B3%95%E6%80%9D%E7%BB%B4%E8%AE%AD%E7%BB%83%EF%BC%88%E5%9B%9B%EF%BC%89%7C%20%E5%93%88%E5%B8%8C%E8%A1%A8%F0%9F%8E%88%20-%20%F0%9F%A5%95%E8%90%9D%E5%8D%9C%E5%85%94%E5%86%9C%E5%9C%BA%F0%9F%90%87%7C%E6%8B%BE%E8%8D%92%E5%9F%BA%E5%9C%B0&pic=https%3A%2F%2Foss.nepakina.cn%2Fblog%2Far15-light-field-release.jpg&appkey= "新浪微博")[](http://shuo.douban.com/!service/share?href=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2Falgorithm-hash&name=%E7%AE%97%E6%B3%95%E6%80%9D%E7%BB%B4%E8%AE%AD%E7%BB%83%EF%BC%88%E5%9B%9B%EF%BC%89%7C%20%E5%93%88%E5%B8%8C%E8%A1%A8%F0%9F%8E%88%20-%20%F0%9F%A5%95%E8%90%9D%E5%8D%9C%E5%85%94%E5%86%9C%E5%9C%BA%F0%9F%90%87%7C%E6%8B%BE%E8%8D%92%E5%9F%BA%E5%9C%B0&text=%E5%89%91%E6%8C%87offer%E7%AE%97%E6%B3%95%E8%AE%AD%E7%BB%83%EF%BC%8C%E5%93%88%E5%B8%8C%E8%A1%A8%E7%B1%BB%E9%A2%98%E7%9B%AE%E7%BB%83%E4%B9%A0%EF%BC%8C%E5%85%B1%E8%AE%A1%E6%94%B6%E5%BD%95%E9%A2%98%E7%9B%AE6%E9%81%93%E3%80%82&image=https%3A%2F%2Foss.nepakina.cn%2Fblog%2Far15-light-field-release.jpg&starid=0&aid=0&style=11 "豆瓣")[](http://www.linkedin.com/shareArticle?mini=true&ro=true&title=%E7%AE%97%E6%B3%95%E6%80%9D%E7%BB%B4%E8%AE%AD%E7%BB%83%EF%BC%88%E5%9B%9B%EF%BC%89%7C%20%E5%93%88%E5%B8%8C%E8%A1%A8%F0%9F%8E%88%20-%20%F0%9F%A5%95%E8%90%9D%E5%8D%9C%E5%85%94%E5%86%9C%E5%9C%BA%F0%9F%90%87%7C%E6%8B%BE%E8%8D%92%E5%9F%BA%E5%9C%B0&url=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2Falgorithm-hash&summary=%E5%89%91%E6%8C%87offer%E7%AE%97%E6%B3%95%E8%AE%AD%E7%BB%83%EF%BC%8C%E5%93%88%E5%B8%8C%E8%A1%A8%E7%B1%BB%E9%A2%98%E7%9B%AE%E7%BB%83%E4%B9%A0%EF%BC%8C%E5%85%B1%E8%AE%A1%E6%94%B6%E5%BD%95%E9%A2%98%E7%9B%AE6%E9%81%93%E3%80%82&source=https%3A%2F%2Fblog.nepakina.cn&armin=armin "Linkedin")[](https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2Falgorithm-hash "FaceBook")[](https://twitter.com/intent/tweet?text=%E7%AE%97%E6%B3%95%E6%80%9D%E7%BB%B4%E8%AE%AD%E7%BB%83%EF%BC%88%E5%9B%9B%EF%BC%89%7C%20%E5%93%88%E5%B8%8C%E8%A1%A8%F0%9F%8E%88%20-%20%F0%9F%A5%95%E8%90%9D%E5%8D%9C%E5%85%94%E5%86%9C%E5%9C%BA%F0%9F%90%87%7C%E6%8B%BE%E8%8D%92%E5%9F%BA%E5%9C%B0&url=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2Falgorithm-hash&via=https%3A%2F%2Fblog.nepakina.cn "Twitter")[](https://plus.google.com/share?url=https%3A%2F%2Fblog.nepakina.cn%2Farchives%2Falgorithm-hash "Google")
[ 算法思维训练（五）| 栈🎈 ](https://blog.nepakina.cn/archives/algorithm-stack) [ 关于TeamSpeak 3的简单使用流程 ](https://blog.nepakina.cn/archives/ts3)
### 评论
![斐波那契兔](https://q1.qlogo.cn/g?b=qq&nk=1420935912&s=640)
斐波那契兔
v<
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
今日已经过去14 小时
61%
这周已经过去5 天
71%
本月已经过去2 天
6%
今年已经过去10 个月
83%
目录
  * 一、哈希表基础知识
    * 1. 哈希表概念
    * 2. 哈希表常用函数
      * 2.1 HashSet常见函数
      * 2.2 HashMap常见函数
    * 3. 哈希表后记
  * 二、哈希表知识扩展
    * 1. 哈希表的设计
      * 哈希表题目 | 哈希表的设计
        * 题目一：插入、删除和随机访问都是O(1)的容器
        * 题目二：最近最少使用缓存
    * 2. 哈希表的应用
      * 哈希表题目 | 哈希表的应用
        * 题目一：有效的变位词
        * 题目二：变位词组
        * 题目三：外星语言是否排序
        * 题目四：最小时间差
  * 三、章节小结


最新文章
  * [法线贴图的叠加处理 · 随笔](https://blog.nepakina.cn/archives/normal-combine "法线贴图的叠加处理 · 随笔")
  * [算法思维训练（九）| 前缀树🎈](https://blog.nepakina.cn/archives/algorithm-prefixtree "算法思维训练（九）| 前缀树🎈")
  * [【Java】AtCoder Beginner Contest 402](https://blog.nepakina.cn/archives/abc402 "【Java】AtCoder Beginner Contest 402")
  * [算法思维训练（八）| 堆🎈](https://blog.nepakina.cn/archives/algorithm-heap "算法思维训练（八）| 堆🎈")
  * [游戏随笔-荒野的伤口机制](https://blog.nepakina.cn/archives/%E6%B8%B8%E6%88%8F%E9%9A%8F%E7%AC%94-%E8%8D%92%E9%87%8E%E7%9A%84%E4%BC%A4%E5%8F%A3%E6%9C%BA%E5%88%B6 "游戏随笔-荒野的伤口机制")


友链
  * [ 漫宅博客 blog.mangata.ltd ](http://blog.mangata.ltd/)
  * [ 华岁云小屋 www.vlo.cc ](https://www.vlo.cc/)
  * [ 追梦算法 acm.mangata.ltd ](http://acm.mangata.ltd/)
  * [ BruisesL's blog bruisesl.github.io ](https://bruisesl.github.io/)
  * [ 小余同学技术分享站 www.nafees.top ](https://www.nafees.top/)
  * [ 玖涯博客 blog.nineya.com ](https://blog.nineya.com/)
  * [ TG小站 3322898.cn ](https://3322898.cn)
  * [ nukix的工具箱 blog.uso6.com ](https://blog.uso6.com)


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
今日已经过去14 小时
61%
这周已经过去5 天
71%
本月已经过去2 天
6%
今年已经过去10 个月
83%
目录
  * 一、哈希表基础知识
    * 1. 哈希表概念
    * 2. 哈希表常用函数
      * 2.1 HashSet常见函数
      * 2.2 HashMap常见函数
    * 3. 哈希表后记
  * 二、哈希表知识扩展
    * 1. 哈希表的设计
      * 哈希表题目 | 哈希表的设计
        * 题目一：插入、删除和随机访问都是O(1)的容器
        * 题目二：最近最少使用缓存
    * 2. 哈希表的应用
      * 哈希表题目 | 哈希表的应用
        * 题目一：有效的变位词
        * 题目二：变位词组
        * 题目三：外星语言是否排序
        * 题目四：最小时间差
  * 三、章节小结


最新文章
  * [法线贴图的叠加处理 · 随笔](https://blog.nepakina.cn/archives/normal-combine "法线贴图的叠加处理 · 随笔")
  * [算法思维训练（九）| 前缀树🎈](https://blog.nepakina.cn/archives/algorithm-prefixtree "算法思维训练（九）| 前缀树🎈")
  * [【Java】AtCoder Beginner Contest 402](https://blog.nepakina.cn/archives/abc402 "【Java】AtCoder Beginner Contest 402")
  * [算法思维训练（八）| 堆🎈](https://blog.nepakina.cn/archives/algorithm-heap "算法思维训练（八）| 堆🎈")
  * [游戏随笔-荒野的伤口机制](https://blog.nepakina.cn/archives/%E6%B8%B8%E6%88%8F%E9%9A%8F%E7%AC%94-%E8%8D%92%E9%87%8E%E7%9A%84%E4%BC%A4%E5%8F%A3%E6%9C%BA%E5%88%B6 "游戏随笔-荒野的伤口机制")


友链
  * [ 漫宅博客 blog.mangata.ltd ](http://blog.mangata.ltd/)
  * [ 华岁云小屋 www.vlo.cc ](https://www.vlo.cc/)
  * [ 追梦算法 acm.mangata.ltd ](http://acm.mangata.ltd/)
  * [ BruisesL's blog bruisesl.github.io ](https://bruisesl.github.io/)
  * [ 小余同学技术分享站 www.nafees.top ](https://www.nafees.top/)
  * [ 玖涯博客 blog.nineya.com ](https://blog.nineya.com/)
  * [ TG小站 3322898.cn ](https://3322898.cn)
  * [ nukix的工具箱 blog.uso6.com ](https://blog.uso6.com)


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


