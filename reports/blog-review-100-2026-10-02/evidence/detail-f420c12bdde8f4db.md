![avatar](https://cdn-fusion.imgimg.cc/i/2024/4feac5205f2adbb2.jpeg)
[文章 4](https://xiaofuc.github.io/archives/)[标签 3](https://xiaofuc.github.io/tags/)[分类 2](https://xiaofuc.github.io/categories/)
* * *
[ 分类](https://xiaofuc.github.io/categories/)
[ 友链](https://xiaofuc.github.io/link/)
[ 关于](https://xiaofuc.github.io/about/)
[xiaofuc's Blog](https://xiaofuc.github.io/ "xiaofuc's Blog")
[ 分类](https://xiaofuc.github.io/categories/)
[ 友链](https://xiaofuc.github.io/link/)
[ 关于](https://xiaofuc.github.io/about/)
[](javascript:void\(0\);)
# shiro反序列化
发表于2025-03-08|更新于2025-03-08|[Java安全](https://xiaofuc.github.io/categories/Java%E5%AE%89%E5%85%A8/)
|阅读量:
#  [](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#%E6%9C%AA%E5%AE%8C%E5%BE%85%E7%BB%AD "未完待续")未完待续
#  [](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE "环境配置")环境配置
本人近几天一直头疼于怎么配置这个shiro550的源码环境，这里我给出详细的步骤，以免后人再踩进我踩过的大坑…
首先，下载p神的shiro源码：
<https://github.com/phith0n/JavaThings/>
[![image-20250308162441449](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308162441449.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308162441449.png)
下载好之后用IDEA打开这个shirodemo。
我的JDK版本：8u66，正常来说pom.xml里面是不会爆红的。
接着去配置Tomcat，这个步骤比较简单，网上教程也很多，这里不多赘述，推荐：
[IntelliJ IDEA中配置Tomcat（超详细）_intellij idea配置tomcat-CSDN博客](https://blog.csdn.net/Wxy971122/article/details/123508532)
我下载的是9.0.100版本。
在项目中配置
[![image-20250308163827383](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308163827383.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308163827383.png)
接着来到项目结构的工件这里：
[![image-20250308163905643](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308163905643.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308163905643.png)
可以看到已经有两个部署好的工件，选择下面这个，点应用。
编辑配置里头新建本地Tomcat：
[![image-20250308164008459](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308164008459.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308164008459.png)
[![image-20250308164028242](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308164028242.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308164028242.png)
点击应用后直接运行login.jsp，记得修改下它的端口号。
然后我们点击这里：
[![image-20250308164359419](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308164359419.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308164359419.png)
即可启动。
[![image-20250308164415898](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308164415898.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308164415898.png)
#  [](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#%E6%BC%8F%E6%B4%9E%E5%88%86%E6%9E%90 "漏洞分析")漏洞分析
##  [](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#%E6%95%B0%E6%8D%AE%E5%8C%85%E7%89%B9%E7%82%B9 "数据包特点")数据包特点
在登录框中我们先简单地抓个包（点击了Remember me）：
[![image-20250308164824611](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308164824611.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308164824611.png)
没点击的包：
[![image-20250308165108882](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308165108882.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308165108882.png)
相比之下得出结论：
勾选了remember me之后，在返回的数据包上多了Set-Cookie字段，第一个值为`deleteMe`，第二个像是一串Base64。
plaintext  
| 
```
1  

```
 | 
```
6nTT7Ep5Grk1dN3I5KgZ1iTjjdZnS2+zSoEcYP69yZ7n+r2mYNzMXMXY1WvN99zuOQlrEsv1uHH9UOuTO0fyQjg0v0rh4RVzw4V4SANKcQSkSsFX7V8CSelOgTmiBX+3goGAsbhFGonZIE0nSlqprPgLsybCTW5hdJf/FbE6hC2g1xnoNHbuJ6Lj+BBgRY4IYmSm7kz2AhvtioQi6k6AsDAayvnZKwQlSIzH8Y4s2lEt6vxndTjQcHIngWQTxGZxjmXnQuOrsu6IeLtlRLpNzYSRw0RtXe3T5SifdcBXs5JC15ljEoRJqkO8GBT/8u1RfUNAXW9+stYrDbxBoQRO5bOZWZq/AHUXkACTiGJsiL17WjGYkT/Ec022fmdiZPGnvrLWeaOQeDXCFfg4IqSCH4tnHzt1kpwncCdSwpEbkbWb9/5/v1ZM3Ejz1j/KQI4Winhwytrz2cZq83CcITV1D1YeUGW4c0kVLPFu8NWVwM8hvxtmIphLYQgKU3xbe8tK  

```
 |  
| --- | --- |  
试图解码一下发现并不是base64，下面我们来看看Shiro框架（550版本）的加解密过程。
##  [](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#%E8%BF%87%E7%A8%8B%E5%88%86%E6%9E%90 "过程分析")过程分析
我们先定位到CookieRememberMeManager类：
###  [](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#CookieRememberMeManager%E7%B1%BB "CookieRememberMeManager类")CookieRememberMeManager类
构造方法：
java  
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

```
 | 
```
/**  
 * CookieRememberMeManager 的默认构造方法。  
 * 该方法初始化了一个默认的 Cookie，用于存储 RememberMe 功能的数据。  
 */  
public CookieRememberMeManager() {  
    // 创建一个名为 "rememberMe" 的 Cookie 实例。  
    Cookie cookie = new SimpleCookie("rememberMe");  
  
    // 设置 Cookie 的 HttpOnly 属性为 true。  
    // 这表示该 Cookie 只能通过 HTTP(S) 协议访问，无法被 JavaScript 操作，从而提高安全性，  
    // 防止跨站脚本攻击（XSS）读取用户的 Cookie 数据。  
    cookie.setHttpOnly(true);  
  
    // 设置 Cookie 的最大存活时间（MaxAge），单位为秒。  
    cookie.setMaxAge(31536000);  
  
    // 将初始化的 Cookie 对象赋值给当前类的 cookie 属性，供后续使用。  
    this.cookie = cookie;  
}  
  

```
 |  
| --- | --- |  
`getRememberedSerializedIdentity()`：
[![image-20250308170912989](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308170912989.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308170912989.png)
长话短说：
  1. 先判断是否为 HTTP 请求
  2. 如果是的话，获取 cookie 中 rememberMe 的值
  3. 然后判断是否是 deleteMe，如果存在，则返回null。
  4. 如果不是，则判断是否是符合 base64 的编码长度，然后再对其进行 base64 解码，将解码结果返回。


###  [](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#AbstractRememberMeManager%E7%B1%BB "AbstractRememberMeManager类")AbstractRememberMeManager类
现在我们去寻找一下谁会调用`CookieRememberMeManager#getRememberedSerializedIdentity()`
####  [](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#getRememberedPrincipals "getRememberedPrincipals\(\)")getRememberedPrincipals()
[![image-20250308171615315](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308171615315.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308171615315.png)
  1. 首先是将 HTTP Requests 里面的 Cookie 拿出来，赋值给 bytes 数组；
  2. 随后将 bytes 数组的东西进行 `convertBytesToPrincipals()` 转换成principals（这是什么？）


我们跟进到神秘的convertBytesToPrincipals()：
####  [](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#convertBytesToPrincipals "convertBytesToPrincipals\(\)")convertBytesToPrincipals()
[![image-20250308171857004](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308171857004.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308171857004.png)
正常情况下这里调用了`decrypt()`与`deserialize()`
看看`decrypt()`
#####  [](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#decrypt "decrypt\(\)")decrypt()
java  
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

```
 | 
```
/**  
 * 解密方法，用于对加密后的字节数组进行解密操作。  
 *   
 * @param encrypted 加密后的字节数组  
 * @return 解密后的字节数组（即原始的序列化数据）  
 */  
protected byte[] decrypt(byte[] encrypted) {  
    // 默认将输入的加密数据赋值给 serialized，防止未使用加密服务时直接返回原始数据。  
    byte[] serialized = encrypted;  
      
    // 获取 CipherService（加密服务）的实例。  
    // 如果配置了加密服务，则使用该服务进行解密操作。  
    CipherService cipherService = this.getCipherService();  
      
    if (cipherService != null) {  
        // 调用加密服务的 decrypt 方法对数据进行解密。  
        // 解密时需要提供加密数据（encrypted）和解密密钥（getDecryptionCipherKey()）。  
        ByteSource byteSource = cipherService.decrypt(encrypted, this.getDecryptionCipherKey());  
          
        // 将解密后的数据转换为字节数组，赋值给 serialized。  
        serialized = byteSource.getBytes();  
    }  
  
    // 返回解密后的字节数组（如果未使用加密服务，则返回原始输入数据）。  
    return serialized;  
}  
  

```
 |  
| --- | --- |  
既然有decrypt函数，肯定也有encrypt函数。我们把断点下在encrypt函数：
在单步跟的过程中可以知道encrypt采用的是AES加密：
[![image-20250308173312190](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308173312190.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308173312190.png)
而且AES的key是一个固定值，写在了本类的源码中：
[![image-20250308174108474](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308174108474.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308174108474.png)
#####  [](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#deserialize "deserialize\(\)")deserialize()
[![image-20250308174154461](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308174154461.png)](https://xiaofuc.github.io/images/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/image-20250308174154461.png)
java  
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

```
 | 
```
/**  
 * 反序列化方法，将字节数组转换为 PrincipalCollection 对象。  
 *   
 * @param serializedIdentity 序列化后的字节数组  
 * @return 反序列化后的 PrincipalCollection 对象  
 */  
protected PrincipalCollection deserialize(byte[] serializedIdentity) {  
    // 获取序列化器实例，用于进行反序列化操作。  
    // this.getSerializer() 方法返回当前对象配置的序列化器实例，通常是一个 Serializer 对象。  
    return (PrincipalCollection)this.getSerializer().deserialize(serializedIdentity);  
}  
  

```
 |  
| --- | --- |  
文章作者: [B1ue_M00n](http://example.com)
文章链接: <http://example.com/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/>
版权声明: 本博客所有文章除特别声明外，均采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。转载请注明来自 [xiaofuc's Blog](http://example.com)！
[Java安全](https://xiaofuc.github.io/tags/Java%E5%AE%89%E5%85%A8/)[反序列化](https://xiaofuc.github.io/tags/%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/)
[](https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fxiaofuc.github.io%2F2025%2F03%2F08%2Fshiro%25E5%258F%258D%25E5%25BA%258F%25E5%2588%2597%25E5%258C%2596%2F)[](https://twitter.com/intent/tweet?text=shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96%20%7C%20xiaofuc's%20Blog&url=https%3A%2F%2Fxiaofuc.github.io%2F2025%2F03%2F08%2Fshiro%25E5%258F%258D%25E5%25BA%258F%25E5%2588%2597%25E5%258C%2596%2F&via=https%3A%2F%2Fxiaofuc.github.io)#### [微信扫一扫：分享 ![Scan me!](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/) 微信里点“发现”，扫一下 二维码便可将本文分享至朋友圈。 ](javascript:)[](https://service.weibo.com/share/share.php?url=https%3A%2F%2Fxiaofuc.github.io%2F2025%2F03%2F08%2Fshiro%25E5%258F%258D%25E5%25BA%258F%25E5%2588%2597%25E5%258C%2596%2F&title=shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96%20%7C%20xiaofuc's%20Blog&pic=https%3A%2F%2Fcdn-fusion.imgimg.cc%2Fi%2F2024%2F4feac5205f2adbb2.jpeg&appkey=)[](http://connect.qq.com/widget/shareqq/index.html?url=https%3A%2F%2Fxiaofuc.github.io%2F2025%2F03%2F08%2Fshiro%25E5%258F%258D%25E5%25BA%258F%25E5%2588%2597%25E5%258C%2596%2F&title=shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96%20%7C%20xiaofuc's%20Blog&source=shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96%20%7C%20xiaofuc's%20Blog&desc=%E6%9C%AA%E5%AE%8C%E5%BE%85%E7%BB%AD%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE%E6%9C%AC%E4%BA%BA%E8%BF%91%E5%87%A0%E5%A4%A9%E4%B8%80%E7%9B%B4%E5%A4%B4%E7%96%BC%E4%BA%8E%E6%80%8E%E4%B9%88%E9%85%8D%E7%BD%AE%E8%BF%99%E4%B8%AAshiro550%E7%9A%84%E6%BA%90%E7%A0%81%E7%8E%AF%E5%A2%83%EF%BC%8C%E8%BF%99%E9%87%8C%E6%88%91%E7%BB%99%E5%87%BA%E8%AF%A6%E7%BB%86%E7%9A%84%E6%AD%A5%E9%AA%A4%EF%BC%8C%E4%BB%A5%E5%85%8D%E5%90%8E%E4%BA%BA%E5%86%8D%E8%B8%A9%E8%BF%9B%E6%88%91%E8%B8%A9%E8%BF%87%E7%9A%84%E5%A4%A7%E5%9D%91%E2%80%A6%20%E9%A6%96%E5%85%88%EF%BC%8C%E4%B8%8B%E8%BD%BDp%E7%A5%9E%E7%9A%84shiro%E6%BA%90%E7%A0%81%EF%BC%9A%20https%3A%2F%2Fgithub.com%2Fphith0n%2FJavaThings%2F%20%20%E4%B8%8B%E8%BD%BD%E5%A5%BD%E4%B9%8B%E5%90%8E%E7%94%A8IDEA%E6%89%93%E5%BC%80%E8%BF%99%E4%B8%AAshirodemo%E3%80%82%20%E6%88%91%E7%9A%84JDK%E7%89%88%E6%9C%AC%EF%BC%9A8u66%EF%BC%8C%E6%AD%A3%E5%B8%B8%E6%9D%A5%E8%AF%B4pom.xml%E9%87%8C%E9%9D%A2%E6%98%AF%E4%B8%8D%E4%BC%9A%E7%88%86%E7%BA%A2%E7%9A%84%E3%80%82%20%E6%8E%A5%E7%9D%80%E5%8E%BB%E9%85%8D%E7%BD%AETomcat%EF%BC%8C%E8%BF%99%E4%B8%AA%E6%AD%A5%E9%AA%A4%E6%AF%94%E8%BE%83%E7%AE%80%E5%8D%95&pics=https%3A%2F%2Fcdn-fusion.imgimg.cc%2Fi%2F2024%2F4feac5205f2adbb2.jpeg&summary="%E6%9C%AA%E5%AE%8C%E5%BE%85%E7%BB%AD%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE%E6%9C%AC%E4%BA%BA%E8%BF%91%E5%87%A0%E5%A4%A9%E4%B8%80%E7%9B%B4%E5%A4%B4%E7%96%BC%E4%BA%8E%E6%80%8E%E4%B9%88%E9%85%8D%E7%BD%AE%E8%BF%99%E4%B8%AAshiro550%E7%9A%84%E6%BA%90%E7%A0%81%E7%8E%AF%E5%A2%83%EF%BC%8C%E8%BF%99%E9%87%8C%E6%88%91%E7%BB%99%E5%87%BA%E8%AF%A6%E7%BB%86%E7%9A%84%E6%AD%A5%E9%AA%A4%EF%BC%8C%E4%BB%A5%E5%85%8D%E5%90%8E%E4%BA%BA%E5%86%8D%E8%B8%A9%E8%BF%9B%E6%88%91%E8%B8%A9%E8%BF%87%E7%9A%84%E5%A4%A7%E5%9D%91%E2%80%A6%20%E9%A6%96%E5%85%88%EF%BC%8C%E4%B8%8B%E8%BD%BDp%E7%A5%9E%E7%9A%84shiro%E6%BA%90%E7%A0%81%EF%BC%9A%20https%3A%2F%2Fgithub.com%2Fphith0n%2FJavaThings%2F%20%20%E4%B8%8B%E8%BD%BD%E5%A5%BD%E4%B9%8B%E5%90%8E%E7%94%A8IDEA%E6%89%93%E5%BC%80%E8%BF%99%E4%B8%AAshirodemo%E3%80%82%20%E6%88%91%E7%9A%84JDK%E7%89%88%E6%9C%AC%EF%BC%9A8u66%EF%BC%8C%E6%AD%A3%E5%B8%B8%E6%9D%A5%E8%AF%B4pom.xml%E9%87%8C%E9%9D%A2%E6%98%AF%E4%B8%8D%E4%BC%9A%E7%88%86%E7%BA%A2%E7%9A%84%E3%80%82%20%E6%8E%A5%E7%9D%80%E5%8E%BB%E9%85%8D%E7%BD%AETomcat%EF%BC%8C%E8%BF%99%E4%B8%AA%E6%AD%A5%E9%AA%A4%E6%AF%94%E8%BE%83%E7%AE%80%E5%8D%95")
[ 下一篇 Java安全基础及CC链 ](https://xiaofuc.github.io/2025/03/07/Java%E5%AE%89%E5%85%A8%E5%9F%BA%E7%A1%80%E5%8F%8ACC%E9%93%BE/ "Java安全基础及CC链")
相关推荐
[ 2025-03-06 FastJSON原生反序列化 ](https://xiaofuc.github.io/2025/03/06/FastJSON%E5%8E%9F%E7%94%9F%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/ "FastJSON原生反序列化")
[ 2025-03-07 Java安全基础及CC链 ](https://xiaofuc.github.io/2025/03/07/Java%E5%AE%89%E5%85%A8%E5%9F%BA%E7%A1%80%E5%8F%8ACC%E9%93%BE/ "Java安全基础及CC链")
![avatar](https://cdn-fusion.imgimg.cc/i/2024/4feac5205f2adbb2.jpeg)
B1ue_M00n
我爱故我在
[文章 4](https://xiaofuc.github.io/archives/)[标签 3](https://xiaofuc.github.io/tags/)[分类 2](https://xiaofuc.github.io/categories/)
[Follow Me](https://github.com/xiaofuc)
公告
This is my Blog
目录
  1. [1. 未完待续](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#%E6%9C%AA%E5%AE%8C%E5%BE%85%E7%BB%AD)
  2. [2. 环境配置](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE)
  3. [3. 漏洞分析](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#%E6%BC%8F%E6%B4%9E%E5%88%86%E6%9E%90)
    1. [3.1. 数据包特点](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#%E6%95%B0%E6%8D%AE%E5%8C%85%E7%89%B9%E7%82%B9)
    2. [3.2. 过程分析](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#%E8%BF%87%E7%A8%8B%E5%88%86%E6%9E%90)
      1. [3.2.1. CookieRememberMeManager类](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#CookieRememberMeManager%E7%B1%BB)
      2. [3.2.2. AbstractRememberMeManager类](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#AbstractRememberMeManager%E7%B1%BB)
        1. [3.2.2.1. getRememberedPrincipals()](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#getRememberedPrincipals)
        2. [3.2.2.2. convertBytesToPrincipals()](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#convertBytesToPrincipals)
          1. [3.2.2.2.1. decrypt()](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#decrypt)
          2. [3.2.2.2.2. deserialize()](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/#deserialize)


最新文章
[shiro反序列化](https://xiaofuc.github.io/2025/03/08/shiro%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/ "shiro反序列化")2025-03-08
[Java安全基础及CC链](https://xiaofuc.github.io/2025/03/07/Java%E5%AE%89%E5%85%A8%E5%9F%BA%E7%A1%80%E5%8F%8ACC%E9%93%BE/ "Java安全基础及CC链")2025-03-07
[Vulnhub-Lazysysadmin复现](https://xiaofuc.github.io/2025/03/06/Vulnhub-Lazysysadmin%E5%A4%8D%E7%8E%B0/ "Vulnhub-Lazysysadmin复现")2025-03-06
[FastJSON原生反序列化](https://xiaofuc.github.io/2025/03/06/FastJSON%E5%8E%9F%E7%94%9F%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/ "FastJSON原生反序列化")2025-03-06
©2020 - 2025 By B1ue_M00n
框架 [Hexo](https://hexo.io)|主题 [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly)
