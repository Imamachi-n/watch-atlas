# watch-atlas

Web スクレイピングで各ブランドの機械式時計の情報を取得するスクリプト群

## TODO

- AWS CDK
  - Step functions を使う前提
    - 1 つ目の lambda 関数で URL を取得して、2 つ目の lambda 関数で並列処理で時計データを取りに行くかな？

## トラブルシューティング

### puppeteer と puppeteer-core の使い分け

開発環境で puppeteer を使い、lambda 上で puppeteer-core + chrome-aws-lambda を使う。
最初は、`puppeteer` を読み込もうとし、パッケージがない場合、`puppeteer-core` を読み込む仕様になっている。

## 参考文献

- https://github.com/puppeteer/puppeteer/issues/3051
- [puppeteer で SPA のページ表示速度を計測してみた](https://laptrinhx.com/puppeteerdespanopeji-biao-shi-su-duwo-ji-ceshitemita-1519063078/)
- [chrome-aws-lambda - HOWTO: Local Development](https://github.com/alixaxel/chrome-aws-lambda/wiki/HOWTO:-Local-Development)
