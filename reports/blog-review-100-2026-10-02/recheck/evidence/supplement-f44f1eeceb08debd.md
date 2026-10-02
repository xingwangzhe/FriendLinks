![logo](https://dyedd.cn/logo.jpg)
  * [🏠 首页](https://dyedd.cn/)
  * [📂 文章](https://dyedd.cn/posts)
  * [🧠 专栏](https://dyedd.cn/columns)
  * [🚀 项目](https://dyedd.cn/projects)
  * 📸 朋友
    * [👥 友链](https://dyedd.cn/friends)
    * [🎉 朋友圈](https://dyedd.cn/moments)


[首页](https://dyedd.cn/)/[所有文章](https://dyedd.cn/posts)/解读 TAOT：MoE 动态副本调度优化 EP 负载的新思路
# 解读 TAOT：MoE 动态副本调度优化 EP 负载的新思路
August 18, 2026
12 分钟阅读
[ai infra](https://dyedd.cn/tags/ai%20infra)[moe](https://dyedd.cn/tags/moe)[并行训练](https://dyedd.cn/tags/%E5%B9%B6%E8%A1%8C%E8%AE%AD%E7%BB%83)
![Post cover](https://dyedd.cn/assets/posts/taot-moe-speedup/overview.png)
我常说自己现在是研究训练 infra 的，但回顾自己在个人博客等平台发表的文章，一直没有在这个方向有所产出。所以，借着这次契机来分享和学习一下我们团队最近发表的一篇关于专家并行不均衡问题的文章吧。
##  背景 
论文地址：<https://arxiv.org/pdf/2608.03676>
![](https://dyedd.cn/assets/posts/taot-moe-speedup/ed05999902a108aa30448755c7d786a6.jpg) 翻译一下， _TAOT：面向混合专家模型训练中动态专家副本放置的拓扑感知最优传输方法_
这篇论文名称看似复杂，实际上还是解决MoE一个老生常谈的负载不均衡问题，即我们在做EP并行的时候，每张卡能处理多少token，完全由路由动态分配，如果我们不进行人为的干预，那么就会造成某些卡一直在计算，而某些卡一直或者不间断的空闲摸鱼。
![](https://dyedd.cn/assets/posts/taot-moe-speedup/image.png) 所以，这个问题要治！
其实业界和学术界有许多应对思路，在算法层面，像DeepSeek等MoE系列论文就在不停创新一些辅助损失函数方法来追求统计上的长期平衡；而在系统方面，则是保持路由策略不变，通过动态调整计算资源的分配来解决负载不均。例如如果某个专家的计算量过高，它会临时复制一份权重放到空闲卡上，由这张卡分担一部分计算。这就是动态复制专家 (Hot-Expert Replication)，也是本篇论文的聚焦点。
**本篇论文站在系统方法的肩膀上发现这些方法几乎只关注“如何平衡负载”，却忽略了“平衡负载本身的成本”** 。
一般来说，我们实现的都是大规模EP并行，那就不仅仅要在机内通信，还要在机与机之间。而同一台机器内的GPU通过NVLink/PCIe互联，跨机器之间则通过InfiniBand。两者之间的传输速度不同。这意味着，**把一个专家从同服务器的GPU复制过来成本很低，但从另一台服务器复制过来成本则高昂得多** 。
现有的动态复制方法，为了追求极致的负载均衡，可能会把一个热门专家复制到远在另一台服务器的GPU上。这种跨节点的通信开销，很可能**超过了复制专家所带来的计算收益，最终导致训练反而更慢** 。
##  方法 
那 TAOT 是怎么解的呢？TAOT**在追求负载平衡的同时，把通信开销也一起算进去** 。
![](https://dyedd.cn/assets/posts/taot-moe-speedup/overview.png) 具体是使用一个三阶段规划器，从 rank 级到专家级再到 token 级，由粗到细。之所以要拆成三段，是因为把“均衡”和“通信代价”塞进同一个联合优化问题里，规模会随 EP 爆炸，一次性求解并不现实。
###  Phase 1：Sinkhorn-Knopp 拓扑感知流规划（rank 级） 
这一步的做法是把每个 rank 超出来的那部分负载当成“供给”，把空闲 rank 的剩余容量当成“需求”，再配上一个表示机内便宜、跨机贵的拓扑代价矩阵 WW，最终求一个最优传输（OT）方案。
原始 OT 要跑线性规划，对GPU计算不友好。但是加一个负熵正则项做松弛之后，最优解会呈现 Gibbs 核结构 T=diag(u)Mdiag(v)T=\mathrm{diag}(u)\,M\,\mathrm{diag}(v)，只需要交替做几轮 GEMV 迭代（也就是 Sinkhorn-Knopp）就能收敛，全程矩阵向量乘：
u(t+1)=sMv(t),v(t+1)=dM⊤u(t+1)\mathbf{u}^{(t+1)} = \frac{\mathbf{s}}{M\,\mathbf{v}^{(t)}}, \quad \mathbf{v}^{(t+1)} = \frac{\mathbf{d}}{M^\top \mathbf{u}^{(t+1)}}
这里再把正则系数直接取成跨节点代价 λ\lambda 之后，节点内与跨节点的核值之比天然大于 1，直接可以来表示机内便宜、跨机贵的软拓扑偏好。
###  Phase 2：列优先迭代匹配（专家级） 
Phase 1 算出来的只是“这张卡该往那张卡挪多少负载”这种连续的量，但真到放副本的时候没法这么灵活：一份专家权重要么整个复制过去，要么就不复制，没有中间状态，而且一张空闲卡上最多也只能放 K 份副本。更麻烦的是，好几张空闲卡可能同时想接同一个计算量最大的专家。所以这一步要把那张流量表落成一个明确答案：**哪个专家复制到哪张卡上** 。
判断标准是下面这个三级打分，均衡收益、拓扑、Phase 1 给的 OT 提示依次让位，前一项打平了才轮到后一项说话：
scoreer=min⁡(rem_spille,rem_sparer)⏟主分：均衡改善量+αBer⏟次分：拓扑+0.1α(Ter)norm⏟第三：OT 提示\text{score}_{er} = \underbrace{\min(\text{rem\\_spill}_e,\ \text{rem\\_spare}_r)}_{\text{主分：均衡改善量}} + \alpha \underbrace{B_{er}}_{\text{次分：拓扑}} + 0.1\alpha \underbrace{(T_{\text{er}})_{\text{norm}}}_{\text{第三：OT 提示}}
比公式更关键的其实是遍历顺序，因为 scoreer\text{score}_{er} 的行是专家、列是卡，而贪心一次只能敲定一格，先算谁就等于把选择权先给谁。如果按专家做外层循环（行优先），那么排在前面的几个计算量最大的专家会一路挑下去，直到自己多出来的 token 被消化完才轮到下一个，空闲卡上的位置就这样被头部几个专家先占掉了，而排在后面那批同样过载的专家一点缓解都拿不到，它们所在的卡照旧要算到最后。
所以 TAOT 换成了站在空闲卡视角的列优先匹配，每一轮让每张还有空位的卡各自挑一个最合适的专家，撞车了再仲裁，没挑到的卡进下一轮继续挑，这样副本会自然摊到更多专家身上，而且还能把“就近”这件事交给最清楚自己位置的卡去判断。
###  Phase 3：拉格朗日拍卖 token 分配（token 级） 
Phase 2 只定了“专家一共给某张卡分多少 token”，但专家的 token 本来就散在好几张过载卡上，还得决定每张过载卡各发多少。按比例硬切有两个毛病，一是浮点截断误差，二是完全没用上拓扑信息。
TAOT 的做法是给每张卡的容量约束挂一个拉格朗日乘子，把它当作“价格”，每轮各方按“拓扑收益减去当前价格”的净收益去竞价，谁中标谁的价格就往上涨，下一轮竞争力自然衰减。**本质上就是一场拍卖会** ，抢手的卡越抢越贵，负载被自动摊平，就近原则也顺手融进了分配过程，而且迭代次数固定，天然兼容 CUDA Graph。
###  算法之外：两道工程上的坎 
方法讲完了，但要真把它塞进训练流程，还有两件绕不开的事。
####  第一道坎：kernel太碎了 
上面的过程其实并不轻量，而且它还得**逐 microbatch 实时跑** 。如果规划本身开销过高，通信侧省下来的收益很容易被原地抵消。论文给自己定的线是规划耗时不到一次前反向（F+B）的 1%，所以还要做**算子级工程** 。
问题主要出在小规模配置上。EP8、EP16 这种配置下，规划的真实 GPU 计算量本来就小得可怜，可原始 PyTorch 写法每调用一次都会触发一堆小 kernel，重建张量、跑 50 轮 Sinkhorn、循环 K 轮 Phase 2，加起来几百次 launch。这时候 host 端的启动开销已经远超 GPU 实际计算的时间。
所以 TAOT 用 Triton 重写了这套逻辑，从三个方向把 launch 次数砍下来：
  * **静态张量缓存。**拓扑代价矩阵 MM、每个专家原本所在的卡、拓扑偏好这些量，只跟拓扑配置（R、E、每节点卡数、跨节点代价）有关，跟 token 怎么分毫无关系，整个训练过程中都不变。原始实现每次都重新构建，白搭约 15 次 kernel launch，缓存进一个进程级字典之后，首次之后直接命中，这 15 次就省了。
  * **Phase 1 单 CTA Sinkhorn kernel。**50 轮 Sinkhorn-Knopp 原本是 50 次 `torch.mv` 加 clamp，共约 150 次 launch。因为 R ≤ 64，整个 MM、uu、vv 都塞得进寄存器，于是把 50 轮迭代整个塞进单个 CTA、编译期完全展开，150 次 launch 变 1 次，中途还省掉了 CPU-GPU 同步。
  * **Phase 2 的 K 轮融合。**把 K 轮分配融成一次 launch，`used[E,R]` 掩码全程留在寄存器里、跨轮不回写显存，最后才落盘。这里有个反直觉的取舍，内层那 R 次迭代**故意不做编译期展开**，因为一展开，`[E,R]` 临时张量就按 R 倍复制，EP16 下寄存器直接爆掉、SM 占用率崩盘，改用动态循环反倒让编译器能跨轮复用寄存器，占用率明显回升。


####  第二道坎：计算-通信重叠 
跨节点通信降下来之后，TAOT 还想再贪一点。一张卡上其实有两类专家，权重本来就在这张卡上的叫 home 专家，从别的卡复制过来的那份副本叫 guest 专家。既然 guest 专家的权重总要搬一趟，那就如下图所示，把这趟搬运**塞进同一张卡上 home 专家的计算里** 。
![](https://dyedd.cn/assets/posts/taot-moe-speedup/overview_overlap.png) FC1/FC2 两个阶段里，home 专家的 GEMM 在计算流上跑，guest 专家的 expert_dispatch 在通信流上并行搬运，靠一次同步把两者对齐，两类专家之间就实现了计算-通信重叠。
反向阶段同理，guest 专家算出的权重梯度，通过一次反向 All-to-All 送回原本所在的卡累加。这样 guest 专家机制引入的额外通信，基本都被计算掩盖掉了。
##  结果 
![](https://dyedd.cn/assets/posts/taot-moe-speedup/image2.png) ![](https://dyedd.cn/assets/posts/taot-moe-speedup/image3.png) 在包含32张NVIDIA A800 GPU 的集群和 Qwen3-30B-A3B 上，TAOT实现了**最高1.43倍的端到端训练加速** 。在达到与最先进方法同等甚至更优的负载均衡效果的同时，其**专家通信成本最高降低了74%。**
##  代码获取 
上述方法开源在 <https://github.com/baidu-baige/LoongForge>，大家可以结合AI把LoongForge 跑起来来学习。如果也是训练infra的同学，可以多多关注我们的框架。因为不仅仅本文的方法，我们也有多个在LLM/VLM/Diffusion/Embodied models上的优化哦～
###  目录 
  * [背景](https://dyedd.cn/posts/taot-moe-speedup#%E8%83%8C%E6%99%AF)
  * [方法](https://dyedd.cn/posts/taot-moe-speedup#%E6%96%B9%E6%B3%95)
    * [Phase 1：Sinkhorn-Knopp 拓扑感知流规划（rank 级）](https://dyedd.cn/posts/taot-moe-speedup#phase-1%EF%BC%9Asinkhorn-knopp-%E6%8B%93%E6%89%91%E6%84%9F%E7%9F%A5%E6%B5%81%E8%A7%84%E5%88%92%EF%BC%88rank-%E7%BA%A7%EF%BC%89)
    * [Phase 2：列优先迭代匹配（专家级）](https://dyedd.cn/posts/taot-moe-speedup#phase-2%EF%BC%9A%E5%88%97%E4%BC%98%E5%85%88%E8%BF%AD%E4%BB%A3%E5%8C%B9%E9%85%8D%EF%BC%88%E4%B8%93%E5%AE%B6%E7%BA%A7%EF%BC%89)
    * [Phase 3：拉格朗日拍卖 token 分配（token 级）](https://dyedd.cn/posts/taot-moe-speedup#phase-3%EF%BC%9A%E6%8B%89%E6%A0%BC%E6%9C%97%E6%97%A5%E6%8B%8D%E5%8D%96-token-%E5%88%86%E9%85%8D%EF%BC%88token-%E7%BA%A7%EF%BC%89)
    * [算法之外：两道工程上的坎](https://dyedd.cn/posts/taot-moe-speedup#%E7%AE%97%E6%B3%95%E4%B9%8B%E5%A4%96%EF%BC%9A%E4%B8%A4%E9%81%93%E5%B7%A5%E7%A8%8B%E4%B8%8A%E7%9A%84%E5%9D%8E)
      * [第一道坎：kernel太碎了](https://dyedd.cn/posts/taot-moe-speedup#%E7%AC%AC%E4%B8%80%E9%81%93%E5%9D%8E%EF%BC%9Akernel%E5%A4%AA%E7%A2%8E%E4%BA%86)
      * [第二道坎：计算-通信重叠](https://dyedd.cn/posts/taot-moe-speedup#%E7%AC%AC%E4%BA%8C%E9%81%93%E5%9D%8E%EF%BC%9A%E8%AE%A1%E7%AE%97-%E9%80%9A%E4%BF%A1%E9%87%8D%E5%8F%A0)
  * [结果](https://dyedd.cn/posts/taot-moe-speedup#%E7%BB%93%E6%9E%9C)
  * [代码获取](https://dyedd.cn/posts/taot-moe-speedup#%E4%BB%A3%E7%A0%81%E8%8E%B7%E5%8F%96)


### [lens|打造最强的个人LLM聚合网关系统 ](https://dyedd.cn/posts/lens_api)
@2026 染念
[Powered by serenade](https://github.com/dyedd/serenade)
本站已运行 3520 天 
[备案号:浙ICP备19020194号-1](https://beian.miit.gov.cn/)
找到我
[](https://github.com/dyedd)[](https://qm.qq.com/cgi-bin/qm/qr?k=nLIdzy8UC9VkZ0g2EwnoN1rwnxaYvFx0&jump_from=webapi&authKey=mq2RvfcTQxEgImX+XZv0tBeobeHX+wTaAxOXq7pEKdsUD+a2Hi7mIOBGEj2ZtSDJ "QQ")
