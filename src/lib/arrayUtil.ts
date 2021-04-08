export type WatchItem = { index: number; item: string[] };
/**
 * 2次元配列の生成
 * @param array 配列
 * @param divNum 分割数
 * @returns 分割数ごとに分割した 2次元配列
 */
export const divideSubArray = (
  array: string[],
  divNum: number = 10
): WatchItem[] => {
  let result = [];
  for (let i = 0; i < array.length; i = i + divNum) {
    result.push({
      index: i,
      item: array.slice(i, i + divNum),
    });
  }
  return result;
};
