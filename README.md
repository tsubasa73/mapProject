# GeNote
Google Maps APIを用いた日記投稿サイトです。<br>
外出先での景色や出来事等を位置情報付きで共有できます。 <br>
投稿した日記はマーカーとなって地図上に記録されます。 <br>
レスポンシブ対応なのでスマホからでもご利用頂けます。<br>
![スクリーンショット 2021-02-23 1 41 14](https://user-images.githubusercontent.com/22128696/108740005-8b635400-7578-11eb-99cd-802d536d4630.png)
![スクリーンショット 2021-02-23 1 42 06](https://user-images.githubusercontent.com/22128696/108740014-8dc5ae00-7578-11eb-8847-249311df03c6.png)
![スクリーンショット 2021-02-21 17 32 31](https://user-images.githubusercontent.com/22128696/108620025-5ec21600-746c-11eb-9b19-9eff1c0caf52.png)
![スクリーンショット 2021-02-21 17 56 11](https://user-images.githubusercontent.com/22128696/108620230-1d326a80-746e-11eb-8854-4441c14f0f29.png)

# URL
https://www.genote-portfolio.com/map/login <br>
画面下部のログインフォームからログイン頂けます。<br>
以下ゲスト用のユーザ情報です。ご自由にログイン、ご投稿下さい。<br>
username : guest<br>
password : password001<br>

# 使い方
本サイトはユーザの位置情報を利用します。ログイン後、位置情報の利用を許可して下さい。<br>
MacOSの場合は「システム環境設定 > セキュリティとプライバシー > 位置情報サービス」から使用ブラウザの位置情報を許可する必要があります。<br>
地図上をクリックすることで緑色のマーカーが立ち、その位置で日記を投稿することができます。<br>
また、地図上の赤いマーカー、またはサイドバーから他のユーザが投稿した日記を閲覧・コメントすることもできます。<br>
デモとして東京駅周辺に日記を複数投稿しています。<br>
サイドバーの地名検索フォームから「東京駅」と検索することにより移動可能です。<br>

# 使用技術
- Python 3.9.0
- Django(GeoDjango) 3.1.6
- PostgreSQL 12.5
- PostGis 3.0
- Maps JavaScript API
- Amazon Linux 2
- Nginx
- Gunicorn
- AWS
  - IAM
  - VPC
  - EC2
  - ELB
  - RDS
  - S3
  - Route 53

# AWS構成図
![geonote](https://user-images.githubusercontent.com/22128696/108758301-4813e000-758e-11eb-96af-099eef4abce7.png)

# 機能一覧
- ログイン／ログアウト機能(django.contrib.auth.login, logout)
- ログアウトメッセージ機能(django.contrib.messages.middleware.MessageMiddleware)
- 現在地リアルタイム更新機能(Geocoding API, 非同期処理(async/await))
- 画面内マーカー表示機能(Ajax)
- サイドバーリスト表示機能(Ajax)
- 地名検索機能(Places API)
- 日記投稿機能(CreateView)
  - 画像投稿機能(ImageField)
  - 位置情報記録機能(PointField)
- コメント機能(CreateView)
- SSL通信対応(ドメイン認証)
