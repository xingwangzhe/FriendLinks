#  [汐涌及岸](https://coderxi.com/)
[ BLOG ](https://coderxi.com/)
[ 归档 ](https://coderxi.com/archives)[ 分类 ](https://coderxi.com/categories)[ 标签 ](https://coderxi.com/tags)
[ 友链 ](https://coderxi.com/links)
[ 我的 ](https://coderxi.com/about)
[ 关于我 ](https://coderxi.com/about)[ Github ](https://github.com/coderxi1)
![](https://coderxi.com/avatar.png)
汐涌及岸
* * *
[ BLOG ](https://coderxi.com/)
[ 归档 ](https://coderxi.com/archives)[ 分类 ](https://coderxi.com/categories)[ 标签 ](https://coderxi.com/tags)
[ 友链 ](https://coderxi.com/links)
[ 我的 ](https://coderxi.com/about)
[ 关于我 ](https://coderxi.com/about)[ Github ](https://github.com/coderxi1)
#  目录
  1. Win11此电脑下没有文件夹选项
  2. [1. 开启/关闭全部文件夹](https://coderxi.com/posts/toggle-folders-under-this-pc-in-windows-11#%E5%BC%80%E5%90%AF%E5%85%B3%E9%97%AD%E5%85%A8%E9%83%A8%E6%96%87%E4%BB%B6%E5%A4%B9)
  3. [2. 单独开启](https://coderxi.com/posts/toggle-folders-under-this-pc-in-windows-11#%E5%8D%95%E7%8B%AC%E5%BC%80%E5%90%AF)
  4. [3. 单独关闭](https://coderxi.com/posts/toggle-folders-under-this-pc-in-windows-11#%E5%8D%95%E7%8B%AC%E5%85%B3%E9%97%AD)


#  最新文章 [ ](https://coderxi.com/)
  * [Win11此电脑下没有文件夹选项](https://coderxi.com/posts/toggle-folders-under-this-pc-in-windows-11/) 2025-07-09
  * [红米k50线刷MIUI14+root记录](https://coderxi.com/posts/redmi-k50-root-note/) 2025-03-13
  * [利用Cloudflare Worker自建短链接服务](https://coderxi.com/posts/url-shortener-with-cloudflare-worker/) 2025-02-11
  * [Astro博客中使用remark-markmap优雅的创建思维导图](https://coderxi.com/posts/remark-markmap-doc/) 2024-12-31
  * [Custom Astro Component Sample](https://coderxi.com/posts/custom-astro-component-sample/) 2024-07-29


#  Win11此电脑下没有文件夹选项
* * *
发表于 2025-07-09 修改于 2025-07-09 [未分类](https://coderxi.com/categories/%E6%9C%AA%E5%88%86%E7%B1%BB) 457 字 3 分钟
> 【转载于】[Add or Remove Folders under This PC in File Explorer in Windows 11](https://www.elevenforum.com/t/add-or-remove-folders-under-this-pc-in-file-explorer-in-windows-11.7122/)
Win11此电脑下没有文件夹（3D对象、桌面、文档、下载、音乐、图片、视频）的选项了，之前通过设置注册表恢复过来，但是更新以后偶尔会又失效，直接转载一下教程省得以后再到处搜索找。
**食用方法** ：新建文件，重命名为.reg结尾的文件名，把内容复制粘贴进去双击.reg文件即可。
# 开启/关闭全部文件夹
开启全部关闭全部
enable_all.reg
```



1


Windows Registry Editor Version 5.00






2










3


; 3D Folders






4


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{0DB7E03F-FC29-4DC6-9020-FF41B59E513A}]






5










6


; Desktop






7


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{B4BFCC3A-DB2C-424C-B029-7FE99A87C641}]






8



"HideIfEnabled"=-







9










10


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{B4BFCC3A-DB2C-424C-B029-7FE99A87C641}]






11



"HiddenByDefault"=dword:00000000







12










13


; Documents






14


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{d3162b92-9365-467a-956b-92703aca08af}]






15



"HideIfEnabled"=-







16










17


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{d3162b92-9365-467a-956b-92703aca08af}]






18



"HiddenByDefault"=dword:00000000







19










20


; Downloads






21


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{088e3905-0323-4b02-9826-5d99428e115f}]






22



"HideIfEnabled"=-







23










24


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{088e3905-0323-4b02-9826-5d99428e115f}]






25



"HiddenByDefault"=dword:00000000







26










27


; Music






28


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}]






29



"HideIfEnabled"=-







30










31


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{1CF1260C-4DD0-4ebb-811F-33C572699FDE}]






32



"HiddenByDefault"=dword:00000000







33










34


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}]






35



"HiddenByDefault"=dword:00000000







36










37


; Pictures






38


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{24ad3ad4-a569-4530-98e1-ab02f9417aa8}]






39



"HideIfEnabled"=-







40










41


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{24ad3ad4-a569-4530-98e1-ab02f9417aa8}]






42



"HiddenByDefault"=dword:00000000







43










44


; Videos






45


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{f86fa3ab-70d2-4fc7-9c99-fcbf05467f3a}]






46



"HideIfEnabled"=-







47










48


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{f86fa3ab-70d2-4fc7-9c99-fcbf05467f3a}]






49



"HiddenByDefault"=dword:00000000




```

disable_all.reg
```



1


Windows Registry Editor Version 5.00






2










3


; 3D Folders






4


[-HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{0DB7E03F-FC29-4DC6-9020-FF41B59E513A}]






5










6


; Desktop






7


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{B4BFCC3A-DB2C-424C-B029-7FE99A87C641}]






8



"HideIfEnabled"=dword:022ab9b9







9










10


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{B4BFCC3A-DB2C-424C-B029-7FE99A87C641}]






11



"HiddenByDefault"=dword:00000001







12










13


; Documents






14


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{d3162b92-9365-467a-956b-92703aca08af}]






15



"HideIfEnabled"=dword:022ab9b9







16










17


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{d3162b92-9365-467a-956b-92703aca08af}]






18



"HiddenByDefault"=dword:00000001







19










20


; Downloads






21


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{088e3905-0323-4b02-9826-5d99428e115f}]






22



"HideIfEnabled"=dword:022ab9b9







23










24


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{088e3905-0323-4b02-9826-5d99428e115f}]






25



"HiddenByDefault"=dword:00000001







26










27


; Music






28


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}]






29



"HideIfEnabled"=dword:022ab9b9







30










31


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{1CF1260C-4DD0-4ebb-811F-33C572699FDE}]






32



"HiddenByDefault"=dword:00000001







33










34


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}]






35



"HiddenByDefault"=dword:00000001







36










37


; Pictures






38


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{24ad3ad4-a569-4530-98e1-ab02f9417aa8}]






39



"HideIfEnabled"=dword:022ab9b9







40










41


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{24ad3ad4-a569-4530-98e1-ab02f9417aa8}]






42



"HiddenByDefault"=dword:00000001







43










44


; Videos






45


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{f86fa3ab-70d2-4fc7-9c99-fcbf05467f3a}]






46



"HideIfEnabled"=dword:022ab9b9







47










48


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{f86fa3ab-70d2-4fc7-9c99-fcbf05467f3a}]






49



"HiddenByDefault"=dword:00000001




```

# 单独开启
3DDesktopDocumentsDownloadsMusicPicturesVideos
enable_3d_objects.reg
```



1


Windows Registry Editor Version 5.00






2










3


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{0DB7E03F-FC29-4DC6-9020-FF41B59E513A}]



```

enable_desktop.reg
```



1


Windows Registry Editor Version 5.00






2










3


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{B4BFCC3A-DB2C-424C-B029-7FE99A87C641}]






4



"HideIfEnabled"=-







5










6


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{B4BFCC3A-DB2C-424C-B029-7FE99A87C641}]






7



"HiddenByDefault"=dword:00000000




```

enable_documents.reg
```



1


Windows Registry Editor Version 5.00






2










3


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{d3162b92-9365-467a-956b-92703aca08af}]






4



"HideIfEnabled"=-







5










6


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{d3162b92-9365-467a-956b-92703aca08af}]






7



"HiddenByDefault"=dword:00000000




```

enable_downloads.reg
```



1


Windows Registry Editor Version 5.00






2










3


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{088e3905-0323-4b02-9826-5d99428e115f}]






4



"HideIfEnabled"=-







5










6


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{088e3905-0323-4b02-9826-5d99428e115f}]






7



"HiddenByDefault"=dword:00000000




```

enable_music.reg
```



1


Windows Registry Editor Version 5.00






2










3


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}]






4



"HideIfEnabled"=-







5










6


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{1CF1260C-4DD0-4ebb-811F-33C572699FDE}]






7



"HiddenByDefault"=dword:00000000







8










9


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}]






10



"HiddenByDefault"=dword:00000000




```

enable_pictures.reg
```



1


Windows Registry Editor Version 5.00






2










3


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{24ad3ad4-a569-4530-98e1-ab02f9417aa8}]






4



"HideIfEnabled"=-







5










6


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{24ad3ad4-a569-4530-98e1-ab02f9417aa8}]






7



"HiddenByDefault"=dword:00000000




```

enable_videos.reg
```



1


Windows Registry Editor Version 5.00






2










3


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{f86fa3ab-70d2-4fc7-9c99-fcbf05467f3a}]






4



"HideIfEnabled"=-







5










6


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{f86fa3ab-70d2-4fc7-9c99-fcbf05467f3a}]






7



"HiddenByDefault"=dword:00000000




```

# 单独关闭
3DDesktopDocumentsDownloadsMusicPicturesVideos
disable_3d_objects.reg
```



1


Windows Registry Editor Version 5.00






2










3


[-HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{0DB7E03F-FC29-4DC6-9020-FF41B59E513A}]



```

disable_desktop.reg
```



1


Windows Registry Editor Version 5.00






2










3


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{B4BFCC3A-DB2C-424C-B029-7FE99A87C641}]






4



"HideIfEnabled"=dword:022ab9b9







5










6


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{B4BFCC3A-DB2C-424C-B029-7FE99A87C641}]






7



"HiddenByDefault"=dword:00000001




```

disable_documents.reg
```



1


Windows Registry Editor Version 5.00






2










3


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{d3162b92-9365-467a-956b-92703aca08af}]






4



"HideIfEnabled"=dword:022ab9b9







5










6


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{d3162b92-9365-467a-956b-92703aca08af}]






7



"HiddenByDefault"=dword:00000001




```

disable_downloads.reg
```



1


Windows Registry Editor Version 5.00






2










3


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{088e3905-0323-4b02-9826-5d99428e115f}]






4



"HideIfEnabled"=dword:022ab9b9







5










6


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{088e3905-0323-4b02-9826-5d99428e115f}]






7



"HiddenByDefault"=dword:00000001




```

disable_music.reg
```



1


Windows Registry Editor Version 5.00






2










3


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}]






4



"HideIfEnabled"=dword:022ab9b9







5










6


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{1CF1260C-4DD0-4ebb-811F-33C572699FDE}]






7



"HiddenByDefault"=dword:00000001







8










9


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}]






10



"HiddenByDefault"=dword:00000001




```

disable_pictures.reg
```



1


Windows Registry Editor Version 5.00






2










3


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{24ad3ad4-a569-4530-98e1-ab02f9417aa8}]






4



"HideIfEnabled"=dword:022ab9b9







5










6


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{24ad3ad4-a569-4530-98e1-ab02f9417aa8}]






7



"HiddenByDefault"=dword:00000001




```

disable_videos.reg
```



1


Windows Registry Editor Version 5.00






2










3


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{f86fa3ab-70d2-4fc7-9c99-fcbf05467f3a}]






4



"HideIfEnabled"=dword:022ab9b9







5










6


[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace\{f86fa3ab-70d2-4fc7-9c99-fcbf05467f3a}]






7



"HiddenByDefault"=dword:00000001




```

# 评论 
昵称
邮箱
网址
* * *
#### 预览:
[](https://guides.github.com/features/mastering-markdown/ "Markdown Guide")
0  字
登录发布
![小黄脸](https://coderxi.com/emojis/%E5%B0%8F%E9%BB%84%E8%84%B8/icon.20x20.png)![2233娘](https://coderxi.com/emojis/2233%E5%A8%98/icon.50x50.png)![蛆音娘](https://coderxi.com/emojis/%E8%9B%86%E9%9F%B3%E5%A8%98/icon.50x50.png)
评论
  * 按正序
  * 按倒序
  * 按热度


Powered by [ Waline ](https://github.com/walinejs/waline) v3.4.2
Copyright © 2019 ~ 2025 By 汐涌及岸. All rights reserved. 
框架: Astro 5.2.5 框架Astro 5.2.5主题: Antares 1.0.0 主题Antares 1.0.0版权: BY-NC-SA 4.0 版权BY-NC-SA 4.0RSS RSSATOM ATOM
萌ICP备20210307号冀ICP备: 待重新备案 冀ICP备待重新备案
