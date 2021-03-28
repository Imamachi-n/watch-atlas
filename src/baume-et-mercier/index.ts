import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { getTextContent } from '../lib/utils';

// const crowller = new Crowller();
(async () => {
  const options = {
    headless: false, // ヘッドレスをオフに
    slowMo: 10, // 動作を遅く
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(
    // すべてのコレクション
    'https://www.baume-et-mercier.com/jp/ja/%E3%82%A6%E3%82%A9%E3%83%83%E3%83%81/%E3%81%99%E3%81%B9%E3%81%A6%E3%81%AE%E6%99%82%E8%A8%88.html'
  );

  // 全部のHTMLコンテンツを取得
  //   const content = await page.content();
  //   console.log(content.toString());
  //   await page.screenshot({ path: "example.png" });

  // 以下のセレクタでデータを引っ掛ける
  const initialContents = await page.$$('div.bem-product-item__link');
  console.log(`件数: ${initialContents.length}件`);

  const results = [];
  // FIXME: テスト用
  for (let i = 0; i < 5; i++) {
    //   for (let i = 0; i < initialContents.length; i++) {
    const watchContents = await page.$$('div.bem-product-item__link');
    watchContents[i].click();
    await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] });

    // 基本情報の取得(id, productName, detail)
    const basicElements = await page.$(
      'div.product-detail__col--item.product-detail__details'
    );
    const watchId = await getTextContent(basicElements, 'h1'); // IDの取得
    const watchTitle = await getTextContent(basicElements, 'h2'); // 時計名称の取得
    const detail = await getTextContent(basicElements, 'p'); // 概要の取得
    const price = await getTextContent(
      basicElements,
      'span.bem-pricedisplay__price.txt-big-price'
    ); // 金額
    const priceLabel = await getTextContent(
      basicElements,
      'span.bem-pricedisplay__label.txt-small'
    ); // 金額ラベル

    // 詳細情報の取得
    let detailInfo = {};
    const detailElements = await page.$$('div.product-specifications__list');
    for (const element of detailElements) {
      // 項目のタイトル
      const head = await getTextContent(element, 'h4');
      if (!head) {
        console.log(
          'ヘッダーが見つかりませんでした…サイト内容を確認しましょう。'
        );
        continue;
      }
      detailInfo = {
        ...detailInfo,
        [head]: {},
      };

      // 各項目の内容
      const ul = await element.$$('ul > li');
      for (const li of ul) {
        const label = await getTextContent(li, 'label');
        const span = await getTextContent(li, 'span');

        // ラベル付きの内容
        if (label && span) {
          // @ts-ignore
          detailInfo[head] = {
            // @ts-ignore
            ...detailInfo[head],
            [label]: span,
          };
          continue;
        }

        // ラベルなしの内容
        if (span) {
          // @ts-ignore
          if (detailInfo[head]['内容']) {
            // @ts-ignore
            detailInfo[head]['内容'].push(span);
          } else {
            // @ts-ignore
            detailInfo[head]['内容'] = [span];
          }
          continue;
        }
      }
    }

    results.push({
      basic: {
        watchId,
        watchTitle,
        detail,
        price,
        priceLabel,
      },
      detail: detailInfo,
    });

    await page.goBack();
  }

  console.log(JSON.stringify(results, null, 2));
  fs.writeFileSync(
    path.join(__dirname, '..', '..', 'data', 'baume-et-mercier_all.json'),
    JSON.stringify(results)
  );

  //   const context = await elements?.getProperty("textContent");
  //   const text = await context?.jsonValue();
  //   console.log(text);

  await browser.close();
})();
