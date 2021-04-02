import { StackProps, Construct } from '@aws-cdk/core';
import { LambdaBase, LambdaProps } from '../lambdaBase';

/**
 * Lambda 関数の雛形
 */
export class baumeEtMercierLambda extends LambdaBase {
  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id, props);

    this.createLambdaBuilder(this, {
      entryPoint: 'src/index.ts',
      handler: 'testFn',
    });
  }
}
