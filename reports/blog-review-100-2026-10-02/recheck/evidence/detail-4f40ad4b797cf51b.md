![avatar](https://mocusez.site/_astro/head.BgWsHt6a_ZmXgyY.webp)
[ 文章 130 ](https://mocusez.site/zh-CN/posts/d355/archives/) [ 标签 0 ](https://mocusez.site/zh-CN/posts/d355/tags/) [ 分类 12 ](https://mocusez.site/zh-CN/posts/d355/categories/)
[ 归档 ](https://mocusez.site/zh-CN/archives/)
[ 分类 ](https://mocusez.site/zh-CN/categories/)
[ 友链&私人收藏 ](https://mocusez.site/zh-CN/link/)
[ 留言板 ](https://mocusez.site/zh-CN/board/)
语言
  * [ 中文 ](https://mocusez.site/zh-CN/)
  * [ English ](https://mocusez.site/en/)


[ Mox的笔记库 ](https://mocusez.site/zh-CN/) [ Mox的笔记库 ](https://mocusez.site/zh-CN/)
搜索
[ 归档 ](https://mocusez.site/zh-CN/archives/)
[ 分类 ](https://mocusez.site/zh-CN/categories/)
[ 友链&私人收藏 ](https://mocusez.site/zh-CN/link/)
[ 留言板 ](https://mocusez.site/zh-CN/board/)
语言
  * [ 中文 ](https://mocusez.site/zh-CN/)
  * [ English ](https://mocusez.site/en/)


# UNSW Katana使用记录
发表于 2026-09-14  |  更新于 2026-09-15 
最近在研究AI Compiler，需要用到GPU，我自己倒是一张GTX1650的老古董，但是最新的`nvcc`已经把`sm_70`和`sm_75`的机器移除，这下只能自己去vast.ai和autodl租卡，但这两个平台各有各的问题
autodl：容器形式使用，不支持Nsight Compute获取硬件计数器
vast.ai：以VM形式创建倒是可以使用Nsight Compute，但美元记价，也不敢开太长时间
我知道学校是有GPU的，但CSE的大家都说缺卡——实际也确实是这样，UNSW Katana HPC倒是有百来张卡，而且对HDR Student开放，早些时间我去申请工单，也很顺利的批复了，今天就上手试试
![image-20260914231500604](https://s3.mocusez.site/picture/image-20260914231500604.webp)
## 机器详情
先看看官网列了什么卡
  * 35 GPU nodes 
    * 80 x Nvidia H200 141GB (13 nodes)
    * 1 x Nvidia H100 94GB (1 nodes)
    * 1 x Nvidia GH200 480GB + 96GB (1 node)
    * 32 x Nvidia L40S 48GB (7 nodes)
    * 24 x Nvidia A100 40GB (3 nodes)
    * 32 x Nvidia V100 32GB (8 nodes)
    * 16 x Nvidia RTX Pro 6000 96GB (2 nodes)
  * 20 GPU nodes have priority access for the school/group that purchased them
  * 15 GPU nodes are for use by all researchers


好吧，百来张卡确实不算多，全UNSW分下来也就比没有强点🧐
配套的样例很详细，应该是用PBS调度的：[Running Jobs on Katana](https://docs.restech.unsw.edu.au/using_katana/running_jobs/#running-jobs-on-katana)
另外想用容器应该也是OK的，虽然手册没说，但确实是有权限访问apptainer的，具体使用可以看apptainer的手册：[Introduction to Apptainer](https://apptainer.org/docs/user/main/introduction.html)
~~（本来想跑个Nsight Compute测试和OpenAI Triton测试，但排显卡的速度确实太慢了，有空再更新，不指定显卡的情况下，应该跑的是V100）~~ 更新已完成
## 存储使用
默认位置15GB，另外配上128.0GB大存储盘

```



1



                                                        Own      Own      Own







2



                              Own      Own      Own    Inode    Inode    Inode







3



                             Usage    Quota   % Used   Usage    Quota   % Used







4



            /home/z1234123    9.3GB   15.0GB     62%     92K      --       --







5



     /srv/scratch/z1234123      0KB  128.0GB      0%      1      500K       0%




```

## Nsight Compute(翻车)
Nsight Compute跑完了，结论是运行不了一点，vast.ai该上还是得上
Nsight Compute还不能用2023版本的，下面测试用的是2024版本的

```



1


z1234123@katana2:~/ncu-test $ cat myjob.pbs.o9316631






2


Tue Sep 15 08:04:20 2026






3


+-----------------------------------------------------------------------------------------+






4


| NVIDIA-SMI 580.173.02             Driver Version: 580.173.02     CUDA Version: 13.0     |






5


+-----------------------------------------+------------------------+----------------------+






6


| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |






7


| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |






8


|                                         |                        |               MIG M. |






9


|=========================================+========================+======================|






10


|   0  Tesla V100-SXM2-32GB           On  |   00000000:AF:00.0 Off |                    0 |






11


| N/A   33C    P0             41W /  300W |       0MiB /  32768MiB |      0%      Default |






12


|                                         |                        |                  N/A |






13


+-----------------------------------------+------------------------+----------------------+






14










15


+-----------------------------------------------------------------------------------------+






16


| Processes:                                                                              |






17


|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |






18


|        ID   ID                                                               Usage      |






19


|=========================================================================================|






20


|  No running processes found                                                             |






21


+-----------------------------------------------------------------------------------------+






22



 WARN cache for Repodata at /home/z1234123/.cache/rattler/cache/repodata is on a network/parallel filesystem (NFS/SMB/FUSE/BeeGFS/Lustre/GPFS/CephFS), redirected to /scratch/pbs.9316631.kman.restech.unsw.edu.au/pixi-cache-z1234123/repodata for this run. Set [cache.repodata] in config.toml or PIXI_CACHE_DIR to override, or [cache.netfs-redirect] = "never" to keep the original path.







23


NVIDIA (R) Nsight Compute Command Line Profiler






24


Copyright (c) 2018-2024 NVIDIA Corporation






25


Version 2024.3.2.0 (build 34861637) (public-release)






26



 WARN cache for Repodata at /home/z1234123/.cache/rattler/cache/repodata is on a network/parallel filesystem (NFS/SMB/FUSE/BeeGFS/Lustre/GPFS/CephFS), redirected to /scratch/pbs.9316631.kman.restech.unsw.edu.au/pixi-cache-z1234123/repodata for this run. Set [cache.repodata] in config.toml or PIXI_CACHE_DIR to override, or [cache.netfs-redirect] = "never" to keep the original path.







27


==PROF== Connected to process 1172731 (/home/z1234123/ncu-test/ncu_test)






28


==ERROR== ERR_NVGPUCTRPERM - The user does not have permission to access NVIDIA GPU Performance Counters on the target device 0. For instructions on enabling permissions and to get more information see https://developer.nvidia.com/ERR_NVGPUCTRPERM






29


Allocating 64.00 MB per array






30


Result sample: 3.000298






31


==PROF== Disconnected from process 1172731






32










33


================================================================================






34



                     Resource Usage on 15/09/2026 08:04:26







35










36


Job Id: 9316631






37


Queue: CSE






38


Walltime: 00:00:03  (requested 12:00:00)






39


Job unsuccessful. Exit Status 1 - Exit status refers to the exit value of the






40


top process in the job, typically the shell.






41


This may be the exit value of the last command executed in the shell.






42


See job output error.






43










44


--------------------------------------------------------------------------------






45


|              |             GPUs              |            Memory             |






46


--------------------------------------------------------------------------------






47


| Node  GPU ID | Requested   Used   Efficiency | Available   Used              |






48


| k106    3    |     1       0.04       4%     | 32768 MiB   0.0B              |






49


--------------------------------------------------------------------------------






50


|Total         |     1       0.04      4.0%    |                               |






51


--------------------------------------------------------------------------------






52










53


--------------------------------------------------------------------------------






54


|              |             CPUs              |            Memory             |






55


--------------------------------------------------------------------------------






56


| Node         | Requested   Used   Efficiency | Requested   Used   Efficiency |






57


| k106         |     1       0.67      67.0%   |   4.0gb    0.42gb     10.5%   |






58


--------------------------------------------------------------------------------



```

## OpenAI Trtion运行
OpenAI Triton现在只能跑在`sm_80`以上（AI说3.3开始就移除了Volta和Turing的支持），需要手动指定显卡：

```



1



pbsnodes -av | grep gpu_model







2



qsub -I -l select=1:ncpus=2:mem=8gb:ngpus=1:gpu_model=A100




```

想排到A100还是有点困难的，平均需要等6个多小时，但运行确实没问题
我用uv配置的启动环境，一个可行的`pyproject.toml`如下

```



1


[project]






2



name = "triton-test"







3



version = "0.1.0"







4



description = "Add your description here"







5



readme = "README.md"







6



requires-python = ">=3.6"







7



dependencies = [







8



    "numpy>=1.19.5",







9



    "torch>=1.5.1",







10



    "triton>=3.1.0",







11


]






12










13


[project.scripts]






14



triton-test = "triton_test:main"







15










16


[build-system]






17



requires = ["uv_build>=0.12.13,<0.13.0"]







18



build-backend = "uv_build"




```

启动代码（第一次使用可能还需要`uv python install 3.12`）：

```



1



uv init







2



uv venv --python 3.12







3



uv sync




```

测试用Python代码：

```



1



import torch







2



import triton







3



import triton.language as tl







4










5










6


@triton.jit






7



def vector_add_kernel(







8



    x_ptr,







9



    y_ptr,







10



    out_ptr,







11



    n_elements: tl.constexpr,







12



    BLOCK_SIZE: tl.constexpr,







13


):






14



    pid = tl.program_id(axis=0)







15










16



    offsets = pid * BLOCK_SIZE + tl.arange(0, BLOCK_SIZE)







17



    mask = offsets < n_elements







18










19



    x = tl.load(x_ptr + offsets, mask=mask)







20



    y = tl.load(y_ptr + offsets, mask=mask)







21










22



    tl.store(







23



        out_ptr + offsets,







24



        x + y,







25



        mask=mask,







26



    )







27










28










29



def main():







30



    print("PyTorch version :", torch.__version__)







31



    print("Triton version  :", triton.__version__)







32



    print("CUDA available  :", torch.cuda.is_available())







33










34



    if not torch.cuda.is_available():







35



        raise RuntimeError("CUDA is not available")







36










37



    device = torch.cuda.current_device()







38



    props = torch.cuda.get_device_properties(device)







39










40



    print("GPU             :", props.name)







41



    print(







42



        "Compute capability:",







43



        f"{props.major}.{props.minor}",







44



    )







45










46



    n = 10_000_003







47










48



    x = torch.randn(







49



        n,







50



        device="cuda",







51



        dtype=torch.float32,







52



    )







53










54



    y = torch.randn(







55



        n,







56



        device="cuda",







57



        dtype=torch.float32,







58



    )







59










60



    output = torch.empty_like(x)







61










62



    BLOCK_SIZE = 1024







63










64



    grid = (







65



        triton.cdiv(n, BLOCK_SIZE),







66



    )







67










68



    vector_add_kernel[grid](







69



        x,







70



        y,







71



        output,







72



        n,







73



        BLOCK_SIZE=BLOCK_SIZE,







74



    )







75










76



    torch.cuda.synchronize()







77










78



    expected = x + y







79










80



    max_error = (







81



        output - expected







82



    ).abs().max().item()







83










84



    correct = torch.allclose(







85



        output,







86



        expected,







87



        rtol=1e-5,







88



        atol=1e-6,







89



    )







90










91



    print("Max error       :", max_error)







92



    print("Result correct  :", correct)







93










94



    if not correct:







95



        raise RuntimeError(







96



            "Triton kernel produced incorrect result"







97



        )







98










99



    print("\nTriton works correctly on this GPU.")







100










101










102



if __name__ == "__main__":







103



    main()




```

用于提交测试的PBS

```



1


#!/bin/bash






2










3


#PBS -l select=1:ncpus=1:mem=4gb:ngpus=1:gpu_model=A100






4


#PBS -l walltime=12:00:00






5


#PBS -M z1234123@ad.unsw.edu.au






6


#PBS -m ae






7


#PBS -j oe






8










9










10



cd $PBS_O_WORKDIR







11










12



uv run python test_triton_a100.py




```

测试结果：

```



1


z1234123@katana2:~/triton-test $ cat triton.pbs.o9317745






2


PyTorch version : 2.14.0+cu130






3


Triton version  : 3.8.0






4


CUDA available  : True






5


GPU             : NVIDIA A100-PCIE-40GB






6


Compute capability: 8.0






7


Max error       : 0.0






8


Result correct  : True






9










10


Triton works correctly on this GPU.






11










12


================================================================================






13



                     Resource Usage on 15/09/2026 19:27:40







14










15


Job Id: 9317745






16


Queue: CSE






17


Walltime: 00:00:09  (requested 12:00:00)






18


Job execution was successful. Exit Status 0.






19










20


--------------------------------------------------------------------------------






21


|              |             GPUs              |            Memory             |






22


--------------------------------------------------------------------------------






23


| Node  GPU ID | Requested   Used   Efficiency | Available   Used              |






24


| k092    2    |     1       0.01       1%     | 40960 MiB  814.0M             |






25


--------------------------------------------------------------------------------






26


|Total         |     1       0.01      1.0%    |                               |






27


--------------------------------------------------------------------------------






28










29


--------------------------------------------------------------------------------






30


|              |             CPUs              |            Memory             |






31


--------------------------------------------------------------------------------






32


| Node         | Requested   Used   Efficiency | Requested   Used   Efficiency |






33


| k092         |     1       0.67      67.0%   |   4.0gb     2.1gb     52.5%   |






34


--------------------------------------------------------------------------------



```

白嫖玩玩可以，真要做Benchmark估计得等死
## TileLang运行
之所以想到Tilelang，是因为Tilelang现在还支持`sm_70`和`sm_75`

```



1



uv init







2



uv venv --python 3.12







3



uv pip install --no-cache torch==2.14.0 --index-url https://download.pytorch.org/whl/cu126







4



uv pip install --no-cache tilelang




```

测试代码：

```



1



import torch







2



import tilelang







3



import tilelang.language as T







4










5



print("=" * 60)







6



print("Environment")







7



print("=" * 60)







8










9



print("TileLang version:", tilelang.__version__)







10



print("PyTorch version :", torch.__version__)







11



print("CUDA available  :", torch.cuda.is_available())







12










13



if not torch.cuda.is_available():







14



    raise RuntimeError("CUDA GPU is not visible inside PBS job")







15










16



print("GPU name        :", torch.cuda.get_device_name(0))







17



print("CUDA capability :", torch.cuda.get_device_capability(0))







18










19



major, minor = torch.cuda.get_device_capability(0)







20










21



if (major, minor) != (7, 0):







22



    print(







23



        f"WARNING: expected V100 / sm_70, "







24



        f"but got sm_{major}{minor}"







25



    )







26










27



print("=" * 60)







28



print("TileLang vector-add test")







29



print("=" * 60)







30










31










32



@tilelang.jit(target={"kind": "cuda", "arch": "sm_70"})







33



def vector_add(N: int, block: int = 256):







34










35



    @T.prim_func







36



    def kernel(







37



        A: T.Tensor((N,), "float32"),







38



        B: T.Tensor((N,), "float32"),







39



        C: T.Tensor((N,), "float32"),







40



    ):







41



        with T.Kernel(T.ceildiv(N, block), threads=block) as bx:







42



            for tx in T.Parallel(block):







43



                idx = bx * block + tx







44



                C[idx] = A[idx] + B[idx]







45










46



    return kernel







47










48










49



N = 1 << 20







50










51



a = torch.randn(N, device="cuda", dtype=torch.float32)







52



b = torch.randn(N, device="cuda", dtype=torch.float32)







53


c = torch.empty_like(a)






54










55



print("Compiling TileLang kernel for sm_70 ...")







56










57


kernel = vector_add(N)






58










59


torch.cuda.synchronize()






60










61



print("Running kernel ...")







62










63


kernel(a, b, c)






64










65


torch.cuda.synchronize()






66










67


ref = a + b






68










69


torch.testing.assert_close(c, ref)






70










71


max_error = (c - ref).abs().max().item()






72










73



print("Max error:", max_error)







74



print()







75



print("PASS: TileLang successfully compiled and ran on V100 / sm_70.")




```

PBS可行文件

```



1


#!/bin/bash






2










3


#PBS -l select=1:ncpus=1:mem=4gb:ngpus=1:gpu_model=V100






4


#PBS -l walltime=01:00:00






5


#PBS -M z1234123@ad.unsw.edu.au






6


#PBS -m ae






7


#PBS -j oe






8










9










10



cd $PBS_O_WORKDIR







11










12



module load gcc/12.2.0







13



module load cuda/12.8







14










15



uv run python test_tilelang_v100.py




```

测试结果：

```



1


============================================================






2


Environment






3


============================================================






4


TileLang version: 0.1.14






5


PyTorch version : 2.14.0+cu126






6


CUDA available  : True






7


GPU name        : Tesla V100-SXM2-32GB






8


CUDA capability : (7, 0)






9


============================================================






10


TileLang vector-add test






11


============================================================






12


Compiling TileLang kernel for sm_70 ...






13


2026-09-15 22:10:27  [TileLang:tilelang.jit.kernel:INFO] (kernel.py:137): TileLang begins to compile kernel `kernel` with `out_idx=None`






14


2026-09-15 22:10:29  [TileLang:tilelang.jit.kernel:INFO] (kernel.py:145): TileLang completes to compile kernel `kernel`






15


Running kernel ...






16


Max error: 0.0






17










18


PASS: TileLang successfully compiled and ran on V100 / sm_70.






19










20


================================================================================






21



                     Resource Usage on 15/09/2026 22:10:46







22










23


Job Id: 9319953






24


Queue: CSE






25


Walltime: 00:00:26  (requested 01:00:00)






26


Job execution was successful. Exit Status 0.






27










28


--------------------------------------------------------------------------------






29


|              |             GPUs              |            Memory             |






30


--------------------------------------------------------------------------------






31


| Node  GPU ID | Requested   Used   Efficiency | Available   Used              |






32


| k105    1    |     1        0.0       0%     | 32768 MiB  410.0M             |






33


--------------------------------------------------------------------------------






34


|Total         |     1        0.0      0.0%    |                               |






35


--------------------------------------------------------------------------------






36










37


--------------------------------------------------------------------------------






38


|              |             CPUs              |            Memory             |






39


--------------------------------------------------------------------------------






40


| Node         | Requested   Used   Efficiency | Requested   Used   Efficiency |






41


| k105         |     1       0.31      31.0%   |   4.0gb     0.7gb     17.5%   |






42


--------------------------------------------------------------------------------



```

## uv使用注意事项
uv使用的cache可能会把15GB的小空间挤爆，建议还是直接使用conda或python venv解决(或是uv开启`--no-cache`)
## Tips
`qstat -u "$USER"`
可以查看已经提交的所有任务
`module avail gcc`
查询可用的GCC，Tilelang似乎使用CuTe模板，GCC版本小于10会无法运行
## 结语
原本计划还要去试试CSE的HPC的，但CSE存储每人共享上课用的3GB存储容量，随便上个Conda环境就没了——只能期待他们后续给更多Storage了
* * *
评论
昵称
邮箱
网址
* * *
#### 预览:
[](https://guides.github.com/features/mastering-markdown/ "Markdown Guide")
0  字
登录提交
评论
  * 按正序
  * 按倒序
  * 按热度


![avatar](https://mocusez.site/_astro/head.BgWsHt6a_ZmXgyY.webp)
MocusEZ
探索未曾设想的道路
[ 文章 130 ](https://mocusez.site/zh-CN/archives/) [ 标签 0 ](https://mocusez.site/zh-CN/) [ 分类 12 ](https://mocusez.site/zh-CN/categories/)
[ ](https://github.com/mocusez "Github")[ ](https://mocusez.site/zh-CN/atom.xml "RSS")
公告
开放友链添加，欢迎互换
目录
  1. [ 1. 机器详情 ](https://mocusez.site/zh-CN/posts/d355/#%E6%9C%BA%E5%99%A8%E8%AF%A6%E6%83%85)
  2. [ 2. 存储使用 ](https://mocusez.site/zh-CN/posts/d355/#%E5%AD%98%E5%82%A8%E4%BD%BF%E7%94%A8)
  3. [ 3. Nsight Compute(翻车) ](https://mocusez.site/zh-CN/posts/d355/#nsight-compute%E7%BF%BB%E8%BD%A6)
  4. [ 4. OpenAI Trtion运行 ](https://mocusez.site/zh-CN/posts/d355/#openai-trtion%E8%BF%90%E8%A1%8C)
  5. [ 5. TileLang运行 ](https://mocusez.site/zh-CN/posts/d355/#tilelang%E8%BF%90%E8%A1%8C)
  6. [ 6. uv使用注意事项 ](https://mocusez.site/zh-CN/posts/d355/#uv%E4%BD%BF%E7%94%A8%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)
  7. [ 7. Tips ](https://mocusez.site/zh-CN/posts/d355/#tips)
  8. [ 8. 结语 ](https://mocusez.site/zh-CN/posts/d355/#%E7%BB%93%E8%AF%AD)


©2019 - 2026 By MocusEZ
框架  [Astro](https://astro.build) | 主题  [Astrofly](https://github.com/mocusez/astro-astrofly)
[闽ICP备2021003009号](http://beian.miit.gov.cn/)
搜索
* * *
