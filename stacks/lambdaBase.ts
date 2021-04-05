import { Stack, StackProps, Construct, Duration } from '@aws-cdk/core';
import * as lambdaFn from '@aws-cdk/aws-lambda-nodejs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import { APP_NAME } from './context';
import { Bucket } from '@aws-cdk/aws-s3';

export type LambdaProps = {
  envName: string;
  dataLakeBucket: Bucket; // データレイク用 S3 バケット
} & StackProps;

/**
 * Lambda 関数の雛形
 */
export class LambdaBase extends Stack {
  protected readonly envName: string;
  protected readonly lambdaPrefix: string = APP_NAME;
  protected readonly dataLakeBucket: Bucket; // データレイク用 S3 バケット

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id, props);
    const { envName, dataLakeBucket } = props;
    this.envName = envName;
    this.dataLakeBucket = dataLakeBucket;
  }

  // Lambda関数を生成する
  protected createLambdaBuilder(
    scope: Construct,
    handler: {
      entryPoint: string;
      handler: string;
      scheduleCron?: string;
      memorySize?: number;
      timeout?: Duration;
    }
  ): lambdaFn.NodejsFunction {
    // メモリサイズ（デフォルト: 1024 MB）
    const memorySize = handler.memorySize || 1024;
    // タイムアウト時間（デフォルト: 10 min）
    const timeout = handler.timeout || Duration.minutes(10);

    // Lambda関数の生成
    const pfLambda = new lambdaFn.NodejsFunction(scope, handler.entryPoint, {
      functionName: `${this.lambdaPrefix}-${this.envName}-${handler.handler}`,
      runtime: lambda.Runtime.NODEJS_14_X,
      memorySize,
      entry: handler.entryPoint,
      handler: handler.handler,
      timeout,
      bundling: {
        externalModules: [
          'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
          'cool-module', // 'cool-module' is already available in a Layer
        ],
      },
    });

    // データレイク用の S3 バケットへの読み書き権限を付与
    this.dataLakeBucket.grantReadWrite(pfLambda);

    // Cron式の指定がない場合、CloudWatch Eventを付与しない
    if (!handler.scheduleCron) return pfLambda;

    // CloudWatch Eventの付与
    const invokeRule = new events.Rule(
      scope,
      `${this.lambdaPrefix}-${handler.handler}-invoke`,
      {
        schedule: events.Schedule.expression(handler.scheduleCron),
      }
    );
    invokeRule.addTarget(new targets.LambdaFunction(pfLambda));
    return pfLambda;
  }
}
