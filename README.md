# VIBE CODE

# 博客友链网

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

脚本也通过全局 API 暴露了程序化接口：

- `window.__graphApi.find(query)`：按名称/域名/URL 搜索，返回匹配项数组（每项包含 `name` 与 `url`，可从 `url` 中解析出域名）；
- `window.__graphApi.focusByDomain(urlOrHost)`：根据域名或完整 URL 查找并聚焦/高亮对应节点（会把第一个匹配节点移动到屏幕中心并对所有匹配节点显示群组轮廓）；
- `window.__graphApi.highlightNodesByDomain(domainOrIds)`：对指定域名（或完整 URL）或节点 id 列表进行群组高亮（显示 contour），例如：
  - `window.__graphApi.highlightNodesByDomain('example.com')` — 高亮并加轮廓显示所有与 example.com 匹配的节点；
  - `window.__graphApi.highlightNodesByDomain(['id1','id2'])` — 高亮指定节点 id 的群组轮廓。
- `window.__graphApi.highlightNodesAndNeighbors(ids)`：高亮指定节点及其邻居（搜索结果条目点击时用于突出邻居共同圈选）。
- `window.__graphApi.clearLocalEffects()`：清除 `?local` 参数在页面加载时造成的聚焦与高亮效果（同时清除轮廓高亮和聚焦节点的颜色/大小样式），适用于在交互式搜索后恢复默认视觉状态。

示例：

`https://links.needhelp.icu/?local=example.com` — 页面加载后会自动聚焦并高亮与 `example.com` 匹配的节点。

注意：当页面通过 `?local` 自动聚焦/高亮后，若进行交互式搜索或手动清除搜索框，页面将自动移除 `local` 查询参数并清除该自动聚焦/高亮的视觉效果，以确保搜索结果反映当前的交互意图。
