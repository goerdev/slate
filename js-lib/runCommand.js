import {spawn} from 'child_process';
import chalk from 'chalk';

const isWin32 = process.platform === 'win32';

function runCommand(script) {
  const scriptParts = script.split(' ');
  let cmd = scriptParts[0];
  const params = scriptParts.slice(1);

  if (cmd !== 'git' && cmd !== 'node' && cmd !== 'aws') {
    cmd = `${cmd}${isWin32 ? '.cmd' : ''}`;
  }

  console.log(`CMD: ${chalk.greenBright(script)}`);

  return new Promise((resolve) => {
    const process = spawn(cmd, params, {shell: true});

    process.stdout.on('data', (data) => {
      const infoString = data.toString().replace(/\r\n+$|\n+$/, '');
      console.log(infoString);
    });
    process.stderr.on('data', (data) => {
      const infoString = data.toString().replace(/\r\n+$|\n+$/, '');
      console.log(infoString);
    });
    process.on('close', () => {
      resolve(true);
    });
    process.on('error', (err) => {
      console.log(err);
      resolve(false);
    });
  });
}

export default runCommand;
