#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { baumeEtMercierLambda } from '../stacks/lambda/baume-et-mercier';
import { APP_NAME, getEnvName } from '../stacks/context';
import { S3 } from '../stacks/s3';

const app = new cdk.App();
const envName = getEnvName(app); // 環境名の取得

// S3 の設定用 Stack
const s3 = new S3(app, `${APP_NAME}-stack-${envName}-s3`, {
  envName,
});

// Lambda関数の設定用 Stack
const lambda = new baumeEtMercierLambda(
  app,
  `${APP_NAME}-stack-${envName}-lambda`,
  {
    envName,
    dataLakeBucket: s3.dataLakeBucket,
  }
);

app.synth();
