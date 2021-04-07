import { Stack, StackProps, Construct, Duration } from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { APP_NAME } from './context';
import { LAMBDA_LAYER_DIR } from '../bin/preprocess';

export type LambdaLayerProps = {
  envName: string;
} & StackProps;

/**
 * Lambda Layer のスタック
 */
export class LambdaLayer extends Stack {
  protected readonly envName: string;
  public readonly lambdaLayer: lambda.LayerVersion;

  constructor(scope: Construct, id: string, props: LambdaLayerProps) {
    super(scope, id, props);
    const { envName } = props;
    this.envName = envName;

    // Lambda layerの設定
    this.lambdaLayer = new lambda.LayerVersion(
      this,
      `${APP_NAME}-${this.envName}-lambda-layer`,
      {
        code: lambda.Code.fromAsset(LAMBDA_LAYER_DIR),
        compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
      }
    );
  }
}
