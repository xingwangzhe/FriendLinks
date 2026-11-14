# 外部贡献者 YAML 复核

检查日期：2026-11-14

范围仅包含 Git 历史中由非 xingwangzhe 作者提交或修改的 YAML。最近一次博客聚合站清理（`3078e60b`）没有删除这些贡献者文件。

| 贡献者 | 提交 | 当前文件 | 复核结果 | 处理 |
| --- | --- | --- | --- | --- |
| 摆烂领域大蛇 | `12825cc3` | `links/unverified/tianmoy.cn.yml` | 当前入口返回 522，HTTPS 响应直接输出 Typecho `index.php` 源码，无法验证公开文章正文 | `unverified`，保留候选，站点恢复后复核 |
| 摆烂领域大蛇 | `8cc1495e` | `links/blog.224418.xyz.yml` | 个人日记与博客搭建文章，有归档、分类和独立文章链接 | 保留为个人文字博客 |
| Mayx | `88f922e6` | `links/mabbs.github.io.yml` | 个人技术博客，有归档、文章索引和原创正文 | 保留为个人文字博客 |
| Norcleeh | `69d6115f` | `links/nocp.space.yml` | 首页是个人站，博客栏有 57 篇博客与 34 篇笔记，文字正文公开 | 保留为个人文字博客 |
| Paddy | `3d66a434` | `links/www.paddysun.top.yml` | 中文文字博客，有文章索引、分类和原创正文 | 保留为个人文字博客 |
| seisamuse | `9040373e` | `links/www.seis-jun.xyz.yml` | 原 `seisamuse.yml` 已由 `6ddbf0a5` 迁移到规范域名，生活与技术文章持续更新 | 保留，不恢复重复 YAML |
| siuserxiaowei | `59c92d18` | 已删除 | 页面是手机卡商品、价格、微信下单与商业教程入口 | 排除并加入完整 hostname 黑名单 |
| 筱序二十 | `4549da47` | `links/qixz.cn.yml` | 原 `qxzhan.cn.yml` 已由 `272af1a2` 迁移到新域名，个人文章索引和正文公开 | 保留，并记录 `qxzhan.cn` 旧域别名 |

保留文件顶部已写入贡献来源。排名与文章数量仅用于本次证据判断，不作为永久准入保证。
