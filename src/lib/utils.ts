import puppeteer from 'puppeteer';

/**
 * element からテキストを抽出
 * @param elements ElementHandle represents an in-page DOM element
 * @param selector セレクタ
 */
export const getTextContent = async (
  elements: puppeteer.ElementHandle<Element> | null,
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
  elementHandler: puppeteer.ElementHandle<Element>
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
  elements: puppeteer.ElementHandle<Element>[]
): Promise<string[]> => {
  let urls = [];
  for (let i = 0; i < elements.length; i++) {
    const url = await getURLContent(elements[i]);
    // URL が取得できなかった場合、スキップ
    if (url) {
      urls.push(url);
    }
  }

  console.log(`件数: ${urls.length}件`);
  console.log(`スキップ件数: ${elements.length - urls.length}件`);

  return urls;
};
