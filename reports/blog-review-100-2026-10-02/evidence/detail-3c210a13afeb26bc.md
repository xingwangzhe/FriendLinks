![avatar](https://xun-cmd.github.io/img/junxun.jpg)
[文章 17](https://xun-cmd.github.io/archives/)[标签 12](https://xun-cmd.github.io/tags/)[分类 7](https://xun-cmd.github.io/categories/)
[ 主页](https://xun-cmd.github.io/)
[ Archives](https://xun-cmd.github.io/archives/)
[ 标签](https://xun-cmd.github.io/tags/)
[ 分类](https://xun-cmd.github.io/categories/)
[ 友情链接](https://xun-cmd.github.io/link/)
[ 关于](https://xun-cmd.github.io/about/)
[秃头的君寻酱](https://xun-cmd.github.io/)[GAMES101 04](https://xun-cmd.github.io/)
搜索
[ 主页](https://xun-cmd.github.io/)
[ Archives](https://xun-cmd.github.io/archives/)
[ 标签](https://xun-cmd.github.io/tags/)
[ 分类](https://xun-cmd.github.io/categories/)
[ 友情链接](https://xun-cmd.github.io/link/)
[ 关于](https://xun-cmd.github.io/about/)
# GAMES101 04
发表于2026-08-28|更新于2026-09-01|[计算机图形学](https://xun-cmd.github.io/categories/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9B%BE%E5%BD%A2%E5%AD%A6/)[游戏开发](https://xun-cmd.github.io/categories/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9B%BE%E5%BD%A2%E5%AD%A6/%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91/)
|总字数:2.2k|阅读时长:9分钟|浏览量:
#  [](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#%E5%89%8D%E8%A8%80 "前言")前言
这节课整体的核心逻辑只有四步，简称为**MVP 变换** ：
  1. **Model（模型变换）：** 把物体摆放到三维世界中的合适位置。
  2. **View（视图/相机变换）：** 把相机摆到标准原点，调整观察视角。
  3. **Projection（投影变换）：** 把三维场景“缩放压扁”到标准立方体中（为绘制到二维屏幕做准备）。
  4. **Viewport（视口变换）：** 把标准立方体映射到真实的屏幕像素上（第五讲内容）。


下面为你整理了第四讲的**超详细笔记与核心公式推导** ，帮助你把每一个难点彻底搞懂！
##  [](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#%E4%B8%80%E3%80%81-3D-%E5%8F%98%E6%8D%A2%E4%B8%8E%E9%BD%90%E6%AC%A1%E5%9D%90%E6%A0%87-3D-Transformations "一、 3D 变换与齐次坐标 \(3D Transformations\)")一、 3D 变换与齐次坐标 (3D Transformations)
###  [](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#1-3D-%E9%BD%90%E6%AC%A1%E5%9D%90%E6%A0%87 "1. 3D 齐次坐标")1. 3D 齐次坐标
从 2D 扩展到 3D，只需要增加一个 $z$ 轴：
  * **3D 点：** $(x, y, z, 1)^T$
  * **3D 向量：** $(x, y, z, 0)^T$
  * 如果 $w \neq 0$，齐次坐标 $(x, y, z, w)^T$ 表示三维空间中的点 $(\frac{x}{w}, \frac{y}{w}, \frac{z}{w}, 1)^T$。


###  [](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#2-3D-%E6%97%8B%E8%BD%AC%E7%9F%A9%E9%98%B5%E7%9A%84%E2%80%9C%E5%B0%8F%E9%99%B7%E9%98%B1%E2%80%9D "2. 3D 旋转矩阵的“小陷阱”")2. 3D 旋转矩阵的“小陷阱”
3D 中的平移和缩放非常直观（对角阵加 $t_x, t_y, t_z$），但**旋转** 有一个极其关键的细节：
绕 X 轴和 Z 轴旋转的形式是一致的，但**绕 Y 轴旋转矩阵的负号位置刚好相反**
  * **绕 X 轴旋转 $\alpha$：**
$$R_x(\alpha) =  
\begin{pmatrix}  
1 & 0 & 0 & 0 \cr  
0 & \cos\alpha & -\sin\alpha & 0 \cr  
0 & \sin\alpha & \cos\alpha & 0 \cr  
0 & 0 & 0 & 1  
\end{pmatrix}  
$$
  * **绕 Y 轴旋转 $\beta$（负号在右上角）：**
$$R_y(\beta) =  
\begin{pmatrix}  
\cos\beta & 0 & \mathbf{\sin\beta} & 0 \cr  
0 & 1 & 0 & 0 \cr  
\mathbf{-\sin\beta} & 0 & \cos\beta & 0 \cr  
0 & 0 & 0 & 1  
\end{pmatrix}  
$$
  * **绕 Z 轴旋转 $\gamma$：**
$$R_z(\gamma) =  
\begin{pmatrix}  
\cos\gamma & -\sin\gamma & 0 & 0 \cr  
\sin\gamma & \cos\gamma & 0 & 0 \cr  
0 & 0 & 0 & 1 \cr  
0 & 0 & 0 & 1  
\end{pmatrix}  
$$


> **为什么绕 Y 轴旋转的负号颠倒了？**
> 因为根据右手定则，基向量乘积是 $X \times Y = Z$，$Y \times Z = X$，但 $Z \times X = Y$。在计算 Y 轴时，右手系的基向量交叉顺序是 $Z \to X$，而 X 轴和 Z 轴都是 $X \to Y$ 和 $Y \to Z$。
###  [](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#3-%E6%AC%A7%E6%8B%89%E8%A7%92%E4%B8%8E%E7%BD%97%E5%BE%B7%E9%87%8C%E6%A0%BC%E6%96%AF%E5%85%AC%E5%BC%8F "3. 欧拉角与罗德里格斯公式")3. 欧拉角与罗德里格斯公式
  * **欧拉角 (Euler Angles)：** 任何复杂的 3D 旋转都可以拆解为依次绕 X、Y、Z 轴旋转：$R_{xyz}(\alpha, \beta, \gamma) = R_x(\alpha) R_y(\beta) R_z(\gamma)$（即航模/飞行器中的 Pitch 俯仰, Yaw 偏航, Roll 翻滚）。
  * **罗德里格斯旋转公式 (Rodrigues’ Rotation Formula)：** 如果要绕**任意方向的轴 $\vec{n}$** 旋转 $\alpha$ 角，不需要拆成 XYZ 轴，直接使用罗德里格斯公式即可算出对应的 $3\times3$ 旋转矩阵。


##  [](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#%E4%BA%8C%E3%80%81-%E8%A7%86%E5%9B%BE-%E7%9B%B8%E6%9C%BA%E5%8F%98%E6%8D%A2-View-Camera-Transformation "二、 视图/相机变换 \(View / Camera Transformation\)")二、 视图/相机变换 (View / Camera Transformation)
**核心直觉：** 拍照时，是相机动还是世界动？在数学上，**让相机固定在原点，把整个世界往相反方向拉，效果完全一样**
###  [](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#1-%E5%AE%9A%E4%B9%89%E7%9B%B8%E6%9C%BA%E4%B8%89%E8%A6%81%E7%B4%A0 "1. 定义相机三要素")1. 定义相机三要素
一个摄像机在三维空间中的状态由三个向量决定：
  1. **位置 (Position $\vec{e}$)** ：相机在哪？
  2. **观察方向 (Look-at / Gaze direction $\vec{g}$)** ：相机朝哪看？
  3. **向上方向 (Up direction $\vec{t}$)** ：相机的顶部朝哪（决定相机是否颠倒或倾斜）？


###  [](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#2-%E6%A0%87%E5%87%86%E7%9B%B8%E6%9C%BA%E4%BD%8D%E7%BD%AE-Canonical-Camera "2. 标准相机位置 \(Canonical Camera\)")2. 标准相机位置 (Canonical Camera)
为了简化后续计算，图形学规定**标准相机位置** 为：
  * 位置位于原点 $(0,0,0)$
  * 观察方向指向 $-Z$ 轴
  * 向上方向指向 $+Y$ 轴


###  [](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#3-%E8%A7%86%E5%9B%BE%E5%8F%98%E6%8D%A2%E7%9F%A9%E9%98%B5-M-view-%E7%9A%84%E6%8E%A8%E5%AF%BC%EF%BC%88%E9%80%86%E5%90%91%E6%80%9D%E8%80%83%E6%8A%80%E5%B7%A7%EF%BC%89 "3. 视图变换矩阵 $M_{view}$ 的推导（逆向思考技巧）")3. 视图变换矩阵 $M_{view}$ 的推导（逆向思考技巧）
我们需要找到一个变换矩阵 $M_{view}$，把任意位置的相机“拉”到标准位置。这个变换由平移和旋转组成：
$$M_{view} = R_{view} \cdot T_{view}$$
  1. **平移矩阵 $T_{view}$：** 把相机位置 $\vec{e}$ 平移到原点 $(0,0,0)$。
$$T_{view} =  
\begin{pmatrix}  
1 & 0 & 0 & -e_x \cr  
0 & 1 & 0 & -e_y \cr  
0 & 0 & 1 & -e_z \cr  
0 & 0 & 0 & 1  
\end{pmatrix}  
$$
  2. **旋转矩阵 $R_{view}$：**
直接求“任意方向 $\to$ 标准方向”的旋转矩阵很难，但求它的**逆过程** （标准方向 $\to$ 任意方向）极度简单
逆旋转矩阵 $R_{view}^{-1}$ 会把：
     * $(1,0,0)^T \to \vec{g} \times \vec{t}$ （右方向）
     * $(0,1,0)^T \to \vec{t}$ （上方向）
     * $(0,0,1)^T \to -\vec{g}$ （后方向，因为相机朝 $-Z$ 看）
写出逆矩阵：
$$R_{view}^{-1} = \begin{pmatrix} x_{\vec{g}\times\vec{t}} & x_t & x_{-g} & 0 \cr y_{\vec{g}\times\vec{t}} & y_t & y_{-g} & 0 \cr z_{\vec{g}\times\vec{t}} & z_t & z_{-g} & 0 \cr 0 & 0 & 0 & 1 \end{pmatrix}$$
因为**旋转矩阵是正交矩阵** ，正交矩阵的逆矩阵等于其**转置矩阵** ！所以直接取转置：
$$R_{view} = (R_{view}^{-1})^T = \begin{pmatrix} x_{\vec{g}\times\vec{t}} & y_{\vec{g}\times\vec{t}} & z_{\vec{g}\times\vec{t}} & 0 \cr x_t & y_t & z_t & 0 \cr x_{-g} & y_{-g} & z_{-g} & 0 \cr 0 & 0 & 0 & 1 \end{pmatrix}$$


##  [](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#%E4%B8%89%E3%80%81-%E6%8A%95%E5%BD%B1%E5%8F%98%E6%8D%A2-Projection-Transformation "三、 投影变换 \(Projection Transformation\)")三、 投影变换 (Projection Transformation)
投影有两种：**正交投影 (Orthographic Projection)** 和 **透视投影 (Perspective Projection)** 。
###  [](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#1-%E6%AD%A3%E4%BA%A4%E6%8A%95%E5%BD%B1-Orthographic-Projection "1. 正交投影 \(Orthographic Projection\)")1. 正交投影 (Orthographic Projection)
  * **特点：** 平行线保持平行，没有“近大远小”。常用于建筑 CAD 图纸、工程图、像素风游戏。
  * **数学目标：** 把空间中的一个长方体包围盒 $[l, r] \times [b, t] \times [f, n]$ 映射到**标准立方体 (Canonical Cube)** $[-1, 1]^3$ 中。
_(注：在右手坐标系中，相机朝 $-Z$ 看，因此近平面 $n$ 的 $z$ 值大于远平面 $f$ 的 $z$ 值，即 $n > f$)_。
  * **算法步骤：**
    1. 将长方体中心平移到原点；
    2. 将长方体各边长缩放到长度为 2。
  * **正交投影矩阵 $M_{ortho}$：**
$$M_{ortho} = \begin{pmatrix} \frac{2}{r-l} & 0 & 0 & 0 \cr 0 & \frac{2}{t-b} & 0 & 0 \cr 0 & 0 & \frac{2}{n-f} & 0 \cr 0 & 0 & 0 & 1 \end{pmatrix} \begin{pmatrix} 1 & 0 & 0 & -\frac{r+l}{2} \cr 0 & 1 & 0 & -\frac{t+b}{2} \cr 0 & 0 & 1 & -\frac{n+f}{2} \cr 0 & 0 & 0 & 1 \end{pmatrix}$$


###  [](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#2-%E9%80%8F%E8%A7%86%E6%8A%95%E5%BD%B1-Perspective-Projection-%E2%80%94%E2%80%94%E6%9C%80%E9%9A%BE%E4%B9%9F%E6%98%AF%E6%9C%80%E9%87%8D%E8%A6%81%E7%9A%84%E7%82%B9%EF%BC%81 "2. 透视投影 \(Perspective Projection\)——最难也是最重要的点！")2. 透视投影 (Perspective Projection)——最难也是最重要的点！
  * **特点：** 满足现实视觉“近大远小”，平行线在无穷远处相交于一点。相机的视野是一个四棱台，称为**视锥体 (Frustum)** 。
  * **闫老师的方法：** **“先把视锥体‘压扁’成长方体，再做一次正交投影”**
$$M_{persp} = M_{ortho} \cdot M_{persp \to ortho}$$


#####  [](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#%E5%85%B3%E9%94%AE%E6%AD%A5%E9%AA%A4%EF%BC%9A%E5%A6%82%E4%BD%95%E6%8E%A8%E5%AF%BC%E2%80%9C%E5%8E%8B%E6%89%81%E2%80%9D%E7%9F%A9%E9%98%B5-M-persp-to-ortho-%EF%BC%9F "关键步骤：如何推导“压扁”矩阵 $M_{persp \\to ortho}$？")关键步骤：如何推导“压扁”矩阵 $M_{persp \to ortho}$？
假设视锥体内部一点为 $(x, y, z)$，压扁后变成了 $(x’, y’, z’)$：
  1. **利用相似三角形求 $x’$ 和 $y’$：**
从侧面看，根据相似三角形：
$$\frac{y’}{y} = \frac{n}{z} \implies y’ = \frac{n}{z} y$$
同理，从上面看：
$$x’ = \frac{n}{z} x$$
  2. **写成齐次坐标形式：**
点坐标的变化：
$$\begin{pmatrix} x \cr y \cr z \cr 1 \end{pmatrix} \Rightarrow \begin{pmatrix} \frac{n}{z}x \cr \frac{n}{z}y \cr \text{未知} \cr 1 \end{pmatrix} \quad \text{全乘以 } z \Rightarrow \begin{pmatrix} nx \cr ny \cr \text{未知} \cdot z \cr z \end{pmatrix}$$
这意味着压扁矩阵乘以原点坐标，前两行和第四行已经确定：
$$M_{persp \to ortho} = \begin{pmatrix} n & 0 & 0 & 0 \cr 0 & n & 0 & 0 \cr ? & ? & ? & ? \cr 0 & 0 & 1 & 0 \end{pmatrix}$$
  3. **利用两个特殊条件求第三行 $(A, B)$：**
     * **条件一：近平面 $z = n$ 上的所有点，压扁后 $z$ 轴坐标完全不变。**
代入 $z = n$：
$$\begin{pmatrix} 0 & 0 & A & B \end{pmatrix} \begin{pmatrix} x \cr y \cr n \cr 1 \end{pmatrix} = n^2 \implies An + B = n^2$$
     * **条件二：远平面 $z = f$ 上的中心点 $(0, 0, f)$，压扁后 $z$ 轴坐标也不变。**
代入 $z = f$：
$$Af + B = f^2$$
解二元一次方程组：
$$\begin{cases} An + B = n^2 \cr Af + B = f^2 \end{cases} \implies A = n + f, \quad B = -nf$$ 
  4. **最终压扁矩阵 $M_{persp \to ortho}$：**
$$M_{persp \to ortho} = \begin{pmatrix} n & 0 & 0 & 0 \cr 0 & n & 0 & 0 \cr 0 & 0 & n+f & -nf \cr 0 & 0 & 1 & 0 \end{pmatrix}$$


  * **常考思考题：** 视锥体被压扁成长方体的过程中，中间点的 $z$ 值是变近了还是变远了？
    * **答案：变远了** （即点会向远离相机的远平面方向推送）。


##  [](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#%E5%9B%9B%E3%80%81-%E8%A7%86%E9%94%A5%E4%BD%93%E5%8F%82%E6%95%B0%EF%BC%9AFOV-%E4%B8%8E-Aspect-Ratio "四、 视锥体参数：FOV 与 Aspect Ratio")四、 视锥体参数：FOV 与 Aspect Ratio
在实际游戏引擎（如 Unity / Unreal）中，我们通常不需要手动传 $l, r, b, t$，而是通过两个更直观的参数定义透视视锥体：
  1. **垂直视角 (Vertical Field of View, fovY)：** 相机上下能看到的张角。
  2. **宽高比 (Aspect Ratio = width / height)：** 屏幕宽与高的比例。


两者与 $l, r, b, t$ 的转换公式为：
  * $t = \vert{}n\vert{} \cdot \tan\left(\frac{fovY}{2}\right)$
  * $b = -t$
  * $r = t \cdot \text{aspect}$
  * $l = -r$


文章作者: [秃头的君寻酱](https://xun-cmd.github.io)
文章链接: <https://xun-cmd.github.io/2026/08/28/GAMES101/04/>
版权声明: 本博客所有文章除特别声明外，均采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。转载请注明来源 [秃头的君寻酱](https://xun-cmd.github.io)！
[计算机图形学](https://xun-cmd.github.io/tags/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9B%BE%E5%BD%A2%E5%AD%A6/)[游戏开发](https://xun-cmd.github.io/tags/%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91/)
[](https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fxun-cmd.github.io%2F2026%2F08%2F28%2FGAMES101%2F04%2F)[](https://twitter.com/intent/tweet?text=GAMES101%2004%20%7C%20%E7%A7%83%E5%A4%B4%E7%9A%84%E5%90%9B%E5%AF%BB%E9%85%B1&url=https%3A%2F%2Fxun-cmd.github.io%2F2026%2F08%2F28%2FGAMES101%2F04%2F&via=https%3A%2F%2Fxun-cmd.github.io)#### [微信扫一扫：分享 微信里点“发现”，扫一下 二维码便可将本文分享至朋友圈。 ](javascript:)[](https://service.weibo.com/share/share.php?url=https%3A%2F%2Fxun-cmd.github.io%2F2026%2F08%2F28%2FGAMES101%2F04%2F&title=GAMES101%2004%20%7C%20%E7%A7%83%E5%A4%B4%E7%9A%84%E5%90%9B%E5%AF%BB%E9%85%B1&pic=%2F2026%2F08%2F28%2FGAMES101%2F04%2F%25E5%25B0%2581%25E9%259D%25A2.png&appkey=)[](http://connect.qq.com/widget/shareqq/index.html?url=https%3A%2F%2Fxun-cmd.github.io%2F2026%2F08%2F28%2FGAMES101%2F04%2F&title=GAMES101%2004%20%7C%20%E7%A7%83%E5%A4%B4%E7%9A%84%E5%90%9B%E5%AF%BB%E9%85%B1&source=GAMES101%2004%20%7C%20%E7%A7%83%E5%A4%B4%E7%9A%84%E5%90%9B%E5%AF%BB%E9%85%B1&desc=%E8%BD%AC%E6%8D%A2&pics=%2F2026%2F08%2F28%2FGAMES101%2F04%2F%25E5%25B0%2581%25E9%259D%25A2.png&summary="%E8%BD%AC%E6%8D%A2")
[![cover of previous post](https://xun-cmd.github.io/2026/08/25/GAMES101/01-03/%E5%B0%81%E9%9D%A2.png) 上一篇 GAMES101 01-03 对于前三节课程的复习 ](https://xun-cmd.github.io/2026/08/25/GAMES101/01-03/ "GAMES101 01-03")
相关推荐
[![cover](https://xun-cmd.github.io/2026/08/25/GAMES101/01-03/%E5%B0%81%E9%9D%A2.png) 2026-08-25 GAMES101 01-03 对于前三节课程的复习 ](https://xun-cmd.github.io/2026/08/25/GAMES101/01-03/ "GAMES101 01-03")
![avatar](https://xun-cmd.github.io/img/junxun.jpg)
秃头的君寻酱
计算机学习、日常碎片
[文章 17](https://xun-cmd.github.io/archives/)[标签 12](https://xun-cmd.github.io/tags/)[分类 7](https://xun-cmd.github.io/categories/)
[Follow Me](https://github.com/Xun-cmd)
[](https://github.com/Xun-cmd "Github")[](https://m.bilibili.com/space/414858541 "bilibili")
公告
欢迎来到君寻酱的博客(●ˇ∀ˇ●)
目录
  1. [1. 前言](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#%E5%89%8D%E8%A8%80)
    1. [1.1. 一、 3D 变换与齐次坐标 (3D Transformations)](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#%E4%B8%80%E3%80%81-3D-%E5%8F%98%E6%8D%A2%E4%B8%8E%E9%BD%90%E6%AC%A1%E5%9D%90%E6%A0%87-3D-Transformations)
      1. [1.1.1. 1. 3D 齐次坐标](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#1-3D-%E9%BD%90%E6%AC%A1%E5%9D%90%E6%A0%87)
      2. [1.1.2. 2. 3D 旋转矩阵的“小陷阱”](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#2-3D-%E6%97%8B%E8%BD%AC%E7%9F%A9%E9%98%B5%E7%9A%84%E2%80%9C%E5%B0%8F%E9%99%B7%E9%98%B1%E2%80%9D)
      3. [1.1.3. 3. 欧拉角与罗德里格斯公式](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#3-%E6%AC%A7%E6%8B%89%E8%A7%92%E4%B8%8E%E7%BD%97%E5%BE%B7%E9%87%8C%E6%A0%BC%E6%96%AF%E5%85%AC%E5%BC%8F)
    2. [1.2. 二、 视图/相机变换 (View / Camera Transformation)](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#%E4%BA%8C%E3%80%81-%E8%A7%86%E5%9B%BE-%E7%9B%B8%E6%9C%BA%E5%8F%98%E6%8D%A2-View-Camera-Transformation)
      1. [1.2.1. 1. 定义相机三要素](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#1-%E5%AE%9A%E4%B9%89%E7%9B%B8%E6%9C%BA%E4%B8%89%E8%A6%81%E7%B4%A0)
      2. [1.2.2. 2. 标准相机位置 (Canonical Camera)](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#2-%E6%A0%87%E5%87%86%E7%9B%B8%E6%9C%BA%E4%BD%8D%E7%BD%AE-Canonical-Camera)
      3. [1.2.3. 3. 视图变换矩阵 $M_{view}$ 的推导（逆向思考技巧）](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#3-%E8%A7%86%E5%9B%BE%E5%8F%98%E6%8D%A2%E7%9F%A9%E9%98%B5-M-view-%E7%9A%84%E6%8E%A8%E5%AF%BC%EF%BC%88%E9%80%86%E5%90%91%E6%80%9D%E8%80%83%E6%8A%80%E5%B7%A7%EF%BC%89)
    3. [1.3. 三、 投影变换 (Projection Transformation)](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#%E4%B8%89%E3%80%81-%E6%8A%95%E5%BD%B1%E5%8F%98%E6%8D%A2-Projection-Transformation)
      1. [1.3.1. 1. 正交投影 (Orthographic Projection)](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#1-%E6%AD%A3%E4%BA%A4%E6%8A%95%E5%BD%B1-Orthographic-Projection)
      2. [1.3.2. 2. 透视投影 (Perspective Projection)——最难也是最重要的点！](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#2-%E9%80%8F%E8%A7%86%E6%8A%95%E5%BD%B1-Perspective-Projection-%E2%80%94%E2%80%94%E6%9C%80%E9%9A%BE%E4%B9%9F%E6%98%AF%E6%9C%80%E9%87%8D%E8%A6%81%E7%9A%84%E7%82%B9%EF%BC%81)
        1. [1.3.2.0.1. 关键步骤：如何推导“压扁”矩阵 $M_{persp \to ortho}$？](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#%E5%85%B3%E9%94%AE%E6%AD%A5%E9%AA%A4%EF%BC%9A%E5%A6%82%E4%BD%95%E6%8E%A8%E5%AF%BC%E2%80%9C%E5%8E%8B%E6%89%81%E2%80%9D%E7%9F%A9%E9%98%B5-M-persp-to-ortho-%EF%BC%9F)
  2. [1.4. 四、 视锥体参数：FOV 与 Aspect Ratio](https://xun-cmd.github.io/2026/08/28/GAMES101/04/#%E5%9B%9B%E3%80%81-%E8%A7%86%E9%94%A5%E4%BD%93%E5%8F%82%E6%95%B0%EF%BC%9AFOV-%E4%B8%8E-Aspect-Ratio)


最新文章
[![GAMES101 04](https://xun-cmd.github.io/2026/08/28/GAMES101/04/%E5%B0%81%E9%9D%A2.png)](https://xun-cmd.github.io/2026/08/28/GAMES101/04/ "GAMES101 04")
[GAMES101 04](https://xun-cmd.github.io/2026/08/28/GAMES101/04/ "GAMES101 04")2026-08-28
[![GAMES101 01-03](https://xun-cmd.github.io/2026/08/25/GAMES101/01-03/%E5%B0%81%E9%9D%A2.png)](https://xun-cmd.github.io/2026/08/25/GAMES101/01-03/ "GAMES101 01-03")
[GAMES101 01-03](https://xun-cmd.github.io/2026/08/25/GAMES101/01-03/ "GAMES101 01-03")2026-08-25
[![线索二叉树](https://xun-cmd.github.io/2025/12/20/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/%E7%BA%BF%E7%B4%A2%E4%BA%8C%E5%8F%89%E6%A0%91/%E5%B0%81%E9%9D%A2.png)](https://xun-cmd.github.io/2025/12/20/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/%E7%BA%BF%E7%B4%A2%E4%BA%8C%E5%8F%89%E6%A0%91/ "线索二叉树")
[线索二叉树](https://xun-cmd.github.io/2025/12/20/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/%E7%BA%BF%E7%B4%A2%E4%BA%8C%E5%8F%89%E6%A0%91/ "线索二叉树")2025-12-20
[![数字逻辑期末复习四](https://xun-cmd.github.io/2025/12/12/%E6%95%B0%E5%AD%97%E9%80%BB%E8%BE%91/%E6%95%B0%E5%AD%97%E9%80%BB%E8%BE%91%E6%9C%9F%E6%9C%AB%E5%A4%8D%E4%B9%A0%EF%BC%884%EF%BC%89/%E5%B0%81%E9%9D%A2.png)](https://xun-cmd.github.io/2025/12/12/%E6%95%B0%E5%AD%97%E9%80%BB%E8%BE%91/%E6%95%B0%E5%AD%97%E9%80%BB%E8%BE%91%E6%9C%9F%E6%9C%AB%E5%A4%8D%E4%B9%A0%EF%BC%884%EF%BC%89/ "数字逻辑期末复习四")
[数字逻辑期末复习四](https://xun-cmd.github.io/2025/12/12/%E6%95%B0%E5%AD%97%E9%80%BB%E8%BE%91/%E6%95%B0%E5%AD%97%E9%80%BB%E8%BE%91%E6%9C%9F%E6%9C%AB%E5%A4%8D%E4%B9%A0%EF%BC%884%EF%BC%89/ "数字逻辑期末复习四")2025-12-12
[![数字逻辑期末复习三](https://xun-cmd.github.io/2025/12/09/%E6%95%B0%E5%AD%97%E9%80%BB%E8%BE%91/%E6%95%B0%E5%AD%97%E9%80%BB%E8%BE%91%E6%9C%9F%E6%9C%AB%E5%A4%8D%E4%B9%A0%EF%BC%883%EF%BC%89/%E5%B0%81%E9%9D%A2.png)](https://xun-cmd.github.io/2025/12/09/%E6%95%B0%E5%AD%97%E9%80%BB%E8%BE%91/%E6%95%B0%E5%AD%97%E9%80%BB%E8%BE%91%E6%9C%9F%E6%9C%AB%E5%A4%8D%E4%B9%A0%EF%BC%883%EF%BC%89/ "数字逻辑期末复习三")
[数字逻辑期末复习三](https://xun-cmd.github.io/2025/12/09/%E6%95%B0%E5%AD%97%E9%80%BB%E8%BE%91/%E6%95%B0%E5%AD%97%E9%80%BB%E8%BE%91%E6%9C%9F%E6%9C%AB%E5%A4%8D%E4%B9%A0%EF%BC%883%EF%BC%89/ "数字逻辑期末复习三")2025-12-09
©2019 - 2026 By 秃头的君寻酱
很高兴认识你
搜索
数据加载中
* * *
