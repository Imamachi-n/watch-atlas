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
    console.log(error);
    return undefined;
  }
};
