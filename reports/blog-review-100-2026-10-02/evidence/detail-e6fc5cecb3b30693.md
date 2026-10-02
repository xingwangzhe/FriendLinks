__
米露小窝  
放弃个性,就和死了没什么区别
[__ 菜单](https://milu.ink/612.html)[ __ 目录](https://milu.ink/612.html)
  * [_home_ 首页](https://milu.ink/)
  * [_build_ 技术](https://milu.ink/category/technology)
  * [_extension_ 生活](https://milu.ink/category/life)
  * [_brightness_5_ 日常](https://milu.ink/category/dailyposts)
  * [_group_ 我的朋友们](https://milu.ink/myfriends)
  * [_account_circle_ 关于我](https://milu.ink/about)
  * [_wifi_tethering_ DN42](https://milu.ink/dn42)
  * [_train_ 开往](https://www.travellings.cn/go.html)


1前期提要2解决方案2.1给 Linux 添加 WebHID 权限2.2修改网页设备名
__
__
_menu_ [米露小窝](https://milu.ink) __ __
# AJAZZ 黑爵键盘在 Linux 下无法使用 WEB 驱动的解决方法
# 前期提要
在近期入手了一块黑爵 AK980max 磁轴键盘，但是发现在 Linux 下无法连接，于是研究了一下有了解决方案
# 解决方案
## 给 Linux 添加 WebHID 权限
在 Linux 上，`/dev/hidraw*` 设备默认以 `root` 权限创建，普通用户没有办法读取，我们添加一个简单的 udev 规则即可解决
首先 lsusb 获取设备的 Vendor ID 和 Product ID

```
 lsusb
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 002: ID 05e3:0608 Genesys Logic, Inc. Hub
Bus 001 Device 003: ID 0b05:19af ASUSTek Computer, Inc. AURA LED Controller
Bus 001 Device 004: ID 8087:0029 Intel Corp. AX200 Bluetooth
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 004 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 005 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 005 Device 002: ID 0c45:8043 Microdia AK980 MAX
Bus 005 Device 003: ID 373b:10c9 Compx Nearlink Mouse Dongle
Bus 006 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
```

```
 lsusb
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 002: ID 05e3:0608 Genesys Logic, Inc. Hub
Bus 001 Device 003: ID 0b05:19af ASUSTek Computer, Inc. AURA LED Controller
Bus 001 Device 004: ID 8087:0029 Intel Corp. AX200 Bluetooth
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 004 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 005 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 005 Device 002: ID 0c45:8043 Microdia AK980 MAX
Bus 005 Device 003: ID 373b:10c9 Compx Nearlink Mouse Dongle
Bus 006 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
```
Bash
我这里的 ID 就是 `0c45:8043`，然后执行这条命令添加

```
echo 'KERNEL=="hidraw*", ATTRS{idVendor}=="0c45", ATTRS{idProduct}=="8043", TAG+="uaccess"' \
  | sudo tee /etc/udev/rules.d/50-keyboard-hid.rules

sudo udevadm control --reload-rules
sudo udevadm trigger
```

```
echo 'KERNEL=="hidraw*", ATTRS{idVendor}=="0c45", ATTRS{idProduct}=="8043", TAG+="uaccess"' \
  | sudo tee /etc/udev/rules.d/50-keyboard-hid.rules

sudo udevadm control --reload-rules
sudo udevadm trigger
```
Bash
但是回到 Web 选择设备的时候还是不行，这是为什么呢？
## 修改网页设备名
回到 Web 时报错如下：

```
加载键盘3141:32835:KEYBOARD AK980 MAX配置失败: Error: 所有路径都未找到配置文件: 3141-32835-KEYBOARD AK980 MAX
    at ge (layout-default-Da_Ywczl.js:2:534749)
    at Proxy.N (layout-default-Da_Ywczl.js:2:529083)
    at async k (layout-default-Da_Ywczl.js:3:11462)
```

```
加载键盘3141:32835:KEYBOARD AK980 MAX配置失败: Error: 所有路径都未找到配置文件: 3141-32835-KEYBOARD AK980 MAX
    at ge (layout-default-Da_Ywczl.js:2:534749)
    at Proxy.N (layout-default-Da_Ywczl.js:2:529083)
    at async k (layout-default-Da_Ywczl.js:3:11462)
```
JavaScript
由于 Linux 和 Win 逻辑不同，Win 获取的设备名字是 AK980 MAX，但是在 Linux 下是 KEYBOARD AK980 MAX
于是我研究了一下 Web 源码，他在这段函数就是纯硬拼接

```
async function ge(D) {
    const [L,V,Y,Q,me] = D.split(":");
    let ye = `${L}-${V}-${Y}...`;  // 用设备名拼路径
    const b = Z(ye, "ajazz");      // 去找配置文件
}
```

```
async function ge(D) {
    const [L,V,Y,Q,me] = D.split(":");
    let ye = `${L}-${V}-${Y}...`;  // 用设备名拼路径
    const b = Z(ye, "ajazz");      // 去找配置文件
}
```
JavaScript
然后用油猴脚本拦截修改一下就可以解决了

```
// ==UserScript==
// @name         AJAZZ Linux Fix
// @match        https://ajazz.driveall.cn/*
// @run-at       document-start
// ==/UserScript==

const origGetDevices = navigator.hid.getDevices.bind(navigator.hid);
navigator.hid.getDevices = async function() {
    const devices = await origGetDevices();
    devices.forEach(d => {
        if (d.productName && d.productName.startsWith("KEYBOARD ")) {
            Object.defineProperty(d, 'productName', {
                value: d.productName.replace("KEYBOARD ", ""),
                writable: false
            });
        }
    });
    return devices;
};

const origRequestDevice = navigator.hid.requestDevice.bind(navigator.hid);
navigator.hid.requestDevice = async function(options) {
    const devices = await origRequestDevice(options);
    devices.forEach(d => {
        if (d.productName && d.productName.startsWith("KEYBOARD ")) {
            Object.defineProperty(d, 'productName', {
                value: d.productName.replace("KEYBOARD ", ""),
                writable: false
            });
        }
    });
    return devices;
};
```

```
// ==UserScript==
// @name         AJAZZ Linux Fix
// @match        https://ajazz.driveall.cn/*
// @run-at       document-start
// ==/UserScript==

const origGetDevices = navigator.hid.getDevices.bind(navigator.hid);
navigator.hid.getDevices = async function() {
    const devices = await origGetDevices();
    devices.forEach(d => {
        if (d.productName && d.productName.startsWith("KEYBOARD ")) {
            Object.defineProperty(d, 'productName', {
                value: d.productName.replace("KEYBOARD ", ""),
                writable: false
            });
        }
    });
    return devices;
};

const origRequestDevice = navigator.hid.requestDevice.bind(navigator.hid);
navigator.hid.requestDevice = async function(options) {
    const devices = await origRequestDevice(options);
    devices.forEach(d => {
        if (d.productName && d.productName.startsWith("KEYBOARD ")) {
            Object.defineProperty(d, 'productName', {
                value: d.productName.replace("KEYBOARD ", ""),
                writable: false
            });
        }
    });
    return devices;
};
```
JavaScript
然后保存脚本，即可解决！
我已经反馈给客服了，不知道会不会修（x
__
![赞赏](https://s3.milu.ink/2023/10/20231005031116532.jpg)
《[AJAZZ 黑爵键盘在 Linux 下无法使用 WEB 驱动的解决方法](https://milu.ink/612.html)》依据“CC BY-NC-SA 4.0”许可证进行授权。转载的时候请附上米露的链接，最好请勿用于商业目的 qaq 
__
  * [__ 生成分享图](https://milu.ink/612.html)
  * [ 分享到 微博](http://service.weibo.com/share/share.php?appkey=&title=AJAZZ%20%E9%BB%91%E7%88%B5%E9%94%AE%E7%9B%98%E5%9C%A8%20Linux%20%E4%B8%8B%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8%20WEB%20%E9%A9%B1%E5%8A%A8%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95&url=https://milu.ink/612.html&pic=&searchPic=false&style=simple)
  * [ 分享到 微信](https://milu.ink/612.html)
  * [ 分享到 QQ](http://connect.qq.com/widget/shareqq/index.html?site=%E7%B1%B3%E9%9C%B2%E5%B0%8F%E7%AA%9D&title=AJAZZ%20%E9%BB%91%E7%88%B5%E9%94%AE%E7%9B%98%E5%9C%A8%20Linux%20%E4%B8%8B%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8%20WEB%20%E9%A9%B1%E5%8A%A8%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95&summary=%0A%E5%89%8D%E6%9C%9F%E6%8F%90%E8%A6%81%0A%0A%0A%0A%E5%9C%A8%E8%BF%91%E6%9C%9F%E5%85%A5%E6%89%8B%E4%BA%86%E4%B8%80%E5%9D%97%E9%BB%91%E7%88%B5%20AK980max%20%E7%A3%81%E8%BD%B4%E9%94%AE%E7%9B%98%EF%BC%8C%E4%BD%86%E6%98%AF%E5%8F%91%E7%8E%B0%E5%9C%A8%20Linux%20%E4%B8%8B%E6%97%A0%E6%B3%95%E8%BF%9E%E6%8E%A5%EF%BC%8C%E4%BA%8E%E6%98%AF%E7%A0%94%E7%A9%B6%E4%BA%86%E4%B8%80%E4%B8%8B...&pics=&url=https://milu.ink/612.html)
  * [ 分享到 QQ 空间](https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=https://milu.ink/612.html&title=AJAZZ%20%E9%BB%91%E7%88%B5%E9%94%AE%E7%9B%98%E5%9C%A8%20Linux%20%E4%B8%8B%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8%20WEB%20%E9%A9%B1%E5%8A%A8%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95&content=utf-8)

__ 没有标签 __ 2026-04-09
[首页](https://milu.ink) • [技术](https://milu.ink/category/technology) • AJAZZ 黑爵键盘在 Linux 下无法使用 WEB 驱动的解决方法
[![MxmiluBOB的头像](https://milu.ink/612.html)](https://milu.ink/author/mxmilu)
### [MxmiluBOB](https://milu.ink "访问作者网站")
#### 文章作者
### 发表回复 [取消回复](https://milu.ink/612.html#respond)
_textsms_ 说点什么...
__
![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_mrgreen.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_neutral.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_twisted.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_arrow.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_eek.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_smile.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_confused.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_cool.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_evil.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_biggrin.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_idea.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_redface.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_razz.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_rolleyes.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_wink.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_cry.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_surprised.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_lol.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_mad.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_sad.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_exclaim.gif)![](https://milu.ink/wp-content/plugins/WP-Alu2Button/static/img/icon_question.gif)
_account_circle_ 昵称
昵称不能为空
_email_ 邮箱
请按格式填写邮箱
__ 网站（如果有）http(s)://
如果有人回复我的评论，请通过电子邮件通知我。
在此浏览器中保存我的显示名称、邮箱地址和网站地址，以便下次评论时使用。
__
点击按钮开始验证
[](https://www.geetest.com/first_page)
[ _arrow_back_ 上一篇 浙江移动烽火光猫获取超密 + G-010S-A 猫棒上网 ](https://milu.ink/600.html)
米露小窝
AJAZZ 黑爵键盘在 Linux 下无法使用 WEB 驱动的解决方法
前期提要 在近期入手了一块黑爵 AK980max 磁轴键盘，但是发现在 Linux 下无法连接，于是研究了一下有了解决方案 解决方案 给 Linux 添加 WebHID 权限 在 Linux 上，/dev/hidr…
扫描二维码继续阅读
09  
2026/04
__ 由 MiluCloud - 我们拥有高达 0.99% 的 SLA 提供源服务器支持  
[ _train_ 开往-友链接力 ](https://www.travellings.cn/go.html "开往-友链接力")   
[萌ICP备20252308号](https://icp.gov.moe/?keyword=20252308)  
[桂ICP备2021003667号-51](https://beian.miit.gov.cn/)   
  
把同班的可爱女同学娶回家就是我最大的梦想
关闭验证
刷新验证
[帮助反馈](https://www.geetest.com/Helper)
视觉障碍
返回
[](https://www.geetest.com/first_page)
