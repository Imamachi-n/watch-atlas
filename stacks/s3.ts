import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3/lib/bucket';
import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { APP_NAME } from './context';

export type S3Props = {
  envName: string;
} & StackProps;

/**
 * S3 のスタック
 */
export class S3 extends Stack {
  private readonly envName: string;
  private readonly s3Prefix: string = APP_NAME;
  public readonly dataLakeBucket: Bucket; // データレイク用 S3 バケット

  constructor(scope: Construct, id: string, props: S3Props) {
    super(scope, id, props);
    const { envName } = props;
    this.envName = envName;

    // データレイク用の S3 バケット
    this.dataLakeBucket = new Bucket(
      this,
      `${this.s3Prefix}-${this.envName}-bucket`,
      {
        bucketName: `${this.s3Prefix}-${this.envName}-datalake`,
        encryption: BucketEncryption.S3_MANAGED, // S3 マネージド暗号化
      }
    );
    // MEMO: スタックごと削除しても、S3 バケット自体は削除しない
    this.dataLakeBucket.policy?.applyRemovalPolicy(RemovalPolicy.RETAIN);
  }
}
