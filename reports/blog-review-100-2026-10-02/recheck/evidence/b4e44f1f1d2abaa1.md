[ ![统计之都 标志](https://cosx.org/img/logo.png) ](https://cosx.org/)
  * [首页](https://cosx.org/)
  * [关于](https://cosx.org/about/)
  * [论坛](https://d.cosx.org)
  * [R 会](https://china-r.cosx.org)
  * [投稿](https://cosx.org/contribute/)
  * [搜索](https://cosx.org/search/)


统计之都 最近更新于 2024-11-10 1 / 52 
[统计应用](https://cosx.org/categories/%E7%BB%9F%E8%AE%A1%E5%BA%94%E7%94%A8)
# [人工阅读 vs AI 阅读：以《苏东坡传》为例](https://cosx.org/2024/10/reading-man-vs-ai/)
# [人工阅读 vs AI 阅读：以《苏东坡传》为例](https://cosx.org/2024/10/reading-man-vs-ai/)
汪利军  / 2024-10-24
[ ![Thumbnail](https://user-images.githubusercontent.com/13688320/242476681-8dd232b7-896a-40a1-b4fe-40df51cd1f81.png) 去年五月，我在阅读林语堂的《苏东坡传》时，边读边整理了书中主要人物的关系。最后，借助图数据库 Neo4j 将这些人物关系存储在数据库中，并以可视化的方式呈现。完成后，我还写了一篇读书博客，其中展示了这个可视化的人物关系图。当时，怡轩读到这篇博客，邀请我投稿到统计之都。然而由于拖延症发作，一拖就是一年半。 前几天逛 GitHub 时，发现了一个名为 LightRAG 的热门项目，其中的 “RAG” 指的…… ](https://cosx.org/2024/10/reading-man-vs-ai/)
[推荐文章](https://cosx.org/categories/%E6%8E%A8%E8%8D%90%E6%96%87%E7%AB%A0)
# [统计月读（2024 年 10 月）](https://cosx.org/2024/10/monthly/)
2024-10-01
[ ![Thumbnail](https://private-user-images.githubusercontent.com/216398/381882318-7fad61de-a033-4d3a-9264-7561aea3b680.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzEyMzQ3NjEsIm5iZiI6MTczMTIzNDQ2MSwicGF0aCI6Ii8yMTYzOTgvMzgxODgyMzE4LTdmYWQ2MWRlLWEwMzMtNGQzYS05MjY0LTc1NjFhZWEzYjY4MC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQxMTEwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MTExMFQxMDI3NDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT03M2VlNTNmOTk2OTUzYzQyYzM2NDc0Zjc2MTk5NzMxZDZkN2MyZWI0MzIwMjdjMDkzZGMyZWEzYThlNmM0M2I3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.fVAaUspDHaJhm_CmdOxZAe_V1nD9fqpSbLlNTqmMyxA) 推荐语: 还在用静态统计图吗？不妨考虑一下 Plotly，无论是 Python 还是 R 都有易用的方式。在 Python 中可以利用 Plotly-express，快速入手操作，而 R 语言可以直接利用 Plotly 对 ggplot2 的支持，把旧图转换成动态图。 推荐人: 孔令仁 链接: https://plotly.com/python/plotly-express/…… ](https://cosx.org/2024/10/monthly/)
[推荐文章](https://cosx.org/categories/%E6%8E%A8%E8%8D%90%E6%96%87%E7%AB%A0)
# [统计月读（2024 年 8-9 月）](https://cosx.org/2024/10/monthly/)
2024-10-01
[ 推荐语: 推荐一个小工具 jsonlines. python 中 json 包已经可以覆盖大部分场景，但是如果文件很大 / 读写多个同文件不同 json 可以尝试 jsonlines 推荐人: 任焱 链接: https://jsonlines.readthedocs.io/en/latest/ […] 推荐语: 看到一个旅行地图，很有意思的呈现方式（眼前一亮）不妨点开一下感受一下新的记录…… ](https://cosx.org/2024/10/monthly/)
[统计计算](https://cosx.org/categories/%E7%BB%9F%E8%AE%A1%E8%AE%A1%E7%AE%97)
# [挑战最快 SVM！ReHLine 算法诞生记](https://cosx.org/2023/12/rehline-for-fastest-svm/)
# [挑战最快 SVM！ReHLine 算法诞生记](https://cosx.org/2023/12/rehline-for-fastest-svm/)
邱怡轩  / 2023-12-22
[ ![Thumbnail](https://uploads.cosx.org/2023/12/citation.png) 本文由邱怡轩主笔，内容素材源自邱怡轩和戴奔共同讨论的结果。 […] 武林至尊，宝刀屠龙。长久以来，机器学习江湖中一直流传着两件神器——LibSVM 和 Liblinear，它们都是用来求解支持向量机（SVM）问题的，且都是由台湾大学的林智仁教授及其团队开发和维护。两者的不同在于，LibSVM 支持各类基于核函数的 SVM，而 Liblinear 只能计算线性 SVM。但从计算效率上来…… ](https://cosx.org/2023/12/rehline-for-fastest-svm/)
[COS 访谈](https://cosx.org/categories/cos%E8%AE%BF%E8%B0%88)
# [统计之都访谈第 49 期：宾夕法尼亚大学李洪哲老师访谈](https://cosx.org/2023/07/interview-of-hongzhe-li/)
# [统计之都访谈第 49 期：宾夕法尼亚大学李洪哲老师访谈](https://cosx.org/2023/07/interview-of-hongzhe-li/)
2023-07-24
[ ![Thumbnail](https://uploads.cosx.org/2023/07/lihongzhe.jpg) 编辑部按：本文是统计之都访谈第 49 期。随着生物医学领域的发展以及科学技术不断进步，日益丰富的数据为生物统计带来新的机遇及挑战。生物统计内容广博，不仅包括传统医学领域的药物实验设计与临床分析，也涉及目前火热的遗传基因组学数据分析、电子病历、精准医学，以及越来越受重视的公共卫生及环境领域。美国的生物统计经历了几十年的发展已建立成熟的职业体系，多数顶尖大学也都设立了生物统计系，为制药公司、FDA、科研机…… ](https://cosx.org/2023/07/interview-of-hongzhe-li/)
[推荐文章](https://cosx.org/categories/%E6%8E%A8%E8%8D%90%E6%96%87%E7%AB%A0)
# [统计月读（2023 年 5-6 月）](https://cosx.org/2023/07/monthly/)
2023-07-01
[ 推荐语：一些活跃的线上研讨会网站：Online Causal Inference Seminar 是因果推断的研讨会，每周二晚上有研讨会，2020 春季到现在已经举办了几十期报告了，过去的报告都有录屏和 ppt，可以在这里看很多报告。从 Online Causal Inference Seminar 网站友链里又看到了更多线上研讨会，而 The Gary Chamberlain Online Seminar…… ](https://cosx.org/2023/07/monthly/)
[推荐文章](https://cosx.org/categories/%E6%8E%A8%E8%8D%90%E6%96%87%E7%AB%A0)
# [统计月读（2023 年 4 月）](https://cosx.org/2023/05/monthly/)
2023-05-01
[ ![Thumbnail](https://user-images.githubusercontent.com/37477330/234737533-8bd8bc91-2b81-4dc9-bbe0-d4b602bcddb3.png) 推荐语：深度学习，但是 Lasso？具有算法包和对应的原理论文，值得一试 推荐人：孔令仁 链接：https://lassonet.ml/ […] 推荐语：明星基金经理真的有优秀的选股能力吗？基于经典的四因子模型的假设，一个直观的想法是检验基金的 alpha 是否显著大于 0。然鹅，由于 alpha 的分布是非正态的，本文提出运用 bootstrap 方法，在不假设 alpha 的先验参数分布的情况下检…… ](https://cosx.org/2023/05/monthly/)
[推荐文章](https://cosx.org/categories/%E6%8E%A8%E8%8D%90%E6%96%87%E7%AB%A0)
# [统计月读（2023 年 3 月）](https://cosx.org/2023/04/monthly/)
2023-04-01
[ ![Thumbnail](https://camo.githubusercontent.com/3e82abc72100bbaa2241c082f848d307d0a42374924372f0d43e6f9165dc601c/68747470733a2f2f73312e617831782e636f6d2f323032332f30332f30392f70706e633946552e6a7067) 推荐语：想要把 ChatGPT 转化成实在的生产力吗？这个包把 ChatGPT 的一些功能嵌入到 RStudio 内，通过 Add-In 栏的按钮即可使用。这个包本质上是对 ChatGPT 功能的封装，需要自己注册 OpenAI API key，并且要注意代码上传方面的隐私问题。 推荐人：孔令仁 链接：https://github.com/MichelNivard/GPTstudio;…… ](https://cosx.org/2023/04/monthly/)
[r 语言](https://cosx.org/categories/r-%E8%AF%AD%E8%A8%80)
# [畅谈 GhatGPT 在学界的应用](https://cosx.org/2023/03/chatgpt-in-education/)
赵鹏  / 2023-03-22
[ 本文根据作者在 2023 年 2 月 18 日统计之都云讲堂的发言整理修改而成。 […] 最近试用了一下 ChatGPT。正如很多人描绘的那样，这个产品震撼人心。让我最为吃惊的有三点： 第一，不管中文还是英文，它使用的语言特别自然流畅。我原以为它只不过是个升了级的搜索引擎，只是搜出的结果整合得更好而已，但是用起来就发现远非如此。它通过了图灵测试，给出的是以假乱真的人类对话。日常生活…… ](https://cosx.org/2023/03/chatgpt-in-education/)
[推荐文章](https://cosx.org/categories/%E6%8E%A8%E8%8D%90%E6%96%87%E7%AB%A0)
# [Donoho: 数据科学 50 年](https://cosx.org/2023/03/50-years-of-data-science-cn/)
David Donoho  / 2023-03-21
[ 统计之都编辑部按：本文译自 Donoho (2017): 50 Years of Data Science，发表在 Journal of Computational and Graphical Statistics 杂志。在正式发表前数年，其初版就广为流传，引发了学术界深入、持续的讨论。原文以 1962 年 Tukey 的著名文章 The Future of Data Analysis 作为数据科学元…… ](https://cosx.org/2023/03/50-years-of-data-science-cn/)
[推荐文章](https://cosx.org/categories/%E6%8E%A8%E8%8D%90%E6%96%87%E7%AB%A0)
# [统计月读（2023 年 2 月）](https://cosx.org/2023/03/monthly/)
2023-03-01
[ ![Thumbnail](https://camo.githubusercontent.com/78486d094fb22b73c6342454d32d2818521939a2905aa3935ee6a9660f42b122/68747470733a2f2f6b696d6e65777a65616c616e642e6769746875622e696f2f706f73742f63656c65737469616c6d6170735f66696c65732f6669677572652d68746d6c2f73746172253230706c6f742d322e706e67) 推荐语：Gurobi 是由美国 Gurobi Optimization 公司开发新一代大规模优化器，能够处理很多优化问题，充分利用多核处理器优势，且支持并行计算。这篇博客提供了如何在 R 和 python 中使用 Gurobi 的指南。 推荐人：任怡萌 链…… ](https://cosx.org/2023/03/monthly/)
[统计图形](https://cosx.org/categories/%E7%BB%9F%E8%AE%A1%E5%9B%BE%E5%BD%A2)
# [地震越来越频繁了吗？](https://cosx.org/2023/02/earthquake/)
黄湘云  / 2023-02-24
[ ![Thumbnail](https://cosx.org/2023/02/earthquake/index_files/figure-html/cenc-beeswarm-1.png) 本文基于美国地震局和中国地震台网发布的地震活动数据，借助丰富的统计图形从对比、趋势、分布、关系、时间和空间等方面探索分析地震活动的规律。 ](https://cosx.org/2023/02/earthquake/)
  * ««
  * «
  * 1
  * [2](https://cosx.org/page/2/)
  * [3](https://cosx.org/page/3/)
  * [4](https://cosx.org/page/4/)
  * [5](https://cosx.org/page/5/)
  * [»](https://cosx.org/page/2/)
  * [»»](https://cosx.org/page/52/)


  * [关于](https://cosx.org/about/)
  * [论坛](https://d.cosx.org)
  * [文章](https://cosx.org/archives/)
  * [会议](https://cosx.org/chinar/)
  * [出版](https://cosx.org/books/)
  * [成员](https://cosx.org/members/)
  * [捐赠](https://cosx.org/donate/)
  * [搜索](https://cosx.org/search/)


© [统计之都](https://cosx.org) 2006 - 2022 | [新浪微博](http://weibo.com/cosname) | [Github](https://github.com/cosname) | [Bilibili](https://space.bilibili.com/22035559) | [知乎](https://www.zhihu.com/people/CapStat) ｜ [RSS](https://cosx.org/index.xml)
