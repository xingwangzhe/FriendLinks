export const NON_BLOG_DOMAINS: string[] = [
  "github.com", "gitee.com", "gitlab.com", "bitbucket.org", "coding.net", "gitcode.net", "codeberg.org", "gitea.io", "gitea.com", "sourceforge.net", "gitlab.cn", "oschina.net", "travellings.cn", "www.travellings.cn", "rss.travellings.cn", "rss-source.travellings.cn", "beian.miit.gov.cn", "beian.mps.gov.cn", "www.beian.gov.cn", "icp.gov.moe", "icp.gs", "travel.moe", "moicp.cn", "icp.cab", "icp.n3v.cn", "vercel.com", "netlify.com", "cloudflare.com", "hexo.io", "butterfly.js.org", "zhihu.com", "www.zhihu.com", "bilibili.com", "space.bilibili.com", "www.bilibili.com", "twitter.com", "x.com", "music.163.com", "boyouquan.com", "www.boyouquan.com", "browsehappy.com", "graph.org", "blogsclub.org", "www.blogsclub.org", "blogplanet.cn", "www.blogplanet.cn", "blogscn.fun", "blog114.com", "boke.lu", "bokequan.cn", "blogtalk.org", "storeweb.cn", "haozhan.wang", "zhblogs.net", "www.zhblogs.net", "foreverblog.cn", "www.foreverblog.cn", "rmbk.cc", "www.rmbk.cc", "jiuchan.org", "hi.jiuchan.org", "bloginc.cn", "findblog.net", "www.findblog.net", "morerss.com", "dogerolls.com", "boringbay.com", "cnblogs.com", "www.cnblogs.com", "cifnews.com", "512kb.club", "useplaintext.email", "shenzhouwenxue.com", "digitalchina.com", "dcholdings.com", "dcits.com", "shenzhoukuntai.com", "qn63.com", "csdn.net", "blog.csdn.net", "jianshu.com", "www.jianshu.com", "baidu.com", "www.baidu.com", "bing.com", "www.bing.com", "google.com", "www.google.com", "12377.cn", "www.12377.cn", "12306.cn", "www.12306.cn", "12315.cn", "www.12315.cn", "halo.run", "51.la", "v6.51.la", "douyin.com", "www.douyin.com", "v.douyin.com", "youtube.com", "www.youtube.com", "m.youtube.com", "aliyun.com", "www.aliyun.com", "cloud.tencent.com", "huaweicloud.com", "www.huaweicloud.com", "aws.amazon.com", "azure.microsoft.com", "cloud.google.com", "vultr.com", "www.vultr.com", "digitalocean.com", "www.digitalocean.com", "linode.com", "www.linode.com", "rainyun.com", "www.rainyun.com", "jdcloud.com", "www.jdcloud.com", "cloud.baidu.com", "ucloud.cn", "www.ucloud.cn", "qingcloud.com", "www.qingcloud.com", "upyun.com", "www.upyun.com", "qiniu.com", "www.qiniu.com",
  // 互联网大厂
  "alibaba.com", "alibabagroup.com", "tencent.com", "bytedance.com", "netease.com", "meituan.com", "xiaomi.com", "oppo.com", "vivo.com", "huawei.com", "lenovo.com", "microsoft.com", "amazon.com", "meta.com",
  // 知名媒体/电视台
  "cctv.com", "cctv.cn", "cntv.cn", "people.com.cn", "xinhuanet.com", "ifeng.com", "huanqiu.com", "chinanews.com", "gmw.cn", "huxiu.com", "36kr.com", "thepaper.cn", "jiemian.com",
  // 知名品牌
  "taobao.com", "tmall.com", "jd.com", "pinduoduo.com", "xiaohongshu.com", "kuaishou.com", "suning.com", "dangdang.com", "ctrip.com", "qunar.com", "didiglobal.com", "nike.com", "adidas.com", "starbucks.com", "mcdonalds.com",
  // 组件库/框架官网
  "react.dev", "reactjs.org", "angular.io", "angularjs.org", "nodejs.org", "npmjs.com", "typescriptlang.org", "deno.land", "gohugo.io", "markdown.com.cn", "blowfish.page", "0w.hk", "xt50.com", "typecho.org",
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
  "xjdshx.com", "liaoliaojizhang.cn", "oem818.com", "as0000.cn", "ktvjgof.cn", "scyssy.com.cn", "qiushicaijing.com", "74i74.cn", "mcsmalltian.com", "linkmoreparking.cn", "zsdkw.net", "bussmann.cc", "520papapa.cn",
  // 汇率SEO站群
  "xjqyc.cn", "ksnfes.com.cn", "wyq888.top", "tuyios.cn", "xiansimao.top", "youzi201314.top", "tyhsrjt.cn", "afyrty.cn", "breakeve.cn", "jinfet.top",
  // "访问网站" SEO批量友链 + 博客平台
  "xjybk.cn", "bybkw.cn", "panzy.top", "xfabe.com", "21r.cn", "chaojizy.com", "ffw8.cn", "yuhiri.me", "yuankainet.cn", "emlog.net",
  // "前去学习"/"访问网站" SEO批量友链
  "yanhuolg.github.io", "clearwine.online", "yods007.top", "hurkin.top", "n0o0b.com", "c3ngh.top",
  // 英语/家教/出书/主题平台
  "yewandou.com", "22en.com", "kmspjjw.com", "wenyunfang.com", "csw66.com", "themeisle.com",
  // 旅游/汽车/培训平台
  "yichangly.com", "dycjy.com", "i7car.com", "citscsc.com", "tuozhanm.com", "0559hs.com", "0792u.com", "ourdour.com", "quanjingke.com", "pianfang.cn",
  // 科技媒体/门户
  "qudong.com", "tche.cn", "ciotimes.com", "ithome.com", "ikanchai.com", "mydrivers.com", "fromgeek.com", "chooseauto.com.cn", "gfan.com",
  // 软件下载镜像站
  "qudoutu.cn", "dyjqd.cn", "as-ssd-benchmark.cn", "caesium.cn", "cn-directx.cn", "gimp-org.cn", "smartink.cn", "joyfoot.cn", "deskpin.cn", "q-bittorrent.cn", "crystaldisk.cn", "dittodown.cn", "potplay.com.cn", "mark-text.cn", "win11debloat.cn", "winhance.cn", "frpgo.com", "getsharex.cn", "potplay.cn", "sumatrapdf.cn", "glazewm.cn", "prime95.cn", "losslesscut.cn",
  // 菠菜站群
  "qugujia.com", "qzsnet.com", "zozux.com", "ford-financing.com", "1688xt.com", "cnzhengding.com", "zzinfor.com", "can95.com", "tyjsks.com", "avuye.com", "hairuntravel.com", "huyangs.com", "firlz.com",
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
  "ziyouziti.com", "teshuzifu.cn", "peiseka.com", "logo800.cn", "baizaoyin.cn", "shandianedu.cn", "tianshenqi.com", "zfont.cn", "ssjjss.com", "logo123.com", "mfont.com", "ziticq.com", "mbtipro.cn",
  // 设计素材/工具平台
  "pexels.com", "unsplash.com", "gratisography.com", "lifeofpix.com", "freepik.com", "dribbble.com", "behance.net", "flaticon.com", "iconfont.cn", "remove.bg", "ilovepdf.com", "tinypng.com", "1001fonts.com", "dafont.com",
  // 工具/查询/娱乐站
  "xche.net", "yxmin.com", "xiaomac.com", "sztv.net", "insxy.com", "appxy.net", "apkk.com", "jurl.me", "sourl.net", "seoii.net", "bxfan.com", "yousou.net", "tutucar.com",
  // 知名门户/大站(非个人博客)
  "sogou.com", "cri.cn", "cnr.cn", "qstheory.cn", "mgtv.com", "163.com", "sohu.com", "sina.com.cn", "sina.cn", "sinaimg.cn", "hupu.com", "xcar.com.cn", "pcauto.com.cn", "eastmoney.com", "ixigua.com", "tvmao.com", "icbc.com.cn", "ccb.com", "abchina.com", "boc.cn", "95599.cn", "10jqka.com.cn", "stockstar.com", "southmoney.com", "cngold.org", "cankaoxiaoxi.com", "guancha.cn", "bjnews.com.cn", "cnfol.com", "qcc.com", "notion.so", "js.design", "ted.com", "duolingo.com", "ximalaya.com", "lrts.me", "fanqienovel.com", "hongxiu.com", "qdmm.com", "qimao.com", "jjwxc.net", "xxsy.net", "airchina.com.cn", "ch.com", "ceair.com", "xiachufang.com", "douguo.com", "shixiseng.com", "chinahr.com", "jobui.com", "huibo.com", "dongchedi.com", "yiche.com", "dongqiudi.com", "leisu.com", "zhibo8.com", "ke.com", "tianqi.com", "ganji.com", "dxy.cn", "zhenai.com", "jiayuan.com", "lofter.com", "youdao.com", "booking.com", "shutu.cn", "52ppt.com", "chatglm.cn", "bigmodel.cn", "xfyun.cn", "xuetangx.com", "zxxk.com", "nowcoder.com", "fenbi.com", "eol.cn", "10086.cn",
  // 工具/软件/下载站
  "buzl.cn", "skyyyds.com", "追剧.cc", "daoso.cn", "yinghezhinan.com", "yingshiso.top", "qdys1.cc", "hellociqryx6e.com", "gazes.site", "xhkan.top", "duanju55.com", "88kq.me", "juok5.top", "huobk.com", "znys.us", "kxyy.me", "quickvod.cc", "touhaos.top", "taiee.xyz", "nkdb.cc", "4kzaixian.top", "xl720.com", "uump4.cc", "ldysg.com", "ainunu.cc", "seedhub.pro", "judodo.cn", "souldebug.com", "fangkong.cc", "agekk.com", "mikanani.me", "fitacg.com", "fanchawu.cc", "dmwo.one", "tvtfun.net", "pekolove.net", "age.tv", "anime1.me", "godamh.com", "molijun.com", "dute8.cn", "mefcl.com", "foxirj.com", "xkwo.com", "ghxi.com", "haowallpaper.com", "rikua.com", "gequke.com", "gequbao.com", "23ape.net", "fangpi.net", "gequhai.com", "minorsong.com", "yinwe.com", "radio5.cn", "sao.fm", "wuguanggao.top", "jinyongwx.com", "linovelib.com", "guihualianpian.cn", "onehu.xyz", "xiaoshuo84.cc", "owlook.com.cn", "jiumodiary.com", "shidianguji.com", "tingyou.fm", "atimebook.com", "duzhege.cn", "laohuabao.com", "reader.jojokanbao.cn", "yxcku.com", "switchxiazai.com", "gameshare.cc", "xdgame.io", "laojiku.com", "gamer520.com", "xyg688.com", "yikm.net", "ra2web.cn", "flappybird.io", "mcjs.cc", "fuym.cn", "localsend.org", "zaixianps.net", "100font.com", "1ppt.com", "macbl.com", "uugai.com", "xdiarys.com", "stickerbaker.com", "u.tools", "huorong.cn", "xunlei.com", "reckfeng.com", "firpe.cn", "sysri.cn", "testufo.com", "exprank.com", "trae.cn", "cmzi.com", "sourcetreeapp.com", "tortoisegit.org", "apifox.com", "steampp.net", "retiehe.com", "imgbb.com", "sublimetext.com",
  // 工具镜像站
  "softonic.com", "kzisp.com", "zongsang.com",
  // 游戏社区/项目平台
  "cngal.org", "godothub.com", "kid-game.cn", "momoyu.ink", "doujin-ledger.org", "nanana.cn", "ymgal.games", "humihumi.com", "lspsp.me",
  // 免费资源推荐站
  "thosefree.com",
  // 网吧维护/软件站
  "yweihu.com", "wangbaweihu.com", "slsup.com", "clxp.net.cn", "shykx.com", "cnit.net.cn", "laoliit.cn", "im2828.com", "osssr.com", "xitonggho.com", "58server.net", "iwangwei.cn",
  // 商业/企业站
  "yuzhua.com", "mxhaitao.com", "yingjia360.com", "xiangmu.com", "tnc.com.cn", "yuanhu.com", "haofabiao.com", "szhk.com", "chinairn.com",
  // 3D模型/培训/设计站
  "yitu.cn", "3dxia.com", "100vr.com", "gototsinghua.org.cn", "c4d.cn",
  // 设计/渲染工具站
  "yituyu.com", "animiz.cn", "zhutix.com", "renderbus.com", "meizhang.com",
  // 商业工具/媒体/教育平台
  "yixieshi.com", "tmtpost.com", "newrank.cn", "gaoding.com", "pixlr.com", "pixabay.com", "soogif.com", "doutula.com", "jianguoyun.com", "teambition.com", "tower.im", "yinxiang.com", "qichacha.com", "tianyancha.com", "iflyrec.com", "xiaoe-tech.com", "kaikeba.com", "sanjieke.cn", "maiziedu.com",
  // 链接聚合/工具站
  "yiwangmeng.com", "gantanhao.vip", "iplocation.net", "flomoapp.com", "processon.com", "mubu.com", "gitmind.cn", "ezgif.com", "mastergo.com", "xiaopiu.com", "sketchapp.com", "invisionapp.com", "coolors.co", "wappalyzer.com", "sizzy.co", "csspeeper.com", "blender.org", "affinity.serif.com", "uigradients.com",
  // 影视/字幕/工具站
  "yingheapp.com", "xl01.eu.cc", "kzzy.fun", "zimuku.org", "zhaotaici.cn", "quodb.com", "t759.cn", "saucenao.com", "dialogue.moe", "miluxing.com", "hmacg.cn", "shuge.org", "tv.garden", "classppt.cn", "kms.cx", "quwenjian.cc", "cntshare.com", "qbiji.com", "zoom.earth", "urlzj.com", "fsgameo.com", "boomcatcher.com",
  // 工具/查询站
  "yigekuang.cn", "4.plus", "lanzou.com", "cx580.com", "gerensuodeshui.cn", "sixin.cc",
  // 工业/商业站
  "yhwufvo.cn", "haodediaosu.com", "h2wz.com", "ts1010.com",
  // 色情/伴游站
  "yeban.cc", "gcwaxl.cn", "06tc.com", "withoutfog.cn",
  // 体育博彩站群
  "yahuu.cn", "bjrfnk.com", "hanyucrushers.com", "hftlh.com", "51qixun.com", "alshrds.cn", "akszyds.cn", "tyzh.com.cn", "dcmotor.com.cn", "t1517.cn", "wanttek.cn", "snts.cn", "xiyangzhushou.cn", "7kuwang.cn", "superdingdian.com", "fzjmx.com", "ldkcw.com", "junfeijun.cn", "hzfuda168.cn", "mlwmm.cn", "be3653658.cn",
  // 破解/逆向社区
  "xuepojie.com", "52hb.com", "52bug.cn", "zn50.com", "chinapyg.com", "synx.cn",
  // 图片压缩工具
  "yotupng.com", "xing-zhi-love.com", "hn96520.com", "114piaowu.com", "2zzt.com", "admin5.cn", "51xuediannao.com", "huzhan.com", "omooo.com", "salongweb.com",
  // 新闻/朋友圈工具站
  "pyq.gs", "kanxinwen.cc",
  // 域名/停放/工具站
  "我的.网站", "龍哥.中國", "registrant.contact", "doma.ing", "rdapx.com", "rdap.press", "rdapis.com", "lookup.ee", "longway.dad", "drag.one", "type.life", "teodns.cn", "nopua.com", "cname.pro", "is-for-sale.com", "poorbeg.com", "lasts.top", "randomto.com", "ipabc.de", "favicons.cn",
  // 成人/政治/极端站
  "douyidou.com", "mantoubi.com", "qimengke.com", "pipayu.com", "regdict.com", "dotaone.com", "dota.pro", "tgrot.cn", "xiaoyingyu.com",
  // AI垃圾/错乱站
  "jike.com", "piliangongyu.com", "zcool.com.cn", "uisdc.com",
  // 教程/博客平台
  "codeqd.com", "jiangweishan.com", "web176.com", "zblogcn.com", "htmlit.com.cn",
  // 杂志/发表/批发/法律/新闻站
  "cnmy.org.cn", "yunzazhi.com", "sozazhi.com", "yfabiao.com", "fly63.com", "2466.cn", "fumuyu.com", "866120.com", "dyc123.com", "imlaw.cn", "haoyun5.net", "yeekang.com", "law158.com",
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
  "theme-next.js.org", "tailwindcss.com", "getbootstrap.com", "jquery.com", "webpack.js.org", "vitejs.dev", "nextjs.org", "nuxt.com", "svelte.dev", "electronjs.org", "flutter.dev", "dart.dev", "python.org", "rust-lang.org", "golang.org", "go.dev", "kotlinlang.org", "swift.org", "ruby-lang.org", "php.net",
  // 开发工具/平台
  "postman.com", "figma.com", "canva.com", "docker.com", "kubernetes.io", "grafana.com", "prometheus.io", "elastic.co", "mongodb.com", "redis.io", "mysql.com", "postgresql.org", "nginx.com", "nginx.org", "apache.org", "jenkins.io", "git-scm.com",
  // ⚠️ 博客托管平台泛域名(不要加!!) — github.io / vercel.app / netlify.app / pages.dev / neocities.org / hashnode.dev / deno.dev / fly.dev / workers.dev / firebaseapp.com / gitlab.io / codeberg.page / surge.sh / glitch.me / onrender.com / bearblog.dev
  "appinn.com", "www.appinn.com", "xhuama.cn", "www.xhuama.cn", "wk21.com", "www.wk21.com", "ekucat.com", "icp.ekucat.com", "91yl.top", "fylm.91yl.top", "678.tax", "www.678.tax", "cnb.cool", "www.cnb.cool", "bokehub.com", "www.bokehub.com", "links.needhelp.icu", "iyuan.ltd", "mcdocs.iyuan.ltd", "niege.app", "bbs.niege.app", "nicepub.top", "www.nicepub.top", "bbs.nicepub.top", "nies.live", "www.nies.live", "moa.moe", "www.moa.moe", "linuxcat.top", "www.linuxcat.top", "blog.sunguoqi.com", "halo.oneln.org", "blog.meowo.moe", "xiaorin.com", "www.xiaorin.com", "nekopara.us", "www.nekopara.us", "sweetsmoe.com", "www.sweetsmoe.com", "blog.45m.fun", "hipvogue.com", "www.hipvogue.com", "cicaf.com", "www.cicaf.com", "log.ink", "mark.vergilisme.com", "steampowered.com", "store.steampowered.com", "steamcommunity.com", "www.steamcommunity.com", "epicgames.com", "www.epicgames.com", "ibb22.com", "www.ibb22.com", "pgg33.com", "www.pgg33.com", "www.taobao.com", "www.tmall.com", "www.jd.com", "www.pinduoduo.com", "linkwhisper.com", "www.linkwhisper.com", "mzswpco.com", "www.mzswpco.com", "4414.cn", "www.4414.cn", "ug95.com", "www.ug95.com", "runoob.com", "www.runoob.com", "marxists.org", "www.marxists.org", "vuejs.org", "v2.cn.vuejs.org", "cn.vuejs.org", "lxhaoka.cn", "www.lxhaoka.cn", "mirrors.163.com", "mirrors.ustc.edu.cn", "tiobe.com", "www.tiobe.com", "juejin.cn", "www.juejin.cn", "51cto.com", "blog.51cto.com", "www.51cto.com", "infoq.com", "www.infoq.com", "huggingface.co", "www.huggingface.co", "cnki.net", "www.cnki.net", "wanfangdata.com", "www.wanfangdata.com", "cqvip.com", "www.cqvip.com", "arxiv.org", "www.arxiv.org", "researchgate.net", "www.researchgate.net", "academia.edu", "www.academia.edu", "creativecommons.org", "www.creativecommons.org", "apple.com", "www.apple.com", "apps.apple.com", "gravatar.com", "www.gravatar.com", "gravatar.loli.net", "cravatar.cn", "www.cravatar.cn", "qlogo.cn", "q2.qlogo.cn", "facebook.com", "www.facebook.com", "reddit.com", "linkedin.com", "www.linkedin.com", "pinterest.com", "telegram.me", "t.me", "whatsapp.com", "api.whatsapp.com", "tumblr.com", "www.tumblr.com", "blogger.com", "www.blogger.com", "douban.com", "www.douban.com", "weibo.com", "service.weibo.com", "qq.com", "connect.qq.com", "qzone.qq.com", "gerenjianli.com", "www.gerenjianli.com", "lwzzlf.cn", "www.lwzzlf.cn", "163mu.com", "www.163mu.com", "onetrans.app", "vision-flow.art", "myhkw.com", "airportal.cn", "www.airportal.cn", "pairdrop.net", "snapdrop.net", "easychuan.cn", "tmp.link", "app.tmp.link", "wenshushu.cn", "www.wenshushu.cn", "cowtransfer.com", "ttttt.link", "www.ttttt.link", "lifeweek.com.cn", "dili360.com", "www.dili360.com", "boduoad.com", "cssworld.cn", "artemkutsan.pp.ua", "770b.cn", "obey.fun",
			  // 政府/官媒/机构网站
  "chinaflagnet.com", "crt.com.cn", "1921.org.cn", "idcpc.org.cn", "cyol.com", "workercn.cn", "mj.org.cn", "youth.cn", "ce.cn", "cs.com.cn", "china.com.cn", "chinadaily.com.cn", "chinamil.com.cn", "cssn.cn", "confucianism.com.cn", "honggewang.com", "jjzy.cn", "kcna.kp", "scimedia.cn", "stdaily.com", "chinaelections.org", "china-world1981.com", "wildaidchina.org.cn",
			  // 商业/工具/教育平台
  "cnnic.cn", "webwhois.cnnic.cn", "zgsydw.com", "zlketang.com", "zhonghuadiancang.com", "zhongguose.com", "zglxw.com", "tungpohy.com", "zhonghuanus.com", "zoroip.cn", "myrushbox.com", "zdtk.cn", "tumukeji.com", "gmail777.com", "dx7c.com", "historyline.online", "uni.utities.online", "zhongyudata.com", "jueshunjx.com", "hpcbristol.net", "tech.china.com", "szkingroad.com", "diancang.xyz", "zhonghaizhi.com", "huahengtaoci.com",
			  // "直接访问"(按钮文本被当站名) — 均为工具/服务站点
  "5118.com", "5ce.com", "aidea.im", "heygen.com", "getgetai.com", "xiezuocat.com", "xiaofamao.com", "heyfriday.cn", "chuangkit.com", "zhimap.com", "hizdm.cn", "aipix.net", "weshineapp.com", "weiciyun.com", "sssssssss.com", "12321.cn", "loghao.com", "chanmama.com", "allhistory.com", "shangdianba.com", "jikipedia.com", "juzikong.com", "yayun.la", "bodongshi.com", "wenangou.com", "mediatrack.cn", "bigjpg.com", "yuntianyi.com", "caiyunai.com", "mypitaya.com", "1ts.fun", "chronodivide.com", "itellyou.cn", "xiniubaba.com", "vvcha.cn", "51240.com", "ys168.com", "epubee.com",
			  // 智能/科技商业站点
  "znds.com", "zhidx.com", "zhiguoxin.cn", "zhengzhaopai.com", "dmtt.run", "sczhgx.com", "gameba.cc", "aint.top",
			  // 组件库/框架官网(CSS被当链接名)
  "shoelace.style", "hilla.dev", "core.clarity.design", "openjsf.org", "lion.js.org", "auro.alaskaair.com", "packetstormsecurity.org",
			  // 电影中文域名/无法访问的停放域名(punycode)
  "阿甘正传.com", "楚门的世界.com", "盗梦空间.com", "黑客帝国.com", "教父.com", "泰坦尼克号.com", "肖申克的救赎.com", "星际穿越.com", "hgeme.com",
			  // emoji名称对应非博客站点
  "ai.dcnav.com", "uiineed.com", "buildllmprompt.com", "seeker-lorraine.link", "spec.indieweb.org", "minio.org.cn", "dn-42.vercel.app", "nn.labml.ai", "iabc.work", "0w0.best", "0vvo.com", "ghostring.neocities.org", "firechicken.club", "by91.qzz.io",
			  // 数字开头非博客域名
  "libvio.pw", "libvios.com", "libvio.io", "libviobd.com", "libhd.com", "hbkxsb.com", "kinkelder.cn", "1linelayouts.com", "006idc.cn", "0479xxw.cn", "06m.me", "10.ci", "1password.com", "17ce.com", "17ex.com", "08sec.org", "0akarma.com", "0cili.com", "0x0f.dev", "0xff.nu", "0xedward.io", "0xportal.dev", "0psu3.team",
			  // 数字开头非博客域名(P2)
  "11ty.dev", "11tybundle.dev", "11ty.rocks", "11ty-recipes.mikeaparicio.com", "135editor.com", "114biao.com", "114phone.com", "hao123.cn", "123rf.com.cn", "139cha.cn", "188dh.cn", "1988u.cn", "888slw.cn", "9ghao.com", "930cdm.vip", "18mh.org", "1905.com", "56.com", "4kvm.tv", "4kvm.org", "88kan.org", "88ystv.com", "51pptmoban.com", "12306soft.cn", "51dns.com", "2233xz.com", "2017.thegiac.com", "sins-expo.com", "gzicee.com", "jiuyelighting.1688.com", "alistguazai.icu", "678cn.com", "115fzw.cc", "115fz.cc", "678ca.com",
			  // 数字开头非博客批量(P3) — 影视/工具/商业/spam/菠菜
  "58hu.com", "66dpw.vip", "bbibb.top", "4ksj.com", "4kzn.com", "3dmgame.com", "51aspx.com", "51ou.com", "52abp.com", "53bk.com", "7-zip.org", "7zip.top", "99banzou.com", "502book.com", "33.agilestudio.cn", "3d66.com", "software.3d66.com", "3dbody.tech", "3dmodelhaven.com", "desk.3gbizhi.com", "99colorthemes.com", "hao.uisdc.com", "52xianbao.cn", "52xiaohua.com", "5577.com", "800zhe.com.cn", "izheye.com", "88esim.com", "51-expo.cn", "263mailplus.com", "393.com", "95dir.com", "wuyiyiba.com", "tiancebbs.cn", "68design.net", "58che.com", "8090-sec.com", "91exam.org", "51tracking.com", "6pm.com", "61.life", "512.long.ge", "121699.aizhy.com", "xinjiangs.snidenws.cn", "ccopyright.com.cn", "31idc.com", "42cloud.cn", "678tiyu.com", "bjcbsy.cn", "laitaoxie.cn", "smilegift.cn", "nxxinglin.com", "silliandesign.com", "tuchun66.com", "ti.360.net", "quake.360.net", "ata.360.net", "se.360.cn", "image.so.com", "st.so.com", "blogs.360.cn",
			  // "爱"开头非博客 — 平台/工具/商业站
  "iqiyi.com", "iciba.com", "afdian.com", "aigei.com", "igao7.com", "ijiwei.com", "ifabiao.com", "iwangba.net", "aisouzhan.com", "asilu.com", "ituibar.com", "ivanba.com", "aikeyuan.cn", "awz.cc", "iisuser.com", "imf8.cn", "athaitao.com", "afexcn.com", "it200.com", "iwmob.com", "love.tg", "i171.com", "aqzx.com", "ziiti.com", "23phy.com", "23ops.com", "kisssub.org", "ailoli.org", "w8dsci.org", "aichunjing.com", "subingwen.cn", "icodebook.com", "aini365.cn", "sdxbm.com", "idh.cc", "aiit.me", "itmeit.com", "aigeek.top", "illlt.com", "erro.cn", "x.iqimeng.com", "i.ewceo.com", "eriqua.com", "aikuaj.com", "aztdxz.cn",
			  // 社交媒体平台
  "bsky.app", "threads.net", "snapchat.com", "medium.com", "substack.com", "discord.com", "discord.gg", "vimeo.com", "instagram.com", "youtu.be", "tiktok.com", "twitch.tv", "patreon.com", "mastodon.social", "mastodon.online",
			  // "安/暗/澳/八"开头非博客 — 赌博/安全/平台/物流/教育/影视
  "uprpa.com", "lqntl.com", "szzjcy.com", "h5-link-anbo.com.cn", "googlechr.com", "2468c.com", "secpulse.com", "anquanquan.info", "secsilo.com", "aqzt.com", "anquan.org", "anquanssl.com", "dbsec.cn", "sandbox.dbappsecurity.com.cn", "aosc.io", "andown.com", "anxjm.com", "axxf.net", "axfork.com", "welawcn.com", "anzhuo.cn", "app.kkj.cn", "nbapp.oioio.top", "szanjun.com", "8dexpress.com", "hwc.aumbow.com", "bawei.net", "2aia.cn", "aoshu.com", "bwie.net", "txt80.cc", "anee.cc", "xdzdmy.com", "iafuns.com", "netreflix.cn", "antutu.com", "80iter.com", "anxinblog.org", "ddsky.cn", "axace.com", "talentpluscareer.com", "anying.cc", "yuepian.me", "anwangli.com", "8966.cn", "zh.annas-archive.org", "ay.henanjubao.com", "theaustralian.news.com.au", "anandalue.com", "yunagi7.github.io", "survey.zane-liu.com", "mjh.niulasong.com",
			  // "巴/白"开头非博客
  "ani.gamer.com.tw", "lgrxzd.com", "web.baimiaoapp.com", "egret.com", "baishan.com", "0439.com", "ai.baipiaozhe.com", "belugasubs.com", "white-rat.com", "bn.cq.cn", "bacaoo.com", "batuhu.com",
			  // "百-北"开头非博客
  "bjjubao.org.cn", "english.aljazeera.net", "99ly.com.cn", "mapgz.com", "edu84.com", "baibiao.cn", "wz-scj.com", "bjjubao.org", "by56.com", "cndsnet.com", "dajietui.com", "quefan.com", "scyjzs.com", "bangongit.com", "bjeea.cn", "bx26.com", "baway.org.cn", "bnman.net", "275.com", "keinsci.com", "yamibo.com", "bnia.cn", "py.qianlong.com", "lxjkx.cn", "bgwl.net", "bt.cn", "bt.sb", "plus.ibaotu.com", "cqhheat.com", "esp66.com", "baozoumanhua.com", "ebanma.com", "junchengkeji.com", "panconnexus.com", "china-fanghuomen.com.cn", "baipin.pw", "kitauji-gwent.com", "baiyaodao.com", "baoding.offcn.com", "bj.house.163.com", "ustb-806.github.io", "geo.mijia88.com", "bj.xdf.cn", "bjmemory.clcn.net.cn",
			  // "备-博"开头非博客(备用/博主spam/赌博/壁纸/博客平台等72个)
  "fk.wwkjs.top", "imouto.tech", "blog.megumifox.com", "visit.lcese.com", "deepinbolivia.com", "bokequanzi.com", "blog.peter267.me", "bingdou.com.cn", "limo.ts-yun.com", "blog.jclin.top", "samleoh.com", "hefeiyirui.com", "signcc.com", "boluoyun.com", "boboji.org", "bizhib.com", "wordcloud.buyaocha.com", "biaoqingbao.xin", "3.y66m.bid", "xf.ailingsi.top", "blog.wenwuhulian.com", "theblogstar.info", "utopiablog.cn", "bokelu.suijiboke.gs", "haopaper.com", "bingdou.vip", "bingdou.xyz", "bingdou.live", "music.zane-liu.com", "jetli.com.cn", "ifeve.com", "globalreachent.com", "52blog.cn", "btchao.com", "bizhizu.cn", "ohayou.aimo.moe", "boke8.net", "liuxunzhuo.com", "bizihu.com", "jsform.com", "blbi.cn", "ourbore.cn", "bitinn.net", "blog.yingmiwo.me", "samovie11.com", "bikamanhua.org", "kylen314.com", "bokelianmeng.com", "blog.zlog.online", "szkeihai.com", "seiion.com", "blog.town", "binzhoufabu.com", "nmssb.cn", "quanqiujiaoyi.com", "blog.lingerbhw.ml", "scuop.top", "xianjichina.cn", "bloginn.vip", "anlubk.com", "shuangyunjx.com", "tibets.no43.cn", "hebeis.laparoscopy.cn", "lodka.vercel.app", "lcqbc.com", "1a1zp1ep5qgefi2dmptftl5slmv7divfna.com",
			  // 前9000中文名分析 — B2B/工具/政府/商业
  "11467.com", "blgou.net", "xuekutong.cn", "htcmcm.com", "reeji.com", "kuaipng.com", "gaoding.art", "jkapi.com", "jishixiezuo.com", "xiaojiyun.com", "4759.cn", "qqkkb.com", "softwarelove.cn", "nvdb.org.cn", "shaolinwushuxuexiao.com", "cdrckt.cn", "sosuoseo.com", "jtsg010.com", "senyuanfa.com", "gdhztc.cn", "forestsongbookstore.com", "qianlima.com", "58pic.com", "jia.com", "gucheng.com", "mfcad.com", "cnhnb.com", "thum.io", "gartic.io", "jkgq.top", "wc8.cn", "fuyejidi.com", "jimeng.jianying.com", "quququ.cn", "weikelink.com", "webpagetest.org", "liulihu.com", "ykinvestment.com", "wdybk.work", "softqq.com", "bandbbs.cn", "miegoat.club", "rubicforce.com", "nicsrs.com", "jypy.jyb.cn", "live.freebuf.com", "ysepan.com", "moefire.tech",
			  // AI工具/平台/产品(非博客)
  "openai.com", "chatgpt.com", "doubao.com", "dify.ai", "cursor.com", "siliconflow.cn", "kimi.moonshot.cn", "tiangong.cn", "n.cn", "minimaxi.com", "aitop100.cn", "aicpb.com", "aigc1024.com", "toolai.io", "aihero.dev", "idjpg.com", "jpghi.com", "bigmp4.com", "jpghd.com", "jpgrm.com", "pixelmax.art", "zeemo.ai", "veed.io", "meshy.ai", "lepton.ai", "together.ai", "funda.ai", "xingyun3d.com", "aitubiao.com", "logomaker.com.cn", "ubrand.com", "openailab.com", "shlab.org.cn", "ai.nejm.org", "storygenerator.cc", "unaimytext.com", "clicknow.ai", "gitmind.com", "aibct.com", "xiaohuokekeji.com", "1ai.net", "aitm.cn", "aijhw.com", "aidyz.cn", "reelmate.cn", "aigc.yizhentv.com", "upage.ai", "aicentre.cn", "aiyuzhou8.com", "aixzd.com", "aiminiatur.org", "veo3hub.ai", "rbq.ai", "roleai.chat", "espai.fun", "llmcms.org", "java2ai.com", "cordys.cn", "tomoviee.ai", "thispersondoesnotexist.com", "telepace.cc", "dboai.com", "aitom.cn", "qmye.com", "aigamer.cn", "aipmgo.com", "joysift.cn", "aieii.com", "bagbuddy.pages.dev", "ai-dr.tw", "kuai.com", "ai.logo123.com", "ai.ninesure.com",
			  // 其他非博客
  "iasociety.org", "dortmund-aikido.de", "g-sunrisepump.com", "nerds.airbnb.com", "samurai.inguardians.com", "mirai.mamoe.net", "noai.duckduckgo.com", "sekai.team", "fantastic-admin.hurui.me",
				  // 跨境建站/电商SaaS/ERP平台
  "shopify.com", "myshopify.com", "shopify.cn", "shoplineapp.com", "shopline.cn", "shoplazza.com", "shoplazza.cn", "shopyy.com", "shopyy.cn", "xshoppy.com", "shopbase.com", "shopbase.cn", "shoplus.com", "shoplus.cn", "meshop.com", "meshop.cn", "funpinpin.com", "funpinpin.cn", "2cshop.com", "dianxiaomi.com", "dianxiaomi.cn", "mabangerp.com", "tongtool.com", "lingxing.com", "lingxing.cn", "eccang.com", "eccang.cn", "jimiorder.com", "kuajingyan.com", "kjds.com", "4px.com", "dhlink.com", "cainiao.com", "global.cainiao.com", "afterpay.com", "pingpongx.com", "lianlianpay.com", "worldfirst.com", "worldfirst.com.cn", "payoneer.com", "airwallex.com", "xtransfer.com", "xtransfer.cn", "stripe.com", "checkout.com", "adyen.com",
  "xmuer.online", "caellab.com",
  "a5.cn", "admin5.com",
  "xqbn.com", "aiharmonium.com", "mousetester.xyz",
  "xtkyy.cc", "dranemotor.com",
  "800edu.net", "luoo.net", "pianke.me", "aboniu.com", "qng.im", "semorn.com", "arttz.net", "dorazzz.com", "shisanyue.com", "fting.cc", "joodaloop.com",
  "lockheedmartin.com", "esa.int", "redwirespace.com", "northropgrumman.com", "airbus.com", "spacefoundation.org", "iafastro.org", "tux-tage.de", "previousmagazine.com", "splitanatom.com", "theorioncorrelation.com", "wasistip.com", "crous-lorraine.fr", "parcoursup.gouv.fr",
  "18art.com", "weizixi.com", "shys.cc", "youhuaseo.com",
  "7e.hk", "badianyun.com", "150cn.com",
  "7asmr.net", "7171sm.com", "2021sm.net",
  "5u18.com", "ehwlx.com", "ixlzj.com", "boshivip.cn", "liuxueshengtutor.com", "yiyacht.com", "1v1edu.com.cn", "tailiuxue.com",
  "5song.xyz", "light4k.top",
  "5mku.com", "xiaoyang001.cc", "yiyang966.cc", "huyefz889.cc", "qtfzw666.cc", "999fzw.cc", "951u.cn",
  "edsq.top",
  "3nhxn.com", "ndjtichuang.com", "jayff.com", "jinma56.com", "deaoxi.com", "patsensor.com", "as-yq.com", "gaoguangpu.com", "yibeiic.com", "nongyaocanliu.com", "do3think.com", "nmsmj.com", "shjinwen.cn", "polymer-batterys.com", "espoly.com", "youleshebei666.com", "shshangyu.net", "gzhjhjkj.com", "pqyjy.com", "purplelavender.com.cn", "kejian-tech.com",
  "ip6.arpa",
  "3dstorrents.com", "gz-lianhe.com", "n562.com",
];
