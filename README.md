# 博客宇宙

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/xingwangzhe/FriendLinks)

> 探索浩瀚的博客宇宙，寻找彼此之间的联系。每个节点是一个博客，每条连线是一段友链关系。

**法律合规说明：** 网站所有者和投稿者必须确保其发布内容及网站运营遵守中华人民共和国以及适用情况下的美利坚合众国法律法规。

**请确保：** 你的站点使用 `https` 并可以在中国大陆访问。

---

## 快速添加你的博客

在 `links/{你的域名}.yml` 中填写：

```yaml
site:
  name: 我的博客
  description: 分享编程和技术相关的文章
  url: https://example.com
  color: "#ff6600"       # 可选，自定义节点颜色（16 进制）
  links: /links          # 友链页面路由（必填）
  friends:
    - name: 编程小站
      url: https://codehub.example.com
```

提交 PR 即可。

> **友链页面路由**常见值：`/links`、`/link`、`/friends`、`/friend`、`/links.html` 等。

---

## ✨ 3D 渲染特性

### 节点系统
- **自定义 ShaderMaterial** — 菲涅尔 rim 光照，比 MeshStandardMaterial 轻 20 倍+
- **果冻透明球体** — 中心透明、边缘半透发光，无多边形感
- **Points 光晕层** — 径向渐变纹理 + AdditiveBlending，节点外围发光
- **度数驱动大小** — 连接越多的博客节点越大（`deg^0.38` 缩放）
- **12×8 球体分段** — 与 MeetBlog 一致的平滑度
- **24 色明亮调色板** — HSL 调亮保持高饱和度，黑色背景下清晰可见

### 连线系统
- **贝塞尔曲线** — 每条边二次贝塞尔插值，6 段细分，曲率自然
- **颜色渐变** — 从源节点颜色渐变到目标节点颜色
- **AdditiveBlending** — 加法混合发光，非普通灰色线条
- **流动粒子** — 500 个粒子沿边运动，形成能量流动效果

### 后期效果
- **UnrealBloomPass** — 可调节泛光强度（0~2，默认 0.08）
- **渲染节流** — 空闲自动降帧（60→30→15→8fps），减少 GPU 压力

### 路径查找
- **BFS 最短路径** — Rust NAPI-RS 原生加速计算
- **金色贝塞尔管道** — 沿曲线分段圆柱，步进导航
- **高亮覆盖** — 聚焦/悬停使用节点本色而非固定颜色

---

## 🎮 交互方式

| 操作 | 效果 |
|------|------|
| 左键点击节点 | 在新标签页打开网站 |
| 右键点击节点 | 聚焦该节点（相机拉近、光晕连线） |
| 拖拽 | 旋转 3D 视角 |
| 滚轮 | 缩放 |
| 顶部搜索框 | FlexSearch 模糊搜索（毫秒级） |
| URL `?local=域名` | 自动聚焦指定节点 |

### 控制面板（右下角齿轮按钮）

| 参数 | 范围 | 默认值 | 说明 |
|------|------|--------|------|
| 连线透明度 | 0~1 | 0 | 基础线网透明度（加法混合发光不受影响） |
| 飞船速度 | 5~100 | 15 | 飞船模式 WASD 飞行速度 |
| 泛光强度 | 0~2 | 0.08 | UnrealBloomPass 泛光强度 |
| 节点辉光 | 0~3 | 1.0 | 节点光晕亮度倍数 |
| 线条辉光 | 0~3 | 1.0 | 边颜色亮度倍数 |
| 节点标签 | 开/关 | 开 | 3D 文字标签显隐 |

所有参数自动持久化到 `localStorage`，刷新页面保持上次设置。

### 飞船模式（🚀 按钮）

| 按键 | 功能 |
|------|------|
| WASD | 前后左右飞行 |
| R / F | 上升 / 下降 |
| Q / E | 横滚 |
| Shift | 加速 3× |
| Space | 自动驾驶切换 |

---

## 🚀 性能设计

| 技术 | 说明 |
|------|------|
| **InstancedMesh** | 37K+ 节点单次 draw call |
| **LineSegments** | 76K+ 边合并为单一 BufferGeometry |
| **Points** | 光晕 / 粒子 / 背景星群各单次 draw call |
| **Bloom 后处理** | threshold=0.3 仅亮部泛光，暗部不受影响 |
| **光晕像素上限** | clamp(1.5, 48.0)，密集区不叠加为白色 |
| **光晕透明度** | 0.60，加法混合叠加柔和 |
| **空闲降帧** | 1秒无操作 → 30fps，3秒 → 15fps，10秒 → 8fps |

**总 draw calls：~6 次**（节点×1、光晕×1、连线×1、粒子×1、背景星群×1、后处理×1）

---

## 数据格式

### 图数据端点

| 端点 | 格式 | 说明 |
|------|------|------|
| `/graph-core.bin` | msgpack + zstd 二进制 | 核心图数据（节点、边、邻接表），首屏优先加载 |
| `/graph-bezier.bin` | msgpack + zstd 二进制 | 贝塞尔曲线数据，核心图加载后异步获取 |
| `/all.json` | JSON | 完整站点数据（外部使用） |

### 数据流

```
links/**/*.yml（排除保留目录 links/unverified/）
               →  YAML Schema 校验 → build-graph.ts (力导布局+贝塞尔预计算)
               →  graph-core.bin.ts (msgpack+zstd) →  /graph-core.bin
               →  graph-bezier.bin.ts (msgpack+zstd) →  /graph-bezier.bin
               →  客户端 fetch → msgpackr 解码 → zstd 解压 → Three.js 3D 渲染
```

---

## 本地开发

项目使用 **Bun** 管理依赖：

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 构建生产版本
bun run build

# 代码检查与格式化
bun run lint
bun run fmt
```

### 项目结构

```
src/
├── pages/
│   ├── graph-core.bin.ts    # msgpack+zstd 核心图数据端点
│   ├── graph-bezier.bin.ts  # msgpack+zstd 贝塞尔曲线数据端点
│   ├── all.json.ts          # 完整站点数据端点
│   ├── stats.json.ts        # 统计端点
│   └── index.astro          # 主页面
├── scripts/
│   ├── graph3d/             # 3D 渲染模块
│   │   ├── index.ts         # 初始化、交互、控制面板、API
│   │   ├── renderer.ts      # Three.js 渲染管线（节点/连线/光晕/粒子/Bloom）
│   │   ├── interaction.ts   # Raycaster 交互层
│   │   ├── pathfinder.ts    # BFS 路径查找
│   │   └── utils.ts         # 调色板、颜色工具、标签工厂
│   ├── ui/                 # WinBox 窗口管理、边界约束和测试
│   └── index-client.ts      # 客户端入口
├── utils/
│   ├── build-graph.ts       # 图构建（力导布局+贝塞尔预计算，模块级缓存）
│   ├── sites.ts             # Astro Content Collection 站点加载
│   ├── compress.ts          # zstd 压缩
│   ├── bezier.ts            # 贝塞尔曲线工具
│   ├── sample.ts            # DEV 模式确定性采样
│   └── progress.ts          # 构建进度条
├── css/                     # 样式文件（base/topbar）
├── styles/                  # Tailwind CSS v4 + daisyUI 主题
links/                       # 正式友链 YAML 源文件（核心数据）
├── aggregators/            # 已确认的博客聚合型站点
└── unverified/             # 待验证候选（默认不进入构建和数据端点）
types/                       # TypeScript 类型定义
```

---

## 调色板

24 色明亮调色板，节点颜色由其域名哈希决定。可在 YAML 中通过 `color` 字段自定义。

```
#FF6B6B  #4ECDC4  #45B7D1  #96CEB4
#FFEAA7  #DDA0DD  #98D8C8  #F7DC6F
#BB8FCE  #85C1E9  #F0B27A  #82E0AA
#F1948A  #7FB3D8  #AED6F1  #A3E4D7
#FAD7A0  #D2B4DE  #FF8C94  #96E6A1
#81ECEC  #FFA07A  #C8A2C8  #87CEEB
```

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | **Astro 7** + Tailwind CSS v4 |
| UI 组件 | **daisyUI**（Tailwind CSS）+ **WinBox**（窗口管理） |
| 3D 引擎 | **Three.js** (r185) + EffectComposer + UnrealBloomPass |
| 力导布局 | **d3-force-3d** + **Rust NAPI-ROS native addon**（`@xingwangzhe/force-rs`）|
| BFS 路径 | **Rust NAPI-RS native addon**（`@xingwangzhe/bfs-rs`）|
| 搜索 | **FlexSearch** |
| 数据序列化 | **msgpackr** |
| 包管理器 | **Bun** |

## 前端控件与浮动面板

界面统一使用 Tailwind CSS v4 与 daisyUI 免费组件。按钮、输入框、滑块、开关、加载状态和统计卡片均采用原生 HTML，可叠加 Tailwind 工具类。

统计、关于、控制、邻居、飞行控制和路径查找面板由 WinBox 管理。拖动标题栏移动，拖动边缘调整尺寸，最大化按钮切换大小；关闭后重开保留本次页面会话的位置、尺寸和状态。刷新恢复默认布局。标题栏获得焦点后方向键移动，Shift 加速，Escape 关闭并返回入口焦点。窄屏窗口限制在视口内，内容内部滚动。

开发验证使用 `bun run dev` 的抽样数据，运行 `bun run lint`、`bun test` 与改动文件格式检查；在系统浏览器检查拖拽、缩放、多窗口、固定暗色主题、搜索、参数持久化和飞行指针锁定。开发模式会清理本项目旧 Service Worker 缓存，避免加载过期控件代码。不得以生产构建替代 dev 检查。

界面固定使用 daisyUI 暗色主题，与宇宙背景一致，不提供亮色模式或主题切换入口；系统浅色偏好及历史 `colorTheme` 本地设置均不影响页面。
