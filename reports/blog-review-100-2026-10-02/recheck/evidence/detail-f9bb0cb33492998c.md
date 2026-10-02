# [Zgao's blog](https://zgao.top/)
愿有一日，安全圈的师傅们都能用上Zgao写的工具。
Toggle navigation
  * [工具箱](https://zgao.top/tool/)
  * [文章归档](https://zgao.top/archives/)
  * [关于我](https://zgao.top/about-me/)
  * [github](https://github.com/zgao264)
  * Gmail


# Archive6月 2026
  * [首页](https://zgao.top)
  * [2026年](https://zgao.top/2026%E5%B9%B4/)
  * [6月](https://zgao.top:443/2026/06/)


[6月 27, 2026](https://zgao.top/2026/06/)
### [不同数据库被”拖库”特征-托管vs自建+是/否开启审计日志取证实测](https://zgao.top/%e4%b8%8d%e5%90%8c%e6%95%b0%e6%8d%ae%e5%ba%93%e8%a2%ab%e6%8b%96%e5%ba%93%e7%89%b9%e5%be%81-%e6%89%98%e7%ae%a1vs%e8%87%aa%e5%bb%ba%e6%98%af-%e5%90%a6%e5%bc%80%e5%90%af%e5%ae%a1%e8%ae%a1%e6%97%a5/)
作者 [Zgao](https://zgao.top/author/zgao/) 在[](https://zgao.top/%e4%b8%8d%e5%90%8c%e6%95%b0%e6%8d%ae%e5%ba%93%e8%a2%ab%e6%8b%96%e5%ba%93%e7%89%b9%e5%be%81-%e6%89%98%e7%ae%a1vs%e8%87%aa%e5%bb%ba%e6%98%af-%e5%90%a6%e5%bc%80%e5%90%af%e5%ae%a1%e8%ae%a1%e6%97%a5/)[应急响应](https://zgao.top/category/%e5%ba%94%e6%80%a5%e5%93%8d%e5%ba%94/)
在入侵类应急响应中，客户最常见的诉求之一是：**“帮我判断数据库到底有没有被黑客拖库？”** 但数据库类型种类众多，每种数据库的拖库手法、留下的痕迹、可用的取证手段都不一样；而且**是否开启了审计日志** ，直接决定了能拿到的证据等级。
本文在腾讯云上用 tccli 真实开通了 **7 种托管数据库** ，插入 10 万行/文档级别的敏感样本数据（身份证、手机号、银行卡、密码哈希），分别在 **不开审计 / 开启审计** 两种情况下模拟拖库；并对其中差异最大的 **SQL Server、Elasticsearch、Redis、MySQL、PostgreSQL 额外做了「自建 vs 托管」对照实测** （自建实例上启用原生审计、复现托管版封掉的危险能力）。每个结论都附实际抓取的日志/截图，最后给出应急响应取证清单与加固建议。
全文所有日志、命令、API 输出均为真实实测结果。
[阅读更多](https://zgao.top/%e4%b8%8d%e5%90%8c%e6%95%b0%e6%8d%ae%e5%ba%93%e8%a2%ab%e6%8b%96%e5%ba%93%e7%89%b9%e5%be%81-%e6%89%98%e7%ae%a1vs%e8%87%aa%e5%bb%ba%e6%98%af-%e5%90%a6%e5%bc%80%e5%90%af%e5%ae%a1%e8%ae%a1%e6%97%a5/#more-8046)
[6月 14, 2026](https://zgao.top/2026/06/)
### [k8s-拿下Master权限后的Shadow API Server 持久化后门排查](https://zgao.top/k8s-%e6%8b%bf%e4%b8%8bmaster%e6%9d%83%e9%99%90%e5%90%8e%e7%9a%84shadow-api-server-%e6%8c%81%e4%b9%85%e5%8c%96%e5%90%8e%e9%97%a8%e6%8e%92%e6%9f%a5/)
作者 [Zgao](https://zgao.top/author/zgao/) 在[](https://zgao.top/k8s-%e6%8b%bf%e4%b8%8bmaster%e6%9d%83%e9%99%90%e5%90%8e%e7%9a%84shadow-api-server-%e6%8c%81%e4%b9%85%e5%8c%96%e5%90%8e%e9%97%a8%e6%8e%92%e6%9f%a5/)[应急响应](https://zgao.top/category/%e5%ba%94%e6%80%a5%e5%93%8d%e5%ba%94/)
Shadow API Server（影子 API 服务器）是更顽固的持久化方式——攻击者在 master 节点上 部署**第二个 kube-apiserver 进程** ，它连接相同的 etcd，但完全绕过 RBAC 鉴权。 即使防御方清空所有 ClusterRoleBinding、轮换所有证书，只要这个进程还在，集群就还是攻击者的。
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
攻击者（已获取 master root 权限）
│
├─ 1. 读取 /etc/kubernetes/manifests/kube-apiserver.yaml
│ 获取 etcd 连接参数、证书路径、镜像版本
│
├─ 2. 写入恶意 Static Pod Manifest
│ /etc/kubernetes/manifests/kube-scheduler-extender.yaml
│ 关键参数：--authorization-mode=AlwaysAllow --secure-port=6444
│
├─ 3. kubelet 自动拉起 shadow kube-apiserver（端口 6444）
│ 连接相同 etcd，但 --authorization-mode=AlwaysAllow 无视 RBAC
│
├─ 4. 用集群 CA 签发的任意证书连接 6444
│ → 不受 RBAC 约束，全集群读写权限
│
└─ 5. 防御方清空 RBAC / 轮换证书 → 无效
shadow API server 依然存在，kubelet 会自动重启它
攻击者（已获取 master root 权限） │ ├─ 1. 读取 /etc/kubernetes/manifests/kube-apiserver.yaml │ 获取 etcd 连接参数、证书路径、镜像版本 │ ├─ 2. 写入恶意 Static Pod Manifest │ /etc/kubernetes/manifests/kube-scheduler-extender.yaml │ 关键参数：--authorization-mode=AlwaysAllow --secure-port=6444 │ ├─ 3. kubelet 自动拉起 shadow kube-apiserver（端口 6444） │ 连接相同 etcd，但 --authorization-mode=AlwaysAllow 无视 RBAC │ ├─ 4. 用集群 CA 签发的任意证书连接 6444 │ → 不受 RBAC 约束，全集群读写权限 │ └─ 5. 防御方清空 RBAC / 轮换证书 → 无效 shadow API server 依然存在，kubelet 会自动重启它

```
攻击者（已获取 master root 权限）
  │
  ├─ 1. 读取 /etc/kubernetes/manifests/kube-apiserver.yaml
  │     获取 etcd 连接参数、证书路径、镜像版本
  │
  ├─ 2. 写入恶意 Static Pod Manifest
  │     /etc/kubernetes/manifests/kube-scheduler-extender.yaml
  │     关键参数：--authorization-mode=AlwaysAllow  --secure-port=6444
  │
  ├─ 3. kubelet 自动拉起 shadow kube-apiserver（端口 6444）
  │     连接相同 etcd，但 --authorization-mode=AlwaysAllow 无视 RBAC
  │
  ├─ 4. 用集群 CA 签发的任意证书连接 6444
  │     → 不受 RBAC 约束，全集群读写权限
  │
  └─ 5. 防御方清空 RBAC / 轮换证书 → 无效
         shadow API server 依然存在，kubelet 会自动重启它
```
[阅读更多](https://zgao.top/k8s-%e6%8b%bf%e4%b8%8bmaster%e6%9d%83%e9%99%90%e5%90%8e%e7%9a%84shadow-api-server-%e6%8c%81%e4%b9%85%e5%8c%96%e5%90%8e%e9%97%a8%e6%8e%92%e6%9f%a5/#more-8044)
[6月 9, 2026](https://zgao.top/2026/06/)
### [k8s-kubeconfig泄露后的RBAC持久化后门排查](https://zgao.top/k8s-kubeconfig%e6%b3%84%e9%9c%b2%e5%90%8e%e7%9a%84rbac%e6%8c%81%e4%b9%85%e5%8c%96%e5%90%8e%e9%97%a8%e6%8e%92%e6%9f%a5/)
作者 [Zgao](https://zgao.top/author/zgao/) 在[](https://zgao.top/k8s-kubeconfig%e6%b3%84%e9%9c%b2%e5%90%8e%e7%9a%84rbac%e6%8c%81%e4%b9%85%e5%8c%96%e5%90%8e%e9%97%a8%e6%8e%92%e6%9f%a5/)[应急响应](https://zgao.top/category/%e5%ba%94%e6%80%a5%e5%93%8d%e5%ba%94/)
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
攻击者
│
├─ 1. 使用泄露 kubeconfig 连接公网 apiserver
│
├─ 2. 创建后门 ServiceAccount（伪装成系统组件名）
│
├─ 3. 创建 ClusterRole（全权限）
│
├─ 4. 创建 ClusterRoleBinding（将后门 SA 绑定到 cluster-admin）
│
├─ 5. 用 TokenRequest API 生成长期 token（不存储在 apiserver，难以追踪）
│
└─ 6. 防御方删除原始 kubeconfig 对应的 RBAC binding
↓
原始 kubeconfig → Forbidden （请求被拒绝）
后门 SA token → cluster-admin 全权限 （仍能正常使用）
攻击者 │ ├─ 1. 使用泄露 kubeconfig 连接公网 apiserver │ ├─ 2. 创建后门 ServiceAccount（伪装成系统组件名） │ ├─ 3. 创建 ClusterRole（全权限） │ ├─ 4. 创建 ClusterRoleBinding（将后门 SA 绑定到 cluster-admin） │ ├─ 5. 用 TokenRequest API 生成长期 token（不存储在 apiserver，难以追踪） │ └─ 6. 防御方删除原始 kubeconfig 对应的 RBAC binding ↓ 原始 kubeconfig → Forbidden （请求被拒绝） 后门 SA token → cluster-admin 全权限 （仍能正常使用）

```
攻击者
  │
  ├─ 1. 使用泄露 kubeconfig 连接公网 apiserver
  │
  ├─ 2. 创建后门 ServiceAccount（伪装成系统组件名）
  │
  ├─ 3. 创建 ClusterRole（全权限）
  │
  ├─ 4. 创建 ClusterRoleBinding（将后门 SA 绑定到 cluster-admin）
  │
  ├─ 5. 用 TokenRequest API 生成长期 token（不存储在 apiserver，难以追踪）
  │
  └─ 6. 防御方删除原始 kubeconfig 对应的 RBAC binding
         ↓
       原始 kubeconfig → Forbidden （请求被拒绝）
       后门 SA token  → cluster-admin 全权限 （仍能正常使用）

```

经验丰富的攻击者拿到一份泄露的 kubeconfig（cluster-admin 权限）后，**第一件事可能不是立刻操作，而是先给自己埋一个独立的后门** ——即使原始 kubeconfig 被吊销，后门依然有效。`kubeadm certs renew` 和删除 ClusterRoleBinding 对已植入的后门无效，因为后门使用独立的身份凭证。
[阅读更多](https://zgao.top/k8s-kubeconfig%e6%b3%84%e9%9c%b2%e5%90%8e%e7%9a%84rbac%e6%8c%81%e4%b9%85%e5%8c%96%e5%90%8e%e9%97%a8%e6%8e%92%e6%9f%a5/#more-8026)
[6月 8, 2026](https://zgao.top/2026/06/)
### [k8s KubeConfig泄露-黑客远程调用ApiServer创建特权容器获取Node节点权限应急排查](https://zgao.top/k8s-kubeconfig%e6%b3%84%e9%9c%b2-%e9%bb%91%e5%ae%a2%e8%bf%9c%e7%a8%8b%e8%b0%83%e7%94%a8apiserver%e5%88%9b%e5%bb%ba%e7%89%b9%e6%9d%83%e5%ae%b9%e5%99%a8%e8%8e%b7%e5%8f%96node%e8%8a%82%e7%82%b9%e6%9d%83/)
作者 [Zgao](https://zgao.top/author/zgao/) 在[](https://zgao.top/k8s-kubeconfig%e6%b3%84%e9%9c%b2-%e9%bb%91%e5%ae%a2%e8%bf%9c%e7%a8%8b%e8%b0%83%e7%94%a8apiserver%e5%88%9b%e5%bb%ba%e7%89%b9%e6%9d%83%e5%ae%b9%e5%99%a8%e8%8e%b7%e5%8f%96node%e8%8a%82%e7%82%b9%e6%9d%83/)[应急响应](https://zgao.top/category/%e5%ba%94%e6%80%a5%e5%93%8d%e5%ba%94/)
近2年的应急响应案例中，k8s的入侵案例逐渐增多。并且多次遇到客户云上内网被入侵后黑客窃取了KubeConfig文件，从公网远程调用ApiServer创建容器获取Node服务器权限植入后门的案例。
Plain text
Copy to clipboard
Open code in new window
EnlighterJS 3 Syntax Highlighter
开发者/CI 系统的 kubeconfig 文件泄露到 Git / 日志 / 备份
│
▼ 黑客获取该文件
黑客在公网直接调用 apiserver（6443 端口）
│
▼ 权限确认为 cluster-admin
黑客创建一个特权 Pod，挂载宿主机根目录
│
▼ kubectl exec 进容器
chroot / nsenter 拿到 Node 宿主机的 root shell
│
▼
完全控制该 Node 宿主机
开发者/CI 系统的 kubeconfig 文件泄露到 Git / 日志 / 备份 │ ▼ 黑客获取该文件 黑客在公网直接调用 apiserver（6443 端口） │ ▼ 权限确认为 cluster-admin 黑客创建一个特权 Pod，挂载宿主机根目录 │ ▼ kubectl exec 进容器 chroot / nsenter 拿到 Node 宿主机的 root shell │ ▼ 完全控制该 Node 宿主机

```
开发者/CI 系统的 kubeconfig 文件泄露到 Git / 日志 / 备份
        │
        ▼  黑客获取该文件
黑客在公网直接调用 apiserver（6443 端口）
        │
        ▼  权限确认为 cluster-admin
黑客创建一个特权 Pod，挂载宿主机根目录
        │
        ▼  kubectl exec 进容器
chroot / nsenter 拿到 Node 宿主机的 root shell
        │
        ▼
完全控制该 Node 宿主机
```

泄露途径非常多样：`.kube/config` 被 `git add -A` 带进仓库、CI 流水线打印了 KUBECONFIG 环境变量、开发者把 kubeconfig 存到共享网盘……一旦泄露，攻击者就能以持有人的身份操作集群，而集群本身不会有任何告警。
[阅读更多](https://zgao.top/k8s-kubeconfig%e6%b3%84%e9%9c%b2-%e9%bb%91%e5%ae%a2%e8%bf%9c%e7%a8%8b%e8%b0%83%e7%94%a8apiserver%e5%88%9b%e5%bb%ba%e7%89%b9%e6%9d%83%e5%ae%b9%e5%99%a8%e8%8e%b7%e5%8f%96node%e8%8a%82%e7%82%b9%e6%9d%83/#more-8000)
版权©2020 Author By : Zgao
[](https://zgao.top/2026/06/)
