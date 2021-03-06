# watch-atlas

Web スクレイピングで各ブランドの機械式時計の情報を取得するスクリプト群

## インフラ構成図

![aws-infra](./img/aws-infra.svg)

## Get Started

### パッケージのインストール

yarn, node.js をインストール後、以下のコマンドを実行してパッケージをインストール。

```zsh
yarn
```

### AWS へのデプロイ(Stack の構築)

以下のコマンドを実行して、AWS CDK を使って AWS へデプロイ。

```zsh
yarn deploy:prod
```

#### [注意] GitHub Actions 経由の CI/CD デプロイフロー

AWS の credential 情報を GitHub の Secrets として保存する。  
キー名は以下の名前で保存。

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

上記の設定後、`main` ブランチへマージすると、GitHub Actions 経由で AWS へデプロイされる。

### AWS へデプロイしたものを削除(Stack の削除)

```zsh
yarn destroy:prod
```

### パッケージのアップグレード(AWS CDK を含む)

```zsh
# ncu で最新パッケージかどうかチェック
yarn nuc

# すべてのパッケージをアップグレード
yarn ncu:u

# 特定のパッケージをアップグレード
yarn ncu:u <package_name>
```

## TODO

- [ ] データ構造
  - [ ] データを保存する形を決める
- [ ] AWS CDK
  - [ ] Glue Studio で ETL 処理をプロトタイピング
  - [ ] Glue - S3 - Athena - QuickSight でサーバレス分析基盤を作る
- [ ] コスト管理
  - [ ] AWS Budgets の予算超過アラートを Slack へ通知
    - https://dev.classmethod.jp/articles/notify-slack-budgets-with-cloudformation/
  - [ ] AWS Budget Action を設定する
    - https://blog.serverworks.co.jp/aws-budgets-actions

## データ構造（作成中）

| 列名           | 具体例          |
| -------------- | --------------- |
| Brand          | Baume & Mercier |
| Family         | Baume           |
| Reference      | Baume 10604     |
| Name           | Baume 10604     |
| Detail         | Baume 10604     |
| Movement       | RONDA 6004 D    |
| MovementEnergy | クオーツ        |
| PowerReserve   | 38 時間         |

Additional 24 Hour Hand (adjustable), Hours, Minutes, Small Seconds | Date | Chronograph
Limited: No
Case
Material: Stainless Steel
Glass: Sapphire
Back: Closed
Shape: Round
Diameter: 42.00 mm
Height: 13.00 mm
W/R: 30.00 m
Dial
Color: White
Indexes: Mixed
Hands: Feuille

## トラブルシューティング

### puppeteer を lambda layer に含めるとバンドルサイズの上限 250 MB を超えてしまう

`puppeteer` 本体に入っている chromium ではなく、`chrome-aws-lambda` を使う。  
つまり、`puppeteer-core` と `chrome-aws-lambda` を `dependencies` を追加して lambda layer を作成する。

### puppeteer と puppeteer-core の使い分け

開発環境で puppeteer を使い、lambda 上で puppeteer-core + chrome-aws-lambda を使う。
最初は、`puppeteer` を読み込もうとし、パッケージがない場合、`puppeteer-core` を読み込む仕様になっている。

### puppetter を jest でテストするには

[jest-puppeteer](https://github.com/smooth-code/jest-puppeteer) が必要。TypeScript では以下のパッケージも加えてインストール。

```zsh
yarn add --dev \
jest-puppeteer \
@types/puppeteer \
@types/jest-environment-puppeteer \
@types/expect-puppeteer
```

## 参考文献

- https://github.com/puppeteer/puppeteer/issues/3051
- [puppeteer で SPA のページ表示速度を計測してみた](https://laptrinhx.com/puppeteerdespanopeji-biao-shi-su-duwo-ji-ceshitemita-1519063078/)
- [chrome-aws-lambda - HOWTO: Local Development](https://github.com/alixaxel/chrome-aws-lambda/wiki/HOWTO:-Local-Development)
