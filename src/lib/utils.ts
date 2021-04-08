import chromium from 'chrome-aws-lambda';
import { Browser, ElementHandle, Page } from 'puppeteer-core';

/**
 * 初期ページに遷移
 * @param url URL 文字列
 * @param slowMo 動作を遅く
 * @param headless ヘッドレスモード
 */
export const gotoInitialPage = async (
  url: string,
  slowMo: number = 10
): Promise<{ browser: Browser; page: Page }> => {
  const options = {
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless, // ローカル環境の場合、ヘッドレスをオフに
    ignoreHTTPSErrors: true,
    slowMo, // 動作を遅く
  };
  const browser = await chromium.puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(url);
  return { browser, page };
};

/**
 * element からテキストを抽出
 * @param elements ElementHandle represents an in-page DOM element
 * @param selector セレクタ
 */
export const getTextContent = async (
  elements: ElementHandle<Element> | null,
  selector: string
): Promise<string | undefined> => {
  try {
    const elementHandler = await elements?.$(selector);
    const textContext = await elementHandler?.getProperty('textContent');
    return ((await textContext?.jsonValue()) as string).trim();
  } catch (error) {
    // console.log(error);
    return undefined;
  }
};

/**
 * element から URL を抽出
 * @param elements ElementHandle represents an in-page DOM element
 * @param selector セレクタ
 */
export const getURLContent = async (
  elementHandler: ElementHandle<Element>
): Promise<string | undefined> => {
  try {
    const textContext = await elementHandler?.getProperty('href');
    return ((await textContext?.jsonValue()) as string).trim();
  } catch (error) {
    // console.log(error);
    return undefined;
  }
};

/**
 * URL 文字列の配列を取得
 * @param elements -
 * @param selector セレクタ
 * @returns URL 文字列の配列
 */
export const getURL = async (
  elements: ElementHandle<Element>[]
): Promise<string[]> => {
  let urls = [];
  for (const element of elements) {
    const url = await getURLContent(element);
    // URL が取得できなかった場合、スキップ
    if (url) {
      urls.push(url);
    }
  }

  console.log(`件数: ${urls.length}件`);
  console.log(`スキップ件数: ${elements.length - urls.length}件`);

  return urls;
};
