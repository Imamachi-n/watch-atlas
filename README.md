# watch-atlas

Web スクレイピングで各ブランドの機械式時計の情報を取得するスクリプト群

## トラブルシューティング

```
(node:84136) UnhandledPromiseRejectionWarning: Error: Protocol error (DOM.describeNode): Cannot find context with specified id
    at /Users/imamachinaoto/Documents/watch-atlas/node_modules/puppeteer/src/common/Connection.ts:270:57
    at new Promise (<anonymous>)
    at CDPSession.send (/Users/imamachinaoto/Documents/watch-atlas/node_modules/puppeteer/src/common/Connection.ts:269:12)
    at ExecutionContext._adoptElementHandle (/Users/imamachinaoto/Documents/watch-atlas/node_modules/puppeteer/src/common/ExecutionContext.ts:387:41)
    at Frame.waitForSelector (/Users/imamachinaoto/Documents/watch-atlas/node_modules/puppeteer/src/common/FrameManager.ts:1165:47)
    at async Promise.all (index 1)
(Use `node --trace-warnings ...` to show where the warning was created)
(node:84136) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
(node:84136) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

## 参考文献

- https://github.com/puppeteer/puppeteer/issues/3051
- [puppeteer で SPA のページ表示速度を計測してみた](https://laptrinhx.com/puppeteerdespanopeji-biao-shi-su-duwo-ji-ceshitemita-1519063078/)
