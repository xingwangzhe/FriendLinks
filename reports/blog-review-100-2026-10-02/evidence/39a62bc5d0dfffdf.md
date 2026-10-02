# Fediring.net
Webring for fedizens
Welcome o/
This [webring](https://en.wikipedia.org/wiki/Webring) is for the personal sites of any member of the [fediverse](https://en.wikipedia.org/wiki/Fediverse) (also known as fedizens). Head towards the bottom of the page to see a [table of members](https://fediring.net/#table-of-members) or continue on to read the rules and how to join :)
## Membership Rules
We accept pretty much any site as long as the owner has an account on fedi. However, we do draw the line at…
  * Hate speech
  * Racism, sexism, any kind of bigotry
  * Advertisement-focused sites


As it is impossible to list _everything_ that would not be acceptable, we do reserve the right to deny requests. If you want to know whether your site is suitable for inclusion, send a plaintext email to the ticket tracker (address below) and we’ll take a look at it!
One of our requirements for joining is that you _must_ have an HTTPS (TLS encryption is required) site on a clearnet domain. Paths are acceptable, e.g. `sometilde.service/~username`, but _this_ webring is dedicated to clearnet, HTTPS sites. See our other *rings below for more platforms/protocols, such as Gemini.
We also tend not to accept fediverse accounts that were recently created or those that have very little activity. This is both an anti-spam measure and a quality assurance measure, as we want to fill the ring with a vibrant and active community of fediverse users.
## Joining
**First, add the fediring links to your site’s homepage** or to a location that is **easily found** by visitors to your site. Replace `YOURDOMAIN` with your site’s domain in the examples below:  
| Destination  | Link  |  
| --- | --- |  
| Previous member  | <https://fediring.net/previous?host=YOURDOMAIN>  |  
| Next member  | <https://fediring.net/next?host=YOURDOMAIN>  |  
| Home page  | <https://fediring.net>  |  
If you would like, you can also link to [fediring.net/random](https://fediring.net/random); it directs visitors to a random site in the ring. This one is optional though.
Here’s some example HTML for linking to the next and previous ring members.

```
[](https://fediring.net/#cb1-1)<p>
[](https://fediring.net/#cb1-2)    <a href="https://fediring.net/previous?host=example.com">←</a>
[](https://fediring.net/#cb1-3)    <a href="https://fediring.net/">Fediring</a>
[](https://fediring.net/#cb1-4)    <a href="https://fediring.net/next?host=example.com">→</a>
[](https://fediring.net/#cb1-5)</p>
```

It will look like this:
[←](https://fediring.net/previous?host=example.com) [Fediring](https://fediring.net/) [→](https://fediring.net/next?host=example.com)
If your site is on a _path_ rather than the root domain, you’ll need to URL-encode any special characters. For example, if Sam’s site is `sometilde.com/~sam`, she will need the following links on her page.
  * `https://fediring.net/next?host=sometilde.com%2F~sam`
  * `https://fediring.net/previous?host=sometilde.com%2F~sam`


After that, simply send a [plaintext email](https://useplaintext.email) to ~jbauer/fediring@todo.sr.ht (yes, that’s an email address) containing the following:
  * A link to your website
  * A link to your Fediverse account


This will create a new ticket in [our public issue tracker](https://todo.sr.ht/~jbauer/fediring) and notify maintainers so they can review it and get it added!
Please note that sites listed on the fediring _without_ the links above are subject to removal. Removing these links from your site breaks the ring and ruins the experience for everyone; if ring administrators traverse the ring and notice that the links have been removed, they’ll remove your site from the ring.
## Badges
One of the fediring members [contributed a badge](https://todo.sr.ht/~jbauer/fediring/322#event-250964)! Anyone is welcome to include this on their website in addition to the required links.
[![fediring badge](https://fediring.net/static/badges/1.gif)](https://fediring.net)
## Additional *rings
We also operate a [Gemini](https://geminiquickst.art/) ring that’s accessible over this same domain: [fediring.net](gemini://fediring.net).
If there’s interest, we might set up an Onionring for sites accessible over Tor, but we are unlikely to consider operating *rings for alternative protocols such as I2P, Freenet, Dat, Hypercore, etc.
## Table of members  
|  Fedi handle   |  Site   |  
| --- | --- |  
| @rand@port.mk  | [random.chars.jp](https://random.chars.jp)  |  
| @jbauer@merveilles.town  | [www.paritybit.ca](https://www.paritybit.ca)  |  
| @cnx@awkward.place  | [loang.net/~cnx](https://loang.net/~cnx)  |  
| @volpeon@mk.vulpes.one  | [volpeon.ink](https://volpeon.ink)  |  
| @puniko@mk.absturztau.be  | [absturztau.be](https://absturztau.be)  |  
| @blog@blog.gijsgobje.nl  | [blog.gijsgobje.nl](https://blog.gijsgobje.nl)  |  
| @cosminh@mastodon.social  | [cosmin.hume.ro](https://cosmin.hume.ro)  |  
| @bbbhltz@framapiaf.org  | [bobbyhiltz.com](https://bobbyhiltz.com)  |  
| @xarvos@outerheaven.club  | [xrvs.net](https://xrvs.net)  |  
| @flavigula@sonomu.club  | [flavigula.net](https://flavigula.net)  |  
| @joel@fosstodon.org  | [joelchrono.xyz](https://joelchrono.xyz)  |  
| @bob@epicyon.libreserver.org  | [libreserver.org](https://libreserver.org)  |  
| @jan_wagemakers@social.linux.pizza  | [www.janwagemakers.be](https://www.janwagemakers.be)  |  
| @dsyates@fosstodon.org  | [lottalinuxlinks.com](https://lottalinuxlinks.com)  |  
| @dusk@awoo.fai.st  | [dusk.fai.st](https://dusk.fai.st)  |  
| @babelcarp@social.tchncs.de  | [babelcarp.org](https://babelcarp.org)  |  
| @prijks@esgeroth.org  | [www.esgeroth.org](https://www.esgeroth.org)  |  
| @Wivik@fosstodon.org  | [blog.zedas.fr](https://blog.zedas.fr)  |  
| @klaatu@mastodon.xyz  | [gnuworldorder.info](https://gnuworldorder.info)  |  
| @rick@a.n0id.space  | [n0id.space](https://n0id.space)  |  
| @andrewkdinh@fosstodon.org  | [andrewkdinh.com](https://andrewkdinh.com)  |  
| @vulonkaaz@v2.flyingcube.tech  | [vulonkaaz.flyingcube.tech](https://vulonkaaz.flyingcube.tech)  |  
| @fristi@akkos.fritu.re  | [croc-monsieur.nl](https://croc-monsieur.nl)  |  
| @zachary@mastodon.online  | [zacharyzollman.com](https://zacharyzollman.com)  |  
| @maya@occult.institute  | [maya.land](https://maya.land)  |  
| @theo@soc.webair.xyz  | [webair.xyz](https://webair.xyz)  |  
| @lemon@udongein.xyz  | [tilde.team/~lemon](https://tilde.team/~lemon)  |  
| @yarmo@fosstodon.org  | [yarmo.eu](https://yarmo.eu)  |  
| @faehnrich@bsd.network  | [faehnri.ch](https://faehnri.ch)  |  
| @zweiblatt@tilde.zone  | [janw.name](https://janw.name)  |  
| @kura@hai.z0ne.social  | [kurabloodlust.eu](https://kurabloodlust.eu)  |  
| @pixouls@post.lurk.org  | [pixouls.xyz](https://pixouls.xyz)  |  
| @wandering_girl@tech.lgbt  | [wandering-girl.neocities.org](https://wandering-girl.neocities.org)  |  
| @Anselm@social.dev-wiki.de  | [blog.tfiu.de](https://blog.tfiu.de)  |  
| @crashserver@mamot.fr  | [crashserver.fr](https://crashserver.fr)  |  
| @xeras@stop.voring.me  | [xeras.codeberg.page](https://xeras.codeberg.page)  |  
| @jenett@mastodon.online  | [simply.jenett.org](https://simply.jenett.org)  |  
| @foxhkron@cybre.club  | [sigsegv.cc](https://sigsegv.cc)  |  
| @vegardskjefstad@mastodon.social  | [vegard.net](https://vegard.net)  |  
| @getimiskon@fedi.getimiskon.xyz  | [getimiskon.xyz](https://getimiskon.xyz)  |  
| @eslerm@mastodon.social  | [markesler.com](https://markesler.com)  |  
| @roytang@mastodon.technology  | [roytang.net](https://roytang.net)  |  
| @fkfd@eattherich.club  | [fkfd.me](https://fkfd.me)  |  
| @andre@abf.li  | [abf.li](https://abf.li)  |  
| @ru@fosstodon.org  | [rusingh.com](https://rusingh.com)  |  
| @polarhive@mastodon.social  | [polarhive.net](https://polarhive.net)  |  
| @obspogon@social.yesterweb.org  | [obspogon.neocities.org](https://obspogon.neocities.org)  |  
| @drwho@hackers.town  | [drwho.virtadpt.net](https://drwho.virtadpt.net)  |  
| @Gray@indieweb.social  | [graystea.neocities.org](https://graystea.neocities.org)  |  
| @dusnm@fosstodon.org  | [dusanmitrovic.xyz](https://dusanmitrovic.xyz)  |  
| @revi@old.sharlayan.city  | [revi.xyz](https://revi.xyz)  |  
| @hamefang@weirder.earth  | [hamefang.neocities.org](https://hamefang.neocities.org)  |  
| @folliehiyuki@fosstodon.org  | [www.folliehiyuki.com](https://www.folliehiyuki.com)  |  
| @kepic@mk.nixnet.social  | [kepic.win](https://kepic.win)  |  
| @melyanna@tilde.zone  | [tilde.club/~melyanna](https://tilde.club/~melyanna)  |  
| @alexandra@mk.nixnet.social  | [www.alm.website](https://www.alm.website)  |  
| @keith@anarchism.space  | [keithhacks.cyou](https://keithhacks.cyou)  |  
| @pfefferle@notiz.blog  | [notiz.blog](https://notiz.blog)  |  
| @Tika@stop.voring.me  | [pro.togen.xyz](https://pro.togen.xyz)  |  
| @sheepdev@sheepdev.xyz  | [sheepdev.xyz](https://sheepdev.xyz)  |  
| @EpicKitty@landofkittens.social  | [richardbowey.co.uk](https://richardbowey.co.uk)  |  
| @kescher@catcatnya.com  | [kescher.at](https://kescher.at)  |  
| @octo@mastodon.uno  | [sitoctt.octt.eu.org](https://sitoctt.octt.eu.org)  |  
| @kafazen@misskey.weebcouncil.online  | [cryptoschizo.club](https://cryptoschizo.club)  |  
| @natalie@prismst.one  | [mew151.net](https://mew151.net)  |  
| @murtezayesil@fosstodon.org  | [murtezayesil.me](https://murtezayesil.me)  |  
| @atlas@hollow.raccoon.quest  | [rightmouse.click](https://rightmouse.click)  |  
| @mcgillij@fosstodon.org  | [mcgillij.dev](https://mcgillij.dev)  |  
| @milofultz@merveilles.town  | [milofultz.com](https://milofultz.com)  |  
| @hkc@pl.salushnes.solutions  | [hatkidchan.is-a.dev](https://hatkidchan.is-a.dev)  |  
| @patrick@hatoya.cafe  | [patrickwu.space](https://patrickwu.space)  |  
| @Nhalrath@snug.moe  | [nhal.xyz](https://nhal.xyz)  |  
| @devious@fedi.tengu.space  | [tengu.space](https://tengu.space)  |  
| @bctnry@mastodon.social  | [sebastian.graphics](https://sebastian.graphics)  |  
| @Mirk0dex@social.linux.pizza  | [www.mirkodi.eu](https://www.mirkodi.eu)  |  
| @rnd@toot.cat  | [devurandom.xyz](https://devurandom.xyz)  |  
| @ilyamikcoder@md.ilyamikcoder.com  | [ilyamikcoder.com](https://ilyamikcoder.com)  |  
| @toranova@mastodon.social  | [toranova.xyz](https://toranova.xyz)  |  
| @networkexception@chaos.social  | [nwex.de](https://nwex.de)  |  
| @MystSaphyr@vocalounge.cafe  | [mystsaphyr.art](https://mystsaphyr.art)  |  
| @qugalet@m1e.space  | [quga.m0e.space](https://quga.m0e.space)  |  
| @kojote@sueden.social  | [silberkind.de](https://silberkind.de)  |  
| @mcdutchie@social.cybre.town  | [inlv.org](https://inlv.org)  |  
| @lain@ferretfrizz.biz  | [niles.xyz](https://niles.xyz)  |  
| @AnalogCyan@tech.lgbt  | [thayn.me](https://thayn.me)  |  
| @fuzzy@cathode.church  | [fuzzy.click](https://fuzzy.click)  |  
| @herbi@mstdn.social  | [herbimarquez.com](https://herbimarquez.com)  |  
| @vfcardoso@bolha.us  | [vfcardoso.dev](https://vfcardoso.dev)  |  
| @accordionpolar@indieweb.social  | [foreverliketh.is](https://foreverliketh.is)  |  
| @piuvas@eldritch.cafe  | [piuvas.net](https://piuvas.net)  |  
| @storydragon@dragonscave.space  | [storydragon.nl](https://storydragon.nl)  |  
| @njms@social.coop  | [njms.ca](https://njms.ca)  |  
| @rrix@notes.whatthefuck.computer  | [arcology.garden](https://arcology.garden)  |  
| @jacky@fedi.absturztau.be  | [yurifan.club/~jacky/](https://yurifan.club/~jacky/)  |  
| @freeplay@i.calckey.cloud  | [freeplay.codeberg.page](https://freeplay.codeberg.page)  |  
| @MagicLike@mstdn.social  | [magiclike.net](https://magiclike.net)  |  
| @LX862@wetdry.world  | [lx862.com](https://lx862.com)  |  
| @neeko@iko.pink  | [neeko.page](https://neeko.page)  |  
| @eorus@fosstodon.org  | [eorus.com](https://eorus.com)  |  
| @jackie@social.linux.pizza  | [jackiejude.me](https://jackiejude.me)  |  
| @kebokyo@plush.city  | [eleboog.com](https://eleboog.com)  |  
| @cjerrington@mstdn.social  | [claytonerrington.com](https://claytonerrington.com)  |  
| @cody@misskey.codingneko.com  | [codingneko.com](https://codingneko.com)  |  
| @den@indieweb.social  | [denmchenry.com](https://denmchenry.com)  |  
| @mjdxp@snowdin.town  | [mjdxp.neocities.org](https://mjdxp.neocities.org)  |  
| @darylsun@social.lol  | [blog.darylsun.page](https://blog.darylsun.page)  |  
| @colincogle@mastodon.social  | [colincogle.name](https://colincogle.name)  |  
| @ahappydeath@freeradical.zone  | [silbernagel.dev](https://silbernagel.dev)  |  
| @fresita@udongein.xyz  | [lavenderfield.xyz](https://lavenderfield.xyz)  |  
| @padraig@mastodon.ie  | [pf.ie](https://pf.ie)  |  
| @darekkay@fosstodon.org  | [darekkay.com](https://darekkay.com)  |  
| @Kurt@catcatnya.com  | [k00.eu](https://k00.eu)  |  
| @starbreaker@libranet.de  | [starbreaker.org](https://starbreaker.org)  |  
| @wakahuula@wetdry.world  | [kosta.lol](https://kosta.lol)  |  
| @Sugui@awoo.fai.st  | [sugui.fai.st](https://sugui.fai.st)  |  
| @kio@kitsunes.club  | [kio.moe](https://kio.moe)  |  
| @sapero@cathode.church  | [icosahedr.online](https://icosahedr.online)  |  
| @godteeth@gnu.gl  | [godteeth.com](https://godteeth.com)  |  
| @crmsnbleyd@hachyderm.io  | [tilde.club/~crmsnbleyd](https://tilde.club/~crmsnbleyd)  |  
| @u9000@farkascity.org  | [dj-chase.com](https://dj-chase.com)  |  
| @Elizafox@social.naln1.ca  | [elizafox.space](https://elizafox.space)  |  
| @tea@snug.moe  | [qtea.me](https://qtea.me)  |  
| @hertog@tech.lgbt  | [hertog.hermitcollective.net](https://hertog.hermitcollective.net)  |  
| @eniuu@101010.pl  | [eniuu.debil.club](https://eniuu.debil.club)  |  
| @gameplayervent@catcatnya.com  | [chimmie.k.vu](https://chimmie.k.vu)  |  
| @khalid@swecyb.com  | [khalid.se](https://khalid.se)  |  
| @jasm1nii@mas.to  | [jasm1nii.xyz](https://jasm1nii.xyz)  |  
| @Kovah@mastodon.social  | [kovah.de](https://kovah.de)  |  
| @andreatitolo@archaeo.social  | [archaeoramblings.com](https://archaeoramblings.com)  |  
| @admin@social.aleteoryx.me  | [aleteoryx.me](https://aleteoryx.me)  |  
| @gravitos@wetdry.world  | [alexgravitos.neocities.org](https://alexgravitos.neocities.org)  |  
| @paniash@mstdn.social  | [ashishpanigrahi.com](https://ashishpanigrahi.com)  |  
| @serxka@kitsunes.club  | [s.knao.net](https://s.knao.net)  |  
| @therwi@mk.therwi.net  | [therwi.net](https://therwi.net)  |  
| @kern@hol.ogra.ph  | [kersed.net](https://kersed.net)  |  
| @siriusfox@social.treehouse.systems  | [me.lil-bird.xyz](https://me.lil-bird.xyz)  |  
| @Cyborus@social.cartoon-aa.xyz  | [cyborus.xyz](https://cyborus.xyz)  |  
| @cyberfoxar@yiff.life  | [foxar.top](https://foxar.top)  |  
| @PeskyPotato@hachyderm.io  | [pesky.moe](https://pesky.moe)  |  
| @oracle@phantomthieves.net  | [loveshock.xyz](https://loveshock.xyz)  |  
| @mima@makai.chaotic.ninja  | [geidontei.chaotic.ninja/usr/mima](https://geidontei.chaotic.ninja/usr/mima)  |  
| @drekles@outerheaven.club  | [drekles.neocities.org](https://drekles.neocities.org)  |  
| @leggylav@packmates.org  | [lavender.chrysocyon.xyz](https://lavender.chrysocyon.xyz)  |  
| @dozens@tiny.tilde.website  | [tilde.town/~dozens](https://tilde.town/~dozens)  |  
| @sneexy@booping.synth.download  | [synth.download](https://synth.download)  |  
| @amycatgirl@wetdry.world  | [amycatgirl.nekoweb.org](https://amycatgirl.nekoweb.org)  |  
| @pietvanzoen@indieweb.social  | [piet.me](https://piet.me)  |  
| @nabi@den.raccoon.quest  | [nabikunyoi.com](https://nabikunyoi.com)  |  
| @arthropodorgy@mas.to  | [systemiccyclops.neocities.org](https://systemiccyclops.neocities.org)  |  
| @ruthalas@fosstodon.org  | [drippingquill.com](https://drippingquill.com)  |  
| @ivy@lethallava.land  | [randomivysaur.bearblog.dev](https://randomivysaur.bearblog.dev)  |  
| @charon@booping.synth.download  | [charon.monster](https://charon.monster)  |  
| @taafis@toot.cat  | [dyremyhr.no](https://dyremyhr.no)  |  
| @authenyo@wetdry.world  | [authenyo.xyz](https://authenyo.xyz)  |  
| @vhstape@lemmy.sdf.org  | [josephbellahcen.com](https://josephbellahcen.com)  |  
| @kit@m.tripulse.link  | [kerosyn.link](https://kerosyn.link)  |  
| @sierra@social.nouveau.community  | [casuallyblue.dev](https://casuallyblue.dev)  |  
| @karma@tech.lgbt  | [10kph.neocities.org](https://10kph.neocities.org)  |  
| @graphite@plasmatrap.com  | [gra.phite.ro](https://gra.phite.ro)  |  
| @corvidae@wetdry.world  | [corvidae.digital](https://corvidae.digital)  |  
| @win0err@pixelfed.social  | [kolesnikov.se](https://kolesnikov.se)  |  
| @jonah@mastodon.neat.computer  | [www.jonaharagon.com](https://www.jonaharagon.com)  |  
| @ezri@starry.cafe  | [ezri.pet](https://ezri.pet)  |  
| @nathanu@lounge.town  | [nathanupchurch.com](https://nathanupchurch.com)  |  
| @hdvalentin@rheinneckar.social  | [chillr.de](https://chillr.de)  |  
| @varve@weirder.earth  | [varve.neocities.org](https://varve.neocities.org)  |  
| @cage@bsd.cafe  | [autistici.org/interzona/](https://autistici.org/interzona/)  |  
| @chloe@slimegirl.social  | [chloe.vern.cc](https://chloe.vern.cc)  |  
| @lucylikeayourface@tech.lgbt  | [www.nbls.online](https://www.nbls.online)  |  
| @kanako@the.gayest.dev  | [gayest.dev](https://gayest.dev)  |  
| @luka@sonomu.club  | [luka.princic.studio](https://luka.princic.studio)  |  
| @privateger@plasmatrap.com  | [lattemacchiato.dev](https://lattemacchiato.dev)  |  
| @faoluin@chitter.xyz  | [faolu.in](https://faolu.in)  |  
| @Wi__Ro@fosstodon.org  | [rosia.me](https://rosia.me)  |  
| @randm@fosstodon.org  | [randm.website](https://randm.website)  |  
| @sylventic@mk.moth.zone  | [kyropy.neocities.org](https://kyropy.neocities.org)  |  
| @limepot@ouroboros.gay  | [limepot.xyz](https://limepot.xyz)  |  
| @anomalocaris@oldbytes.space  | [baccyflap.com](https://baccyflap.com)  |  
| @diederickdevries@mastodon.nl  | [thefoggiest.dev](https://thefoggiest.dev)  |  
| @ixhby@plasmatrap.com  | [garnix.dev](https://garnix.dev)  |  
| @max@wetdry.world  | [b0vik.dev](https://b0vik.dev)  |  
| @nootsponge@latex.monster  | [nootsponge.com](https://nootsponge.com)  |  
| @mrkod@mastodon.social  | [mrkod.eu.org](https://mrkod.eu.org)  |  
| @leap123@labyrinth.zone  | [leap123.neocities.org](https://leap123.neocities.org)  |  
| @bacardi55@social.bacardi55.io  | [bacardi55.io](https://bacardi55.io)  |  
| @vanten_s@fedi.vanten-s.com  | [vanten-s.com](https://vanten-s.com)  |  
| @mono@wetdry.world  | [monocyte.bearblog.dev](https://monocyte.bearblog.dev)  |  
| @kal_jan@dice.camp  | [jan.systems](https://jan.systems)  |  
| @toydragon@furry.energy  | [toydragon.xyz](https://toydragon.xyz)  |  
| @synte@social.toplap.org  | [syntelang.github.io](https://syntelang.github.io)  |  
| @bonealisa@infosec.town  | [dakotamarshall.net](https://dakotamarshall.net)  |  
| @oerrorpage@labyrinth.zone  | [oerrorpage.neocities.org](https://oerrorpage.neocities.org)  |  
| @enkiusz@is-a.cat  | [pop.fsck.pl](https://pop.fsck.pl)  |  
| @villepreux@mastodon.social  | [villepreux.net](https://villepreux.net)  |  
| @hedy@tilde.zone  | [home.hedy.dev](https://home.hedy.dev)  |  
| @oathboundfamiliar@akko.elysium.gay  | [stardust.elysium.gay](https://stardust.elysium.gay)  |  
| @pixel@desu.social  | [pixelde.su](https://pixelde.su)  |  
| @ulysia@derg.social  | [derg.cz](https://derg.cz)  |  
| @tommi@pan.rent  | [tommi.space](https://tommi.space)  |  
| @apocalypselog@app.wafrn.net  | [raven-files.neocities.org](https://raven-files.neocities.org)  |  
| @cascade@furry.engineer  | [cascading.space](https://cascading.space)  |  
| @phoebe@sunny.garden  | [phoebe.digital](https://phoebe.digital)  |  
| @tasiaiso@kitsunes.club  | [tilde.club/~tasiaiso](https://tilde.club/~tasiaiso)  |  
| @Maven@woem.men  | [maven.pages.gay](https://maven.pages.gay)  |  
| @askDNA@urusai.social  | [askdna.coffee](https://askdna.coffee)  |  
| @quite_adept@mas.to  | [quiteade.pt](https://quiteade.pt)  |  
| @kestral@hackers.town  | [tilde.green/~kestral](https://tilde.green/~kestral)  |  
| @trixter@retro.pizza  | [trixter.neocities.org](https://trixter.neocities.org)  |  
| @j@janerationx.social  | [janerationx.com](https://janerationx.com)  |  
| @caasn@caasn.de  | [caasn.de](https://caasn.de)  |  
| @larsfrommars@toot.garden  | [larsfrommars.neocities.org](https://larsfrommars.neocities.org)  |  
| @Jaredigital@mastodon.social  | [jaredigital.com](https://jaredigital.com)  |  
| @Soblow@eldritch.cafe  | [xaselgio.net](https://xaselgio.net)  |  
| @emnichtda@catcatnya.com  | [satzinger.services](https://satzinger.services)  |  
| @theresnotime@fox.nexus  | [theresnotime.co.uk](https://theresnotime.co.uk)  |  
| @sydney@tech.lgbt  | [syd.yt](https://syd.yt)  |  
| @wuppy@wetdry.world  | [transatlanticism.neocities.org](https://transatlanticism.neocities.org)  |  
| @tuxilio@toot.teckids.org  | [tuxilio.codeberg.page](https://tuxilio.codeberg.page)  |  
| @paddi@chaos.social  | [cryne.me](https://cryne.me)  |  
| @zorume@eldritch.cafe  | [rainbowgirl.neocities.org](https://rainbowgirl.neocities.org)  |  
| @yordi@social.lol  | [yordi.me](https://yordi.me)  |  
| @violets@tech.lgbt  | [violette.town](https://violette.town)  |  
| @vimproved@treehouse.systems  | [vimproved.dev](https://vimproved.dev)  |  
| @jak2k@mastodontech.de  | [jak2k.eu](https://jak2k.eu)  |  
| @Rowedahelicon@awoo.studio  | [rowedahelicon.com](https://rowedahelicon.com)  |  
| @lunahd@labyrinth.zone  | [lunahd.neocities.org](https://lunahd.neocities.org)  |  
| @nap@infosec.exchange  | [3r1c.net](https://3r1c.net)  |  
| @uroybd@fosstodon.org  | [utsob.me](https://utsob.me)  |  
| @gicorada@mastodon.uno  | [gicorada.is-a.dev](https://gicorada.is-a.dev)  |  
| @ThatGeekZen@yiff.life  | [zenthefox.online](https://zenthefox.online)  |  
| @lyrenhex@social.lyrenhex.com  | [lyrenhex.com](https://lyrenhex.com)  |  
| @helenchong@social.lol  | [helenchong.dev](https://helenchong.dev)  |  
| @CeruleanDerpo@wetdry.world  | [derpy.place](https://derpy.place)  |  
| @argentumcation@tech.lgbt  | [argentumcation.com](https://argentumcation.com)  |  
| @zakb@mountains.social  | [html-chunder.neocities.org](https://html-chunder.neocities.org)  |  
| @0x10f@tech.lgbt  | [qalle.neocities.org](https://qalle.neocities.org)  |  
| @derpyhoofs@equestria.social  | [cybr.gay](https://cybr.gay)  |  
| @23Sonics@evilfoundry.net  | [catwormdog.net](https://catwormdog.net)  |  
| @kc@social.coop  | [sus.fr](https://sus.fr)  |  
| @hako_aiko@blorbo.social  | [hako-aiko.haliya.net](https://hako-aiko.haliya.net)  |  
| @pquirrel@wetdry.world  | [pquirrel.neocities.org](https://pquirrel.neocities.org)  |  
| @writeblankspace@shonk.social  | [writeblankspace.netlify.app](https://writeblankspace.netlify.app)  |  
| @Leilukin@dragonscave.space  | [leilukin.com](https://leilukin.com)  |  
| @pdp8@social.pdp8.info  | [pdp8.info](https://pdp8.info)  |  
| @y0nei@mossycab.in  | [yonei.dev](https://yonei.dev)  |  
| @VasilisTheChu@tech.lgbt  | [pikachu.systems](https://pikachu.systems)  |  
| @psyolus@animal.business  | [wren.dog](https://wren.dog)  |  
| @daudix@wetdry.world  | [daudix.one](https://daudix.one)  |  
| @avidseeker@fosstodon.org  | [avidseeker.github.io](https://avidseeker.github.io)  |  
| @beeps@social.beeps.gay  | [beeps.website](https://beeps.website)  |  
| @guites@bolha.us  | [guites.dev](https://guites.dev)  |  
| @cmdr_nova@mkultra.monster  | [nova.mkultra.monster](https://nova.mkultra.monster)  |  
| @robbinespu@mastodon.radio  | [journal.robbi.my](https://journal.robbi.my)  |  
| @shetani@meow.social  | [shetani.carrd.co](https://shetani.carrd.co)  |  
| @evgandr@mas.to  | [eugene-andrienko.com/en/](https://eugene-andrienko.com/en/)  |  
| @badeline@transfem.social  | [badeline.codeberg.page](https://badeline.codeberg.page)  |  
| @drunkenmadman@aus.social  | [jasbro.io](https://jasbro.io)  |  
| @CodingOtaku@tech.lgbt  | [codingotaku.com](https://codingotaku.com)  |  
| @yunii@woem.men  | [netcat.systems](https://netcat.systems)  |  
| @midnasapphire@yiff.life  | [midnavixi.neocities.org](https://midnavixi.neocities.org)  |  
| @760ceb3b9c0ba4872cadf3ce35a7a4@wetdry.world  | [760ceb3b9c0ba4872cadf3ce35a7a494.neocities.org](https://760ceb3b9c0ba4872cadf3ce35a7a494.neocities.org)  |  
| @thermia@sk.girlthi.ng  | [girlthi.ng/~thermia](https://girlthi.ng/~thermia)  |  
| @ross@rossabaker.com  | [rossabaker.com](https://rossabaker.com)  |  
| @ivy@cutie.city  | [ivytime.gay](https://ivytime.gay)  |  
| @darkwitchclaire@plush.city  | [catwitch.gay](https://catwitch.gay)  |  
| @sirlan@derg.social  | [dragon-vi.be](https://dragon-vi.be)  |  
| @tombofnull@voidwood.online  | [tombofnull.art](https://tombofnull.art)  |  
| @logzinga@gyatt.cc  | [logzinga.com](https://logzinga.com)  |  
| @jessienab@wetdry.world  | [jessie.nabein.me](https://jessie.nabein.me)  |  
| @foxglove@evil.social  | [catnurse.neocities.org](https://catnurse.neocities.org)  |  
| @awoo@gts.apicrim.es  | [wolfyja.de](https://wolfyja.de)  |  
| @tht@mstdn.social  | [theholytachanka.com](https://theholytachanka.com)  |  
| @melody@mk.moth.zone  | [meluhdy.dev](https://meluhdy.dev)  |  
| @notsludgebomb@labyrinth.zone  | [notsludgebomb.neocities.org](https://notsludgebomb.neocities.org)  |  
| @MOULE@moule.world  | [moule.world](https://moule.world)  |  
| @benjae@merping.synth.download  | [sillydomain.name](https://sillydomain.name)  |  
| @hexadecimal_dinosaur  | [ivyfanchiang.ca](https://ivyfanchiang.ca)  |  
| @mixtape@nham.co.uk  | [nham.co.uk](https://nham.co.uk)  |  
| @SecretDeal@bandwagon.fm  | [secretde.al](https://secretde.al)  |  
| @moonydev@tech.lgbt  | [moonydev.xyz](https://moonydev.xyz)  |  
| @hexaitos@squawk.social  | [hexaitos.com](https://hexaitos.com)  |  
| @soop@wetdry.world  | [hypersoop.codeberg.page](https://hypersoop.codeberg.page)  |  
| @punishedbernadetta@tech.lgbt  | [detta.dev](https://detta.dev)  |  
| @bpt11@mastodon.social  | [bpt11.neocities.org](https://bpt11.neocities.org)  |  
| @sugar@sylveon.social  | [sugar.pages.gay](https://sugar.pages.gay)  |  
| @thoofan@urusai.social  | [thoofan.neocities.org](https://thoofan.neocities.org)  |  
| @MxPoesu@mastodon.art  | [mxpoesu.github.io](https://mxpoesu.github.io)  |  
| @zoug@infosec.exchange  | [zoug.fr](https://zoug.fr)  |  
| @antares@shitposter.world  | [antares.neocities.org/](https://antares.neocities.org/)  |  
| @Clygro@labyrinth.zone  | [clygro.cc](https://clygro.cc)  |  
| @abmurrow@hachyderm.io  | [abmurrow.com](https://abmurrow.com)  |  
| @PseudoCube@shitpost.poridge.club  | [pseudocube.neocities.org](https://pseudocube.neocities.org)  |  
| @root@isopod.zone  | [isopod.cool](https://isopod.cool)  |  
| @pebble@critter.cafe  | [pebble.pet](https://pebble.pet)  |  
| @axionyx@nanotrasen.zone  | [axionyx.sh](https://axionyx.sh)  |  
| @mauro@mograph.social  | [mauromotion.com](https://mauromotion.com)  |  
| @PukaMuriska@mastodon.art  | [puka-muriska.neocities.org](https://puka-muriska.neocities.org)  |  
| @juniper@packmates.org  | [juniperfox.org](https://juniperfox.org)  |  
| @withoutwyatt@wetdry.world  | [www.opencodespace.org](https://www.opencodespace.org)  |  
| @null@ice.0xportal.social  | [0xportal.dev](https://0xportal.dev)  |  
| @vv0ltz@pawb.fun  | [vv0ltz.neocities.org](https://vv0ltz.neocities.org)  |  
| @glyph@cyberpunk.gay  | [glyph555.neocities.org](https://glyph555.neocities.org)  |  
| @fluoriteByte@labyrinth.zone  | [fluoritebyte.neocities.org](https://fluoritebyte.neocities.org)  |  
| @Nyght@gram.social  | [nyght.neocities.org](https://nyght.neocities.org)  |  
| @trinkey@trinkey.com  | [trinkey.com](https://trinkey.com)  |  
| @pancakes@meow.company  | [pancakes.gay](https://pancakes.gay)  |  
| @dracoling@firetribe.org  | [dracol.ing](https://dracol.ing)  |  
| @rausgerufen@loma.ml  | [rausgerufen.de](https://rausgerufen.de)  |  
| @shreyansdoshi@infosec.exchange  | [shreyansdoshi.com](https://shreyansdoshi.com)  |  
| @steadygaze@mstdn.social  | [steadygaze.me](https://steadygaze.me)  |  
| @breebee@packmates.org  | [breebee.zooey.cc](https://breebee.zooey.cc)  |  
| @skullgamer205@shitpost.poridge.club  | [skullgamer205.neocities.org](https://skullgamer205.neocities.org)  |  
| @jp@lowkey.zone  | [moddedbear.com](https://moddedbear.com)  |  
| @duanin2@friendica.world  | [duanin2.top](https://duanin2.top)  |  
| @0x4d6165@wanderingwires.net  | [0x4d6165.wanderingwires.net](https://0x4d6165.wanderingwires.net)  |  
| @sylvia@social.lol  | [sylvia.studio](https://sylvia.studio)  |  
| @xan@kitsunes.club  | [xan.lol](https://xan.lol)  |  
| @balint@mastodon.social  | [balintmagyar.com](https://balintmagyar.com)  |  
| @metaphor@todon.eu  | [musing.ispretty.fyi](https://musing.ispretty.fyi)  |  
| @MECHAGIC@lemmy.blahaj.zone  | [mechagic.pages.gay](https://mechagic.pages.gay)  |  
| @alanmena@mastodont.cat  | [anthr.net](https://anthr.net)  |  
| @cassiecandles@pixelfed.social  | [cassiecandles.net](https://cassiecandles.net)  |  
| @tinikov@o3o.ca  | [blog.tinikov.com](https://blog.tinikov.com)  |  
| @bugwhisperer@tech.lgbt  | [bugwhisperer.dev](https://bugwhisperer.dev)  |  
| @livingevil@loma.ml  | [mevil.de](https://mevil.de)  |  
| @morihofi@furry.engineer  | [fuxle.net](https://fuxle.net)  |  
| @verdemusgo@colorid.es  | [verdemusgo.neocities.org/](https://verdemusgo.neocities.org/)  |  
| @horibyte@wetdry.world  | [horibyte.is-a.dev](https://horibyte.is-a.dev)  |  
| @w3teal@fosstodon.org  | [w3teal.is-a.dev](https://w3teal.is-a.dev)  |  
| @Koehr@mstdn.io  | [koehr.ing](https://koehr.ing)  |  
| @xander@fusil.uk  | [fusil.uk/?ring](https://fusil.uk/?ring)  |  
| @mxu@fosstodon.org  | [marsuribe.net](https://marsuribe.net)  |  
| @dex1@cyberplace.social  | [dex1.codeberg.page](https://dex1.codeberg.page)  |  
| @psi36@mas.to  | [psi36.neocities.org](https://psi36.neocities.org)  |  
| @pastel_skies@woof.tech  | [pastel-skies.nekoweb.org](https://pastel-skies.nekoweb.org)  |  
| @AuntyRed@aus.social  | [caffeineandlasers.com/](https://caffeineandlasers.com/)  |  
| @clyron@wetdry.world  | [avery.is-a.dev](https://avery.is-a.dev)  |  
| @libadwaita@outerheaven.club  | [april.nekoweb.org/](https://april.nekoweb.org/)  |  
| @pogmommy@pogmom.me  | [pogmom.me](https://pogmom.me)  |  
| @77nn@goto.77nn.it  | [77nn.it](https://77nn.it)  |  
| @sparkles@ck.catwithaclari.net  | [sparkles.getconfigured.net](https://sparkles.getconfigured.net)  |  
| @moftasa@mastodon.online  | [moftasa.net](https://moftasa.net)  |  
| @moonlit@fedi.whyarentyou.gay  | [whyarentyou.gay](https://whyarentyou.gay)  |  
| @miguelmaiquez@mastodon.social  | [miguelmaiquez.com](https://miguelmaiquez.com)  |  
| @linky@blorbo.social  | [linkyblog.neocities.org](https://linkyblog.neocities.org)  |  
| @small_cypress@indieweb.social  | [smallcypress.neocities.org](https://smallcypress.neocities.org)  |  
| @ayo@ayco.io  | [ayo.ayco.io](https://ayo.ayco.io)  |  
| @elw@mastodon.sdf.org  | [elw.sdf.org](https://elw.sdf.org)  |  
| @cat@kitsunes.club  | [hummdudel.de](https://hummdudel.de)  |  
| @Houl@wetdry.world  | [houl.floof.company](https://houl.floof.company)  |  
| @liv@quack.social  | [liv.town](https://liv.town)  |  
| @marmar22@plasmatrap.com  | [marmar22.tilde.team](https://marmar22.tilde.team)  |  
| @nanobot567@techhub.social  | [nanobot567.codeberg.page](https://nanobot567.codeberg.page)  |  
| @sprite@limezone.riflesniper.art  | [riflesniper.art](https://riflesniper.art)  |  
| @EatingHawaiianP1zza@meow.social  | [eatinghawaiianp1zza.neocities.org](https://eatinghawaiianp1zza.neocities.org)  |  
| @darkcat09@dc09.ru  | [dc09.ru](https://dc09.ru)  |  
| byte21516@chaos.social  | [byte21516.xyz/about/about.html](https://byte21516.xyz/about/about.html)  |  
| @camelia@tech.lgbt  | [camelia.dev](https://camelia.dev)  |  
| @alatartheblue@polymaths.social  | [n1cck.us](https://n1cck.us)  |  
| @nadia@raru.re  | [nadia.moe](https://nadia.moe)  |  
| @kernelle@0d.gs  | [martijn.sh](https://martijn.sh)  |  
| @caeruleus657@masto.es  | [zurdala.es](https://zurdala.es)  |  
| @maya@catgirl.global  | [atomicmaya.me](https://atomicmaya.me)  |  
| @blogissimo@rheinneckar.social  | [blogissimo.de](https://blogissimo.de)  |  
| @alexzeecomedy@mastodon.social  | [alexzeecomedy.com](https://alexzeecomedy.com)  |  
| @jelloeater@mastodon.social  | [jelloeater.me](https://jelloeater.me)  |  
| @PrivateNoob@sopuli.xyz  | [privatenoob.top](https://privatenoob.top)  |  
| @erin@kvuzet.net  | [kvuzet.net](https://kvuzet.net)  |  
| @fox@bark.lgbt  | [foxo.dev](https://foxo.dev)  |  
| @andrewshell@indieweb.social  | [blog.andrewshell.org](https://blog.andrewshell.org)  |  
| @axxuy@pony.social  | [axxuy.com/blog](https://axxuy.com/blog)  |  
| @halfy@half-shot.uk  | [half-shot.uk](https://half-shot.uk)  |  
| @mambuco@wetdry.world  | [mambuco.dev](https://mambuco.dev)  |  
| @luna@fedi.mldchan.dev  | [mldchan.dev](https://mldchan.dev)  |  
| @austin@mstdn.party  | [austinhuang.me](https://austinhuang.me)  |  
| @dills_world@mastodon.social  | [dill64.com](https://dill64.com)  |  
| @ilyess@mastodon.online  | [ilye.ss](https://ilye.ss)  |  
| @cobb@dice.camp  | [cobb.land](https://cobb.land)  |  
| @garden@kitsunes.club  | [system.grdnsys.no](https://system.grdnsys.no)  |  
| @jansenspott@ruhr.social  | [jansens-pott.de](https://jansens-pott.de)  |  
| @sparklepanic@infosec.exchange  | [ravenwinters.org](https://ravenwinters.org)  |  
| @maya@catgirl.global  | [index.551724.dev](https://index.551724.dev)  |  
| @5225225@furry.engineer  | [www.5snb.club](https://www.5snb.club)  |  
| @moonsea@omg.sayitditto.net  | [eunoia.sayitditto.net](https://eunoia.sayitditto.net)  |  
| @lime360@floofy.tech  | [yoyle.city](https://yoyle.city)  |  
| @charlotte@akko.chir.rs  | [lotte.chir.rs](https://lotte.chir.rs)  |  
| @irgndsondepp@gts.da-miez.de  | [schafe-sind-bessere-rasenmaeher.de](https://schafe-sind-bessere-rasenmaeher.de)  |  
| @fp32@wuffi.es  | [riverfox.neocities.org](https://riverfox.neocities.org)  |  
| @maira@mairamartins.com  | [mairamartins.com](https://mairamartins.com)  |  
| @22mahmoud@fosstodon.org  | [mahmoudashraf.dev](https://mahmoudashraf.dev)  |  
| @hollie@social.coop  | [hollie.eilloh.net](https://hollie.eilloh.net)  |  
| @nall@dook.business  | [binturo.ng](https://binturo.ng)  |  
| @sanana@kolektiva.social  | [rawr.fun](https://rawr.fun)  |  
| @miz@b1-66er.ru  | [b1-66er.ru](https://b1-66er.ru)  |  
| @HisVirusness@mastodon.social  | [hisvirusness.com](https://hisvirusness.com)  |  
| @huggles@furry.engineer  | [foxes.systems](https://foxes.systems)  |  
| @pfriedma@pfedi.pfriedma.org  | [pfriedma.org](https://pfriedma.org)  |  
| @pulkomandy@mastodon.tetaneutral.net  | [pulkomandy.tk](https://pulkomandy.tk)  |  
| @lily@ice.floofy.city  | [lilymeow.ing](https://lilymeow.ing)  |  
| @lainalien@jorts.horse  | [lainalien.space](https://lainalien.space)  |  
| @tapeykatt@chitter.xyz  | [tapeykatt.neocities.org](https://tapeykatt.neocities.org)  |  
| @mystie@fuzzies.wtf  | [mystie.dev](https://mystie.dev)  |  
| @hutchie@mast.hutchie.scot  | [hutchie.scot](https://hutchie.scot)  |  
| @flann@boosts.squirrel.pictures  | [this.squirrel.rocks](https://this.squirrel.rocks)  |  
| @cyberseckyle@infosec.exchange  | [www.kylereddoch.me](https://www.kylereddoch.me)  |  
| @jorgesanz@mapstodon.space  | [jorgesanz.net](https://jorgesanz.net)  |  
| @jb@waf.moe  | [jbc.lol](https://jbc.lol)  |  
| @sampsa@blogi.social  | [sampsa.fun](https://sampsa.fun)  |  
| @stfn@fedi.stfn.pl  | [stfn.pl](https://stfn.pl)  |  
| @zlendy@social.zlendy.com  | [zlendy.com](https://zlendy.com)  |  
| @rhyswynne@toot.wales  | [rhyswynne.co.uk](https://rhyswynne.co.uk)  |  
| @tuvik@feral.cafe  | [tuvik-dog.xyz](https://tuvik-dog.xyz)  |  
| @onlinegoddess@mastodonapp.uk  | [onlinegoddess.net](https://onlinegoddess.net)  |  
| @ephemeromorph@topspicy.social  | [sludge.town](https://sludge.town)  |  
| @bmariusz@mastodon.sdf.org  | [qbrack.me](https://qbrack.me)  |  
| @foxscribe@woof.tech  | [foxscribe.ru](https://foxscribe.ru)  |  
| @gianmarcogg03@mastodon.uno  | [gianmarco.gg](https://gianmarco.gg)  |  
| @me@social.k3can.us  | [blog.k3can.us](https://blog.k3can.us)  |  
| @eclecticpassions@fosstodon.org  | [burgeonlab.com](https://burgeonlab.com)  |  
| @miclgael@hachyderm.io  | [michaelgale.dev](https://michaelgale.dev)  |  
| @amt@mk.ametic.ovh  | [ametic.ovh](https://ametic.ovh)  |  
| @shtrom@piaille.fr  | [blog.narf.ssji.net](https://blog.narf.ssji.net)  |  
| @tr1x_em@mastodon.social  | [trix.is-a.dev](https://trix.is-a.dev)  |  
| @kalayo@hol.ogra.ph  | [kamingawan.nekoweb.org](https://kamingawan.nekoweb.org)  |  
| @jar@blob.cat  | [jarema.me](https://jarema.me)  |  
| @dertizen@mastodon.social  | [njbraun.de](https://njbraun.de)  |  
| @mtk_@mastodon.social  | [mtk.bearblog.dev](https://mtk.bearblog.dev)  |  
| @brennan@social.lol  | [brennan.day](https://brennan.day)  |  
| @regal@yiff.life  | [cobra.monster](https://cobra.monster)  |  
| @SouthFox@foxsay.southfox.me  | [blog.southfox.me](https://blog.southfox.me)  |  
| @frasermclean@mastodon.social  | [frasermclean.com](https://frasermclean.com)  |  
| @li@social.lol  | [prry.uk](https://prry.uk)  |  
| @president@occult.club  | [ghostk.id](https://ghostk.id)  |  
| @Baa@mk.absturztau.be  | [baabaa.blog](https://baabaa.blog)  |  
| @JadedBlueEyes@tech.lgbt  | [jade.ellis.link](https://jade.ellis.link)  |  
| @kate@is.beeping.pet  | [beeping.pet](https://beeping.pet)  |  
| @sz@catcatnya.com  | [estela.moe](https://estela.moe)  |  
| @proliecan@chaos.social  | [www.proliecan.com](https://www.proliecan.com)  |  
| @innocentzero@mastodon.social  | [innocentzero.is-a.dev/ring.html](https://innocentzero.is-a.dev/ring.html)  |  
| @applevlux@tech.lgbt  | [applevlux.com](https://applevlux.com)  |  
| @mini@owo.cafe  | [dospuntostr.es](https://dospuntostr.es)  |  
| @adrian@tyrol.social  | [adriankuntner.com](https://adriankuntner.com)  |  
| @rohitfarmer@fosstodon.org  | [rohitfarmer.com](https://rohitfarmer.com)  |  
| @shinysquirrel@lemmy.dbzer0.com  | [shinysquirrel.neocities.org](https://shinysquirrel.neocities.org)  |  
| @xavierhm@vozer.cafe  | [xavierhm.com](https://xavierhm.com)  |  
| @ceres@blahaj.ceressees.dev  | [ceressees.dev](https://ceressees.dev)  |  
| @bengidoom@zirk.us  | [hypersubject.net](https://hypersubject.net)  |  
| @dtptr@cubnuuy.net  | [dtptr.nekoweb.org](https://dtptr.nekoweb.org)  |  
| @tay@tech.lgbt  | [eth0fox.net](https://eth0fox.net)  |  
| @sigmasternchen@comfy.social  | [not-a-catgirl.online](https://not-a-catgirl.online)  |  
| @graveyardpaws@cyberpunk.lol  | [graveyardpaws.web.fc2.com](https://graveyardpaws.web.fc2.com)  |  
| @swirly@uwu.social  | [swirly.moe](https://swirly.moe)  |  
| @dee@mice.tel  | [puteri.ng](https://puteri.ng)  |  
| @funkylevi@app.wafrn.net  | [funkylevi.nekoweb.org](https://funkylevi.nekoweb.org)  |  
| @itwasntme223@social.epic-worlds.com  | [epic-worlds.com](https://epic-worlds.com)  |  
| @BongoTwisty@vivaldi.net  | [www.bongotwisty.blog](https://www.bongotwisty.blog)  |  
| @luvan@mamot.fr  | [www.luvan.org/betenoire](https://www.luvan.org/betenoire)  |  
| @KD3CPY@mastodon.radio  | [kd3cpy.github.io](https://kd3cpy.github.io)  |  
| @maid@plasmatrap.com  | [ayanami.nekoweb.org](https://ayanami.nekoweb.org)  |  
| @schmookey@mastodon.social  | [schmookey.xyz](https://schmookey.xyz)  |  
| @computer@glamour.ovh  | [computer.glamour.ovh](https://computer.glamour.ovh)  |  
| @clouderst@abc.clouderst.xyz  | [clouderst.xyz](https://clouderst.xyz)  |  
| @russ@mastodon.russecke.net  | [russecke.net](https://russecke.net)  |  
| @fynnley@zerv.al  | [zerv.al](https://zerv.al)  |  
| @wieerwill@chaos.social  | [wieerwill.dev](https://wieerwill.dev)  |  
| @Firesphere@cloudisland.nz  | [firesphere.dev](https://firesphere.dev)  |  
| @bearthatcodes@toot.wales  | [bearthatcodes.uk](https://bearthatcodes.uk)  |  
| @naln1@ak.angelstrapped.com  | [naln1.ca](https://naln1.ca)  |  
| @edphones@fosstodon.org  | [edleeman.co.uk](https://edleeman.co.uk)  |  
| @MarySeph@scicomm.xyz  | [maryseph.com](https://maryseph.com)  |  
| @pixelroiber@federation.network  | [pixelroiber.de](https://pixelroiber.de)  |  
| @adiaz@social.lol  | [fullmetalbrackets.com](https://fullmetalbrackets.com)  |  
| @KentNavalesi@mstdn.social  | [kentnavalesi.neocities.org](https://kentnavalesi.neocities.org)  |  
| @yogurtwrong@lemmy.world  | [aesistril.com](https://aesistril.com)  |  
| @melkyway@critters.gay  | [mtnliom.neocities.org](https://mtnliom.neocities.org)  |  
| @cinnamon@mk.absturztau.be  | [cinnamon.is-a-cute.cat](https://cinnamon.is-a-cute.cat)  |  
| @TopazRabbit@oldbytes.space  | [topazrabbit.com](https://topazrabbit.com)  |  
| @jotten@rheinneckar.social  | [jotten.neocities.org](https://jotten.neocities.org)  |  
| @maverick@fd.mrmave.work  | [mrmave.work](https://mrmave.work)  |  
| @ikimatiq@mastodon.social  | [ikimatiq.net](https://ikimatiq.net)  |  
| @LonM@vivaldi.net  | [lemcgregor.scot](https://lemcgregor.scot)  |  
| @trogluur@social.linux.pizza  | [www.thijmer.nl](https://www.thijmer.nl)  |  
| @gijs@post.hillenius.net  | [hillenius.net](https://hillenius.net)  |  
| @isellsoap@mastodon.social  | [isellsoap.net](https://isellsoap.net)  |  
| @radi0dev@plrm.radi0.cc  | [self.radi0.cc](https://self.radi0.cc)  |  
| @crabbypup@cosocial.ca  | [crabby.vellas.ca](https://crabby.vellas.ca)  |  
| @rndxelement@mastodon.social  | [rndxelement.de](https://rndxelement.de)  |  
| @emanuelegori@mastodon.uno  | [emanuelegori.uno](https://emanuelegori.uno)  |  
| @artfors@mastodon.social  | [artfors.se](https://artfors.se)  |  
| @unattributed@gotosocial.social  | [unattributed.cc](https://unattributed.cc)  |  
| @unattributed@gotosocial.social  | [ennui-vagaries.cc](https://ennui-vagaries.cc)  |  
| @hohokam@mastodon.sdf.org  | [whoishohokam.com](https://whoishohokam.com)  |  
| @holloway@mastodon.art  | [holloway-web.de](https://holloway-web.de)  |  
| @mkf@functional.cafe  | [a.mikf.pl](https://a.mikf.pl)  |  
| @ulveon@derg.social  | [ulveon.net](https://ulveon.net)  |  
| @FQQD@chaos.social  | [fqqd.de](https://fqqd.de)  |  
| @rail@flufftech.net  | [flufftech.net](https://flufftech.net)  |  
| @koehn@famichiki.jp  | [nheok.com](https://nheok.com)  |  
| @carlux@puntarella.party  | [carlux.mataroa.blog](https://carlux.mataroa.blog)  |  
| @sebastian@jittr.click  | [sebsite.pw](https://sebsite.pw)  |  
| @nleanba@tech.lgbt  | [nleanba.ch](https://nleanba.ch)  |  
| @lxak@goblin.technology  | [lxak.net](https://lxak.net)  |  
| @blakasmoko@blorbo.social  | [smokoswebzone.gay](https://smokoswebzone.gay)  |  
| @rintyuu@tachyon.rintyuu.dev  | [rintyuu.uk](https://rintyuu.uk)  |  
| @AlbertUnruh@tech.lgbt  | [albertunruh.de](https://albertunruh.de)  |  
| @BritishKoalaTea@social.coop  | [quantumtea.com](https://quantumtea.com)  |  
| @unattributed@hub.vocalcat.com  | [cerebralrift.cc](https://cerebralrift.cc)  |  
| @someguysblog@mastodon.social  | [someguysblog.net](https://someguysblog.net)  |  
| @teslasp2@mstdn.social  | [teslasp2.com](https://teslasp2.com)  |  
| @Willow@translunar.academy  | [willow.al](https://willow.al)  |  
| @martinkubler@mastodon.nu  | [martinkubler.com](https://martinkubler.com)  |  
| @kaybarkbark@furry.engineer  | [dogthoughts.link](https://dogthoughts.link)  |  
| @michael@hoosier.social  | [michaelkovacs.social](https://michaelkovacs.social)  |  
| @theaitch@hachyderm.io  | [www.codedge.de](https://www.codedge.de)  |  
| @naturbrilian@sakurajima.social  | [naturbrilian.nekoweb.org](https://naturbrilian.nekoweb.org)  |  
| tk@f.kawa-kun.com  | [wf.kawa-kun.com](https://wf.kawa-kun.com)  |  
| @owlcode@fosstodon.org  | [www.owlcode.eu](https://www.owlcode.eu)  |  
| @sushantmondal@mastodon.social  | [sushantmondal.com](https://sushantmondal.com)  |  
| @moep@moep.social  | [themoep.de](https://themoep.de)  |  
## Contributing
  * Source for the website: [~jbauer/fediring.net](https://git.sr.ht/~jbauer/fediring.net)
  * Source for the backend: [~jbauer/go-webring](https://git.sr.ht/~jbauer/go-webring)
  * Source for search.fediring.net: [cblgh/lieu](https://github.com/cblgh/lieu)


## Changelog
### 2024-07-21
  * Add note about new/inactive fediverse accounts


### 2023-08-16
  * Add [badge contribution](https://todo.sr.ht/~jbauer/fediring/322#event-250964) from TheCozyCat
  * Remove “link location” instruction to reduce confusion


### 2022-07-30
  * Indicate that plaintext emails are required and link to [useplaintext.email](https://useplaintext.email) to help with configuration
  * Switch source Markdown to primarily use referential links to improve readability


### 2022-05-16
  * Clarified that fediring links must be on the site’s homepage
  * Mentioned the `/random` feature for directing visitors to random sites in the ring
  * Removed the cute fediring at Craftplacer’s request


