[ flwfdd'Space ](https://flwfdd.xyz/)
  * [笔记](https://flwfdd.xyz/notes)
  * [博客](https://blog.flwfdd.xyz)
  * [关于](https://flwfdd.xyz/about)


  * [笔记](https://flwfdd.xyz/notes)
  * [博客](https://blog.flwfdd.xyz)
  * [关于](https://flwfdd.xyz/about)


###  📚目录
  * 学习记录
    * [ CS336 Language Modeling from Scratch ](https://flwfdd.xyz/notes/%E5%AD%A6%E4%B9%A0%E8%AE%B0%E5%BD%95/cs336-language-modeling-from-scratch "CS336 Language Modeling from Scratch")
    * [ 城市经济学 ](https://flwfdd.xyz/notes/%E5%AD%A6%E4%B9%A0%E8%AE%B0%E5%BD%95/%E5%9F%8E%E5%B8%82%E7%BB%8F%E6%B5%8E%E5%AD%A6 "城市经济学")
    * [ 讲座 ](https://flwfdd.xyz/notes/%E5%AD%A6%E4%B9%A0%E8%AE%B0%E5%BD%95/%E8%AE%B2%E5%BA%A7 "讲座")
  * [ LLM-Agent拾慧 ](https://flwfdd.xyz/notes/llm-agent%E6%8B%BE%E6%85%A7 "LLM-Agent拾慧")
  * [ 您配吗？ ](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97 "您配吗？")


# 您配吗？
创建于 2025-07-31更新于 2025-10-06
各种配置的备忘录
## 命令行配置
### ZSH
  * 安装 zsh
  * 使用 `chsh -s $(which zsh)` 切换
  * 安装 Oh My Zsh：`sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
  * 安装自动补全插件：`git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions`
  * 安装语法高亮插件：`git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting`
  * 编辑 `~/.zshrc`：`plugins=(git zsh-autosuggestions zsh-syntax-highlighting)` 快捷脚本：


```
sudo apt install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
sed -i 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting)/' ~/.zshrc
```

## Zotero GPT

```
[GenerateNote](/tags/GenerateNote)[color=[4285F4](/tags/4285F4)][trigger=]
${
(async ()=>{
  const items = ZoteroPane.getSelectedItems();

  for (let item of items) {
    try {
      // 1. 获取PDF全文
      let pdfItem = null;
      const itemTitle = item.getDisplayTitle(false, true); // 先获取标题用于后续提示

      if (item.isPDFAttachment()) {
        pdfItem = item;
      } else if ((await item.getBestAttachmentState()).exists) {
        pdfItem = await item.getBestAttachment();
      }

      if (!pdfItem) {
        Zotero.alert(window, "操作已跳过", `未能为《${itemTitle}》找到有效的PDF附件。`);
        continue;
      }
      
      const fullText = (await Zotero.PDFWorker.getFullText(pdfItem.id, null)).text;

      if (!fullText) {
        Zotero.alert(window, "操作已跳过", `无法从《${itemTitle}》的PDF中提取文本，文件可能为纯图片或已损坏。\n\n建议对该PDF附件右键 -> 识别文本(Recognize Text) 后再试。`);
        continue;
      }

      // 2. 使用您指定的中文提示词 (逻辑保持不变)
      const noteContent = await Meet.Global.views.ask(
        "你的任务是根据下方提供的论文全文，理清底层逻辑，生成一份精炼、结构化、高质量的中文摘要。\n" +
        "摘要必须严格遵循以下格式（内容仅作提示，依据实际情况覆盖关键信息、理顺逻辑即可）：\n" +
        "# （英文论文标题）\n" +
        "中文标题，以及一句话简介。\n" +
        "## 摘要\n" +
        "简明扼要地介绍论文的主要内容。\n" +
        "## 大纲\n" +
        "以列表形式概述论文整体组织逻辑。\n" +
        "## 问题背景\n" +
        "阐述论文旨在解决的关键问题背景和痛点。\n" +
        "## 相关工作\n" +
        "相关工作是按照什么逻辑分类的？分别有什么代表性的研究？\n" +
        "## 核心贡献\n" +
        "论文的定位和主要贡献是什么？其逻辑是什么？\n" +
        "## 设计目标（如有）\n" +
        "设计空间和目标用户是谁，为什么这样定？设计目标是什么，提出的逻辑是什么（是否做了形成性研究、对应了怎样的背景和实现）？\n" +
        "## 实现方法\n" +
        "清晰地描述关键技术方案和实现等，并说明回应了之前的什么问题或目标。\n" +
        "## 实验结果\n" +
        "做了什么实验？得出了什么结果？为什么这样设计实验？\n" +
        "## 讨论和展望\n" +
        "总结目前局限、未来工作等。\n\n" +
        "请确保你的输出语言专业、简洁、凝练，没有废话套话。并直接以格式化的摘要内容作为回答，不要包含任何额外的对话、标题或前言。\n\n" +
        "--- 论文全文如下 ---\n\n" + fullText
      );

      // 3. 创建笔记，并转换Markdown为HTML
      if (noteContent) {
        // Markdown转HTML的函数
        function markdownToHtml(text) {
          if (!text) return "";
          return text
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/\n/g, '<br>');
        }
        
        const noteHtml = markdownToHtml(noteContent);
        
        let note = new Zotero.Item('note');
        note.parentID = item.id;
        note.setNote(noteHtml);
        await note.saveTx();
        
      } else {
        Zotero.alert(window, "Zotero GPT 提示", `为《${itemTitle}》生成摘要时，未能从大模型获取有效内容。`);
      }

    } catch (e) {
      Zotero.alert(window, "脚本执行错误", `处理条目时出错: ${e.message}`);
    }
  }
})()
}$
直接回复：完成
```

## Better BibTex
Citation keys:

```
auth.lower + year + shorttitle(1, 0).lower
```

Fields to omit:

```
abstract,file,shorttitle,langid,month,keywords
```

## Obsidian 配置
使用 Astro 重构了个人网站，将一个子文件夹作为笔记部分，配合 Obsidian 使用，这样就可以使用 Git 管理，同时又能够自动发布了。在此记录一些 Obsidian 相关的配置。
### 新建笔记模板
希望能在创建笔记时自动设置一些属性，但是又不想显式地创建一个模板，所以使用 QuickAdd 插件，创建一个 Capture，然后打开设置，在最下方的 Capture Format 中写入：
写入以下内容：

```
---
title: 
description: 
tags: []
img: 
publish: true
created: {{DATE:YYYY-MM-DD HH:mm:ss}}
updated: {{DATE:YYYY-MM-DD HH:mm:ss}}
---
```

### 自动更新时间
Update time on edit 插件可以自动更新笔记属性中的 updated 字段。
### 自动格式化
应该有挺多插件能实现类似功能的，但我主要的诉求只是在中英文间加空格。所以就选择了 Easy Typing 这个轻量级的。
[返回笔记列表](https://flwfdd.xyz/notes)回到顶部
###  📖大纲
  * [命令行配置](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#%E5%91%BD%E4%BB%A4%E8%A1%8C%E9%85%8D%E7%BD%AE)
  * [ZSH](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#zsh)
  * [Zotero GPT](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#zotero-gpt)
  * [Better BibTex](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#better-bibtex)
  * [Obsidian 配置](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#obsidian-%E9%85%8D%E7%BD%AE)
  * [新建笔记模板](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#%E6%96%B0%E5%BB%BA%E7%AC%94%E8%AE%B0%E6%A8%A1%E6%9D%BF)
  * [自动更新时间](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%E6%97%B6%E9%97%B4)
  * [自动格式化](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#%E8%87%AA%E5%8A%A8%E6%A0%BC%E5%BC%8F%E5%8C%96)


###  📚目录
  * 学习记录
    * [ CS336 Language Modeling from Scratch ](https://flwfdd.xyz/notes/%E5%AD%A6%E4%B9%A0%E8%AE%B0%E5%BD%95/cs336-language-modeling-from-scratch "CS336 Language Modeling from Scratch")
    * [ 城市经济学 ](https://flwfdd.xyz/notes/%E5%AD%A6%E4%B9%A0%E8%AE%B0%E5%BD%95/%E5%9F%8E%E5%B8%82%E7%BB%8F%E6%B5%8E%E5%AD%A6 "城市经济学")
    * [ 讲座 ](https://flwfdd.xyz/notes/%E5%AD%A6%E4%B9%A0%E8%AE%B0%E5%BD%95/%E8%AE%B2%E5%BA%A7 "讲座")
  * [ LLM-Agent拾慧 ](https://flwfdd.xyz/notes/llm-agent%E6%8B%BE%E6%85%A7 "LLM-Agent拾慧")
  * [ 您配吗？ ](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97 "您配吗？")


###  📖大纲
  * [命令行配置](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#%E5%91%BD%E4%BB%A4%E8%A1%8C%E9%85%8D%E7%BD%AE)
  * [ZSH](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#zsh)
  * [Zotero GPT](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#zotero-gpt)
  * [Better BibTex](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#better-bibtex)
  * [Obsidian 配置](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#obsidian-%E9%85%8D%E7%BD%AE)
  * [新建笔记模板](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#%E6%96%B0%E5%BB%BA%E7%AC%94%E8%AE%B0%E6%A8%A1%E6%9D%BF)
  * [自动更新时间](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%E6%97%B6%E9%97%B4)
  * [自动格式化](https://flwfdd.xyz/notes/%E6%82%A8%E9%85%8D%E5%90%97/#%E8%87%AA%E5%8A%A8%E6%A0%BC%E5%BC%8F%E5%8C%96)


Made with ❤️ by flwfdd
[GitHub](https://github.com/flwfdd)邮箱
