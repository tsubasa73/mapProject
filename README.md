# GeNote
Google Maps APIを用いた日記投稿サイトです。<br>
外出先での景色や出来事等を位置情報付きで共有できます。 <br>
投稿した日記はマーカーとなって地図上に記録されます。 <br>
レスポンシブ対応しているのでスマホからもご確認いただけます。<br>
![スクリーンショット 2021-02-21 17 40 59](https://user-images.githubusercontent.com/22128696/108620000-23274c00-746c-11eb-8557-b13728542131.png)
![スクリーンショット 2021-02-21 17 53 26](https://user-images.githubusercontent.com/22128696/108620197-d2185780-746d-11eb-8c19-30ee937e803f.png)
![スクリーンショット 2021-02-21 17 32 31](https://user-images.githubusercontent.com/22128696/108620025-5ec21600-746c-11eb-9b19-9eff1c0caf52.png)
![スクリーンショット 2021-02-21 17 56 11](https://user-images.githubusercontent.com/22128696/108620230-1d326a80-746e-11eb-8854-4441c14f0f29.png)

# URL
http://hogehoge/login <br>
画面下部のログインフォームからログインできます。<br>
以下ゲスト用のユーザ情報です。ご自由にログイン、投稿下さい。<br>
username : guest<br>
password : password001

# 使用技術
- Python 3.9.0
- Django(GeoDjango) 3.1.6
- PostgreSQL 13.1
- PostGis 3.1.1
- Maps JavaScript API
- Ubuntu X.X.X
- Nginx
- Gunicorn
- AWS
  - VPC
  - EC2
  - ELB
  - RDS
  - Route53

# AWS構成図
<img width="995" alt="スクリーンショット 2020-05-07 11 14 01" src="https://user-images.githubusercontent.com/60876388/81247155-3ccde300-9054-11ea-91eb-d06eb38a63b3.png">

# 機能一覧
- ログイン／ログアウト機能(django.contrib.auth.login, logout)
- ログアウトメッセージ機能(django.contrib.messages.middleware.MessageMiddleware)
- 現在地リアルタイム取得機能(Geocoding API, 非同期処理(async/await))
- 画面内マーカー表示機能(Ajax)
- サイドバーリスト表示機能(Ajax)
- 地名検索機能(Places API)
- 投稿機能(CreateView)
  - 画像投稿(ImageField)
  - 位置情報記録(PointField)
- コメント機能(CreateView)
