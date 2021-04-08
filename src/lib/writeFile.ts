import * as fs from 'fs';
import { S3 } from 'aws-sdk';

/**
 *
 * @param data データ文字列
 * @param filePath ファイルパス
 */
export const writeFileOnLocal = (data: string, filePath: string) => {
  fs.writeFileSync(filePath, data);
};

const s3 = new S3({ region: 'ap-northeast-1' });
export const writeFileOnS3 = async (
  data: string,
  bucketName: string,
  key: string
) => {
  await s3
    .upload({
      Bucket: bucketName,
      Key: key,
      Body: data,
    })
    .promise();
};
