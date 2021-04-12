import * as fs from 'fs';
import * as path from 'path';
import { getTextContent, getURL, gotoInitialPage } from '../lib/utils';
import { getYYYYMMDD } from '../lib/timeUtil';
import { ORIS_WATCH_LIST } from './constants';
import { divideSubArray } from '../lib/arrayUtil';

/**
 * Oris の時計 URL リストの取得
 * @returns 時計 URL リスト
 */
export const getOrisWatchUrl = async () => {
  const { browser, page } = await gotoInitialPage(ORIS_WATCH_LIST.URL, 10);

  // セレクタで URLデータを取得し、配列で返す
  const urls = divideSubArray(
    await getURL(await page.$$(ORIS_WATCH_LIST.ITEM_A_TAG))
  );
  await browser.close();
  return urls;
};

// (async () => {
//   // 検索ページを開く
//   const { browser, page } = await gotoInitialPage(
//     // すべてのコレクション
//     'https://www.oris.ch/jp/watchfinder',
//     10
//   );

//   // セレクタで URLデータを取得する
//   const urls = await getURL(await page.$$('a.product-list-item'));

//   const results = [];
//   // FIXME: テスト用
//   for (let i = 0; i < 20; i++) {
//     //   for (let i = 0; i < urls.length; i++) {
//     try {
//       await page.goto(urls[i]);
//       await page.waitForSelector('div.technical-specifications'); // 特定のセレクタがロードされるまで待ち
//     } catch (error) {
//       await page.goto(urls[i]);
//       await page.waitForSelector('div.technical-specifications'); // 特定のセレクタがロードされるまで待ち
//     }

//     // 基本情報の取得
//     const titleElements = await page.$(
//       'div.col-md-12.watch-view-header > title-block'
//     );
//     const watchCategory = await getTextContent(titleElements, 'p'); // カテゴリの取得
//     const watchName = await getTextContent(titleElements, 'h2'); // 名前の取得

//     const basicElements = await page.$('div.infos-block');
//     const info = (await getTextContent(basicElements, 'p'))
//       ?.split('\n')
//       .map((item) => item.trim())
//       .filter((item) => !!item); // 基本情報の取得

//     // 詳細情報の取得
//     let detailContent: any = {};
//     const detailElements = await page.$$(
//       'div.technical-specifications > ul > li'
//     );
//     for (const element of detailElements) {
//       // 項目のデータ取得
//       const itemTitle = await getTextContent(element, 'div > a > strong');
//       const itemContent = await getTextContent(element, 'div > a > span');

//       if (itemTitle) {
//         detailContent = {
//           ...detailContent,
//           [itemTitle]: {
//             main: itemContent,
//             sub: {},
//           },
//         };

//         // サブ項目のデータ取得
//         const subElements = await element.$$('div > ul > li');
//         for (const subElement of subElements) {
//           const itemSubTitle = await getTextContent(subElement, 'strong');
//           const itemSubContent = await getTextContent(subElement, 'span');
//           detailContent[itemTitle].sub = itemSubTitle
//             ? {
//                 ...detailContent[itemTitle].sub,
//                 [itemSubTitle]: itemSubContent,
//               }
//             : detailContent.itemTitle.sub;
//         }
//       }
//     }

//     results.push({
//       basic: {
//         watchCategory,
//         watchName,
//         info,
//       },
//       detail: detailContent,
//     });
//     console.log(`${i} - ${watchCategory} - ${watchName}`);
//   }

//   console.log(JSON.stringify(results, null, 2));
//   fs.writeFileSync(
//     path.join(
//       __dirname,
//       '..',
//       '..',
//       'data',
//       `oris_all-${getYYYYMMDD(new Date())}.json`
//     ),
//     JSON.stringify(results)
//   );

//   await browser.close();
// })();
