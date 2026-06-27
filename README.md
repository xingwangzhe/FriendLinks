
**本项目由阿里云ESA提供加速、计算和保护**

![阿里云加速](aliyun.png)

**\#阿里云ESA Pages** **\#阿里云云工开物话题**

# VIBE CODE

# 博客友链网 — 3D 球状网络图

 **法律合规说明：** 网站所有者和投稿者必须确保其发布内容及网站运营遵守中华人民共和国以及适用情况下的美利坚合众国法律法规（包括但不限于版权、隐私、网络安全与信息内容方面的法律）。

**确保为https** 

**确保大陆能够访问**

 添加你的博客及其友链（建议为博客），汇聚到这个巨大的网络中吧！

 在 `links/{yoursite}.yml` 中填写

 格式：

 ```yml
 site:
   name: 我的博客
   description: 分享编程和技术相关的文章
   url: https://example.com
   friends:
     - name: 编程小站
       url: https://codehub.example.com
     - name: 技术前沿
       url: https://techfrontier.example.com
 ```

## 3D 球状网络

友链关系以 **3D 球状网络** 呈现，基于 Three.js 渲染：

- 节点围绕球体分布，**鼠标拖拽可旋转视角**
- **滚轮缩放**，自由探索网络
- 连线带 **方向粒子流动**，直观展示友链指向
- 节点大小反映链接数量（度数越大节点越大）
- 支持 **暗色/亮色主题** 自动切换

## 交互功能

- **搜索节点**：顶部搜索框支持模糊搜索站点名、域名
- **点击节点**：在新的标签页打开对应网站
- **悬停节点**：显示站点名称、描述和链接
- **URL 聚焦查询**：通过 URL 参数自动定位节点（见下方）

## 本地开发

项目使用 **Bun** 管理依赖和运行脚本：

```bash
# 安装依赖
bun install

# 启动开发服务器（自动打包客户端 + 启动 Astro）
npm run dev

# 构建生产版本
npm run build
```

开发模式下，修改 `links/*.yml` 后**直接刷新浏览器**即可看到效果，无需手动运行脚本。JSON 数据通过 Astro 端点（`src/pages/*.json.ts`）实时生成。

### 项目结构

```
src/
├── pages/
│   ├── all.json.ts        # 所有站点数据端点
│   ├── graph.json.ts      # 图关系数据端点
│   ├── stats.json.ts      # 统计数据端点
│   └── index.astro        # 主页面
├── scripts/
│   ├── graph3d/           # 3D 图渲染模块
│   │   ├── index.ts       # 3D 初始化、交互、API
│   │   └── utils.ts       # 调色板、颜色工具
│   └── index-client.ts    # 客户端入口
└── utils/
    └── load-sites.ts      # YAML 读取/校验共享模块
links/                     # 友链 YAML 源文件
public/                    # 静态资源
types/                     # TypeScript 类型定义
```

## URL 聚焦查询（自动高亮）

你可以通过在页面地址中添加查询参数来自动聚焦并高亮指定站点节点。支持以下格式：


- 使用域名（hostname）匹配：

  `https://links.needhelp.icu/?local=example.com`

- 使用完整 URL：

  `https://links.needhelp.icu/?local=https://example.com` 或 `?local=http://example.com/path`

匹配规则（弱匹配，大小写不敏感）：
- 优先匹配节点的 `url` 的 hostname；
- 如果未解析出 hostname，则尝试在节点的 `url`中进行包含匹配；
- 成功匹配后页面会尝试把目标节点移动到屏幕中心并进行短时高亮（视觉提示）。

DEBUG_GENERATOR=1 bun run ./scripts/generate_yml/generate-yml-from-friends.ts
