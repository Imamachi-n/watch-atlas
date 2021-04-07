import * as path from 'path';
import * as childProcess from 'child_process';
import * as fs from 'fs';

export const LAMBDA_LAYER_DIR = path.join(__dirname, '..', 'bundle');
export const LAMBDA_LAYER_RUNTIME_DIR = path.join(LAMBDA_LAYER_DIR, 'nodejs');
export const LAMBDA_LAYER_MODULE_DIR = path.join(
  LAMBDA_LAYER_RUNTIME_DIR,
  'node_modules'
);

// Lambda Layer向けのバンドル処理
// MEMO: CDKが zip化してS3へアップロードするところまでやってくれるが、
// Lambda Layerのディレクトリ構成を `nodejs/node_modules` にしないといけない。
export const bundlePackages = () => {
  // バンドル用のディレクトリ作成
  fs.mkdirSync(LAMBDA_LAYER_MODULE_DIR, { recursive: true });

  // package.json と yarn.lock をコピー
  ['package.json', 'yarn.lock'].map((file) =>
    fs.copyFileSync(
      path.join(__dirname, '..', file),
      path.join(LAMBDA_LAYER_RUNTIME_DIR, file)
    )
  );

  // dependencies のパッケージだけインストール（Lambda Layer のサイズを小さくするため）
  childProcess.execSync(
    `yarn --production --modules-folder ${LAMBDA_LAYER_MODULE_DIR}`,
    {
      env: { ...process.env },
      shell: 'bash',
    }
  );
};
