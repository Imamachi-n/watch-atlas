import { getTextContent, getURL, gotoInitialPage } from '../lib/utils';
import { FARER_WATCH_LIST } from './constants';
import { divideSubArray } from '../lib/arrayUtil';

/**
 * Farer の時計 URL リストの取得
 * @returns 時計 URL リスト
 */
export const getFarerWatchUrl = async () => {
  // 検索ページを開く
  const { browser, page } = await gotoInitialPage(
    // すべてのコレクション
    FARER_WATCH_LIST.URL,
    10
  );

  // セレクタで URLデータを取得し、配列で返す
  const urls = divideSubArray(
    await getURL(await page.$$(FARER_WATCH_LIST.ITEM_A_TAG))
  );
  await browser.close();
  return urls;
};
