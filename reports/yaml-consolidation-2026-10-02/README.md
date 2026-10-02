# 重复 YAML 实体合并（2026-10-02）

本轮只处理共享身份模块已经认定为同一规范入口的重复记录，没有按文件名、相似站名或域名推断新的同义关系，也没有把同作者的不同博客直接合并。

合并 33 组记录，删除 33 份重复 YAML。每组以稳定文件顺序确定主记录，保留主记录元数据、补齐缺失的可选字段、合并 aliases 和 friends；来源注释和被合并记录的元数据写入保留文件的顶部注释。文件名统一为规范主 URL 的 hostname。

| 项目 | 合并前 | 合并后 |
| --- | ---: | ---: |
| 正式 YAML | 8622 | 8589 |
| 逻辑站点 | 8589 | 8589 |
| 加载时仍需合并的重复记录 | 33 | 0 |
| 原始友链引用 | 129529 | 129383 |
| 图节点 | 49322 | 49322 |
| 去重图边 | 108348 | 108348 |

原始引用减少 146 条，来自重复目标及内部自引用的消除。完整合并输出逐项相同，包括每份逻辑记录的元数据、aliases、friends；纯拓扑的节点、边、CSR 邻接数据也逐项相同。因此本轮没有丢失合并前的有效关系，也没有进一步减少图计算输入。

## 文件合并清单

| 保留文件 | 原文件 | 原始友链引用 → 合并后 |
| --- | --- | --- |
| www.bat69.com.yml | bat69.com.yml, www.bat69.com.yml | 12 → 11 |
| www.chaoswork.cn.yml | chaoswork.cn.yml, www.chaoswork.cn.yml | 16 → 10 |
| www.chenjunjie.com.yml | chenjunjie.com.yml, www.chenjunjie.com.yml | 4 → 2 |
| www.citynomads.cn.yml | citynomads.cn.yml, www.citynomads.cn.yml | 22 → 17 |
| www.cyanprobe.com.yml | cyanprobe.com.yml, www.cyanprobe.com.yml | 4 → 3 |
| www.dearzd.com.yml | dearzd.com.yml, www.dearzd.com.yml | 22 → 17 |
| www.dragongod.net.yml | dragongod.net.yml, www.dragongod.net.yml | 14 → 10 |
| www.eu5.cn.yml | eu5.cn.yml, www.eu5.cn.yml | 15 → 13 |
| www.forece.net.yml | forece.net.yml, www.forece.net.yml | 3 → 3 |
| www.fuuuy.cn.yml | fuuuy.cn.yml, www.fuuuy.cn.yml | 35 → 29 |
| www.maguang.net.yml | maguang.net.yml, www.maguang.net.yml | 35 → 29 |
| www.mgdw.org.yml | mgdw.org.yml, www.mgdw.org.yml | 7 → 5 |
| www.mydavelv.net.yml | mydavelv.net.yml, www.mydavelv.net.yml | 17 → 14 |
| www.qcyoung.com.yml | qcyoung.com.yml, www.qcyoung.com.yml | 15 → 13 |
| www.raychase.net.yml | raychase.net.yml, www.raychase.net.yml | 2 → 2 |
| www.rxx0.com.yml | rxx0.com.yml, www.rxx0.com.yml | 5 → 4 |
| www.sayxw.top.yml | sayxw.top.yml, www.sayxw.top.yml | 10 → 6 |
| www.sh1no.icu.yml | sh1no.icu.yml, www.sh1no.icu.yml | 23 → 15 |
| www.slll.info.yml | slll.info.yml, www.slll.info.yml | 17 → 12 |
| www.soojoy.net.yml | soojoy.net.yml, www.soojoy.net.yml | 9 → 6 |
| www.sqyai.com.yml | sqyai.com.yml, www.sqyai.com.yml | 25 → 18 |
| www.tkong.net.yml | tkong.net.yml, www.tkong.net.yml | 6 → 6 |
| www.wjyyy.top.yml | wjyyy.top.yml, www.wjyyy.top.yml | 38 → 32 |
| blog.xn--5ivs9a.work.yml | blog.xn--5ivs9a.work.yml, blog.某昴.work.yml | 3 → 2 |
| blog.xn--cdwq63c.top.yml | blog.xn--cdwq63c.top.yml, blog.樱花.top.yml | 12 → 6 |
| i.a632079.me.yml | a632079.me.yml, i.a632079.me.yml | 66 → 33 |
| www.deq.plus.yml | deq.plus.yml, www.deq.plus.yml | 3 → 3 |
| www.jxtxzzw.com.yml | jxtxzzw.com.yml, www.jxtxzzw.com.yml | 56 → 39 |
| www.woria.xyz.yml | woria.xyz.yml, www.woria.xyz.yml | 2 → 1 |
| www.yxjnotes.top.yml | www.yxjnotes.top.yml, yxjnotes.top.yml | 3 → 2 |
| www.zhaoyinuo.cn.yml | www.zhaoyinuo.cn.yml, zhaoyinuo.cn.yml | 8 → 5 |
| xn--e4v.xn--q9jyb4c.yml | xn--e4v.xn--q9jyb4c.yml, 椛.みんな.yml | 12 → 11 |
| xn--l9qq99d.fun.yml | xn--l9qq99d.fun.yml, 清凤.fun.yml | 13 → 9 |

完整元数据及验证结果见 report.json。仅格式化本轮修改的 YAML，解析值保持不变。临时脚本已删除；未运行 build、力导布局或全库 BFS，未创建提交或推送。其他工作区修改保留。
