import { getBalueWatchUrl } from './baume-et-mercier';

// テスト
export const testFn = async (event: any, context: any): Promise<string> => {
  return 'Hello World';
};

/**
 * URL リストの取得
 */
export const getBalmeWatchUrlLambda = async (
  event: any,
  context: any
): Promise<{ urls: string[][] }> => {
  console.log('object');
  const urls = await getBalueWatchUrl();
  return { urls };
};

/**
 * 時計情報の取得
 */
export const getBalmeWatchInfoLambda = async (
  event: any,
  context: any
): Promise<any> => {
  return event;
};
