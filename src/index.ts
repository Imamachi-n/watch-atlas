import { getBalueWatchUrl, getBaluWatchInfo } from './baume-et-mercier';
import { WatchItem } from './lib/arrayUtil';
import { DATALAKE_S3_BUCKET } from './lib/constants';
import { getYYYYMMDD } from './lib/timeUtil';
import { writeFileOnS3 } from './lib/writeFile';

// テスト
export const testFn = async (event: any, context: any): Promise<string> => {
  return 'Hello World';
};

/**
 * Balue & Mercier URL リストの取得
 */
export const getBalmeWatchUrlLambda = async (
  event: any,
  context: any
): Promise<{ urls: WatchItem[] }> => {
  const urls = await getBalueWatchUrl();
  return { urls };
};

/**
 * Balue & Mercier の時計情報の取得
 */
export const getBalmeWatchInfoLambda = async (
  event: WatchItem,
  context: any
): Promise<any> => {
  const results = await getBaluWatchInfo(event.item);
  await writeFileOnS3(
    JSON.stringify(results),
    DATALAKE_S3_BUCKET,
    `balueEtMercier/balueEtMercier_${getYYYYMMDD(
      new Date()
    )}_${event.index.toString().padStart(5, '0')}.json`
  );
};
