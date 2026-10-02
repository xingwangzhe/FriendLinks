![avatar](https://raw.githubusercontent.com/iyheart/tuchuang/main/img/cover51_1.png)
[文章 214](https://iyheart.github.io/archives/)[标签 17](https://iyheart.github.io/tags/)[分类 64](https://iyheart.github.io/categories/)
* * *
[ 主页](https://iyheart.github.io/)
[ 历史](https://iyheart.github.io/archives/)
[ 标签](https://iyheart.github.io/tags/)
[ 友情链接](https://iyheart.github.io/link/)
[ 知识库](javascript:void\(0\);)
  * [ 编程语言知识库](https://iyheart.github.io/docs/)
  * [ PWN刷题记录](https://iyheart.github.io/practice/)


[ 关于](https://iyheart.github.io/about/)
[ 更新](https://iyheart.github.io/update/)
[ 随机文章](javascript:toRandomPost\(\))
[![](http://img95.699pic.com/photo/40151/9175.gif_wh860.gif)iyheart的博客](https://iyheart.github.io/ "iyheart的博客")
[ 搜索](javascript:void\(0\);)
[ 主页](https://iyheart.github.io/)
[ 历史](https://iyheart.github.io/archives/)
[ 标签](https://iyheart.github.io/tags/)
[ 友情链接](https://iyheart.github.io/link/)
[ 知识库](javascript:void\(0\);)
  * [ 编程语言知识库](https://iyheart.github.io/docs/)
  * [ PWN刷题记录](https://iyheart.github.io/practice/)


[ 关于](https://iyheart.github.io/about/)
[ 更新](https://iyheart.github.io/update/)
[ 随机文章](javascript:toRandomPost\(\))
[](javascript:void\(0\);)
# 形式语言与自动机
发表于2026-07-26|更新于2026-09-23|[计算理论](https://iyheart.github.io/categories/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/)[形式语言与自动机](https://iyheart.github.io/categories/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/)
|字数总计:19.6k|阅读时长:77分钟|阅读量:
#  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%A6%82%E8%BF%B0) 概述
  * 形式语言与自动机所属的计算机归类： 
    * 形式语言与自动机属于计算理论的一个研究方向。
    * 计算理论的主要研究问题是：什么问题能够被计算？如何计算这个问题？计算这个问题需要多少资源？
    * 计算理论的主要研究内容是：分别是自动机与语言、可计算性、计算复杂性。
    * 下面用一张思维导图来表示：


[![image-20260727233021803](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260727233021803.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260727233021803.png)
  * 形式语言与自动机的内容其实分为两个部分，自动机理论和形式语言理论。 
    * 形式语言理论：研究语言语法的数学和计算机科学分支叫做形式语言理论。研究的自然语言（如英语、中文）；研究形式语言（如程序设计语言、化学分子式这种被称为形式语言）； 
      * `1956年`，`Chomsky`，从语言产生的角度，定义了语言与文法
      * `1951-1956年`，`Kleene`提出了有穷状态自动机`FA`，从语言识别的角度定义了语言。
      * `1959年`，`Chomsky`证明了语言与自动机等级性，形式语言从此诞生。
    * 自动机理论：一个能够根据输入符号按照规定规则改变自身状态的抽象计算模型。 
      * `有穷自动机FA Finite Automaton`：最简单的自动机，状态数量有限，没有额外的存储能力。
      * `下推自动机PDA Push down Automaton`：比有穷自动机多出一个栈结构。
      * `有界自动机LBA Linear Bounded Automaton`：拥有图灵机的读写能力，但是它使用的存储空间被限制在输入字符串长度范围内。
      * `图灵机TM Turing Machine`：最强大的经典自动机，无限长的纸带，读写头，状态控制器。
    * 形式语言与自动机的联系：`1959年`，`Chomsky`证明了语言与自动机等级性，形式语言从此诞生。
    * 下面一张思维导图大致描述了形式语言与自动机的知识体系，并且也说明了状态机和自动机的关系。其中： 
      * 正则语言等价于有穷自动机
      * 上下文无关语言等价于下推自动机
      * 上下文有关语言等价于有界自动机
      * 递归可枚举语言等价于图灵机


[![image-20260809104142637](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260809104142637.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260809104142637.png)
  * 从不同角度看计算机的结构：


[![image-20260728000240744](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260728000240744.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260728000240744.png)
  * 课程需要用到的资料：
    * 设计自动机的软件：<https://www.jflap.org/>
    * 主要参考的教材：
[![image-20260727235010403](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260727235010403.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260727235010403.png)
  * 自动机理论中的典型问题：判定给定的字符串ω\omegaω是否属于某个具体的语言LLL
    * 语言成员性问题是自动机理论的核心问题。
    * 语言和判定问题本质是相同的。


#  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86) 基础知识
  * 在学习语言和自动机的之前，其实还是要学习一些这门课的专业术语，用于对语言和自动机严格进行比较严格和规范的数学的描述。这些基础知识大部分是集合的一些基础知识。


##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E9%9B%86%E5%90%88) 集合
###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E9%9B%86%E5%90%88%E7%9A%84%E5%9F%BA%E6%9C%AC%E5%AE%9A%E4%B9%89) 集合的基本定义
> **定义1** ：集合的定义
> 一定范围内确定的，并且彼此可以区分的对象汇集再一起形成的整体称为**集合** ，简称为 _集_ 。通常称集合的成员为该集合的**元素** 。
> 补充1：通常用大写的英文字母A,B,C,...A,B,C,...A,B,C,...和大写的希腊字母、、Γ、Σ、∅....\Gamma、\Sigma、\emptyset ....Γ、Σ、∅....表示集合；用小写字母a,b,ca,b,ca,b,c表示集合的元素。
> 补充2：一般自然数用N\NN，有理数\Q，实数R\RR，字母的集合Σ\SigmaΣ
> **定义2** ：元素与集合
> 如果aaa是集合AAA的一个元素，则记为a∈Aa\in Aa∈A，读作aaa属于AAA，或者AAA含有aaa；否则记为a∉Aa\notin Aa∈/A，读作aaa不属于AAA，或者AAA不含aaa。
> 补充3：可以使用列举法表示集合，当读者能看出规律的时候，某些元素就可以省略。
> 补充4：可以使用描述法表示集合，描述法也被称为命题法
> 补充5：高中的时候还要区间表示法
> **定义3** ：有限集与无穷集
> 由有限个元素构成的集合称为**有限集** ，又称为**有穷集** 。由无穷多个元素构成的集合称为**无穷集** 。如果集合AAA与集合BBB之间有一个一一对应，则称它们具有相同的基数，通常用∣A∣|A|∣A∣表示集合AAA的基数。
> 补充6：集合的基数又称为集合的势，对有穷集来说，它的基数就是它所包含的元素的个数。
> 补充7：无穷集可以分为可数集和不可数集，所以无穷集合可以分为可数无穷的集合，简称S是**可数集** 。否则，称S是不可数集。
> 补充8：整数集、有理数集是可数集，实数集是不可数集。实数集的不可数形式可以用对角线法进行证明。
###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E9%9B%86%E5%90%88%E7%9A%84%E5%85%B3%E7%B3%BB) 集合的关系
> **定义1** ：子集与包集
> 设A,BA,BA,B是两个集合，如果集合AAA中的元素都是集合BBB的元素，则称集合AAA是集合BBB的**子集** ，集合BBB是集合AAA的**包集** 。记作A⊆BA\subseteq BA⊆B，读作AAA包含再BBB中；也可以记做B⊇AB\supseteq AB⊇A，读作BBB包含AAA。
> 补充1：由定义可知，A⊆BA\subseteq BA⊆B的充要条件是：对于AAA中的每一个元素aaa，均有a∈Ba\in Ba∈B。
> 补充2：简洁起见，P1P_1P1​是P2P_2P2​的充要条件记作P1⇔P2P_1 \Leftrightarrow P_2P1​⇔P2​，或者P2iffP1P_2 ~iff~P_1P2​iffP1​
> 补充3：存在量词∃\exist∃，全称量词∀\forall∀
> **定义2** ：真子集
> 设A,BA,BA,B是两个集合，如果A⊆BA\subseteq BA⊆B，且∃x∈B\exist x \in B∃x∈B，但是x∉Ax \notin Ax∈/A，则称AAA是BBB的**真子集** ，记作A⊂BA \subset BA⊂B
> **定义3** ：如果集合A,BA,BA,B含有的元素完全相同，则称集合AAA与集合BBB相等，记作A=BA=BA=B。
###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E9%9B%86%E5%90%88%E7%9A%84%E8%BF%90%E7%AE%97) 集合的运算
> **定义1** ：集合的并运算
> 设A,BA,BA,B是两个集合，AAA和BBB的并是一个集合，该集合中的元素要么是AAA中的元素，要么是BBB的元素，记作A∪BA\cup BA∪B。或者A∪B={a∣a∈A或者a∈B}A\cup B = \\{a|a\in A 或者 a\in B\\}A∪B={a∣a∈A或者a∈B}
> **定义1.1** ：多个集合的并运算以及无穷集合的并运算
> 设A1,A2,...,AnA_1,A_2,...,A_nA1​,A2​,...,An​是nnn个集合，则它们的并为，使得A1∪A2∪...∪An={a∣∃i,1≤i≤n，使得a∈Ai}A_1\cup A_2 \cup ...\cup A_n =\\{a| \exist i,1≤i≤n，使得a\in A_i\\}A1​∪A2​∪...∪An​={a∣∃i,1≤i≤n，使得a∈Ai​}，可记为∪i=1nAi\cup_{i=1}^{n}A_i∪i=1n​Ai​
> 设A1,A2,...,An,....A_1,A_2,...,A_n,....A1​,A2​,...,An​,....是集合的一个无穷序列，则它们的并使得A1∪A2∪....∪An∪...={a∣∃i,i∈N,使得a∈Ai}A_1\cup A_2\cup ....\cup A_n \cup...=\\{a| \exist i,i\in N,使得a\in A_i\\}A1​∪A2​∪....∪An​∪...={a∣∃i,i∈N,使得a∈Ai​}，可记为∪i=1∞Ai\cup_{i=1}^{\infty}A_i∪i=1∞​Ai​
> 当一个集合的元素都是集合时，这样的集合称为集族。设SSS是一个集族，则SSS中的所有元素的并为∪A∈S={a∣∃A∈S,a∈A}\cup_{A\in S}=\\{a|\exist A \in S,a \in A \\}∪A∈S​={a∣∃A∈S,a∈A}
> **定义2** ：集合的交运算
> 设A,BA,BA,B是两个集合，AAA与BBB的交是一个集合，该集合由既属于AAA又属于BBB的所有元素组成，记作A∩BA\cap BA∩B。且A∩B={a∣a∈A且a∈B}A\cap B=\\{a|a\in A且a\in B\\}A∩B={a∣a∈A且a∈B}，如果A∩B=∅A\cap B = \emptysetA∩B=∅，则称AAA与BBB不相交。
> **定义2.2** ：多个集合的交运算以及无穷集合的交运算
> 参考定义1.1
> **定义3** ：集合的差运算
> 设A,BA,BA,B是两个集合，AAA与BBB的差是一个集合，该集合是由属于AAA但是不属于BBB的所有元素组成，记作A−BA-BA−B。且A−B={a∣a∈A且a∉B}A-B=\\{a|a\in A且a\notin B\\}A−B={a∣a∈A且a∈/B}
> **定义4** ：集合的对称差
> 设A,BA,BA,B是两个集合，AAA与BBB的对称差是一个集合，该集合由属于AAA但是不属于BBB，以及属于BBB但是不属于AAA的所有元素组成，记作A⊕BA\oplus BA⊕B。且或者且A⊕B={a∣a∈A且a∉B或者a∉A且a∈B}A\oplus B=\\{a|a\in A且a\notin B或者a\notin A且a\in B\\}A⊕B={a∣a∈A且a∈/B或者a∈/A且a∈B}
> 补充：A⊕B=(A∪B)−(A∩B)=(A−B)∪(B−A)A\oplus B = (A\cup B)-(A\cap B) = (A-B)\cup (B-A)A⊕B=(A∪B)−(A∩B)=(A−B)∪(B−A)
> [![image-20260730074050439](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260730074050439.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260730074050439.png)
> **定义5** ：集合的补运算
> 如果集合AAA是论域UUU上的一个集合，则A⊆UA\subseteq UA⊆U，则AAA的补集是一个集合，该集合由在UUU中，但是不在AAA中的所有元素组成，记作A‾\overline{A}A。A‾=U−A\overline{A}= U-AA=U−A，补集又称为余集。也可以用CUAC_{U}ACU​A表示。
> **定义6** ：集合的笛卡尔积  
>  设A,BA,BA,B是两个集合，AAA与BBB的笛卡尔积是一个集合，该集合由所有这样的有序对(a,b)(a,b)(a,b)组成，其中a∈Aa\in Aa∈A，b∈Bb\in Bb∈B，记作A×BA×BA×B。
> 且A×B={(a,b)∣a∈A且b∈B}A×B=\\{(a,b)|a\in A且b\in B\\}A×B={(a,b)∣a∈A且b∈B}
> **定义7** ：幂集
> 设AAA是一个集合，AAA的幂集是一个集合，该集合由AAA的所有子集组成，记作2A2^{A}2A。2A={B∣B⊆A}2^{A}=\\{B|B\subseteq A\\}2A={B∣B⊆A}。
> 注解：幂集是一个集族，因为该集合的所有元素都是集合。
##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E8%AF%AD%E8%A8%80) 语言
  * 对语言的研究包括如下三个方面： 
    * 如何给出语言的表示？
    * 一个给定的语言是否存在有穷描述？
    * 具有有穷表示的语言结构是什么样的？


> **定义1** ：字母表
> 字母表是一个非空有穷集合，字母表中的元素称为该字母表的一个**字母** ，也可称为**符号** 或者**字符** ，通常使用Σ\SigmaΣ表示。
> 例1：{0,1}\\{0,1\\}{0,1}表示一个二进制的字母表
> 例2：{a,b,c,...,z}\\{a,b,c,...,z\\}{a,b,c,...,z}是英文上的小写字母表
> 字母表中的字符有如下特点：
>   * 整体性，也称为不可分割性，例1：集合{aa,bb}\\{aa,bb\\}{aa,bb}中的、aa、bbaa、bbaa、bb均是单个字符，不能拆分为a,ab,baa,ab,baa,ab,ba这样的；例2：集合{a,a′,b,b′}\\{a,a',b,b'\\}{a,a′,b,b′}中的a′a'a′，其中aaa和′'′是不可分割的。
>   * 可辨认性，也称为可区分性。其实也就是要满足集合的互异性。
> 

> **定义2** ：字母表的乘积
> 设Σ1\Sigma_1Σ1​和Σ2\Sigma_2Σ2​是两个字母表，Σ1\Sigma_1Σ1​与Σ2\Sigma_2Σ2​的乘积为：Σ1Σ2={ab∣a∈Σ1,b∈Σ2}\Sigma_1 \Sigma_2=\\{ab|a\in \Sigma_1,b\in \Sigma_2\\}Σ1​Σ2​={ab∣a∈Σ1​,b∈Σ2​}
> 注意1：两个字母表的乘积也被称为字母表元素的连接的集合，需要按照先后的顺序。
> 注意2：两个字母表的乘积与笛卡尔积是不一样的。笛卡尔积的结果是数对，字母表的乘积是拼接。
> **定义3** ：字符串
> 由某字母表中符号组成的有穷序列。空字符串也被称为空串记为ε\varepsilonε，表示有`0`个字符的串。
> 例1：若Σ1={0,1}\Sigma_1 =\\{0,1\\}Σ1​={0,1}，那么`0,1,00,111001`为Σ1\Sigma_1Σ1​上的字符串。
> 例2：若Σ2={a,b,c,...,z}\Sigma_2=\\{a,b,c,...,z\\}Σ2​={a,b,c,...,z}，那么`ab,bcd`为Σ2\Sigma_2Σ2​上的字符串。
> 注意1：字母表Σ\SigmaΣ可以是任意的，但是都有ε∉Σ\varepsilon \notin \Sigmaε∈/Σ
> 注意2：单个字符即是属于字母表，也是一个字符串以
> **定义4** ：字符串的长度
> 字符串的长度：字符串中符号所占位置的个数，记为∣⋅∣|·|∣⋅∣，若字母表为Σ\SigmaΣ，则字符串的长度可递归定义为：∣ω∣={0,ω=ε∣x∣+1,ω=xa|\omega|=\begin{cases}0,\omega =\varepsilon \\\ |x|+1,\omega = xa\end{cases}∣ω∣={0,ω=ε∣x∣+1,ω=xa​
> 其中a∈Σa\in \Sigmaa∈Σ，ω\omegaω和xxx是Σ\SigmaΣ中字符组成的字符串。
> **定义5** ：连接
> 设Σ\SigmaΣ是一个字母表，x,y∈Σ∗x,y\in \Sigma^{*}x,y∈Σ∗，x,yx,yx,y的并置是这样一个串，该串是由串xxx直接接串yyy所组成的，记作xyxyxy。并置也称为连接。
>   * 对于n≥0n≥0n≥0，串xxx的nnn次幂递归地定义为：
> 

>   1. x0=εx^{0}=\varepsilonx0=ε
>   2. xn=xn−1xx^{n}=x^{n-1}xxn=xn−1x
> 

>   * 不难证明，对Σ∗\Sigma^{*}Σ∗上的任意串x,y,zx,y,zx,y,z，并置具有如下性质
> 

>   1. 结合律：(xy)z=x(yz)(xy)z=x(yz)(xy)z=x(yz)
>   2. 左消去律：如果xy=xzxy=xzxy=xz，则y=zy=zy=z
>   3. 右消去律：如果yx=zxyx=zxyx=zx，则y=zy=zy=z
>   4. 唯一分解性：存在唯一确定的a1,a2,...,an∈Σa_1,a_2,...,a_n\in \Sigmaa1​,a2​,...,an​∈Σ，使得x=a1a2...anx=a_1a_2...a_nx=a1​a2​...an​
>   5. 单位元素：εx=xε=x\varepsilon x=x\varepsilon =xεx=xε=x
> 

> **定义5.1** ：字母表的幂
>   1. 定义字母表的零次幂为：Σ0={ε}\Sigma^{0}=\\{\varepsilon\\}Σ0={ε}
>   2. 定义字母表的nnn次幂为：Σn=Σn−1Σ,n≥1\Sigma^{n}=\Sigma^{n-1}\Sigma,n≥1Σn=Σn−1Σ,n≥1。（递归定义）
> 

> 例1：Σ={a,b}\Sigma=\\{a,b\\}Σ={a,b}，那么
> (ba)2=(ba)1ba=(ba)0baba=εbaba=baba(ba)^{2}=(ba)^{1}ba=(ba)^{0}baba=\varepsilon baba = baba(ba)2=(ba)1ba=(ba)0baba=εbaba=baba
> ba2=ba1a=ba0aa=bεaa=baaba^{2}=ba^{1}a=ba^{0}aa=b\varepsilon aa=baaba2=ba1a=ba0aa=bεaa=baa
> **定义6** ：集合的连接
> 记ABABAB，定义为AB={ω∣ω=xy,x∈A,y∈B}AB=\\{\omega|\omega=xy,x\in A,y\in B\\}AB={ω∣ω=xy,x∈A,y∈B}
> 例1：有字母表Σ={0,1}\Sigma=\\{0,1\\}Σ={0,1}，A={01},B={11,101}A=\\{01\\},B=\\{11,101\\}A={01},B={11,101}，则AB={0111,01101}AB=\\{0111,01101\\}AB={0111,01101}
> 注1：字母表Σ\SigmaΣ也可以做连接。
> **定义6.1** ：集合的nnn次幂n≥0n≥0n≥0，递归定义为：
> An={{ε},n=0An−1A,n≥1A^{n}=\begin{cases}\\{\varepsilon\\},n=0\\\A^{n-1}A,n≥1\end{cases}An={{ε},n=0An−1A,n≥1​
> 补充：若Σ\SigmaΣ为字母表，则Σn\Sigma^{n}Σn为长度为nnn的字符串的集合。
> 例1：Σ={0,1}\Sigma=\\{0,1\\}Σ={0,1}，则有Σ0={ε},Σ1={0,1},Σ2={01,00,10,11},Σ3={010,011,000,001,100,101,111,110}\Sigma^{0}=\\{\varepsilon\\},\Sigma^{1}=\\{0,1\\},\Sigma^{2}=\\{01,00,10,11\\},\Sigma^{3}=\\{010,011,000,001,100,101,111,110\\}Σ0={ε},Σ1={0,1},Σ2={01,00,10,11},Σ3={010,011,000,001,100,101,111,110}
> **定义7** ：正闭包与克林闭包
> 设Σ\SigmaΣ是一个字母表，Σ\SigmaΣ的正闭包如下：
> Σ+=Σ∪Σ2∪Σ3∪Σ4∪⋅⋅⋅\Sigma^{+}=\Sigma\cup \Sigma^{2}\cup\Sigma^{3}\cup \Sigma^{4}\cup ···Σ+=Σ∪Σ2∪Σ3∪Σ4∪⋅⋅⋅
> 设Σ\SigmaΣ是一个字母表，Σ\SigmaΣ的克林闭包如下：
> Σ∗=Σ0∪Σ1∪Σ2∪Σ3∪⋅⋅⋅\Sigma^{*} =\Sigma^{0}\cup \Sigma^{1}\cup\Sigma^{2}\cup \Sigma^{3}\cup ···Σ∗=Σ0∪Σ1∪Σ2∪Σ3∪⋅⋅⋅
> **定义11** ：语言
> 若Σ\SigmaΣ为字母表且∀L⊆Σ∗\forall L \subseteq \Sigma^{*}∀L⊆Σ∗，则LLL称为字母表Σ\SigmaΣ上的语言。
> 例如：自然语言，程序设计语言，{0n1n∣n≥0}....\\{0^{n}1^{n}|n≥0\\}....{0n1n∣n≥0}....
> 关于语言唯一重要的约束就是所有字母表都是有穷的。
  * 符号使用约定： 
    * 字母表：Σ\SigmaΣ，Γ\GammaΓ
    * 字符：a,b,ca,b,ca,b,c
    * 字符串：w,x,y,z,...w,x,y,z,...w,x,y,z,...
    * 集合：A,B,C,...A,B,C,...A,B,C,...


##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E8%AF%81%E6%98%8E%E6%96%B9%E6%B3%95) 证明方法
  * 三段论
  * 归纳法
  * 反证法
  * 反例法


#  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%9C%89%E7%A9%B7%E7%8A%B6%E6%80%81%E8%87%AA%E5%8A%A8%E6%9C%BAfsm) 有穷状态自动机FSM
##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E7%A1%AE%E5%AE%9A%E7%9A%84%E6%9C%89%E7%A9%B7%E8%87%AA%E5%8A%A8%E6%9C%BA) 确定的有穷自动机
  * 在现实中计算机相当复杂，很难直接对它们建立一个易于处理的数学理论，因此采用计算模型来描述。
  * 有穷自动机是最简单的计算模型，并且对其细分主要分为两类： 
    * 确定型有穷自动机`DFA`
    * 非确定型有穷自动机`NFA`，其中`NFA`这边还有个带空转移的非确定有穷自动机即ε−NFA\varepsilon -NFAε−NFA
  * 有穷状态系统：在系统的运行过程中，系统的状态在有限状态空间不断变化每个状态可以迁移到零个或多个状态，系统的输入决定执行哪个状态的迁移。


> **定义1** ：确定的有穷自动机
> 对于确定的有穷自动机`A`，采用五元组(Q,∑,δ,q0,F)(Q,\sum,\delta,q_0,F)(Q,∑,δ,q0​,F)来描述。其中：
>   1. QQQ：有穷状态集
>   2. ∑\sum∑：有穷输入符号集或者字母表
>   3. δ:Q×∑→Q\delta: Q×\sum \to Qδ:Q×∑→Q：状态转移函数，该函数的定义域是笛卡尔积，可以理解为是一个二元函数。
>   4. q0∈Qq_0\in Qq0​∈Q：初始状态
>   5. F⊆QF\subseteq QF⊆Q：终结状态集或者接受状态集。
> 

> DFA实际读入的是一个字符串，而状态转移函数处理的是一个字符，为了理论分析的时候更加便于处理字符串，于是有了扩展转移函数。
> **定义2** ：扩展转移函数δ^\hat{\delta}δ^
> δ^={q,ω=εδ(δ^(q,x),a),ω=xa\hat{\delta}=\begin{cases}q,\omega=\varepsilon \\\\\delta(\hat{\delta}(q,x),a),\omega=xa\end{cases}δ^={q,ω=εδ(δ^(q,x),a),ω=xa​
> 该定义是一个递归定义，其中aaa是一个字符，ω\omegaω和xxx是字符串，这是递归定义，对每个串ω\omegaω，把它最后一个字母a.a.a.取出，分解为ωa\omega aωa。
> **定义3** ：
> 若D=(Q,Σ,δ,q0,F)D=(Q,\Sigma,\delta,q_0,F)D=(Q,Σ,δ,q0​,F)是一个DFA，则D识别的语言为L(D)={ω∈Σ∗∣δ^(q0,ω)∈F}L(D)=\\{\omega\in \Sigma^{*}|\hat{\delta}(q_0,\omega)\in F\\}L(D)={ω∈Σ∗∣δ^(q0​,ω)∈F}即所有能使DFA从开始状态到达接受状态的符号串集合。
> **定义4** ：正则语言
> 如果语言LLL是某个DFA，D识别的语言，则称其为正则语言。
> 注：∅\emptyset∅，{ε}\\{\varepsilon\\}{ε}都是正则语言
[![image-20260804230013224](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260804230013224.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260804230013224.png)
##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E8%87%AA%E5%8A%A8%E6%9C%BA%E7%9B%B4%E8%A7%82%E8%A1%A8%E7%A4%BA) 自动机直观表示
  * 上面的定义是对确定的有穷自动机数学上的严格描述，但是并不够直观，所以为了直观描述确定的有穷自动机，以及后续的一些自动机，可以采取两种直观的表示方式：状态转移图、状态转移表。


> **定义2** ：转移图，这里不介绍具体的定义，而是介绍一些画转移图的符号规定。
> [![Snipaste_2026-07-31_07-24-58](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/Snipaste_2026-07-31_07-24-58.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/Snipaste_2026-07-31_07-24-58.png)
>   * 每个状态qqq对应一个结点，用圆圈表示。
>   * 状态转移δ(q,a)=p\delta(q,a)=pδ(q,a)=p为一条从qqq到ppp且标记为输入字符aaa的有向边。
>   * 开始状态q0q_0q0​用一个标有`start`的箭头表示。
>   * 接受状态结点，用双圆圈表示。
> 

> **定义3** ：转移表，也不介绍定义，而是介绍做表规定。
> [![image-20260731072447573](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260731072447573.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260731072447573.png)
>   * 每个状态qqq对应一行，每个输入字符对应一列。
>   * 若有δ(q,a)=p\delta(q,a)=pδ(q,a)=p，用第qqq行第aaa列中填入qqq的表示。
>   * 开始状态q0q_0q0​前，标记箭头→\to→表示。
>   * 接受状态q∈Fq\in Fq∈F前，标记星号`*`表示。
> 

###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E7%BB%83%E4%B9%A01%E5%81%9A%E5%9B%BE%E5%81%9A%E8%A1%A8) 练习1——做图做表
[![image-20260804230126432](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260804230126432.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260804230126432.png)
  * 课后练习：


[![image-20260804230216616](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260804230216616.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260804230216616.png)
###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E7%BB%83%E4%B9%A02%E6%89%A9%E5%B1%95%E8%BD%AC%E7%A7%BB%E5%87%BD%E6%95%B0) 练习2——扩展转移函数
[![image-20260804224059827](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260804224059827.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260804224059827.png)
##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E9%9D%9E%E7%A1%AE%E5%AE%9A%E7%9A%84%E6%9C%89%E7%A9%B7%E8%87%AA%E5%8A%A8%E6%9C%BA) 非确定的有穷自动机
###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#nfa%E5%AE%9A%E4%B9%89) NFA定义
  * 非确定性有穷状态自动机为`NFA`，其由`米凯尔·拉宾`和`达纳·斯科特`。
  * 状态的非确定转移： 
    * 同一状态在相同输入下，可以有多个转移状态。
    * 自动机可以处于多个当前状态：因此给定一个输入和当前状态，状态转移函数的输出是一个**状态集** 。


[![image-20260804230702999](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260804230702999.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260804230702999.png)
> **定义1** ：非确定有穷自动机，也使用五元组描述
> 非确定有穷自动机`NFA Non-deterministic Finite Automaton`，记为五元组A=(Q,Σ,δ,q0,F)A=(Q,\Sigma,\delta,q_0,F)A=(Q,Σ,δ,q0​,F)
>   1. QQQ：有穷状态集；
>   2. Σ\SigmaΣ：有穷输入符号集或字母表；
>   3. δ\deltaδ：Q×Σ→2QQ×\Sigma\to 2^{Q}Q×Σ→2Q：状态转移函数（与DFA定义最大的区别，该状态转移函数的像是一个集合。）
>   4. q0∈Qq_0 \in Qq0​∈Q：初始状态
>   5. F⊆QF\subseteq QF⊆Q：终结状态集或接受状态集。
> 

> 注意：2Q2^{Q}2Q是幂集，即2Q={S∣S⊆Q}2^{Q}=\\{S|S\subseteq Q\\}2Q={S∣S⊆Q}，其中δ(q,a)={p1,p2,....,pn}\delta(q,a)=\\{p_1,p_2,....,p_n\\}δ(q,a)={p1​,p2​,....,pn​}
> **定义2** ：NFA的做图和做表。例子：由000和111构成的串中，接受全部以010101结尾的串。
>   * 对于NFA的状态图，有以下规范：
> 

>   1. NFA的状态图，需要标注接收状态的路径。
>   2. NFA的状态图，需要标注初始状态q0q_0q0​的全部字符转移。
>   3. NFA的状态图，不需要标注其他状态的非接收状态路径。
> 

>   * 对于NFA的状态表，有以下规范：
> 

>   1. NFA的状态表，需要标注对于状态的转移，需要使用集合表示可能的状态。
>   2. NFA的状态表，对于不需要标注的其他状态，使用空集表示。
>   3. NFA的状态表，其他规范与DFA的规范。
> 

> 注意1：空集代表的并**不是保持原有状态** ，而是类似于状态机卡死的这种状态。
> [![image-20260804231804453](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260804231804453.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260804231804453.png)
> **定义3** ：NFA的扩展转移函数δ^:Q×Σ∗→2Q\hat{\delta}:Q×\Sigma^{*}\to 2^{Q}δ^:Q×Σ∗→2Q
> δ^={{q},ω=ε∪p∈δ^(q,x)δ(p,a),ω=xa\hat{\delta}=\begin{cases}\\{q\\},&\omega=\varepsilon \\\\\cup_{p\in\hat{\delta}(q,x)}\delta(p,a),&\omega=xa\end{cases}δ^={{q},∪p∈δ^(q,x)​δ(p,a),​ω=εω=xa​
> **定义4** ：NFA的N接受语言
> 若N=(Q,Σ,δ,q0,F)N=(Q,\Sigma,\delta,q_0,F)N=(Q,Σ,δ,q0​,F)是一个NFA，则N接受的语言为L(N)={ω∈Σ∗∣δ^(q0,ω)∩F≠∅}L(N)=\\{\omega\in \Sigma^{*}|\hat{\delta}(q_0,\omega)\cap F≠\emptyset\\}L(N)={ω∈Σ∗∣δ^(q0​,ω)∩F=∅}
> 注：具体可以看下面例题。
  * 例题1：接受全部以`01`结尾的串NFA。
  * 例题2：接受`01`结尾的串NFA，δ^\hat{\delta}δ^处理`00101`时每步的状态转移，并说明`00101`是否能被该NFA接受。


###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#dfa%E4%B8%8Enfa) DFA与NFA
  * DFA的特点：
    * 状态的转移是确定的，一次状态转移只会转移到一个确定的状态。
    * 对于每一个状态，需要明确定义对应于各个可能的输入符号的状态转移。
    * DFA的设计比较复杂。
    * 最后所处的状态在接受状态集FFF中时，才接受符号串。
  * NFA的特点：
    * 状态转移是确定的，但是一次状态转移可能转移到多个状态。
    * 不需要明确地定义所有状态转移，如果未定义某个状态转移，那么执行到该状态转移的时候会进入`dead state`。
    * NFA的设计通常比DFA更为容易设计。
    * 最后所处的状态集中有某个状态在接受状态集FFF中时，才接受符号串。
  * 注意：DFA和NFA表示语言的能力是**等价** 的。


> **定理** ：
> 如果语言LLL被NFA接受，当前仅当L被DFA接受。
> 证明如下：证明所需要用到子集构造法与递归证明。需要证明w∈L(N)⇒ω∈L(D)w \in L(N) \Rightarrow \omega \in L(D)w∈L(N)⇒ω∈L(D)以及ω∈L(D)⇒w∈L(N)
  * 例1：构造接受全部以`01`结尾的串的NFA的状态图和表如下图所示，请根据该图表，做出对应的DFA。


[![image-20260806063658903](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260806063658903.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260806063658903.png)
  * 例2：给定如下NFA，构造与其等价的DFA。


[![image-20260806063802879](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260806063802879.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260806063802879.png)
###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%CE%B5-nfa%E5%AE%9A%E4%B9%89) ε-NFA定义
  * `ε-NFA`是带有空转移的`NFA`，是对`NFA`进行扩展，在不输入任何字符的情况下（即为空串ε），可以自发地发生状态转移。对于`ε-NFA`有如下几点说明。 
    * 可以简化NFA的构造。
    * ε-NFA是明确地定义了至少一个空转移的NFA。
    * 在状态表里面多了对应于ε的一列。


> **定义1** ：ε-NFA
> 带空转移非确定有穷自动机ε-NFA，使用五元组表示，即A=(Q,Σ,δ,q0,F)A=(Q,\Sigma,\delta,q_0,F)A=(Q,Σ,δ,q0​,F)
>   1. QQQ：有穷状态集；
>   2. Σ\SigmaΣ：有穷输入符号集或字母表；
>   3. δ\deltaδ：Q×(Σ∪ε)→2QQ×(\Sigma\cup \varepsilon)\to 2^{Q}Q×(Σ∪ε)→2Q
>   4. q0∈Qq_0 \in Qq0​∈Q：初始状态
>   5. F⊆QF\subseteq QF⊆Q：终结状态集或接受状态集。
> 

> 注意：此后除非特别申明，不再明确区分ε−NFA\varepsilon-NFAε−NFA和NFANFANFA，而是都称为NFANFANFA。
  * 对于ε−NFA\varepsilon-NFAε−NFA来说，状态转移函数的定义和NFANFANFA基本上是一样的，只是多了一个ε\varepsilonε，但是我们在使用递归定义扩展状态转移函数的时候如果使用和NFANFANFA一样的递归定义就会出现问题。
  * 所以引入了一个ε−Closure\varepsilon-Closureε−Closure，即ε-闭包的概念，以完善ε−NFA\varepsilon-NFAε−NFA的扩展状态转移函数的递归定义。


> **定义2** ：状态的ε-闭包
> 状态qqq的ε-闭包，记为ECLOSE(q)ECLOSE(q)ECLOSE(q)，表示从qqq经过εε...ε\varepsilon \varepsilon ...\varepsilonεε...ε序列课到达的全部状态集合。（即经过0个或>0个空转移到达的状态集合），递归定义如下：
>   1. q∈ECLOSE(q)q\in ECLOSE(q)q∈ECLOSE(q)；包含当前状态本身
>   2. ∀p∈ECLOSE(q)\forall p \in ECLOSE(q)∀p∈ECLOSE(q)，若r∈δ(p,ε)r\in \delta(p,\varepsilon)r∈δ(p,ε)，则r∈ECLOSE(q)r\in ECLOSE(q)r∈ECLOSE(q)；（从当前状态通过有限个空串可以直接可达或间接可达的都算是状态qqq的ε-闭包）
> 

> 注意：定义2只说明了单个状态的ε-闭包，但是NFA状态转移是一个状态集合，所以还要定义状态集的ε-闭包
> **定义3** ：状态集的ε-闭包
> ECLOSE(S)=∪q∈SECLOSE(q)ECLOSE(S)=\cup_{q\in S}ECLOSE(q)ECLOSE(S)=∪q∈S​ECLOSE(q)，即一个状态集SSS的ε-闭包为SSS里面每个状态的ε-闭包的并集。
  * 例题1：求下面这个ε−NFA\varepsilon-NFAε−NFA的ECLOSE(1)ECLOSE(1)ECLOSE(1)和ECLOSE(2)ECLOSE(2)ECLOSE(2)


[![image-20260806065646669](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260806065646669.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260806065646669.png)
> **定义4** ：ε−NFA\varepsilon-NFAε−NFA的扩展转移函数
> 扩展δ\deltaδ到字符串，定义扩展转移函数δ^:Q×Σ∗→2Q\hat{\delta}:Q×\Sigma^{*}\to 2^{Q}δ^:Q×Σ∗→2Q为：
> δ^={ECLOSE(q),ω=εECLOSE(∪p∈δ(q,x)^δ(p,a)),ω=xa\hat{\delta} =\begin{cases}ECLOSE(q),&\omega = \varepsilon \\\ECLOSE(\cup_{p\in\hat{\delta(q,x)}}\delta(p,a)),&\omega=xa\end{cases}δ^={ECLOSE(q),ECLOSE(∪p∈δ(q,x)^​​δ(p,a)),​ω=εω=xa​
> 其中，aaa是一个字符，ω\omegaω和xxx是一个字符串。
  * 例题2：倒数给字符至少有一个是L={ω∈{0,1}∗∣ω倒数3给字符至少有一个是1}L=\\{\omega \in \\{0,1\\}^{*}|\omega倒数3给字符至少有一个是1\\}L={ω∈{0,1}∗∣ω倒数3给字符至少有一个是1}的ε−NFA\varepsilon -NFAε−NFA如下图所示，求δ^(q0,10)\hat{\delta}(q_0,10)δ^(q0​,10)


[![image-20260806070632068](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260806070632068.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260806070632068.png)
> **定义5** ：ε−NFA\varepsilon-NFAε−NFA的可接收语言
> 若E=(Q,Σ,δ,q0,F)E=(Q,\Sigma,\delta,q_0,F)E=(Q,Σ,δ,q0​,F)是一个ε−NFA\varepsilon-NFAε−NFA，则EEE接受的语言为L(E)={ω∈Σ∗∣δ^(q0,ω)∩F≠∅}L(E)=\\{\omega \in \Sigma ^{*}|\hat{\delta}(q_0,\omega)\cap F≠\emptyset\\}L(E)={ω∈Σ∗∣δ^(q0​,ω)∩F=∅}
###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%CE%B5-nfa%E4%B8%8Edfa) ε-NFA与DFA
  * ε−NFA\varepsilon -NFAε−NFA与DFADFADFA同样也是等价的，需要进行证明。具体等价性定理如下：


> **定理1** ：
> 如果语言LLL被ε−NFA\varepsilon -NFAε−NFA接受，当且仅当LLL被DFA接受。
###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%CE%B5-nfa%E4%B8%8Edfa%E7%BB%83%E4%B9%A0) ε-NFA与DFA练习
##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E4%B8%8E%E6%AD%A3%E5%88%99%E8%AF%AD%E8%A8%80) 正则表达式与正则语言
  * 正则表达式的历史： 
    * 正则表达式的起源： 
      * `Warren McCulloch`和`Walter Pitts`这两位神经生理方面的科学家，研究出了一种用数学方式来描述神经网络的新方法。
      * `Stephen Kleene`的数学科学家，在上面两位的基础之上，发表了`《神经网事件的表示法》`这篇论文，利用称之为正则集合的数学符号来描述此模型，引入了正则表达式的概念。
    * 正则表达式的发展： 
      * 过后一段事件，`Ken Thompson`(Unix之父)就把正则表达式用于搜索算法的一些早期研究，并被广泛应用到`Unix`或者`类Unix`的工具中，如`Perl`。
      * 近20年来，`Windows`阵营下，正则表达式的思想和应用在大部分`Windows`开发者工具包中得到支持和嵌入应用。
  * 正则表达式与正则语言： 
    * 正则语言的定义：（回顾） 
      * 如果语言LLL是某个DFA，D识别的语言，则称其为正则语言。
      * 注1：∅\emptyset∅，{ε}\\{\varepsilon\\}{ε}都是正则语言
      * 注2：由于DFA、NFA等价，所以可以扩展成`如果语言L是某个DFA，D识别的语言(或者是某个NFA,N识别语言)，则称其为正则语言。`
    * 正则表达式： 
      * 通过代数式表示或产生正则语言，便于正则语言的计算机处理。
      * 正则表达式所表示的语言与正则语言等价。
      * 应用：`vim`编辑器、`grep`工具，各种程序设计语言。


###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E8%AF%AD%E8%A8%80%E7%9A%84%E8%BF%90%E7%AE%97%E5%9B%9E%E9%A1%BE) 语言的运算(回顾)
> **回顾1** ：语言的定义
> 若Σ\SigmaΣ为字母表且∀L⊆Σ∗\forall L \subseteq \Sigma^{*}∀L⊆Σ∗，则LLL称为字母表Σ\SigmaΣ上的语言。
> 说明1：语言LLL实际上是一个集合
> **回顾2** ：语言的运算（集合的运算）
> 设LLL和MMM是两个语言，那么：
>   1. 语言的并运算：或L∪M={ω∣ω∈L或ω∈M}L\cup M=\\{\omega|\omega\in L或\omega \in M\\}L∪M={ω∣ω∈L或ω∈M}
>   2. 语言的连接：且L⋅M={ω∣ω=xy,x∈L且y∈M}L·M=\\{\omega| \omega = xy,x\in L且y\in M\\}L⋅M={ω∣ω=xy,x∈L且y∈M}
>   3. 语言的幂：L0={ε},L1=L,Ln=Ln−1⋅LL^{0}=\\{\varepsilon\\},L^{1}=L,L^{n}=L^{n-1}·LL0={ε},L1=L,Ln=Ln−1⋅L
>   4. 克林闭包：L∗=∪i=0∞LiL^{*}=\cup^{\infty}_{i=0}L^{i}L∗=∪i=0∞​Li
> 

###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E7%9A%84%E8%BF%90%E7%AE%97) 正则表达式的运算
> **定义1** ：基础运算（正则表达式的基础定义）
> 基础运算1：∅\emptyset∅是一个正则表达式，表示空语言∅\emptyset∅
> 基础运算2：ε\varepsilonε是一个正则表达式，表示语言{ε}\\{\varepsilon\\}{ε}
> 基础运算3：对于任意一个符号aaa，aaa是一个正则表达式，表示语言{a}\\{a\\}{a}，其有一个长度为1的字符串
> **定义2** ：归纳运算（正则表达式的定义）
> 归纳1：如果E1E_1E1​和E2E_2E2​是正则表达式，那么E1+E2E_1+E_2E1​+E2​也是正则表达式，且L(E1+E2)=L(E1)∪L(E2)L(E_1+E_2)=L(E_1)\cup L(E_2)L(E1​+E2​)=L(E1​)∪L(E2​)
> 归纳2：如果E1E_1E1​和E2E_2E2​是正则表达式，那么E1E2E_1E_2E1​E2​也是正则表达式，且L(E1E2)=L(E1)L(E2)L(E_1E_2)=L(E_1)L(E_2)L(E1​E2​)=L(E1​)L(E2​)
> 归纳3：如果EEE是正则表达式，则E∗E^{*}E∗也是正则表达式。
> 归纳4：如果EEE是正则表达式，则(E)(E)(E)也是正则表达式，表示语言L(E)L(E)L(E)。
注解1：从正则表达式的基础运算中，可以很明确表示正则表达式是一个语言，也就是字符串构成的集合。
注解2：从归纳运算中可以得到，我们一般使用`字符+运算符`来表示一个正则表达式，这样表示就便于机器理解。
  * 比如：(a+b)(b∗+a)(a+b)(b^{*}+a)(a+b)(b∗+a)
    * 其中aaa代表的是正则表达式语言{a}\\{a\\}{a}
    * 其中bbb代表的是正则表达式语言{b}\\{b\\}{b}
    * 而a+ba+ba+b代表的是正则表达式语言{a,b}\\{a,b\\}{a,b}


补充：四个归纳运算的有优先级如下
[![image-20260806215002456](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260806215002456.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260806215002456.png)
  * 例1：计算1+01∗1+01^{*}1+01∗
  * 例2：给出正则表达式(a+b)∗(a+bb)(a+b)^{*}(a+bb)(a+b)∗(a+bb)定义的语言。


###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E4%B8%8E%E6%9C%89%E7%A9%B7%E8%87%AA%E5%8A%A8%E6%9C%BA) 正则表达式与有穷自动机
  * 正则表达式和有穷自动机、、DFA、NFA、ε−NFADFA、NFA、\varepsilon-NFADFA、NFA、ε−NFA在表示语言的能力上是等价的。证明分析如下： 
    * 通过证明正则表达式DFA→正则表达式DFA \to 正则表达式DFA→正则表达式，证明出其中一个方向的箭头。
    * 通过证明正则表达式正则表达式→ε−NFA正则表达式\to \varepsilon -NFA正则表达式→ε−NFA，证明出另一个方向的箭头。


[![image-20260806215237833](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260806215237833.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260806215237833.png)
> **定理1** ：从DFA到正则表达式
> 若L=L(A)L=L(A)L=L(A)是某DFA，A语言，那么存在正则表达式RRR满足L=L(R)L=L(R)L=L(R)
> 证明方法可以有递归法、状态消除法这两种。
  * 最终可以证明得到正则表达式可以表达的正则语言，也能被DFA所表达。不妨设111是所构造DFA的开始结点，则和DFA等价的正则表达式就是∪j∈FR1,jn\cup_{j\in F}R_{1,j}^{n}∪j∈F​R1,jn​，即从状态111到终结状态的所有路径的集合。
  * 接下来是使用状态消除法对定理1的证明，证明过程不需要掌握，但是构造方法需要掌握。


> **定理2** ：从正则表达式到ε−NFA\varepsilon-NFAε−NFA
> 每个正则表达式定义的语言，都可被有穷自动机识别。
> ⇔\Leftrightarrow⇔
> 任何正则表达式RRR，都存在与其等价的$\varepsilon -NFA 自动机自动机自动机自动机A，即，即，即，即L(A)=L®，并且，并且，并且，并且A$满足：
>   1. 仅有一个接受状态
>   2. 没有进入开始状态的边
>   3. 没有离开接受状态的边
> 

> [![image-20260808094444140](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260808094444140.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260808094444140.png)
###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E7%9A%84%E4%BB%A3%E6%95%B0%E5%AE%9A%E5%BE%8B) 正则表达式的代数定律
  * 正则表达式关于连接的运算是构成一个半群。


> **性质1** ：交换律和结合律
>   1. L+M=M+LL+M=M+LL+M=M+L
>   2. (L+M)+N=L+(M+N)(L+M)+N=L+(M+N)(L+M)+N=L+(M+N)
>   3. (LM)N=L(MN)(LM)N=L(MN)(LM)N=L(MN)
> 

> 注意：连接不满足交换律LM≠MLLM≠MLLM=ML
> **性质2** ：单位元
>   1. ∅+L=L+∅=L\emptyset +L = L+ \emptyset=L∅+L=L+∅=L
>   2. εL=Lε=L\varepsilon L=L\varepsilon =LεL=Lε=L
> 

> **性质3** ：零元
>   1. ∅L=L∅=∅\emptyset L=L\emptyset = \emptyset∅L=L∅=∅
> 

> **性质4** ：分配律
>   1. L(M+N)=LM+LNL(M+N)=LM+LNL(M+N)=LM+LN
>   2. (M+N)L=ML+NL(M+N)L=ML+NL(M+N)L=ML+NL
> 

> **性质5** ：幂等律
>   1. L+L=LL+L=LL+L=L
> 

> **性质6** ：有关闭包的定律
>   1. (L∗)∗=L∗(L^{*})^{*}=L^{*}(L∗)∗=L∗
>   2. ∅∗=ε\emptyset ^{*}=\varepsilon∅∗=ε
>   3. ε∗=ε\varepsilon ^{*}=\varepsilonε∗=ε
> 

> **性质7** ：
>   1. L∗L∗=L∗L^{*}L^{*}=L^{*}L∗L∗=L∗
>   2. (L+M)∗=(L∗M∗)(L+M)^{*}=(L^{*}M^{*})(L+M)∗=(L∗M∗)
> 

###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%AD%A3%E5%88%99%E8%AF%AD%E8%A8%80%E7%9A%84%E6%80%A7%E8%B4%A8) 正则语言的性质
  * 如何判定一个语言是否是正则语言，这个问题是一个比较关键的问题，也是我们学习正则语言的性质主要的用途。 
    * 正向判定：存在一个自动机能接收该语言 
      * 构造自动机法：根据正则语言的定义，能被有穷状态自动机接收的语言就是正则语言。此时我们就可以构造`NFA或DFA或ε-NFA`。对某个目标语言进行判定。
      * 构造正则表达式法：根据正则语言的定义，以及正则表达式与正则语言的等价性，我们就可以通过构造一个正则表达式，从而判定该语言是否是正则语言。
    * 反向判定：任意的自动机都不能接受该语言（这个比较麻烦，所以引出了如下几个反向判定的定理） 
      * 泵引理：泵引理是是正则语言的一个必要条件，只要找出该语言中的一个例子不满足泵引理，就可以得出该语言不是正则语言。
      * 正则语言的封闭性：利用一些正则语言运算的封闭性就可以判断一个语言是否是正则语言。
      * 正则语言的判定性质


> **性质1** ：泵引理
> 如果语言LLL是正则的，那么存在正整数NNN，对ω∈L\omega \in Lω∈L ，只要∣ω∣≥N|\omega|≥N∣ω∣≥N，就可以将$\omega 分为三个部分分为三个部分分为三个部分分为三个部分\omega = xyz$ ，满足：
>   1. $y ≠ \varepsilon （或（或（或（或|y| ＞0$）
>   2. ∣xy∣≤N|xy|≤N∣xy∣≤N
>   3. ∀k≥0,xykz∈L\forall k ≥0,xy^{k}z\in L∀k≥0,xykz∈L：中间的串不论循环几次，所得的串仍属于该正则语言。
> 

  * 例1：证明L_{01}=\set{0^{n}1^{n}|n≥0}不是正则语言。0
  * 例2：证明L=\set{0^{i}1^{j}|i＞j}不是正则的。
  * 例3：证明L=\set{a^{n!}|n >0}不是正则的。0


> **性质2** ：正则语言的封闭性——正则语言经过某些运算后得到的新语言仍然是正则语言，则称正则语言在这些运算下封闭。常用的封闭运算如下：
>   1. 并运算：L∪ML\cup ML∪M
>   2. 连接运算：L⋅ML·ML⋅M
>   3. 闭包运算：L∗L^{*}L∗
>   4. 交运算：L∩ML\cap ML∩M
>   5. 反转运算：LR={ωR∣ω∈L}L^{R}=\\{\omega^{R}|\omega \in L\\}LR={ωR∣ω∈L}
>   6. 同态运算：同态h(L)={h(ω)∣ω∈L,同态:h:Σ→Γ∗}h(L)=\\{h(\omega)|\omega\in L,同态:h:\Sigma\to \Gamma^{*}\\}h(L)={h(ω)∣ω∈L,同态:h:Σ→Γ∗}
>   7. 逆同态：同态h−1(L)={ω∈Σ∗∣h(ω)∈L⊂Γ∗,同态:h:Σ→Γ∗}h^{-1}(L)=\\{\omega\in \Sigma^{*}|h(\omega)\in L\subset\Gamma^{*},同态:h:\Sigma\to \Gamma^{*}\\}h−1(L)={ω∈Σ∗∣h(ω)∈L⊂Γ∗,同态:h:Σ→Γ∗}
>   8. 补运算：L‾\overline{L}L
>   9. 差运算：L−ML-ML−M
> 

> 注意1：对于交运算来说，如果L1L_1L1​和L2L_2L2​不是正则的，那么L1∩L2L_1\cap L_2L1​∩L2​不一定是正则的，比如L1∩L2={ε}L_1\cap L_2 = \\{\varepsilon\\}L1​∩L2​={ε}这个情况。
  * 例1：证明L_{neq}=\set{\omega| \omega 由数量不相等的0和1构成}，不是正则的。
  * 例2：如果已知语言L_{01}=\set{0^{n}1^{n}|n≥0}不是正则的，请用封闭性证明语言，L_{eq}=\set{\omega| \omega 由数列相等的0和1构成}也不是正则的。


> **性质3** ：正则语言的判定性质
> 任何语言的三个判定问题：
>   1. 以某种形式化模型描述的语言是否为空？是否无穷？
>   2. 某种特定的串ω\omegaω是否属于所描述的语言？
>   3. 以两种方式描述的语言，是否相同？（语言的等价性）
> 

> **定理1** ：具有nnn个状态的有穷自动机MMM接受的集合SSS
>   1. SSS是非空的，当且仅当MMM接受某个长度小于nnn的状态。
>   2. SSS是无穷的，当前仅当MMM接受某个长度为mmm的串，n≤m≤2nn≤m≤2nn≤m≤2n
> 

> 所以，对于正则语言：
> 存在算法，判断其是否为空，只需检查全部长度小于nnn的串。
> 存在算法，判断其是否无穷，只需检查全部长度由nnn到2n−12n-12n−1的串。
> **定理2** ：存在算法，判定两个有穷自动机是否等价。
##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E8%87%AA%E5%8A%A8%E6%9C%BA%E7%9A%84%E6%9C%80%E5%B0%8F%E5%8C%96) 自动机的最小化
  * 一个正则语言可以有多种描述形式，能否找到最小的一个DFA。


> **定义1** ：状态的等价
> 对于一个DFAA=(Q,Σ,δ,q0,F)DFA~A=(Q,\Sigma,\delta,q_0,F)DFAA=(Q,Σ,δ,q0​,F)中两个状态ppp和qqq，对∀ω∈Σ∗\forall \omega \in \Sigma^{*}∀ω∈Σ∗：δ^(p,ω)∈F⇔δ^(q,ω)∈F\hat{\delta}(p,\omega)\in F\Leftrightarrow \hat{\delta}(q,\omega)\in Fδ^(p,ω)∈F⇔δ^(q,ω)∈F，则称这两个状态是等价的，否则称为可区分的。即，从ppp开始而被接受的串ω\omegaω，从qqq开始也会被接受。
> 注1：等价性只要求δ^(p,ω)\hat{\delta}(p,\omega)δ^(p,ω)和δ^(q,ω)\hat{\delta}(q,\omega)δ^(q,ω)同时在或不在FFF中，而不必是相同的状态。
> 注2：等价性需要对∀ω\forall \omega∀ω
> **填表算法区分状态对** ：该算法只适用于DFA，对于NFA是不适用的，下面会通过一个例题掌握算法的过程。
> **基础** ：如果p∈Fp\in Fp∈F而q∉Fq\notin Fq∈/F，则[p,q][p,q][p,q]是可区分的，本质上存在ω=ε\omega = \varepsilonω=ε，使得[p,q][p,q][p,q]是可区分的。
> **归纳** ：∃a∈Σ\exist a\in \Sigma∃a∈Σ，如果[r=δ(p,a),s=δ(q,a)][r=\delta(p,a),s=\delta(q,a)][r=δ(p,a),s=δ(q,a)]是可区分的，则[p,q][p,q][p,q]是可区分的，本质上是存在aωa\omegaaω使得[p,q][p,q][p,q]可区分，其中ω\omegaω是使得[r,s][r,s][r,s]是可区分的串。
  * 例1：用填表算法找到下图DFA中全部可区分状态对。


[![image-20260810094547881](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260810094547881.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260810094547881.png)
  * 根据填表算法取得的DFA A状态等价性，将状态集进行划分，得到不同的块。


[![image-20260810100057405](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260810100057405.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260810100057405.png)
  * 利用块构造新的DFA B，B的开始状态为包含A初始状态的块，B的接受状态为包含A的接受状态的块，转移函数为块之间的转移。则B是A的最小化DFA，即状态数量最少。


[![image-20260810100238656](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260810100238656.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260810100238656.png)
#  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8B%E6%8E%A8%E8%87%AA%E5%8A%A8%E6%9C%BApda) 下推自动机PDA
##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8A%E4%B8%8B%E6%96%87%E6%97%A0%E5%85%B3%E6%96%87%E6%B3%95%E4%B8%8E%E8%AF%AD%E8%A8%80) 上下文无关文法与语言
  * 上下文无关文法，英文全称为`Context Free Grammar`，简称为`CFG`，其中`文法`其实就是`语法`。 
    * 上下文无关文法拥有足够强的表达能力。
    * 上下文无关文法足够简单。
    * 上下文无关文法在程序设计语言的设计、编译器实现等方面有重要应用。
  * 上下文无关文法与正则语言的关系是包含关系，如下图所示：


[![image-20260811100034417](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260811100034417.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260811100034417.png)
###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E5%9B%9E%E6%96%87%E4%B8%8E%E5%9B%9E%E6%96%87%E8%AF%AD%E8%A8%80) 回文与回文语言
> **定义1** ：回文
> 如果字符串ω∈Σ∗\omega \in \Sigma^{*}ω∈Σ∗，满足ω=ωR\omega =\omega^{R}ω=ωR，则称字符串ω\omegaω为回文。
> 例如：ε\varepsilonε是回文，010010010是回文，000000000000是回文，radarradarradar是回文
> **定义2** ：回文语言
> 如果语言LLL的字符串都是回文，则称LLL为回文语言。
> 注：回文语言是上下文无关语言。
> **定义3** ：回文语言的表示（文法的嵌套定义）
> 回文语言同样也可以使用递归进行定义，在回文语言中使用文法对其定义（也就是一定的语法规则）
> [![image-20260811100719527](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260811100719527.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260811100719527.png)
> 注意：ε\varepsilonε不是终结符
  * 例1：字母表\Sigma = \set{0,1}上的回文语言L_{pal}=\set{\omega\in \set{0,1}^{*}|\omega = \omega^{R}}，使用泵引理证明其不是正则语言。
  * 例2：使用文法的嵌套定义表示一个字符串A=0110A=0110A=0110。
    * 使用④④A→0A0④A\to 0A0④A→0A0，那么就有A=0A0A = 0A0A=0A0
    * 再使用⑤⑤A→1A1⑤A\to 1A1⑤A→1A1，那么就有A=01A10A= 01A10A=01A10
    * 最后使用①①A→ε①A\to \varepsilon①A→ε，那么就有A=0110A=0110A=0110


> 过程：
>   1. 选取能够产生符号串的一系列产生式。
>   2. 在每一步，用某个产生式替换某个变元。（两边到中间的顺序。）
> 

###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8A%E4%B8%8B%E6%96%87%E6%97%A0%E5%85%B3%E6%96%87%E6%B3%95) 上下文无关文法
> **定义1** ：文法的定义
> 上下文无关文法`CFG,Context-Free Grammar`简称`文法`，是一个四元组G=(V,T,P,S)G=(V,T,P,S)G=(V,T,P,S)。其中：
>   1. VVV：是变元的有穷集，变元也称为**非终结符** 或**语法范畴** 。
>   2. TTT：终结符的有穷集，且V∩T=∅V\cap T=\emptysetV∩T=∅，即字母表。
>   3. PPP：产生式的有穷集，每个产生式包括：
> 

>   * 一个变元，称为产生式的头或左部；
>   * 一个产生式符号→\to→，读作**定义为** ；
>   * 一个(V∪T)∗(V\cup T)^{*}(V∪T)∗中的符号串，称为体或右部（由变元和终结符组成的字符串）
> 

>   1. SSS：初始符号S∈VS\in VS∈V，表示文法开始的地方
> 

> **定义2** ：文法的简写
>   1. 产生式A→αA\to \alphaA→α，读作AAA定义为α\alphaα。
>   2. 如果有多个AAA的产生式：A→α1,A→α2,...,A→αnA\to \alpha_1,A\to \alpha_2,...,A \to \alpha_nA→α1​,A→α2​,...,A→αn​，则可以简写成A→α1∣α2∣...∣αnA\to \alpha_1|\alpha_2|...|\alpha_nA→α1​∣α2​∣...∣αn​
> 

  * 补充：文法四元组的书写习惯如下：
    * 变元：通常使用A,B,C,...A,B,C,...A,B,C,...表示
    * 终结符：通常使用0,1,a,b,c,...0,1,a,b,c,...0,1,a,b,c,...表示
    * 终结符或非终结符：...,X,Y,Z...,X,Y,Z...,X,Y,Z表示
    * 终结符或非终结符组成的串：α,β,γ\alpha,\beta,\gammaα,β,γ
  * 例1：那么上面的回文语言的语法可以表示为四元组
G=(\set{A},\set{0,1},\set{A\to \varepsilon|0|1|0A0|1A1},\set{A})
  * 例2：利用文法表示算数表达式，其中该算数表达式有两个变元：
    * EEE：带有`加`和`乘`(+,∗)(+,*)(+,∗)的表达式本身
    * III：标识符以\set{a,b}开头，由\set{a,b,0,1}组成的字符串。
    * 过程如下：
      * 先确定该文法的四元组G_{exp}=(\set{E,I},\set{a,b,0,1,+,*,(,)},P,E)，其中产生式集PPP有10条表达式。
1.E→I2.E→E+E3.E→E∗E4.E→(E)5.I→a6.I→b7.I→Ia8.I→Ib9.I→I010.I→I11. E\to I\\\2. E\to E+E\\\3. E\to E*E\\\4. E\to (E)\\\5. I\to a\\\6. I\to b\\\7. I\to Ia\\\8. I\to Ib\\\9. I\to I0\\\10. I\to I11.E→I2.E→E+E3.E→E∗E4.E→(E)5.I→a6.I→b7.I→Ia8.I→Ib9.I→I010.I→I1


> **定义3** ：归约与派生的非形式定义
> 归约：从字符串到文法变元的分析过程，称为归约（自底向上，由产生式的体向头的分析）
> 派生：从文法变元到字符串的分析过程，称为派生（自顶向下，由产生式的头向体的分析）
  * 例1：用算数表达式文法GexpG_{exp}Gexp​，将a∗(a+b00)a*(a+b00)a∗(a+b00)归约（将字符串转换为初始符号EEE） 
    * 根据表达式⑤、⑥⑤、⑥⑤、⑥⑤、⑥可以得到a∗(a+b00)=I(I+I00)a*(a+b00)=I(I+I00)a∗(a+b00)=I(I+I00)
    * 根据表达式⑨⑨⑨⑨可以得到I(I+I00)=I(I+I)I(I+I00)=I(I+I)I(I+I00)=I(I+I)
    * 根据表达式①①①①可以得到I(I+I)=E(E+E)I(I+I)=E(E+E)I(I+I)=E(E+E)
    * 根据表达式②②②②可以得到E(E+E)=E∗(E)E(E+E)=E*(E)E(E+E)=E∗(E)
    * 根据表达式④④④④可以得到E∗(E)=E∗EE*(E)=E*EE∗(E)=E∗E
    * 根据表达式③③③③可以得到E∗E=EE*E=EE∗E=E
    * 最终将式子归约成了初始符号EEE
  * 例2：用算数表达式文法GexpG_{exp}Gexp​，写a∗(a+b00)a*(a+b00)a∗(a+b00)出派生过程


> **定义4** ：派生与归约的形式定义
> 若上下文无关文法G=(V,T,P,S)G = (V,T,P,S)G=(V,T,P,S)，设α,β,γ∈(V∪T)∗\alpha,\beta,\gamma\in (V\cup T)^{*}α,β,γ∈(V∪T)∗，A∈V,A→γ∈PA\in V,A\to \gamma \in PA∈V,A→γ∈P，那么称在GGG中由αAβ\alpha A \betaαAβ可派生出αγβ\alpha\gamma \betaαγβ，记为αAβ ⇒Gαγβ\alpha A \beta \underset{G}{\Rightarrow}\alpha\gamma\betaαAβG⇒​αγβ 。相应的，称αγβ\alpha \gamma \betaαγβ可归约为αAβ\alpha A \betaαAβ。
> 注解1：派生αAβ ⇒Gαγβ\alpha A \beta \underset{G}{\Rightarrow}\alpha \gamma \betaαAβG⇒​αγβ，即是用产生式A→γA \to \gammaA→γ的右部γ\gammaγ替换串αAβ\alpha A\betaαAβ中变元AAA得到串αγβ\alpha \gamma \betaαγβ的过程。这个替换过程不受到前面的、α、β\alpha、\betaα、β的影响，因此才被称为**上下文无关文法**
> 注解2：如果语境中GGG是已知的，可省略，记为αAβ⇒αγβ\alpha A \beta \Rightarrow \alpha \gamma \betaαAβ⇒αγβ
> **补充定义** ：
> 设α1,...,αm∈(V∪T)∗,m≥1\alpha_1,...,\alpha_m \in (V \cup T)^{*},m≥1α1​,...,αm​∈(V∪T)∗,m≥1，对i=1,...,m−1i=1,...,m-1i=1,...,m−1，如果有αi ⇒Gαi+1\alpha_i \underset{G}{\Rightarrow} \alpha_{i+1}αi​G⇒​αi+1​成立，即α1\alpha_1α1​通过零步或者多步派生可得到αm\alpha_mαm​，
> 即α1 ⇒Gα2 ⇒G... ⇒Gαm\alpha_1 \underset{G}{\Rightarrow} \alpha_2 \underset{G}{\Rightarrow}...\underset{G}{\Rightarrow}\alpha_mα1​G⇒​α2​G⇒​...G⇒​αm​，那么可以记为α1 ⇒Gαm\alpha_1 \underset{G}{\Rightarrow}\alpha_mα1​G⇒​αm​。
> 若α\alphaα派生出β\betaβ刚好经过iii步，可记为α ⇒Giβ\alpha \overset{i}{\underset{G}{\Rightarrow}}\betaαG⇒​i​β
> **定义5** ：最左派生和最右派生
> 为限制派生的随意性：
> 要求只替换符号串中最左边变元的派生过程称为**最左派生**(或者最左推导)，记为 ⇒lm∗\overset{*}{\underset{lm}{\Rightarrow}}lm⇒​∗​。
> 要求只替换符号串中最右边变元的派生过程称为**最右派生**(或者最右推到)，记为 ⇒rm∗\overset{*}{\underset{rm}{\Rightarrow}}rm⇒​∗​
> **定理1** ：
> 任何派生都有等价的最左派生和最右派生：A ⇒∗A\overset{*}{\Rightarrow}A⇒∗当且仅当A ⇒lm∗ωA\overset{*}{\underset{lm}{\Rightarrow}}\omegaAlm⇒​∗​ω，当且仅当A ⇒rm∗ωA\overset{*}{\underset{rm}\Rightarrow}\omegaArm⇒​∗​ω。
  * 例1：表达式a∗(a+a)a*(a+a)a∗(a+a)在GexpG_{exp}Gexp​中的最左派生
  * 例2：表达式a∗(a+a)a*(a+a)a∗(a+a)在GexpG_{exp}Gexp​中的最右派生


###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8A%E4%B8%8B%E6%96%87%E6%97%A0%E5%85%B3%E8%AF%AD%E8%A8%80) 上下文无关语言
> **定义1** ：上下文无关文法诱导的语言
> 上下文无关文法G=(V,T,P,S)G=(V,T,P,S)G=(V,T,P,S)的语言定义为L(G)=\set{\omega|\omega \in T^{*},S\overset{*}{\underset{G}{\Rightarrow}\omega}}。
> 即符号串ω\omegaω在L(G)L(G)L(G)中要满足：
>   1. ω\omegaω仅由终结符组成
>   2. 初始符号SSS能派生出ω\omegaω
> 

> **定义2** ：上下文无关语言
> 如果语言LLL是某个CFGGCFG~GCFGG定义的语言，即L=L(G)L=L(G)L=L(G)，则称LLL为上下文无关语言CFLCFLCFL`Context-Free Language`。
> 注：上下文无关是指在文法派生的每一步αAβ⇒αγβ\alpha A \beta \Rightarrow \alpha\gamma\betaαAβ⇒αγβ，符号串$\gamma 仅根据仅根据仅根据仅根据A的产生式派生，而无需依赖的产生式派生，而无需依赖的产生式派生，而无需依赖的产生式派生，而无需依赖A的上下文的上下文的上下文的上下文\alpha和和和和\beta$。
> **定义3** ：文法的等价性
> 如果有两个文法CFGG1CFG~ G_1CFGG1​和CFGG2CFG ~G_2CFGG2​，满足L(G1)=L(G2)L(G_1)=L(G_2)L(G1​)=L(G2​)，则称G1G_1G1​和G2G_2G2​是等价的。
> **定义4** ：句型
> 若文法G=(V,T,P,S)G=(V,T,P,S)G=(V,T,P,S)，初始符号SSS派生出来的符号串，称为GGG的句型，即α∈(V∪T)∗\alpha \in (V\cup T)^{*}α∈(V∪T)∗且S ⇒∗αS \overset{*}{\Rightarrow} \alphaS⇒∗α
> 如果S ⇒lm∗αS \overset{*}{\underset{lm}{\Rightarrow}}\alphaSlm⇒​∗​α，称α\alphaα为左句型。
> 如果S ⇒rm∗αS \overset{*}{\underset{rm}{\Rightarrow}}\alphaSrm⇒​∗​α，称α\alphaα为右句型。
> 只含有终结符的句型，也称为G的句子，而L(G)L(G)L(G)就是文法G全部的句子。
  * 例1：描述CFG ~G=(\set{S},\set{a,b},\set{S\to aSb,S\to ab},S)定义的语言


###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E8%AF%AD%E6%B3%95%E5%88%86%E6%9E%90%E6%A0%91) 语法分析树
> **定义1** ：语法分析树
> CFGG=(V,T,P,S)CFG ~ G = (V,T,P,S)CFGG=(V,T,P,S)的语法分析树`parse tree`，也称为**派生树**`derivation tree` ，其形式定义为：
>   1. 每个内节点的标记是VVV中的变元符号（即不是根节点，也不是叶节点就称为内节点）
>   2. 每个叶节点的标记是V\cup T \cup \set{\varepsilon}中的符号
>   3. 如果内节点的标记是AAA，其子节点从左至右分别为X1,X2,...,XnX_1,X_2,...,X_nX1​,X2​,...,Xn​，那么A→X1X2...XnA\to X_1X_2...X_nA→X1​X2​...Xn​是PPP的一个产生式。
> 

> 若某个XiX_iXi​为ε\varepsilonε，则XiX_iXi​一定是AAA唯一的子节点，且A→εA\to \varepsilonA→ε是一个产生式。
> 注解：语法分析树用来表示派生，可以从树种看出整个派生过程和最终产生的符号串
  * 例1：算是表达式文法GexpG_{exp}Gexp​推到算数表达式a∗(a+a)a*(a+a)a∗(a+a)的过程


> **定义2** ：
> 语法分析树的全部叶节点从左到右连接起来，称为该树的产物或结果。如果树根节点是初始符号SSS，叶节点是终结符，那么该树的产物属于L(G)L(G)L(G)
> **定义3** ：
> 语法分析树种标记为AAA的内节点及其全部子孙节点构成的子树，称为AAA子树。
[![image-20260812072544748](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260812072544748.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260812072544748.png)
> **定理1** ：语法分析树和派生的等价性
> CFGG=(V,T,P,S)CFG ~G=(V,T,P,S)CFGG=(V,T,P,S)且A∈VA\in VA∈V，那么文法GGG中A ⇒∗αA\overset{*}{\Rightarrow} \alphaA⇒∗α，当且仅当在文法GGG中存在以AAA为根节点产物为α的语法分析树。
###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%96%87%E6%B3%95%E5%92%8C%E8%AF%AD%E8%A8%80%E7%9A%84%E6%AD%A7%E4%B9%89%E6%80%A7) 文法和语言的歧义性
##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%96%87%E6%B3%95%E7%9A%84%E5%8C%96%E7%AE%80) 文法的化简
  * 在文法和语言中有一个典型的问题：给定CFGCCFG ~CCFGC和串ω\omegaω，判断ω∈L(G)\omega \in L(G)ω∈L(G)。该问题是编译器设计和自然语言处理的基本问题之一。
  * 而文法的形式非常自由，过于复杂不易于自动处理，为了便于分析和解决问题，以不改变语言为前提，化简文法和限制文法的格式，所以就有了**文法的化简** 和**文法范式**
  * 为了化简文法下面会学习化简文法的三个步骤： 
    * 消除ε-产生式：A→εA\to \varepsilonA→ε，得到语言L-\set{\varepsilon}，其中AAA是变元。
    * 消除单元产生式：A→BA\to BA→B，其中、A、BA、BA、B均是变元。
    * 消除无用符号：对文法定义语言没有贡献的符号，不出现在任何由开始符号推导出一个终结符串过程中的变元或终结符。
  * 文法简化步骤的顺序非常重要，一个可靠的顺序为： 
    * 消除产生式ε−产生式\varepsilon -产生式ε−产生式
    * 消除单元产生式
    * 消除非产生的无用符号
    * 消除非可达的无用符号


###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%B6%88%E9%99%A4%E6%97%A0%E7%94%A8%E7%AC%A6%E5%8F%B7) 消除无用符号
> **定义1** ：无用符号
> CFGG=(V,T,P,S)CFG~G=(V,T,P,S)CFGG=(V,T,P,S)，符号X∈(V∪T)X\in (V\cup T)X∈(V∪T)
>   1. 如果S ⇒∗αXβS\overset{*}{\Rightarrow}\alpha X\betaS⇒∗αXβ，称XXX是可达的
>   2. 如果X ⇒∗ω(ω∈T∗)X\overset{*}{\Rightarrow}\omega(\omega \in T^{*})X⇒∗ω(ω∈T∗)，称XXX是产生的
>   3. 如果XXX同时是产生的和可达的，即S ⇒∗αXβ ⇒∗ω(ω∈T∗)S\overset{*}{\Rightarrow}\alpha X\beta \overset{*}{\Rightarrow} \omega (\omega\in T^{*})S⇒∗αXβ⇒∗ω(ω∈T∗)，则称XXX是有用的，否则称XXX为无用符号。
> 

> 注解1：这里的`符号`，包括了变元和终结符
  * 计算`产生的`符号集： 
    * 每个TTT 中的符号都是产生的
    * A→α∈PA\to \alpha \in PA→α∈P且α\alphaα中符号都是产生的，则AAA是产生的。
  * 计算`可达的`符号集： 
    * 符号SSS是可达的
    * A→α∈PA\to \alpha \in PA→α∈P且AAA是可达的，则α中符号都是可达的。


> **定理1** ：
> 每个非空的`CFL` 都能被一个不带无用符号的`CFG`定义。
> 注意1：先寻找并消除全部非`产生的`符号，再寻找并消除全部非`可达的`符号，否则可能消除不完整
  * 例1：消除如下文法无用符号，有CFG~G=(\set{A,B,S},\set{a,b},\set{S\to AB,S\to a,A\to b},S)。
    * 消除非产生的符号集： 
      * 对于终结符号\set{a,b} ，都是可产生的。
      * 对于变元\set{S,A,B}中，S→a,A→bS\to a,A\to bS→a,A→b，可以得到\set{S,A}可产生。
      * 故消去变元BBB，消除非产生符号集后可以得到新的一个CFG~G'=(\set{A,S},\set{a,b},\set{S\to a,A\to b},S)
    * 消除非可达的符号集（从消除非产生的符号集后得到的CFGG′CFG~G'CFGG′中进行消除）： 
      * 对于初始符号SSS是可达的。
      * 对于S→aS\to aS→a，可以得到aaa是可达的。
    * 故消去变元AAA和终结字符bbb，最终得到CFG~G''=(\set{S},\set{a},\set{S\to a},S)


###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%B6%88%E9%99%A4%CE%B5-%E4%BA%A7%E7%94%9F%E5%BC%8F) 消除ε-产生式
> **定义1** ：可空的定义
> 文法中形如$A\to \varepsilon 的产生式称为的产生式称为的产生式称为的产生式称为\varepsilon -产生式。如果变元。如果变元。如果变元。如果变元A\overset{*}{\Rightarrow} \varepsilon，称，称，称，称A$是可空的。
>   1. 产生式ε−产生式\varepsilon -产生式ε−产生式在文法定义语言时，除产生空串外没有其他帮助
>   2. 对于CFLLCFL ~LCFLL，消除其文法中全部的产生式后ε−产生式后\varepsilon -产生式后ε−产生式后，得到语言L-\set{\varepsilon}
> 

  * 确定`可空变元`： 
    * 如果A→εA\to \varepsilonA→ε，则AAA是可空的。
    * 如果B→αB\to \alphaB→α，且α\alphaα中每个符号都是可空的，则BBB是可空的。
  * 去除`可空变元`，替换产生式： 
    * 将含有可空变元的一条产生式A→X1X2...XnA\to X_1X_2...X_nA→X1​X2​...Xn​，用一组产生式A→Y1Y2...YnA\to Y_1Y_2...Y_nA→Y1​Y2​...Yn​代替，其中： 
      * 若XiX_iXi​不是可空的，YiY_iYi​为XiX_iXi​
      * 若XiX_iXi​是可空的，YiY_iYi​为XiX_iXi​或ε\varepsilonε（即对于每个可空变元，它可以出现或不出现在替换后的产生式中）
      * YiY_iYi​不能全为ε\varepsilonε
    * 将产生式全部替换后，就可以得到一个新的语言即语言L-\set{\varepsilon}


> **定理** ：任何CFGGCFG ~GCFGG，都存在一个不带无用符号和产生式ε−产生式\varepsilon -产生式ε−产生式的CFGG′CFG~G'CFGG′，使得L(G')=L(G)-\set{\varepsilon}
  * 例1：消除CFG~G=(\set{S,A,B},\set{a,b},\set{S\to AB,A\to AaA|\varepsilon,B\to BbB|\varepsilon,},S)的产生式ε−产生式\varepsilon -产生式ε−产生式， 
    * 确定可空变元： 
      * A→ε,B→εA\to \varepsilon ,B\to \varepsilonA→ε,B→ε可以确定\set{A,B}都是可空的。
      * S→ABS\to ABS→AB，再由\set{A,B}都是可空的，可以得到\set{S}也是可空的。
      * 所以\set{A,B,S}都是可空的。
    * 替换全部带有可空符号的产生式： 
      * S→ABS\to ABS→AB：S→AB∣A∣BS\to AB|A|BS→AB∣A∣B
      * A→AaAA\to AaAA→AaA：A→AaA∣aA∣Aa∣aA\to AaA|aA|Aa|aA→AaA∣aA∣Aa∣a
      * B→BbBB\to BbBB→BbB：B→BbB∣bB∣Bb∣bB\to BbB|bB|Bb|bB→BbB∣bB∣Bb∣b


###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%B6%88%E9%99%A4%E5%8D%95%E5%85%83%E4%BA%A7%E7%94%9F%E5%BC%8F) 消除单元产生式
> **定义1** ：单元对
> 如果有A ⇒∗BA\overset{*}{\Rightarrow}BA⇒∗B，则称[A,B][A,B][A,B]为单元对。
  * 确定单元对： 
    * A→B∈PA\to B \in PA→B∈P，则[A,B][A,B][A,B]是单元对。
    * 若[A,B][A,B][A,B]和[B,C][B,C][B,C]都是单元对，则[A,C][A,C][A,C]也是单元对。
  * 消除单元产生式： 
    * 删除全部形为A→BA\to BA→B的单元产生式
    * 对每个单元对[A,B][A,B][A,B]，将BBB的产生式复制给AAA。


> **定理** ：
> 每个不带$\varepsilon 的的的的CFL都可由一个不带无用符号，都可由一个不带无用符号，都可由一个不带无用符号，都可由一个不带无用符号，\varepsilon -产生式$和单元产生式的文法来定义。
  * 例1：给定CFG~ G=(\set{S,A,B},\set{0,1},P,S)，其中PPP为S→A∣B∣0S1,A→0A∣0,B→1B∣1S\to A|B|0S1,A\to 0A|0,B\to 1B|1S→A∣B∣0S1,A→0A∣0,B→1B∣1。 
    * 先确定单元产生式：S→A,S→BS\to A,S\to BS→A,S→B
    * 再代入非单元产生式： 
      * 非单元产生式：S→0S1,A→0A∣0,B→1B∣1S\to 0S1,A\to 0A|0,B\to 1B|1S→0S1,A→0A∣0,B→1B∣1
      * 将A→0A∣0A\to 0A|0A→0A∣0，代入到S→AS\to AS→A得到：S→0A∣0S\to 0A|0S→0A∣0
      * 将B→1B∣1B\to 1B|1B→1B∣1，代入到 S→BS\to BS→B得到：S→1B∣1S\to 1B|1S→1B∣1
    * 注意：在代入过程中，用SSS仅替换、A、BA、BA、B作为左部的变元，右部部分保持不变。如果同时替换右部的、A、BA、BA、B，将引入新的字符串，改变文法的表示能力。


##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%96%87%E6%B3%95%E7%9A%84%E8%8C%83%E5%BC%8F) 文法的范式
  * 乔姆斯基范式`Chomsky normal Form,CNF`和格雷巴赫范式`Greibach Normal Form,GNF`对文法的格式分别进行了规范化。


###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B9%94%E5%A7%86%E6%96%AF%E5%9F%BA%E8%8C%83%E5%BC%8Fcnf) 乔姆斯基范式CNF
> **定理1** ：乔姆斯基范式
> 每个不带ε\varepsilonε的CFL都可以由这样的CFGGCFG~GCFGG定义，GGG中每个产生式的形式都为A→BCA\to BCA→BC或A→aA\to aA→a，其中A,B,CA,B,CA,B,C是变元，aaa是终结符。
  * 例1：CFG~G=(\set{S,A,B},\set{a,b},P,S)，产生式集合PPP为：S→bA∣aB,A→bAA∣aS∣a,B→aBB∣bS∣bS\to bA|aB,A\to bAA|aS|a,B\to aBB|bS|bS→bA∣aB,A→bAA∣aS∣a,B→aBB∣bS∣b，设计等价的CNFCNFCNF文法。
    * 替换终结符： 
      * Cb→bC_b\to bCb​→b，Ca→aC_a\to aCa​→a
      * S→bA∣aBS\to bA|aBS→bA∣aB：S→CbA∣CaBS\to C_bA|C_aBS→Cb​A∣Ca​B
      * A→bAA∣aS∣aA\to bAA|aS|aA→bAA∣aS∣a ：A→CbAA∣CaS∣aA\to C_bAA|C_aS|aA→Cb​AA∣Ca​S∣a
      * B→aBB∣bS∣bB\to aBB|bS|bB→aBB∣bS∣b：B→CaBB∣CbS∣bB\to C_aBB|C_bS|bB→Ca​BB∣Cb​S∣b
    * 替换级联产生式： 
      * 对于S→CbA∣CaBS\to C_bA|C_aBS→Cb​A∣Ca​B无需替换级联产生式。
      * 对于A→CbAA∣CaS∣aA\to C_bAA|C_aS|aA→Cb​AA∣Ca​S∣a：令D1→AAD_{1}\to AAD1​→AA，则A→CbD1∣CaS∣aA\to C_bD_1|C_aS|aA→Cb​D1​∣Ca​S∣a
      * 对于B→CaBB∣CbS∣bB\to C_aBB|C_bS|bB→Ca​BB∣Cb​S∣b：令D2→BBD_2\to BBD2​→BB，则A→CaD1∣CbS∣bA\to C_aD_1|C_bS|bA→Ca​D1​∣Cb​S∣b
  * 例2：CFG~G=(\set{S,A,B},\set{a,b,c},\set{S\to ABa,A\to aab,B\to Ac},S)，设计等价的CNFCNFCNF文法。
    * 替换终结符： 
      * Ca→aC_{a}\to aCa​→a，Cb→b,Cc→cC_b\to b,C_{c}\to cCb​→b,Cc​→c
      * S→ABaS\to ABaS→ABa：S→ABCaS\to ABC_aS→ABCa​
      * A→aabA\to aabA→aab：A→CaCaCbA\to C_aC_aC_bA→Ca​Ca​Cb​
      * B→AcB\to AcB→Ac：B→ACcB\to AC_cB→ACc​
    * 替换级联产生式： 
      * 对于S→ABCaS\to ABC_aS→ABCa​：令D1→BCaD_1\to BC_aD1​→BCa​，则S→AD1S\to AD_1S→AD1​
      * 对于A→CaCaCbA\to C_aC_aC_bA→Ca​Ca​Cb​，令D2→CaCbD_2 \to C_aC_bD2​→Ca​Cb​，则A→CaD2A\to C_aD_2A→Ca​D2​
      * 对于B→ACcB\to AC_cB→ACc​无需替换。
    * 所以最终等价的CNFCNFCNF文法为G'=(\set{S,A,B,C_a,C_b,C_c,D_1,D_2},\set{a,b,c},\set{C_a\to a,C_b \to b,C_c \to c,D_1\to BC, S\to AD_1,D_2\to C_aC_b,A\to C_aD_2,B\to AC_c},S)


###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%A0%BC%E9%9B%B7%E5%B7%B4%E8%B5%AB%E8%8C%83%E5%BC%8F) 格雷巴赫范式
> 定理1：格雷巴赫范式
> 每个不带ε\varepsilonε的CFLCFLCFL都可以由这样的CFGGCFG~GCFGG定义，GGG中每个产生式的形式都为A→aαA\to a \alphaA→aα，其中AAA是变元，aaa是终结符，α\alphaα是零或多个变元的串
> 注1：GNF每个产生式都会引入一个终结符
> 注2：长度为n的串派生恰好是n步
  * 例1：有CFG~G=(\set{S,A,B},\set{a,b},\set{S\to AB,A\to aA|bB|b,B\to b},S)，将其转换为GNFGNFGNF。 
    * 对于产生式：A→aA∣bB∣b,B→bA\to aA|bB|b,B\to bA→aA∣bB∣b,B→b来说都符合GNFGNFGNF。
    * 接下来只需要对产生式：S→ABS\to ABS→AB进行转换即可，只需要将S→ABS\to ABS→AB进行代入即可：S→aAB∣bBB∣bBS\to aAB|bBB|bBS→aAB∣bBB∣bB
    * 最终得到如下产生式： 
      * S→aAB∣bBB∣bBS\to aAB|bBB|bBS→aAB∣bBB∣bB
      * A→aA∣bB∣bA\to aA|bB|bA→aA∣bB∣b
      * B→bB\to bB→b
  * 例2：将以下文法转换为GNFGNFGNF：S→01S1∣00S\to 01S1|00S→01S1∣00
    * 引入新的变元AAA，增加产生式A→1A\to 1A→1
    * 则S→01S1转换为 S→0ASAS\to 0ASAS→0ASA
    * 再引入新的变元BBB，增加产生式B→0B\to 0B→0
    * 则S→00S\to 00S→00转换为S→0BS\to 0BS→0B


##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8B%E6%8E%A8%E8%87%AA%E5%8A%A8%E6%9C%BA) 下推自动机
###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8B%E6%8E%A8%E8%87%AA%E5%8A%A8%E6%9C%BA%E5%AE%9A%E4%B9%89) 下推自动机定义
  * 具备与上下文无关文法等价的定义语言的能力，可以看作ε−NFA\varepsilon -NFAε−NFA和一个栈的结合。
  * 它的动作由三个要素决定： 
    * 当前NFANFANFA的状态
    * 当前的输入符号（或者是ε\varepsilonε）
    * 当前的栈顶符号：后进先出，只用栈顶，长度无限，有两个操作： 
      * 弹栈：仅弹出栈顶的**一个符号**
      * 压栈：可压入**一串符号**
  * 下推自动机的抽象装置：运转如下 
    * 控制器从输入带读入一个符号aaa，控制栈弹出一个栈顶符号ZZZ
    * 根据符号aaa、符号ZZZ、当前所处的状态进行状态转移并对栈压入000个符号或者压入一个符号串。 
      * 000个符号意味着弹出操作。
      * 111个符号串意味着压入操作。


[![image-20260814082708027](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260814082708027.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260814082708027.png)
> **定义1** ：下推自动机
> 下推自动机`Pushdown Automata,PDA`PPP为七元组P=(Q,Σ,Γ,δ,q0,Z0,F)P=(Q,\Sigma,\Gamma,\delta,q_0,Z_0,F)P=(Q,Σ,Γ,δ,q0​,Z0​,F)
>   1. QQQ：有穷状态集
>   2. Σ\SigmaΣ：有穷输入符号集
>   3. Γ\GammaΓ：有穷栈符号集
>   4. δ\deltaδ：Q×(\Sigma \cup \set{\varepsilon})×\Gamma\to 2^{Q×\Gamma^{*}}：状态转移函数
>   5. q0∈Qq_0 \in Qq0​∈Q：初始状态
>   6. Z0Z_0Z0​：Γ−Σ\Gamma -\SigmaΓ−Σ初始栈底符号
>   7. F⊆QF\subseteq QF⊆Q：接受状态集
> 

  * 下推自动机中符号使用一般约定：
    * ε,a,b,...\varepsilon ,a,b,...ε,a,b,...为输入带上的符号
    * ....,X,Y,Z....,X,Y,Z....,X,Y,Z为栈中的符号
    * ....,w,x,y,z....,w,x,y,z....,w,x,y,z为输入的字符串
    * α,β,...\alpha,\beta,...α,β,...为栈字符串
  * 例1：设计识别L_{01}=\set{0^{n}1^{n}|n≥1}


> **定义2** ：瞬时描述
> 为描述PDAPDAPDA瞬间的格局，定义Q×Σ∗×Γ∗Q×\Sigma^{*}×\Gamma^{*}Q×Σ∗×Γ∗三元组(q,w,γ)(q,w,\gamma)(q,w,γ)为瞬时描述，三元组(q,w,γ)(q,w,\gamma)(q,w,γ)
>   1. qqq是当前状态
>   2. www是剩下的输入符号串
>   3. γ\gammaγ是栈中的符号串（栈顶符号在前）
> 

> **定义3** ：ID的转移
> 在PDAPDAPDA的一个动作下，由IDIID~IIDI 到IDJID ~JIDJ的变化，称为IDIDID的转移。具体的，如果(p,β)∈δ(q,a,Z)(p,\beta)\in \delta(q,a,Z)(p,β)∈δ(q,a,Z)，由(q,aw,Zα)(q,aw,Z\alpha)(q,aw,Zα)到(p,w,βα)(p,w,\beta\alpha)(p,w,βα)的变化，称为IDIDID的转移⊢p\vdash_p⊢p​，或者⊢\vdash⊢（当所指PDA明确时）记为(q,aw,Zα)⊢(p,w,βα)(q,aw,Z\alpha)\vdash (p,w,\beta\alpha)(q,aw,Zα)⊢(p,w,βα)
> **定义4** ：扩展ID转移
> 扩展⊢\vdash⊢到⊢∗\vdash^{*}⊢∗，表示经过零个或多个动作进行转移
>   1. 基础：I⊢∗II\vdash^{*} II⊢∗I
>   2. 递推：若I⊢J,J⊢∗KI\vdash J,J\vdash^{*}KI⊢J,J⊢∗K，则I⊢∗KI\vdash^{*}KI⊢∗K
> 

> **定义5** ：PDA以终态方式接受语言
> PDAP=(Q,Σ,Γ,δ,q0,Z0,F)PDA~P=(Q,\Sigma,\Gamma,\delta,q_0,Z_0,F)PDAP=(Q,Σ,Γ,δ,q0​,Z0​,F) 的语言一般通过终态方式接受来定义，记为L(P)L(P)L(P)，定义为L(P)=\set{w|(q_0,w,Z_0)\vdash^{*}(p,\varepsilon,\gamma),p\in F}，即能够使PDAPDAPDA到达终态的符号串的集合。
> **定义6** ：PDA以空栈方式接受语言
> 另外一种PDA定义的语言是以空栈方式接受的语言，记为N(P)N(P)N(P)，定义为N(P)=\set{w|(q_0,w,Z_0)\vdash^{*}(p,\varepsilon,\varepsilon)}即能够使得PDA的栈变空的符号串集合。
> **定理1** ：
> 如果PDAPFPDA~P_FPDAPF​以终态方式接受语言LLL，那么一定存在PDAPNPDA~P_NPDAPN​以空栈方式接受LLL。
> **定理2** ：
> 如果PDAPNPDA ~P_NPDAPN​以空栈方式接受语言LLL，那么一定存在PDAPFPDA~P_FPDAPF​以终态方式接受LLL
  * 例1：构造以空栈方式接受L=\set{w\in\set{0,1}^{*}|w中字符0和1的数量相同}的PDA
  * 例2：构造以空栈方式接受L=\set{0^{n}1^{m}|0≤n≤m≤2n}的PDA


###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8B%E6%8E%A8%E8%87%AA%E5%8A%A8%E6%9C%BA%E4%B8%8E%E6%96%87%E6%B3%95) 下推自动机与文法
  * 下推自动机与文法是等价的。


> **定理1** ：
> 对于任何CFLLCFL~LCFLL，一定存在PDAPPDA~PPDAP，使L=N(P)L=N(P)L=N(P)
  * 例1：写出语言L=\set{0^{n}1^{m}|1≤m≤n}的文法产生式和对应的PDA


> **定理2** ：
###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E7%A1%AE%E5%AE%9A%E5%9E%8B%E4%B8%8B%E6%8E%A8%E8%87%AA%E5%8A%A8%E6%9C%BAdpda) 确定型下推自动机DPDA
  * 对于普通的`PDA`是通过ε−NFA\varepsilon -NFAε−NFA加上栈来定义的。而确定型下推自动机不再具有非确定性。


> **定义1** ：
> 如果PDAP=(Q,Σ,Γ,δ,q0,Z0,F)PDA~P=(Q,\Sigma,\Gamma,\delta,q_0,Z_0,F)PDAP=(Q,Σ,Γ,δ,q0​,Z0​,F)满足：
>   1. \forall a\in \Sigma \cup \set{\varepsilon},\delta(q,a,X)至多由一个动作
>   2. ∀a∈Σ\forall a \in \Sigma∀a∈Σ，如果δ(q,a,X)≠∅\delta(q,a,X)≠\emptysetδ(q,a,X)=∅，那么δ(q,ε,X)=∅\delta(q,\varepsilon,X)=\emptysetδ(q,ε,X)=∅
> 

> 则称PPP为确定型下推自动机。
> 注意1：再任何情况下都不需要去选择可能的移动就是DPDADPDADPDA。
> 注意2：DPDADPDADPDA与PDAPDAPDA识别语言的能力不一样，是不等价的。例如：任何DPDADPDADPDA都无法接受LwwRL_{ww^{R}}LwwR​，但是可以接受L_{wcw^{R}}=\set{wcw^{R}|w\in (0+1)^{*}}
> [![image-20260815141301834](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260815141301834.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260815141301834.png)
> **定义2** ：
> DPDA以终态方式接受的语言称为确定的上下文无关语言。
> 补充1：其应用之一是非固有歧义的真子集
> 补充2：`Knuth`提出`LR(k)`文法的语言也恰好是DPDA接受语言的一个子集，解析时间复杂度为O(n)O(n)O(n)，LR(k)LR(k)LR(k)文法也是著名语法分析器YACC的基础。
> **定理1** ：
> 如果LLL是正则语言，那么存在DPDAPDPDA~PDPDAP以终态方式接受LLL，即L=L(P)L=L(P)L=L(P)
> 注意：DPDA比正则语言表达的语言能力更强。
> 补充：下面是关于正则语言、DPDA、PDA所表达语言能力大小的关系
> [![image-20260815142559438](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260815142559438.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260815142559438.png)
> **定义3** ：前缀性质
> 如果语言LLL中不存在字符串xxx和yyy，使xxx是yyy的前缀，称语言LLL满足前缀性质。
> **定理2** ：
> DPDAPDPDA~PDPDAP且L=N(P)L=N(P)L=N(P)，当且仅当LLL有前缀性质，且存在DPDAP′DPDA~P'DPDAP′使得L=L(P′)L=L(P')L=L(P′)
> 注解1：DPDAPDPDA~PDPDAP的N(P)N(P)N(P)更有限，即使正则语言0∗0^{*}0∗也无法接受。但以空栈方式接受的语言，却可以被另一个DPDA以终态方式接受。
> 注解2：L=N(P)L=N(P)L=N(P)以空栈方式接受LLL
###  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#dpda%E4%B8%8E%E6%AD%A7%E4%B9%89%E6%96%87%E6%B3%95) DPDA与歧义文法
> **定理1** ：
> DPDAPDPDA~PDPDAP，语言L=L(P)L=L(P)L=L(P)，那么LLL有无歧义的CFGCFGCFG
> **定理2** ：
> DPDAPDPDA~PDPDAP，语言L=N(P)L=N(P)L=N(P)，那么LLL有无歧义的CFGCFGCFG
> 注解：并非所有非固有歧义的CFLCFLCFL都会被DPDA识别，比如：LwwRL_{ww^{R}}LwwR​有无歧义文法S→0S0∣1S1∣εS\to 0S0|1S1|\varepsilonS→0S0∣1S1∣ε，但不能被DPDA所识别。
##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8A%E4%B8%8B%E6%96%87%E6%97%A0%E5%85%B3%E8%AF%AD%E8%A8%80%E7%9A%84%E6%80%A7%E8%B4%A8) 上下文无关语言的性质
> **定理1** ：上下文无关语言的泵引理
> 如果语言LLL是CFLCFLCFL，那么存在正整数NNN，对∀z∈L\forall z \in L∀z∈L，只要∣z∣≥N|z|≥N∣z∣≥N，就可以将zzz分为五部分z=uvwxyz=uvwxyz=uvwxy，满足：
>   1. vx≠εvx≠\varepsilonvx=ε（或∣vx∣>0|vx|>0∣vx∣>0）
>   2. ∣vwx∣≤N|vwx|≤N∣vwx∣≤N
>   3. ∀i≥0,uviwxiy∈L\forall i≥0,uv^{i}wx^{i}y\in L∀i≥0,uviwxiy∈L
> 

  * 例1：证明L=\set{0^n1^n2^n|n≥1}不是上下文无关语言。
  * 例2：证明L=\set{ww|w\in \set{0,1}^{*}}不是上下文无关语言。


> **定理2** ：上下文无关的封闭性
#  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E5%9B%BE%E7%81%B5%E6%9C%BA) 图灵机
  * 图灵在`1936`年介绍了这样一个通用的计算模型，该模型具有以下两个性质： 
    * 该模型的每个过程都是有穷可描述的。
    * 过程必须是由离散的、可机械执行的步骤组成。
  * 图灵机是计算机的一种简单数字模型，但它具有模拟通用计算机的计算能力。 
    * 可用来研究**递归可枚举集** 和**部分递归函数** 。
    * 对算法和可计算性进行研究提供形式化描述工具。


##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E5%9B%BE%E7%81%B5%E6%9C%BA%E7%9A%84%E5%AE%9A%E4%B9%89) 图灵机的定义
> **定义1** ：非形式化图灵机
>   1. 图灵机有一个**有穷控制器** ，一条两端无穷的输入输出和一个带头。
>   2. 输入输出带被划分为单元格，每个单元格可以放置一个符号。
>   3. 带头每次根据当前状态和带头处单元格的符号内容，根据转移规则选择下一个动作。
> 

> 注意：每个动作都包括①**下一个状态** ，②**修改带头处单元格的符号** ③**带头向左或向右移动一个单元格** 。
> [![image-20260922174449706](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260922174449706.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260922174449706.png)
> **定义2** ：图灵机形式化定义
> 图灵机MMM为七元组M=(Q,Σ,Γ,δ,q0,B,F)M=(Q,\Sigma,\Gamma,\delta,q_0,B,F)M=(Q,Σ,Γ,δ,q0​,B,F)
>   1. QQQ：有穷状态集
>   2. Σ\SigmaΣ：有穷输入符号集
>   3. Γ\GammaΓ：有穷带符号集，总有Σ⊆Γ\Sigma \subseteq \GammaΣ⊆Γ
>   4. \delta: Q×\Gamma \to Q×\Gamma×\set{L,R}：转移函数
>   5. q0∈Qq_0\in Qq0​∈Q：初始状态
>   6. B∈Γ−ΣB\in \Gamma -\SigmaB∈Γ−Σ：空格/空白符号
>   7. F⊆QF\subseteq QF⊆Q：接受状态集
> 

##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E5%9B%BE%E7%81%B5%E6%9C%BA%E7%9A%84%E5%8A%A8%E4%BD%9C%E5%8F%8A%E7%8A%B6%E6%80%81%E8%BD%AC%E7%A7%BB%E5%9B%BE) 图灵机的动作及状态转移图
  * 有穷控制器状态为qqq且带头读入符号XXX时，若有δ(q,X)=(p,Y,L/R)\delta(q,X)=(p,Y,L/R)δ(q,X)=(p,Y,L/R)
  * 则状态移到ppp，带头写符号YYY并左或右移一格。如下图： 
    * X/Y←X/Y\getsX/Y←表示，将带头的XXX修改成YYY，并向左移动一格，也可以写成X/Y,LX/Y,LX/Y,L
    * X/Y→X/Y \toX/Y→表示，将带头的XXX修改成YYY，并向右移动一格，也可以写成X/Y,RX/Y,RX/Y,R
    * 注意：状态转移图的那个长箭头是根据状态转移函数来决定的和左右移动带头没有关系。


[![image-20260922175742067](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260922175742067.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260922175742067.png)
  * 图灵机的状态转移表如下：


[![image-20260922183633192](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260922183633192.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260922183633192.png)
  * 因为每个动作都是确定的，因此是确定的图灵机。


> **定义3** ：图灵机的瞬时描述
> 图灵机虽有无穷长的带，单经过有限步，带上非空内容总是有限的。因此用**全部非空符号** 、**当前状态** 及**带头位置** ，定义**瞬时描述(ID)** ：X1X2⋅⋅⋅Xi−1qXiXi+1⋅⋅⋅XnX_1X_2···X_{i-1}qX_{i}X_{i+1}···X_{n}X1​X2​⋅⋅⋅Xi−1​qXi​Xi+1​⋅⋅⋅Xn​，具体意思如下：
>   1. qqq是图灵机的当前状态
>   2. 带头在左起第iii个非空空格符XiX_iXi​上
>   3. X1X2⋅⋅⋅XnX_1X_2···X_nX1​X2​⋅⋅⋅Xn​是从最左到最右非空格内容（i=1i=1i=1表示带头左端，i=ni=ni=n表示带头右端有空格符号）。
>   4. IDIDID转移符号⊢M\vdash_M⊢M​。若某IDIDID是从另一个经过有限步转移而得到的，记为⊢M∗\vdash^{*}_{M}⊢M∗​。若MMM已知，记为⊢\vdash⊢和⊢∗\vdash^{*}⊢∗
> 

  * 例如左移动：
    * 如果δ(q,Xi)=(p,Y,L)\delta(q,X_i)=(p,Y,L)δ(q,Xi​)=(p,Y,L)，定义IDIDID转移为：X1⋅⋅⋅Xi−1qXi⋅⋅⋅Xn⊢MX1⋅⋅⋅Xi−2pXi−1YXi+1⋅⋅⋅XnX_1···X_{i-1}qX_i···X_{n}\vdash_{M}X_1···X_{i-2}pX_{i-1}YX_{i+1}···X_{n}X1​⋅⋅⋅Xi−1​qXi​⋅⋅⋅Xn​⊢M​X1​⋅⋅⋅Xi−2​pXi−1​YXi+1​⋅⋅⋅Xn​
    * 表示MMM做一次向左移动，消除XiX_iXi​打印YYY，并且左移，状态变为ppp
  * 特殊情况：
    * i=1,qX1⋅⋅⋅Xn⊢MpBYX2⋅⋅⋅Xni=1,qX_1···X_n \vdash_{M} pBYX_2···X_ni=1,qX1​⋅⋅⋅Xn​⊢M​pBYX2​⋅⋅⋅Xn​，补充一个BBB表示带头位置指向空。
    * 且i=n,且Y=Bi=n,且Y=Bi=n,且Y=B，X1⋅⋅⋅Xn−1qXn⊢MX1⋅⋅⋅Xn−2pXn−1X_1···X_{n-1}qX_{n}\vdash_{M}X_1···X_{n-2}pX_{n-1}X1​⋅⋅⋅Xn−1​qXn​⊢M​X1​⋅⋅⋅Xn−2​pXn−1​，注意原先的最右符号XnX_nXn​被替换为了空格符BBB，成为右边无穷空格符的一部分，因此从IDIDID中去除。
  * 例1：设计识别\set{0^{n}1^{n}|n≥1}的图灵机。
  * 例2：设计识别\set{0^{n}1^{n}2^{n}|n≥1}的图灵机。


##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E5%9B%BE%E7%81%B5%E6%9C%BA%E7%9A%84%E8%AF%AD%E8%A8%80%E8%A1%A8%E7%A4%BA%E8%83%BD%E5%8A%9B) 图灵机的语言表示能力
> **定义1** ：图灵机的接受语言
> 如果M=(Q,Σ,Γ,δ,q0,B,F)M=(Q,\Sigma,\Gamma,\delta,q_0,B,F)M=(Q,Σ,Γ,δ,q0​,B,F)是一个图灵机，则MMM接受的语言为L(M)=\set{w|w\in \Sigma^{*},q_0w\vdash^{*}\alpha p\beta,p\in F,\alpha,\beta \in \Gamma^{*}}
> 注意1：输入串放在输入带上，MMM处于q0q_0q0​，带头位于输入串的第一个字符上，输入串最终会导致MMM进入某个终止(接受)状态。
> 注意2：一般假定当输入串被接受时MMM**总会停机** ，即没有下一个动作的定义。
> 注意3：对于不接受的输入，图灵机可能永远不会停止。
> **定义2** ：递归可枚举语言
> 如果LLL是图灵机MMM的语言，则称LLL是**可递归可枚举语言** 。
> 解释1：`可枚举`的意思就是这些语言中的串可以被某个图灵机枚举出来。
> 解释2：`递归语言`的意思就是，**对于接受** 和**不接受的输入** ，都**保证停机** ，所接受的语言称为递归语言。
> 补充1：**保证停机的图灵机，正是算法的好模型，这也是算法概念的首次形式化，并由此建立了计算机科学的基础** 。
  * 例1：设计整数真减法的图灵机m-n=\cases{m-n,&m≥n\0,&m＜n}


##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%89%A9%E5%B1%95%E5%9B%BE%E7%81%B5%E6%9C%BA) 扩展图灵机
> **定义1** ：带状态中存储的图灵机
>   * 状态中存储：有穷控制器中可以存储有限个符号的图灵机M′=(Q′,Σ,Γ,q0′,B,F′)M'=(Q',\Sigma,\Gamma,q_0',B,F')M′=(Q′,Σ,Γ,q0′​,B,F′)其中，Q′=Q×Γ×Γ...×ΓQ'=Q×\Gamma×\Gamma...×\GammaQ′=Q×Γ×Γ...×Γ，q0′=[q0,B,...,B]q'_0=[q_0,B,...,B]q0′​=[q0​,B,...,B]
>   * 有穷控制器：存储一个有限长的缓冲，存储输入带上的一些符号。
> 

> [![image-20260922224938524](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260922224938524.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260922224938524.png)
> **定义2** ：多道图灵机
> 多道图灵机M′=(Q,Σ,Γ′,δ,q0,B′,F)M'=(Q,\Sigma,\Gamma',\delta,q_0,B',F)M′=(Q,Σ,Γ′,δ,q0​,B′,F)，其中Γ′=Γ×Γ×...×Γ\Gamma'=\Gamma×\Gamma×...×\GammaΓ′=Γ×Γ×...×Γ，将kkk条纸带并成一个大纸带。
> [![image-20260922225331062](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260922225331062.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260922225331062.png)
  * 例题：利用状态中存储与多道设计图灵机识别语言L=\set{wcw|w\in \set{a,b}^{*}}


> **定义3** ：多带图灵机
> 多带图灵机的有穷控制器，有kkk个带头和kkk条带组成。
> 多带图灵机的动作如下，每个动作根据状态和每个带头符号：
>   1. 改变控制器中的状态
>   2. 修改每个带头单元格中的符号
>   3. 每个带头独立的向左或向右移动一个格，或保持不动。
> 

> [![image-20260922225930291](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260922225930291.png)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/image-20260922225930291.png)
> 注意1：多带图灵机和多道图灵机要区别开来，多道图灵机相当于只有一个比较长的带头，一次只能读取和修改同一个位置的不同条带；多带一次可以读取和修改不同条带的不同位置。
> **定义4** ：非确定图灵机
> 图灵机在每组状态qqq和带符号XXX的转移δ(q,X)\delta(q,X)δ(q,X)，可以有有限个选择：\delta(q,X)=\set{(q_1,Y_1,D_1),(q_2,Y_2,D_2),...,(q_k,Y_k,D_k)}
>   1. 非确定图灵机(NTM)接受语言的方式，与NFA和PDA是类似的，即图灵机增加非确定性并未使这个装置接受新的语言。
>   2. 只要存在从初始ID道某接受状态ID的转移，其他选择可以忽略。
> 

> **定理1** ：
> 多带图灵机接受的语言LLL，可被单带图灵机接受。
> **定理2** ：
> 如果LLL被非确定图灵机NNN接受，那么LLL被某个确定的图灵机MMM接受
##  [](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E5%8F%97%E9%99%90%E5%9B%BE%E7%81%B5%E6%9C%BA) 受限图灵机
> **定义1** ：半无穷带图灵机
> 半无穷带图灵机，图灵机输入输出带只有一侧是无穷的。
> **定义2** ：多栈机器
> 基于下推自动机的扩展，kkk栈机器是具有kkk个栈的确定型下推自动机。
> **定理1** ：
> 半无穷带图灵机，与图灵机等价。
> **定理2** ：
> 如果图灵机接受LLL，那么双栈机接受LLL
文章作者: [iyheart](http://iyheart.github.io)
文章链接: [http://iyheart.github.io/2026/07/26/计算理论/形式语言与自动机/形式语言与自动机/](http://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/)
版权声明: 本博客所有文章除特别声明外，均采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。转载请注明来自 [iyheart的博客](http://iyheart.github.io)！
[](https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fiyheart.github.io%2F2026%2F07%2F26%2F%25E8%25AE%25A1%25E7%25AE%2597%25E7%2590%2586%25E8%25AE%25BA%2F%25E5%25BD%25A2%25E5%25BC%258F%25E8%25AF%25AD%25E8%25A8%2580%25E4%25B8%258E%25E8%2587%25AA%25E5%258A%25A8%25E6%259C%25BA%2F%25E5%25BD%25A2%25E5%25BC%258F%25E8%25AF%25AD%25E8%25A8%2580%25E4%25B8%258E%25E8%2587%25AA%25E5%258A%25A8%25E6%259C%25BA%2F)[](https://twitter.com/intent/tweet?text=%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA%20%7C%20iyheart%E7%9A%84%E5%8D%9A%E5%AE%A2&url=https%3A%2F%2Fiyheart.github.io%2F2026%2F07%2F26%2F%25E8%25AE%25A1%25E7%25AE%2597%25E7%2590%2586%25E8%25AE%25BA%2F%25E5%25BD%25A2%25E5%25BC%258F%25E8%25AF%25AD%25E8%25A8%2580%25E4%25B8%258E%25E8%2587%25AA%25E5%258A%25A8%25E6%259C%25BA%2F%25E5%25BD%25A2%25E5%25BC%258F%25E8%25AF%25AD%25E8%25A8%2580%25E4%25B8%258E%25E8%2587%25AA%25E5%258A%25A8%25E6%259C%25BA%2F&via=https%3A%2F%2Fiyheart.github.io)#### [微信扫一扫：分享 微信里点“发现”，扫一下 二维码便可将本文分享至朋友圈。 ](javascript:)[](https://service.weibo.com/share/share.php?url=https%3A%2F%2Fiyheart.github.io%2F2026%2F07%2F26%2F%25E8%25AE%25A1%25E7%25AE%2597%25E7%2590%2586%25E8%25AE%25BA%2F%25E5%25BD%25A2%25E5%25BC%258F%25E8%25AF%25AD%25E8%25A8%2580%25E4%25B8%258E%25E8%2587%25AA%25E5%258A%25A8%25E6%259C%25BA%2F%25E5%25BD%25A2%25E5%25BC%258F%25E8%25AF%25AD%25E8%25A8%2580%25E4%25B8%258E%25E8%2587%25AA%25E5%258A%25A8%25E6%259C%25BA%2F&title=%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA%20%7C%20iyheart%E7%9A%84%E5%8D%9A%E5%AE%A2&pic=https%3A%2F%2Fraw.githubusercontent.com%2Fiyheart%2Ftuchuang%2Fmain%2Fimg%2Fcover254.png&appkey=)[](http://connect.qq.com/widget/shareqq/index.html?url=https%3A%2F%2Fiyheart.github.io%2F2026%2F07%2F26%2F%25E8%25AE%25A1%25E7%25AE%2597%25E7%2590%2586%25E8%25AE%25BA%2F%25E5%25BD%25A2%25E5%25BC%258F%25E8%25AF%25AD%25E8%25A8%2580%25E4%25B8%258E%25E8%2587%25AA%25E5%258A%25A8%25E6%259C%25BA%2F%25E5%25BD%25A2%25E5%25BC%258F%25E8%25AF%25AD%25E8%25A8%2580%25E4%25B8%258E%25E8%2587%25AA%25E5%258A%25A8%25E6%259C%25BA%2F&title=%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA%20%7C%20iyheart%E7%9A%84%E5%8D%9A%E5%AE%A2&source=%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA%20%7C%20iyheart%E7%9A%84%E5%8D%9A%E5%AE%A2&desc=%E5%89%8D%E8%A8%80%EF%BC%9A%E5%AD%A6%E4%B9%A0%E4%B8%80%E4%B8%8B%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA&pics=https%3A%2F%2Fraw.githubusercontent.com%2Fiyheart%2Ftuchuang%2Fmain%2Fimg%2Fcover254.png&summary="%E5%89%8D%E8%A8%80%EF%BC%9A%E5%AD%A6%E4%B9%A0%E4%B8%80%E4%B8%8B%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA")
赞助
  * [![wechat](https://raw.githubusercontent.com/iyheart/tuchuang/main/img/ea2e5fb6fbb4c236fbabd387ef83339.jpg)](https://raw.githubusercontent.com/iyheart/tuchuang/main/img/ea2e5fb6fbb4c236fbabd387ef83339.jpg)
wechat


[![cover of previous post](https://raw.githubusercontent.com/iyheart/tuchuang/main/img/cover255.png) 上一篇 LLVM编译器 ](https://iyheart.github.io/2026/09/11/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%BA%95%E5%B1%82blog/%E7%BC%96%E8%AF%91%E4%B8%8E%E8%A7%A3%E9%87%8Ablog/LLVM%E7%BC%96%E8%AF%91%E5%99%A8/ "LLVM编译器")
[![cover of next post](https://raw.githubusercontent.com/iyheart/tuchuang/main/img/cover253.png) 下一篇 Linux内核模块开发2 ](https://iyheart.github.io/2026/06/04/Linux/Linux%E5%86%85%E6%A0%B8%E6%A8%A1%E5%9D%97%E5%BC%80%E5%8F%91/Linux%E5%86%85%E6%A0%B8%E6%A8%A1%E5%9D%97%E5%BC%80%E5%8F%912/ "Linux内核模块开发2")
![avatar](https://raw.githubusercontent.com/iyheart/tuchuang/main/img/cover51_1.png)
iyheart
悟已往之不谏，知来者之可追
[文章 214](https://iyheart.github.io/archives/)[标签 17](https://iyheart.github.io/tags/)[分类 64](https://iyheart.github.io/categories/)
[Follow Me](https://github.com/xxxxxx)
公告
This is my Blog
目录
  1. [1. 概述](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%A6%82%E8%BF%B0)
  2. [2. 基础知识](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86)
    1. [2.1. 集合](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E9%9B%86%E5%90%88)
      1. [2.1.1. 集合的基本定义](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E9%9B%86%E5%90%88%E7%9A%84%E5%9F%BA%E6%9C%AC%E5%AE%9A%E4%B9%89)
      2. [2.1.2. 集合的关系](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E9%9B%86%E5%90%88%E7%9A%84%E5%85%B3%E7%B3%BB)
      3. [2.1.3. 集合的运算](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E9%9B%86%E5%90%88%E7%9A%84%E8%BF%90%E7%AE%97)
    2. [2.2. 语言](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E8%AF%AD%E8%A8%80)
    3. [2.3. 证明方法](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E8%AF%81%E6%98%8E%E6%96%B9%E6%B3%95)
  3. [3. 有穷状态自动机FSM](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%9C%89%E7%A9%B7%E7%8A%B6%E6%80%81%E8%87%AA%E5%8A%A8%E6%9C%BAfsm)
    1. [3.1. 确定的有穷自动机](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E7%A1%AE%E5%AE%9A%E7%9A%84%E6%9C%89%E7%A9%B7%E8%87%AA%E5%8A%A8%E6%9C%BA)
    2. [3.2. 自动机直观表示](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E8%87%AA%E5%8A%A8%E6%9C%BA%E7%9B%B4%E8%A7%82%E8%A1%A8%E7%A4%BA)
      1. [3.2.1. 练习1——做图做表](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E7%BB%83%E4%B9%A01%E5%81%9A%E5%9B%BE%E5%81%9A%E8%A1%A8)
      2. [3.2.2. 练习2——扩展转移函数](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E7%BB%83%E4%B9%A02%E6%89%A9%E5%B1%95%E8%BD%AC%E7%A7%BB%E5%87%BD%E6%95%B0)
    3. [3.3. 非确定的有穷自动机](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E9%9D%9E%E7%A1%AE%E5%AE%9A%E7%9A%84%E6%9C%89%E7%A9%B7%E8%87%AA%E5%8A%A8%E6%9C%BA)
      1. [3.3.1. NFA定义](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#nfa%E5%AE%9A%E4%B9%89)
      2. [3.3.2. DFA与NFA](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#dfa%E4%B8%8Enfa)
      3. [3.3.3. ε-NFA定义](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%CE%B5-nfa%E5%AE%9A%E4%B9%89)
      4. [3.3.4. ε-NFA与DFA](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%CE%B5-nfa%E4%B8%8Edfa)
      5. [3.3.5. ε-NFA与DFA练习](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%CE%B5-nfa%E4%B8%8Edfa%E7%BB%83%E4%B9%A0)
    4. [3.4. 正则表达式与正则语言](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E4%B8%8E%E6%AD%A3%E5%88%99%E8%AF%AD%E8%A8%80)
      1. [3.4.1. 语言的运算(回顾)](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E8%AF%AD%E8%A8%80%E7%9A%84%E8%BF%90%E7%AE%97%E5%9B%9E%E9%A1%BE)
      2. [3.4.2. 正则表达式的运算](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E7%9A%84%E8%BF%90%E7%AE%97)
      3. [3.4.3. 正则表达式与有穷自动机](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E4%B8%8E%E6%9C%89%E7%A9%B7%E8%87%AA%E5%8A%A8%E6%9C%BA)
      4. [3.4.4. 正则表达式的代数定律](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E7%9A%84%E4%BB%A3%E6%95%B0%E5%AE%9A%E5%BE%8B)
      5. [3.4.5. 正则语言的性质](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%AD%A3%E5%88%99%E8%AF%AD%E8%A8%80%E7%9A%84%E6%80%A7%E8%B4%A8)
    5. [3.5. 自动机的最小化](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E8%87%AA%E5%8A%A8%E6%9C%BA%E7%9A%84%E6%9C%80%E5%B0%8F%E5%8C%96)
  4. [4. 下推自动机PDA](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8B%E6%8E%A8%E8%87%AA%E5%8A%A8%E6%9C%BApda)
    1. [4.1. 上下文无关文法与语言](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8A%E4%B8%8B%E6%96%87%E6%97%A0%E5%85%B3%E6%96%87%E6%B3%95%E4%B8%8E%E8%AF%AD%E8%A8%80)
      1. [4.1.1. 回文与回文语言](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E5%9B%9E%E6%96%87%E4%B8%8E%E5%9B%9E%E6%96%87%E8%AF%AD%E8%A8%80)
      2. [4.1.2. 上下文无关文法](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8A%E4%B8%8B%E6%96%87%E6%97%A0%E5%85%B3%E6%96%87%E6%B3%95)
      3. [4.1.3. 上下文无关语言](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8A%E4%B8%8B%E6%96%87%E6%97%A0%E5%85%B3%E8%AF%AD%E8%A8%80)
      4. [4.1.4. 语法分析树](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E8%AF%AD%E6%B3%95%E5%88%86%E6%9E%90%E6%A0%91)
      5. [4.1.5. 文法和语言的歧义性](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%96%87%E6%B3%95%E5%92%8C%E8%AF%AD%E8%A8%80%E7%9A%84%E6%AD%A7%E4%B9%89%E6%80%A7)
    2. [4.2. 文法的化简](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%96%87%E6%B3%95%E7%9A%84%E5%8C%96%E7%AE%80)
      1. [4.2.1. 消除无用符号](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%B6%88%E9%99%A4%E6%97%A0%E7%94%A8%E7%AC%A6%E5%8F%B7)
      2. [4.2.2. 消除ε-产生式](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%B6%88%E9%99%A4%CE%B5-%E4%BA%A7%E7%94%9F%E5%BC%8F)
      3. [4.2.3. 消除单元产生式](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%B6%88%E9%99%A4%E5%8D%95%E5%85%83%E4%BA%A7%E7%94%9F%E5%BC%8F)
    3. [4.3. 文法的范式](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%96%87%E6%B3%95%E7%9A%84%E8%8C%83%E5%BC%8F)
      1. [4.3.1. 乔姆斯基范式CNF](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B9%94%E5%A7%86%E6%96%AF%E5%9F%BA%E8%8C%83%E5%BC%8Fcnf)
      2. [4.3.2. 格雷巴赫范式](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%A0%BC%E9%9B%B7%E5%B7%B4%E8%B5%AB%E8%8C%83%E5%BC%8F)
    4. [4.4. 下推自动机](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8B%E6%8E%A8%E8%87%AA%E5%8A%A8%E6%9C%BA)
      1. [4.4.1. 下推自动机定义](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8B%E6%8E%A8%E8%87%AA%E5%8A%A8%E6%9C%BA%E5%AE%9A%E4%B9%89)
      2. [4.4.2. 下推自动机与文法](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8B%E6%8E%A8%E8%87%AA%E5%8A%A8%E6%9C%BA%E4%B8%8E%E6%96%87%E6%B3%95)
      3. [4.4.3. 确定型下推自动机DPDA](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E7%A1%AE%E5%AE%9A%E5%9E%8B%E4%B8%8B%E6%8E%A8%E8%87%AA%E5%8A%A8%E6%9C%BAdpda)
      4. [4.4.4. DPDA与歧义文法](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#dpda%E4%B8%8E%E6%AD%A7%E4%B9%89%E6%96%87%E6%B3%95)
    5. [4.5. 上下文无关语言的性质](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E4%B8%8A%E4%B8%8B%E6%96%87%E6%97%A0%E5%85%B3%E8%AF%AD%E8%A8%80%E7%9A%84%E6%80%A7%E8%B4%A8)
  5. [5. 图灵机](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E5%9B%BE%E7%81%B5%E6%9C%BA)
    1. [5.1. 图灵机的定义](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E5%9B%BE%E7%81%B5%E6%9C%BA%E7%9A%84%E5%AE%9A%E4%B9%89)
    2. [5.2. 图灵机的动作及状态转移图](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E5%9B%BE%E7%81%B5%E6%9C%BA%E7%9A%84%E5%8A%A8%E4%BD%9C%E5%8F%8A%E7%8A%B6%E6%80%81%E8%BD%AC%E7%A7%BB%E5%9B%BE)
    3. [5.3. 图灵机的语言表示能力](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E5%9B%BE%E7%81%B5%E6%9C%BA%E7%9A%84%E8%AF%AD%E8%A8%80%E8%A1%A8%E7%A4%BA%E8%83%BD%E5%8A%9B)
    4. [5.4. 扩展图灵机](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E6%89%A9%E5%B1%95%E5%9B%BE%E7%81%B5%E6%9C%BA)
    5. [5.5. 受限图灵机](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/#%E5%8F%97%E9%99%90%E5%9B%BE%E7%81%B5%E6%9C%BA)


最新文章
[LLVM编译器](https://iyheart.github.io/2026/09/11/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%BA%95%E5%B1%82blog/%E7%BC%96%E8%AF%91%E4%B8%8E%E8%A7%A3%E9%87%8Ablog/LLVM%E7%BC%96%E8%AF%91%E5%99%A8/ "LLVM编译器")2026-09-11
[形式语言与自动机](https://iyheart.github.io/2026/07/26/%E8%AE%A1%E7%AE%97%E7%90%86%E8%AE%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/%E5%BD%A2%E5%BC%8F%E8%AF%AD%E8%A8%80%E4%B8%8E%E8%87%AA%E5%8A%A8%E6%9C%BA/ "形式语言与自动机")2026-07-26
[Linux内核模块开发2](https://iyheart.github.io/2026/06/04/Linux/Linux%E5%86%85%E6%A0%B8%E6%A8%A1%E5%9D%97%E5%BC%80%E5%8F%91/Linux%E5%86%85%E6%A0%B8%E6%A8%A1%E5%9D%97%E5%BC%80%E5%8F%912/ "Linux内核模块开发2")2026-06-04
[Linux内核模块开发之hello-world](https://iyheart.github.io/2026/05/22/Linux/Linux%E5%86%85%E6%A0%B8%E6%A8%A1%E5%9D%97%E5%BC%80%E5%8F%91/Linux%E5%86%85%E6%A0%B8%E9%A9%B1%E5%8A%A8%E5%BC%80%E5%8F%91%E4%B9%8Bhello-world/ "Linux内核模块开发之hello-world")2026-05-22
[恶意代码之勒索型恶意代码](https://iyheart.github.io/2026/05/04/CTFblog/REVERSE%E7%B3%BB%E5%88%97blog/%E6%81%B6%E6%84%8F%E4%BB%A3%E7%A0%81/%E6%81%B6%E6%84%8F%E4%BB%A3%E7%A0%81%E4%B9%8B%E5%8B%92%E7%B4%A2%E5%9E%8B%E6%81%B6%E6%84%8F%E4%BB%A3%E7%A0%81/ "恶意代码之勒索型恶意代码")2026-05-04
©2020 - 2026 By iyheart
框架 [Hexo](https://hexo.io)|主题 [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly)
搜索
数据库加载中
* * *
