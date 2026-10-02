# [Theme Next ](https://www.theme-next.org/index.html)
Theme for Hexo
  * [Home](https://www.theme-next.org/index.html)
  * [Docs](https://www.theme-next.org/docs.html)


##  [NexT 7.7.2 Released](https://www.theme-next.org/next-7-7-2-released.html)
Posted on 2021-03-01
## 🌟 New Features
  * Native Dark Mode support (#1386)  
| 
```
+ darkmode: true  

```
 |  
| --- |  


## ⭐ Features
  * Support MathJax v3.0 (#1314)
  * Add next_config helper (#1346)


## 🐞 Bug Fixes
  * Remove box-shadow of .sidebar when back2top.sidebar is true (#1380)
  * Fix config.search.path is null (#1374)


## 🛠 Improvements
  * Redirect amscd for mathjax3 (#1379)
  * Optimize the position of search icon on mobile (#1387)
  * Style back-to-top button to make sidebar more comfortable (#1367)


## 🌀 External Changes
  * [comments] gitalk.swig: fix syntax bug and remove redundant lines introducing access_token (#1369)


## 📖 Documentation
  * PayPal now supports pay-by-QRCode (#1364)


* * *
For full changes, see the comparison between v7.7.1 and v7.7.2
Detailed changes for NexT v7.7.2
##  [NexT 7.7.1 Released](https://www.theme-next.org/next-7-7-1-released.html)
Posted on 2021-02-01
## 🌟 New Features
  * Follow me through various channels (#1360)

```

                                                # Subscribe through Telegram Channel, Twitter, etc.
  
# Usage: `Key: permalink || icon (Font Awesome)  
follow_me:
  
  #Twitter: https://twitter.com/username || twitter  
  #Telegram: https://t.me/channel_name || telegram
  
  #Wechat: /images/wechat_channel.jpg || wechat  
  #RSS: /atom.xml || rss  

```



## 🐞 Bug Fixes
  * Fix valine & disqus meta for (#1305) (#1351)
  * Fix conflict between animation of sub-menu icons and pjax (#1349)


## 🛠 Improvements
  * Make the reading progress smoother (#1322)


## 🌍 Localization
  * New Crowdin translations (#1372)
  * Improve french translation (#1358)


* * *
For full changes, see the comparison between v7.7.0 and v7.7.1
Detailed changes for NexT v7.7.1
##  [NexT 7.7.0 Released](https://www.theme-next.org/next-7-7-0-released.html)
Posted on 2021-01-01
## 💥 Breaking Changes
###  Make lazyload & PJAX available for all comment systems (#1152) 
  * 
```
# Multiple Comment System Support  
comments:
  
  # Available values: tabs | buttons  
  style: tabs  
  # Choose a comment system to be displayed by default.
  
  # Available values: changyan | disqus | disqusjs | gitalk | livere | valine  
  active:  
  # Setting `true` means remembering the comment system selected by the visitor.
  
  storage: true  
+  # Lazyload all comment systems.  
+  lazyload: false
  
  # Modify texts or order for any navs, here are some examples.  
  nav:  
    #disqus:  
    #  text: Load Disqus
  
    #  order: -1  
    #gitalk:  
    #  order: -2  
# Disqus  
disqus:
  
  enable: false  
  shortname:  
  count: true  
-  lazyload: false
  
  #post_meta_order: 0  

```



## 🐞 Bug Fixes
  * Fix Gitalk distractionFreeMode invalid bug (#1326)


## 🛠 Improvements
  * Use IntersectionObserver to lazyload comments (#1305)
  * Drop cheerio (#1299)


* * *
For full changes, see the comparison between v7.6.0 and v7.7.0
We support [IQS Directory](https://www.iqsdirectory.com/) - a leading OEM manufacturing resource.
© Copyright. 2026. Theme-Next. All Rights Reserved. [Site Map](https://www.theme-next.org/sitemap.html) | [Terms](https://www.theme-next.org/terms.html)
