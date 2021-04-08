import { StackProps, Construct } from '@aws-cdk/core';
import { LambdaBase, LambdaProps } from '../lambdaBase';

/**
 * Lambda 関数の雛形
 */
export class baumeEtMercierLambda extends LambdaBase {
  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id, props);

    this.createLambdaFn(this, {
      // entryPoint: 'src/index.ts',
      entryPoint: 'index',
      name: 'testFn',
    });

    const baseName = 'getBalmeWatchUrlLambda';
    const baseFn = this.createLambdaFn(this, {
      // entryPoint: 'src/index.ts',
      entryPoint: 'index',
      name: baseName,
    });
    const subTaskName = 'getBalmeWatchInfoLambda';
    const subTaskFn = this.createLambdaFn(this, {
      // entryPoint: 'src/index.ts',
      entryPoint: 'index',
      name: subTaskName,
    });

    // Web スクレイピング処理(sfn定義)
    this.createWebScrapingSfn(
      baseFn,
      baseName,
      subTaskFn,
      subTaskName,
      'balme-watch-scraping'
    );
  }
}
