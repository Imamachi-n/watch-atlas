# watch-atlas

Web スクレイピングで各ブランドの機械式時計の情報を取得するスクリプト群

## TODO

- AWS CDK
  - Glue Studio で ETL 処理をプロトタイピング
  - Glue - S3 - Athena - QuickSight でサーバレス分析基盤を作る
- コスト管理
  - AWS Budgets の予算超過アラートを Slack へ通知
    - https://dev.classmethod.jp/articles/notify-slack-budgets-with-cloudformation/
  - AWS Budget Action を設定する
    - https://blog.serverworks.co.jp/aws-budgets-actions

## トラブルシューティング

### puppeteer を lambda layer に含めるとバンドルサイズの上限 250 MB を超えてしまう

`puppeteer` 本体に入っている chromium ではなく、`chrome-aws-lambda` を使う。  
つまり、`puppeteer-core` と `chrome-aws-lambda` を `dependencies` を追加して lambda layer を作成する。

### puppeteer と puppeteer-core の使い分け

開発環境で puppeteer を使い、lambda 上で puppeteer-core + chrome-aws-lambda を使う。
最初は、`puppeteer` を読み込もうとし、パッケージがない場合、`puppeteer-core` を読み込む仕様になっている。

## 参考文献

- https://github.com/puppeteer/puppeteer/issues/3051
- [puppeteer で SPA のページ表示速度を計測してみた](https://laptrinhx.com/puppeteerdespanopeji-biao-shi-su-duwo-ji-ceshitemita-1519063078/)
- [chrome-aws-lambda - HOWTO: Local Development](https://github.com/alixaxel/chrome-aws-lambda/wiki/HOWTO:-Local-Development)
