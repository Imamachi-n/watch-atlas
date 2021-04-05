import * as core from '@aws-cdk/core';

// 環境名の取得
export const getEnvName = (scope: core.Construct): string =>
  scope.node.tryGetContext('env');

export const APP_NAME = 'watch-atlas';
