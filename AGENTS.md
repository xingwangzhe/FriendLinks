## AGENTS

**Directly set camera to the node's position using relative coordinates**
**禁止直接设置相机到像素坐标，这会导致超大的位置偏移**

### 成功的聚焦节点方法
1. 获取节点的当前像素位置：`nodePixel = renderer.graphToViewport({ x: pos.x, y: pos.y })`
2. 使用高精度库转换为相对坐标：`relX = new Decimal(nodePixel.x).div(containerWidth)`, `relY = new Decimal(nodePixel.y).div(containerHeight)`
3. 计算 delta：`deltaX = (new Decimal(0.5).minus(relX)).mul(scaleFactor)`, `deltaY = (new Decimal(0.5).minus(relY)).mul(scaleFactor)`
4. 计算新相机位置：`newX = new Decimal(currentCameraX).minus(deltaX)`, `newY = new Decimal(currentCameraY).plus(deltaY)`
5. 计算目标缩放：`targetRatio = new Decimal(nodeSize).div(50)`
6. 设置相机：`camera.setState({ x: newX.toNumber(), y: newY.toNumber(), angle: 0, ratio: targetRatio.toNumber() })`
7. 刷新渲染器：`renderer.refresh()`


## 添加友链
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
