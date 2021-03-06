import { Stack, StackProps, Construct, Duration } from '@aws-cdk/core';
import * as lambdaFn from '@aws-cdk/aws-lambda-nodejs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as sfnTasks from '@aws-cdk/aws-stepfunctions-tasks';
import { APP_NAME } from './context';
import { Bucket } from '@aws-cdk/aws-s3';
import { LayerVersion } from '@aws-cdk/aws-lambda';

export type LambdaProps = {
  envName: string;
  dataLakeBucket: Bucket; // データレイク用 S3 バケット
  lambdaLayer: LayerVersion; // Lambda Layer のスタック
} & StackProps;

/**
 * Lambda 関数の雛形
 */
export class LambdaBase extends Stack {
  protected readonly envName: string;
  protected readonly lambdaPrefix: string = APP_NAME;
  protected readonly dataLakeBucket: Bucket; // データレイク用 S3 バケット
  protected readonly lambdaLayer: LayerVersion; // Lambda Layer

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id, props);
    const { envName, dataLakeBucket, lambdaLayer } = props;
    this.envName = envName;
    this.dataLakeBucket = dataLakeBucket;
    this.lambdaLayer = lambdaLayer;
  }

  /**
   * Lambda関数を生成する
   * @param scope 対象の stack
   * @param handler Lambda 関数の各種パラメータ
   * @returns Lambda 関数
   */
  protected createLambdaFn(
    scope: Construct,
    handler: {
      entryPoint: string;
      name: string;
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
    const lambdaId = `${this.lambdaPrefix}-${this.envName}-${handler.name}`;
    // const pfLambda = new lambdaFn.NodejsFunction(scope, lambdaId, {
    //   functionName: lambdaId,
    //   runtime: lambda.Runtime.NODEJS_14_X,
    //   memorySize,
    //   entry: handler.entryPoint,
    //   handler: handler.name,
    //   timeout,
    //   bundling: {
    //     externalModules: [
    //       'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
    //       'cool-module', // 'cool-module' is already available in a Layer
    //     ],
    //   },
    // });
    const pfLambda = new lambda.Function(scope, handler.name, {
      functionName: `ascure-operation-${this.envName}-${handler.name}`,
      runtime: lambda.Runtime.NODEJS_14_X,
      layers: [this.lambdaLayer],
      code: lambda.Code.fromAsset('dist/src'),
      memorySize,
      handler: `${handler.entryPoint}.${handler.name}`,
      timeout,
    });

    // データレイク用の S3 バケットへの読み書き権限を付与
    this.dataLakeBucket.grantReadWrite(pfLambda);

    // Cron式の指定がない場合、CloudWatch Eventを付与しない
    if (!handler.scheduleCron) return pfLambda;

    // CloudWatch Eventの付与
    const invokeRule = new events.Rule(
      scope,
      `${this.lambdaPrefix}-${handler.name}-invoke`,
      {
        schedule: events.Schedule.expression(handler.scheduleCron),
      }
    );
    invokeRule.addTarget(new targets.LambdaFunction(pfLambda));
    return pfLambda;
  }

  /**
   * Web スクレイピング用の Step Functions を作成
   * @param baseFn URL リストを取得する関数
   * @param subTaskFn 各時計のデータを取得するサブタスク関数
   * @param itemName response オブジェクトの item 名
   */
  protected createWebScrapingSfn(
    baseFn: lambdaFn.NodejsFunction,
    baseName: string,
    subTaskFn: lambdaFn.NodejsFunction,
    subTaskName: string,
    sfnStateMachineName: string,
    itemName: string = 'urls'
  ) {
    // URL リストを取得する処理
    const baseTask = new sfnTasks.LambdaInvoke(this, `${baseName}-URLを取得`, {
      lambdaFunction: baseFn,
      payloadResponseOnly: true,
    });
    const subTask = new sfnTasks.LambdaInvoke(
      this,
      `${subTaskName}-時計情報を取得`,
      {
        inputPath: '$',
        lambdaFunction: subTaskFn,
      }
    );

    // 並列処理（同じ処理を同時実行）
    const subTaskMap = new sfn.Map(this, `${subTaskName}-sfn-map-task`, {
      maxConcurrency: 10,
      itemsPath: sfn.JsonPath.stringAt(`$.${itemName}`),
    });
    subTaskMap.iterator(subTask);

    // 終了処理
    const done = new sfn.Pass(this, `${subTaskName}-正常に終了したよ！`, {});

    // sfn の定義
    const definition = baseTask.next(subTaskMap).next(done);

    // ステートマシン（Step Functions）の作成
    new sfn.StateMachine(this, `${sfnStateMachineName}-sfn-sm`, {
      stateMachineName: `${sfnStateMachineName}-sfn-sm`,
      definition: definition,
    });
  }
}
