import chalk from 'chalk';
import applyToken from './js-lib/applyToken.js';
import runCommand from './js-lib/runCommand.js';

const BUCKET_NAME = 'goer-api-document/senserobot';
const REGION = 'ap-northeast-2';
const CLOUD_FRONT_ID = 'E18DPF38YY9OVB';

async function deploy() {
  applyToken('global');

  const isBuildSuccessful = await runCommand('npm run build');
  const buildText = isBuildSuccessful ? chalk.green('Build successful!') : chalk.redBright('Build failed!');
  console.log(`${buildText}\n`);

  if (!isBuildSuccessful) {
    return;
  }

  const isDeploySuccessful = await runCommand(`aws s3 sync ./build s3://${BUCKET_NAME} --delete --region ${REGION}`);
  if (CLOUD_FRONT_ID) {
    await runCommand(`aws cloudfront create-invalidation --distribution-id ${CLOUD_FRONT_ID} --paths /index.html`);
  }

  const deployText = isDeploySuccessful ? chalk.green('Deploy successful!') : chalk.redBright('Deploy failed!');
  console.log(`${deployText}\n`);
}

deploy();
