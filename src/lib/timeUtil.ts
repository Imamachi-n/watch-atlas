// @ts-ignored
import dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 日付の文字列を返す
 * @param date 日付
 * @returns 日付(YYYY-MM-DD)の文字列
 */
export const getYYYYMMDD = (date: Date): string => {
  return dayjs(date).tz('Asia/Tokyo').format('YYYY-MM-DD');
};
