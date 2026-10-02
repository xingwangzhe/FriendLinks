[Thought is free](https://thk.kanzae.net/)
自由な思考で語ろう
  * [ホーム](https://thk.kanzae.net/)
  * [ブログ記事](https://thk.kanzae.net/entries/)
  * [Web ツールズ](https://thk.kanzae.net/web-tools/)
    * [HTML エンティティ変換](https://thk.kanzae.net/web-tools/html-entity/)
    * [URL エンコード・デコード](https://thk.kanzae.net/web-tools/url-enc-dec/)
    * [画像をBase64に変換](https://thk.kanzae.net/web-tools/base64/)
  * [プロフィール](https://thk.kanzae.net/profile/)
    * [プロフィール](https://thk.kanzae.net/profile/)
    * [A Gain Sierra](https://again.lunaclear.com/)
    * [Webサイト](https://thk.kanzae.net/profile/site/)
  * [WordPress テーマ](https://thk.kanzae.net/wp/)
  * [アクセス解析](https://thk.kanzae.net/analytics/)


  * __
  * __
メニュー
  * __
サイドバー
  * __
前へ 
  * __
次へ 
  * __
検索
  * __
インストール


  1. __[ホーム](https://thk.kanzae.net/) _>_
  2. __[PC・ネット関連](https://thk.kanzae.net/category/net/) _>_
  3. __[IT・ICT](https://thk.kanzae.net/category/net/itc/)


# [改訂版] .htaccess の見直しでWebページ高速化
__ 2015年10月23日
  * [Twitter](https://twitter.com/intent/tweet?text=%5B%E6%94%B9%E8%A8%82%E7%89%88%5D%20.htaccess%20%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97%E3%81%A7Web%E3%83%9A%E3%83%BC%E3%82%B8%E9%AB%98%E9%80%9F%E5%8C%96%20%7C%20Thought%20is%20free&url=https://thk.kanzae.net/net/itc/t2286/ "Tweet")
  * [Facebook](https://www.facebook.com/sharer/sharer.php?u=https://thk.kanzae.net/net/itc/t2286/&t=%5B%E6%94%B9%E8%A8%82%E7%89%88%5D%20.htaccess%20%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97%E3%81%A7Web%E3%83%9A%E3%83%BC%E3%82%B8%E9%AB%98%E9%80%9F%E5%8C%96%20%7C%20Thought%20is%20free "Share on Facebook")
  * Pin it
  * [_B!_ Hatena](https://b.hatena.ne.jp/add?mode=confirm&url=https://thk.kanzae.net/net/itc/t2286/&title=%5B%E6%94%B9%E8%A8%82%E7%89%88%5D%20.htaccess%20%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97%E3%81%A7Web%E3%83%9A%E3%83%BC%E3%82%B8%E9%AB%98%E9%80%9F%E5%8C%96%20%7C%20Thought%20is%20free "Bookmark at Hatena")
  * [Pocket](https://getpocket.com/edit?url=https://thk.kanzae.net/net/itc/t2286/ "Pocket: Read it Later")
  * [LINE](https://lineit.line.me/share/ui?url=https://thk.kanzae.net/net/itc/t2286/#/ "ラインで送る")
  * [LINE](https://line.me/R/msg/text/?%5B%E6%94%B9%E8%A8%82%E7%89%88%5D%20.htaccess%20%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97%E3%81%A7Web%E3%83%9A%E3%83%BC%E3%82%B8%E9%AB%98%E9%80%9F%E5%8C%96%20%7C%20Thought%20is%20free%0D%0Ahttps://thk.kanzae.net/net/itc/t2286/ "ラインで送る")
  * Copy


![Gtmetrix 98点 89点](https://thk.kanzae.net/wp-content/uploads/2015/10/gtmetrix-98-89.png)
現在の当ブログのトップページの [GTmetrix](http://gtmetrix.com/) の解析結果です。
[改訂前の記事](https://thk.kanzae.net/net/itc/t1544/)から、かなり点数落ちてますが、  
原因は、Google Adsense 貼り始めたからですｗ （以前は貼ってなかった）
まぁ、そこそこの結果だと思います。
以前の記事から、追加・訂正したバージョンの .htaccess です。
## .htaccess

```
# ETags(Configure entity tags) を無視する設定
<ifModule mod_headers.c>
    Header unset ETag
</ifModule>
FileETag None

# Enable Keep-Alive を設定
<IfModule mod_headers.c>
    Header set Connection keep-alive
</IfModule>

# MIME Type 追加
<IfModule mime_module>
    AddType text/cache-manifest .appcache
    AddType image/x-icon .ico
    AddType image/svg+xml .svg
    AddType application/x-font-ttf .ttf
    AddType application/x-font-woff .woff
    AddType application/x-font-woff2 .woff2
    AddType application/x-font-opentype .otf
    AddType application/vnd.ms-fontobject .eot
</IfModule>

# プロクシキャッシュの設定（画像とフォントをキャッシュ）
<IfModule mod_headers.c>
    <FilesMatch "\.(ico|jpe?g|png|gif|svg|swf|pdf|ttf|woff|woff2|otf|eot)$">
        Header set Cache-Control "max-age=604800, public"
    </FilesMatch>
    # プロキシサーバーが間違ったコンテンツを配布しないようにする
    Header append Vary Accept-Encoding env=!dont-vary
</IfModule>

# ブラウザキャッシュの設定
<IfModule mod_headers.c>
<ifModule mod_expires.c>
    ExpiresActive On

    # キャッシュ初期化（1秒に設定）
    ExpiresDefault "access plus 1 seconds"

    # MIME Type ごとの設定
    ExpiresByType text/css "access plus 1 weeks"
    ExpiresByType text/js "access plus 1 weeks"
    ExpiresByType text/javascript "access plus 1 weeks"
    ExpiresByType image/gif "access plus 1 weeks"
    ExpiresByType image/jpeg "access plus 1 weeks"
    ExpiresByType image/png "access plus 1 weeks"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/pdf "access plus 1 weeks"
    ExpiresByType application/javascript "access plus 1 weeks"
    ExpiresByType application/x-javascript "access plus 1 weeks"
    ExpiresByType application/x-shockwave-flash "access plus 1 weeks"
    ExpiresByType application/x-font-ttf "access plus 1 year"
    ExpiresByType application/x-font-woff "access plus 1 year"
    ExpiresByType application/x-font-woff2 "access plus 1 year"
    ExpiresByType application/x-font-opentype "access plus 1 year"
    ExpiresByType application/vnd.ms-fontobject "access plus 1 year"
</IfModule>
</IfModule>

# Gzip圧縮の設定
<IfModule mod_deflate.c>
    SetOutputFilter DEFLATE

    # 古いブラウザでは無効
    BrowserMatch ^Mozilla/4\.0[678] no-gzip
    BrowserMatch ^Mozilla/4 gzip-only-text/html
    BrowserMatch \bMSIE\s(7|8) !no-gzip !gzip-only-text/html

    # 画像など圧縮済みのコンテンツは再圧縮しない
    SetEnvIfNoCase Request_URI \.(?:gif|jpe?g|png|ico|eot|woff|woff2)$ no-gzip dont-vary

    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/js
    AddOutputFilterByType DEFLATE image/svg+xml
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/atom_xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/x-httpd-php
    AddOutputFilterByType DEFLATE application/x-font-ttf
    AddOutputFilterByType DEFLATE application/x-font-opentype
</IfModule>
```

Apache Configuration
Copy
## 前回の記事からの追加・訂正部分
[前回の記事](https://thk.kanzae.net/net/itc/t1544/)からの追加・訂正は下記の通りです。
### woff2 拡張子のフォントの MIME Type と キャッシュ設定を追加
前回の記事から抜け落ちてた・・・orz
[Simplicity](http://wp-simplicity.com/) では、当サイトの .htaccess を採用していただいてるが、  
Simplicity も woff2 ファイルを使用しているので、Simplicity 使ってる方も書き換え推奨。
### eot、woff、woff2 は Gzip の再圧縮をしないように変更
フォントファイルの eot、woff、woff2 の 3つは、  
独自アルゴリズムで、すでに圧縮されてるので、Gzip 圧縮から除外。
### Header append Vary Accept-Encoding env=!dont-vary  
の書き位置がおかしかったので修正
<IfModule mod_headers.c> と別の場所に書いてあった・・・orz
Apache は mod_headers がデフォルトで入ってるので、  
問題はないのだが、変な場所に書いてあると気持ち悪いので修正。
#### 追記
前回の記事の最後に書いた、HTML5 の ApplicationCache インターフェースに関しては、  
また別記事で、書きます・・・
スポンサーリンク
__[IT・ICT](https://thk.kanzae.net/category/net/itc/)
__ Posted by [るな](https://thk.kanzae.net/profile/)
* * *
![QR Code | Thought is free](https://api.qrserver.com/v1/create-qr-code/?size=data=74x74&data=https%3A%2F%2Fthk.kanzae.net%2Fnet%2Fitc%2Ft2286%2F&format=png&qzone=2&bgcolor=ffec67)
## よろしければシェアお願いします
  * [Twitter __](https://twitter.com/intent/tweet?text=%5B%E6%94%B9%E8%A8%82%E7%89%88%5D%20.htaccess%20%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97%E3%81%A7Web%E3%83%9A%E3%83%BC%E3%82%B8%E9%AB%98%E9%80%9F%E5%8C%96%20%7C%20Thought%20is%20free&url=https://thk.kanzae.net/net/itc/t2286/ "Tweet")
  * [Facebook5](https://www.facebook.com/sharer/sharer.php?u=https://thk.kanzae.net/net/itc/t2286/&t=%5B%E6%94%B9%E8%A8%82%E7%89%88%5D%20.htaccess%20%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97%E3%81%A7Web%E3%83%9A%E3%83%BC%E3%82%B8%E9%AB%98%E9%80%9F%E5%8C%96%20%7C%20Thought%20is%20free "Share on Facebook")
  * Pin it0
  * [_B!_ Hatena18](https://b.hatena.ne.jp/add?mode=confirm&url=https://thk.kanzae.net/net/itc/t2286/&title=%5B%E6%94%B9%E8%A8%82%E7%89%88%5D%20.htaccess%20%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97%E3%81%A7Web%E3%83%9A%E3%83%BC%E3%82%B8%E9%AB%98%E9%80%9F%E5%8C%96%20%7C%20Thought%20is%20free "Bookmark at Hatena")
  * [Pocket25](https://getpocket.com/edit?url=https://thk.kanzae.net/net/itc/t2286/ "Pocket: Read it Later")
  * [LINE _Send_](https://lineit.line.me/share/ui?url=https://thk.kanzae.net/net/itc/t2286/#/ "ラインで送る")
  * [LINE _Send_](https://line.me/R/msg/text/?%5B%E6%94%B9%E8%A8%82%E7%89%88%5D%20.htaccess%20%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97%E3%81%A7Web%E3%83%9A%E3%83%BC%E3%82%B8%E9%AB%98%E9%80%9F%E5%8C%96%20%7C%20Thought%20is%20free%0D%0Ahttps://thk.kanzae.net/net/itc/t2286/ "ラインで送る")
  * Copy-


[![](https://thk.kanzae.net/wp-content/uploads/2015/10/wordpress-up-eye-100x100.png)WordPress の P は絶対大文字じゃないとダメらしい __ Next ](https://thk.kanzae.net/net/wordpress/t2311/)
[![](https://thk.kanzae.net/wp-content/uploads/2015/10/analytics101-eye-100x100.png)無料 高機能アクセス解析 THK Analytics ver1.03 リリース __ Prev ](https://thk.kanzae.net/dev/thkanalytics/t2279/)
## こちらの記事もどうぞ
##  __ 関連記事
[![Google Adsense](https://thk.kanzae.net/wp-content/uploads/2015/10/google-ads-eye-100x100.png)](https://thk.kanzae.net/net/itc/t5061/)
### [Google Adsense の広告上限撤廃って本当なのかなぁ？](https://thk.kanzae.net/net/itc/t5061/)
近頃、Google Adsense の広告上限（1ページあたり3個まで）が撤廃さ ...
[![No Image](https://thk.kanzae.net/wp-content/themes/luxeritas/images/no-img-100x100.png)](https://thk.kanzae.net/net/itc/t2892/)
### [PHP5.6 で作ったプログラムが PHP5.3 で動かなくてハマったこと](https://thk.kanzae.net/net/itc/t2892/)
PHP5.6 で作ったプログラムを PHP5.3 の環境に移して、 正常に動作す ...
[![Thumbnail of related posts 138](https://thk.kanzae.net/wp-content/uploads/2015/01/android-iphone-100x100.png)](https://thk.kanzae.net/net/wordpress/t863/)
### [CSS3のベンダープリフィックス、まだまだ必要だなと思った](https://thk.kanzae.net/net/wordpress/t863/)
Wordpress のテーマは Simplicity を使わせていただいてる。 ...
[![Thumbnail of related posts 039](https://thk.kanzae.net/wp-content/uploads/2015/01/url-enc-dec-100x100.png)](https://thk.kanzae.net/net/itc/t1264/)
### [Web ツールズのページを追加](https://thk.kanzae.net/net/itc/t1264/)
主に自分用ですが、 「HTML エンティティ変換」と「URL エンコード/デコー ...
[![Thumbnail of related posts 061](https://thk.kanzae.net/wp-content/uploads/2016/09/yu-font-i-100x100.png)](https://thk.kanzae.net/net/itc/t4800/)
### [游ゴシックで、何故、こんなにも文字がかすれるのか](https://thk.kanzae.net/net/itc/t4800/)
Windows8.1 から Windows の標準フォントになった「游」 最新型 ...
## ディスカッション
### コメント一覧
  1. ![](https://secure.gravatar.com/avatar/a43cf89b5ec2b8db79f1fad7ba7343a37f2375bc04886a4edb9309c214be9c3e?s=55&d=mm&r=g)1234より:
[2021年10月12日 13:37](https://thk.kanzae.net/net/itc/t2286/#comment-584)
# MIME Type 追加
mime_module.cでも良いでしょうか
[返信](https://thk.kanzae.net/net/itc/t2286/?replytocom=584#respond)
     * ![](https://secure.gravatar.com/avatar/5af1de737595a16b19204824a1adc1788b3f0abd87c89cfe0f3479cd17bc4f99?s=55&d=mm&r=g)るなより:
[2021年10月13日 05:45](https://thk.kanzae.net/net/itc/t2286/#comment-586)
1234 さん。
mime_module.c ではなく、mime_module か mod_mime.c のどちらかです。
[返信](https://thk.kanzae.net/net/itc/t2286/?replytocom=586#respond)


###  __ ピンバック & トラックバック一覧
  1. [Simplicityコピペ高速化に成功！コード文字化けに気を付けるべし。 - ばぶじろ.com](https://babujiro.com/simplicity-speed/)より:
[2017年10月13日 10:20](https://thk.kanzae.net/net/itc/t2286/#comment-327)
[…] 参考２ [改訂版] .htaccess の見直しでWebページ高速化 […]
  2. [速くなった！[コピペ一発]simplicity2＋Wordpress＋ロリポップの高速化](http://iirou.com/rightplan)より:
[2017年7月30日 07:02](https://thk.kanzae.net/net/itc/t2286/#comment-310)
[…] ココにあるコードを追記して保存。 […]
  3. [【Simplicity2】読み込み遅い？ブログ表示速度の高速化にチャレンジ！【WordPress】](http://queseraselife.com/wordpress-speedup/)より:
[2017年6月12日 17:05](https://thk.kanzae.net/net/itc/t2286/#comment-294)
[…] 参考［改訂版］.htaccess の見直しでWebページ高速化 […]
  4. [Simplicityを導入する際にやっておきたいページ表示速度への対応 | アミノサンドロス](https://aminoacidros.com/archives/90)より:
[2017年6月9日 12:56](https://thk.kanzae.net/net/itc/t2286/#comment-290)
[…] ・「.htaccess」のエディター画面が表示されるので、この記事に記載されているを丸々コピペします。 ちなみに「mod_rewrite.c」セクションが初期からあったので、それはそのままにして、 […]
  5. [このサイトのWordPressに入れたプラグイン（Simplicity2使用）](https://python357.xyz/wordpress-plugin-simplicity2/)より:
[2017年6月5日 15:43](https://thk.kanzae.net/net/itc/t2286/#comment-289)
[…] [改訂版] .htaccess の見直しでWebページ高速化 | Thought is free現在の当ブログのトップページの GTmetrix の解析結果です。 改訂前の記事から、かなり点数落ちてますが、 原因は、Google Adsense 貼 […]
  6. [PageSpeed Insights で53点、poor（貧弱）って言われてしまった。。。](https://python357.xyz/pagespeed-insights-poor/)より:
[2017年5月23日 16:54](https://thk.kanzae.net/net/itc/t2286/#comment-284)
[…] [改訂版] .htaccess の見直しでWebページ高速化 | Thought is free現在の当ブログのトップページの GTmetrix の解析結果です。 改訂前の記事から、かなり点数落ちてますが、 原因は、Google Adsense 貼り始めたからですｗ （以前は貼ってなかった） …thk.kanzae.net […]
  7. [初心者でもWordPressの高速化できた！](http://seo.eri5.com/2017/04/18/wordpress02/)より:
[2017年4月18日 20:26](https://thk.kanzae.net/net/itc/t2286/#comment-273)
[…] Thought is free.さんのコードを一番下のページをそのまま埋め込み、必要なところだけ自分のサイトに当てはまる物に書き換えました。 あ、一番下というか「# END WordPress」の前に入れまし […]
  8. [simplicity2を高速化してみた](http://it-seikatsu.info/blog_manage/post-324/)より:
[2017年3月15日 16:29](https://thk.kanzae.net/net/itc/t2286/#comment-258)
[…] [改訂版] .htaccess の見直しでWebページ高速化 […]
  9. [Simplicity2：サイトが重いと感じた時に、高速化する方法](http://wpwith.net/2017/03/13/post-487/)より:
[2017年3月13日 22:44](https://thk.kanzae.net/net/itc/t2286/#comment-257)
[…] https://thk.kanzae.net/net/itc/t2286/ […]
  10. [コピペ一発Simplicity高速化のGoogle PageSpeed Insightsでの測定結果 - Blogging Life](https://blogging-life.com/post-870/)より:
[2017年1月24日 09:43](https://thk.kanzae.net/net/itc/t2286/#comment-248)
[…] [改訂版] .htaccess の見直しでWebページ高速化 | Thought is free現在の当ブログのトップページの GTmetrix の解析結果です。 改訂前の記事から、かなり点数落ちてますが、 原因は、Google Adsense 貼り始めたからですｗ （以前は貼ってなかった） …thk.kanzae.net […]
  11. [無料サーバーから独自ドメイン+レンタルサーバーへ - 是々流々](https://zezeruru.net/post-563/)より:
[2016年12月5日 11:51](https://thk.kanzae.net/net/itc/t2286/#comment-224)
[…] .htaccess の見直しでWebページ高速化 […]
  12. [この『四つ這いおとな』のテーマ、『Simplicity』の作者の「わいひら」さんに、僕が勝手に親近感を持っている理由 - 四つ這いおとな](https://yotubaiotona.net/2016/04/02/%e3%81%93%e3%81%ae%e3%80%8e%e5%9b%9b%e3%81%a4%e9%80%99%e3%81%84%e3%81%8a%e3%81%a8%e3%81%aa%e3%80%8f%e3%81%ae%e3%83%86%e3%83%bc%e3%83%9e%e3%80%81simplicity%e3%81%ae%)より:
[2016年11月20日 18:10](https://thk.kanzae.net/net/itc/t2286/#comment-214)
[…] [改訂版] .htaccess の見直しでWebページ高速化 | Thought is free現在の当ブログのトップページの GTmetrix の解析結果です。 改訂前の記事から、かなり点数落ちてますが、 原因は、Google Adsense 貼り始めたからですｗ （以前は貼ってなかった） &thk.kanzae.net […]
  13. [.htaccessに追加するだけで「最速化」できる素敵なコード | 放課後の教室](http://websitebuild.academy.jp/blog/blog-aswellasfast/)より:
[2015年12月9日 09:44](https://thk.kanzae.net/net/itc/t2286/#comment-59)
[…] 評価が一気に改善されます。詳細は、下記の記事に記載されています。 [改訂版] .htaccess の見直しでWebページ高速化 開発者ブログで紹介された「ブラウザキャッシュ＋リソース圧縮＋画 […]
  14. [お手軽にWordPressの高速化ができると聞いて.htaccessの設定変更と画像圧縮できるプラグイン『EWWW Image Optimizer 』を導入してみた。](http://roppay.com/2015/11/simplicity_speed.html)より:
[2015年11月11日 20:01](https://thk.kanzae.net/net/itc/t2286/#comment-43)
[…] で、高速化になっているかどうかをGTmetrixで確認してみた。 […]


### コメントをどうぞ [コメントをキャンセル](https://thk.kanzae.net/net/itc/t2286/#respond)
メールアドレスが公開されることはありません。※ が付いている欄は必須項目です
当ブログは配布物（Luxeritas / THK Analytics 等）を紹介していることがありますが、これらの配布物とは関係のないブログです。各配布物に関する質問や要望は各公式ページでお願いします。
コメント
名前 *
メールアドレス *
ウェブサイト
次回のコメントで使用するためブラウザーに自分の名前、メールアドレス、サイトを保存する。
This site is protected by reCAPTCHA and the Google [Privacy Policy](https://policies.google.com/privacy) and [Terms of Service](https://policies.google.com/terms) apply.
###  __ この記事のトラックバックURL
### フォローする
  * [](https://twitter.com/LunaNuko "Twitter")
  * [](https://www.facebook.com/626532647468557 "Facebook")
  * [](https://www.youtube.com/channel/UCBLI7Wrr7iKCz_7t31wimzQ "YouTube")
  * [__](https://thk.kanzae.net/feed/ "RSS")
  * [](https://feedly.com/index.html#subscription/feed/https%3A%2F%2Fthk.kanzae.net%2Ffeed%2F "Feedly")

  
|   
 |   | [×](javascript:void\(0\) "検索ボックスをクリア")  |  
| --- | --- |  
| 検索  |   |  
ウェブ
画像  
|   |  並べ替え Relevance Date  |  
| --- | --- |  
詳細を見る
スクリプト言語
外国語資料
コンテンツ管理
### このカテゴリーの最新記事
[![](https://thk.kanzae.net/wp-content/uploads/2019/07/alt-hogehoge-i-150x150.png)画像の alt 属性の書き方](https://thk.kanzae.net/net/itc/t11199/)[![縦書きレスポンシブ](https://thk.kanzae.net/wp-content/uploads/2019/07/tategaki-i-150x150.png)縦書き CSS をレスポンシブ対応させる方法](https://thk.kanzae.net/net/itc/t11244/)[![Font Awesome 5](https://thk.kanzae.net/wp-content/uploads/2018/04/fontawesome5-i-150x150.png)Font Awesome 5 Free を擬似要素(before・after)の content で表示する時は font-weight を 400 か 900 かを明示しないとアカン](https://thk.kanzae.net/net/itc/t8727/)[![コアサーバーの phpinfo の値（その１）](https://thk.kanzae.net/wp-content/uploads/2017/12/coreserver-memory-limit-150x150.png)CORESERVER の PHP 設定値がなんか微妙に変なんだよなぁ](https://thk.kanzae.net/net/itc/t8136/)[![Test My Site with Google のイメージ画像](https://thk.kanzae.net/wp-content/uploads/2017/07/testmysite-top-i-150x150.png)Test My Site with Google で色んな大手サイトを計測してみた](https://thk.kanzae.net/net/itc/t7312/)[![Test My Site with Google](https://thk.kanzae.net/wp-content/uploads/2017/07/testmysite-i-150x150.png)Google の新モバイル速度測定サービス Test My Site with Google やってみた](https://thk.kanzae.net/net/itc/t7288/)[![](https://thk.kanzae.net/wp-content/uploads/2017/07/waifu2x-i-150x150.png)waifu2x-caffe：キレイに画像を拡大 waifu2x の Windows 版](https://thk.kanzae.net/net/itc/t7259/)[![XAMPP + ModSecurity](https://thk.kanzae.net/wp-content/uploads/2017/07/xampp-mod-security-i-150x150.png)XAMPP に ModSecurity（WAF）を導入する手順メモ](https://thk.kanzae.net/net/itc/t7194/)[![I've got it !](https://thk.kanzae.net/wp-content/uploads/2017/07/ive-got-it-i-150x150.png)SEO で気がつきにくい点。背景に画像を使っている場合。](https://thk.kanzae.net/net/itc/t7141/)[![カラーパレット](https://thk.kanzae.net/wp-content/uploads/2017/06/color-palette-i-150x150.png)PHP で背景色に対して見えやすい文字色は白か黒かを判別する](https://thk.kanzae.net/net/itc/t7110/) [![](https://thk.kanzae.net/wp-content/uploads/2019/07/alt-hogehoge-i-150x150.png)画像の alt 属性の書き方](https://thk.kanzae.net/net/itc/t11199/) [![縦書きレスポンシブ](https://thk.kanzae.net/wp-content/uploads/2019/07/tategaki-i-150x150.png)縦書き CSS をレスポンシブ対応させる方法](https://thk.kanzae.net/net/itc/t11244/) [![Font Awesome 5](https://thk.kanzae.net/wp-content/uploads/2018/04/fontawesome5-i-150x150.png)Font Awesome 5 Free を擬似要素(before・after)の content で表示する時は font-weight を 400 か 900 かを明示しないとアカン](https://thk.kanzae.net/net/itc/t8727/) [![コアサーバーの phpinfo の値（その１）](https://thk.kanzae.net/wp-content/uploads/2017/12/coreserver-memory-limit-150x150.png)CORESERVER の PHP 設定値がなんか微妙に変なんだよなぁ](https://thk.kanzae.net/net/itc/t8136/) [![Test My Site with Google のイメージ画像](https://thk.kanzae.net/wp-content/uploads/2017/07/testmysite-top-i-150x150.png)Test My Site with Google で色んな大手サイトを計測してみた](https://thk.kanzae.net/net/itc/t7312/) [![Test My Site with Google](https://thk.kanzae.net/wp-content/uploads/2017/07/testmysite-i-150x150.png)Google の新モバイル速度測定サービス Test My Site with Google やってみた](https://thk.kanzae.net/net/itc/t7288/) [![](https://thk.kanzae.net/wp-content/uploads/2017/07/waifu2x-i-150x150.png)waifu2x-caffe：キレイに画像を拡大 waifu2x の Windows 版](https://thk.kanzae.net/net/itc/t7259/) [![XAMPP + ModSecurity](https://thk.kanzae.net/wp-content/uploads/2017/07/xampp-mod-security-i-150x150.png)XAMPP に ModSecurity（WAF）を導入する手順メモ](https://thk.kanzae.net/net/itc/t7194/) [![I've got it !](https://thk.kanzae.net/wp-content/uploads/2017/07/ive-got-it-i-150x150.png)SEO で気がつきにくい点。背景に画像を使っている場合。](https://thk.kanzae.net/net/itc/t7141/) [![カラーパレット](https://thk.kanzae.net/wp-content/uploads/2017/06/color-palette-i-150x150.png)PHP で背景色に対して見えやすい文字色は白か黒かを判別する](https://thk.kanzae.net/net/itc/t7110/)[![](https://thk.kanzae.net/wp-content/uploads/2019/07/alt-hogehoge-i-150x150.png)画像の alt 属性の書き方](https://thk.kanzae.net/net/itc/t11199/)[![縦書きレスポンシブ](https://thk.kanzae.net/wp-content/uploads/2019/07/tategaki-i-150x150.png)縦書き CSS をレスポンシブ対応させる方法](https://thk.kanzae.net/net/itc/t11244/)[![Font Awesome 5](https://thk.kanzae.net/wp-content/uploads/2018/04/fontawesome5-i-150x150.png)Font Awesome 5 Free を擬似要素(before・after)の content で表示する時は font-weight を 400 か 900 かを明示しないとアカン](https://thk.kanzae.net/net/itc/t8727/)[![コアサーバーの phpinfo の値（その１）](https://thk.kanzae.net/wp-content/uploads/2017/12/coreserver-memory-limit-150x150.png)CORESERVER の PHP 設定値がなんか微妙に変なんだよなぁ](https://thk.kanzae.net/net/itc/t8136/)[![Test My Site with Google のイメージ画像](https://thk.kanzae.net/wp-content/uploads/2017/07/testmysite-top-i-150x150.png)Test My Site with Google で色んな大手サイトを計測してみた](https://thk.kanzae.net/net/itc/t7312/)[![Test My Site with Google](https://thk.kanzae.net/wp-content/uploads/2017/07/testmysite-i-150x150.png)Google の新モバイル速度測定サービス Test My Site with Google やってみた](https://thk.kanzae.net/net/itc/t7288/)[![](https://thk.kanzae.net/wp-content/uploads/2017/07/waifu2x-i-150x150.png)waifu2x-caffe：キレイに画像を拡大 waifu2x の Windows 版](https://thk.kanzae.net/net/itc/t7259/)[![XAMPP + ModSecurity](https://thk.kanzae.net/wp-content/uploads/2017/07/xampp-mod-security-i-150x150.png)XAMPP に ModSecurity（WAF）を導入する手順メモ](https://thk.kanzae.net/net/itc/t7194/)[![I've got it !](https://thk.kanzae.net/wp-content/uploads/2017/07/ive-got-it-i-150x150.png)SEO で気がつきにくい点。背景に画像を使っている場合。](https://thk.kanzae.net/net/itc/t7141/)[![カラーパレット](https://thk.kanzae.net/wp-content/uploads/2017/06/color-palette-i-150x150.png)PHP で背景色に対して見えやすい文字色は白か黒かを判別する](https://thk.kanzae.net/net/itc/t7110/)  
2026年10月  
| 日  | 月  | 火  | 水  | 木  | 金  | 土  |  
| --- | --- | --- | --- | --- | --- | --- |  
|   | 1  | 2  | 3  |  
| 4  | 5  | 6  | 7  | 8  | 9  | 10  |  
| 11  | 12  | 13  | 14  | 15  | 16  | 17  |  
| 18  | 19  | 20  | 21  | 22  | 23  | 24  |  
| 25  | 26  | 27  | 28  | 29  | 30  | 31  |  
[« 11月](https://thk.kanzae.net/date/2023/11/)
### カテゴリー
  * [PC・ネット関連 (102)](https://thk.kanzae.net/category/net/)
    * [IT・ICT (49)](https://thk.kanzae.net/category/net/itc/)
    * [Windows (9)](https://thk.kanzae.net/category/net/windows/)
    * [Linux (1)](https://thk.kanzae.net/category/net/linux/)
    * [WordPress (51)](https://thk.kanzae.net/category/net/wordpress/)
  * [開発 (346)](https://thk.kanzae.net/category/dev/)
    * [WordPress テーマ (325)](https://thk.kanzae.net/category/dev/wp-themes/)
      * [Luxeritas (250)](https://thk.kanzae.net/category/dev/wp-themes/luxeritas/)
      * [WpTHK (83)](https://thk.kanzae.net/category/dev/wp-themes/wpthk/)
    * [THK Analytics (21)](https://thk.kanzae.net/category/dev/thkanalytics/)
  * [その他 (36)](https://thk.kanzae.net/category/etc/)
    * [雑記 (29)](https://thk.kanzae.net/category/etc/note/)
    * [近況 (3)](https://thk.kanzae.net/category/etc/lately/)
    * [お知らせ (4)](https://thk.kanzae.net/category/etc/info/)


  * [A Gain Sierra](https://again.lunaclear.com/)
  * [WordPress テーマ](https://thk.kanzae.net/wp/)
  * [アクセス解析](https://thk.kanzae.net/analytics/)
  * [サイトマップ](https://thk.kanzae.net/sitemap/)


#### 新着記事
[![Luxeritas 3.25.0](https://thk.kanzae.net/wp-content/uploads/2023/11/luxe-3.25.0-i-100x100.png)](https://thk.kanzae.net/dev/wp-themes/luxeritas/t14176/)
[WP 6.4.1 対応 Luxeritas 3.25.0](https://thk.kanzae.net/dev/wp-themes/luxeritas/t14176/)
Luxeritas 3.25.0 をリリース。 WordPress 6.4.x ...
[![Luxeritas 3.24.0](https://thk.kanzae.net/wp-content/uploads/2023/08/luxe-3.24.0-i-100x100.png)](https://thk.kanzae.net/dev/wp-themes/luxeritas/t14149/)
[WP 6.3 対応、簡体中文、X対応等 Luxeritas 3.24.0](https://thk.kanzae.net/dev/wp-themes/luxeritas/t14149/)
Luxeritas 3.24.0 リリース。 変更点はおおよそ表題の通り。Wor ...
[![Luxeritas 3.23.3](https://thk.kanzae.net/wp-content/uploads/2023/03/luxe-3.23.3-i-100x100.png)](https://thk.kanzae.net/dev/wp-themes/luxeritas/t14111/)
[WP 6.2 対応 ＆ ブラジルポルトガル語対応 Luxeritas 3.23.3](https://thk.kanzae.net/dev/wp-themes/luxeritas/t14111/)
Luxeritas 3.23.3 リリース。 WordPress 6.2 への対 ...
[![Thumbnail of new posts 196](https://thk.kanzae.net/wp-content/uploads/2022/11/luxe-3.23.2-i-100x100.png)](https://thk.kanzae.net/dev/wp-themes/luxeritas/t14103/)
[WP 6.1 で AMP エラー出るので修正 Luxeritas 3.23.2](https://thk.kanzae.net/dev/wp-themes/luxeritas/t14103/)
もうしばらくは療養予定（頚椎症性神経根症のため）だけど、取り急ぎ WP 6.1 ...
[![Luxeritas 3.23.1](https://thk.kanzae.net/wp-content/uploads/2022/10/luxe-3.23.1-i-100x100.png)](https://thk.kanzae.net/dev/wp-themes/luxeritas/t14083/)
[PHP 8.1 対応 Luxeritas 3.23.1 ](https://thk.kanzae.net/dev/wp-themes/luxeritas/t14083/)
Luxeritas 3.23.1 をリリース。 PHP 8.1 で Deprec ...
#### アーカイブ
アーカイブ 月を選択 2023年11月  2023年8月  2023年3月  2022年11月  2022年10月  2022年6月  2022年5月  2022年2月  2022年1月  2021年12月  2021年11月  2021年10月  2021年9月  2021年8月  2021年7月  2021年5月  2021年4月  2021年3月  2021年2月  2020年12月  2020年11月  2020年8月  2020年6月  2020年5月  2020年4月  2020年2月  2020年1月  2019年12月  2019年11月  2019年10月  2019年9月  2019年8月  2019年7月  2019年6月  2019年5月  2019年3月  2019年1月  2018年12月  2018年11月  2018年10月  2018年9月  2018年8月  2018年7月  2018年6月  2018年5月  2018年4月  2018年3月  2018年2月  2018年1月  2017年12月  2017年11月  2017年10月  2017年9月  2017年8月  2017年7月  2017年6月  2017年5月  2017年4月  2017年3月  2017年2月  2017年1月  2016年12月  2016年11月  2016年10月  2016年9月  2016年8月  2016年7月  2016年6月  2016年5月  2016年4月  2016年3月  2016年2月  2016年1月  2015年12月  2015年11月  2015年10月  2015年8月  2015年7月  2015年6月  2015年5月  2015年3月  2015年2月  2015年1月  2014年12月 
#### 人気記事
#### プロフィール
  * ニックネーム: るな
  * 血液型： A型
  * 出身地： 横浜
  * 自己紹介： るな だよーヽ(´ー｀)ノ


[![ブログランキング・にほんブログ村へ](https://thk.kanzae.net/net/itc/t2286/)](https://lifestyle.blogmura.com/creativelife/ranking.html "ブログランキング・にほんブログ村へ")
![メール](https://thk.kanzae.net/net/itc/t2286/)[お問い合せはコチラ](https://thk.kanzae.net/contact/ "お問い合せ")
[![Amazon Wish List](https://thk.kanzae.net/wp-content/uploads/2017/11/amazon-wish-list-nuko.png)](http://amzn.asia/4gvj8hy "Amazon Wish List")
るなの [ほしい物のリスト](http://amzn.asia/4gvj8hy) です
#### 最近のコメント
![Magiz](https://secure.gravatar.com/avatar/fc69fbd9374dd5a447e9f66be4a93911b17265886c095831174c23cdbde5b1e9?s=32&d=mm&r=g)2026年8月19日 [Magiz](https://baxian-movie.com/) さん
PageSpeed APIを使ってスクリーンショットを撮る方法は、サイトの表示確認にとても便利そうですね。APIキーの取 ...
[Google の Pagespeedapi を使って Web ...](https://thk.kanzae.net/net/itc/t5840/#comment-994)
![るな](https://secure.gravatar.com/avatar/5af1de737595a16b19204824a1adc1788b3f0abd87c89cfe0f3479cd17bc4f99?s=32&d=mm&r=g)2022年12月30日 るな さん
クレジットを消去させない仕組みとして base64 でエンコードしたファイルを含んでます。セキュリティ上全く問題のないフ ...
[WP 6.1 で AMP エラー出るので修正 Lux...](https://thk.kanzae.net/dev/wp-themes/luxeritas/t14103/#comment-654)
![cheshirex](https://secure.gravatar.com/avatar/27edcb38d1fadfcef47ec9f45d50d71f6e69a27d46d0a095d0367803b941b5e3?s=32&d=mm&r=g)2022年12月30日 [cheshirex](https://www.cheshirex.com) さん
こんにちは、私は中国のユーザーです。 私のアンチウイルスソフトは、件名ファイルに不審なファイルがあると報告しています。こ ...
[WP 6.1 で AMP エラー出るので修正 Lux...](https://thk.kanzae.net/dev/wp-themes/luxeritas/t14103/#comment-653)
![るな](https://secure.gravatar.com/avatar/5af1de737595a16b19204824a1adc1788b3f0abd87c89cfe0f3479cd17bc4f99?s=32&d=mm&r=g)2021年10月13日 るな さん
1234 さん。mime_module.c ではなく、mime_module か mod_mime.c のどちらかです。 ...
[[改訂版] .htaccess の見直しでWebペー...](https://thk.kanzae.net/net/itc/t2286/#comment-586)
![1234](https://secure.gravatar.com/avatar/a43cf89b5ec2b8db79f1fad7ba7343a37f2375bc04886a4edb9309c214be9c3e?s=32&d=mm&r=g)2021年10月12日 1234 さん
# MIME Type 追加mime_module.cでも良いでしょうか
[[改訂版] .htaccess の見直しでWebペー...](https://thk.kanzae.net/net/itc/t2286/#comment-584)
#### 無料 WP テーマ Luxeritas
[![Luxeritas Theme](https://thk.kanzae.net/wp-content/themes/luxech/luxeritas-banner.png)](https://thk.kanzae.net/wp/ "Luxeritas Theme")
無料・SEO最適化済み  
高速・多機能・レスポンシブ
Luxeritas Theme は SEO 最適化済み  
多機能なのに高速な WP テーマです。
#### THK Analytics も配布中
[![THK Analytics](https://thk.kanzae.net/wp-content/themes/luxech/thk_analytics.png)](https://thk.kanzae.net/analytics/ "THK Analytics")
無料・高機能・高速  
低メモリ・リアルタイム・レスポンシブ
THK Analytics は PHP + MySQL で動作する  
サーバーインストール型アクセス解析です。
© 2014-2026 Thought is free
WordPress Luxeritas Theme is provided by "[Thought is free](https://thk.kanzae.net/)".
  * __  
メニュー
  * __  
SNS
  * [__  
コメント](https://thk.kanzae.net/net/itc/t2286/#respond "コメント")
  * __  
上へ


__  
|   |   |  
| --- | --- |
