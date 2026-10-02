__
Axton  
Always dreaming. Always exploring.
[__ 菜单](https://flyhigher.top/develop/2160.html)[ __ 目录](https://flyhigher.top/develop/2160.html)
  * [__ 首页](https://flyhigher.top/)
  * [__ 开发](https://flyhigher.top/develop)
  * [__ 摄影](https://flyhigher.top/photograph)
  * [__ 其他](https://flyhigher.top/diary)
  * [__ 朋友](https://flyhigher.top/links)
  * [__ 关于](https://flyhigher.top/about)


1浅谈 WebAuthn1.1为什么使用 WebAuthn1.2什么是 WebAuthn1.3常用术语和概念1.4安全性的基础1.5使用流程1.6浏览器接口1.7简单实现1.8拓展阅读2深入了解 WebAuthn2.1进阶选项2.2手动解个码2.3验证认证器2.4无用户名登录2.5从 U2F 认证迁移2.6拓展阅读3参考资料
__
__
_menu_ [无垠](https://flyhigher.top) __ __
# 谈谈 WebAuthn
__ 2020-03-23
WebAuthn，即 Web Authentication，是一个用于在浏览器上进行认证的 API，W3C 将其表述为 "An API for accessing Public Key Credentials"，即“一个用于访问公钥凭证的 API”。WebAuthn 很强大，强大到被认为是 Web 身份认证的未来（当然，也很复杂）。你有想过通过指纹或者面部识别来登录网站吗？WebAuthn 就能在保证安全和隐私的情况下让这样的想法成为现实。
![通过 WebAuthn 调起 Windows Hello 登录网站](https://flyhigher.top/develop/2160.html)
你可以在[这个网站](https://webauthn.io)自行体验 WebAuthn。或者，如果你有一个使用 WordPress 的站点，可以尝试一下 [WP-WebAuthn](https://wordpress.org/plugins/wp-webauthn/) 这款插件，它可以为你的站点启用 WebAuthn 登录。这是我为了写这篇文章而练手开发的插件，本文中的部分示例代码也来自这款插件。
[](https://github.com/yrccondor/wp-webauthn)
WebAuthn Level 1 标准已在 2019 年 3 月成为 W3C 推荐标准，而 Level 2 标准目前也已进入编辑草案阶段，但互联网上有关它的中文资料却仍然很少，国内也鲜有网站支持这一新标准。于是，在抱着各种英文资料和标准啃了几天以后，我折腾出了这篇文章。
在这篇文章里，我将会从最基本的概念开始，逐渐深入 WebAuthn，直到解码公钥等深层细节。这可能是你能找到的有关 WebAuthn 最详细最基础的中文文章，也很可能是最长的。在开始之前，**我强烈建议你打开菜单中的文章目录浏览一遍，以对这篇文章涉及的内容有所了解。** 如果你只是想了解如何简单地在你的项目中添加对 WebAuthn 的支持，那么“[浅谈 WebAuthn](https://flyhigher.top/develop/2160.html#webauthn-overview)”部分就是你要找的；如果你想了解更多关于 WebAuthn 的底层细节，那么你可以继续阅读“[深入了解 WebAuthn](https://flyhigher.top/develop/2160.html#deep-into-webauthn)”部分。
由于在本文写作时 WebAuthn Level 2 规范尚未定稿，**这篇文章我们将只专注于 Level 1 规范。**
这篇文章最后更新于 2020.9 ，在你读到这篇文章时，部分事实可能已经发生改变，请注意判断。
**更新日志：**
  * 2021.1.16 添加 Chrome 开发工具信息
  * 2020.9.17 更新 iOS/iPad OS 兼容性信息
  * 2020.5.20 添加部分无用户名认证的平台兼容性内容
  * 2020.5.15 添加部分 `extensions` 相关内容与链接；添加全局凭证 ID 唯一内容；添加凭证 ID 查找相关内容；添加“从 U2F 认证迁移”一节
  * 2020.4.13 更新与修正 `userVerification` 相关内容；添加部分 Firefox 相关内容
  * 2020.3.23 文章发布


那么让我们开始吧。
# 浅谈 WebAuthn
在这个部分里，我们将会从基础概念开始，了解有关 WebAuthn 和密码学的一些基础知识，并最终使用第三方库实现基础的 WebAuthn 认证。如果你已经对这些内容有所了解了，可以跳到“[深入了解 WebAuthn](https://flyhigher.top/develop/2160.html#deep-into-webauthn)”继续阅读。
## 为什么使用 WebAuthn
![钓鱼邮件](https://flyhigher.top/develop/2160.html)
相信你一定收到过类似的邮件吧？只要你点进那个最显眼的链接，你就会进入一个设置好的圈套——钓鱼网站。如果你一时糊涂在这类网站上填写了你的账号和密码，bingo，你的账号就不再是你的账号了。
不过，就算你警惕心再强，也无法避免密码泄露事件。Twitter, Facebook 等都爆出过明文密码泄露事件，证明再大的公司或组织也无法避免密码泄露问题。雪上加霜的是，很大一部分用户都非常喜欢使用重复密码，这就导致一次密码泄露会牵连很多网站，用户的账户安全性完全无法得到保证。
那么，有什么办法解决这些问题吗？**彻底解决的方法只有一个，那就是抛弃密码。** 可是没有密码还怎么验证用户身份呢？这就是 WebAuthn 的用武之地了。
~~没有密码的好时代，来临力！~~
## 什么是 WebAuthn
那么到底什么是 WebAuthn 呢？如开头所说，WebAuthn 是“一个用于访问公钥凭证的 API”，网站可以通过这个 API 进行一些高安全性的身份验证。WebAuthn 一个最常见的应用就是用于网站登录时的 2FA（双重因素验证）甚至是无密码登录。通过网页调用 WebAuthn，在不同平台下，**我们可以实现通过 USB Key、指纹、面部甚至虹膜扫描来认证身份，同时确保安全和隐私。**
![WebAuthn 可使用的各种身份认证方式](https://flyhigher.top/develop/2160.html)
WebAuthn 标准是 FIDO2 标准的一部分，而 FIDO2 则是由 FIDO 联盟和 W3C 共同推出的 U2F（现称作 FIDO1）的后继标准，旨在增强网络认证的安全性。
> 你可能了解过 U2F，那么 U2F 和 FIDO2 的区别在哪里呢？从名字上可以看出，U2F，即“通用第二因素协议”，是专注于作为密码后的第二道屏障的，而 FIDO2 增加了单因素认证功能，这意味着使用 FIDO2 可以完全替代密码，真正实现无密码登录。
FIDO2 标准主要包括四个部分，其一是用于网站和访客设备交互的 WebAuthn，而 Client to Authenticator Protocol 2（CTAP2，客户端-认证器协议）作为 WebAuthn 的补充，则是用于访客的设备和认证器交互的协议。标准的其他两个部分则是 U2F 和 UAF 规范。在这篇文章中，我们只关心 WebAuthn，不会涉及 CTAP, U2F 和 UAF 的相关知识。如果你对这段话中的一些概念不了解，不要紧张，接下来我们就来谈谈 WebAuthn 中一些常用的术语和概念。
> WebAuthn 只能在安全上下文中使用，也就是说，页面需要使用 HTTPS 协议或是处于 `localhost` 中。
## 常用术语和概念
WebAuthn 中有许多不常碰到的术语，不过我只会在这里介绍一些常用的术语和概念——如果你只是希望做出一个简单的实现，那么了解这一段中的一些概念就足够了。同时，由于我实在没能找到一部分术语的通用翻译，有一些术语我按着自己的理解尽可能地翻译了，有任何问题请告诉我。
在一个完整的 WebAuthn 认证流程中，通常有这么几个角色：
  * Relying Party 依赖方 (RP) ：指服务提供方，即网站
  * User 用户：正准备登录的你
  * Authenticator 认证器：通常指 USB Key 或是设备内置的指纹扫描器、虹膜扫描器、面部识别装置等，正是它们在使用流程中代替了密码甚至是用户名
  * User Agent 用户代理：通常指浏览器或系统，负责与认证器交互


认证过程通常分为两种：
  * Registration Ceremony 注册仪式：用户向账户上添加认证器
  * Authentication Ceremony 验证仪式：用户通过已注册的认证器验证身份


同时，认证过程中还会产生这些内容：
  * Challenge 挑战：通常是一串随机字符串
  * Public Key Credential 公钥凭证：由认证器产生的凭证，在技术上代替了密码
  * Attestation 证明：注册时认证器产生的验证数据
  * Assertion 断言：验证时认证器产生的验证数据


> **请注意区分证明 (Attestation) 和断言 (Assertion)** ，特别是在这两个单词有些相似的情况下。在 WebAuthn 中，它们是不同过程中的类似概念，但并不相同。
如果你对于这些内容不是很理解，没有关系，我们会在“[使用流程](https://flyhigher.top/develop/2160.html#how-to-webauthn)”一节中将这些概念放到实际情况中解释，你只要先区分这些概念即可。
## 安全性的基础
WebAuthn 为什么安全？和 HTTPS 一样，WebAuthn 使用非对称加密的思路来保证安全性，但侧重点又有所不同。要理解 WebAuthn 的认证流程，我们必须对非对称加密有所了解。如果你对非对称加密比较熟悉了，就直接跳到下一段吧。
WebAuthn 的核心在于“认证”，即保证产生了凭证的认证器是用户的认证器，而不是第三方在伪造凭证。但为什么要使用非对称加密呢？我们可以先来看看对称加密。
让我们假设小明和小红相互写信，见不到对方。这天小红突然想，给自己写信的人是不是真的小明呢？于是小红要求对方向小红证明自己是小明。怎么证明呢？他们商量出来这么一套方案：
  1. 在小明的身份已经验证的情况下，小明和小红商量一个统一的密码和密钥
  2. 一段时间后，在小红要求小明验证身份时，小红发送一段文本给小明
  3. 小明用提前和小红商量好的密码和密钥加密文本后发回给小红
  4. 小红使用相同的密码和密钥解密文本，如果得到文本和之前发送的一致，就表明对方拥有正确的密码和密钥


> 在密码学中，我们通常把“加密算法”称为密码 (code)，和通常登录时用的密码 (password) 并非同一个概念。
在这种情况下，**只要密钥不泄露** ，即拥有正确密钥的只有小明和小红，那么小红就能确定对方一定是小明。但这样的问题也很明显，如果小明和小红不能见面，那么他们就必须先以明文交换密码——**在这个过程中一旦有人窃取到了密码，这个认证就无效了。**
这时我们就需要使用**非对称加密** 来拯救破碎的信任了。非对称加密的基础是一对密钥，也就是公钥和私钥，它们是互相关联但（几乎）无法互相推导的。在非对称加密的过程中，选择相同的密码后，使用私钥加密明文得到的密文只能由对应的公钥解密，无法使用私钥解密，同时这个过程反过来也是成立的。
> 本文的核心并不是非对称加密算法，因此不会详述非对称加密在数学上的证明，若有兴趣可以自行了解。
这就完美解决密钥泄露的问题了。让我们回过头来看之前的例子。现在小明和小红决定使用非对称加密来证明身份，过程如下：
  1. 在小明的身份已经验证的情况下，小明提前生成一对公私钥，将公钥发送给小红，私钥自己保管，同时商量好统一的密码
  2. 一段时间后，在小红要求小明验证身份时，小红发送一段文本给小明
  3. 小明使用商量好的密码和自己的私钥加密文本，发送给小红
  4. 小红使用相同的密码和小明的公钥解密文本，如果得到文本和之前发送的一致，就表明对方拥有正确的密码和私钥


在这种情况下，**只要私钥不泄露** ，那么小红解密得到的文本和之前发送的一致，那么就可以证明收到的密文一定是由小明加密后发送过来的。而在整个过程中，私钥都没有离开过小明，更没有经过传输，也就几乎没有泄露的可能了。这时，小红终于可以确定对面和她通信的人的确是小明了。
题外话：HTTPS 虽然也应用了非对称加密，但 HTTPS 更侧重于“加密”而非“认证”，因此思路上会有些许差异。要了解关于 HTTPS 和非对称加密的更多信息，你可以阅读我之前写的这篇文章：
[](https://flyhigher.top/develop/1093.html)
## 使用流程
了解了非对称加密，我们就可以来看看 WebAuthn 的认证流程了。
和普通的密码一样，**使用 WebAuthn 分为两个部分，注册和验证。** 注册仪式会在依赖方中将认证器的一些信息和用户建立关联；而验证仪式则是验证这些信息以登确保是用户本人在登录。根据上一节的思路，我们可以知道，注册仪式就是认证器生成一对公私钥，然后将公钥交给依赖方；而验证仪式是依赖方发送给认证器一段文本，要求认证器用自己的私钥加密后发回以验证。
在实际情况中，WebAuthn 是基于**挑战-应答模型** 工作的。要更好地理解，我们直接来看具体流程。先来看看注册的流程。
![WebAuthn 注册流程](https://flyhigher.top/develop/2160.html)
  1. 浏览器向依赖方发送某个用户的注册请求
  2. 依赖方向浏览器发送挑战、依赖方信息和用户信息
  3. 浏览器向认证器发送挑战、依赖方信息、用户信息和客户端信息以请求创建公钥凭证
  4. 认证器请求用户动作，随后创建一对公私钥，并使用私钥签名挑战（即证明），和公钥一起交给浏览器
  5. 浏览器将签名后的挑战和公钥发送给依赖方
  6. 依赖方用公钥验证挑战是否与发送的一致，如果成功则将公钥与用户绑定，注册完成


我也做了一个交互式的 Demo，你可以对照流程来更好地理解。
开始注册
注册请求用户名挑战依赖方信息用户信息生成私钥公钥私钥验证挑战存储公钥浏览器认证器服务器挑战公钥
> 注意，这个 Demo 和下方的 Demo 都只是一个本地模拟的简单示例，没有任何数据会被上传，当然也不会对数据进行验证。
而之后的验证流程如下：
![WebAuthn 验证流程](https://flyhigher.top/develop/2160.html)
  1. 浏览器向依赖方发送某个用户的验证请求
  2. 依赖方向浏览器发送挑战
  3. 浏览器向认证器发送挑战、依赖方信息和客户端信息以请求获取公钥凭证
  4. 认证器请求用户动作，随后通过依赖方信息找到对应私钥，并使用私钥签名挑战（即断言），交给浏览器
  5. 浏览器将签名后的挑战发送给依赖方
  6. 依赖方用之前存储的公钥验证挑战是否与发送的一致，一致则验证成功


开始验证 在上方注册后才能验证
认证请求用户名挑战已注册的凭证ID挑战私钥公钥验证挑战浏览器认证器服务器私钥签名的挑战
可以看到，WebAuthn 不仅在理论上是安全的，同时**在整个过程中并没有隐私数据被传输** ——用户信息实际上只包含用户名和用户 ID。因此我们完全可以说 WebAuthn 是安全且私密的。
> 为了避免用户在不同依赖方之间被追踪，认证器通常会为每个依赖方和用户的组合都创建一对公私钥。不过，由于认证器的存储空间有限，认证器通常不会存储每一个私钥，而是会通过各类信息和烧录在认证器内的主密钥“算”出对应的私钥以实现无限对公私钥。具体算法根据不同厂商会有所不同。对于 Yubikey，你可以在[这里](https://developers.yubico.com/U2F/Protocol_details/Key_generation.html)了解更多。
> 如果依赖方需要，用户同意后，发送给依赖方的公钥凭证中可以包含用于辨认认证器型号的信息，不过这对隐私的影响微乎其微。
## 浏览器接口
要使用 WebAuthn，我们必须要依靠浏览器作为媒介和验证器进行交互，而这就需要浏览器对于 WebAuthn 的支持了。绝大多数新版本的现代浏览器都为 WebAuthn 提供了统一的接口，而在这一段中我们会了解如何使用相关的接口。但是在开始之前，我们可以先来看看浏览器的支持程度（2020.9）。  
| 浏览器  | 支持情况  | -----  | 桌面端 Chrome  | 67+  | -----  | 移动端 Chrome  | 67+[1]  | -----  | 桌面端 Firefox  | 60+  | -----  | 移动端 Firefox  | 不支持[2]  | -----  | 桌面端 Edge  | 18+  | -----  | 移动端 Edge  | 不支持[3]  | -----  | 桌面端 Safari  | 13+  | -----  | 移动端 Safari  | 13.3+[4]  | -----  | 桌面端 Opera  | 54+  | -----  | 移动端 Opera  | 不支持  |  
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |  
[1] 受平台限制，Chrome 在 iOS 平台上不支持 WebAuthn，在 Android 平台上支持大部分 WebAuthn 功能，但仍不支持部分特性（如 `userVerification`）。  
[2] 移动端 Firefox 80 以下的版本支持 WebAuthn 但似乎会忽略 `authenticatorAttachment` 等一部分参数，同时移动端 Firefox Beta 80 以下的版本支持 WebAuthn 但无法成功调用。自 80 版本起移动端 Firefox 暂时取消了对 WebAuthn 的支持（可能是 Bug）。  
[3] 移动端 Edge 似乎支持 WebAuthn 但无法成功调用。  
[4] Safari iOS/iPad OS 13 仅支持外部认证器，无法调用 Touch ID 或 Face ID；自 iOS/iPad OS 14 起 Safari 已支持全功能 WebAuthn，可以调用 Touch ID/Face ID
当然，一众国产浏览器，包括 Samsung Browser 和 Yandex Browser，目前都不支持 WebAuthn。此外，由于 WebAuthn 涉及外部验证器和 TPM 可信平台模块等，用户的操作系统也会对 WebAuthn 的可用性造成影响。以下是一些需要注意的信息：
  * Windows 10 1903 以下版本仅 Edge 能提供完整支持，其他浏览器只能使用 USB Key 等外部认证器；1903+ 中所有浏览器都可以通过 Windows Hello 带来完整的 WebAuthn 支持
  * Android 需要安装并开启 Google 服务
  * iOS/iPad OS 13.3 以下的版本不支持 WebAuthn，iOS/iPad OS 14 以下的版本支持有限（参考上文），iOS/iPad OS 14 开始 Safari 已支持全功能 WebAuthn（功能完整度甚至超过了 Android）


可以看出，WebAuthn 的发展之路仍然很漫长，但好在桌面端对它的支持已经比较完善了，在一些情况下我们完全有理由使用它。
* * *
来看看浏览器提供了怎么样的接口吧。要使用 WebAuthn，我们可以使用 `navigator.credentials.create()` 请求认证器生成公钥凭证和 `navigator.credentials.get()` 请求获取公钥凭证。
> 你或许已经对 Credential Management API 有所了解了。通过这些 API，我们还可以实现一些有趣的特性，不过这值得另开一篇文章来讲了。
对于一个基础的实现，`navigator.credentials.create()` 需要传入的参数如下：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
navigator.credentials.create({
publicKey: {
challenge,
rp: {
id,
name
},
user: {
id,
name,
displayName
},
pubKeyCredParams: [
{
type: "public-key",
alg
}
],
authenticatorSelection: {
authenticatorAttachment,
userVerification
},
excludeCredentials: [
{
id,
transports: [],
type: "public-key"
}
],
timeout
}
})
navigator.credentials.create({ publicKey: { challenge, rp: { id, name }, user: { id, name, displayName }, pubKeyCredParams: [ { type: "public-key", alg } ], authenticatorSelection: { authenticatorAttachment, userVerification }, excludeCredentials: [ { id, transports: [], type: "public-key" } ], timeout } })

```
navigator.credentials.create({
    publicKey: {
        challenge,
        rp: {
            id,
            name
        },
        user: {
            id,
            name,
            displayName
        },
        pubKeyCredParams: [
            {
                type: "public-key",
                alg
            }
        ],
        authenticatorSelection: {
            authenticatorAttachment,
            userVerification
        },
        excludeCredentials: [
            {
                id,
                transports: [],
                type: "public-key"
            }
        ],
        timeout
    }
})
```

在 `navigator.credentials.create()` 方法中，我们必须传入一个对象，其中只有一对名为 `publicKey` 的键值。这指明了我们需要创建公钥凭证，而非普通的密码凭证。然后，在 `publicKey` 对象中设置这些常用参数：
  * `challenge: Uint8Array`：转换为 `Uint8Array` 的挑战，长度至少为 16，建议为 32
  * `rp: Object`：依赖方信息，其中有一项为必须：
    * `rp.id: String`：（可选）依赖方 ID，必须为当前域名或为当前域名的子集的域名（不是子域名）。如域名为 `test.123.example.com`，则依赖方 ID 可以是 `test.123.example.com`, `123.example.com` 或 `example.com`。不指定则默认使用当前域名
    * `rp.name: String`：依赖方名称，用于方便用户辨认
  * `user: Object`：用户信息，其中有三项为必须：
    * `user.id: Uint8Array`：转换为 `Uint8Array` 的字符串。**出于安全考量，这应尽可能不与任何用户信息相关联，如不要包含用户名、用户邮箱等**
    * `user.name: String`：登录用户名
    * `user.dispalyName: String`：用于显示的用户名称，显示与否的具体行为取决于浏览器
  * `pubKeyCredParams: Array`：一个算法列表，指明依赖方接受哪些签名算法。列表的每一项都是一个对象，拥有两个属性：
    * `pubKeyCredParams[].type: String`：值只能为 "public-key"
    * `pubKeyCredParams[].alg: Number`：一个负整数，用于标明算法。具体算法对应的数字可以在 [COSE](https://www.iana.org/assignments/cose/cose.xhtml#algorithms) 找到
  * `authenticatorSelection: Object`：（可选）用于过滤正确的认证器，这里介绍常用的一个参数：
    * `authenticatorSelection.authenticatorAttachment: String`：（可选）指定要求的认证器类型。如果没有满足要求的认证器，认证可能会失败。该参数可以为 `null`（表示接受所有类型的认证器）或是以下两个值之一：
      * `platform`：表示仅接受平台内置的、无法移除的认证器，如手机的指纹识别设备
      * `cross-platform`：表示仅接受外部认证器，如 USB Key
    * `authenticatorSelection.userVerification: String`：（可选）指定认证器是否需要验证“用户为本人 (User Verified, UV)”，否则只须“用户在场 (User Present, UP)”。具体验证过程取决于认证器（不同认证器的认证方法不同，也有认证器不支持用户验证），而对验证结果的处理情况则取决于依赖方。该参数可以为以下三个值之一：
      * `required`：依赖方要求用户验证
      * `preferred`：（默认）依赖方希望有用户验证，但也接受用户在场的结果
      * `discouraged`：依赖方不关心用户验证。对于 iOS/iPad OS 13，必须设置为此值，否则验证将失败
  * `excludeCredentials: Array`：（可选）用于标识要排除的凭证，可以避免同一个用户多次注册同一个认证器。如果用户试图注册相同的认证器，用户代理会抛出 `InvalidStateError` 错误。数组中的每一项都是一个公钥凭证对象，包含以下属性：
    * `excludeCredentials[].type: String`：值只能为 "public-key"
    * `excludeCredentials[].id: Uint8Array`：要排除的凭证 ID
    * `excludeCredentials[].transports: Array`：（可选）用于指定该凭证所需的认证器与用户代理的通信方式，可以包含以下的一或多个字符串：
      * `usb`：可以通过 USB 连接的认证器
      * `nfc`：可以通过 NFC 连接的认证器
      * `ble`：可以通过蓝牙连接的认证器
      * `internal`：平台内置的、无法移除的认证器
  * `timeout: Number`：（可选）方法超时时间的毫秒数，超时后将强制终止 `create()` 并抛出错误。若不设置，将使用用户代理的默认值；若太大或太小，则使用最接近的用户代理默认值范围中的值。推荐值为 5000-120000


> 对于 `pubKeyCredParams`，通常我们只需添加 ES256 (alg: -7) 算法即可兼容大部分外部认证器，此外，再添加 RS256 (alg: -257) 算法即可兼容大部分平台内置认证器（如 Windows Hello）。当然，前端添加算法之后，后端也需要相应的算法支持。
> 对于 `userVerification`，由于默认值 "preferred" 并不能很好地被所有设备支持，因此无论在 `create()` 中还是 `get()` 中不指定该参数都会在 Chrome 中触发一条警告。具体请参阅[这个页面](https://chromium.googlesource.com/chromium/src/+/master/content/browser/webauth/uv_preferred.md)。
调用 `create()` 之后，我们就可以拿到一个 `Promise`，并可以在 `then` 中获得认证器返回的 `PublicKeyCredential` 对象。以下是一个 `create()` 返回的 `PublicKeyCredential` 对象的例子：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
PublicKeyCredential {
rawId: ArrayBuffer(32){},
response: AuthenticatorAttestationResponse {
attestationObject: ArrayBuffer(390){},
clientDataJSON: ArrayBuffer(121){}
},
id: "VByF2w2hDXkVsevQFZdbOJdyCTGOrI1-sVEzOzsNnY0",
type: "public-key"
}
PublicKeyCredential { rawId: ArrayBuffer(32) {}, response: AuthenticatorAttestationResponse { attestationObject: ArrayBuffer(390) {}, clientDataJSON: ArrayBuffer(121) {} }, id: "VByF2w2hDXkVsevQFZdbOJdyCTGOrI1-sVEzOzsNnY0", type: "public-key" }

```
PublicKeyCredential {
    rawId: ArrayBuffer(32) {},
    response: AuthenticatorAttestationResponse {
        attestationObject: ArrayBuffer(390) {},
        clientDataJSON: ArrayBuffer(121) {}
    },
    id: "VByF2w2hDXkVsevQFZdbOJdyCTGOrI1-sVEzOzsNnY0",
    type: "public-key"
}
```

其中有：
  * `id: String`：Base64URL 编码的凭证 ID
  * `rawId: ArrayBuffer`：`ArrayBuffer` 的原始凭证 ID
  * `type: String`：一定是 "public-key"
  * `response: Object`：`AuthenticatorAttestationResponse` 对象，是 `PublicKeyCredential` 的主要部分，包含以下两个内容：
    * `response.clientDataJSON: ArrayBuffer`：客户端数据，包含 origin（即凭证请求来源）、挑战等信息
    * `response.attestationObject: ArrayBuffer`：CBOR 编码的认证器数据，包含凭证公钥、凭证 ID、签名（如果有）、签名计数等信息


然后将 `ArrayBuffer` 们以合适的方式编码成字符串，我们就可以把 `PublicKeyCredential` 发送给依赖方以供验证与注册了。具体怎么操作，我们会在下文详细讨论。当然，别忘了 `catch()` 注册过程中抛出的任何错误。
> 你可能会认为在所有情况下，注册时认证器都会对挑战进行签名。实际上在大部分情况下（同时也是默认情况），**注册时认证器并不会对挑战进行签名** ，`attestationObject` 并不会包含签名后的挑战。只有依赖方明确要求证明且用户同意（部分浏览器要求）后认证器才会对挑战进行签名（具体实现据情况会有所不同）。对此，[MDN 解释道](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API/Attestation_and_Assertion#Attestation)“大部分情况下，用户注册公钥时我们会使用「初次使用时信任模型」(TOFU) ，此时验证公钥是没有必要的。”要了解更多关于证明的内容，请参阅“[验证认证器](https://flyhigher.top/develop/2160.html#verify-authenticator)”一节。
而对于 `navigator.credentials.get()`，我们可以传入如下的参数：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
navigator.credentials.get({
publicKey: {
challenge,
rpId,
userVerification,
allowCredentials: [
{
id,
transports: [],
type: "public-key"
}
],
timeout
}
})
navigator.credentials.get({ publicKey: { challenge, rpId, userVerification, allowCredentials: [ { id, transports: [], type: "public-key" } ], timeout } })

```
navigator.credentials.get({
    publicKey: {
        challenge,
        rpId,
        userVerification,
        allowCredentials: [
            {
                id,
                transports: [],
                type: "public-key"
            }
        ],
        timeout
    }
})
```

和 `create()` 一样，对于 `get()` 我们需要传入一个对象，其中只有一对名为 `publicKey` 的键值，指明我们需要获取的是公钥凭证而非普通的密码凭证。在 `publicKey` 对象中我们可以设置这些常用参数：
  * `challenge: Uint8Array`：转换为 `Uint8Array` 的挑战，长度至少为 16，建议为 32
  * `rpID: String`：（可选）依赖方 ID，需要和注册认证器时的一致。规则和上述的 `rp.id` 一致，不指定默认使用当前域名
  * `userVerification: String`：和上文一样，只是需要注意它这次不在 `authenticatorSelection` 中了
  * `allowCredentials: Array`：（可选）用于标识允许的凭证 ID，使用户代理找到正确的认证器。只有符合这个列表中凭证 ID 的凭证才能被成功返回。数组中的每一项都是对象，包含以下属性：
    * `allowCredentials[].type: String`：值只能为 "public-key"
    * `allowCredentials[].id: Uint8Array`：允许的凭证 ID
    * `allowCredentials[].transports: Array`：（可选）用于指定该凭证所需的认证器与用户代理的通信方式，可以包含以下的一或多个字符串：
      * `usb`：可以通过 USB 连接的认证器
      * `nfc`：可以通过 NFC 连接的认证器
      * `ble`：可以通过蓝牙连接的认证器
      * `internal`：平台内置的、无法移除的认证器
  * `timeout: Number`：（可选）方法超时时间的毫秒数，和上面的一样，推荐值为 5000-120000


嗯，要传入的参数少多了。之后，和 `create()` 一样，调用 `get()` 之后，我们就可以拿到一个 `Promise` 并在 `then` 中获得认证器返回的 `PublicKeyCredential` 对象。以下是一个 `get()` 返回的 `PublicKeyCredential` 对象的例子：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
PublicKeyCredential {
rawId: ArrayBuffer(32){},
response: AuthenticatorAssertionResponse {
authenticatorData: ArrayBuffer(37){},
signature: ArrayBuffer(256){},
userHandle: ArrayBuffer(64){},
clientDataJSON: ArrayBuffer(118){}
}
id: "VByF2w2hDXkVsevQFZdbOJdyCTGOrI1-sVEzOzsNnY0"
type: "public-key"
}
PublicKeyCredential { rawId: ArrayBuffer(32) {}, response: AuthenticatorAssertionResponse { authenticatorData: ArrayBuffer(37) {}, signature: ArrayBuffer(256) {}, userHandle: ArrayBuffer(64) {}, clientDataJSON: ArrayBuffer(118) {} } id: "VByF2w2hDXkVsevQFZdbOJdyCTGOrI1-sVEzOzsNnY0" type: "public-key" }

```
PublicKeyCredential {
    rawId: ArrayBuffer(32) {},
    response: AuthenticatorAssertionResponse {
        authenticatorData: ArrayBuffer(37) {},
        signature: ArrayBuffer(256) {},
        userHandle: ArrayBuffer(64) {},
        clientDataJSON: ArrayBuffer(118) {}
    }
    id: "VByF2w2hDXkVsevQFZdbOJdyCTGOrI1-sVEzOzsNnY0"
    type: "public-key"
}
```

这里的东西就比 `create()` 时拿到的要多了。看看我们拿到了什么吧：
  * `id: String`：Base64URL 编码的凭证 ID
  * `rawId: ArrayBuffer`：`ArrayBuffer` 的原始凭证 ID
  * `type: String`：一定是 "public-key"
  * `response: Object`：对于验证流程，认证会返回 `AuthenticatorAssertionResponse` 而不是 `AuthenticatorAttestationResponse` 对象，这个对象包含以下 4 个属性：
    * `response.authenticatorData: ArrayBuffer`：认证器信息，包含认证状态、签名计数等
    * `response.signature: ArrayBuffer`：被认证器签名的 `authenticatorData` + `clientDataHash`（`clientDataJSON` 的 SHA-256 hash）
    * `response.userHandle: ArrayBuffer`：`create()` 创建凭证时的用户 ID `user.id`。许多 U2F 设备不支持这一特性，这一项将会是 `null`
    * `response.clientDataJSON: ArrayBuffer`：客户端数据，包含 origin（即凭证请求来源）、挑战等信息


同样地，我们将 `ArrayBuffer` 们以合适的方式编码成字符串后就可以把 `PublicKeyCredential` 发送给依赖方以供验证了。至于具体怎么做，别急，马上就来讲一讲。
## 简单实现
了这么多，我们终于可以实现一个简单的 WebAuthn 认证页面了。由于在实际操作中 WebAuthn 相关的数据解码和密码计算比较复杂，在服务器端我们可以使用第三方库来帮我们做这些脏活累活，我们只需专注于具体流程就可以了。
要寻找可用的第三方库，你可以在 [webauthn.io](https://webauthn.io/) 上找到适用于各种语言的第三方库——除了 PHP（笑）。不过好在你可以在 GitHub 上找到几个不错的 PHP WebAuthn 库，比如 [web-auth/webauthn-framework](https://github.com/web-auth/webauthn-framework)。
在我们的这个例子中，我们关心的主要是前端逻辑；而后端我们可以使用各类几乎已经做到开箱即用的第三方库，这样我们可以专注于流程而不必关心细节。当然如果你想了解后端的解码细节，可以阅读“[手动解个码](https://flyhigher.top/develop/2160.html#webauthn-decode)”一节。
* * *
让我们先从注册开始吧。现在，用户点击了注册认证器的按钮，一个请求被发送给服务器（也就是依赖方）。在最简单的情况中，依赖方需要将三个内容发送给浏览器：**挑战、用户信息和用户已注册的凭证 ID 列表（即`excludeCredentials` ）**。当然依赖方也可以自由选择发送更多信息，只要最终前端能构建合法的参数即可。
挑战最终会被转换为 `Uint8Array`，即一组 0-255 的整数。如果使用 PHP，在后端我们可以这样生成 Base64 编码的挑战：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
$challenge = "";
for($i = 0; $i<32; $i++){
$challenge .= chr(random_int(0, 255));
}
$challenge = base64_encode($challenge);
$challenge = ""; for($i = 0; $i < 32; $i++){ $challenge .= chr(random_int(0, 255)); } $challenge = base64_encode($challenge);

```
$challenge = "";
for($i = 0; $i < 32; $i++){
    $challenge .= chr(random_int(0, 255));
}
$challenge = base64_encode($challenge);
```

对于用户信息，我们需要登录名、显示名称和 ID 三项内容。我们可以从数据库中取出用户信息，也可以新建一份。需要注意的是，**出于安全和隐私的考量，ID 不应该包含用户的任何信息，比如用户邮箱等。** 推荐的做法是和挑战一样，生成一个随机字符串/一组随机数，并将其于用户关联起来以供之后使用。
发送已注册的凭证 ID 列表是为了防止用户重复注册同一个认证器。正确设置该列表后，如果用户试图注册同一个认证器，浏览器会中止流程并抛出 `InvalidStateError`。
最后，别忘了将挑战等一些后续可能会用到的信息临时存储起来。Session 就是一个很好的选择。
将所有信息发送到浏览器之后，我们应该可以构建出新建凭证所需的参数了。由于有多个参数需要以 `Uint8Array` 的形式传入，我们可以准备一个简单的工具函数帮我们将 Base64 的字符串转为 `Uint8Array`。
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
functionstr2ab(str){
return Uint8Array.from(window.atob(str), c=>c.charCodeAt(0));
}
function str2ab(str){ return Uint8Array.from(window.atob(str), c=>c.charCodeAt(0)); }

```
function str2ab(str){
    return Uint8Array.from(window.atob(str), c=>c.charCodeAt(0));
}
```

除了 `challenge`, `rp`, `user` 和 `excludeCredentials` 几部分需要你根据具体情况设置外，上文提到的其他参数一般可以这么设置：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
publicKey: {
challenge, // 自行设置
rp, // 自行设置
user, // 自行设置
pubKeyCredParams: [
{
type: "public-key",
alg: -7// ES256
},
{
type: "public-key",
alg: -257// RS256
}
],
authenticatorSelection: {
userVerification: "discouraged",
authenticatorAttachment: null// 除非用户指定，大部分情况下无需指定
},
excludeCredentials, // 自行设置
timeout: 60000
}
publicKey: { challenge, // 自行设置 rp, // 自行设置 user, // 自行设置 pubKeyCredParams: [ { type: "public-key", alg: -7 // ES256 }, { type: "public-key", alg: -257 // RS256 } ], authenticatorSelection: { userVerification: "discouraged", authenticatorAttachment: null // 除非用户指定，大部分情况下无需指定 }, excludeCredentials, // 自行设置 timeout: 60000 }

```
publicKey: {
    challenge, // 自行设置
    rp, // 自行设置
    user, // 自行设置
    pubKeyCredParams: [
        {
            type: "public-key",
            alg: -7 // ES256
        },
        {
            type: "public-key",
            alg: -257 // RS256
        }
    ],
    authenticatorSelection: {
        userVerification: "discouraged",
        authenticatorAttachment: null // 除非用户指定，大部分情况下无需指定
    },
    excludeCredentials, // 自行设置
    timeout: 60000
}
```

然后就是传入 `navigator.credentials.create()`，拿到 `PublicKeyCredential`。如果一切顺利，接下来我们就需要考虑如何将返回的内容传回依赖方了。由于我们拿到的很多都是 `ArrayBuffer`，我们需要将其进行编码。再准备一个工具函数吧：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
functionarray2b64String(a){
returnwindow.btoa(String.fromCharCode(...a));
}
function array2b64String(a) { return window.btoa(String.fromCharCode(...a)); }

```
function array2b64String(a) {
    return window.btoa(String.fromCharCode(...a));
}
```

然后适当处理，我们就可以得到一个方便传输的 JSON 字符串了：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
navigator.credentials.create({publicKey}).then((credentialInfo)=>{
const publicKeyCredential = {
id: credentialInfo.id,
type: credentialInfo.type,
rawId: array2b64String(newUint8Array(credentialInfo.rawId)),
response: {
clientDataJSON: array2b64String(newUint8Array(credentialInfo.response.clientDataJSON)),
attestationObject: array2b64String(newUint8Array(credentialInfo.response.attestationObject))
}
};
return publicKeyCredential;
}).then(JSON.stringify).then((authenticatorResponseJSON)=>{
// 可以发送了
}).catch((error)=>{
console.warn(error); // 捕获错误
})
navigator.credentials.create({publicKey}).then((credentialInfo) => { const publicKeyCredential = { id: credentialInfo.id, type: credentialInfo.type, rawId: array2b64String(new Uint8Array(credentialInfo.rawId)), response: { clientDataJSON: array2b64String(new Uint8Array(credentialInfo.response.clientDataJSON)), attestationObject: array2b64String(new Uint8Array(credentialInfo.response.attestationObject)) } }; return publicKeyCredential; }).then(JSON.stringify).then((authenticatorResponseJSON) => { // 可以发送了 }).catch((error) => { console.warn(error); // 捕获错误 })

```
navigator.credentials.create({publicKey}).then((credentialInfo) => {
    const publicKeyCredential = {
        id: credentialInfo.id,
        type: credentialInfo.type,
        rawId: array2b64String(new Uint8Array(credentialInfo.rawId)),
        response: {
            clientDataJSON: array2b64String(new Uint8Array(credentialInfo.response.clientDataJSON)),
            attestationObject: array2b64String(new Uint8Array(credentialInfo.response.attestationObject))
        }
    };
    return publicKeyCredential;
}).then(JSON.stringify).then((authenticatorResponseJSON) => {
    // 可以发送了
}).catch((error) => {
    console.warn(error); // 捕获错误
})
```

依赖方收到数据以后，还需要做三件事：验证挑战、存储凭证 ID 和存储公钥。如果数据解码顺利，且收到的挑战和之前发送的一致，就可以认为注册成功，将凭证 ID 及公钥与用户关联起来。这一步有很多第三方库可以帮我们做，对于基础实现我们就不深入探究了。
> 由于不同厂商的认证器的实现方式不同，**我们并不能保证凭证 ID 一定是全局唯一的** ，也就是说，凭证 ID 有可能碰撞——即使这些凭证实际上是不同的。依赖方在实现凭证 ID 的存储及查找时，需要注意和用户 ID 结合进行存储或查找，或是直接在注册认证器时在服务器端对比阻止相同的凭证 ID。
* * *
接下来就可以进行验证了。某天，用户点击了验证按钮准备登录，于是浏览器发送了验证请求到依赖方，同时附上要登录的用户名。接下来依赖方至少需要发送两项内容给浏览器：**挑战和用户已绑定的凭证 ID 列表（即`allowCredentials` ）。**
之后前端的处理流程就和注册时基本一致了。只是需要注意验证流程中获取到的 `PublicKeyCredential` 的结构和注册时的稍有不同。
当浏览器将数据传回后，依赖方需要做的事情就比之前要麻烦一些了。依赖方需要验证挑战，并用之前存储的公钥验证签名和签名计数。同样地，这一步有很多第三方库可以帮我们做。最后，如果验证全部通过，我们就可以允许用户登录了。
到目前为止，我们已经实现了一个简单的 WebAuthn 验证服务。不过这只是一个最基础的实现，对于很多高安全要求的身份认证这是远远不够的。因此，我们需要摆脱对第三方库的依赖，深入了解 WebAuthn。你可以继续阅读“[深入了解 WebAuthn](https://flyhigher.top/develop/2160.html#deep-into-webauthn)”部分，不过对于基础的 WebAuthn 实现，我们的旅程就到这里了。
## 拓展阅读
如果你的目标只是快速了解如何开发 WebAuthn，那么你阅读到这里就可以了。同时，上一节例子中的部分代码来自于我为了这篇文章开发的 WordPress 插件 WP-WebAuthn，这个插件可以为你的 WordPress 启用 WebAuthn 无密码登录（并非二步验证），你可以查阅插件的 [GitHub 存储库](https://github.com/yrccondor/wp-webauthn)了解更多，也可以自己安装试一试。
如果你正在使用 Chrome 开发，Chrome 87+ 版本添加了一个 WebAuthn 开发者面板，可以帮助你在没有任何实体验证器的情况下开发 WebAuthn 功能。你可以在 Google 的[这篇文章](https://developers.google.com/web/tools/chrome-devtools/webauthn)中了解更多。不够，如果你正在使用 Firefox，很遗憾目前我还没有找到对应的开发工具或是浏览器扩展可用。
如果你希望了解更多关于非对称加密的数学证明，可以查阅阮一峰老师的[这篇文章](http://www.ruanyifeng.com/blog/2013/06/rsa_algorithm_part_one.html)。
如果你希望了解更多关于 Credential Management API 的信息，可以查阅[这篇文章](https://medium.com/dev-channel/sign-in-on-the-web-credential-management-api-and-best-practices-d21aed14b6fe)（英文）。
如果你希望了解更多 WebAuthn 的细节，可以继续往下阅读。
# 深入了解 WebAuthn
如上文所说，如果摆脱对第三方库的依赖，或是要实现更安全的 WebAuthn，我们必须深入了解 WebAuthn。在这一部分中，我们会详细讨论上文没有提到的一些概念和参数，并了解 WebAuthn 中各类数据的结构以实现解码与验证。先来看一看一些进阶的选项吧。
## 进阶选项
没错，上文提到的传入 `navigator.credentials.create()` 和 `navigator.credentials.get()` 方法的参数其实只是所有参数的一部分。对于 `create()`，我们还可以配置这些可选内容（上文提及的已省略）：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
navigator.credentials.create({
publicKey: {
rp: {
icon
},
user: {
icon
},
attestation,
authenticatorSelection: {
requireResidentKey
},
extensions
}
})
navigator.credentials.create({ publicKey: { rp: { icon }, user: { icon }, attestation, authenticatorSelection: { requireResidentKey }, extensions } })

```
navigator.credentials.create({
    publicKey: {
        rp: {
            icon
        },
        user: {
            icon
        },
        attestation,
        authenticatorSelection: {
            requireResidentKey
        },
        extensions
    }
})
```

  * `rp.icon: String` 和 `user.icon`：是的，你可以为依赖方和用户设置图标，可以使用 HTTPS URL 或 Base64，一般长度不能超过 128 字节，不过大部分浏览器不会显示图标，或是有非常小的图片体积限制，所以一般没有使用这一属性的必要
  * `attestation: String`：表明依赖方是否需要证明。可选三个值：
    * `none`：（默认）不需要证明。如上文所述，依赖方不关心证明，因此认证器不会签名。对于 iOS/iPad OS 13，必须设置为此值，否则验证将失败
    * `indirect`：依赖方需要证明，但证明方式可由认证器选择。在支持匿名证明的认证器上，认证器会通过匿名证明的方式签名挑战，并向依赖方提供签名方式等信息
    * `direct`：依赖方要求直接证明。此时认证器会使用烧录在认证器中的公钥进行签名，同时向依赖方提供签名方式等信息以供依赖方验证认证器是否可信。更多信息可以阅读“[验证认证器](https://flyhigher.top/develop/2160.html#verify-authenticator)”一节
  * 在 `authenticatorSelection` 中，我们还可以设置两个可选属性：
    * `authenticatorSelection.requireResidentKey: Boolean`：是否要求将私钥钥永久存储于认证器中。默认值为 `false`。对于 iOS/iPad OS 13，必须设置为 `false`，否则验证将失败
  * `extensions: Object`：WebAuthn 扩展，可以提供规范之外的配置和响应。由于实际情况中很少会使用这一特性，我们不会在这篇文章中讨论它


> 将 `requireResidentKey` 设置为 `true` 可以实现无用户名的登录，即认证器同时替代了用户名和密码。需要注意的是，尽管大部分认证器可以实现无限对公私钥，**但能永久存储的私钥数量是有限的** （对于 Yubikey，这通常是 25），因此只应在真正需要的时候启用此特性。我们会在“[无用户名登录](https://flyhigher.top/develop/2160.html#login-without-username)”一节中详细讨论原因。
> **如果你没有高安全需求（如银行交易等），请不要向认证器索取证明** ，即将 `attestation` 设置为 "none"。对于普通身份认证来说，要求证明不必要的，且会有浏览器提示打扰到用户。
> Android 暂时无法实施用户验证，进而会导致依赖方验证失败。你可以在[这里](https://bugs.chromium.org/p/chromium/issues/detail?id=997538)追踪这个特性的实现情况。
> 对于 `extensions`，由于目前浏览器支持和应用范围有限，我们不会在这篇文章中涉及，不过你可以看一个例子：
> Plain text
> Copy to clipboard
> Open code in new window
> EnlighterJS 3 Syntax Highlighter
> extensions: {
> uvm: true, // 要求认证器返回用户进行验证的方法
> txAuthSimple: "Please proceed"// 在认证器上显示与交易有关的简短消息
> }
> extensions: { uvm: true, // 要求认证器返回用户进行验证的方法 txAuthSimple: "Please proceed" // 在认证器上显示与交易有关的简短消息 }
> 
```
extensions: {
    uvm: true, // 要求认证器返回用户进行验证的方法
    txAuthSimple: "Please proceed" // 在认证器上显示与交易有关的简短消息
}
```

> 你可以在[这个页面](https://www.w3.org/2019/01/webauthn-extensions.html)了解更多关于 `extensions` 的信息。
对于 `get()`，我们其实只有一个可选内容没讲了，即 `extensions`。和上文一样，我们不会在这篇文章中讨论它。
就这些了！
## 手动解个码
是时候看看如何手动解码了。我们将会在这一节中讨论认证器返回的数据的结构以及如何正确地解码它们。
首先我们来看看如何处理注册过程中认证器发回的数据。假设所有 `ArrayBuffer` 类型的值都被正确地以 Base64 编码，且后端已经将 JSON 的字符串解析为字典。先来复习一下，我们得到的数据应该是这样的（数据较长，已省略一部分）：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
{
id: "ZRBkDBCEtq...9XY8atOcbg",
type: "public-key",
rawId: "ZRBkDBCEtq...9XY8atOcbg==",
response: {
clientDataJSON: "eyJjaGFsbGVuZ2U...i5jcmVhdGUifQ==",
attestationObject: "o2NmbXRkbm9uZWd...xNHuAMzz2LxZA=="
}
}
{ id: "ZRBkDBCEtq...9XY8atOcbg", type: "public-key", rawId: "ZRBkDBCEtq...9XY8atOcbg==", response: { clientDataJSON: "eyJjaGFsbGVuZ2U...i5jcmVhdGUifQ==", attestationObject: "o2NmbXRkbm9uZWd...xNHuAMzz2LxZA==" } }

```
{
    id: "ZRBkDBCEtq...9XY8atOcbg",
    type: "public-key",
    rawId: "ZRBkDBCEtq...9XY8atOcbg==",
    response: {
        clientDataJSON: "eyJjaGFsbGVuZ2U...i5jcmVhdGUifQ==",
        attestationObject: "o2NmbXRkbm9uZWd...xNHuAMzz2LxZA=="
    }
}
```

这里的 `id` 就是凭证的 ID，如果验证正确，我们最终要将它存储起来并于用户关联。同时可以看到 Base64 编码后的 `rawId` 其实和 `id` 是一致的（不过 `id` 是 Base64URL 编码的）。而 `type` 则一定是 "public-key"。
不过，我们主要关心的还是 `respose` 中的两项内容。首先是 `clientDataJSON`。它的处理比较简单，看名字就知道，它应该是一个 JSON 字符串。
> 小技巧：如果你看到一个 Base64 编码的字符串以 "ey" 开头，那么它大概率是一个 Base64 编码的 JSON。
将`clientDataJSON` Base64 解码再 JSON 解码之后我们就能得到一个字典：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
{
challenge: "NI4i1vsNmP2KHcmyFnBCKRVQPfHgg34SsYZUOPZY2lM",
extra_keys_may_be_added_here: "do not compare clientDataJSON against a template. See https://goo.gl/yabPex",
origin: "https://dev.axton.cc",
type: "webauthn.create"
}
{ challenge: "NI4i1vsNmP2KHcmyFnBCKRVQPfHgg34SsYZUOPZY2lM", extra_keys_may_be_added_here: "do not compare clientDataJSON against a template. See https://goo.gl/yabPex", origin: "https://dev.axton.cc", type: "webauthn.create" }

```
{
    challenge: "NI4i1vsNmP2KHcmyFnBCKRVQPfHgg34SsYZUOPZY2lM",
    extra_keys_may_be_added_here: "do not compare clientDataJSON against a template. See https://goo.gl/yabPex",
    origin: "https://dev.axton.cc",
    type: "webauthn.create"
}
```

结构一目了然。在这里，我们需要验证三项内容：
  * `challenge` 和之前发送的一致
  * `origin` 为创建凭证的页面的源（协议+主机名+端口号，并非 URL）
  * `type` 为 "webauthn.create"


同时可以注意到有一个奇怪的 `extra_keys_may_be_added_here`。这其实是 Google 在 Chrome 中搞的一点小把戏，有一定概率会出现，提醒我们需要将 JSON 解析后再验证键值以防额外插入的键值影响验证。具体信息你可以访问那个 URL 看一看。
对于 Firefox，我们会多得到两项 `clientExtensions` 和 `hashAlgorithm` ，分别指明了客户端扩展数据和签名算法。
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
{
challenge: "dg6ost6ujhAA0g6WqLe-SOOH-tbhvjW9Sp90aPKlLJI",
clientExtensions: {},
hashAlgorithm: "SHA-256",
origin: "https://dev.axton.cc",
type: "webauthn.create"
}
{ challenge: "dg6ost6ujhAA0g6WqLe-SOOH-tbhvjW9Sp90aPKlLJI", clientExtensions: {}, hashAlgorithm: "SHA-256", origin: "https://dev.axton.cc", type: "webauthn.create" }

```
{
    challenge: "dg6ost6ujhAA0g6WqLe-SOOH-tbhvjW9Sp90aPKlLJI",
    clientExtensions: {},
    hashAlgorithm: "SHA-256",
    origin: "https://dev.axton.cc",
    type: "webauthn.create"
}
```

由于本文不考虑扩展数据，因此我们可以不考虑 `clientExtensions`。同时由于目前规范中指定的签名算法只有 SHA-256 一种，因此现阶段我们也可以简单地忽略 `hashAlgorithm`。
`clientDataJSON` 很简单地就处理完了。接下来我们要来看看 `attestationObject`。先来看看 `attestationObject` 的结构图示：
![attestationObject 的结构](https://flyhigher.top/develop/2160.html)
`attestationObject` 是 CBOR 编码后再被 Base64 编码的，因此我们需要额外对其进行 CBOR 解码。
> CBOR (Concise Binary Object Representation, 简明二进制对象表示) 是一种多应用于物联网领域的编码方式，你可以将它看作体积更小、更方便物联网传输的二进制 JSON。大部分语言都可以找到对应的 CBOR 解码库。
我们当然不会手解 CBOR，直接来看看解开之后的样子吧：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
{
fmt: "none",
attStmt: {},
authData: [211, 217, 43, 24, 199, ..., 97, 238, 166, 67, 107]
}
{ fmt: "none", attStmt: {}, authData: [211, 217, 43, 24, 199, ..., 97, 238, 166, 67, 107] }

```
{
    fmt: "none",
    attStmt: {},
    authData: [211, 217, 43, 24, 199, ..., 97, 238, 166, 67, 107]
}
```

这些键值的含义如下：
  * `fmt`：标明证明的格式。WebAuthn 预定义了几种格式，分别为：
    * `none`：没有证明
    * `packed`：为 WebAuthn 优化的证明格式
    * `android-safetynet`：Android 使用的格式
    * `android-key`：又是 Android 使用的格式
    * `fido-u2f`：FIDO U2F 认证器使用的格式
    * `tpm`：TPM 可信平台模块使用的格式
  * `attStmt`：证明对象，具体格式根据 `fmt` 的不同会有所不同
  * `authData`：包含公钥、签名计数等来自认证器的数据


诶，例子里的 `attStmt` 怎么是空的？还记得之前说的吗？大部分情况下，**如果依赖方不要求证明，那么认证器不会签名挑战** ，于是 `fmt` 会变为 "none"，`attstmt` 会为空。如果不是高安全要求，我们可以只对这一种情况做支持。
> 注意，部分情况下 Firefox 会在不要求证明（即 `attestation` 为 "none"）时会返回 `fmt` 为 "packed" 的证明。**这是符合规范的。** 此时认证器会进行自证明，你可以视情况进行处理。具体可以阅读“[验证认证器](https://flyhigher.top/develop/2160.html#verify-authenticator)”一节。
对于非 "none" 的 `fmt` 我们稍后再谈，现在我们先来看看 `authData`。来复习一下 `authData` 的结构：
![authData 的结构](https://flyhigher.top/develop/2160.html)
对于它的解码比较简单粗暴，我们要做的就是根据图示将它切开，然后适当地转换类型。其中各部分的含义如下：
  * `rpIdHash`：如其名，SHA-256 的 `rpId`，长度 32 字节
  * `flags`：标识认证状态，长度 1 字节。其中 8 位分别为：
    * `ED`：是否有扩展数据
    * `AT`：是否包含 `attestedCredentialData`。通常注册认证器时会包含 `attestedCredentialData`，而验证时不包含
    * 保留位
    * 保留位
    * 保留位
    * `UV`：用户是否已验证
    * 保留位
    * `UP`：用户是否在场
  * `signCount`：签名计数，长度 4 字节
  * `attestedCredentialData`：包含公钥等凭据数据，变长。其结构如下：
    * `aaguid`：认证器的 AAGUID (Authenticator Attestation GUID)，对于同一型号的认证器，它们的 AAGUID 是相同的
    * `credentialIdLength`：标识 `credentialId` 的长度，长度 2 字节
    * `credentialId`：凭证 ID，和 `rawId` 一致，长度由 `credentialIdLength` 定义
    * `credentialPublicKey`：CBOR 编码的 COSE 格式的凭证公钥，变长
  * `extensions`：扩展数据，变长，本文不讨论


> 出于隐私考虑，如果不要求证明，认证器会以 0 填充 AAGUID。
如果你的后端在使用 Node.js，这里有个工具函数可以帮你完成这一步（不考虑 `extensions`）：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
functionparseAuthData(buffer){
let rpIdHash = buffer.slice(0, 32);
buffer = buffer.slice(32);
let flagsBuf = buffer.slice(0, 1);
buffer = buffer.slice(1);
let flagsInt = flagsBuf[0];
let flags = {
up: !!(flagsInt & 0x01),
uv: !!(flagsInt & 0x04),
at: !!(flagsInt & 0x40),
ed: !!(flagsInt & 0x80),
flagsInt
}
let counterBuf = buffer.slice(0, 4);
buffer = buffer.slice(4);
let counter = counterBuf.readUInt32BE(0);
let aaguid = undefined;
let credID = undefined;
let COSEPublicKey = undefined;
if(flags.at){
aaguid = buffer.slice(0, 16);
buffer = buffer.slice(16);
let credIDLenBuf = buffer.slice(0, 2);
buffer = buffer.slice(2);
let credIDLen = credIDLenBuf.readUInt16BE(0);
credID = buffer.slice(0, credIDLen);
buffer = buffer.slice(credIDLen);
COSEPublicKey = buffer;
}
return{rpIdHash, flagsBuf, flags, counter, counterBuf, aaguid, credID, COSEPublicKey}
}
function parseAuthData(buffer){ let rpIdHash = buffer.slice(0, 32); buffer = buffer.slice(32); let flagsBuf = buffer.slice(0, 1); buffer = buffer.slice(1); let flagsInt = flagsBuf[0]; let flags = { up: !!(flagsInt & 0x01), uv: !!(flagsInt & 0x04), at: !!(flagsInt & 0x40), ed: !!(flagsInt & 0x80), flagsInt } let counterBuf = buffer.slice(0, 4); buffer = buffer.slice(4); let counter = counterBuf.readUInt32BE(0); let aaguid = undefined; let credID = undefined; let COSEPublicKey = undefined; if(flags.at) { aaguid = buffer.slice(0, 16); buffer = buffer.slice(16); let credIDLenBuf = buffer.slice(0, 2); buffer = buffer.slice(2); let credIDLen = credIDLenBuf.readUInt16BE(0); credID = buffer.slice(0, credIDLen); buffer = buffer.slice(credIDLen); COSEPublicKey = buffer; } return {rpIdHash, flagsBuf, flags, counter, counterBuf, aaguid, credID, COSEPublicKey} }

```
function parseAuthData(buffer){
    let rpIdHash = buffer.slice(0, 32);
    buffer = buffer.slice(32);
  
    let flagsBuf = buffer.slice(0, 1);
    buffer = buffer.slice(1);

    let flagsInt = flagsBuf[0];
    let flags = {
        up: !!(flagsInt & 0x01),
        uv: !!(flagsInt & 0x04),
        at: !!(flagsInt & 0x40),
        ed: !!(flagsInt & 0x80),
        flagsInt
    }

    let counterBuf = buffer.slice(0, 4);
    buffer = buffer.slice(4);
  
    let counter = counterBuf.readUInt32BE(0);

    let aaguid = undefined;
    let credID = undefined;
    let COSEPublicKey = undefined;

    if(flags.at) {
        aaguid = buffer.slice(0, 16);
        buffer = buffer.slice(16);

        let credIDLenBuf = buffer.slice(0, 2);
        buffer = buffer.slice(2);

        let credIDLen = credIDLenBuf.readUInt16BE(0);
        credID = buffer.slice(0, credIDLen);

        buffer = buffer.slice(credIDLen);
        COSEPublicKey = buffer;
    }

    return {rpIdHash, flagsBuf, flags, counter, counterBuf, aaguid, credID, COSEPublicKey}
}
```

这段代码来自 [herrjemand](https://gist.github.com/herrjemand/dbeb2c2b76362052e5268224660b6fbc)
解开后，依赖方至少需要做四件事情：
  1. 验证 `rpIdHash` 和预期的一致
  2. 按预期检查用户在场和用户验证状态
  3. 存储签名计数
  4. 存储公钥


> 签名计数不一定从 0 开始。
对于公钥，也就是 `credentialPublicKey`，我们需要多一次 CBOR 解码，然后就可以得到类似这样的公钥：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
{
kty: "EC",
alg: "ECDSA_w_SHA256",
crv: "P-256",
x: "ZGQALNfqo0L7HFYQHFHCS/X5db49z0ePnuQEs3w3X8w=",
y: "6qYxhnjYuez/Q8N6vX7nIIGfxFWdZ25NzQfZYuYOalA="
}
{ kty: "EC", alg: "ECDSA_w_SHA256", crv: "P-256", x: "ZGQALNfqo0L7HFYQHFHCS/X5db49z0ePnuQEs3w3X8w=", y: "6qYxhnjYuez/Q8N6vX7nIIGfxFWdZ25NzQfZYuYOalA=" }

```
{
    kty: "EC",
    alg: "ECDSA_w_SHA256",
    crv: "P-256",
    x: "ZGQALNfqo0L7HFYQHFHCS/X5db49z0ePnuQEs3w3X8w=",
    y: "6qYxhnjYuez/Q8N6vX7nIIGfxFWdZ25NzQfZYuYOalA="
}
```

然后可以选择适当的方法将其存储起来，之后的步骤本文就不再赘述了。现在，将目光拉回来，让我们看看包含证明的 `attestationObject` 是怎么样的。我们来看一个例子：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
{
fmt: "packed",
attStmt: {
alg: -7,
sig: [48, 70, 2, 33, 0, ..., 132, 78, 46, 100, 21],
x5c: [
[48, 130, 2, 189, 48, 130, 1, 165, 160, 3, ..., 177, 48, 125, 191, 145, 24, 225, 169, 41, 248]
]
},
authData: [211, 217, 43, 24, 199, ..., 158, 54, 87, 126, 54]
}
{ fmt: "packed", attStmt: { alg: -7, sig: [48, 70, 2, 33, 0, ..., 132, 78, 46, 100, 21], x5c: [ [48, 130, 2, 189, 48, 130, 1, 165, 160, 3, ..., 177, 48, 125, 191, 145, 24, 225, 169, 41, 248] ] }, authData: [211, 217, 43, 24, 199, ..., 158, 54, 87, 126, 54] }

```
{
    fmt: "packed",
    attStmt: {
        alg: -7,
        sig: [48, 70, 2, 33, 0, ..., 132, 78, 46, 100, 21],
        x5c: [
            [48, 130, 2, 189, 48, 130, 1, 165, 160, 3, ..., 177, 48, 125, 191, 145, 24, 225, 169, 41, 248]
        ]
    },
    authData: [211, 217, 43, 24, 199, ..., 158, 54, 87, 126, 54]
}
```

这里有一个使用 "packed" 格式的证明。此时，`attStmt` 中包含三个值：
  * `alg`：签名算法
  * `sig`：签名值
  * `x5c`：X.509 编码的证书链


我们不会在这一节中详述对签名的验证。要了解更多信息，你可以阅读“[验证认证器](https://flyhigher.top/develop/2160.html#verify-authenticator)”一节。现在，让我们来看看如何处理验证过程中认证器发回的数据。我们得到的数据应该是这样的（数据较长，已省略一部分）：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
{
id: "hmqdxPLit9...BWeVxZqdvU",
type: "public-key",
rawId: "hmqdxPLit9V...BWeVxZqdvU=",
response: {
authenticatorData: "09krGMcWTf...UFAAAABA==",
clientDataJSON: "eyJjaGFsbGVuZ2U...XRobi5nZXQifQ==",
signature: "UsXZV3pvT3np8btj6V0g...WBkaqyt88DrD40qh+A==",
userHandle: "MmYxNWYzZjQyZjM...Tg2ZDY4NzhlNw=="
}
}
{ id: "hmqdxPLit9...BWeVxZqdvU", type: "public-key", rawId: "hmqdxPLit9V...BWeVxZqdvU=", response: { authenticatorData: "09krGMcWTf...UFAAAABA==", clientDataJSON: "eyJjaGFsbGVuZ2U...XRobi5nZXQifQ==", signature: "UsXZV3pvT3np8btj6V0g...WBkaqyt88DrD40qh+A==", userHandle: "MmYxNWYzZjQyZjM...Tg2ZDY4NzhlNw==" } }

```
{
    id: "hmqdxPLit9...BWeVxZqdvU",
    type: "public-key",
    rawId: "hmqdxPLit9V...BWeVxZqdvU=",
    response: {
        authenticatorData: "09krGMcWTf...UFAAAABA==",
        clientDataJSON: "eyJjaGFsbGVuZ2U...XRobi5nZXQifQ==",
        signature: "UsXZV3pvT3np8btj6V0g...WBkaqyt88DrD40qh+A==",
        userHandle: "MmYxNWYzZjQyZjM...Tg2ZDY4NzhlNw=="
    }
}
```

`id`, `rawId` 和 `type` 和之前一样，这里就不再赘述了。让我们来看看 `response`。首先是 `clientDataJSON`，和之前的解法一样，要验证的内容也一样，只是 `type` 从 "webauthn.create" 变成了 "webauthn.get"。
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
{
challenge: "bnkd2CmrEuvKnAFXs2QlC3SKlg4XFvGtP4HJL1yEWyU",
origin: "https://dev.axton.cc",
type: "webauthn.get"
}
{ challenge: "bnkd2CmrEuvKnAFXs2QlC3SKlg4XFvGtP4HJL1yEWyU", origin: "https://dev.axton.cc", type: "webauthn.get" }

```
{
    challenge: "bnkd2CmrEuvKnAFXs2QlC3SKlg4XFvGtP4HJL1yEWyU",
    origin: "https://dev.axton.cc",
    type: "webauthn.get"
}
```

然后是 `userHandle`。前面讲过，这是认证器在创建凭证时的用户 ID。如果用户在使用 U2F 认证器，很可能这一项为空，所以大部分情况下我们不关心这一项。
接着来看 `authenticatorData`。这其实就是之前的 `attestedCredentialData`，只是这次不包含公钥。以相同的方式切开数据，我们应该可以得到 `rpIdHash`, `flags`和 `signCount` 三项。此时，依赖方至少需要做这三样事情：
  1. 验证 `rpIdHash` 和预期的一致
  2. 按预期检查用户在场和用户验证状态
  3. 验证签名计数大于之前存储的计数，并更新存储的计数


> 如果签名计数比之前的小，那么这个认证器很可能是伪造的，应该中止验证并返回验证失败。同时，签名计数不一定每次按 1 递增，通常只要计数比此前的大就认为计数检查通过。
最后，我们来看 `signature`，也就是签名。不过这个签名不是简单的对挑战的签名，具体算法如图所示：
![签名过程](https://flyhigher.top/develop/2160.html)
计算签名时，认证器会将 `authenticatorData` 与 `clientDataHash`（也就是 `clientDataJSON` 的 SHA-256 Hash）拼接起来，并使用对应的私钥签名。依赖方应该使用对应的公钥将其解密，并验证内容是否是 `authenticatorData` 与 `clientDataHash` 的拼接。这部分的计算不在本文的讨论范围内。
最后，如果全部验证通过，返回验证成功。
## 验证认证器
WebAuthn 已经很安全了，但有的时候我们还要让它更安全一点。比如，如果用户在使用伪造的或是自制的认证器，认证器的安全性就得不到保证。此时，依赖方就需要验证认证器是否是可信的认证器。
> 这一过程仅发生在注册认证器时。此时，如果认证器验证通过，就可以存储公钥，后续步骤和之前描述的一致。
> 再次说明，如果不是对安全性有极高的要求，向认证器索取证明以验证认证器是否可信是没有必要的。此外，验证认证器需要依赖方自行维护可信认证器列表，大大增加了维护的复杂性。
在调用 `navigator.credentials.create()` 时，我们可以将 `attestation` 设置为非 "none" 来向认证器索取证明。除无证明外，WebAuthn 定义了四种证明方式：
  * Basic Attestation (Basic) ：基础的证明方式，认证器会使用认证器私钥签名
  * Self Attestation (Self) ：自证明，认证器会使用凭证私钥签名
  * Attestation CA (AttCA) ：认证器会使用多个证明私钥之一签名
  * Elliptic Curve based Direct Anonymous Attestation (ECDAA) ：通过 [DAA](https://en.wikipedia.org/wiki/Direct_Anonymous_Attestation) 实现的匿名证明


> 和验证过程一样，这里签名的目标是 `authenticatorData` 和 `clientDataHash` 的连接。
还记得 `create()` 时 `attestation` 可选的三个值吗？这个值会决定认证器最终使用哪种方式进行证明。复习一下：
  * `none`：大部分情况下认证器会选择不进行证明，部分认证器会进行自证明。此时 AAGUID 会被 0 填充
  * `indirect`：认证器会试图通过替换 AAGUID 和选择合适的证明方式来进行匿名证明，具体方式由认证器选择
  * `direct`：认证器会提供最直接的证明信息


注意，大部分情况下，当认证器需要向依赖方证明自己可信时需要提供认证器公钥，**这会触发浏览器提示，只有用户同意后认证器才会进行证明，否则认证器将不提供证明。**
![浏览器提示](https://flyhigher.top/develop/2160.html)
> 为什么浏览器会说“安全密钥的品牌和型号”？事实上，为了避免用户通过认证器证书被跨依赖方追踪，FIDO 要求使用相同认证器证书的认证器的数量不能少于 100,000。于是大部分认证器厂商会选择**让同一型号的认证器共用同一份证书。** 因此，浏览器的会询问用户是否同意“查看安全密钥的品牌和型号”。
> Android Safety Net 不会向用户询问是否同意，而是会静默进行证明。
当证明不为空时，依赖方收到数据后根据 `attestationObject.fmt` 的不同，需要选择不同的验证方式来验证认证器的可信情况。出于篇幅原因，这里我们不会讨论每一种 `fmt` 的验证方式，更多信息你可以查阅 [W3C 文档](https://www.w3.org/TR/webauthn/#defined-attestation-formats)。
当 `fmt` 为 `packed` 时，`attestationObject.attStmt` 可能会有三种格式：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
// 自证明
{
alg, // 算法
sig // 签名
}
// 基础或证明 CA 证明
{
alg,
sig,
x5c // X.509 证书链
}
// 椭圆曲线证明
{
alg,
sig,
ecdaaKeyId // ECDAA-Issuer 公钥标识符
}
// 自证明 { alg, // 算法 sig // 签名 } // 基础或证明 CA 证明 { alg, sig, x5c // X.509 证书链 } // 椭圆曲线证明 { alg, sig, ecdaaKeyId // ECDAA-Issuer 公钥标识符 }

```
// 自证明
{
    alg, // 算法
    sig // 签名
}
// 基础或证明 CA 证明
{
    alg,
    sig,
    x5c // X.509 证书链
}
// 椭圆曲线证明
{
    alg,
    sig,
    ecdaaKeyId // ECDAA-Issuer 公钥标识符
}
```

此时，依赖方需要检查证书符合预期格式并检查证书是否在可信链上。首先，如果证明中既没有 `ecdaaKeyId` 也没有 `x5c`，就说明这个证明使用的是自证明，只需使用认证器提供的公钥验证即可；如果有 `x5c`，那么就需要验证 `x5c` 中的证书是否在可信链上。将 `x5c` 中的每个证书以 Base64 编码，按 64 个字符切开，并在头尾加上 `-----BEGIN CERTIFICATE-----` 和 `-----END CERTIFICATE-----`就能得到一个证书字符串了。之后，依赖方需要验证证书是否可信。
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
functionbase64ToPem(b64cert){
let pemcert = '';
for(let i = 0; i < b64cert.length; i += 64){
pemcert += b64cert.slice(i, i + 64) + '\n';
}
return'-----BEGIN CERTIFICATE-----\n' + pemcert + '-----END CERTIFICATE-----';
}
function base64ToPem(b64cert){ let pemcert = ''; for(let i = 0; i < b64cert.length; i += 64){ pemcert += b64cert.slice(i, i + 64) + '\n'; } return '-----BEGIN CERTIFICATE-----\n' + pemcert + '-----END CERTIFICATE-----'; }

```
function base64ToPem(b64cert){
    let pemcert = '';
    for(let i = 0; i < b64cert.length; i += 64){
        pemcert += b64cert.slice(i, i + 64) + '\n';
    }
    return '-----BEGIN CERTIFICATE-----\n' + pemcert + '-----END CERTIFICATE-----';
}
```

这段代码来自 [herrjemand](https://gist.github.com/herrjemand/dbeb2c2b76362052e5268224660b6fbc)
至于 `ecdaaKeyId`，由于目前应用较少，处理方法可能需要你另寻资料了。检查证书的具体步骤已经超出了本文的范围，具体可以查阅[这篇文章](https://medium.com/@herrjemand/verifying-fido2-packed-attestation-a067a9b2facd)（英文）。
> 你可以在 [FIDO Metadata Service](https://fidoalliance.org/metadata/) 找到各大厂商认证器的可信证书链。
当在 Android 上调起 WebAuthn 时，大部分情况下 `fmt` 将会为 `safety-net`。此时 `attestationObject.attStmt` 的结构会是：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
{
ver: "200616037",
response: {
type: "Buffer",
data: [101, 121, 74, 104, 98, ..., 115, 104, 104, 82, 65]
}
}
{ ver: "200616037", response: { type: "Buffer", data: [101, 121, 74, 104, 98, ..., 115, 104, 104, 82, 65] } }

```
{
    ver: "200616037",
    response: {
        type: "Buffer",
        data: [101, 121, 74, 104, 98, ..., 115, 104, 104, 82, 65]
    }
}
```

此时，`clientDataJSON` 中还会出现 `androidPackageName` 键，值是调起 WebAuthn 验证的应用的包名，如 Chrome 就是 "com.android.chrome"。
在这个证明中，`data` 其实是一个 JWT 字符串，我们可以将它编码为字符串并将其按照 JWT 进行解码（别忘了验证 JWT 签名）。最终我们会得到一个类似这样的 Payload：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
{
nonce: "0QAurN4F9wik6GEkblDJhGuf4kuaqZn5zaaxlvD1hlA=",
timestampMs: 1584950686460,
apkPackageName: "com.google.android.gms",
apkDigestSha256: "2BQHno+bmWWwdLUYylS8HLt5ESJzci3nt2uui71ojyE=",
ctsProfileMatch: true,
apkCertificateDigestSha256: [
"8P1sW0EPicslw7UzRsiXL64w+O50Ed+RBICtay2g24M="
],
basicIntegrity: true,
evaluationType: "BASIC"
}
{ nonce: "0QAurN4F9wik6GEkblDJhGuf4kuaqZn5zaaxlvD1hlA=", timestampMs: 1584950686460, apkPackageName: "com.google.android.gms", apkDigestSha256: "2BQHno+bmWWwdLUYylS8HLt5ESJzci3nt2uui71ojyE=", ctsProfileMatch: true, apkCertificateDigestSha256: [ "8P1sW0EPicslw7UzRsiXL64w+O50Ed+RBICtay2g24M=" ], basicIntegrity: true, evaluationType: "BASIC" }

```
{
    nonce: "0QAurN4F9wik6GEkblDJhGuf4kuaqZn5zaaxlvD1hlA=",
    timestampMs: 1584950686460,
    apkPackageName: "com.google.android.gms",
    apkDigestSha256: "2BQHno+bmWWwdLUYylS8HLt5ESJzci3nt2uui71ojyE=",
    ctsProfileMatch: true,
    apkCertificateDigestSha256: [
        "8P1sW0EPicslw7UzRsiXL64w+O50Ed+RBICtay2g24M="
    ],
    basicIntegrity: true,
    evaluationType: "BASIC"
}
```

其中包含了有关设备状态的一些信息。比如说，如果 `ctsProfileMatch` 为 `false`，那么该设备很有可能被 root 了。对于高安全要求的场景，我们可以视情况进行验证。
同时我们可以在 JWT Header 中验证证明的有效性。我们应该能取得这样的 Header：
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
{
alg: "RS256",
x5c: [
"MIIFkzCCBHugAwIBAgIR...uvlyjOwAzXuMu7M+PWRc",
"MIIESjCCAzKgAwIBAgIN...UK4v4ZUN80atnZz1yg=="
]
}
{ alg: "RS256", x5c: [ "MIIFkzCCBHugAwIBAgIR...uvlyjOwAzXuMu7M+PWRc", "MIIESjCCAzKgAwIBAgIN...UK4v4ZUN80atnZz1yg==" ] }

```
{
    alg: "RS256",
    x5c: [
        "MIIFkzCCBHugAwIBAgIR...uvlyjOwAzXuMu7M+PWRc",
        "MIIESjCCAzKgAwIBAgIN...UK4v4ZUN80atnZz1yg=="
    ]
}
```

这里的结构就和上方的 `x5c` 验证类似了。具体步骤可以参考[这篇文章](https://medium.com/@herrjemand/verifying-fido2-safetynet-attestation-bd261ce1978d)（英文）。
其他所有格式的验证方式也都可以在[这篇文章](https://medium.com/@herrjemand/verifying-fido2-responses-4691288c8770)（英文）中找到。
## 无用户名登录
认证器已经代替了密码，可是这还不够！在进行第一因素认证（即使用 WebAuthn 登录）时，我们还是需要输入用户名，然后才能进行身份认证。懒惰是第一生产力，我们能不能不输入用户名就进行身份认证呢？实际上，大部分认证器都允许我们无用户名登录。**而这一特性的核心就是 Resident Key 客户端密钥驻留。**
你可以思考一下，为什么普通的 WebAuthn 为什么不能实现无用户名登录？事实上，大部分认证器为了实现无限对公私钥，会将私钥通过 Key Warp 等技术加密后包含在凭证 ID 中发送给依赖方，这样认证器本身就不用存储任何信息。不过，这就导致需要身份认证时，依赖方必须通过用户名找到对应的凭证 ID，将其发送给认证器以供其算出私钥。
> Yubikey 实现了一个基于 HMAC 的算法，认证器可以在私钥不离开认证器的前提下（常规的 Key Warp 算法中实际上私钥离开了认证器）通过一些输入和凭证 ID 重新计算私钥，你可以阅读[这篇文章](https://www.yubico.com/blog/yubicos-u2f-key-wrapping/)了解更多。
> 客户端通过凭证 ID 查找对应认证器的算法根据系统的不同是不同的。通常凭证 ID 中会包含认证器信息，因此系统可以通过凭证 ID 找到对应的认证器。
要避免输入用户名，我们可以要求认证器将私钥在自己的内存中也存储一份。这样，依赖方无需提供凭证 ID，认证器就可以通过依赖方 ID 找到所需的私钥并签名公钥。以下是具体流程：
注册时：
  1. 依赖方请求新建凭证，同时要求启用客户端密钥
  2. 认证器生成一对公私钥，并将私钥存储在永久内存中且与依赖方 ID 及用户 ID 绑定，随后将公钥发送给依赖方以供存储
  3. 依赖方将用户 ID 即公钥与用户绑定


验证时：
  1. 依赖方请求验证，但不必提供除依赖方 ID 以外的更多信息
  2. 用户选择认证器
  3. 认证器根据依赖方 ID 找到对应私钥
  4. 如果有多个对应私钥，认证器会询问用户应该使用哪个身份信息登录
  5. 确定私钥后，认证器签名挑战并将其返回，同时返回用户 ID
  6. 依赖方通过用户 ID 找到对应用户并用对应公钥检查签名，正确则允许对应用户登录


> 可以看到，这个特性同时要求认证器存储用户 ID，即上面提到过的 `userHandle`。依赖方需要根据此信息找到对应用户，因此不支持 `userHandle` 的 U2F 认证器无法进行无用户名登录。
> 如之前所说，**认证器能永久存储的私钥数量是有限的** ，因此只应在真正需要无用户名登录的时候启用此特性。
> 目前暂时没有办法检测认证器是否支持客户端密钥驻留，因此在无用户名验证失败时应 fallback 至常规的 WebAuthn 验证，即向用户询问用户名。
现在让我们来看看如何实现这一特性吧。首先，调用 `navigator.credentials.create()` 时我们需要注意两个参数：`requireResidentKey` 必须为 `true`，`userVerification` 必须为 "required"。
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
navigator.credentials.create({
publicKey: {
...
authenticatorSelection: {
requireResidentKey: true,
userVerification: "required"
...
},
...
}
})
navigator.credentials.create({ publicKey: { ... authenticatorSelection: { requireResidentKey: true, userVerification: "required" ... }, ... } })

```
navigator.credentials.create({
    publicKey: {
        ...
        authenticatorSelection: {
            requireResidentKey: true,
            userVerification: "required"
            ...
        },
        ...
    }
})
```

> Windows Hello **似乎** 会存储所有已注册的凭据，因此无论是否指定 `requireResidentKey`，你都可以通过 Windows Hello 进行无用户名登录。
随后，浏览器会询问用户是否允许认证器存储私钥。
![浏览器提示](https://flyhigher.top/develop/2160.html)
如果用户同意，认证器会存储私钥，并和普通的 WebAuthn 一样返回信息。不过，依赖方收到数据之后，只需将公钥、用户 ID 与用户关联起来，而不必再将凭证 ID 与用户关联起来。至此注册完成。
之后，在用户请求登录时，无需再向依赖方提供用户名。同时在传入 `navigator.credentials.get()` 的参数中也有两个需要注意：`userVerification` 必须为 "required"，同时 `allowCredentials` 必须为空。
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
navigator.credentials.get({
publicKey: {
...
userVerification: "required",
allowCredentials: [],
...
}
})
navigator.credentials.get({ publicKey: { ... userVerification: "required", allowCredentials: [], ... } })

```
navigator.credentials.get({
    publicKey: {
        ...
        userVerification: "required",
        allowCredentials: [],
        ...
    }
})
```

> Android 暂不支持无用户名验证，空的 `allowCredentials` 会导致浏览器返回 `NotSupportedError` 错误。
此时，认证器会根据依赖方 ID 找到对应的私钥。如果有多个对应私钥，认证器会询问用户应该使用哪个身份信息登录。用户选择后，认证器就会使用对应的私钥签名挑战并将其返回。此时，`userHandle` 一定不为空。
依赖方收到数据后，需要将 `userHandle` 作为用户 ID 找到对应的用户，并使用对应的公钥验证签名。如果验证成功，则认为对应的用户身份认证成功，依赖方可以允许其登录。至此验证结束。
> 有的时候你可能会需要清除认证器中的密钥。绝大多数认证器都提供了对应的软件以供清除存储的密钥，但大部分情况下这会重置整个认证器，这意味着相关认证器此前的所有凭证均会失效。因此建议不要将日常使用的认证器作为开发测试用的认证器。
## 从 U2F 认证迁移
如果你的服务此前提供了 U2F 第二因素认证，你可能会希望在将依赖方从 U2F 升级到 WebAuthn 时用户此前注册的 U2F 认证器仍然可用而无需重新注册。由于 WebAuthn 向后兼容 U2F 设备，用户是可以继续使用原有的 U2F 认证器的。不过，由于 WebAuthn 的依赖方 ID 与 U2F 的 `appid` 并不一定相同，你需要将原有的 U2F `appid` 随 WebAuthn 流程一起传递给认证器，认证器才能使用正确的私钥进行响应。
要实现这一点，我们只需要在注册及认证仪式中使用 WebAuthn 的 `appid` 扩展。
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
extensions: {
appid: "https://example.com"//U2F appid
}
extensions: { appid: "https://example.com" //U2F appid }

```
extensions: {
    appid: "https://example.com" //U2F appid
}
```

此时认证器便可以得到正确的私钥，之后的流程与正常情况一致；依赖方除了正常的 WebAuthn 流程外，不需要再做任何其它操作。
## 拓展阅读
我们的 WebAuthn 之旅到这里就真的结束了。不过，你仍然可以自行探究，了解更多。**本文只是一个粗浅的使用指南** ，而被称为“Web 身份认证的未来”的 WebAuthn 的深层还要很多细节值得我们挖掘学习，不过本文不会再继续讨论了。
如果你想了解更多关于 WebAuthn 的信息，最好的方法是直接阅读 [W3C 规范](https://www.w3.org/TR/webauthn)。此外，Yubico 也提供了不错的 [WebAuthn 文档](https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/)。
要了解更多认证器存储凭证的信息，你可以阅读[这篇文章](https://duo.com/labs/tech-notes/how-security-keys-store-credentials)（英文）。
如果你想了解更多 Android Safety Net 是怎样运作的，可以观看[这个视频](https://youtu.be/8lv_9mydrjg)，并通过 [Google 的文档](https://developer.android.com/training/safetynet/attestation)了解 Android Safety Net 的更多信息。
如果你想方便地调试 WebAuthn，[webauthn.me](https://webauthn.me/) 提供了一个非常直观方便的[调试器](https://webauthn.me/debugger)。
# 参考资料
[WebAuthn Level 1 规范 - W3C](https://www.w3.org/TR/webauthn)  
[WebAuthn Level 2 草案 - W3C](https://github.com/w3c/webauthn)  
[一起来了解Web Authentication - TechBridge 技术共笔部落格](https://blog.techbridge.cc/2019/08/17/webauthn-intro/)  
[Introduction to WebAuthn API - Medium](https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285)  
[WebAuthn/FIDO2: Verifying responses - Medium](https://medium.com/@herrjemand/verifying-fido2-responses-4691288c8770)  
[WebAuthn介绍与使用 - obeta](https://obeta.me/posts/2019-03-01/WebAuthn%E4%BB%8B%E7%BB%8D%E4%B8%8E%E4%BD%BF%E7%94%A8)  
[webauthn.io](https://webauthn.io/)  
[webauthn.guide](https://webauthn.guide/)  
[webauthn.me](https://webauthn.me/)  
[Attestation and Assertion - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API/Attestation_and_Assertion)  
[Web Authentication API - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Authentication_API)（顺便翻译了一半）  
[FIDO TechNotes: The Truth about Attestation - FIDO Alliance](https://fidoalliance.org/fido-technotes-the-truth-about-attestation/)  
[WebAuthn Developer Guide - Yubico](https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/)  
[WebAuthn - Wikipedia](https://en.wikipedia.org/wiki/WebAuthn)  
[All about FIDO2, CTAP2 and WebAuthn - Microsoft Tech Community](https://techcommunity.microsoft.com/t5/identity-standards-blog/all-about-fido2-ctap2-and-webauthn/ba-p/288910)  
[Webauthn Framework](https://webauthn-doc.spomky-labs.com/)  
[如何开发支持 FIDO U2F 登录的网站 - 知乎专栏](https://zhuanlan.zhihu.com/p/25279015)  

__
![赞赏](https://acdn.flyhigher.top/wp-content/uploads/2017/11/wxx.jpg)
本文链接：<https://flyhigher.top/develop/2160.html>  
本文采用 [CC BY-NC-SA 3.0 Unported](https://creativecommons.org/licenses/by-nc-sa/3.0/deed.zh) 协议进行许可
__
  * [__ 生成分享图](https://flyhigher.top/develop/2160.html)
  * [ 分享到 微博](http://service.weibo.com/share/share.php?appkey=&title=%E8%B0%88%E8%B0%88%20WebAuthn&url=https://flyhigher.top/develop/2160.html&pic=https://flyhigher.top/wp-content/uploads/2020/03/post-cover.png&searchPic=false&style=simple)
  * [ 分享到 微信](https://flyhigher.top/develop/2160.html)
  * [ 分享到 QQ](http://connect.qq.com/widget/shareqq/index.html?site=%E6%97%A0%E5%9E%A0&title=%E8%B0%88%E8%B0%88%20WebAuthn&summary=WebAuthn%EF%BC%8C%E5%8D%B3%20Web%20Authentication%EF%BC%8C%E6%98%AF%E4%B8%80%E4%B8%AA%E7%94%A8%E4%BA%8E%E5%9C%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8A%E8%BF%9B%E8%A1%8C%E8%AE%A4%E8%AF%81%E7%9A%84%20API%EF%BC%8CW3C%20%E5%B0%86%E5%85%B6%E8%A1%A8%E8%BF%B0%E4%B8%BA%20)
  * [ 分享到 QQ 空间](https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=https://flyhigher.top/develop/2160.html&title=%E8%B0%88%E8%B0%88%20WebAuthn&content=utf-8)
  * [ 分享到 Telegram](https://telegram.me/share/url?url=https://flyhigher.top/develop/2160.html&text=%E8%B0%88%E8%B0%88%20WebAuthn)
  * [ 分享到 Facebook](https://www.facebook.com/sharer.php?u=https://flyhigher.top/develop/2160.html)
  * [ 分享到 Twitter](https://twitter.com/intent/tweet?text=%E8%B0%88%E8%B0%88%20WebAuthn&url=https://flyhigher.top/develop/2160.html)

__ #[HTTPS](https://flyhigher.top/tag/https) #[Web](https://flyhigher.top/tag/web) #[WebAuthn](https://flyhigher.top/tag/webauthn) #[密码学](https://flyhigher.top/tag/%e5%af%86%e7%a0%81%e5%ad%a6) #[开发](https://flyhigher.top/tag/%e5%bc%80%e5%8f%91)
[首页](https://flyhigher.top) • [开发](https://flyhigher.top/develop) • 谈谈 WebAuthn
### 你可能会喜欢
[
  * 不止更亮：在 Web 中使用 HDR __ ](https://flyhigher.top/develop/2693.html "不止更亮：在 Web 中使用 HDR") [
  * 新的个人页以及对 Nginx 启用 Brotli、TLS 1.3和 Server Push __ ](https://flyhigher.top/develop/1042.html "新的个人页以及对 Nginx 启用 Brotli、TLS 1.3和 Server Push") [
  * Nginx+SSL+HTTP2配置简明指南 __ ](https://flyhigher.top/works/net/367.html "Nginx+SSL+HTTP2配置简明指南") [
  * 使用通行密钥 PRF 扩展在浏览器中安全加密 __ ](https://flyhigher.top/develop/2710.html "使用通行密钥 PRF 扩展在浏览器中安全加密") [
  * 前端时间国际化 101 __ ](https://flyhigher.top/develop/2482.html "前端时间国际化 101") [
  * 更新到下一代服务器架构 __ ](https://flyhigher.top/develop/1245.html "更新到下一代服务器架构") [
  * PJAX，真的好吗？ __ ](https://flyhigher.top/develop/684.html "PJAX，真的好吗？") 

### 发表回复 [取消回复](https://flyhigher.top/develop/2160.html#respond)
_textsms_ 说点什么...
__
![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_mrgreen.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_neutral.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_twisted.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_arrow.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_eek.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_smile.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_confused.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_cool.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_evil.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_biggrin.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_idea.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_redface.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_razz.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_rolleyes.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_wink.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_cry.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_surprised.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_lol.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_mad.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_sad.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_exclaim.gif)![](https://acdn.flyhigher.top/wp-content/plugins/WP-Alu2Button/static/img/icon_question.gif)
_account_circle_ 昵称
昵称不能为空
_email_ 邮箱
请按格式填写邮箱
__ 网站（如果有）http(s)://
__
Δ
  * ![](https://flyhigher.top/develop/2160.html)
eminoda
这篇帮助很大啊
2 年前[ __ 回复](https://flyhigher.top/develop/2160.html/comment-page-4?replytocom=84375#respond)
  * ![](https://flyhigher.top/develop/2160.html)
sss
cdn 证书过期了
2 年前[ __ 回复](https://flyhigher.top/develop/2160.html/comment-page-4?replytocom=84144#respond)
  * ![](https://flyhigher.top/develop/2160.html)
shoyuf
terrific
3 年前[ __ 回复](https://flyhigher.top/develop/2160.html/comment-page-4?replytocom=80989#respond)

_keyboard_arrow_down_
[ _arrow_back_ 上一篇NLP 找门：用朴素贝叶斯进行文本分类 ](https://flyhigher.top/develop/1989.html) [ _arrow_forward_ 下一篇无垠 2020 年度总结 ](https://flyhigher.top/diary/2405.html)
无垠
谈谈 WebAuthn
WebAuthn，即 Web Authentication，是一个用于在浏览器上进行认证的 API，W3C 将其表述为 "An API for accessing Public Key Credentials"，即“一个用于访问公钥凭证的 API”。WebAuthn 很…
扫描二维码继续阅读
23  
2020/03
__
[无垠](https://flyhigher.top) [关于](https://flyhigher.top/about) / [订阅 RSS](https://flyhigher.top/feed) / [证书透明](https://ssl.flyhigher.top)   
© 2014-2020 Axton. 
* * *
Theme: MDx By [AxtonYao](https://flyhigher.top)
[浙ICP备14040847号](https://beian.miit.gov.cn/)
giItT1WQy@!-/#giItT1WQy@!-/# giItT1WQy@!-/#giItT1WQy@!-/#
