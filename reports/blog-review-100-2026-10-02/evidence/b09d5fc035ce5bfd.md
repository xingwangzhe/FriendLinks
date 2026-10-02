[跳到主要内容](https://feisky.xyz/#main-content)
[![](https://feisky.xyz/images/avatar.jpg) **Feisky** 让 AI 成为你的第二大脑](https://feisky.xyz/)[首页](https://feisky.xyz/) [文章](https://feisky.xyz/posts/) [分类索引](https://feisky.xyz/tags/) [关于我](https://feisky.xyz/about/)
最新 **01**
2026 年 08 月 14 日 ·7 分钟阅读
# [DeepSeek Harness 入门指南：一切皆插件的 Agent 到底怎么用](https://feisky.xyz/posts/2026-08-14-deepseek-harness/)
DeepSeek 开源首个 Agent 产品 DeepSeek Harness，模型、工具、会话乃至 Agent 循环全部做成可热插拔插件，并用一篇 88 页论文的数学证明保证运行时装卸安全。本文从安装、第一个任务到 Agent 预设、插件系统架构全流程实测讲解。
  * [DeepSeek](https://feisky.xyz/tags/deepseek/)
  * [DeepSeek Harness](https://feisky.xyz/tags/deepseek-harness/)
  * [AI Agent](https://feisky.xyz/tags/ai-agent/)
  * [Agent Harness](https://feisky.xyz/tags/agent-harness/)

[阅读全文 →](https://feisky.xyz/posts/2026-08-14-deepseek-harness/)
02
2026 年 08 月 13 日 ·5 分钟阅读
## [用 AI 审核 AI 的代码，踩了一堆坑之后我的方法](https://feisky.xyz/posts/2026-08-13-ai-code-review/)
AI 生成的代码量越来越大，人工审查早已跟不上节奏。作者分享一套用 AI 审 AI 代码的实战方法：质量门控打底、给 Agent 完整代码库上下文、真实环境验证、对抗式审查测试、安全扫描以及本地环境信息清理，兼顾审查效率与可靠性，避免被 AI 的完美推理链带偏。
03
2026 年 08 月 06 日 ·5 分钟阅读
## [Claude Code 用了一年多，我终于受不了它的终端了](https://feisky.xyz/posts/2026-08-06-paseo-multi-agent-console/)
用了一年多 Claude Code 后，作者被 TUI 的刷屏和消息审查体验逼到极限，转而使用多 Agent 控制台 Paseo。它不重造 Harness，原生兼容 Claude Code、Codex 等主流 Agent，支持跨设备远程操控和多 Agent 跨 Provider 协作。
更多内容
## 继续阅读
[查看全部 →](https://feisky.xyz/posts/)
2026.07.06 · 8 分钟阅读
### [Claude Code 作者说：用好 Fable 5 的关键是管理你的未知](https://feisky.xyz/posts/2026-07-06-fable-field-guide-unknowns/)
Claude Code 团队 Thariq 的 Fable 5 实战指南：瓶颈不再是模型能力，而是你能否讲清自己的未知。本文拆解四种未知类型，给出盲点扫描、原型头脑风暴、反向面试、实现笔记等消除未知的具体方法，并整理社区最新玩法。
  * [Claude](https://feisky.xyz/tags/claude/)
  * [Fable 5](https://feisky.xyz/tags/fable-5/)
  * [Prompt Engineering](https://feisky.xyz/tags/prompt-engineering/)


2026.07.01 · 6 分钟阅读
### [Claude Code 官方教你用 Loop：你可能一直卡在最基础那层](https://feisky.xyz/posts/2026-07-01-claude-code-loops/)
Claude Code 官方把 loop 分成四层：交出验证步骤、停止条件、触发时机和整个决策流程，分别对应 Skill、/goal、/loop 与 /schedule 以及 Proactive 流水线，并给出控制 token 消耗的实操建议。
  * [Claude Code](https://feisky.xyz/tags/claude-code/)
  * [Loop Engineering](https://feisky.xyz/tags/loop-engineering/)
  * [AI Agent](https://feisky.xyz/tags/ai-agent/)


2026.06.27 · 6 分钟阅读
### [OpenAI Codex 白皮书：怎么让 Codex 工作不断线](https://feisky.xyz/posts/2026-06-27-codex-maxxing-white-paper/)
OpenAI 27 页 Codex 白皮书解读：用持久会话线程、语音输入、实时插话、记忆库、连接器、手机远程操控、线程自动化和可验收的目标，把 Codex 组织成一个长时间不断线的 AI Agent 工作台，并附三个可直接复用的实战循环。
  * [AI](https://feisky.xyz/tags/ai/)
  * [Codex](https://feisky.xyz/tags/codex/)
  * [OpenAI](https://feisky.xyz/tags/openai/)


2026.06.23 · 9 分钟阅读
### [终于搞明白 Claude Code 为什么会忽略我的指令了](https://feisky.xyz/posts/2026-06-23-claude-code-steering/)
Claude Code 忽略指令的根因是上下文膨胀。本文编译 Anthropic 官方指南，讲清 CLAUDE.md、Rules、Skills、Subagents、Hooks、Output Styles 这 7 种引导方法的加载时机、压缩行为与上下文成本，并给出四层分级的实践顺序。
  * [Claude Code](https://feisky.xyz/tags/claude-code/)
  * [Anthropic](https://feisky.xyz/tags/anthropic/)
  * [AI 编程](https://feisky.xyz/tags/ai-%E7%BC%96%E7%A8%8B/)


2026.06.10 · 5 分钟阅读
### [Loop Engineering 很好，但先想清楚一个问题](https://feisky.xyz/posts/2026-06-10-loop-engineering/)
Loop Engineering 火了，但它到底是什么？本文梳理从 ReAct、Ralph loop 到 Codex /goal 的演进，讲清它与定时任务的区别、独立验证为何是关键，以及上 loop 前你必须想清楚的那个朴素问题：能不能把「做完了」写清楚。
  * [AI Agent](https://feisky.xyz/tags/ai-agent/)
  * [Loop Engineering](https://feisky.xyz/tags/loop-engineering/)
  * [Claude Code](https://feisky.xyz/tags/claude-code/)


2026.06.03 · 9 分钟阅读
### [烧了 20 亿 token 总结的 Codex 使用指南](https://feisky.xyz/posts/2026-06-03-%E7%83%A7%E4%BA%8620%E4%BA%BFtoken%E6%80%BB%E7%BB%93%E7%9A%84codex%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/)
烧掉 20 多亿 token 后总结的 Codex 桌面客户端实战指南：从给足上下文、验证优先、批量操作审查门，到 Side Panel 边看边改、文件记忆、远程接管、定时自动化，10 条经验帮你把 Codex 用成一个通用 Agent 而不只是编程工具。
  * [Codex](https://feisky.xyz/tags/codex/)
  * [AI Agent](https://feisky.xyz/tags/ai-agent/)
  * [AI 编程](https://feisky.xyz/tags/ai-%E7%BC%96%E7%A8%8B/)


FIELD NOTES
## 按主题阅读
从持续积累的主题进入，而不是被时间线淹没。
[AI64 篇](https://feisky.xyz/tags/ai/) [Claude Code43 篇](https://feisky.xyz/tags/claude-code/) [Kubernetes41 篇](https://feisky.xyz/tags/kubernetes/) [Vibe Coding38 篇](https://feisky.xyz/tags/vibe-coding/) [Docker33 篇](https://feisky.xyz/tags/docker/) [AI Agent31 篇](https://feisky.xyz/tags/ai-agent/) [Agent21 篇](https://feisky.xyz/tags/agent/) [Codex16 篇](https://feisky.xyz/tags/codex/)
**Feisky**
让 AI 成为你的第二大脑
[全部文章](https://feisky.xyz/posts/) [标签索引](https://feisky.xyz/tags/) [RSS](https://feisky.xyz/index.xml)
© 2026 Pengfei Ni
