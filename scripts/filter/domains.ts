// 非博客域名列表（明文存储，非敏感）
export const NON_BLOG_DOMAINS: string[] = [
  "github.com",
  "gitee.com",
  "gitlab.com",
  "bitbucket.org",
  "coding.net",
  "gitcode.net",
  "codeberg.org",
  "gitea.io",
  "gitea.com",
  "sourceforge.net",
  "gitlab.cn",
  "oschina.net",
  "travellings.cn",
  "www.travellings.cn",
  "rss.travellings.cn",
  "rss-source.travellings.cn",
  "beian.miit.gov.cn",
  "beian.mps.gov.cn",
  "www.beian.gov.cn",
  "icp.gov.moe",
  "icp.gs",
  "travel.moe",
  "moicp.cn",
  "icp.cab",
  "icp.n3v.cn",
  "vercel.com",
  "netlify.app",
  "netlify.com",
  "cloudflare.com",
  "hexo.io",
  "butterfly.js.org",
  "zhihu.com",
  "www.zhihu.com",
  "bilibili.com",
  "space.bilibili.com",
  "www.bilibili.com",
  "twitter.com",
  "x.com",
  "music.163.com",
  "boyouquan.com",
  "www.boyouquan.com",
  "browsehappy.com",
  "graph.org",
  "blogsclub.org",
  "www.blogsclub.org",
  "blogplanet.cn",
  "www.blogplanet.cn",
  "blogscn.fun",
  "blog114.com",
  "boke.lu",
  "bokequan.cn",
  "blogtalk.org",
  "storeweb.cn",
  "haozhan.wang",
  "zhblogs.net",
  "www.zhblogs.net",
  "foreverblog.cn",
  "www.foreverblog.cn",
  "rmbk.cc",
  "www.rmbk.cc",
  "jiuchan.org",
  "hi.jiuchan.org",
  "bloginc.cn",
  "findblog.net",
  "www.findblog.net",
  "morerss.com",
  "dogerolls.com",
  "boringbay.com",
  "cnblogs.com",
  "www.cnblogs.com",
  "csdn.net",
  "blog.csdn.net",
  "jianshu.com",
  "www.jianshu.com",
  "baidu.com",
  "www.baidu.com",
  "bing.com",
  "www.bing.com",
  "google.com",
  "www.google.com",
  "12377.cn",
  "www.12377.cn",
  "12306.cn",
  "www.12306.cn",
  "12315.cn",
  "www.12315.cn",
  "halo.run",
  "51.la",
  "v6.51.la",
  "douyin.com",
  "www.douyin.com",
  "v.douyin.com",
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "aliyun.com",
  "www.aliyun.com",
  "cloud.tencent.com",
  "huaweicloud.com",
  "www.huaweicloud.com",
  "aws.amazon.com",
  "azure.microsoft.com",
  "cloud.google.com",
  "vultr.com",
  "www.vultr.com",
  "digitalocean.com",
  "www.digitalocean.com",
  "linode.com",
  "www.linode.com",
  "rainyun.com",
  "www.rainyun.com",
  "jdcloud.com",
  "www.jdcloud.com",
  "cloud.baidu.com",
  "ucloud.cn",
  "www.ucloud.cn",
  "qingcloud.com",
  "www.qingcloud.com",
  "upyun.com",
  "www.upyun.com",
  "qiniu.com",
  "www.qiniu.com",
  "appinn.com",
  "www.appinn.com",
  "xhuama.cn",
  "www.xhuama.cn",
  "wk21.com",
  "www.wk21.com",
  "ekucat.com",
  "icp.ekucat.com",
  "91yl.top",
  "fylm.91yl.top",
  "678.tax",
  "www.678.tax",
  "cnb.cool",
  "www.cnb.cool",
  "bokehub.com",
  "www.bokehub.com",
  "links.needhelp.icu",
  "iyuan.ltd",
  "mcdocs.iyuan.ltd",
  "niege.app",
  "bbs.niege.app",
  "nicepub.top",
  "www.nicepub.top",
  "bbs.nicepub.top",
  "nies.live",
  "www.nies.live",
  "moa.moe",
  "www.moa.moe",
  "linuxcat.top",
  "www.linuxcat.top",
  "blog.sunguoqi.com",
  "halo.oneln.org",
  "blog.meowo.moe",
  "xiaorin.com",
  "www.xiaorin.com",
  "nekopara.us",
  "www.nekopara.us",
  "sweetsmoe.com",
  "www.sweetsmoe.com",
  "blog.45m.fun",
  "hipvogue.com",
  "www.hipvogue.com",
  "cicaf.com",
  "www.cicaf.com",
  "log.ink",
  "mark.vergilisme.com",
  "steampowered.com",
  "store.steampowered.com",
  "steamcommunity.com",
  "www.steamcommunity.com",
  "epicgames.com",
  "www.epicgames.com",
  "ibb22.com",
  "www.ibb22.com",
  "pgg33.com",
  "www.pgg33.com",
  "taobao.com",
  "www.taobao.com",
  "tmall.com",
  "www.tmall.com",
  "jd.com",
  "www.jd.com",
  "pinduoduo.com",
  "www.pinduoduo.com",
  "linkwhisper.com",
  "www.linkwhisper.com",
  "mzswpco.com",
  "www.mzswpco.com",
  "4414.cn",
  "www.4414.cn",
  "ug95.com",
  "www.ug95.com",
  "runoob.com",
  "www.runoob.com",
  "marxists.org",
  "www.marxists.org",
  "vuejs.org",
  "v2.cn.vuejs.org",
  "cn.vuejs.org",
  "lxhaoka.cn",
  "www.lxhaoka.cn",
  "mirrors.163.com",
  "mirrors.ustc.edu.cn",
  "tiobe.com",
  "www.tiobe.com",
  "juejin.cn",
  "www.juejin.cn",
  "51cto.com",
  "blog.51cto.com",
  "www.51cto.com",
  "infoq.com",
  "www.infoq.com",
  "huggingface.co",
  "www.huggingface.co",
  "cnki.net",
  "www.cnki.net",
  "wanfangdata.com",
  "www.wanfangdata.com",
  "cqvip.com",
  "www.cqvip.com",
  "arxiv.org",
  "www.arxiv.org",
  "researchgate.net",
  "www.researchgate.net",
  "academia.edu",
  "www.academia.edu",
  "creativecommons.org",
  "www.creativecommons.org",
  "apple.com",
  "www.apple.com",
  "apps.apple.com",
  "gravatar.com",
  "www.gravatar.com",
  "gravatar.loli.net",
  "cravatar.cn",
  "www.cravatar.cn",
  "qlogo.cn",
  "q2.qlogo.cn",
  "facebook.com",
  "www.facebook.com",
  "reddit.com",
  "linkedin.com",
  "www.linkedin.com",
  "pinterest.com",
  "telegram.me",
  "t.me",
  "whatsapp.com",
  "api.whatsapp.com",
  "tumblr.com",
  "www.tumblr.com",
  "blogger.com",
  "www.blogger.com",
  "douban.com",
  "www.douban.com",
  "weibo.com",
  "service.weibo.com",
  "qq.com",
  "connect.qq.com",
  "qzone.qq.com",
  "gerenjianli.com",
  "www.gerenjianli.com",
  "lwzzlf.cn",
  "www.lwzzlf.cn",
	  "163mu.com",
	  "www.163mu.com",
		  "onetrans.app",         // 商业翻译应用（OneTrans）
		  "vision-flow.art",      // 商业 AI 工具（VisionFlow）
			  "myhkw.com",            // 影视站点
			  "airportal.cn",         // 文件传输工具
			  "www.airportal.cn",
			  "pairdrop.net",         // 局域网文件传输
			  "snapdrop.net",         // 局域网文件传输
			  "easychuan.cn",         // 轻松传
			  "tmp.link",             // 钛盘文件中转站
			  "app.tmp.link",
			  "wenshushu.cn",         // 文叔叔
			  "www.wenshushu.cn",
			  "cowtransfer.com",      // 奶牛快传
			  "ttttt.link",           // 钛盘(备用域名)
			  "www.ttttt.link",
			  "lifeweek.com.cn",      // 三联生活周刊(杂志官网)
			  "dili360.com",          // 中国国家地理(杂志官网)
			  "www.dili360.com",
			  "boduoad.com",          // 广告/垃圾站
			  "cssworld.cn",          // CSS世界(书籍官网)
			  "artemkutsan.pp.ua",    // 个人子域名站，友链标题为新闻文章名
			  "770b.cn",              // 邀请码推广(learn.770b.cn)
			  "obey.fun",             // 在线分享网
			  // 政府/官媒/机构网站
			  "chinaflagnet.com",     // 中旗网
			  "crt.com.cn",           // 中红网
			  "1921.org.cn",          // 中华魂
			  "idcpc.org.cn",         // 中联部
			  "cyol.com",             // 中青在线
			  "workercn.cn",          // 中工网
			  "mj.org.cn",            // 中国民主促进会
			  "youth.cn",             // 中青网
			  "chinanews.com",        // 中新网
			  "ce.cn",                // 中经网
			  "cs.com.cn",            // 中证报
			  "china.com.cn",         // 中国网
			  "chinadaily.com.cn",    // 中国日报网
			  "chinamil.com.cn",      // 中国军网
			  "cssn.cn",              // 中国社会科学网
			  "confucianism.com.cn",  // 中国国学网
			  "honggewang.com",       // 中国红旅红歌网
			  "jjzy.cn",              // 中国将军政要网
			  "kcna.kp",              // 朝鲜中央通讯
			  "scimedia.cn",          // 中国传媒科技
			  "stdaily.com",          // 中国科技网
			  "chinaelections.org",   // 中国选举与治理
			  "china-world1981.com",  // 中外关系史学会
			  "wildaidchina.org.cn",  // 中国野生动物救援
			  // 商业/工具/教育平台
			  "cnnic.cn",             // CNNIC
			  "webwhois.cnnic.cn",    // 国家域名whois
			  "zgsydw.com",           // 中公事业编
			  "zlketang.com",         // 中级会计考试
			  "zhonghuadiancang.com", // 中华典藏
			  "zhongguose.com",       // 中国色
			  "zglxw.com",            // 中国国旅
			  "tungpohy.com",         // 中港物流
			  "zhonghuanus.com",      // 中环转运
			  "zoroip.cn",            // 中荣智汇知识产权
			  "myrushbox.com",        // 中欧班列
			  "zdtk.cn",              // 中国邮票目录
			  "tumukeji.com",         // 中国土木科技
			  "gmail777.com",         // 中州西鹿(可疑域名)
			  "dx7c.com",             // 中医体质辨识仪
			  "historyline.online",   // 中国历朝代视频讲解
			  "uni.utities.online",   // 中国重点高校地理位置可视化
			  "zhongyudata.com",      // 中域科技
			  "jueshunjx.com",        // 中继间
			  "hpcbristol.net",       // 中国历史照片
			  "tech.china.com",       // 中华网科技
			  "szkingroad.com",       // 中港物流
			  "diancang.xyz",         // 中华典藏
			  "zhonghaizhi.com",      // 中嗨智
			  "huahengtaoci.com",     // 九游会菠菜
			  // "直接访问"(按钮文本被当站名) — 均为工具/服务站点
			  "5118.com", "5ce.com", "aidea.im", "heygen.com", "getgetai.com",
			  "xiezuocat.com", "xiaofamao.com", "heyfriday.cn", "chuangkit.com",
			  "zhimap.com", "hizdm.cn", "aipix.net", "weshineapp.com", "weiciyun.com",
			  "sssssssss.com", "12321.cn", "loghao.com", "chanmama.com", "allhistory.com",
			  "shangdianba.com", "jikipedia.com", "juzikong.com", "yayun.la",
			  "bodongshi.com", "wenangou.com", "mediatrack.cn", "bigjpg.com",
			  "yuntianyi.com", "caiyunai.com", "mypitaya.com", "1ts.fun",
			  "chronodivide.com", "itellyou.cn", "xiniubaba.com", "vvcha.cn",
			  "51240.com", "ys168.com", "epubee.com",
			  // 智能/科技商业站点
			  "znds.com", "zhidx.com", "zhiguoxin.cn", "zhengzhaopai.com",
			  "dmtt.run", "sczhgx.com", "gameba.cc", "aint.top",
			  // 组件库/框架官网(CSS被当链接名)
			  "shoelace.style", "hilla.dev", "core.clarity.design",
			  "openjsf.org", "lion.js.org", "auro.alaskaair.com",
			];
