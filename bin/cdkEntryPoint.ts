#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { baumeEtMercierLambda } from '../stacks/lambda/baume-et-mercier';
import { APP_NAME, getEnvName } from '../stacks/context';

const app = new cdk.App();
const envName = getEnvName(app); // 環境名の取得

// Lambda関数の設定用 Stack
const lambda = new baumeEtMercierLambda(
  app,
  `${APP_NAME}Stack-${envName}-lambda`,
  {
    envName,
  }
);

app.synth();
