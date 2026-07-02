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
  "cifnews.com",
  "512kb.club",
  "useplaintext.email",
  "shenzhouwenxue.com",
  "digitalchina.com",
  "dcholdings.com",
  "dcits.com",
  "shenzhoukuntai.com",
  "qn63.com",
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
  // 互联网大厂
  "alibaba.com", "alibabagroup.com", "tencent.com", "bytedance.com",
  "netease.com", "meituan.com", "xiaomi.com", "oppo.com", "vivo.com",
  "huawei.com", "lenovo.com", "microsoft.com", "amazon.com", "meta.com",
  // 知名媒体/电视台
  "cctv.com", "cctv.cn", "cntv.cn", "people.com.cn", "xinhuanet.com",
  "ifeng.com", "huanqiu.com", "chinanews.com", "gmw.cn",
  "huxiu.com", "36kr.com", "thepaper.cn", "jiemian.com",
  // 知名品牌
  "taobao.com", "tmall.com", "jd.com", "pinduoduo.com",
  "xiaohongshu.com", "kuaishou.com", "suning.com", "dangdang.com",
  "ctrip.com", "qunar.com", "didiglobal.com",
  "nike.com", "adidas.com", "starbucks.com", "mcdonalds.com",
  // 组件库/框架官网
  "react.dev", "reactjs.org", "angular.io", "angularjs.org",
  "nodejs.org", "npmjs.com", "typescriptlang.org", "deno.land",
  "gohugo.io", "markdown.com.cn", "blowfish.page", "0w.hk", "xt50.com", "typecho.org",
  // SSG/博客框架官网
  "astro.build", "getzola.org", "jekyllrb.com", "gatsbyjs.com",
  // 论坛/BBS平台
  "discuz.vip", "dismall.com",
  // 在线工具/非博客
  "favicon-generator.org", "realfavicongenerator.net", "oneinstack.com", "wufazhuce.com", "reeoo.com",
  // 域名出售/导航站
  "1cy.top", "moezzz.com",
  // 论坛/商业/非博客
  "zozse.cn", "sh-artmuseum.org.cn", "shangce8.com",
  // 赌博/菠菜站群
  "1m90.com", "pastacookies.com", "tongyacraft.com", "marketpads.com", "shandngluquam.com", "webb-plumbing.com",
  // SEO垃圾外链/商业站
  "snvo.net", "learntospeakkorean.info", "chrismasebook.info", "wxfsj.com", "humeitu.com",
  // 主题商店/外包公司
  "xintheme.com", "nicetheme.cn", "whkakaxi.com",
  // 商业公司站群
  "xjdshx.com", "liaoliaojizhang.cn", "oem818.com", "as0000.cn", "ktvjgof.cn",
  "scyssy.com.cn", "qiushicaijing.com", "74i74.cn", "mcsmalltian.com",
  "linkmoreparking.cn", "zsdkw.net", "bussmann.cc", "520papapa.cn",
  // 汇率SEO站群
  "xjqyc.cn", "ksnfes.com.cn", "wyq888.top", "tuyios.cn", "xiansimao.top",
  "youzi201314.top", "tyhsrjt.cn", "afyrty.cn", "breakeve.cn", "jinfet.top",
  // "访问网站" SEO批量友链 + 博客平台
  "xjybk.cn", "bybkw.cn", "panzy.top", "xfabe.com", "21r.cn",
  "chaojizy.com", "ffw8.cn", "yuhiri.me", "yuankainet.cn", "emlog.net",
  // "前去学习"/"访问网站" SEO批量友链
  "yanhuolg.github.io", "clearwine.online", "yods007.top", "hurkin.top", "n0o0b.com", "c3ngh.top",
  // 英语/家教/出书/主题平台
  "yewandou.com", "22en.com", "kmspjjw.com", "wenyunfang.com", "csw66.com", "themeisle.com",
  // 旅游/汽车/培训平台
  "yichangly.com", "dycjy.com", "i7car.com", "citscsc.com", "tuozhanm.com",
  "0559hs.com", "0792u.com", "ourdour.com", "quanjingke.com", "pianfang.cn",
  // 科技媒体/门户
  "qudong.com", "tche.cn", "ciotimes.com", "ithome.com", "ikanchai.com",
  "mydrivers.com", "fromgeek.com", "chooseauto.com.cn", "gfan.com",
  // 软件下载镜像站
  "qudoutu.cn", "dyjqd.cn", "as-ssd-benchmark.cn", "caesium.cn", "cn-directx.cn",
  "gimp-org.cn", "smartink.cn", "joyfoot.cn", "deskpin.cn", "q-bittorrent.cn",
  "crystaldisk.cn", "dittodown.cn", "potplay.com.cn", "mark-text.cn",
  "win11debloat.cn", "winhance.cn", "frpgo.com", "getsharex.cn", "potplay.cn",
  "sumatrapdf.cn", "glazewm.cn", "prime95.cn", "losslesscut.cn",
  // 菠菜站群
  "qugujia.com", "qzsnet.com", "zozux.com", "ford-financing.com", "1688xt.com", "cnzhengding.com",
  "zzinfor.com", "can95.com", "tyjsks.com", "avuye.com", "hairuntravel.com", "huyangs.com", "firlz.com",
  // 工具/AI平台
  "zuoshipin.com", "spdiy.net", "3dfty.com", "wpbom.com", "ai8.net", "deepseek.com",
  // 企业/VPS/侦探服务
  "phpiis.com", "kvm.la", "tenstars.net", "766.im",
  // 工具/学术平台
  "zotero.org", "zbib.org", "digitalscholar.org",
  // 组织/个人主页平台
  "opensource.org", "carrd.co",
  // 字体下载/工具/教程站
  "maoken.com", "html.am", "hu60.cn", "5idev.com",
  // 教育考试平台
  "zjzikao.org", "fjjszg.cn", "zzwgd.com", "jszg.gd.cn", "gdgzgz.cn", "zjckw.org", "acgedu.cn",
  // 文学/书推平台
  "zw4j.com", "feiyewang.cn", "wfbrood.com",
  // 字体/设计/工具站
  "ziyouziti.com", "teshuzifu.cn", "peiseka.com", "logo800.cn", "baizaoyin.cn",
  "shandianedu.cn", "tianshenqi.com", "zfont.cn", "ssjjss.com", "logo123.com",
  "mfont.com", "ziticq.com", "mbtipro.cn",
  // 设计素材/工具平台
  "pexels.com", "unsplash.com", "gratisography.com", "lifeofpix.com", "freepik.com",
  "dribbble.com", "behance.net", "flaticon.com", "iconfont.cn", "remove.bg",
  "ilovepdf.com", "tinypng.com", "1001fonts.com", "dafont.com",
  // 工具/查询/娱乐站
  "xche.net", "yxmin.com", "xiaomac.com", "sztv.net", "insxy.com",
  "appxy.net", "apkk.com", "jurl.me", "sourl.net", "seoii.net", "bxfan.com", "yousou.net", "tutucar.com",
  // 知名门户/大站(非个人博客)
  "sogou.com", "cri.cn", "cnr.cn", "qstheory.cn", "mgtv.com", "163.com",
  "sohu.com", "sina.com.cn", "sina.cn", "sinaimg.cn", "hupu.com",
  "xcar.com.cn", "pcauto.com.cn", "eastmoney.com", "ixigua.com",
  "tvmao.com", "icbc.com.cn", "ccb.com", "abchina.com", "boc.cn", "95599.cn",
  "10jqka.com.cn", "stockstar.com", "southmoney.com", "cngold.org",
  "cankaoxiaoxi.com", "guancha.cn", "bjnews.com.cn", "cnfol.com",
  "qcc.com", "notion.so", "js.design", "ted.com", "duolingo.com",
  "ximalaya.com", "lrts.me", "fanqienovel.com", "hongxiu.com",
  "qdmm.com", "qimao.com", "jjwxc.net", "xxsy.net",
  "airchina.com.cn", "ch.com", "ceair.com", "xiachufang.com", "douguo.com",
  "shixiseng.com", "chinahr.com", "jobui.com", "huibo.com",
  "dongchedi.com", "yiche.com", "dongqiudi.com", "leisu.com", "zhibo8.com",
  "ke.com", "tianqi.com", "ganji.com", "dxy.cn", "zhenai.com", "jiayuan.com",
  "lofter.com", "youdao.com", "booking.com", "shutu.cn", "52ppt.com",
  "chatglm.cn", "bigmodel.cn", "xfyun.cn", "xuetangx.com", "zxxk.com",
  "nowcoder.com", "fenbi.com", "eol.cn", "10086.cn",
  // 工具/软件/下载站
  "buzl.cn", "skyyyds.com", "追剧.cc", "daoso.cn", "yinghezhinan.com",
  "yingshiso.top", "qdys1.cc", "hellociqryx6e.com", "gazes.site", "xhkan.top",
  "duanju55.com", "88kq.me", "juok5.top", "huobk.com", "znys.us", "kxyy.me",
  "quickvod.cc", "touhaos.top", "taiee.xyz", "nkdb.cc", "4kzaixian.top",
  "xl720.com", "uump4.cc", "ldysg.com", "ainunu.cc", "seedhub.pro",
  "judodo.cn", "souldebug.com", "fangkong.cc", "agekk.com", "mikanani.me",
  "fitacg.com", "fanchawu.cc", "dmwo.one", "tvtfun.net", "pekolove.net",
  "age.tv", "anime1.me", "godamh.com", "molijun.com", "dute8.cn", "mefcl.com",
  "foxirj.com", "xkwo.com", "ghxi.com", "haowallpaper.com", "rikua.com",
  "gequke.com", "gequbao.com", "23ape.net", "fangpi.net", "gequhai.com",
  "minorsong.com", "yinwe.com", "radio5.cn", "sao.fm", "wuguanggao.top",
  "jinyongwx.com", "linovelib.com", "guihualianpian.cn", "onehu.xyz",
  "xiaoshuo84.cc", "owlook.com.cn", "jiumodiary.com", "shidianguji.com",
  "tingyou.fm", "atimebook.com", "duzhege.cn", "laohuabao.com",
  "reader.jojokanbao.cn", "yxcku.com", "switchxiazai.com", "gameshare.cc",
  "xdgame.io", "laojiku.com", "gamer520.com", "xyg688.com",
  "yikm.net", "ra2web.cn", "flappybird.io", "mcjs.cc",
  "fuym.cn", "localsend.org", "zaixianps.net", "100font.com",
  "1ppt.com", "macbl.com", "uugai.com", "xdiarys.com", "stickerbaker.com",
  "u.tools", "huorong.cn", "xunlei.com", "reckfeng.com", "firpe.cn",
  "sysri.cn", "testufo.com", "exprank.com", "trae.cn", "cmzi.com",
  "sourcetreeapp.com", "tortoisegit.org", "apifox.com", "steampp.net",
  "retiehe.com", "imgbb.com", "sublimetext.com",
  // 工具镜像站
  "softonic.com", "kzisp.com", "zongsang.com",
  // 杂志/发表/批发/法律/新闻站
  "cnmy.org.cn", "yunzazhi.com", "sozazhi.com", "yfabiao.com", "fly63.com",
  "2466.cn", "fumuyu.com", "866120.com", "dyc123.com", "imlaw.cn",
  "haoyun5.net", "yeekang.com", "law158.com",
  // 游戏门户/非博客
  "qxunye.com", "ali213.net",
  // 技术社区/平台(非个人博客)
  "xitu.io",
  // ACGN资源/导航/代购平台
  "zhaicangku.com", "acg17.com", "acgjc.com", "animetox.com", "sendico.com",
  // 官方/教育机构
  "chsi.com.cn", "gatzs.com.cn",
  // .top 色情/垃圾站
  "zzx0826.top", "situku.top", "todoff.top",
  // 博客主题/框架
  "theme-next.js.org",
  "tailwindcss.com", "getbootstrap.com", "jquery.com",
  "webpack.js.org", "vitejs.dev", "nextjs.org", "nuxt.com", "svelte.dev",
  "electronjs.org", "flutter.dev", "dart.dev",
  "python.org", "rust-lang.org", "golang.org", "go.dev",
  "kotlinlang.org", "swift.org", "ruby-lang.org", "php.net",
  // 开发工具/平台
  "postman.com", "figma.com", "canva.com", "docker.com", "kubernetes.io",
  "grafana.com", "prometheus.io", "elastic.co", "mongodb.com",
  "redis.io", "mysql.com", "postgresql.org", "nginx.com", "nginx.org",
  "apache.org", "jenkins.io", "git-scm.com",
  // ⚠️ 博客托管平台泛域名(不要加!!) — github.io / vercel.app / netlify.app / pages.dev / neocities.org / hashnode.dev / deno.dev / fly.dev / workers.dev / firebaseapp.com / gitlab.io / codeberg.page / surge.sh / glitch.me / onrender.com / bearblog.dev
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
			  "packetstormsecurity.org",   // 漏洞利用库，非博客
			  // 电影中文域名/无法访问的停放域名(punycode)
			  "xn--dpqv20e8ug6r8a.com",  // 阿甘正传.com
			  "xn--rhqp87dfoiv9a830g.com", // 楚门的世界.com
			  "xn--10vr61a3xc5x3b.com",  // 盗梦空间.com
			  "xn--vcsx1ip8b8w4i.com",   // 黑客帝国.com
			  "xn--wcv59z.com",          // 教父.com
			  "xn--74qy8dk4drvg29x.com", // 泰坦尼克号.com
			  "xn--74qz10cqsltibh40akss.com", // 肖申克的救赎.com
			  "xn--kivn76b41nnhi.com",   // 星际穿越.com
			  "hgeme.com",
			  // emoji名称对应非博客站点
			  "ai.dcnav.com",         // ChatGPT导航站
			  "uiineed.com",          // TODO工具(todo.uiineed.com)
			  "buildllmprompt.com",   // AI提示词工具
			  "seeker-lorraine.link", // 列表聚合(driver.seeker-lorraine.link)
			  "spec.indieweb.org",    // 规范文档
			  "minio.org.cn",         // MinIO对象存储
			  "dn-42.vercel.app",     // 网络实验项目
			  "nn.labml.ai",          // AI研究文档
			  "iabc.work",            // 项目展示页
			  "0w0.best",             // 试验/演示站
			  "0vvo.com",             // 动漫站(非博客)
			  "ghostring.neocities.org", // webring导航
			  "firechicken.club",     // webring导航
			  "by91.qzz.io",          // 色情
			  // 数字开头非博客域名
			  "libvio.pw", "libvios.com", "libvio.io", "libviobd.com", "libhd.com", // 影视盗版
			  "hbkxsb.com",           // 体育博彩文章
			  "kinkelder.cn",         // 足球直播吧
			  "1linelayouts.com",     // CSS工具站
			  "006idc.cn",            // IDC
			  "0479xxw.cn",           // 信息网
			  "06m.me",               // 短域名停放
			  "10.ci",                // 短域名
			  "1password.com",        // 密码工具
			  "17ce.com", "17ex.com", // 测速工具
			  "08sec.org",            // 安全团队
			  "0akarma.com", "0cili.com", // 视频/工具站
			  "0x0f.dev", "0xff.nu", "0xedward.io", "0xportal.dev", // 技术展示页(非博客)
			  "0psu3.team",           // 团队站
			  // 数字开头非博客域名(P2)
			  "11ty.dev", "11tybundle.dev", "11ty.rocks", "11ty-recipes.mikeaparicio.com", // 11ty框架站
			  "135editor.com",        // 编辑器工具
			  "114biao.com", "114phone.com", "hao123.cn", "123rf.com.cn", // 查询/素材
			  "139cha.cn", "188dh.cn", "1988u.cn", "888slw.cn", "9ghao.com", "930cdm.vip", // SEO/导航spam
			  "18mh.org", "1905.com", "56.com", "4kvm.tv", "4kvm.org", "88kan.org", "88ystv.com", // 影视/成人
			  "51pptmoban.com", "12306soft.cn", "51dns.com", "2233xz.com", // 工具/软件
			  "2017.thegiac.com", "sins-expo.com", "gzicee.com", // 会议/展会
			  "jiuyelighting.1688.com", // 1688商业
			  "alistguazai.icu", "678cn.com", "115fzw.cc", "115fz.cc", "678ca.com", // 辅助/挂载
			  // 数字开头非博客批量(P3) — 影视/工具/商业/spam/菠菜
			  "58hu.com", "66dpw.vip", "bbibb.top", "4ksj.com", "4kzn.com", "3dmgame.com", // 影视
			  "51aspx.com", "51ou.com", "52abp.com", "53bk.com", "7-zip.org", "7zip.top", // 工具/软件
			  "99banzou.com", "502book.com", "33.agilestudio.cn", "3d66.com", "software.3d66.com", // 工具
			  "3dbody.tech", "3dmodelhaven.com", "desk.3gbizhi.com", "99colorthemes.com", "hao.uisdc.com", // 素材/壁纸
			  "52xianbao.cn", "52xiaohua.com", "5577.com", "800zhe.com.cn", "izheye.com", // 商业/spam
			  "88esim.com", "51-expo.cn", "263mailplus.com", "393.com", "95dir.com", "wuyiyiba.com", "tiancebbs.cn", // 商业
			  "68design.net", "58che.com", "8090-sec.com", "36kr.com", "91exam.org", "51tracking.com", "6pm.com", // 行业/商业
			  "61.life", "512.long.ge", "121699.aizhy.com", "xinjiangs.snidenws.cn", "ccopyright.com.cn", // 杂项
			  "31idc.com", "42cloud.cn", // IDC
			  "678tiyu.com", "bjcbsy.cn", "laitaoxie.cn", "smilegift.cn", "nxxinglin.com", "silliandesign.com", "tuchun66.com", // 菠菜
			  "ti.360.net", "quake.360.net", "ata.360.net", "se.360.cn", "image.so.com", "st.so.com", "blogs.360.cn", // 360企业站
			  // "爱"开头非博客 — 平台/工具/商业站
			  "iqiyi.com", "iciba.com", "afdian.com", "aigei.com", "igao7.com", // 大平台
			  "ijiwei.com", "ifabiao.com", "iwangba.net", "aisouzhan.com", "asilu.com", // 行业/导航
			  "ituibar.com", "ivanba.com", "aikeyuan.cn", "awz.cc", "iisuser.com", "imf8.cn", // 推广/目录
			  "athaitao.com", "afexcn.com", "it200.com", "iwmob.com", "love.tg", "i171.com", // 商业/海淘
			  "aqzx.com", "ziiti.com", "23phy.com", "23ops.com", // 平台/工具
			  "kisssub.org", "ailoli.org", "w8dsci.org", "aichunjing.com", "subingwen.cn", "icodebook.com", // 动漫/组织/教育平台
			  "aini365.cn", "sdxbm.com", "idh.cc", "aiit.me", "itmeit.com", "aigeek.top", "illlt.com", // 杂项
			  "erro.cn", "x.iqimeng.com", "i.ewceo.com", "eriqua.com", "aikuaj.com", "aztdxz.cn", // 杂项
			  // 社交媒体平台
			  "bsky.app", "threads.net", "snapchat.com",
			  "medium.com", "substack.com", "discord.com", "discord.gg",
			  "vimeo.com", "instagram.com", "youtu.be", "tiktok.com",
			  "twitch.tv", "patreon.com", "mastodon.social", "mastodon.online",
			  // "安/暗/澳/八"开头非博客 — 赌博/安全/平台/物流/教育/影视
			  "uprpa.com", "lqntl.com", "szzjcy.com", "h5-link-anbo.com.cn", "googlechr.com", "2468c.com", // 赌博
			  "secpulse.com", "anquanquan.info", "secsilo.com", "aqzt.com", "anquan.org", "anquanssl.com", // 安全
			  "dbsec.cn", "sandbox.dbappsecurity.com.cn", "aosc.io", // 安全/OS项目
			  "andown.com", "anxjm.com", "axxf.net", "axfork.com", "welawcn.com", // 加盟/房产/律所
			  "anzhuo.cn", "app.kkj.cn", "nbapp.oioio.top", // 安卓/APP站
			  "szanjun.com", "8dexpress.com", "hwc.aumbow.com", "bawei.net", "2aia.cn", // 物流/集团/联盟
			  "aoshu.com", "bwie.net", "txt80.cc", "anee.cc", "xdzdmy.com", "iafuns.com", "netreflix.cn", // 教育/影视/动漫
			  "antutu.com", "80iter.com", "anxinblog.org", "ddsky.cn", "axace.com", // 工具/社区/培训
			  "talentpluscareer.com", "anying.cc", "yuepian.me", "anwangli.com", "8966.cn", // 求职/图集
			  "zh.annas-archive.org", "ay.henanjubao.com", "theaustralian.news.com.au", "anandalue.com", // 档案/举报/新闻
			  "yunagi7.github.io", "survey.zane-liu.com", "mjh.niulasong.com", // 商会/问卷/案例
			  // "巴/白"开头非博客
			  "ani.gamer.com.tw", "lgrxzd.com", "web.baimiaoapp.com", "egret.com", // 动画/影视/OCR/引擎
			  "baishan.com", "0439.com", "ai.baipiaozhe.com", "belugasubs.com", // CDN/门户/资源/字幕组
			  "white-rat.com", "bn.cq.cn", "bacaoo.com", "batuhu.com", // 安全团队/政府/比价/工具
			  // "百-北"开头非博客
			  "bjjubao.org.cn", "english.aljazeera.net", "99ly.com.cn", "mapgz.com", // 举报/电视台/旅行社/租车
			  "edu84.com", "baibiao.cn", "wz-scj.com", "bjjubao.org", "by56.com", // 报名/标网/天气/举报/物流
			  "cndsnet.com", "dajietui.com", "quefan.com", "scyjzs.com", "bangongit.com", // 优化/推广/律师/办公
			  "bjeea.cn", "bx26.com", "baway.org.cn", "bnman.net", "275.com", // 考试/取名/研修/漫画/保险
			  "keinsci.com", "yamibo.com", "bnia.cn", "py.qianlong.com", "lxjkx.cn", // 科研/百合会/协会/辟谣/保险
			  "bgwl.net", "bt.cn", "bt.sb", "plus.ibaotu.com", "cqhheat.com", // 优化/面板/破解/素材/工业
			  "esp66.com", "baozoumanhua.com", "ebanma.com", "junchengkeji.com", // 文玩/漫画/网络/科技
			  "panconnexus.com", "china-fanghuomen.com.cn", "baipin.pw", "kitauji-gwent.com", // 影院/工厂/软件/游戏
			  "baiyaodao.com", "baoding.offcn.com", "bj.house.163.com", "ustb-806.github.io", // 工具/人事/房产/大学
			  "geo.mijia88.com", "bj.xdf.cn", "bjmemory.clcn.net.cn", // SEO/新东方/地方站
			  // "备-博"开头非博客(备用/博主spam/赌博/壁纸/博客平台等72个)
			  "fk.wwkjs.top", "imouto.tech", "blog.megumifox.com", "visit.lcese.com", // 备用/新手/信息
			  "deepinbolivia.com", "bokequanzi.com", "blog.peter267.me", "bingdou.com.cn", // 国家/博客录/备用/冰豆
			  "limo.ts-yun.com", "blog.jclin.top", // 博主spam/备用
			  "samleoh.com", "hefeiyirui.com", "signcc.com", "boluoyun.com", // 博鱼/博亚/标识/菠萝云
			  "boboji.org", "bizhib.com", "wordcloud.buyaocha.com", "biaoqingbao.xin", // 播客/壁纸/标签/表情
			  "3.y66m.bid", "xf.ailingsi.top", "blog.wenwuhulian.com", "theblogstar.info", // 菠菜/备用/博客之星
			  "utopiablog.cn", "bokelu.suijiboke.gs", "haopaper.com", "bingdou.vip", // 博博客/博客录/病例/冰豆
			  "bingdou.xyz", "bingdou.live", "music.zane-liu.com", "jetli.com.cn", // 冰豆/播放器/比特
			  "ifeve.com", "globalreachent.com", "52blog.cn", "btchao.com", // 并发/比特/博客巢
			  "bizhizu.cn", "ohayou.aimo.moe", "boke8.net", "liuxunzhuo.com", // 壁纸/冰源/博客
			  "bizihu.com", "jsform.com", "blbi.cn", "ourbore.cn", // 壁纸/表单/笔记堡/并发
			  "bitinn.net", "blog.yingmiwo.me", "samovie11.com", "bikamanhua.org", // 比特/博客/博鱼/哔咔
			  "kylen314.com", "bokelianmeng.com", "blog.zlog.online", "szkeihai.com", // 本地/博客联盟/备用/表张力
			  "seiion.com", "blog.town", "binzhoufabu.com", "nmssb.cn", // 壁纸/博客镇/滨州/标识
			  "quanqiujiaoyi.com", "blog.lingerbhw.ml", "scuop.top", // 博主spam
			  "xianjichina.cn", "bloginn.vip", "anlubk.com", // 表面张力仪/博客驿站/备用站点(恢复误删)
			  "limo.ts-yun.com", "blog.jclin.top", // 博主spam/备用
			  "shuangyunjx.com", "tibets.no43.cn", "hebeis.laparoscopy.cn", // 壁纸/本地
			  "lodka.vercel.app", "lcqbc.com", "1a1zp1ep5qgefi2dmptftl5slmv7divfna.com", // 表格/病例/比特币
			  // 前9000中文名分析 — B2B/工具/政府/商业
			  "11467.com", "blgou.net", "xuekutong.cn", "htcmcm.com", // B2B/官网/学库/赌博
			  "reeji.com", "kuaipng.com", "gaoding.art", "jkapi.com", "jishixiezuo.com", // 字库/图网/AI/API/AI写作
			  "xiaojiyun.com", "4759.cn", "qqkkb.com", "softwarelove.cn", "nvdb.org.cn", // 云/域名/博客网/软件/编号
			  "shaolinwushuxuexiao.com", "cdrckt.cn", "sosuoseo.com", "jtsg010.com", // 招生/文学/SEO/律师
			  "senyuanfa.com", "gdhztc.cn", "forestsongbookstore.com", "qianlima.com", // 防腐/培训/书店/招聘
			  "58pic.com", "jia.com", "gucheng.com", "mfcad.com", "cnhnb.com", // 图网/家装/股城/CAD/惠农
			  "thum.io", "gartic.io", "jkgq.top", "wc8.cn", "fuyejidi.com", // 截图/游戏/地址/网创/副业
			  "jimeng.jianying.com", "quququ.cn", "weikelink.com", "webpagetest.org", // AI/去水印/外链/测速
			  "liulihu.com", "ykinvestment.com", "wdybk.work", "softqq.com", // 专家/技术/哆啦/PE装机
			  "bandbbs.cn", "miegoat.club", "rubicforce.com", "nicsrs.com", // 论坛/.NET/魔方/国际
			  "jypy.jyb.cn", "live.freebuf.com", // 教育部/FreeBuf
			  "ysepan.com", "moefire.tech", // 藏经阁/工作室
			  // AI工具/平台/产品(非博客)
			  "openai.com", "chatgpt.com", "doubao.com", "dify.ai", "cursor.com", // 大AI平台
			  "siliconflow.cn", "kimi.moonshot.cn", "tiangong.cn", "n.cn", "minimaxi.com", // 国内AI平台
			  "aitop100.cn", "aicpb.com", "aigc1024.com", "toolai.io", "aihero.dev", // AI排名/工具集
			  "idjpg.com", "jpghi.com", "bigmp4.com", "jpghd.com", "jpgrm.com", "pixelmax.art", // AI图片/视频
			  "zeemo.ai", "veed.io", "meshy.ai", "lepton.ai", "together.ai", "funda.ai", // AI工具
			  "xingyun3d.com", "aitubiao.com", "logomaker.com.cn", "ubrand.com", // 设计/图表
			  "openailab.com", "shlab.org.cn", "ai.nejm.org", // AI实验室
			  "storygenerator.cc", "unaimytext.com", "clicknow.ai", "gitmind.com", // AI写作/导图
			  "aibct.com", "xiaohuokekeji.com", "1ai.net", "aitm.cn", "aijhw.com", "aidyz.cn", // AI编程/导航
			  "reelmate.cn", "aigc.yizhentv.com", "upage.ai", "aicentre.cn", // AI视频/建站
			  "aiyuzhou8.com", "aixzd.com", "aiminiatur.org", "veo3hub.ai", // AI社区/工具
			  "rbq.ai", "roleai.chat", "espai.fun", "llmcms.org", "java2ai.com", "cordys.cn", // AI聊天/开发
			  "tomoviee.ai", "thispersondoesnotexist.com", "telepace.cc", "dboai.com", "aitom.cn", // AI工具/平台
			  "qmye.com", "aigamer.cn", "aipmgo.com", "joysift.cn", "aieii.com", // AI产品/客服
			  "bagbuddy.pages.dev", "ai-dr.tw", "kuai.com", "ai.logo123.com", "ai.ninesure.com", // AI杂项
			  // 其他非博客
			  "iasociety.org", "dortmund-aikido.de", "g-sunrisepump.com", // 学会/道馆/水泵
			  "nerds.airbnb.com", "samurai.inguardians.com", "mirai.mamoe.net", // 企业/框架/机器人
			  "noai.duckduckgo.com", "sekai.team", "fantastic-admin.hurui.me", // 搜索/CTF/后台
			];
