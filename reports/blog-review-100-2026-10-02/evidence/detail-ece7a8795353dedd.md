# [Skykey's Home ](https://blog.skykey.fun/)
Skykey的私人博客ᕕ( ᐛ )ᕗ
  * [首页](https://blog.skykey.fun/)
  * [关于](https://blog.skykey.fun/about/)
  * [标签](https://blog.skykey.fun/tags/)
  * [分类](https://blog.skykey.fun/categories/)
  * [归档](https://blog.skykey.fun/archives/)
  * [Links](https://blog.skykey.fun/links/)
  * 搜索 


[](https://github.com/skykeyjoker "Follow me on GitHub")
#  C++/QT PC客户端面试题 
发表于 2022-06-20 分类于 [C++](https://blog.skykey.fun/categories/C/) 阅读次数： 阅读次数： Valine： [ ](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#valine-comments "valine")   
本文字数： 31k 阅读时长 ≈ 29 分钟
#  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-QT-PC%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%9D%A2%E8%AF%95%E9%A2%98 "C++/QT PC客户端面试题")C++/QT PC客户端面试题
整理记录一些春招时面试字节跳动/阿里云 C++/Qt PC客户端相关岗位的面试题，包含面试中遇到后整理的题目和面试前准备的资料。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E7%88%B6%E5%AD%90%E7%BB%A7%E6%89%BF%E6%97%B6%E5%80%99%EF%BC%8C%E5%AE%83%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E5%92%8C%E6%9E%90%E6%9E%84%E5%87%BD%E6%95%B0%E7%9A%84%E9%A1%BA%E5%BA%8F%EF%BC%9F%E6%9E%90%E6%9E%84%E6%97%B6%E5%80%99%EF%BC%8C%E5%A6%82%E4%BD%95%E8%AE%A9%E7%88%B6%E5%AD%90%E7%B1%BB%E9%87%8C%E6%89%80%E6%9C%89%E7%9A%84%E6%9E%90%E6%9E%84%E9%83%BD%E8%B0%83%E7%94%A8%E4%B8%80%E9%81%8D%EF%BC%9F "父子继承时候，它构造函数和析构函数的顺序？析构时候，如何让父子类里所有的析构都调用一遍？")父子继承时候，它构造函数和析构函数的顺序？析构时候，如何让父子类里所有的析构都调用一遍？
构造时，先调用父类的构造函数，再调用派生类的构造函数。建楼从地基开始。
析构时，先调用子类的析构函数，再调用父类的析构函数。拆楼从最高层开始拆。
若使用父类指针指向子类对象，delete该对象时，只会调用父类的析构函数，此时可将父类的析构函数设置为虚函数。若使用子类指针指向父类对象，delete该对象时，会先调用子类析构函数，再调用父类析构函数。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E4%B8%80%E4%B8%AA%E5%87%BD%E6%95%B0%EF%BC%8C%E5%A6%82%E4%BD%95%E8%AE%A9%E5%AE%83%E5%9C%A8main%E5%87%BD%E6%95%B0%E4%B9%8B%E5%89%8D%E6%89%A7%E8%A1%8C%EF%BC%9F "一个函数，如何让它在main函数之前执行？")一个函数，如何让它在main函数之前执行？
  1. 全局对象的构造函数，main之前声明一个全局对象。
  2. 全局变量、对象和静态变量、对象的空间分配和赋初值。
  3. 进程启动后，要执行一些初始化代码，然后跳转到main函数执行。main函数执行完毕后，返回到入口函数，入口函数进行清理工作，包括全局变量的析构、堆销毁、关闭I/O等，然后等待系统关闭进程。
  4. 使用关键字`__attribute__`，让一个函数在主函数之前运行，进行一些数据初始化、模块加载验证等。  
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
25  

```
 | 
```
#include<stdio.h>  
  
void func()  
{  
    printf("hello world\n");  
    //exit(0);  
    return 0;  
}  
  
__attribute__((constructor))void before()  
{  
    printf("before\n");  
    func();  
}  
  
__attribute__((destructor))void after()  
{  
    printf("after\n");  
  
}  
  
int main()  
{  
    printf("main\n"); //从运行结果来看，并没有执行main函数  
}  

```
 |  
| --- | --- |  


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8F%AF%E4%BB%A5%E5%9C%A8C-%E7%9A%84%E6%88%90%E5%91%98%E5%87%BD%E6%95%B0%E9%87%8C%E8%B0%83%E7%94%A8delete-this%E5%90%97 "可以在C++的成员函数里调用delete this吗?")可以在C++的成员函数里调用delete this吗?
能够调用。在调用后还可以调用该对象的其他方法，但是前提是：被调用的方法不涉及这个对象的数据成员和虚函数。
**根本原因** 在于delete操作符的功能和类对象的内存模型。在类对象的内存空间中，只有数据成员和虚函数表指针，并不包含代码内容，类的成员函数单独放在代码段中。
在类的析构函数中调用delete this会导致堆栈溢出。delete的本质是为将被释放的内存调用一个或多个析构函数，而析构函数中又调用delete this，形成无限递归，造成堆栈溢出。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#class-A-Class-B-A-a-%E8%83%BD%E4%B8%8D%E8%83%BD%E5%85%81%E8%AE%B8%EF%BC%9F "class A; Class B{ A a; };能不能允许？")`class A; Class B{ A a; };`能不能允许？
不能。class A未定义，为不完整的类型，不允许。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E7%9A%84%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E6%9C%89%E5%93%AA%E4%BA%9B "C++的类型转换有哪些")C++的类型转换有哪些
  1. C风格的强制类型转换。(typename)Var；
  2. 四种新类型转换：
     * **static_cast(data)** ：
       * 近似类型转换，如int转double，const转非const，向上转型
       * void*指针与具体类型指针之间的转换，如void*转int*
       * 有转换构造函数或者类型转换函数的类与其他类型之间的转换
     * **const_cast(data) **：
       * 用来将const/volatile 类型转换为非 const/volatile 类型。
     * **reinterpret_cast(data)**：
       * 可以认为是 static_cast 的一种补充，一些 static_cast 不能完成的转换，就可以用 reinterpret_cast 来完成，例如**两个具体类型指针之间的转换** 、**int和指针之间的转换。非常简单粗暴，但是风险很高。**
     * **dynamic_cast(data)**：
       * 用于在类的继承层次之间进行类型转换，它既允许向上转型（Upcasting），就是把继承类指针转换为基类指针；也允许向下转型（Downcasting）。向上转型是无条件的，不会进行任何检测，所以都能成功；向下转型的前提必须是安全的，要借助RTTI进行检测，所有只有一部分能成功。


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E6%9C%89%E5%93%AA%E4%BA%9B%E6%99%BA%E8%83%BD%E6%8C%87%E9%92%88 "C++有哪些智能指针")C++有哪些智能指针
share_ptr, unique_ptr, weak_ptr。
**它们三者有什么区别？**
shared_ptr,unique_ptr,weak_ptr。第一个实现原理是同一个内存空间每多一个指针指向就计数加1，如果计数变为0就释放内存空间。第二个是计数只能为1，第三个只能指向该内存空间而没有所有权。主要用于辅助第一个指针，防止出现互锁。Shared_ptr当用普通指针初始化的时候，只能使用一次普通指针。它还可以自定义释放函数。Unique_ptr没有拷贝构造函数。借助 weak_ptr 类型指针， 我们可以获取 shared_ptr 指针的一些状态信息，比如有多少指向相同的 shared_ptr 指针、shared_ptr 指针指向的堆内存是否已经被释放等等。在构建 weak_ptr 指针对象时，可经常利用已有的 shared_ptr 指针为其初始化。
**为什么需要智能指针？它在实际工程中有什么作用？**
为了防止内存泄漏，设置的自动回收机制。
**说一下shared_ptr的底层实现？**
引用计数，每多一个智能指向同一个内存，就把计数加1，当计数减到0的时候就释放该指针。当该指针作为形参传递的时候，计数会加1，当他出该函数时会自动减一。
**Weak_ptr的作用？**
获取 shared_ptr 指针的一些状态信息，比如有多少指向相同的 shared_ptr 指针、shared_ptr 指针指向的堆内存是否已经被释放等等。另外防止循环引用。
**你刚才说到循环引用，那你口述一个循环引用的实例。**
比如说A、B两个类，两个类里面分别定义了一个对方类的智能指针，然后在主函数里面首先定义两个类的智能指针，然后分别把两个指针分别赋予对方的成员指针里，这样就形成了循环引用。
循环引用的问题是：一旦b出作用域，引用计数减一，导致b里面的a永远不会减一，导致a智能指针空间永远释放不掉，然后a出作用域时，a引用计数减一，a最终没释放，它里面的b也就不可能释放掉，最后a b都是1无法释放。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E8%A3%85%E9%A5%B0%E5%99%A8%E6%A8%A1%E5%BC%8F "装饰器模式")装饰器模式
![img](https://images2018.cnblogs.com/blog/1192097/201807/1192097-20180718181338035-1670765431.png)
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E5%A4%9A%E7%BA%BF%E7%A8%8B%E6%AD%BB%E9%94%81 "C++多线程死锁")C++多线程死锁  
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
25  
26  
27  
28  
29  
30  
31  
32  
33  
34  

```
 | 
```
#include <iostream>  
#include <thread>  
#include <mutex>  
  
void work1(std::mutex& mylock1, std::mutex& mylock2) {  
	for (int i = 0; i < 100000; i++) {  
		mylock1.lock();  
		mylock2.lock();  
		std::cout << "work1 : " << i << std::endl;  
		mylock2.unlock();  
		mylock1.unlock();  
	}  
}  
  
void work2(std::mutex& mylock1, std::mutex& mylock2) {  
	for (int i = 0; i < 100000; i++) {  
		mylock2.lock();  
		mylock1.lock();  
		std::cout << "work2 : " << i << std::endl;  
		mylock1.unlock();  
		mylock2.unlock();  
	}  
}  
  
int main()  
{  
	std::mutex mylock1, mylock2;  
	int ans = 0;  
	std::thread t1(work1, std::ref(mylock1), std::ref(mylock2));  
	std::thread t2(work2, std::ref(mylock1), std::ref(mylock2));  
	t1.join();  
	t2.join();  
	return 0;  
}  

```
 |  
| --- | --- |  
**由于==交叉加锁==，使得两个锁都在等待对方解锁而造成的死锁，运行结果如下图所示：**
**解决这个死锁的问题只是把加锁的顺序改过来就可以了，然后也可以用std::lock函数来创建多个互斥锁，用法也很简单，首先创建两个互斥锁lock1和lock2，那么std::lock(lock1,lock2)这句代码就相当于lock1.lock();lock2.lock();，最后不要忘了对两个锁的unlock，其实也可以搭配lock_guard()来使用，因为lock_guard内部就有析构函数来unlock，所以在lock_guard中引用std::adopt_lock参数（作用是告诉编译器我已经lock过了，不需要再重复lock了）就可以实现省去后面的unlock语句了。代码如下：**  
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
25  
26  
27  
28  
29  
30  
31  
32  

```
 | 
```
#include <iostream>  
#include <thread>  
#include <mutex>  
  
void work1(std::mutex& mylock1, std::mutex& mylock2) {  
	for (int i = 0; i < 100000; i++) {  
		std::lock(mylock1, mylock2);  
		std::lock_guard<std::mutex> lock1(mylock1, std::adopt_lock);  
		std::lock_guard<std::mutex> lock2(mylock2, std::adopt_lock);  
		std::cout << "work1 : " << i << std::endl;  
	}  
}  
  
void work2(std::mutex& mylock1, std::mutex& mylock2) {  
	for (int i = 0; i < 100000; i++) {  
		std::lock(mylock1, mylock2);  
		std::lock_guard<std::mutex> lock1(mylock1, std::adopt_lock);  
		std::lock_guard<std::mutex> lock2(mylock2, std::adopt_lock);  
		std::cout << "work2 : " << i << std::endl;  
	}  
}  
  
int main()  
{  
	std::mutex mylock1, mylock2;  
	int ans = 0;  
	std::thread t1(work1, std::ref(mylock1), std::ref(mylock2));  
	std::thread t2(work2, std::ref(mylock1), std::ref(mylock2));  
	t1.join();  
	t2.join();  
	return 0;  
}  

```
 |  
| --- | --- |  
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#TCP%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B%E5%92%8C%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B "TCP三次握手和四次挥手")TCP三次握手和四次挥手
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#TCP%E4%B8%8EUDP "TCP与UDP")TCP与UDP
**用户数据报协议 UDP** （User Datagram Protocol）：
  * **UDP 在传送数据之前不需要先建立连接** ，远程主机在收到 UDP 报文后，不需要给出任何确认。
  * 虽然 UDP **不提供可靠交付** ，但在某些情况下 UDP 确是一种最有效的工作方式（一般用于即时通信），比如： QQ 语音、 QQ 视频 、直播等等


**传输控制协议 TCP** （Transmission Control Protocol）：
  * TCP 提供**面向连接** 的服务。在传送数据之前必须先建立连接，数据传送结束后要释放连接。
  * TCP 不提供广播或多播服务。由于 TCP 要提供**可靠** 的，面向连接的传输服务（TCP的可靠体现在TCP在传递数据之前，会有三次握手来建立连接，而且在数据传递时，有确认、窗口、重传、流量控制、拥塞控制机制，在数据传完后，还会四次挥手断开连接用来节约系统资源），这不仅使协议数据单元的首部增大很多，还要占用许多处理机资源。
  * TCP **一般用于文件传输、发送和接收邮件、远程登录等场景** 。


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#TCP%E6%8A%A5%E6%96%87%E6%A0%BC%E5%BC%8F "TCP报文格式")TCP报文格式
![img](https://segmentfault.com/img/remote/1460000039165596)
首部固定部分各字段意义如下：
  * 1 - **源端口和目的端口** ：各占 2 个字节，分别写入源端口和目的端口。IP 地址 + 端口号就可以确定一个进程地址
  * 2 - **序号/序列号（Sequense Number，SN）** ：在一个 TCP 连接中传送的字节流中的每一个字节都按顺序编号。该字段表示本报文段所发送的数据的第一个字节的序号。
初始序号称为 Init Sequense Number, ISN
（序号/序列号这个字段很重要，大家留个印象，下文会详细讲解）
例如，一报文段的序号是 101，共有 100 字节的数据。这就表明：本报文段的数据的第一个字节的序号是 101，最后一个字节的序号是 200。显然，下一个报文段的数据序号应当从 201 开始，即下一个报文段的序号字段值应为 201。
  * 3 - **确认号 ack** ：期望收到对方下一个报文段的第一个数据字节的序号。若确认号为 N，则表明：到序号 N-1 为止的所有数据都已正确收到。
  * 4 - **数据偏移** （首部长度）：它指出 TCP 报文段的数据起始处距离 TCP 报文段的起始处有多远。这个字段实际上是指出TCP报文段的首部长度。
  * 5 - **保留** ：占 6 位，应置为 0，保留为今后使用。


保留位的右边还有 6 个控制位（重要），这是TCP 用来说明该报文段性质的：
  * **紧急位 URG** ：当 URG = 1 时，表明此报文段中有紧急数据，是高优先级的数据，应尽快发送，不用在缓存中排队。该控制位需配合紧急指针使用（紧急指针指出本报文段中紧急数据的字节数）
举个例子：我们需要取消一个已经发送了很长程序的运行，因此用户从键盘发出中断命令。如果不使用紧急数据，那么这个指令将存储在接收 TCP 的缓存末尾，只有在所有的数据被处理完毕后这两个字符才被交付接收方的应用进程，这样做就无法实现立即中断。
  * **确认 ACK** ：仅当 ACK = 1 时确认号字段才有效，当 ACK = 0 时确认号无效。**TCP 规定，在连接建立后所有传送的报文段都必须把 ACK 置为 1。**
  * **推送 PSH** ：当两个应用进程进行交互式的通信时，有时在一端的应用进程希望在键入一个命令后立即就能收到对方的响应。在这种情况下，TCP 就可以使用推送（push）操作。这时，发送方 TCP 把 PSH 置为 1，并立即创建一个报文段发送出去。接收方 TCP 收到 PSH = 1 的报文段，就尽快地交付接收应用进程。而不用等到整个缓存都填满了后再向上交付。
  * **复位 RST** ：当 RST = 1 时，表明 TCP 连接中出现了严重错误（如由于主机崩溃或其他原因），必须释放连接，然后再重新建立传输连接。
  * **同步 SYN** ：SYN = 1 表示这是一个连接请求或连接接受报文。
当 SYN = 1 而 ACK = 0 时，表明这是一个连接请求报文段。对方若同意建立连接，则应在响应的报文段中使 SYN = 1 且 ACK = 1。
  * **终止 FIN** ：用来释放一个连接。当 FIN = 1时，表明此报文段的发送发的数据已发送完毕，并要求释放运输连接。


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B "三次握手")三次握手
主要作用就是为了确认双方的接收能力和发送能力是否正常、指定自己的**初始化序列号(Init Sequense Number, `ISN`)**为后面的可靠性传输做准备。
![img](https://segmentfault.com/img/remote/1460000039165594)
只有经过三次握手才能确认双发的收发功能都正常，缺一不可：
  * 第一次握手（客户端发送 SYN 报文给服务器，服务器接收该报文）：客户端什么都不能确认；服务器确认了对方发送正常，自己接收正常
  * 第二次握手（服务器响应 SYN 报文给客户端，客户端接收该报文）：
客户端确认了：自己发送、接收正常，对方发送、接收正常；
服务器确认了：对方发送正常，自己接收正常
  * 第三次握手（客户端发送 ACK 报文给服务器）：
客户端确认了：自己发送、接收正常，对方发送、接收正常；
服务器确认了：自己发送、接收正常，对方发送、接收正常


####  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B%E8%BF%87%E7%A8%8B%E4%B8%AD%E5%8F%AF%E4%BB%A5%E6%90%BA%E5%B8%A6%E6%95%B0%E6%8D%AE%E5%90%97 "三次握手过程中可以携带数据吗")三次握手过程中可以携带数据吗
第三次握手的时候，是可以携带数据的。但是，**第一次、第二次握手绝对不可以携带数据** ，**简单的记忆就是，请求连接/接收 即`SYN = 1` 的时候不能携带数据**
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#TCP%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B "TCP四次挥手")TCP四次挥手
![img](https://segmentfault.com/img/remote/1460000039165595)
####  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B "为什么要四次挥手")为什么要四次挥手
由于 TCP 的**半关闭** （half-close）特性，TCP 提供了连接的一端在结束它的发送后还能接收来自另一端数据的能力。
任何一方都可以在数据传送结束后发出连接释放的通知，待对方确认后进入**半关闭状态** 。当另一方也没有数据再发送的时候，则发出连接释放通知，对方确认后就**完全关闭** 了TCP连接。
参考连接：<https://segmentfault.com/a/1190000039165592>
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E8%BF%9B%E7%A8%8B%E5%92%8C%E7%BA%BF%E7%A8%8B%E7%9A%84%E6%A6%82%E5%BF%B5%E3%80%81%E5%8C%BA%E5%88%AB "进程和线程的概念、区别")进程和线程的概念、区别
概念：
  1. 进程是运行时程序的封装，是**系统进行资源调度和分配的基本单位，实现了操作系统的并发** 。
  2. 线程是进程的子任务，是**CPU调度和分派的基本单位，用于保证程序的实时性，实现进程内部的并发；线程是操作系统可识别的最小执行和调度单位** 。每个线程都独占一个**虚拟处理器** ：独自的**寄存器组** ，**指令计数器** 和**处理器状态** 。每个线程共享同一地址空间，打开的文件队列和其他内核资源。


区别：
  1. 一个线程只能属于一个进程，而一个进程可以有多个线程；
  2. 进程在执行过程中拥有独立的内存单元，而多个线程共享进程的内存
  3. 进程是资源分配的最小单位，线程是CPU调度的最小单位
  4. 系统开销：进程切换的开销也远大于线程切换的开销


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E8%BF%9B%E7%A8%8B%E7%BA%BF%E7%A8%8B%E9%97%B4%E9%80%9A%E4%BF%A1 "进程线程间通信")进程线程间通信
进程间通信主要包括**管道** 、**系统IPC** （**消息队列** 、**信号量** 、**信号** 、**共享内存** ）以及**套接字socket** 。
socket也是一种进程间通信机制，与其他通信机制不同的是，它可用于不同主机之间的进程通信。
线程间通信的方式: 
  1. 临界区：通过多线程的串行化来访问公共资源或一段代码，速度快，适合控制数据访问；
  2. 互斥量Synchronized/Lock：采用互斥对象机制，只有拥有互斥对象的线程才有访问公共资源的权限。因为互斥对象只有一个，所以可以保证公共资源不会被多个线程同时访问 
  3. 信号量Semphare：为控制具有有限数量的用户资源而设计的，它允许多个线程在同一时刻去访问同一个资源，但一般需要限制同一时刻访问此资源的最大线程数目。 
  4. 事件(信号)，Wait/Notify：通过通知操作的方式来保持多线程同步，还可以方便的实现多线程优先级的比较操作


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%85%B3%E7%B3%BB%E5%9E%8B%E6%95%B0%E6%8D%AE%E5%BA%93%E5%92%8C%E9%9D%9E%E5%85%B3%E7%B3%BB%E5%9E%8B%E6%95%B0%E6%8D%AE%E5%BA%93 "关系型数据库和非关系型数据库")关系型数据库和非关系型数据库
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%85%B3%E7%B3%BB%E5%9E%8B%E6%95%B0%E6%8D%AE%E5%BA%93 "关系型数据库")关系型数据库
  1. **概念** ：关系型数据库是指采用了关系模型来组织数据的数据库。简单来说，关系模式就是二维表格模型。
主要代表：SQL Server，Oracle,Mysql,PostgreSQL。
  2. **优点** ：
    1. 容易理解，二维表的结构非常贴近现实世界，二维表格，容易理解。
    2. 使用方便，通用的sql语句使得操作关系型数据库非常方便。
    3. 易于维护，数据库的ACID属性，大大降低了数据冗余和数据不一致的概率。
  3. **瓶颈** ：
    1. 海量数据的读写效率。对于网站的并发量高，往往达到每秒上万次的请求，对于传统关系型数据库来说，硬盘I/o是一个很大的挑战。
    2. 高扩展性和可用性。在基于web的结构中，数据库是最难以横向拓展的，当一个应用系统的用户量和访问量与日俱增的时候，数据库没有办法像web Server那样简单的通过添加更多的硬件和服务节点来拓展性能和负载能力。


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E9%9D%9E%E5%85%B3%E7%B3%BB%E5%9E%8B%E6%95%B0%E6%8D%AE%E5%BA%93 "非关系型数据库")非关系型数据库
  1. **概念** ：NoSQL非关系型数据库，主要指那些非关系型的、分布式的，且一般不保证ACID的数据存储系统，主要代表MongoDB，Redis、CouchDB。NoSQL提出了另一种理念，以键值来存储，且结构不稳定，每一个元组都可以有不一样的字段，这种就不会局限于固定的结构，可以减少一些时间和空间的开销。使用这种方式，为了获取用户的不同信息，不需要像关系型数据库中，需要进行多表查询。仅仅需要根据key来取出对应的value值即可。
  2. **分类** ：非关系数据库大部分是开源的，实现比较简单，大都是针对一些特性的应用需求出现的。根据结构化方法和应用场景的不同，分为以下几类。
    1. 面向高性能并发读写的key-value数据库。主要特点是具有极高的并发读写性能，例如Redis、Tokyo Cabint等。
    2. 面向海量数据访问的面向文档数据库。特点是，可以在海量的数据库快速的查询数据。例如MongoDB以及CouchDB。
    3. 面向可拓展的分布式数据库。解决的主要问题是传统数据库的扩展性上的缺陷。
  3. **缺点** ：但是由于Nosql约束少，所以也不能够像sql那样提供where字段属性的查询。因此适合存储较为简单的数据。有一些不能够持久化数据，所以需要和关系型数据库结合。


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E8%99%9A%E6%8B%9F%E5%86%85%E5%AD%98 "虚拟内存")虚拟内存
虚拟内存可以让程序拥有超过系统物理内存大小的可用内存空间。**虚拟内存为每一个进程提供了一个一致的、私有的地址空间，它让每个进程产生了一种自己在独享储存的错觉（每个内存拥有一片连续完整的内存空间）** 。
虚拟内存的重要意义是它定义了一个连续的虚拟地址空间，并把内存扩展到硬盘空间。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E4%BA%92%E6%96%A5%E9%94%81%E3%80%81%E5%8F%AF%E9%87%8D%E5%85%A5%E9%94%81%E3%80%81%E8%AF%BB%E5%86%99%E9%94%81%E4%B8%8E%E8%87%AA%E6%97%8B%E9%94%81 "互斥锁、可重入锁、读写锁与自旋锁")互斥锁、可重入锁、读写锁与自旋锁
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#mutex-%E4%BA%92%E6%96%A5%E9%87%8F "mutex 互斥量")mutex 互斥量
mutex是睡眠等待类型的锁，当线程抢互斥锁失败的时候，线程会陷入休眠。优点就是节省CPU资源，缺点就是休眠唤醒会消耗一点时间。
依据同一线程是否能多次加锁，把互斥量又分为如下两类：
  * 是：递归互斥量recursive mutex，也称**可重入锁** ，reentrant lock
  * 否：非递归互斥量non-recursive mutex，也称**不可重入锁** ，non-reentrant mutex


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#read-write-lock-%E8%AF%BB%E5%86%99%E9%94%81 "read-write lock 读写锁")read-write lock 读写锁
又称“共享-独占锁”，对于临界区区分读和写，读共享，写独占。
读写锁的特性：
  * 当读写锁被加了写锁时，其他线程对该锁加读锁或者写锁都会**阻塞** 。
  * 当读写锁被加了读锁时，其他线程对该锁加写锁会**阻塞** ，加读锁会成功。


适用于多读少写的场景。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#spinlock-%E8%87%AA%E6%97%8B%E9%94%81 "spinlock 自旋锁")spinlock 自旋锁
**自旋，更通俗的一个词时“忙等待”（busy waiting）。最通俗的一个理解，其实就是死循环。**
自旋锁不会引起线程休眠。当共享资源的状态不满足时，自旋锁会不停地**循环检测状态**(==循环检测状态利用了CPU提供的原语Compare&Exchange来保证原子性==)。因为不会陷入休眠，而是忙等待的方式也就不需要条件变量。不休眠就不会引起上下文切换，但是会比较浪费CPU。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Java%E7%9A%84%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E6%9C%BA%E5%88%B6%EF%BC%88GC%EF%BC%89 "Java的垃圾回收机制（GC）")Java的垃圾回收机制（GC）
![GC讨论内容](https://segmentfault.com/img/remote/1460000038256036)
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%9E%83%E5%9C%BE%E7%9A%84%E5%AE%9A%E4%B9%89 "垃圾的定义")垃圾的定义
####  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%BC%95%E7%94%A8%E8%AE%A1%E6%95%B0%E6%B3%95 "引用计数法")引用计数法
对象被创建之后，系统会给这个对象初始化一个引用计数器。被引用了则+1，引用失效后-1，直到计数器为0，意味该对象不再被使用，可以被回收。
引用计数法无法避免循环引用。
####  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%A0%B9%E6%90%9C%E7%B4%A2%E7%AE%97%E6%B3%95 "根搜索算法")根搜索算法
解决了循环引用问题。从某一些指定的根对象出发，一步步遍历找到和这个根对象具有引用关系的对象，然后再从这些对象开始继续寻找，从而形成一个个的引用链，然后不在这些引用链上面的对象便被表示为引用不可达对象，这些对象需要被回收掉。
根对象，一般有如下几种：
  * 虚拟机栈中引用的对象
  * 方法区中常量引用的对象
  * 方法区中静态属性引用的对象
  * 本地方法栈中JNI引用的对象
  * 活跃线程


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%9B%9E%E6%94%B6%E7%AE%97%E6%B3%95 "回收算法")回收算法
常用的回收算法一般有：**标记-清除算法** 、**标记-整理算法** 、**复制算法** ，以及系统自动进行判定使用的**适应性算法** 。
####  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%A0%87%E8%AE%B0-%E6%B8%85%E9%99%A4%E7%AE%97%E6%B3%95 "标记-清除算法")标记-清除算法
根据**根搜索算法** 标记的不可达对象，标记所有代回收的垃圾对象之后，**统一清除** 。
内存块变得不连续，==产生内存碎片==。
####  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%A0%87%E8%AE%B0-%E6%95%B4%E7%90%86%E7%AE%97%E6%B3%95 "标记-整理算法")标记-整理算法
标记完后，让所有的对象都向一端移动，然后将端边界以外的内存全部清理掉。
==不再产生内存碎片==。
####  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%A4%8D%E5%88%B6%E7%AE%97%E6%B3%95 "复制算法")复制算法
内存区域划分为两块，每次创建对象只使用其中一块区域，当该区域使用完后，将S0上存活的对象全部复制到S1上去，之后将S0全部清理掉。
可用的内存减小一半。
所以复制算法一般会用与对象存活时间比较短的区域，例如年轻代。老年代一般会用标记-整理算法。
####  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E9%80%82%E5%BA%94%E6%80%A7%E7%AE%97%E6%B3%95 "适应性算法")适应性算法
智能选择回收算法。
####  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%88%86%E4%BB%A3%E5%9B%9E%E6%94%B6 "分代回收")分代回收
年轻代复制算法，老年代标记整理算法。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#HTTPS%E7%9A%84%E5%8A%A0%E5%AF%86%E8%BF%9E%E6%8E%A5%E8%BF%87%E7%A8%8B "HTTPS的加密连接过程")HTTPS的加密连接过程
  1. 客户端（发送者）提交HTTPS请求
  2. 服务器（接收者）响应客户，并把信息通过证书公钥加密后发给客户端（此时产生了公钥和私钥，只把公钥给客户端）
  3. 客户端验证证书公钥的有效性
  4. 有效后，会生成一个会话密钥
  5. 用证书公钥加密这个会话密钥后，发给服务器
  6. 服务器收到证书公钥加密的会话密钥后，用证书密钥的私钥解密，获取会话密钥
  7. 客户端与服务器双方利用这个会话密钥加密要传输的数据进行通信


**前期是非对称加密，利用公开密钥加密技术传送复杂密钥，后期利用密钥进行对称加密** 。
![img](https://pic1.zhimg.com/80/v2-5f56cd0402e7ca767f864a07dfb57f8c_720w.jpg)
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8D%8F%E7%A8%8B "协程")协程
线程分为内核态线程、用户态线程两种。
**协程的本质就是处理自身挂起和恢复的用户态线程** 。
![img](https://chuquan-public-r-001.oss-cn-shanghai.aliyuncs.com/sketch-images/coroutine-user-kernel-thread.png?x-oss-process=image/resize,w_800)
协程的切换比线程的切换速度更快，在**IO密集型任务** 情境下更适合。IO密集型任务的特点是CPU消耗少，其大部分时间都是在等待IO操作完成，对于这样的场景，一个线程足矣，因此适合采用协程。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%8C%82%E8%B5%B7-%E6%81%A2%E5%A4%8D "挂起/恢复")挂起/恢复
相比于函数，协程最大的特点就是支持**挂起/恢复** 。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8D%8F%E7%A8%8B%E5%88%86%E7%B1%BB "协程分类")协程分类
**按照是否开辟相应的调用栈** ，我们可以将协程分为两类：
  * **有栈协程** （Stackful Coroutine）：每个协程都有自己的调用栈，类似于线程的调用栈。
  * **无栈协程** （Stackless Coroutine）：协程没有自己的调用栈，挂起点的状态通过状态机或闭包等语法来实现。


####  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%9C%89%E6%A0%88%E5%8D%8F%E7%A8%8B "有栈协程")有栈协程
**有栈协程会改变函数调用栈** 。
有栈协程：在内存中给每个协程开辟一个栈内存（存在堆中），当协程挂起时会将它的运行时上下文（即栈空间）从系统栈中保存至所分配的栈内存中，当协程恢复时会将其运行时上下文从栈内存中恢复至系统栈中。
它可以在**任意函数调用层级的位置进行挂起** ，并转移调度权。
####  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%97%A0%E6%A0%88%E5%8D%8F%E7%A8%8B "无栈协程")无栈协程
无栈协程不会为各个协程开辟相应的调用栈，无栈协程通常是**基于状态机或闭包** 来实现。
基于状态机的解决方案一般是通过状态机，记录上次协程挂起时的位置，并基于此决定协程恢复时开始执行的位置。这个状态必须存储在栈以外的地方，从而避免状态与栈一同销毁。
相比于有栈协程，无栈协程不需要修改调用栈，也无需额外的内存来保存调用栈，因此它的开小会更小。但是相比于保存运行时上下文这种实现方式，无栈协程的实现还是存在比较多的限制，最大的缺点就是，它无法实现在任意函数调用层级的位置进行挂起。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8F%B3%E5%80%BC%E3%80%81%E5%8F%B3%E5%80%BC%E5%BC%95%E7%94%A8%EF%BC%8Cstd-move "右值、右值引用，std::move")右值、右值引用，std::move
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%B7%A6%E5%80%BC%E3%80%81%E5%8F%B3%E5%80%BC "左值、右值")左值、右值
左值**可以取地址、位于等号左边** ，而右值**没法取地址，位于等号右边** 。
有地址的变量就是左值，没有地址的字面值、临时值就是右值。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%B7%A6%E5%80%BC%E5%BC%95%E7%94%A8 "左值引用")左值引用
**能指向左值，不能指向右值的就是左值引用** ，**引用是变量的别名，由于右值没有地址，没法被修改，所以左值引用无法指向右值** 。
但是，const左值引用是可以指向右值的。因为const左值引用不会修改指向值。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8F%B3%E5%80%BC%E5%BC%95%E7%94%A8 "右值引用")右值引用
右值引用**可以指向右值，不能指向左值** 。
右值使用`std::move`可以指向左值。**`std::move`并不会进行移动，唯一的功能是把左值强制转化为右值**，其实现等同于一个类型转换`static_cast<T&&>(lvalue)` 。所以，**单纯的`std::move`并不会有性能提升**。
右值引用能够指向右值，本质上也是把右值提升为一个左值，并定义一个右值引用通过`std::move`指向该左值：  
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
int &&ref_a = 5;  
ref_a = 6;    
等同于以下代码：  
int temp = 5;  
int &&ref_a = std::move(temp);  
ref_a = 6;  

```
 |  
| --- | --- |  
**被声明出来的左、右值都是左值** 。因为被声明出的左右值引用是有地址的，也位于等号左边。
**右值引用既可以是左值也是右值，如果有名称则是左值，否则是右值** ，也可以说，**作为函数返回值的 &&是右值，直接声明出来的&&是左值**。
结论：
  1. 从性能上讲，左右值引用没有区别，传参使用左右值引用都可以避免拷贝。
  2. 右值引用可以直接指向右值，也可以通过std::move指向左值；而左值引用只能指向左值（const左值引用也能指向右值）。
  3. 作为函数形参时，右值引用更灵活。虽然const左值引用可以做到左右值都接受，但它无法修改，有一定局限性。


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8F%B3%E5%80%BC%E5%BC%95%E7%94%A8%E4%B8%8Estd-move%E7%9A%84%E5%BA%94%E7%94%A8%E5%9C%BA%E6%99%AF "右值引用与std::move的应用场景")右值引用与std::move的应用场景
  1. **实现移动语义** ，避免拷贝，从而提升程序性能。
  2. **vector::push_back使用std::move提升性能** 。


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#RAII "RAII")RAII
==资源获取即初始化==（==R==esource ==A==cquisition ==I==s ==I==nitialization），或称 **RAII** ，将必须在使用前请求的资源的生命周期绑定与一个对象的生存期相绑定。这些资源可以是数据库的连接、锁定的互斥体、打开的文件等。  
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

```
 | 
```
std::mutex m;  
   
void bad()   
{  
    m.lock();                    // 请求互斥体  
    f();                         // 如果 f() 抛出异常，那么互斥体永远不会被释放  
    if(!everything_ok()) return; // 提早返回，互斥体永远不会被释放  
    m.unlock();                  // 只有 bad() 抵达此语句，互斥体才会被释放  
}  
   
void good()  
{  
    std::lock_guard<std::mutex> lk(m); // RAII类：互斥体的请求即是初始化  
    f();                               // 如果 f() 抛出异常，那么就会释放互斥体  
    if(!everything_ok()) return;       // 提早返回也会释放互斥体  
}      

```
 |  
| --- | --- |  
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#IO%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8 "IO多路复用")IO多路复用
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E4%BB%80%E4%B9%88%E6%98%AFIO%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8 "什么是IO多路复用")什么是IO多路复用
  * IO多路复用是一种同步IO模型，实现==一个线程==可以监视==多个文件句柄==；
  * 一旦某个文件句柄就绪，就能够通知应用程序进行相应的读写操作；
  * 没有文件句柄就绪就会==阻塞==应用程序，交出CPU


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#IO%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8-1 "IO多路复用")IO多路复用
服务器采用多线程通过`select/poll/epoll`等系统调用获取fd列表，遍历有事件的fd进行`accept/recv/send`，使其能支持更多的并发连接请求。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#IO%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8%E7%9A%84%E4%B8%89%E7%A7%8D%E5%AE%9E%E7%8E%B0 "IO多路复用的三种实现")IO多路复用的三种实现
  * **select**
  * **poll**
  * **epoll**


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#select "select")select
仅仅知道有IO事件发生，不知道是哪几个流，需要==无差别查询==所有流，**select具有O(N)的无差别轮询复杂度** 。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c06b4e5d90e49529f818807edeb3e8e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)
  1. 使用copy_from_user从用户空间拷贝fd_set到内核空间
  2. 注册回调函数__pollwait
  3. 遍历所有fd，调用其对应的poll方法（对于socket，这个poll方法是sock_poll，sock_poll根据情况会调用到tcp_poll,udp_poll或者datagram_poll）
  4. 以tcp_poll为例，其核心实现就是__pollwait，也就是上面注册的回调函数。
  5. __pollwait的主要工作就是把current（当前进程）挂到设备的等待队列中，不同的设备有不同的等待队列，对于tcp_poll来说，其等待队列是sk->sk_sleep（注意把进程挂到等待队列中并不代表进程已经睡眠了）。在设备收到一条消息（网络设备）或填写完文件数据（磁盘设备）后，会唤醒设备等待队列上睡眠的进程，这时current便被唤醒了。
  6. poll方法返回时会返回一个描述读写操作是否就绪的mask掩码，根据这个mask掩码给fd_set赋值。
  7. 如果遍历完所有的fd，还没有返回一个可读写的mask掩码，则会调用schedule_timeout是调用select的进程（也就是current）进入睡眠。当设备驱动发生自身资源可读写后，会唤醒其等待队列上睡眠的进程。如果超过一定的超时时间（schedule_timeout指定），还是没人唤醒，则调用select的进程会重新被唤醒获得CPU，进而重新遍历fd，判断有没有就绪的fd。
  8. 把fd_set从内核空间拷贝到用户空间。

  
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
25  
26  
27  
28  
29  
30  
31  
32  
33  
34  
35  
36  
37  
38  
39  
40  
41  
42  
43  
44  
45  
46  
47  
48  
49  
50  
51  
52  
53  
54  
55  
56  
57  
58  
59  
60  
61  
62  

```
 | 
```
#include <sys/select.h>  
#include <sys/time.h>  
  
#define FD_SETSIZE 1024  
#define NFDBITS (8 * sizeof(unsigned long))  
#define __FDSET_LONGS (FD_SETSIZE/NFDBITS)  
  
// 数据结构 (bitmap)  
typedef struct {  
    unsigned long fds_bits[__FDSET_LONGS];  
} fd_set;  
  
// API  
int select(  
    int max_fd,   
    fd_set *readset,   
    fd_set *writeset,   
    fd_set *exceptset,   
    struct timeval *timeout  
)                              // 返回值就绪描述符的数目  
  
FD_ZERO(int fd, fd_set* fds)   // 清空集合  
FD_SET(int fd, fd_set* fds)    // 将给定的描述符加入集合  
FD_ISSET(int fd, fd_set* fds)  // 判断指定描述符是否在集合中   
FD_CLR(int fd, fd_set* fds)    // 将给定的描述符从文件中删除    
  
int main() {  
  /*  
   * 这里进行一些初始化的设置，  
   * 包括socket建立，地址的设置等,  
   */  
  
  fd_set read_fs, write_fs;  
  struct timeval timeout;  
  int max = 0;  // 用于记录最大的fd，在轮询中时刻更新即可  
  
  // 初始化比特位  
  FD_ZERO(&read_fs);  
  FD_ZERO(&write_fs);  
  
  int nfds = 0; // 记录就绪的事件，可以减少遍历的次数  
  while (1) {  
    // 阻塞获取  
    // 每次需要把fd从用户态拷贝到内核态  
    nfds = select(max + 1, &read_fd, &write_fd, NULL, &timeout);  
    // 每次需要遍历所有fd，判断有无读写事件发生  
    for (int i = 0; i <= max && nfds; ++i) {  
      if (i == listenfd) {  
         --nfds;  
         // 这里处理accept事件  
         FD_SET(i, &read_fd);//将客户端socket加入到集合中  
      }  
      if (FD_ISSET(i, &read_fd)) {  
        --nfds;  
        // 这里处理read事件  
      }  
      if (FD_ISSET(i, &write_fd)) {  
         --nfds;  
        // 这里处理write事件  
      }  
    }  
  }  

```
 |  
| --- | --- |  
**select缺点** ：
  * 单个进程所打开的FD是有限制的，通过`FD_SETSIZE`设置，默认1024；
  * 每次调用select，都需要把fd集合从用户态拷贝到内核态，这个开销在fd很多时会很大；
  * 对socket扫描是线性扫描，采用轮询的方法，效率较低


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#poll "poll")poll
poll本质上与select没有区别，但是基于==链表==来储存，因此**没有最大连接数的限制** 。  
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
25  
26  
27  
28  
29  
30  
31  
32  
33  
34  
35  
36  
37  
38  
39  
40  
41  
42  
43  
44  
45  
46  
47  
48  
49  
50  
51  
52  
53  
54  
55  
56  
57  

```
 | 
```
#include <poll.h>  
// 数据结构  
struct pollfd {  
    int fd;                         // 需要监视的文件描述符  
    short events;                   // 需要内核监视的事件  
    short revents;                  // 实际发生的事件  
};  
  
// API  
int poll(struct pollfd fds[], nfds_t nfds, int timeout);  
  
// 先宏定义长度  
#define MAX_POLLFD_LEN 4096    
  
int main() {  
  /*  
   * 在这里进行一些初始化的操作，  
   * 比如初始化数据和socket等。  
   */  
  
  int nfds = 0;  
  pollfd fds[MAX_POLLFD_LEN];  
  memset(fds, 0, sizeof(fds));  
  fds[0].fd = listenfd;  
  fds[0].events = POLLRDNORM;  
  int max  = 0;  // 队列的实际长度，是一个随时更新的，也可以自定义其他的  
  int timeout = 0;  
  
  int current_size = max;  
  while (1) {  
    // 阻塞获取  
    // 每次需要把fd从用户态拷贝到内核态  
    nfds = poll(fds, max+1, timeout);  
    if (fds[0].revents & POLLRDNORM) {  
        // 这里处理accept事件  
        connfd = accept(listenfd);  
        //将新的描述符添加到读描述符集合中  
    }  
    // 每次需要遍历所有fd，判断有无读写事件发生  
    for (int i = 1; i < max; ++i) {       
      if (fds[i].revents & POLLRDNORM) {   
         sockfd = fds[i].fd  
         if ((n = read(sockfd, buf, MAXLINE)) <= 0) {  
            // 这里处理read事件  
            if (n == 0) {  
                close(sockfd);  
                fds[i].fd = -1;  
            }  
         } else {  
             // 这里处理write事件       
         }  
         if (--nfds <= 0) {  
            break;         
         }     
      }  
    }  
  }  

```
 |  
| --- | --- |  
缺点同上。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#epoll "epoll")epoll
**epoll可以理解为event poll** ，不同于忙轮询和无差别轮询，epoll会把哪个流发生了怎么样的IO事件通知我们。所以说epoll实际上是**事件驱动（每个事件关联上fd）** 的，此时我们对这些流的操作都是有意义的。（复杂度降到了O(1)）  
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

```
 | 
```
#include <sys/epoll.h>  
  
// 数据结构  
// 每一个epoll对象都有一个独立的eventpoll结构体  
// 用于存放通过epoll_ctl方法向epoll对象中添加进来的事件  
// epoll_wait检查是否有事件发生时，只需要检查eventpoll对象中的rdlist双链表中是否有epitem元素即可  
struct eventpoll {  
    /*红黑树的根节点，这颗树中存储着所有添加到epoll中的需要监控的事件*/  
    struct rb_root  rbr;  
    /*双链表中则存放着将要通过epoll_wait返回给用户的满足条件的事件*/  
    struct list_head rdlist;  
};  
  
// API  
int epoll_create(int size); // 内核中间加一个 ep 对象，把所有需要监听的 socket 都放到 ep 对象中  
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event); // epoll_ctl 负责把 socket 增加、删除到内核红黑树  
int epoll_wait(int epfd, struct epoll_event * events, int maxevents, int timeout);// epoll_wait 负责检测可读队列，没有可读 socket 则阻塞进程  

```
 |  
| --- | --- |  
每个epoll对象都有一个独立的eventpoll结构体，用于存放通过epoll_ctl方法向epoll对象中添加进来的事件。这些事件都会挂载在红黑树中。
而所有添加到epoll中的事件都会与设备（网卡）驱动程序建立回调关系，也就是说，当相应的事件发生时会调用这个回调方法。这个回调方法在内核中叫ep_poll_callback，它会将发生的事件添加到rdlist双链表中。
在epoll中，对于每一个事件，都会建立一个epitem结构体，如下所示：  
| 
```
1  
2  
3  
4  
5  
6  
7  

```
 | 
```
struct epitem{  
    struct rb_node  rbn;//红黑树节点  
    struct list_head    rdllink;//双向链表节点  
    struct epoll_filefd  ffd;  //事件句柄信息  
    struct eventpoll *ep;    //指向其所属的eventpoll对象  
    struct epoll_event event; //期待发生的事件类型  
}  

```
 |  
| --- | --- |  
**通过红黑树和双链表数据结构，并结合回调机制，造就了epoll的高效** 。  
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
25  
26  
27  
28  
29  
30  
31  
32  
33  
34  
35  
36  

```
 | 
```
int main(int argc, char* argv[])  
{  
   /*  
   * 在这里进行一些初始化的操作，  
   * 比如初始化数据和socket等。  
   */  
  
    // 内核中创建ep对象  
    epfd=epoll_create(256);  
    // 需要监听的socket放到ep中  
    epoll_ctl(epfd,EPOLL_CTL_ADD,listenfd,&ev);  
   
    while(1) {  
      // 阻塞获取  
      nfds = epoll_wait(epfd,events,20,0);  
      for(i=0;i<nfds;++i) {  
          if(events[i].data.fd==listenfd) {  
              // 这里处理accept事件  
              connfd = accept(listenfd);  
              // 接收新连接写到内核对象中  
              epoll_ctl(epfd,EPOLL_CTL_ADD,connfd,&ev);  
          } else if (events[i].events&EPOLLIN) {  
              // 这里处理read事件  
              read(sockfd, BUF, MAXLINE);  
              //读完后准备写  
              epoll_ctl(epfd,EPOLL_CTL_MOD,sockfd,&ev);  
          } else if(events[i].events&EPOLLOUT) {  
              // 这里处理write事件  
              write(sockfd, BUF, n);  
              //写完后准备读  
              epoll_ctl(epfd,EPOLL_CTL_MOD,sockfd,&ev);  
          }  
      }  
    }  
    return 0;  
}  

```
 |  
| --- | --- |  
**epoll的优点** ：
  * 没有最大并发连接的限制，能打开的FD的上线远大于1024；
  * 效率提升，不是轮询的方式，不会随着FD的数目的增加效率下降。只有活跃可用的FD才会调用callback函数；
  * 内存拷贝，利用mmap()文件映射内存加速与内核空间的消息传递，即epoll使用mmap减少复制开销；


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#select-poll-epoll%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8C%BA%E5%88%AB "select/poll/epoll之间的区别")select/poll/epoll之间的区别
select，pollm，epoll都是IO多路复用的机制。IO多路复用通过一种机制，可以监视多个描述符，一旦某个描述符就绪（一般是读就绪或者写就绪），能够通知程序进行相应的读写操作。**但select，poll，epoll本质上都是同步IO，因为它们都需要在读写事件就绪后自己负责进行读写，也就是说这个读写过程是阻塞的** 。
epoll是Linux目前大规模网络并发程序开发的首选模型。  
|   | select  | poll  | epoll  |  
| --- | --- | --- | --- |  
| 操作方式  | 遍历  | 遍历  | 回调  |  
| 数据结构  | bitmap  | 数组  | 红黑树  |  
| 最大连接数  | 1024（x86）或2048（64）  | 无上限  | 无上限  |  
| 最大支持文件描述符数  | 一般有最大值限制  | 65535  | 65535  |  
| fd拷贝  | 每次调用select，都需要把fd集合从用户态拷贝到内核态  | 每次调用poll，都需要把fd集合从用户态拷贝到内核态  | fd每次调用epoll_ctl拷贝，每次调用epoll_wait不拷贝  |  
| 工作模式  | LT  | LT  | 支持ET高效模式  |  
| 工作效率  | 每次调用都进行线性遍历，时间复杂度为O(N)  | 每次调用都进行线性遍历，时间复杂度为O(N)  | 事件通知方式，每当fd就绪，系统注册的回调函数就会被调用，将就绪fd放到readylist里面，时间复杂度O(1)  |  
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E7%A8%8B%E5%BA%8F%E7%9A%84%E7%BC%96%E8%AF%91%E3%80%81%E9%93%BE%E6%8E%A5%E3%80%81%E8%A3%85%E8%BD%BD%E4%B8%8E%E8%BF%90%E8%A1%8C "程序的编译、链接、装载与运行")程序的编译、链接、装载与运行
![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/9/167935399f11a321~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E7%A8%8B%E5%BA%8F%E7%BC%96%E8%AF%91%E7%9A%84%E8%BF%87%E7%A8%8B "程序编译的过程")程序编译的过程
  1. **预处理**
     * 删除所有注释信息
     * 展开宏定义
     * 展开include
  2. **编译**
     * 词法分析、语法分析、语义分析并优化后生成相对应的汇编文件
  3. **汇编**
     * 汇编代码转为机械指令，生成**目标文件**
  4. **链接**
     * 多合并不同目标文件中的同类型的段
     * 对于目标文件中的符号引用，在其他的目标文件中找到可以引用的符号
     * 对目标文件中的变量地址进行重定位


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E7%9B%AE%E6%A0%87%E6%96%87%E4%BB%B6 "目标文件")目标文件
![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/9/1679353acd247280~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)
**分段的好处** ：
  * 方便区分，代码（指令）存到`.text`，初始化好的数据存到`.data`，只读数据存到`.rdata`等
  * 便于给段设置读写权限，某些段只需要设置只读权限即可
  * 方便CPU缓存的生效
  * 利于节省内存，例如程序有多个副本的情况下，此时只需要一份代码段即可


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E9%93%BE%E6%8E%A5 "链接")链接
**静态链接过程** ：
  1. 扫描所有的目标文件，获取它们的每个段的长度、位置和属性，并将每个目标文件中的符号表的符号定义和符号引用收集起来放在一个全局符号表中，建立起可执行文件到目标文件的段映射关系
  2. 读取目标文件中的段数据，并解析符号表信息，根据符号表信息进行重定位、调整代码段中的地址等操作


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E9%87%8D%E5%AE%9A%E4%BD%8D%E8%A1%A8 "重定位表")重定位表
编译器把所有需要重定位的数据存在重定位表中，这样连接器就能够知道该目标文件中哪些数据是需要被重定位的。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E7%AC%A6%E5%8F%B7%E8%A1%A8 "符号表")符号表
目标文件中的某些部分是在链接时被使用到的“粘合剂”，这些部分被称为“符号”，符号就保存在符号表中。符号表中保存的符号很多，其中最重要的就是定义在本目标文件中的可以被其他目标文件引用的符号和在本目标文件中引用的全局符号，这两个符号呈现互补的关系。
**重定位表与符号表之间的关系** ：
他们之间是相互合作的关系，链接器首先要根据重定位表找到该目标文件中需要被重定位的符号，之后再根据符号表去其他的目标文件中找到可以相匹配的符号，最后对本目标文件中的符号进行重定位。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E8%A3%85%E8%BD%BD "装载")装载
所以可执行文件被加载到内存中的数据可以分为两类：**可读不可写** 和**可读可写** 。
由于现代操作系统均采用**分页** 的方式来管理内存，所以操作系统只需要读取可执行文件的**文件头** ，之后建立起可执行文件到虚拟内存的映射关系，而不需要真正的将程序载入内存。在程序的运行过程中，CPU发现有些内存页在物理内存中并不存在并因此触发**缺页异** 常，此时CPU将控制权限转交给操作系统的**异常处理函数** ，操作系统负责将此内存页的数据从磁盘上读取到物理内存中。数据读取完毕之后，操作系统让CPU jmp到触发了缺页异常的那条指令处继续执行，此时指令执行就不会再有缺页异常了。
参考：<https://juejin.cn/post/6844903734191849480>
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#std-shared-ptr%E5%AE%9E%E7%8E%B0%E7%BB%86%E8%8A%82 "std::shared_ptr实现细节")`std::shared_ptr`实现细节
典型实现种，`std::shared_ptr`只**保留两个指针** ：
  * get()所返回的指针
  * 指向==控制块==的指针


控制块是一个动态分配的对象，其中包括：
  * 指向被管理对象的指针或者被管理对象本身
  * 删除器
  * 分配器
  * 占有被管理对象的shared_ptr数量
  * 涉及被管理对象的==weak_ptr==数量


指向同一被管理对象内存的shared_ptr共享控制块。
强弱引用分别计数，shared_ptr计数器减至零，控制块调用被管理对象的析构函数。但控制块本身知道weak_ptr计数器同样归零时才会释放。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Qt-deleteLater%E4%B8%8Edelete%E5%AF%B9%E6%AF%94 "Qt deleteLater与delete对比")Qt deleteLater与delete对比
`delete`是C++标准关键字，作用是调用析构函数后释放该对象的内存。
`deleteLater`是Qt的新方法，所有==继承自QObject==的对象都有此方法。
  * deleteLater依赖于Qt的**event loop** 机制
  * ==可以多次调用此函数==


**deleteLater原理** ：
  * 函数被调用后，向QCoreApplication发送一个QDeferredDeleteEvent
  * 主线程将QDeferredDeleteEvent列入事件队列，需要时将该事件分发给该对象
  * 该对象继续运行，直到收到QDeferredDeleteEvent，==delete自身==。
  * 收到QDeferredDeleteEvent后，此对象将从event loop中被移除


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Qt%E4%BF%A1%E5%8F%B7%E6%A7%BD "Qt信号槽")Qt信号槽
**信号-槽的使用方法** ：在普通函数声明之前，加上signal、slot标记，然后通过connect函数把信号槽连接起来。
![img](https://pic4.zhimg.com/80/v2-29412691dc6685a8a7ac558c37494dc3_720w.jpg)
**信号-槽分两种** ：
  * ==同一线程==内的信号槽，相当于函数调用，直接调用或列入事件循环。
  * ==不同线程==的信号槽，信号触发时，发送者线程将槽函数的调用转化成了一次“调用事件”，放入事件循环中。接收者线程执行到下一次事件处理时，处理“调用事件”，调用相应的函数。


**信号-槽的实现：元对象编译器MOC** 。
元对象编译器MOC负责解析signals、slot、emit等标准C++不存在的关键字，以及处理Q_OBJECT、Q_PROPERTY、Q_INVOKABLE等相关的宏，生成moc_xxx.cpp的C++文件（使用黑魔法来变现语法糖）。比如信号函数只要声明、不需要自己写实现，就是在这个moc_xxx.cpp文件中自动生成的。
**moc的本质就是反射器** 。
**信号槽的调用流程** ：
  * MOC查找头文件中的signal与slots，标记出信号槽。将信号槽信息储存到类静态变量staticMetaObject中，并按照声明的顺序进行存放，建立索引。
  * connect链接，将信号槽的索引信息放到一个双向链表中，彼此配对。
  * emit被调用，调用信号函数，且传递发送信号的对象指针，元对象指针，信号索引，参数列表到active函数。
  * active函数在双向链表中找到所有与信号对应的槽索引，根据槽索引找到槽函数，执行槽函数。


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Qt-MOC%E6%9C%BA%E5%88%B6 "Qt MOC机制")Qt MOC机制
**Qt程序编译顺序** ：MOC-预编译-编译-汇编-链接
元对象编译器MOC负责解析signals、slot、emit等标准C++不存在的关键字，以及处理Q_OBJECT、Q_PROPERTY、Q_INVOKABLE等相关的宏，生成moc_xxx.cpp的C++文件（使用黑魔法来变现语法糖）。比如信号函数只要声明、不需要自己写实现，就是在这个moc_xxx.cpp文件中自动生成的。
MOC一个重要作用是展开Q_OBJECT宏：  
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

```
 | 
```
#define Q_OBJECT \public: \  
    QT_WARNING_PUSH \  
    Q_OBJECT_NO_OVERRIDE_WARNING \  
    static const QMetaObject staticMetaObject; \  
    virtual const QMetaObject *metaObject() const; \  
    virtual void *qt_metacast(const char *); \  
    virtual int qt_metacall(QMetaObject::Call, int, void **); \  
    QT_TR_FUNCTIONS \private: \  
    Q_OBJECT_NO_ATTRIBUTES_WARNING \  
    Q_DECL_HIDDEN_STATIC_METACALL static void qt_static_metacall(QObject *, QMetaObject::Call, int, void **); \  
    QT_WARNING_POP \  
    struct QPrivateSignal {}; \  
    QT_ANNOTATE_CLASS(qt_qobject, "")  

```
 |  
| --- | --- |  
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#static-const-QMetaObject-staticMetaObject "static const QMetaObject staticMetaObject")static const QMetaObject staticMetaObject
QMetaObject包含QObject中所谓的==元数据==，也就是QObject的一些描述信息：signal、slot、类型信息。
`QObject::metaObject()`返回==重载==后的QObject的metaObject对象。
Qt的元对象系统：信号槽，属性系统，运行时类信息都储存在静态对象staticMetaObject中。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E7%B1%BB%E4%BF%A1%E6%81%AF "类信息")类信息  
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
25  
26  
27  
28  
29  
30  
31  
32  
33  
34  
35  
36  
37  
38  
39  
40  
41  
42  
43  
44  
45  
46  
47  
48  
49  
50  
51  
52  
53  
54  
55  
56  
57  
58  
59  
60  
61  
62  
63  
64  
65  
66  
67  
68  
69  

```
 | 
```
//存储类中的函数及参数信息  
struct qt_meta_stringdata_test_t {  
    QByteArrayData data[7];//函数加参数一共7个  
    char stringdata0[60];//总字符串长60个字节  
};  
   
//切分字符串  
#define QT_MOC_LITERAL(idx, ofs, len) \  
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \  
    qptrdiff(offsetof(qt_meta_stringdata_test_t, stringdata0) + ofs \  
        - idx * sizeof(QByteArrayData)) \  
    )  
   
//初始化qt_meta_stringdata_test ，并且将所有函数拼接成字符串，中间用\0分开  
static const qt_meta_stringdata_test_t qt_meta_stringdata_test = {  
    {  
QT_MOC_LITERAL(0, 0, 4), // "test"    //类名 索引，偏移量，偏移长度)，类名  
QT_MOC_LITERAL(1, 5, 12), // "signal_test1"      
QT_MOC_LITERAL(2, 18, 0), // ""  
QT_MOC_LITERAL(3, 19, 12), // "signal_test2"  
QT_MOC_LITERAL(4, 32, 5), // "index"   //信号的参数名  
QT_MOC_LITERAL(5, 38, 10), // "slot_test1"  
QT_MOC_LITERAL(6, 49, 10) // "slot_test2"  
   
    },  
    "test\0signal_test1\0\0signal_test2\0index\0"  
    "slot_test1\0slot_test2"          //以上两行为字符串  
};  
#undef QT_MOC_LITERAL  
   
//存储元对象信息，包括信号和槽机制、运行时类型信息和动态属性系统  
static const uint qt_meta_data_test[] = {  
   
 // content:  
       7,       // revision  
       0,       // classname  
       0,    0, // classinfo  
       4,   14, // methods  
       0,    0, // properties  
       0,    0, // enums/sets  
       0,    0, // constructors  
       0,       // flags  
       2,       // signalCount  
/*  
 信号 第一列是信号的索引1，3;对应第一列  
QT_MOC_LITERAL(1, 5, 12), // "signal_test1"      
QT_MOC_LITERAL(2, 18, 0), // ""  
QT_MOC_LITERAL(3, 19, 12), // "signal_test2"  
      第二列是参数个数  
      第三列是？暂未明白  
*/  
 // signals: name, argc, parameters, tag, flags   
       1,    0,   34,    2, 0x06 /* Public */,  
       3,    1,   35,    2, 0x06 /* Public */,  
   
 // slots: name, argc, parameters, tag, flags  
       5,    0,   38,    2, 0x0a /* Public */,  
       6,    1,   39,    2, 0x0a /* Public */,  
   
 // signals: parameters  
    QMetaType::Void,  
    QMetaType::Void, QMetaType::Int,    4,  
   
 // slots: parameters  
    QMetaType::Void,  
    QMetaType::Void, QMetaType::Int,    4,  
   
       0        // eod  
};  

```
 |  
| --- | --- |  
参考链接：<https://blog.csdn.net/LIJIWEI0611/article/details/115056153>
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Qt%E5%8F%8D%E5%B0%84%E6%9C%BA%E5%88%B6 "Qt反射机制")Qt反射机制
  * 继承自QObject，使用Q_OBJECT宏
  * 使用`Q_PROPERTY({type} {name} READ {func1} WRITE {func2} NOTIFY {sig1})`宏注册属性
  * 使用`Q_INVOKABLE fun1(args...)`宏注册类的成员函数


参考链接：<https://zhuanlan.zhihu.com/p/55883889>
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#TCP%E8%BF%9E%E6%8E%A5%E7%9A%84%E6%96%AD%E5%BC%80 "TCP连接的断开")TCP连接的断开
除正常情况的==四次挥手==断开连接外，TCP断开连接有如下规则：
  * TCP连接断开的==挥手==，在进程崩溃时，会由操作系统内核代劳
  * 当TCP连接建立后，如果某一方断电或断网，如果此时刚好**正在发送数据** ，TCP数据包发送失败后会==重试==，重试达到上限时也会直接断开连接
    * > Linux下：
> 最小重传时间为==200ms==
> 最大重传时间为==120s==
> 重传次数为==15==
  * 当TCP连接建立后，如果某一方断电或断网，且这条连接**没有数据传输时** ：
    * 如果开启了==KeepAlive==机制，则会在一定心跳检测后断开连接，这个默认检测时间大概==2个多小时==，比较久
    * 如果未开启KeepAlive机制，则连接**永远存在**
  * 如果一方发送==RST包==给另一方，也是会强制对方断开连接的（断电/断网后某端重启再恢复，便会发送RST）


参考链接：<https://blog.51cto.com/u_15067225/4334375>
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%E8%BF%87%E7%A8%8B "C++函数调用过程")C++函数调用过程
在堆栈中变量分布是从高地址到低地址分布，EBP是指向栈底的指针，**在调用过程中不变** ，又称为==帧指针==。ESP指向栈顶，程序执行时移动，ESP减小分配空间，ESP增大释放空间，ESP又称为==栈指针==。  
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

```
 | 
```
#include <stdio.h>  
  
int func(int param1 ,int param2,int param3)  
{  
        int var1 = param1;  
        int var2 = param2;  
        int var3 = param3;  
  
        printf("var1=%d,var2=%d,var3=%d",var1,var2,var3);  
        return var1;  
}  
  
int main(int argc, char* argv[])  
{  
        int result = func(1,2,3);  
  
        return 0;  
}  

```
 |  
| --- | --- |  
  1. 函数main执行，main各个参数**从右向左逐步压入栈中，最后压入返回地址** 。
  2. 执行第15行，3个参数从左向右的顺序压入堆栈，栈内分布如下图：  
![img](https://pic002.cnblogs.com/images/2012/426620/2012072014171977.jpg)
  3. **返回地址入栈** ，栈内分布如下：  
![img](https://pic002.cnblogs.com/images/2012/426620/2012072014223353.jpg)
  4. 函数调用，通过跳转指令进入函数，**函数地址入栈后，EBP入栈，然后把当前ESP的值给EBP** ，对应的汇编指令：  
| 
```
1  
2  

```
 | 
```
push ebp  
mov ebp esp  

```
 |  
| --- | --- |  
此时栈顶和栈底指向同一位置，栈内分布如下：
![img](https://pic002.cnblogs.com/images/2012/426620/2012072014393253.jpg)
  5. 执行函数内容。按申明顺序依次储存。
![img](https://pic002.cnblogs.com/images/2012/426620/2012072014460755.jpg)
  6. 输出结果。**通过eax寄存器保存函数的返回值** 。
  7. 调用执行函数完毕，局部变量var3，var2，var3依次出栈，EBP恢复原值，返回地址出栈，找到原执行地址，param1，param2，param3依次出栈，函数调用执行完毕。


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%9C%A8%E5%A0%86%E4%B8%8A%E5%88%86%E9%85%8D%E5%86%85%E5%AD%98%E5%BF%AB%E8%BF%98%E6%98%AF%E6%A0%88%E4%B8%8A%E5%88%86%E9%85%8D%E5%86%85%E5%AD%98%E6%9B%B4%E5%BF%AB%EF%BC%9F "在堆上分配内存快还是栈上分配内存更快？")在堆上分配内存快还是栈上分配内存更快？
**在栈上分配释放内存更快** 。
栈是程序启动时，系统分配好了的。
堆是用的时候向系统申请，用了还回去，申请和交还的过程开销就比较大了。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%86%85%E5%AD%98%E7%A2%8E%E7%89%87 "内存碎片")内存碎片
内存碎片的产生有两方面的原因：
  1. **动态内存分配的问题** ：
内存碎片即“碎片的内存”，描述一个系统中所有不可用的空闲内存，这些碎片之所以不能被使用，是因为负责**动态分配内存的分配算法使得这些空闲的内存无法使用** 。空闲内存以小且不连续的方式出现在不同的位置。
空闲内存碎片有两种：**a.内部碎片；b.外部碎片**
**内部碎片的产生** ：==所有内存分配必须起始于可被4、8或16整除的地址==，内存分配算法仅能把预定大小的内存块分配给永固，此时可能产生多余空间即内部碎片。
**外部碎片的产生** ：**频繁的分配与回收物理界面导致大量的、连续且小的页面夹在已经分配的页面中间，就会产生外部碎片。**
  2. **系统内存回收机制问题** ：
内存碎片是一个系统问题，反复的malloc和free，free后的内存又不能马上被系统回收利用，这个与系统对内存的回收机制有关。


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E9%9D%99%E6%80%81%E9%93%BE%E6%8E%A5%E4%B8%8E%E5%8A%A8%E6%80%81%E9%93%BE%E6%8E%A5 "静态链接与动态链接")静态链接与动态链接
静态链接与动态链接最大的区别就在于**链接的时机不一样** ，静态链接是在形成可执行程序前，动态链接的进行则是在程序执行时。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E9%9D%99%E6%80%81%E9%93%BE%E6%8E%A5 "静态链接")静态链接
目标文件合成可执行文件，编译时进行重定位。
优点：
执行速度快。
缺点：
  1. 浪费空间。
  2. 更新困难，需要重新编译链接。


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8A%A8%E6%80%81%E9%93%BE%E6%8E%A5 "动态链接")动态链接
程序按照模块拆分成各个相对独立的部分，在程序运行时才将它们链接在一起形成一个完整的程序。运行时执行重定位。
优点：
  1. 不会有多个库的副本。
  2. 更新方便


缺点：
运行时进行链接，性能略微损失。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#STL%E7%9A%84%E5%86%85%E5%AD%98%E5%88%86%E9%85%8D%E5%8E%9F%E7%90%86 "STL的内存分配原理")STL的内存分配原理
STL的默认allocator是一个==两级分配器==构成的内存管理器：
  * 当申请的内存大于128byte时，启动第一级分配器通过malloc直接向系统的堆空间申请分配内存
  * 当申请的内存小于128byte时，启动第二级分配器，从一个 **预先分配好** 的==内存池==中取一块内存交付给用户。这个内存池由16个大小不同（8的倍数，8~128byte）的空闲列表组成，allocator会根据申请内存的大小（将这个大小round up成8的倍数）从对应的空闲块列表取表头块给用户。


优点：==小对象==
  * 小对象的快速分配。
  * 避免了内存碎片的产生。


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Qt-connect%E7%9A%84%E7%AC%AC%E4%BA%94%E4%B8%AA%E5%8F%82%E6%95%B0%EF%BC%88%E4%BF%A1%E5%8F%B7%E6%A7%BD%E8%BF%9E%E6%8E%A5%E6%96%B9%E5%BC%8F%EF%BC%89 "Qt connect的第五个参数（信号槽连接方式）")Qt connect的第五个参数（信号槽连接方式）
  1. `Qt::AutoConnection`： 默认值，使用这个值则连接类型会在信号发送时决定。如果接收者和发送者在同一个线程，则自动使用Qt::DirectConnection类型。如果接收者和发送者不在一个线程，则自动使用Qt::QueuedConnection类型。
  2. `Qt::DirectConnection`：槽函数会在信号发送的时候直接被调用，槽函数运行于信号发送者所在线程。效果看上去就像是直接在信号发送位置调用了槽函数。这个在多线程环境下比较危险，可能会造成奔溃。
  3. `Qt::QueuedConnection`：槽函数在控制回到接收者所在线程的事件循环时被调用，槽函数运行于信号接收者所在线程。发送信号之后，槽函数不会立刻被调用，等到接收者的当前函数执行完，进入事件循环之后，槽函数才会被调用。多线程环境下一般用这个。
  4. `Qt::BlockingQueuedConnection`：槽函数的调用时机与Qt::QueuedConnection一致，不过发送完信号后发送者所在线程会阻塞，直到槽函数运行完。接收者和发送者绝对不能在一个线程，否则程序会死锁。在多线程间需要同步的场合可能需要这个。
  5. `Qt::UniqueConnection`：这个flag可以通过按位或（|）与以上四个结合在一起使用。当这个flag设置时，当某个信号和槽已经连接时，再进行重复的连接就会失败。也就是避免了重复连接。


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#HTTP%E7%9A%84%E6%96%B9%E6%B3%95 "HTTP的方法")HTTP的方法
超文本传输协议（HTTP）的设计目的是保证客户端于服务器之间的通信。
HTTP的工作方式是客户端与服务器之间的请求-应答协议。
  * **GET** ：从指定的资源==请求数据==
**查询字符串（名称/值对）是在GET请求的URL中发送的** ：  
| 
```
1  

```
 | 
```
/test/demo_form.php?name1=value1&name2=value2  

```
 |  
| --- | --- |  
    * GET请求可被缓存
    * GET请求保留在浏览器历史记录中
    * GET请求可被收藏为书签
    * GET请求不应再处理敏感数据时使用
    * GET请求有长度限制
    * GET请求只应当用于取回数据
  * **POST** ：向指定的资源==提交==要被处理的数据：
**查询字符串（名称/值对）时在POST请求的HTTP消息主体中发送的** ：  
| 
```
1  
2  
3  

```
 | 
```
POST /test/demo_form.php HTTP/1.1  
Host: runoob.com  
name1=value1&name2=value2  

```
 |  
| --- | --- |  
    * POST请求不会被缓存
    * POST请求不会保存在浏览器历史记录中
    * POST不能被收藏为书签
    * POST请求对数据长度没有要求
  * HEAD：与GET相同，但只返回HTTP报头，不返回文档主体
  * PUT：上传指定的URL表示
  * DELETE：删除指定资源
  * OPTIONS：返回服务器支持的HTTP方法
  * CONNECT：把请求连接转换到透明的TCP/IP通道


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E7%B1%BB%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%86%85%E5%AD%98%E5%88%86%E5%B8%83%EF%BC%88%E5%86%85%E5%AD%98%E5%AF%B9%E9%BD%90%EF%BC%89 "C++类对象的内存分布（内存对齐）")C++类对象的内存分布（内存对齐）
C++类初始化为一个对象后，该对象实例在内存中的分布情况：
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E7%A9%BA%E7%B1%BB "空类")空类
实例化一个空类，会在内存中占用1个字节，表示为类实例。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8F%AA%E5%90%AB%E5%9F%BA%E6%9C%AC%E6%95%B0%E6%8D%AE%EF%BC%8C%E4%B8%8D%E5%90%AB%E5%87%BD%E6%95%B0 "只含基本数据，不含函数")只含基本数据，不含函数  
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
#include <iostream>  
using namespace std;  
  
class A{  
	char a;  
	int b;  
	char c;  
};  
  
  
class B{  
	char a;  
	char c;  
	int b;  
};  
  
  
int main(){  
	cout<<sizeof(A)<<endl;  
	cout<<sizeof(B)<<endl;	  
}   

```
 |  
| --- | --- |  
答案分别是：
12
8
原因在于C++类成员变量的内存分布式**从上到下** ，按照**内存对齐** 原则进行分布的。
**内存对齐原则** ：
>   1. ==分配内存的顺序是按照声明的顺序。==
>   2. ==每个变量相对于起始位置的偏移量必须是该变量类型大小的整数倍，不是整数倍空出内存，直到偏移量是整数倍位置。==
>   3. ==最后整个类的大小必须是**变量类型最大值** 的整数倍。==
> 

**为什么要进行内存对齐：**
  1. 平台原因（移植原因）：某些硬件平台只能在某些地址处取某些特定类型的数据，不能访问任意地址。
  2. 性能原因：访问未对其的内存，处理器需要作两次内存访问；而对齐的内存访问仅需要一次访问。


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%B8%A6%E6%88%90%E5%91%98%E5%87%BD%E6%95%B0%E7%9A%84%E7%B1%BB "带成员函数的类")带成员函数的类
函数不占实例内存，一个类的函数时公共的，一个类的函数只有一份。
类的成员函数存放与具体编译器有关，有的放在只读区，有的存放在代码区。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%B8%A6%E8%99%9A%E5%87%BD%E6%95%B0%E7%9A%84%E7%B1%BB "带虚函数的类")带虚函数的类  
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

```
 | 
```
class E {  
  virtual int func1() { cout << "虚函数" << endl; }  
  
  char a;  
  int b;  
  char c;  
  
  int func() { cout << "成员函数" << endl; }  
};  

```
 |  
| --- | --- |  
24
虚函数表指针占用了前8位。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B "C++数据类型")C++数据类型  
| 类型名称  | 字节  | 其他名称  | 值的范围  |  
| --- | --- | --- | --- |  
| **`int`** |  4  | **`signed`** |  -2,147,483,648 到 2,147,483,647  |  
| **`unsigned int`** |  4  | **`unsigned`** |  0 到 4,294,967,295  |  
| **`__int8`** |  1  | **`char`** |  -128 到 127  |  
| **`unsigned __int8`** |  1  | **`unsigned char`** |  0 到 255  |  
| **`__int16`** |  2  |  **`short`**,**`short int`**,**`signed short int`**  | -32,768 到 32,767  |  
| **`unsigned __int16`** |  2  |  **`unsigned short`**,**`unsigned short int`**  | 0 到 65,535  |  
| **`__int32`** |  4  |  **`signed`**,**`signed int`**,**`int`**  | -2,147,483,648 到 2,147,483,647  |  
| **`unsigned __int32`** |  4  |  **`unsigned`**,**`unsigned int`**  | 0 到 4,294,967,295  |  
| **`__int64`** |  8  |  **`long long`**,**`signed long long`**  | -9,223,372,036,854,775,808 到 9,223,372,036,854,775,807  |  
| **`unsigned __int64`** |  8  | **`unsigned long long`** |  0 到 18,446,744,073,709,551,615  |  
| **`bool`** |  1  | 无  |  **`false`**或**`true`**  |  
| **`char`** |  1  | 无  | -128 到 127 默认 0 to 255 when compiled by using [`/J`](https://docs.microsoft.com/zh-cn/cpp/build/reference/j-default-char-type-is-unsigned?view=msvc-170)  |  
| **`signed char`** |  1  | 无  | -128 到 127  |  
| **`unsigned char`** |  1  | 无  | 0 到 255  |  
| **`short`** |  2  |  **`short int`**,**`signed short int`**  | -32,768 到 32,767  |  
| **`unsigned short`** |  2  | **`unsigned short int`** |  0 到 65,535  |  
| **`long`** |  4  |  **`long int`**,**`signed long int`**  | -2,147,483,648 到 2,147,483,647  |  
| **`unsigned long`** |  4  | **`unsigned long int`** |  0 到 4,294,967,295  |  
| **`long long`** |  8  | 无 (，但等效于 **`__int64`**)  | -9,223,372,036,854,775,808 到 9,223,372,036,854,775,807  |  
| **`unsigned long long`** |  8  | 无 (，但等效于 **`unsigned __int64`**)  | 0 到 18,446,744,073,709,551,615  |  
| **`enum`** |  多种多样  | 无  |   |  
| **`float`** |  4  | 无  | 3.4E +/- 38（7 位数）  |  
| **`double`** |  8  | 无  | 1.7E +/- 308（15 位数）  |  
| **`long double`** |  与 **`double`**  | 无  | 与 **`double`**相同  |  
| **`wchar_t`** |  2  | **`__wchar_t`** |  0 到 65,535  |  
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%8C%87%E9%92%88%E5%92%8C%E5%BC%95%E7%94%A8%E7%9A%84%E5%8C%BA%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F "指针和引用的区别是什么？")指针和引用的区别是什么？
  1. 引用必须定义时**初始化** ，不能像指针一样仅`int* a;`这样定义，必须`int &b=a;`。
  2. `int & const r = a`这样写错误，因为引用本身就不能改变指向，**添加const多次一举。**
  3. 指针可以有多级**但引用只能有一级** 。
  4. 指针的++，–代表下一个数据，**引用的++，–代表数据本身的加减。**
  5. sizeof引用得到的是所指向的变量（对象）的大小，而sizeof指针得到的是指针本身的大小；
  6. 当指针和引用作为函数参数的时候，指针传递参数会生成一个临时变量，引用传递的参数不会生成一个临时变量。


指针传递的本质是值传递复制实参的地址到函数的栈中，然后在形参中对地址取值操作。而引用的形参是给实参起了一个别名，可以直接操控实参从而实现对实参的控制。
参考链接：[C++ 值传递、指针传递、引用传递详解](https://link.zhihu.com/?target=https://www.cnblogs.com/dingxiaoqiang/p/8012578.html)
题外话：
引用的本质就是指针，它的出现是为了书写方便，不要动不动有`*a=10`。
`int &b=a;`这里&a，&b取址相同，并不代表引用b不占用内存，而是系统自动将&b转换成对b中内容的读取。而b里面保存的是a的地址。后台实际运行时，`int *b=&a;b=12`就是`*b=12`。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E7%A8%8B%E5%BA%8F%E8%BF%90%E8%A1%8C%E6%97%B6%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%86%85%E5%AD%98%E5%88%86%E5%B8%83%E6%83%85%E5%86%B5 "C++程序运行时进程的内存分布情况")C++程序运行时进程的内存分布情况
![在这里插入图片描述](https://img-blog.csdnimg.cn/db0745b0bb634a62847e3eb2b18bb6d0.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM4OTczNzEw,size_16,color_FFFFFF,t_70)
内存分为5部分，从高地址到低地址为：
  * **栈** ：空间向下
  * **堆** ：空间向上
  * **未初始化的数据段** （==bss==）：该段数据在程序开始之前由操作系统内核初始化为0，包含所有==初始化为0==和==没有显式初始化==的==全局变量==和==静态变量==
  * **初始化的数据段** （==data==）：==初始化==的==全局变量==和==静态变量==
  * **代码段** （==text==）：存放程序的二进制代码


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E5%8F%98%E9%87%8F%E7%9A%84%E5%86%85%E5%AD%98%E5%88%86%E9%85%8D "C++变量的内存分配")C++变量的内存分配
C的储存区分为：
  * **栈** ：编译器自动分配释放
  * **堆** ：程序员分配释放
  * **全局区（静态区）** ：全局变量与静态变量存放在一起，初始化与未初始化的全局变量和静态变量分别存放在两块相邻的区域。-程序结束释放
  * **常量区** ：程序结束释放


C++的储存区分为：
  * **栈** ：由编译器在需要的时候分配，在不需要的时候自动清除的变量的存储区。里面的变量通常是局部变脸、函数参数等。
  * **堆** ：==new==分配的内存块，他们的释放由程序员负责。若程序员没有释放掉，程序结束后操作系统会自动回收。
  * **自由存储区** ：==malloc==分配的内存块，他和堆是十分相似的，区别是用free来结束自己的声明。
  * **全局/静态存储区** ：全局变量和静态变量被分配到同一块内存中，在C语言中，全局变量和静态变量分为初始化的和未初始化的，在C++中无区分，共同占用同一块内存区
  * **常量存储区** ：里面存放常量


判断规则：
  * 函数体中定义的变量通常是在==栈==上
  * 用malloc，new等分配内存的函数分配得到的在==堆==上
  * 全局变量存在==全局区==
  * 所有静态变量存在==全局区==
  * “abcd”字符串常量存放在==常量区==


> `char s[] = "hello"`，s为全局变量，存放在==数据段==（简称“==数据段==”）的==读写区域==；
> `char *ss = "world"`，ss为全局变量，存放在==数据段==的==只读部分==
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E7%9A%84%E5%A4%9A%E6%80%81 "C++的多态")C++的多态
面向对象的三大特征：**封装** 、**继承** 和**多态** 。
多态分为**编译时的多态** 与**运行时的多态** 。
编译时的多态就是==函数重载==，包括==运算符重载==，编译时根据实参决定调用哪个函数。
运行时的多态与==继承==、==虚函数==有关。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E4%B8%80%E6%AC%A1%E5%AE%8C%E6%95%B4%E7%9A%84HTTP%E8%AF%B7%E6%B1%82 "一次完整的HTTP请求")一次完整的HTTP请求
当我们在web浏览器的地址栏输入[www.baidu.com时，简单来说发生了下述行为：](http://www.baidu.com%E6%97%B6%EF%BC%8C%E7%AE%80%E5%8D%95%E6%9D%A5%E8%AF%B4%E5%8F%91%E7%94%9F%E4%BA%86%E4%B8%8B%E8%BF%B0%E8%A1%8C%E4%B8%BA%EF%BC%9A)
**概述** ：
  1. 对[www.baidu.com这个网址进行DNS域名解析，得到对应的IP地址。](http://www.baidu.com%E8%BF%99%E4%B8%AA%E7%BD%91%E5%9D%80%E8%BF%9B%E8%A1%8Cdns%E5%9F%9F%E5%90%8D%E8%A7%A3%E6%9E%90,%E5%BE%97%E5%88%B0%E5%AF%B9%E5%BA%94%E7%9A%84ip%E5%9C%B0%E5%9D%80./)
  2. 根据这个IP，找到对应的服务器，发起TCP的三次握手。
  3. 建立TCP连接后发起HTTP请求。
  4. 服务器相应HTTP请求，浏览器获得HTML代码。
  5. 浏览器解析HTML代码，并请求HTML代码中的资源（如JS、CSS、图片等）（==先得到HTML代码，才能去找这些资源==）。
  6. 浏览器对页面进行渲染呈现给用户。
  7. 服务器关闭TCP连接。


注：
  1. DNS怎么找到域名？
> DNS域名解析采用的是递归查询的方式，过程是，先去找DNS缓存->缓存找不到就去根域名服务器->根域名又会去找下一级，这样递归查找之后，找到了，给我们的web浏览器
  2. 为什么HTTP协议要基于TCP来实现？
> TCP是一个端到端的可靠的面向连接的协议，HTTP基于传输层TCP协议不用担心数据传输的各种问题（当发生错误时，会重传）
  3. 最后一步浏览器是如何对页面进行渲染的？
> a) 解析HTML文件形成DOM树
> b) 解析CSS文件构成渲染树
> c) 边解析，边渲染
> d) JS单线程运行，JS有可能修改DOM结构，意味着JS执行完成前，后续所有资源的下载是没有必要的，所以JS是单线程，会阻塞后续资源下载。


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%85%B3%E9%97%ADTCP%E8%BF%9E%E6%8E%A5 "服务器关闭TCP连接")服务器关闭TCP连接
一般情况下，一旦Web服务器向浏览器发送了请求数据，它就要关闭TCP连接，然后如果浏览器或者服务器在其头信息加入了这行代码：  
| 
```
1  

```
 | 
```
Connection:keep-alive   

```
 |  
| --- | --- |  
TCP连接在发送后将仍然保持打开状态，于是，浏览器可以继续通过相同的连接发送请求。保持连接节省了为每个请求新连接所需的时间，还节约了网络带宽。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#QCoreApplication%EF%BC%8CQGuiApplication%EF%BC%8CQApplication%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%B3%E7%B3%BB "QCoreApplication，QGuiApplication，QApplication之间的关系")QCoreApplication，QGuiApplication，QApplication之间的关系
`QObject`->`QCoreApplication`->`QGuiApplication`->`QApplication`
使用QWidget时应使用`QApplication`。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Qt%E7%9A%84D%E6%8C%87%E9%92%88%EF%BC%88d-ptr%EF%BC%89%E4%B8%8EQ%E6%8C%87%E9%92%88%EF%BC%88q-ptr%EF%BC%89 "Qt的D指针（d_ptr）与Q指针（q_ptr）")Qt的D指针（`d_ptr`）与Q指针（`q_ptr`）
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#D%E6%8C%87%E9%92%88 "D指针")D指针
==PIMPL==模式，指向一个包含所有数据的私有数据结构体。
  * 私有的结构体可以随意改变，而不需要重新编译整个工程项目
  * 隐藏实现细节
  * 头文件中没有任何实现细节，可以作为API使用
  * 原本在头文件的实现部分转移到乐源文件，所以编译速度有所提高


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Q%E6%8C%87%E9%92%88 "Q指针")Q指针
私有的结构体中储存一个指向公有类的Q指针。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%80%BB%E7%BB%93 "总结")总结
  * Qt中的一个类常用一个PrivateXXX类来处理内部逻辑，使得内部逻辑与外部接口分开，这个PrivateXXX对象通过D指针来访问；在PrivateXXX中有需要引用Owner的内容，通过Q指针来访问。
  * 由于D和Q指针是从基类继承下来的，子类中由于继承导致类型发生变化，需要通过`static_cast`类型转化，所以`DPTR()`与`QPTR()`宏定义实现了转换。


##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Qt%E7%9A%84%E6%99%BA%E8%83%BD%E6%8C%87%E9%92%88 "Qt的智能指针")Qt的智能指针
Qt的智能指针包括：
  * QSharedPointer
  * QScopedPointer
  * QScopedArrayPointer
  * QWeakPointer
  * QPointer
  * QSharedDataPointer


###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#QSharedPointer "QSharedPointer")QSharedPointer
相当于`std::shared_ptr`，内部维持着对拥有的内存资源的引用计数，引用计数下降到0时，这个内存资源就被释放了。
QSharedPointer是==线程安全==的，多个线程同时修改QSharedPointer对象也不需要加锁，但是QSharedPointer指向的内存区域不一定是线程安全的，所以多个线程同时修改QSharedPointer指向的数据时还要考虑加锁。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#QWeakPointer "QWeakPointer")QWeakPointer
类似于`std::weak_ptr`。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#QScopedPointer "QScopedPointer")QScopedPointer
相当于`std::unique_ptr`，内存数据只在一处被使用。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#QScopedArrayPointer "QScopedArrayPointer")QScopedArrayPointer
类似于QScopedPointer，用于指向的内存数据是一个数组时的场景。
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#QPointer "QPointer")QPointer
QPointer只能用于指向==QObject及派生类的对象==。当一个QObject或派生类对象被删除后，QPointer能自动将其内部的指针设置为0，这样在使用QPointer之前就可以判断一下是否有效乐。
**QPointer对象超出作用域时，并不会删除它指向的内存对象。**
###  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#QSharedPointer-1 "QSharedPointer")QSharedPointer
用于实现数据的隐式共享。Qt中大量使用了隐式共享与写时拷贝技术，例如：  
| 
```
1  
2  
3  

```
 | 
```
QString str1 = "abc";  
QString str2 = str1;  
str2[2] = "X";   

```
 |  
| --- | --- |  
第二行执行完后，str2和str1指向同一片内存数据。第三句执行时，Qt会为str2的内部数据重新分配内存。这样做的好处是可以有效地减少大片数据拷贝的次数，提高程序的运行效率。
Qt中隐式共享和写时拷贝就是利用QSharedDataPointer和QSharedData这两个类实现的。
##  [](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#std-string%E7%9A%84%E5%86%99%E6%97%B6%E6%8B%B7%E8%B4%9D%E4%B8%8E%E5%86%85%E5%AD%98%E5%85%B1%E4%BA%AB "std::string的写时拷贝与内存共享")std::string的写时拷贝与内存共享
std::string实现了内存共享与写时拷贝。共享的内存何时析构是利用引用计数实现的。
相关文章
  * [关于std::thread的二三事](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/\\2022\\02\\01\\%E5%85%B3%E4%BA%8Estd_thread%E7%9A%84%E4%BA%8C%E4%B8%89%E4%BA%8B\\)
  * [当我谈线程池时我谈些什么](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/\\2021\\12\\12\\%E5%BD%93%E6%88%91%E8%B0%88%E7%BA%BF%E7%A8%8B%E6%B1%A0%E6%97%B6%E6%88%91%E8%B0%88%E4%BA%9B%E4%BB%80%E4%B9%88\\)
  * [C++日期与时间编程（C++11-C++17）](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/\\2021\\05\\19\\C++%E6%97%A5%E6%9C%9F%E4%B8%8E%E6%97%B6%E9%97%B4%E7%BC%96%E7%A8%8B\\)
  * [C++并发编程](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/\\2021\\04\\22\\C++%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B\\)
  * [无锁编程简介（翻译）——译自《An Introduction to Lock-Free Programming》](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/\\2022\\02\\26\\%E6%97%A0%E9%94%81%E7%BC%96%E7%A8%8B%E7%AE%80%E4%BB%8B%EF%BC%88%E7%BF%BB%E8%AF%91%EF%BC%89%E2%80%94%E2%80%94%E8%AF%91%E8%87%AA%E3%80%8AAn%20Introduction%20to%20Lock-Free%20Programming%E3%80%8B\\)


[# C++](https://blog.skykey.fun/tags/C/) [# C++11](https://blog.skykey.fun/tags/C-11/) [# C++17](https://blog.skykey.fun/tags/C-17/) [# 学习心得](https://blog.skykey.fun/tags/%E5%AD%A6%E4%B9%A0%E5%BF%83%E5%BE%97/) [# Qt](https://blog.skykey.fun/tags/Qt/) [# 面试](https://blog.skykey.fun/tags/%E9%9D%A2%E8%AF%95/)
[ C++类对象的内存分布 ](https://blog.skykey.fun/2022/05/11/cpp_memory/ "C++类对象的内存分布")
[](https://guides.github.com/features/mastering-markdown/)
提交
0 评论
加载更多...
Powered By [Valine](https://valine.js.org)  
v1.5.2
  * 文章目录 
  * 站点概览 


  1. [1. C++/QT PC客户端面试题](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-QT-PC%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%9D%A2%E8%AF%95%E9%A2%98)
    1. [1.1. 父子继承时候，它构造函数和析构函数的顺序？析构时候，如何让父子类里所有的析构都调用一遍？](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E7%88%B6%E5%AD%90%E7%BB%A7%E6%89%BF%E6%97%B6%E5%80%99%EF%BC%8C%E5%AE%83%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E5%92%8C%E6%9E%90%E6%9E%84%E5%87%BD%E6%95%B0%E7%9A%84%E9%A1%BA%E5%BA%8F%EF%BC%9F%E6%9E%90%E6%9E%84%E6%97%B6%E5%80%99%EF%BC%8C%E5%A6%82%E4%BD%95%E8%AE%A9%E7%88%B6%E5%AD%90%E7%B1%BB%E9%87%8C%E6%89%80%E6%9C%89%E7%9A%84%E6%9E%90%E6%9E%84%E9%83%BD%E8%B0%83%E7%94%A8%E4%B8%80%E9%81%8D%EF%BC%9F)
    2. [1.2. 一个函数，如何让它在main函数之前执行？](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E4%B8%80%E4%B8%AA%E5%87%BD%E6%95%B0%EF%BC%8C%E5%A6%82%E4%BD%95%E8%AE%A9%E5%AE%83%E5%9C%A8main%E5%87%BD%E6%95%B0%E4%B9%8B%E5%89%8D%E6%89%A7%E8%A1%8C%EF%BC%9F)
    3. [1.3. 可以在C++的成员函数里调用delete this吗?](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8F%AF%E4%BB%A5%E5%9C%A8C-%E7%9A%84%E6%88%90%E5%91%98%E5%87%BD%E6%95%B0%E9%87%8C%E8%B0%83%E7%94%A8delete-this%E5%90%97)
    4. [1.4. class A; Class B{ A a; };能不能允许？](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#class-A-Class-B-A-a-%E8%83%BD%E4%B8%8D%E8%83%BD%E5%85%81%E8%AE%B8%EF%BC%9F)
    5. [1.5. C++的类型转换有哪些](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E7%9A%84%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E6%9C%89%E5%93%AA%E4%BA%9B)
    6. [1.6. C++有哪些智能指针](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E6%9C%89%E5%93%AA%E4%BA%9B%E6%99%BA%E8%83%BD%E6%8C%87%E9%92%88)
    7. [1.7. 装饰器模式](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E8%A3%85%E9%A5%B0%E5%99%A8%E6%A8%A1%E5%BC%8F)
    8. [1.8. C++多线程死锁](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E5%A4%9A%E7%BA%BF%E7%A8%8B%E6%AD%BB%E9%94%81)
    9. [1.9. TCP三次握手和四次挥手](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#TCP%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B%E5%92%8C%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B)
      1. [1.9.1. TCP与UDP](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#TCP%E4%B8%8EUDP)
      2. [1.9.2. TCP报文格式](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#TCP%E6%8A%A5%E6%96%87%E6%A0%BC%E5%BC%8F)
      3. [1.9.3. 三次握手](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B)
        1. [1.9.3.1. 三次握手过程中可以携带数据吗](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B%E8%BF%87%E7%A8%8B%E4%B8%AD%E5%8F%AF%E4%BB%A5%E6%90%BA%E5%B8%A6%E6%95%B0%E6%8D%AE%E5%90%97)
      4. [1.9.4. TCP四次挥手](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#TCP%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B)
        1. [1.9.4.1. 为什么要四次挥手](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B)
    10. [1.10. 进程和线程的概念、区别](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E8%BF%9B%E7%A8%8B%E5%92%8C%E7%BA%BF%E7%A8%8B%E7%9A%84%E6%A6%82%E5%BF%B5%E3%80%81%E5%8C%BA%E5%88%AB)
    11. [1.11. 进程线程间通信](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E8%BF%9B%E7%A8%8B%E7%BA%BF%E7%A8%8B%E9%97%B4%E9%80%9A%E4%BF%A1)
    12. [1.12. 关系型数据库和非关系型数据库](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%85%B3%E7%B3%BB%E5%9E%8B%E6%95%B0%E6%8D%AE%E5%BA%93%E5%92%8C%E9%9D%9E%E5%85%B3%E7%B3%BB%E5%9E%8B%E6%95%B0%E6%8D%AE%E5%BA%93)
      1. [1.12.1. 关系型数据库](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%85%B3%E7%B3%BB%E5%9E%8B%E6%95%B0%E6%8D%AE%E5%BA%93)
      2. [1.12.2. 非关系型数据库](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E9%9D%9E%E5%85%B3%E7%B3%BB%E5%9E%8B%E6%95%B0%E6%8D%AE%E5%BA%93)
    13. [1.13. 虚拟内存](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E8%99%9A%E6%8B%9F%E5%86%85%E5%AD%98)
    14. [1.14. 互斥锁、可重入锁、读写锁与自旋锁](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E4%BA%92%E6%96%A5%E9%94%81%E3%80%81%E5%8F%AF%E9%87%8D%E5%85%A5%E9%94%81%E3%80%81%E8%AF%BB%E5%86%99%E9%94%81%E4%B8%8E%E8%87%AA%E6%97%8B%E9%94%81)
      1. [1.14.1. mutex 互斥量](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#mutex-%E4%BA%92%E6%96%A5%E9%87%8F)
      2. [1.14.2. read-write lock 读写锁](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#read-write-lock-%E8%AF%BB%E5%86%99%E9%94%81)
      3. [1.14.3. spinlock 自旋锁](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#spinlock-%E8%87%AA%E6%97%8B%E9%94%81)
    15. [1.15. Java的垃圾回收机制（GC）](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Java%E7%9A%84%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E6%9C%BA%E5%88%B6%EF%BC%88GC%EF%BC%89)
      1. [1.15.1. 垃圾的定义](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%9E%83%E5%9C%BE%E7%9A%84%E5%AE%9A%E4%B9%89)
        1. [1.15.1.1. 引用计数法](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%BC%95%E7%94%A8%E8%AE%A1%E6%95%B0%E6%B3%95)
        2. [1.15.1.2. 根搜索算法](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%A0%B9%E6%90%9C%E7%B4%A2%E7%AE%97%E6%B3%95)
      2. [1.15.2. 回收算法](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%9B%9E%E6%94%B6%E7%AE%97%E6%B3%95)
        1. [1.15.2.1. 标记-清除算法](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%A0%87%E8%AE%B0-%E6%B8%85%E9%99%A4%E7%AE%97%E6%B3%95)
        2. [1.15.2.2. 标记-整理算法](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%A0%87%E8%AE%B0-%E6%95%B4%E7%90%86%E7%AE%97%E6%B3%95)
        3. [1.15.2.3. 复制算法](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%A4%8D%E5%88%B6%E7%AE%97%E6%B3%95)
        4. [1.15.2.4. 适应性算法](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E9%80%82%E5%BA%94%E6%80%A7%E7%AE%97%E6%B3%95)
        5. [1.15.2.5. 分代回收](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%88%86%E4%BB%A3%E5%9B%9E%E6%94%B6)
    16. [1.16. HTTPS的加密连接过程](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#HTTPS%E7%9A%84%E5%8A%A0%E5%AF%86%E8%BF%9E%E6%8E%A5%E8%BF%87%E7%A8%8B)
    17. [1.17. 协程](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8D%8F%E7%A8%8B)
      1. [1.17.1. 挂起/恢复](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%8C%82%E8%B5%B7-%E6%81%A2%E5%A4%8D)
      2. [1.17.2. 协程分类](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8D%8F%E7%A8%8B%E5%88%86%E7%B1%BB)
        1. [1.17.2.1. 有栈协程](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%9C%89%E6%A0%88%E5%8D%8F%E7%A8%8B)
        2. [1.17.2.2. 无栈协程](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%97%A0%E6%A0%88%E5%8D%8F%E7%A8%8B)
    18. [1.18. 右值、右值引用，std::move](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8F%B3%E5%80%BC%E3%80%81%E5%8F%B3%E5%80%BC%E5%BC%95%E7%94%A8%EF%BC%8Cstd-move)
      1. [1.18.1. 左值、右值](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%B7%A6%E5%80%BC%E3%80%81%E5%8F%B3%E5%80%BC)
      2. [1.18.2. 左值引用](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%B7%A6%E5%80%BC%E5%BC%95%E7%94%A8)
      3. [1.18.3. 右值引用](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8F%B3%E5%80%BC%E5%BC%95%E7%94%A8)
      4. [1.18.4. 右值引用与std::move的应用场景](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8F%B3%E5%80%BC%E5%BC%95%E7%94%A8%E4%B8%8Estd-move%E7%9A%84%E5%BA%94%E7%94%A8%E5%9C%BA%E6%99%AF)
    19. [1.19. RAII](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#RAII)
    20. [1.20. IO多路复用](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#IO%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8)
      1. [1.20.1. 什么是IO多路复用](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E4%BB%80%E4%B9%88%E6%98%AFIO%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8)
      2. [1.20.2. IO多路复用](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#IO%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8-1)
      3. [1.20.3. IO多路复用的三种实现](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#IO%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8%E7%9A%84%E4%B8%89%E7%A7%8D%E5%AE%9E%E7%8E%B0)
      4. [1.20.4. select](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#select)
      5. [1.20.5. poll](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#poll)
      6. [1.20.6. epoll](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#epoll)
      7. [1.20.7. select/poll/epoll之间的区别](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#select-poll-epoll%E4%B9%8B%E9%97%B4%E7%9A%84%E5%8C%BA%E5%88%AB)
    21. [1.21. 程序的编译、链接、装载与运行](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E7%A8%8B%E5%BA%8F%E7%9A%84%E7%BC%96%E8%AF%91%E3%80%81%E9%93%BE%E6%8E%A5%E3%80%81%E8%A3%85%E8%BD%BD%E4%B8%8E%E8%BF%90%E8%A1%8C)
      1. [1.21.1. 程序编译的过程](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E7%A8%8B%E5%BA%8F%E7%BC%96%E8%AF%91%E7%9A%84%E8%BF%87%E7%A8%8B)
      2. [1.21.2. 目标文件](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E7%9B%AE%E6%A0%87%E6%96%87%E4%BB%B6)
      3. [1.21.3. 链接](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E9%93%BE%E6%8E%A5)
      4. [1.21.4. 重定位表](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E9%87%8D%E5%AE%9A%E4%BD%8D%E8%A1%A8)
      5. [1.21.5. 符号表](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E7%AC%A6%E5%8F%B7%E8%A1%A8)
      6. [1.21.6. 装载](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E8%A3%85%E8%BD%BD)
    22. [1.22. std::shared_ptr实现细节](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#std-shared-ptr%E5%AE%9E%E7%8E%B0%E7%BB%86%E8%8A%82)
    23. [1.23. Qt deleteLater与delete对比](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Qt-deleteLater%E4%B8%8Edelete%E5%AF%B9%E6%AF%94)
    24. [1.24. Qt信号槽](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Qt%E4%BF%A1%E5%8F%B7%E6%A7%BD)
    25. [1.25. Qt MOC机制](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Qt-MOC%E6%9C%BA%E5%88%B6)
      1. [1.25.1. static const QMetaObject staticMetaObject](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#static-const-QMetaObject-staticMetaObject)
      2. [1.25.2. 类信息](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E7%B1%BB%E4%BF%A1%E6%81%AF)
    26. [1.26. Qt反射机制](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Qt%E5%8F%8D%E5%B0%84%E6%9C%BA%E5%88%B6)
    27. [1.27. TCP连接的断开](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#TCP%E8%BF%9E%E6%8E%A5%E7%9A%84%E6%96%AD%E5%BC%80)
    28. [1.28. C++函数调用过程](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%E8%BF%87%E7%A8%8B)
    29. [1.29. 在堆上分配内存快还是栈上分配内存更快？](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%9C%A8%E5%A0%86%E4%B8%8A%E5%88%86%E9%85%8D%E5%86%85%E5%AD%98%E5%BF%AB%E8%BF%98%E6%98%AF%E6%A0%88%E4%B8%8A%E5%88%86%E9%85%8D%E5%86%85%E5%AD%98%E6%9B%B4%E5%BF%AB%EF%BC%9F)
    30. [1.30. 内存碎片](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%86%85%E5%AD%98%E7%A2%8E%E7%89%87)
    31. [1.31. 静态链接与动态链接](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E9%9D%99%E6%80%81%E9%93%BE%E6%8E%A5%E4%B8%8E%E5%8A%A8%E6%80%81%E9%93%BE%E6%8E%A5)
      1. [1.31.1. 静态链接](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E9%9D%99%E6%80%81%E9%93%BE%E6%8E%A5)
      2. [1.31.2. 动态链接](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8A%A8%E6%80%81%E9%93%BE%E6%8E%A5)
    32. [1.32. STL的内存分配原理](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#STL%E7%9A%84%E5%86%85%E5%AD%98%E5%88%86%E9%85%8D%E5%8E%9F%E7%90%86)
    33. [1.33. Qt connect的第五个参数（信号槽连接方式）](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Qt-connect%E7%9A%84%E7%AC%AC%E4%BA%94%E4%B8%AA%E5%8F%82%E6%95%B0%EF%BC%88%E4%BF%A1%E5%8F%B7%E6%A7%BD%E8%BF%9E%E6%8E%A5%E6%96%B9%E5%BC%8F%EF%BC%89)
    34. [1.34. HTTP的方法](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#HTTP%E7%9A%84%E6%96%B9%E6%B3%95)
    35. [1.35. C++类对象的内存分布（内存对齐）](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E7%B1%BB%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%86%85%E5%AD%98%E5%88%86%E5%B8%83%EF%BC%88%E5%86%85%E5%AD%98%E5%AF%B9%E9%BD%90%EF%BC%89)
      1. [1.35.1. 空类](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E7%A9%BA%E7%B1%BB)
      2. [1.35.2. 只含基本数据，不含函数](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%8F%AA%E5%90%AB%E5%9F%BA%E6%9C%AC%E6%95%B0%E6%8D%AE%EF%BC%8C%E4%B8%8D%E5%90%AB%E5%87%BD%E6%95%B0)
      3. [1.35.3. 带成员函数的类](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%B8%A6%E6%88%90%E5%91%98%E5%87%BD%E6%95%B0%E7%9A%84%E7%B1%BB)
      4. [1.35.4. 带虚函数的类](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E5%B8%A6%E8%99%9A%E5%87%BD%E6%95%B0%E7%9A%84%E7%B1%BB)
    36. [1.36. C++数据类型](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)
    37. [1.37. 指针和引用的区别是什么？](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%8C%87%E9%92%88%E5%92%8C%E5%BC%95%E7%94%A8%E7%9A%84%E5%8C%BA%E5%88%AB%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F)
    38. [1.38. C++程序运行时进程的内存分布情况](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E7%A8%8B%E5%BA%8F%E8%BF%90%E8%A1%8C%E6%97%B6%E8%BF%9B%E7%A8%8B%E7%9A%84%E5%86%85%E5%AD%98%E5%88%86%E5%B8%83%E6%83%85%E5%86%B5)
    39. [1.39. C++变量的内存分配](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E5%8F%98%E9%87%8F%E7%9A%84%E5%86%85%E5%AD%98%E5%88%86%E9%85%8D)
    40. [1.40. C++的多态](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#C-%E7%9A%84%E5%A4%9A%E6%80%81)
    41. [1.41. 一次完整的HTTP请求](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E4%B8%80%E6%AC%A1%E5%AE%8C%E6%95%B4%E7%9A%84HTTP%E8%AF%B7%E6%B1%82)
      1. [1.41.1. 服务器关闭TCP连接](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%85%B3%E9%97%ADTCP%E8%BF%9E%E6%8E%A5)
    42. [1.42. QCoreApplication，QGuiApplication，QApplication之间的关系](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#QCoreApplication%EF%BC%8CQGuiApplication%EF%BC%8CQApplication%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%B3%E7%B3%BB)
    43. [1.43. Qt的D指针（d_ptr）与Q指针（q_ptr）](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Qt%E7%9A%84D%E6%8C%87%E9%92%88%EF%BC%88d-ptr%EF%BC%89%E4%B8%8EQ%E6%8C%87%E9%92%88%EF%BC%88q-ptr%EF%BC%89)
      1. [1.43.1. D指针](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#D%E6%8C%87%E9%92%88)
      2. [1.43.2. Q指针](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Q%E6%8C%87%E9%92%88)
      3. [1.43.3. 总结](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#%E6%80%BB%E7%BB%93)
    44. [1.44. Qt的智能指针](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#Qt%E7%9A%84%E6%99%BA%E8%83%BD%E6%8C%87%E9%92%88)
      1. [1.44.1. QSharedPointer](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#QSharedPointer)
      2. [1.44.2. QWeakPointer](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#QWeakPointer)
      3. [1.44.3. QScopedPointer](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#QScopedPointer)
      4. [1.44.4. QScopedArrayPointer](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#QScopedArrayPointer)
      5. [1.44.5. QPointer](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#QPointer)
      6. [1.44.6. QSharedPointer](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#QSharedPointer-1)
    45. [1.45. std::string的写时拷贝与内存共享](https://blog.skykey.fun/2022/06/20/C++%E9%9D%A2%E8%AF%95/#std-string%E7%9A%84%E5%86%99%E6%97%B6%E6%8B%B7%E8%B4%9D%E4%B8%8E%E5%86%85%E5%AD%98%E5%85%B1%E4%BA%AB)


![Skykey](https://blog.skykey.fun/images/avatar.jpg)
Skykey
总有些惊奇的际遇，比方说当我遇见你。
[ 20 日志 ](https://blog.skykey.fun/archives/)
[ 4 分类](https://blog.skykey.fun/categories/)
[ 19 标签](https://blog.skykey.fun/tags/)
[GitHub](https://github.com/skykeyjoker "GitHub → https://github.com/skykeyjoker") E-Mail [Twitter](https://twitter.com/skykeyjoker "Twitter → https://twitter.com/skykeyjoker") [Telegram](https://t.me/Skykeyjoker "Telegram → https://t.me/Skykeyjoker")
© 2022 Skykey | 174k | 2:39
由 [Hexo](https://hexo.io/) & [NexT.Gemini](https://theme-next.org/) 强力驱动 
|
