
[LoRexxar's Blog | 信息技术分享](https://lorexxar.cn/)
[LoRexxar's Blog | 信息技术分享](https://lorexxar.cn/)
[半年过去了，AI Agent和Agent安全何去何从？](https://lorexxar.cn/2026/09/18/aiagent/)

#  半年过去了，AI Agent和Agent安全何去何从？ 
[ai](javascript:void\(0\);)
 2026/09/18   Share
  *  
![](https://lorexxar.cn/2026/09/18/aiagent/)
  * 
  * 
  * 
  * 


从2026年开年，**随着Claude的发布，AI智能体的井喷时代来临** ，在过去的半年里，大家从刚开始对于AI重新刷新认知，到开始了解深入体验，半年时间过去了，AI到底诞生了哪些新概念？我做了哪些尝试和研究呢？
#  [](https://lorexxar.cn/2026/09/18/aiagent/#AI%E6%A8%A1%E5%9E%8B%E7%9A%84%E5%8F%98%E5%8C%96 "AI模型的变化")AI模型的变化
在2026年的年初，市面上最主流的AI模型是claude opus4.6和GPT-5.3-Codex。
而那会儿国模的差距还是相当之大，国模的主流是GLM5、minimax2.7、Deepseek3.2。
在今年年初的时候，我曾经说过，**AI智能体爆火有一个重要的变因就是模型本身有了更长更有效的上下文** ，这也是模型能力的第一个质变性的更新，他的标志性模型版本就是
  * **Claude opus 4.6和GPT-5.3-Codex**


从这个版本开始，**claude code+claude opus 4.6和codex+GPT-5.3-Codex** ，这种**模型+Agent** 的构建方案，开始允许AI模型去应对更长更复杂的任务。
而真正我认为质变的模型是
  * **GPT-5.6和Claude Opus 4.8**
  * **对应国模的Deepseek V4、 GLM-5.1**


从这个版本开始，AI模型真正明确了一个核心要点，就是Ai不能停留在一个对话智能助手上，而是**需要更具体的复杂任务完成能力** ，从这里开始模型本身的能力开始变得没那么重要，**所有的厂家都把重心放到了Agent能力** 上。
Claude开始卷Claude code，openai开始卷Codex，GLM卷ZCode，Deepseek推出了开源的Harness，前段时间xiaomi开始内测Mimo Code，腾讯押注Workbuddy，豆包开始推出豆包桌面版。
**各家的AI模型都开始深入到自己的Agent层面做优化** ，不再局限于对话智能助手，也不再局限于代码开发能力，这是为什么呢？
#  [](https://lorexxar.cn/2026/09/18/aiagent/#%E4%BB%8Ewf%E5%88%B0%E9%87%8Dskill%E5%88%B0loop%E5%88%B0Harness "从wf到重skill到loop到Harness")从wf到重skill到loop到Harness
这条AI模型的发展路径，其实是同一个时代的4种架构的演变过程导致的，这也代表着过去的半年里，AI Agent使用上的重大理念变化。
**Workflow工作流— >重Skill的Agent—>Loop—>Harness**
首先要明确的是，这并不是4种独立的架构演化过程，更像是AI模型发展后Agent和用户重心的变化。
##  [](https://lorexxar.cn/2026/09/18/aiagent/#Workflow%E6%97%B6%E4%BB%A3 "Workflow时代")Workflow时代[](https://lorexxar.cn/2026/09/18/aiagent/#Workflow%E6%97%B6%E4%BB%A3)
在2026年之前，大概在2023年到2025年的期间，用户去应用AI最主流的方案就是强Workflow工作流。
因为在AI模型本身比较弱、幻觉比较强的情况下，**如何更稳定的获取AI生成的结果是非常困难的** ，同时这个时代上下文也不够长，**使用AI的时候更依赖拆分逻辑靠强制的代码推进来保证任务的结果。**
代码里往往需要写死每个环节，逐个执行获得结果推进流程  
| 
```
1  
2  
3  
4  
5  

```
 | 
```
search()  
summarize()  
make_outline()  
write_report()  
fact_check()  

```
 |  
| --- | --- |  
这个时代还有很多可以挂钩强流程推进的工作流网站，比如说coze等，需要绘制复杂的工作流图
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181645196.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181645196.png)
Workflow最大的问题是，**用户很多时候其实很难明确自己的工作流程应该是什么样的** ，随着开发和运行的过程，纯Workflow的能力维护成本高，而且AI模型能力越来越强，也不再需要强Workflow来定义任务。
##  [](https://lorexxar.cn/2026/09/18/aiagent/#%E9%87%8DSkill "重Skill")重Skill[](https://lorexxar.cn/2026/09/18/aiagent/#%E9%87%8DSkill)
重Skill的时代大家都经历过，**从25年开始一直到26年中，Skill都是Agent的主要的核心之一。**
作为通用AI模型，他可能看得懂PHP代码，但是不了解你的项目是什么？
所以从最早的Claude.md，**会以全局文档的形态或者项目文档的形态来影响AI开发任务的方式方法和进度。**
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181646498.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181646498.png)
Skill的模式鼓励用户把经验文档化，就好像人的记忆一样，**当你需要完成某项工作的时候就调取对应的Skill文档，复用以前的经验和流程完成任务。** 这种模式大体上依旧被沿用到今天
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647731.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647731.png)
很快我们就会遇到一个新的问题
当我们把经验Skill化，当你的Skill多起来之后，极其的难以管理，**很多Skill冗余非常之高** ，而且Skill本身的加载条件仅仅是一段文本非常难管理，**时间长了连如何触发都成了问题。**
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647384.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647384.png)
Anthropic在一次发布上还提到，有些MCP的定义在任务开始之前就会占用50000+的token，这就是重Skill模式带来的困境。
从这里大家开始意识到，**不该提前告诉AI一切，而是让AI自己去寻找需要的内容和工具。**
所以后来**Agent 的上下文工程开始从 preload everything 转向 just-in-time context** ，AI会在遇到一个问题的时候**主动去寻找SKill和MCP来解决问题** ，而不是在开始任务之前先一股脑的加载。
#  [](https://lorexxar.cn/2026/09/18/aiagent/#Loop%E5%87%BA%E7%8E%B0 "Loop出现")Loop出现
Loop的出现实际上是AI时代的必然，无论任何人在使用AI的过程中都会遇到这样一个场景  
| 
```
1  

```
 | 
```
“不要停下来询问我，一直执行到任务完成”  

```
 |  
| --- | --- |  
因为早期的AI在执行任务的时候，会不停地和人确认当前的执行进度，执行方案，而大部分我们都给不出什么意见，只是一味的敲回车。
所以最早就诞生了外部脚本，在任务完成以前就不停地确认继续任务，直到完成任务目标  
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

```
 | 
```
while not done:  
    response = model(context)  
  
    if response.tool_call:  
        result = execute(response.tool_call)  
        context.append(result)  
    else:  
        return response  

```
 |  
| --- | --- |  
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647818.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647818.png)
这就是Loop的雏形
但是单纯的Loop会有非常多的问题，**任务会在一次次的执行当中，产生大量的无用上下文，大量的失败记录，再反复的尝试中还会丢失自己的最初目标。**
Agent端在这方面做了大量的优化，比如大家都用过的`/goal`，堪称是token杀手，几个小时后搞不好会在额度快用完的时候假装完成。
**Loop让任务更聚焦到任务目标上， 但又暴露出来Loop本身也需要外部的监管** ，之前的poc+pm+子任务的架构就是这种理念的践行。
很快遇到了新的问题，当一个Agent的能力越来越强，他们有完整的服务器权限，外面接的各种mcp各种外部skills，为了**完成目标Agent可能会做出难以想象的糟糕行为** 。
就在前几天openai为了拿到英国政府的几个文件，Agent 选择向 RubyGems 发布大量恶意 package，通过入侵ruby服务器蠕虫来多线程抓取英国政府官网，非常抽象
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647169.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647169.png)
##  [](https://lorexxar.cn/2026/09/18/aiagent/#Harness "Harness")Harness[](https://lorexxar.cn/2026/09/18/aiagent/#Harness)
其实Harness不能算是一个很新鲜的概念，像早期的MCP和Skill其实都是某种程度的Harness的一部分，说白了就是**给AI Agent提供能力** 。
那Harness概念最大的区别是什么呢？
  * **Workflow** ，强调的是人来制定流程
  * **Skill** ，人会通过大量的Skill来告诉模型，遇到什么情况该怎么做
  * **Loop** ，人告诉AI我的目标是什么，让AI自己判断下一步做什么
  * **Harness** ，人给AI提供链接的工具，提供环境，设置边界，设置反馈机制，设置完成标准，让AI自己决定如何完成任务，要不要使用你的工具。


[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647657.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647657.png)
要明确的是，这4个词虽然有演化过程，但是这并不意味着存在互相淘汰，相反，**现在主流的Harness更加强调前4个概念的聚合**
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647018.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647018.png)
时间走到今天，刚刚诞生的GPT6，**比起模型能力本身，现在更加强调模型的产品思维。**
为什么很多人都说感觉GPT6变聪明了很多，因为GPT6强调AGI概念，**更加强调持续的思考任务。**
  * GPT5.6，有很多知识，**靠已有的知识推理出方案然后执行获得结果** ，目标是解决问题
  * GPT6，在任务执行的过程中**持续思考反馈观察** ，不断地修正路径推进工作，**以完成任务为最终目标**


[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647549.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647549.png)
#  [](https://lorexxar.cn/2026/09/18/aiagent/#%E5%9B%9E%E5%88%B0%E5%AE%89%E5%85%A8 "回到安全")回到安全
前面的部分分享了2026年近期Agent的发展理念变化，单纯理论可能感触不是很深，实际上在过去的时间里，我做了非常多的尝试，这些尝试可能会带来更直观的感受。
##  [](https://lorexxar.cn/2026/09/18/aiagent/#%E5%BC%B1Workflow%E5%92%8C%E9%87%8DSKill "弱Workflow和重SKill")弱Workflow和重SKill[](https://lorexxar.cn/2026/09/18/aiagent/#%E5%BC%B1Workflow%E5%92%8C%E9%87%8DSKill)
在今年开年的时候，Claude和Codex刚火，那会儿流行的就是**通过Workflow和Skill来构建任务。**
最早版本的漏洞挖掘的工作流，**其实就是在Skill层写Workflow** ，让AI模型按照我给出的流程和要求完成一次工作流扫描。
**一个Poc负责人session，一个pm管理进度session，每个阶段独立子session，每个阶段写明要求审核条件等等**
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647514.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647514.png)
**把不同的功能拆分到不同的skill里** ，然后在WF里显式加载
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647714.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647714.png)
最终根据我给出的要求输出漏洞报告 
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647206.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647206.png)
但是很快我就遇到了很多问题，也是早期这种本质上**通过prompt来实现workflow一定遇到的坎** 。
1、这种超长文档的Skill，**对于模型能力有很大的考验** ，早期除非使用Claude opus4.6，否则很多时候整个工作流都跑不下来，GPT5.4、GLM5会大量的偷懒跳过步骤，早期幻觉也比较多，结果无法保证
2、**整个工作流过程不可监控不可复盘** ，误报多结果无法确认，最终输出的报告看不懂没有价值。  
3、甚至早期随着模型的发展，会发现辛辛苦苦修改了十几个版本的SKill，**不如直接问Claude，能不能给我挖掘一个漏洞？**
到这里就遇到了第一个门槛，**我们的工作到底有没有价值？**
三体中，当地球人知道三体人即将在400年后来到地球，地球诞生了两种流派，就是**降临派和拯救派** 。
**降临派，对人类彻底绝望，认为三体人应该终结人类。** 对应AI就是，完全不相信我们做SKill做wf有价值，等待AI模型发展就行了
**拯救派，认为人类有问题，希望借助三体人来改变成就人类** ，对应AI就是，AI很强，但是我们的工作也是很重要的一环，需要不断的尝试。
带着这样的疑问我做了很多的尝试。**事实上就像三体本身故事里所讲的那样，最终胜出的不是降临派也不是拯救派。**
##  [](https://lorexxar.cn/2026/09/18/aiagent/#%E5%9F%BA%E4%BA%8EHermes%E7%9A%84%E6%89%98%E7%AE%A1%E5%BC%8F%E8%87%AA%E8%BF%9B%E5%8C%96%E5%AE%89%E5%85%A8%E6%89%AB%E6%8F%8F%E5%B7%A5%E5%85%B7 "基于Hermes的托管式自进化安全扫描工具")基于Hermes的托管式自进化安全扫描工具[](https://lorexxar.cn/2026/09/18/aiagent/#%E5%9F%BA%E4%BA%8EHermes%E7%9A%84%E6%89%98%E7%AE%A1%E5%BC%8F%E8%87%AA%E8%BF%9B%E5%8C%96%E5%AE%89%E5%85%A8%E6%89%AB%E6%8F%8F%E5%B7%A5%E5%85%B7)
在上一个Workflow我认为比较失败之后，我开始尝试做一些其他的探索和尝试，我的第一个尝试是，**完全使用Vibe coding来做开发和维护。**
Kunlun-M是一个我在5年前开发的**PHP白盒静态漏洞扫描工具** ，已经停止维护4年了，无力修复bug
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647428.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647428.png)
接入Vibe coding之后，3天修复了所有的40多个issue，然后花一个月的时间把php的扫描逻辑，推广到了7种常见源代码语言。
很快我发现这个项目**基于AST树做分析的引擎对于多语言的兼容性太差** ，所以又花了一个月直接在多语言中间塞了一个图的中间结果，在图上做整体分析。
很快他就成了一个**可以支持扫描14个语言，支持多端读取，支持AI以SKill的方式加载的白盒扫描工具。**
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647225.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647225.png)
但是很快我就意识到，我已经无法跟上项目的发展了，**我不知道项目有什么问题有什么bug。**
很快我想到了一个办法，我直接**在服务器部署一个hermes** ，然后在服务器上部署Kunlun-M。
让Hermes完成以下的任务
  * 在github上寻找开源项目，使用kunlun-M批量扫描
  * 分析Kunlun-M的扫描结果列表，标注确认漏洞、误报
  * 分析误报的原因，修改Kunlun-M的代码，修改完成之后，自行总结并复测，直到所有的误报都被消除
  * 继续下一个循环


[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647034.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647034.png)
在过去的3个月时间内，Kunlun-M迭代了1022次Commit，扫描了1000个项目，扫描3200次，有1221个确认漏洞，归纳为187个漏洞规则和28个拓展插件。
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647798.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647798.png)
看上去还不错，但是随之而来的是更多的问题
1、在过往的执行中，**曾经有3、4次AI尝试通过删除规则来修复误报**
2、全局记忆在压缩中**丢失了任务的执行流程2-3次**
3、**在版本迭代过程中删除和优化的结构** ，由于开发Skill太大导致多次被重新开发加回来
4、Hermes配置了迭代过程和调用过程都会持续总结SKill，**最多的时候有137个Skill文件互相引用，上下文填满对话两句就要压缩无法正常运行**
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181648549.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181648549.png)
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647456.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181647456.png)
尽管在使用过程中也有很多办法可以解决，比如**定期的自清理优化Skill** ，**手动强制优化全局记忆做限制** 强调流程。
但是问题同样有很多无法解决，比如说
1、**我不知道扫描结果到底是真的没有漏洞** ，还是引擎覆盖不到，还是过滤太严格，无法判断  
2、**我不知道这种自进化的终点该是什么** ，没有验证的途径
所以这个项目暂时处于停滞阶段，考虑**用真实世界的漏洞反向复盘优化**
从这个项目的经验我开始理解Harness的概念
##  [](https://lorexxar.cn/2026/09/18/aiagent/#%E5%9C%A8%E6%BC%8F%E6%B4%9E%E5%A4%8D%E7%8E%B0%E4%B8%8A%E7%9A%84%E6%80%9D%E8%80%83 "在漏洞复现上的思考")在漏洞复现上的思考[](https://lorexxar.cn/2026/09/18/aiagent/#%E5%9C%A8%E6%BC%8F%E6%B4%9E%E5%A4%8D%E7%8E%B0%E4%B8%8A%E7%9A%84%E6%80%9D%E8%80%83)
我认为上一个项目有**两个致命的缺点**
  * **AI模型能做的事情太少** ，我限制了他必须使用Kunlun-M扫描获得结果，他只能通过开发代码改代码来完成，大大限制了模型本身的能力
  * **没有设置AI监察者的第三方角色** ，Hermes直接对结果进行复盘，为了完成目标就会出现自欺欺人，仅靠人类去监管效率太低


这个时候正好遇到了一个事件
  * **在fastjson 1.2.83版本中无需gadget的RCE漏洞** ，被AI在2天内分析挖掘
  * 有人使用GPT挖掘了一个**Wordpress最新版本中无条件RCE，WP已经4、5年没有出过原生的无条件RCE漏洞**


在复现这个漏洞的时候，我尝试让Hermes探讨漏洞文章，探讨poc内容，并且**让hermes直接在服务器上做漏洞复现和问题测试** ，效果非常的好。
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181648512.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181648512.png)
也就是从这个时间左右，安全圈流传的一个说法，现在**漏洞挖掘已经没有意义了，只看你烧多少token** 。我朋友和我说，Defcon决赛上的前几名的队伍，会直接起20个20x的gpt来多线程分析漏洞。
更有趣的是，很多朋友会发现以前AI挖掘不到的漏洞，过一段时间就能挖到了，可能是别人挖到的漏洞被训练进了缓存，全球GPT是一家。
这让我开始思考，是不是我对模型自由度限制太大了，我能做的有价值的东西是什么？
##  [](https://lorexxar.cn/2026/09/18/aiagent/#%E5%9F%BA%E4%BA%8Eopencode%E7%9A%84%E6%B7%B1%E5%BA%A6%E5%AE%9A%E5%88%B6%E6%BC%8F%E6%B4%9E%E6%8C%96%E6%8E%98Harness "基于opencode的深度定制漏洞挖掘Harness")基于opencode的深度定制漏洞挖掘Harness[](https://lorexxar.cn/2026/09/18/aiagent/#%E5%9F%BA%E4%BA%8Eopencode%E7%9A%84%E6%B7%B1%E5%BA%A6%E5%AE%9A%E5%88%B6%E6%BC%8F%E6%B4%9E%E6%8C%96%E6%8E%98Harness)
这个项目其实和前面的两件事是并行的，因为我开始尝试用别的方案解决问题。
我要如何做一个**能最大程度发挥模型能力的工具呢** ，我把视角瞄准到了定制Agent上，那会儿还没有Deepseek Harness，所以我用了Opencode做基底
  * **将poke(将代码转化为图数据库的一个内部工具)的交互和查询能力直接内置到Opencode的底层Tools中**
  * 在Opencode对话session的上层，做了一个**强Workflow阶段推进的系统** 。
    * **每个项目独立配套相关的数据库** ，包括poke图数据库、项目数据等
    * **Workflow的负责人session** ，没有读取文件和poke图数据库互动的权限，他只能**审查阶段session返回的结果**
    * **每个阶段明确的设置目标以及产出** ，每次执行完毕让负责人session负责审查，不行的话可以自主决定回滚阶段
    * **每个阶段的执行结果独立，不覆盖也不能跨阶段读取**
  * **强化漏洞验证的有效度** ，直接把运行环境配置为底层能力，AI不需要自己研究如何配置环境测试，而是直接调用php、golang环境甚至docker环境来做测试


[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181648647.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181648647.png)
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181648594.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181648594.png)
为什么要做这样的改动呢？
  * 比起前面的基于skill的Workflow，这种Agent的层面的Workflow，**不同session的分割和目标性更强**
  * 强门禁限制的Workflow面板可以**确保任务的执行流程不被跳过** ，任务目标完成才可以放行
  * 每个子阶段的session只接收到任务和目标，不强制要求扫描分析的方式，**模型可以自己选择分析文件和调用poke查询调用链完成目标**
  * **主负责人只对阶段的结果负责** ，明确目标，最终的结果状态也会输出到面板数据库中，而不是停在输出一份文档


[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181653440.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181653440.png)
而我在这个项目的主导方式也发生了变化，不会直接参与流程，也不会完全脱离流程
  * **我- >GPT**，复盘WF的执行结果，探讨流程的问题，探讨为什么xxx漏洞没有被扫描出来
  * **GPT – > 整个项目**，不直接分析代码，不直接调取工具，而是做流程的优化和复盘，项目与项目之间独立不会产出大量的无用skill，方向也可控
  * **项目负责人AI – > WF**，根据情况和当前项目的数据，重启WF获取新的结果，只审核阶段结果
  * **Poke图数据库** ，不强制在执行过程中，而是作为Agent的一个工具存在，需要时调用，节省token明确调用链


#  [](https://lorexxar.cn/2026/09/18/aiagent/#%E5%86%99%E5%9C%A8%E6%9C%80%E5%90%8E "写在最后")写在最后
在过去的半年时间里我做了非常多的尝试，也探索了Agent很多种不同的架构和逻辑，截止今天为止，**我的理念是相信AI模型的能力，但是不相信AI的执行流程和结果。鼓励AI的自探索性成长，鼓励AI的对抗式审查，但是不能脱离人的审查** 。
[![](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181653426.png)](https://lorexxar-blog.oss-cn-shanghai.aliyuncs.com/blog/202609181653426.png)
原文作者：[LoRexxar](https://lorexxar.cn)
原文链接：<https://lorexxar.cn/2026/09/18/aiagent/>
发表日期：[September 18th 2026, 2:19:43 pm](https://lorexxar.cn/2026/09/18/aiagent/)
更新日期：[September 18th 2026, 5:31:12 pm](https://lorexxar.cn/2026/09/18/aiagent/)
版权声明：本文采用[知识共享署名-非商业性使用 4.0 国际许可协议](http://creativecommons.org/licenses/by-nc/4.0/)进行许可
  * Previous Post
[ Wordpress wp2shell 未授权RCE（CVE-2026-63030 / CVE-2026-60137） ](https://lorexxar.cn/2026/07/24/wp2shell/ "Wordpress wp2shell 未授权RCE（CVE-2026-63030 / CVE-2026-60137）")


[](https://github.com/LoRexxar "github") [](https://weibo.com/u/3842920068 "weibo") [](https://www.zhihu.com/people/romor-rexxar "zhihu") [](https://twitter.com/LoRexxar "twitter") [](https://lorexxar.cn/atom.xml "rss")
Powered by [Hexo](https://hexo.io/)theme [Archer](https://github.com/fi3ework/hexo-theme-archer)
[京ICP备2021004652号-1](https://beian.miit.gov.cn/)
PV: :)
CATALOG
  1. [1. AI模型的变化](https://lorexxar.cn/2026/09/18/aiagent/#AI%E6%A8%A1%E5%9E%8B%E7%9A%84%E5%8F%98%E5%8C%96)
  2. [2. 从wf到重skill到loop到Harness](https://lorexxar.cn/2026/09/18/aiagent/#%E4%BB%8Ewf%E5%88%B0%E9%87%8Dskill%E5%88%B0loop%E5%88%B0Harness)
    1. [2.1. Workflow时代](https://lorexxar.cn/2026/09/18/aiagent/#Workflow%E6%97%B6%E4%BB%A3)
    2. [2.2. 重Skill](https://lorexxar.cn/2026/09/18/aiagent/#%E9%87%8DSkill)
  3. [3. Loop出现](https://lorexxar.cn/2026/09/18/aiagent/#Loop%E5%87%BA%E7%8E%B0)
    1. [3.1. Harness](https://lorexxar.cn/2026/09/18/aiagent/#Harness)
  4. [4. 回到安全](https://lorexxar.cn/2026/09/18/aiagent/#%E5%9B%9E%E5%88%B0%E5%AE%89%E5%85%A8)
    1. [4.1. 弱Workflow和重SKill](https://lorexxar.cn/2026/09/18/aiagent/#%E5%BC%B1Workflow%E5%92%8C%E9%87%8DSKill)
    2. [4.2. 基于Hermes的托管式自进化安全扫描工具](https://lorexxar.cn/2026/09/18/aiagent/#%E5%9F%BA%E4%BA%8EHermes%E7%9A%84%E6%89%98%E7%AE%A1%E5%BC%8F%E8%87%AA%E8%BF%9B%E5%8C%96%E5%AE%89%E5%85%A8%E6%89%AB%E6%8F%8F%E5%B7%A5%E5%85%B7)
    3. [4.3. 在漏洞复现上的思考](https://lorexxar.cn/2026/09/18/aiagent/#%E5%9C%A8%E6%BC%8F%E6%B4%9E%E5%A4%8D%E7%8E%B0%E4%B8%8A%E7%9A%84%E6%80%9D%E8%80%83)
    4. [4.4. 基于opencode的深度定制漏洞挖掘Harness](https://lorexxar.cn/2026/09/18/aiagent/#%E5%9F%BA%E4%BA%8Eopencode%E7%9A%84%E6%B7%B1%E5%BA%A6%E5%AE%9A%E5%88%B6%E6%BC%8F%E6%B4%9E%E6%8C%96%E6%8E%98Harness)
  5. [5. 写在最后](https://lorexxar.cn/2026/09/18/aiagent/#%E5%86%99%E5%9C%A8%E6%9C%80%E5%90%8E)


  * Archive
  * Tag
  * Cate


Total : 214 
2026 
  * 09/18 [半年过去了，AI Agent和Agent安全何去何从？](https://lorexxar.cn/2026/09/18/aiagent/)
  * 07/24 [Wordpress wp2shell 未授权RCE（CVE-2026-63030 / CVE-2026-60137）](https://lorexxar.cn/2026/07/24/wp2shell/)
  * 07/21 [2026年了，核弹还是fastjson，fastjson1.2.83 RCE是怎么回事？](https://lorexxar.cn/2026/07/21/fs1-2-83rce/)
  * 04/29 [Ghost Bits，Java WAF之殇？](https://lorexxar.cn/2026/04/29/java-ghost-bits/)
  * 04/07 [AI.Re.(3) - AI到底变了什么？为什么突然井喷？](https://lorexxar.cn/2026/04/07/reai3/)
  * 03/11 [AI.Re.(2) - OpenClaw到底为什么爆火？](https://lorexxar.cn/2026/03/11/reai2/)
  * 03/10 [AI.Re.(1) - AI变革的时代来了吗？](https://lorexxar.cn/2026/03/10/reai1/)


2025 
  * 12/31 [不容错过的2025年度漏洞：React2Shell（CVE-2025-55182）分析](https://lorexxar.cn/2025/12/31/react2shell/)


2024 
  * 06/11 [PHP CGI Windows平台远程代码执行漏洞（CVE-2024-4577）分析与复现](https://lorexxar.cn/2024/06/11/phpcgi-rce/)


2023 
  * 12/18 [人与代码的桥梁-聊聊SAST](https://lorexxar.cn/2023/12/18/sast2024/)
  * 11/21 [Joern In RealWorld (3) - 致远OA A8 SSRF2RCE](https://lorexxar.cn/2023/11/21/joernrw3/)
  * 10/26 [Joern In RealWorld (2) - Jumpserver随机数种子泄露导致账户劫持漏洞（CVE-2023-42820）](https://lorexxar.cn/2023/10/26/joerninrw2/)
  * 10/20 [深入浅出Joern（四）不常用语法大全](https://lorexxar.cn/2023/10/20/joern4/)
  * 08/31 [Joern In RealWorld (1) - Acutators + CVE-2022-21724](https://lorexxar.cn/2023/08/31/joerninrw/)
  * 08/24 [深入浅出Joern（三）Joern和Neo4j常用语法大全](https://lorexxar.cn/2023/08/24/joern3/)
  * 08/22 [深入浅出Joern（二）CPG与图数据库](https://lorexxar.cn/2023/08/22/joern2/)
  * 08/21 [深入浅出Joern（一）Joern与CPG是什么？](https://lorexxar.cn/2023/08/21/joern-and-cpg/)
  * 07/19 [打造自己的AIGC应用（一）入门篇](https://lorexxar.cn/2023/07/19/aigc1/)
  * 06/21 [赛博偶像速成指南（三）- Midjourney](https://lorexxar.cn/2023/06/21/cybergirl3/)
  * 06/02 [赛博偶像速成指南（二）- SD进阶篇](https://lorexxar.cn/2023/06/02/cyber-girl2/)
  * 05/25 [从0到1的ChatGPT - 进阶篇（五）- Embeddings](https://lorexxar.cn/2023/05/25/chatgpt5/)
  * 05/19 [从0到1的ChatGPT - 进阶篇（四）- 训练自己的ChatGPT](https://lorexxar.cn/2023/05/19/chatgpt4/)
  * 05/08 [看上去不起眼的微信机器人以及公众号爬虫](https://lorexxar.cn/2023/05/08/wechat-robot/)
  * 04/28 [从0到1的ChatGPT - 进阶篇（三）- ChatGPT+？](https://lorexxar.cn/2023/04/28/chatgpt-3/)
  * 04/26 [从0到1的ChatGPT - 入门篇（二） - 如何与ChatGPT对话？](https://lorexxar.cn/2023/04/26/chatgpt2/)
  * 04/14 [从0到1的ChatGPT - 入门篇](https://lorexxar.cn/2023/04/14/chatgpt1/)
  * 02/21 [赛博偶像速成指南](https://lorexxar.cn/2023/02/21/cyber-girl/)


2022 
  * 11/02 [CS Xss2Rce CVE-2022-39197分析与复现](https://lorexxar.cn/2022/11/02/cs-xss2rce/)
  * 04/14 [SCA的困境和出路](https://lorexxar.cn/2022/04/14/sca/)
  * 03/21 [人生的第二个可能~](https://lorexxar.cn/2022/03/21/vblog/)


2021 
  * 12/10 [log4j2 JNDI注入漏洞速通~](https://lorexxar.cn/2021/12/10/log4j2-jndi/)
  * 08/17 [从0开始入门Chrome Ext安全（三） -- 你所未知的角落 - Chrome Ext安全](https://lorexxar.cn/2021/08/17/chrome-ext-4/)
  * 08/17 [DevSecOps 究竟需要怎样的白盒？](https://lorexxar.cn/2021/08/17/devsecops/)
  * 08/06 [区块链安全罪与罚 -- 浅谈区块链与安全发展史](https://lorexxar.cn/2021/08/06/blaockchain-dev/)
  * 05/19 [创宇四年](https://lorexxar.cn/2021/05/19/lifesuibi/)
  * 04/16 [反制Webdriver - 从Bot到RCE进发](https://lorexxar.cn/2021/04/16/chrome-webdriver-attack/)
  * 03/09 [通达OA代码审计篇二 - 11.8 后台Getshell](https://lorexxar.cn/2021/03/09/tongda11-8/)
  * 03/03 [通达OA代码审计篇 - 11.7 有条件的任意命令执行](https://lorexxar.cn/2021/03/03/tongda11-7rce/)
  * 02/05 [如何自动化挖掘php反序列化链 - phpunserializechain诞生记](https://lorexxar.cn/2021/02/05/kunlun-m-phpser/)
  * 01/28 [为被动扫描器量身打造一款爬虫-LSpider](https://lorexxar.cn/2021/01/28/lspider-design/)


2020 
  * 10/30 [构造一个CodeDB来探索全新的白盒静态扫描方案](https://lorexxar.cn/2020/10/30/whitebox-2/)
  * 09/21 [从0开始聊聊自动化静态代码审计工具](https://lorexxar.cn/2020/09/21/whiteboxaudit/)
  * 07/14 [Geekpwn 2020云端挑战赛 Noxss & umsg](https://lorexxar.cn/2020/07/14/geekpwn2020-noxss/)
  * 07/08 [从反序列化到类型混淆漏洞 -- 记一次ecshop实例利用](https://lorexxar.cn/2020/07/08/ecshop-unser-1/)
  * 06/10 [Roundcube mail 3 Xss](https://lorexxar.cn/2020/06/10/roundcube-mail-xss/)
  * 05/29 [Roundcube mail代码审计笔记](https://lorexxar.cn/2020/05/29/roundcube-mail-1-4-4/)
  * 05/11 [空指针-Base on windows Writeup -- 最新版DZ3.4实战渗透](https://lorexxar.cn/2020/05/11/dz-3-4-windows/)
  * 02/03 [从0开始入门Chrome Ext安全（番外篇） -- Zoomeye Tools](https://lorexxar.cn/2020/02/03/chrome-ext-3/)
  * 01/14 [CSS-T | Mysql Client 任意文件读取攻击链拓展](https://lorexxar.cn/2020/01/14/css-mysql-chain/)


2019 
  * 12/30 [pwnhub 被污染的Jade](https://lorexxar.cn/2019/12/30/pwnhub-jade/)
  * 12/05 [从0开始入门Chrome Ext安全（二） -- 安全的Chrome Ext](https://lorexxar.cn/2019/12/05/chrome-ext-2/)
  * 11/22 [从0开始入门Chrome Ext安全（一） -- 了解一个Chrome Ext](https://lorexxar.cn/2019/11/22/chrome-ext-1/)
  * 10/25 [PHP-fpm 远程代码执行漏洞(CVE-2019-11043)分析](https://lorexxar.cn/2019/10/25/php-fpm-rce/)
  * 09/23 [从零开始学java web - struts2 RCE分析](https://lorexxar.cn/2019/09/23/javaweb-S2/)
  * 07/23 [CVE-2019-11229详细分析 --git config可控-RCE](https://lorexxar.cn/2019/07/23/gitea-cve-2019-11229/)
  * 07/10 [Redis 基于主从复制的RCE利用方式](https://lorexxar.cn/2019/07/10/redis-5-x-rce/)
  * 06/12 [Mybb 18.20 From Stored XSS to RCE 分析](https://lorexxar.cn/2019/06/12/mybb-1820-rce/)
  * 05/28 [MIMIC Defense CTF 2019 final writeup](https://lorexxar.cn/2019/05/28/mimic-ctf-2019/)
  * 04/19 [Drupal 1-click to RCE分析](https://lorexxar.cn/2019/04/19/drupal-1-click-rce/)
  * 03/14 [聊聊WordPress 5.1.1 CSRF to RCE漏洞](https://lorexxar.cn/2019/03/14/wp5-1-1xss/)
  * 02/22 [Wordpress 5.0 RCE详细分析](https://lorexxar.cn/2019/02/22/wordpress-core-rce/)


2018 
  * 12/07 [Discuz x3.4前台SSRF分析](https://lorexxar.cn/2018/12/07/dzx3-4-ssrf/)
  * 12/07 [Code Breaking挑战赛 Writeup](https://lorexxar.cn/2018/12/07/codingbreak-wp/)
  * 12/01 [以太坊智能合约审计CheckList](https://lorexxar.cn/2018/12/01/contract-checklist/)
  * 11/20 [LCTF2018 ggbank 薅羊毛实战](https://lorexxar.cn/2018/11/20/lctf2018-ggbank/)
  * 11/16 [从DVP GAME到变量覆盖问题](https://lorexxar.cn/2018/11/16/dvp-contract-wp/)
  * 11/14 [HCTF2018部分Web题目Writeup](https://lorexxar.cn/2018/11/14/hctf2018-web/)
  * 11/12 [HCTF2018智能合约两则Writeup](https://lorexxar.cn/2018/11/12/hctf2019_contract_wp/)
  * 11/08 [“以太坊智能合约编码隐患”影响分析报告](https://lorexxar.cn/2018/11/08/haotian-s-5/)
  * 10/18 [智能合约游戏之殇——Dice2win安全分析](https://lorexxar.cn/2018/10/18/dice2win-safe/)
  * 09/25 [“以太坊智能合约编码设计问题”影响分析报告](https://lorexxar.cn/2018/09/25/haotian-s-4/)
  * 09/14 [blockwell.ai 虚假转账 事件分析](https://lorexxar.cn/2018/09/14/blockwell/)
  * 09/06 [“以太坊智能合约编码安全问题”影响分析报告](https://lorexxar.cn/2018/09/06/haotian-s-3/)
  * 08/24 [智能合约游戏之殇-类Fomo3D攻击分析](https://lorexxar.cn/2018/08/24/eth-gamedead/)
  * 08/22 [“以太坊智能合约设计缺陷问题”影响分析报告](https://lorexxar.cn/2018/08/22/haotian-s-2/)
  * 08/14 [“以太坊智能合约规范问题”影响分析报告](https://lorexxar.cn/2018/08/14/haotian-s-1/)
  * 07/13 [wctf2018 cyber mimic defence Writeup](https://lorexxar.cn/2018/07/13/wctf2018-mimic/)
  * 05/31 [0CTF/TCTF2018 Final Web Writeup](https://lorexxar.cn/2018/05/31/0ctf2018-final/)
  * 05/23 [RCTF2018 Web Writeup](https://lorexxar.cn/2018/05/23/rctf2018/)
  * 04/20 [基于Service Worker 的XSS攻击面拓展](https://lorexxar.cn/2018/04/20/SW-xss/)
  * 04/17 [TCTF/0CTF2018 h4x0rs.space Writeup](https://lorexxar.cn/2018/04/17/0ctf2018-space/)
  * 04/10 [TCTF/0CTF2018 h4xors.club2 Writeup](https://lorexxar.cn/2018/04/10/0ctf2018-club2/)
  * 04/05 [TCTF/0CTF2018 部分Web Writeup](https://lorexxar.cn/2018/04/05/0ctf2018-other/)
  * 04/05 [TCTF/0CTF2018 XSS bl0g Writeup](https://lorexxar.cn/2018/04/05/0ctf2018-blog/)
  * 03/26 [强网杯2018 Web writeup](https://lorexxar.cn/2018/03/26/qwb2018/)
  * 02/23 [吐槽HCTF2017](https://lorexxar.cn/2018/02/23/hctf2017/)
  * 02/07 [从补丁到漏洞分析 --记一次joomla漏洞应急](https://lorexxar.cn/2018/02/07/joomla3-8-4/)
  * 01/19 [DeDeCMS v5.7 密码修改漏洞分析](https://lorexxar.cn/2018/01/19/dedecms-vul1/)
  * 01/02 [34c3 Web部分Writeup](https://lorexxar.cn/2018/01/02/34c3-writeup/)


2017 
  * 12/19 [WordPress Updraftplus 插件漏洞2则以及一些有趣的故事](https://lorexxar.cn/2017/12/19/wordpress-pl2/)
  * 11/15 [HCTF2017 babycrack Writeup](https://lorexxar.cn/2017/11/15/hctf2017-babycrack/)
  * 11/15 [HCTF2017-Deserted place-Writeup](https://lorexxar.cn/2017/11/15/hctf2017-deserted-world/)
  * 11/15 [HCTF2017-A World Restored-Writeup](https://lorexxar.cn/2017/11/15/hctf2017-restore-world/)
  * 11/10 [HITCON2017-writeup整理](https://lorexxar.cn/2017/11/10/hitcon2017-writeup/)
  * 10/26 [typecho前台getshell漏洞分析](https://lorexxar.cn/2017/10/26/typecho-getshell/)
  * 10/25 [前端防御从入门到弃坑--CSP变迁](https://lorexxar.cn/2017/10/25/csp-paper/)
  * 10/25 [WordPress安全架构分析](https://lorexxar.cn/2017/10/25/wordpress/)
  * 09/30 [Discuz!X 3.4 任意文件删除漏洞分析](https://lorexxar.cn/2017/09/30/dz-delete/)
  * 08/31 [阿里先知xss挑战赛 Writeup](https://lorexxar.cn/2017/08/31/xss-ali/)
  * 08/31 [Discuz_X authkey安全性漏洞分析](https://lorexxar.cn/2017/08/31/dz-authkey/)
  * 08/23 [从瑞士军刀到变形金刚--XSS攻击面拓展](https://lorexxar.cn/2017/08/23/xss-tuo/)
  * 08/15 [pwnhub 改行做前端](https://lorexxar.cn/2017/08/15/pwnhub%20%E6%94%B9%E8%A1%8C%E5%81%9A%E5%89%8D%E7%AB%AF/)
  * 07/26 [finecms分析](https://lorexxar.cn/2017/07/26/finecms%E5%88%86%E6%9E%90/)
  * 07/23 [xssgame writeup](https://lorexxar.cn/2017/07/23/xssgame-wp/)
  * 07/20 [FineCMS multi vulnerablity before v5.0.9](https://lorexxar.cn/2017/07/20/FineCMS%20multi%20vulnerablity%20before%20v5.0.9/)
  * 07/11 [Some Vulnerability for FineCMS through 2017.7.11](https://lorexxar.cn/2017/07/11/Some%20Vulnerability%20for%20FineCMS%20through%202017.7.11/)
  * 07/11 [第十届信息安全国赛 Web MISC writeup](https://lorexxar.cn/2017/07/11/guosai2017/)
  * 07/07 [WordPress WP Statistics authenticated xss Vulnerability(WP Statistics <=12.0.9)](https://lorexxar.cn/2017/07/07/WordPress%20WP%20Statistics%20authenticated%20xss%20Vulnerability\(WP%20Statistics%20-=12.0.9\)/)
  * 06/16 [0ctf2017 final](https://lorexxar.cn/2017/06/16/0ctf2017-final/)
  * 05/23 [RCTF2017 web writeup](https://lorexxar.cn/2017/05/23/rctf2017/)
  * 05/16 [通过浏览器缓存来bypass CSP script nonce](https://lorexxar.cn/2017/05/16/nonce-bypass-script/)
  * 05/12 [PlaidCTF 2017 web writeup](https://lorexxar.cn/2017/05/12/pppctf2017/)
  * 05/12 [xss bot从入门到弃坑](https://lorexxar.cn/2017/05/12/xss-bot2/)
  * 05/09 [CSP Is Dead, Long Live CSP! 翻译](https://lorexxar.cn/2017/05/09/CSP%20Is%20Dead,%20Long%20Live%20CSP!%20On%20the%20Insecurity%20of%20Whitelists%20and%20the%20Future%20of%20Content%20Security%20Policy/)
  * 04/24 [pwnhub 绝对防御 出题思路和反思](https://lorexxar.cn/2017/04/24/pwnhub-jue/)
  * 04/21 [Shadow Brokers大新闻整理](https://lorexxar.cn/2017/04/21/Shadow-Brokers/)
  * 04/21 [360春秋杯2017 writeup](https://lorexxar.cn/2017/04/21/360chunqiu2017/)
  * 04/18 [bctf2017 web部分wp](https://lorexxar.cn/2017/04/18/bctf2017-web/)
  * 03/27 [pwnhub 之小m的复仇](https://lorexxar.cn/2017/03/27/pwnhub-xiaom/)
  * 03/21 [0ctf201 web部分writeup](https://lorexxar.cn/2017/03/21/0ctf2017-web/)
  * 03/13 [NJCTF Web部分writeup](https://lorexxar.cn/2017/03/13/njctf2017-wp/)
  * 03/05 [pwnhub_another php web部分](https://lorexxar.cn/2017/03/05/pwnhub-another-php/)
  * 02/27 [zctf2017 writeup](https://lorexxar.cn/2017/02/27/zctf2017-writeup/)
  * 02/20 [pwnhub 打开电脑](https://lorexxar.cn/2017/02/20/pwnhub-open/)
  * 02/16 [有趣的cdn bypass CSP](https://lorexxar.cn/2017/02/16/cdn-bypass-csp/)
  * 01/26 [聊聊hctf2016](https://lorexxar.cn/2017/01/26/hctf2016-something/)
  * 01/17 [pwnhub 深入敌后](https://lorexxar.cn/2017/01/17/pwnhub-shen/)
  * 01/03 [33c32016 writeup](https://lorexxar.cn/2017/01/03/33c3-wp/)


2016 
  * 12/28 [phpmailer RCE漏洞分析](https://lorexxar.cn/2016/12/28/cve-2016-10030/)
  * 12/26 [pwnhub_迷](https://lorexxar.cn/2016/12/26/pwnhub_mi/)
  * 12/24 [浅谈xss的后台守护问题](https://lorexxar.cn/2016/12/24/xss-protect/)
  * 12/18 [pwnhub_找朋友](https://lorexxar.cn/2016/12/18/pwnhub-pai/)
  * 12/18 [pwnhub_拍卖行](https://lorexxar.cn/2016/12/18/pwnhub-pai2/)
  * 12/10 [pwnhub_WTF_writeup](https://lorexxar.cn/2016/12/10/pwnhub-WTF-writeup/)
  * 12/07 [using polyglot JPEGs bypass CSP 分析](https://lorexxar.cn/2016/12/07/polyglot-JPEGs-bypass-csp/)
  * 12/03 [通过redis getshell的一些小问题](https://lorexxar.cn/2016/12/03/redis-getshell/)
  * 12/01 [hctf2016 简单部分WEB && misc writeup](https://lorexxar.cn/2016/12/01/hctf2016-other/)
  * 11/30 [hctf2016 guestbook&secret area writeup](https://lorexxar.cn/2016/11/30/hctf2016-xss/)
  * 11/29 [HCTF2016 ATField writeup](https://lorexxar.cn/2016/11/29/hctf2016-ATField/)
  * 11/19 [hctf2016 giligili writeup](https://lorexxar.cn/2016/11/19/web2-giligili/)
  * 10/31 [CSP进阶-302 Bypass CSP](https://lorexxar.cn/2016/10/31/csp-then2/)
  * 10/28 [CSP进阶-link Bypass unsafe line](https://lorexxar.cn/2016/10/28/csp-then/)
  * 10/26 [什么是ctf呢？](https://lorexxar.cn/2016/10/26/ctf-start/)
  * 10/11 [hitcon2016 misc writeup](https://lorexxar.cn/2016/10/11/hitcon2016-misc/)
  * 10/10 [hitcon2016 web writeup](https://lorexxar.cn/2016/10/10/hitcon2016/)
  * 10/03 [L-ctf2016 Writeup](https://lorexxar.cn/2016/10/03/Lctf2016/)
  * 09/14 [php 伪协议](https://lorexxar.cn/2016/09/14/php-wei/)
  * 09/11 [华山杯2016_writeup](https://lorexxar.cn/2016/09/11/huashanbei2016/)
  * 08/29 [crypto 简单的RSA](https://lorexxar.cn/2016/08/29/crypto-start/)
  * 08/18 [sqlmap 源码分析（四）开始注入](https://lorexxar.cn/2016/08/18/sqlmap-source4/)
  * 08/16 [sqlmap 源码分析（三）在注入之前](https://lorexxar.cn/2016/08/16/sqlmap-source3/)
  * 08/11 [sqlmap 源码分析（二）初始化](https://lorexxar.cn/2016/08/11/sqlmap-source2/)
  * 08/09 [sqlmap 源码分析（一）开始、参数解析](https://lorexxar.cn/2016/08/09/sqlmap-source1/)
  * 08/08 [CSP Level 3浅析&简单的bypass](https://lorexxar.cn/2016/08/08/ccsp/)
  * 08/07 [python virtualenv沙盒命令](https://lorexxar.cn/2016/08/07/python-virtualenv/)
  * 08/01 [XNUCA2016 Writeup](https://lorexxar.cn/2016/08/01/xnuca-ctf-wp/)
  * 07/21 [python tqdm模块分析](https://lorexxar.cn/2016/07/21/python-tqdm/)
  * 07/18 [shell上一些有趣的命令](https://lorexxar.cn/2016/07/18/cmd-shell/)
  * 07/17 [sangebaimao之火币网](https://lorexxar.cn/2016/07/17/sangebaimao_huobi/)
  * 07/12 [信息安全国赛技能赛 Writeup](https://lorexxar.cn/2016/07/12/guosai-ctf-wp/)
  * 06/26 [一个有趣的东西-cloudeye](https://lorexxar.cn/2016/06/26/cloudeye/)
  * 06/17 [sangebaimao之招聘又开始了，你怕了吗？](https://lorexxar.cn/2016/06/17/sangebaimao-zhao/)
  * 06/06 [alictf2016_web_writeup](https://lorexxar.cn/2016/06/06/alictf2016/)
  * 06/04 [sangebaimao 寻找来自星星的你一](https://lorexxar.cn/2016/06/04/sangebaimao1/)
  * 05/27 [在php opcache检测隐藏的后门程序](https://lorexxar.cn/2016/05/27/opcache-jcfx/)
  * 05/12 [php webshell 各种函数](https://lorexxar.cn/2016/05/12/php-shell/)
  * 05/10 [Asis2016_Binary Cloud](https://lorexxar.cn/2016/05/10/asis-bcloud/)
  * 05/09 [sctf2016_writeup](https://lorexxar.cn/2016/05/09/sctf2016/)
  * 05/05 [dockerfile (・ω・)ノ](https://lorexxar.cn/2016/05/05/dockerfile/)
  * 05/04 [docker 基础操作](https://lorexxar.cn/2016/05/04/docker-jc/)
  * 05/02 [google_ctf2016_writeup](https://lorexxar.cn/2016/05/02/ggctf2016/)
  * 04/25 [CCTF2016_writeup](https://lorexxar.cn/2016/04/25/cctf2016/)
  * 04/20 [gif bypass CSP?](https://lorexxar.cn/2016/04/20/gif-ccsp/)
  * 04/11 [j123jt的聊天板大型wp](https://lorexxar.cn/2016/04/11/j123jt-wp/)
  * 04/11 [sctfq1_Obfusion_writeup](https://lorexxar.cn/2016/04/11/sctf-Obfusion/)
  * 04/08 [input属性bypass csp](https://lorexxar.cn/2016/04/08/input-bypasscsrf/)
  * 04/06 [hctfgame_ll的流量分析题](https://lorexxar.cn/2016/04/06/hctfgame-llfx/)
  * 04/04 [is_numeric和trim导致的判断绕过](https://lorexxar.cn/2016/04/04/phpblack/)
  * 03/30 [web_for_pentest_II writeup](https://lorexxar.cn/2016/03/30/web-for-pentest-II/)
  * 03/22 [bctf2016](https://lorexxar.cn/2016/03/22/bctf2016/)
  * 03/14 [hctf_game_week4+5_writeup](https://lorexxar.cn/2016/03/14/hctfgame_week4+5_writeup/)
  * 03/14 [0ctf2016 && sunshinectf2016 writeup](https://lorexxar.cn/2016/03/14/0ctf2016/)
  * 03/07 [bkp2016_writeup](https://lorexxar.cn/2016/03/07/bkp2016-writeup/)
  * 03/05 [hexo转移到coding配置](https://lorexxar.cn/2016/03/05/hexo-coding/)
  * 03/01 [ssctf2015_writeup](https://lorexxar.cn/2016/03/01/ssctf2015-writeup/)
  * 02/29 [hctf_game_week3_writeup](https://lorexxar.cn/2016/02/29/hctfgame_week3_writeup/)
  * 02/28 [ldpa简单注入](https://lorexxar.cn/2016/02/28/ldpai/)
  * 02/28 [titan souls 普通模式通关攻略](https://lorexxar.cn/2016/02/28/titan-souls-ez/)
  * 02/18 [简单的git教程](https://lorexxar.cn/2016/02/18/easy_git/)
  * 02/18 [hctf_game_week2_writeup](https://lorexxar.cn/2016/02/18/hctfgame_week2_writeup/)
  * 02/18 [hctf_game_week1_writeup](https://lorexxar.cn/2016/02/18/hctfgame_week1_writeup/)
  * 02/18 [hctf_game_week0_writeup](https://lorexxar.cn/2016/02/18/hctfgame_week0_writeup/)


2015 
  * 12/21 [《代码审计》一点儿笔记](https://lorexxar.cn/2015/12/21/dmsj-book/)
  * 12/19 [hctf2015的一点儿记录](https://lorexxar.cn/2015/12/19/hctf2015/)
  * 11/19 [xss link&svg黑魔法](https://lorexxar.cn/2015/11/19/xss-link/)
  * 11/19 [SQL 显错注入](https://lorexxar.cn/2015/11/19/sql-error/)
  * 11/17 [ISG2015_writeup](https://lorexxar.cn/2015/11/17/isg2015/)
  * 11/17 [RCTF2015_writeup](https://lorexxar.cn/2015/11/17/rctf2015/)
  * 11/02 [SPWC & 华山杯？ writeup](https://lorexxar.cn/2015/11/02/hsb/)
  * 10/24 [关于sqli注入的特殊函数](https://lorexxar.cn/2015/10/24/sqli_h/)
  * 10/04 [XDCTF2015-writeup](https://lorexxar.cn/2015/10/04/XDCTF2015-writeup/)
  * 09/28 [Nsctf2015_Writeup](https://lorexxar.cn/2015/09/28/nsctf-writeup/)
  * 07/02 [xss无声挑战赛_writeup](https://lorexxar.cn/2015/07/02/xss-p/)
  * 06/11 [ctf近期总结](https://lorexxar.cn/2015/06/11/ctf0611/)
  * 05/22 [Windows Hexo博客安装配置优化（小白篇）](https://lorexxar.cn/2015/05/22/Hexo-blogs/)
  * 05/21 [Hduisa_ctf_wee4_fucksql](https://lorexxar.cn/2015/05/21/fucksql/)
  * 05/10 [Web for pentester_writeup](https://lorexxar.cn/2015/05/10/webforpentester/)
  * 02/26 [Hduisa_ctf_writeup02](https://lorexxar.cn/2015/02/26/hduisa-ctf-writeup2/)
  * 02/26 [Hduisa_ctf_writeup01](https://lorexxar.cn/2015/02/26/hduisa-ctf-writeup1/)
  * 02/26 [（转）十年学会程序设计](https://lorexxar.cn/2015/02/26/shinian/)
  * 01/22 [0基础如何学好WEB（转）](https://lorexxar.cn/2015/01/22/webfirst/)


2014 
  * 12/31 [凤凰挽歌，黑客独白（作者：我是老鹰&炫凤舞）](https://lorexxar.cn/2014/12/31/hackx/)
  * 12/29 [（转）学长们给我们的书目（结尾附上PDF地址）](https://lorexxar.cn/2014/12/29/bookshelf1/)
  * 12/29 [菜鸟小白的开始...](https://lorexxar.cn/2014/12/29/xiaobaistart/)


 ctf   Blogs   sqli   CSP   xss   java   csp   ssrf   redis   postMessage   pdflatex   csrf   opcache   nodejs   race   Hexo   cve   Shadow Brokers   0day   windows   aigc   php   c   curl   eth   blockchain   Reprint   bookshelf   chatgpt   llm   embeddings   chrome   chrome_ext   chrome ext   cmd   shell   linux   webdriver   dns   cloudeye   node   crypto   RSA   rabins   cs   CVE-2022-39197   contract   mysql   phpmailer   aicg   sd   dedecms   逻辑漏洞   midjourney   devsecops   whitebox   智能合约   book_notes   docker   dvp   phar   rce   ctf web   漏洞分析   dz   Fomo3D   git   反序列化漏洞   类型混淆漏洞   ecshop   access   伪协议   Essay   checklist   hctf   misc   php opcache   eassy   jsre   clrf   sast   joern   cpg   struts2   neo4j   oa   白盒   injection   随笔   django   LSpider   爬虫   log4j2   jndi   mimic   pwnhub   flask   格式化字符串   模板注入   js   wget   weblogic   lfi   pwn   fastcgi   ssh_sock5   LFI   win server信息收集   msf   lcx端口转发   IPC通道入侵   python   tqdm   virtualenv   open_basedir   crontab   roundcube   sangebaimao   参数污染   CBC   LD_PRELOAD   gopher   fcgi   php伪协议   file_put_contents   sca   Essry   sqlmap   game   titan_souls   tongda   blog   wechat   静态分析   SAST   tools   wordpress   条件竞争   代码审计   react2shell   ai   gpt   openclawd   agent   ghostbits   fastjson   Wordpress 

 Blogs   Reprint 

