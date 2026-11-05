const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { runTests } = require('@vscode/test-electron');

async function main() {
  const extensionDevelopmentPath = path.resolve(__dirname, '..');
  const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'quick-log-'));
  const userDataDirectory = path.join(temporaryDirectory, 'data');
  const extensionsDirectory = path.join(temporaryDirectory, 'extensions');
  try {
    await fs.mkdir(path.join(userDataDirectory, 'User'), { recursive: true });
    await fs.mkdir(extensionsDirectory);
    await fs.writeFile(path.join(userDataDirectory, 'User', 'settings.json'), JSON.stringify({
      'telemetry.telemetryLevel': 'off',
      'update.mode': 'none',
      'extensions.autoCheckUpdates': false,
      'extensions.autoUpdate': false,
      'workbench.startupEditor': 'none',
      'window.restoreWindows': 'none'
    }));
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath: path.join(extensionDevelopmentPath, 'test', 'run.js'),
      vscodeExecutablePath: process.env.VSCODE_EXECUTABLE_PATH,
      launchArgs: [
        '--user-data-dir', userDataDirectory,
        '--extensions-dir', extensionsDirectory,
        '--disable-extensions',
        '--disable-workspace-trust',
        '--skip-welcome',
        '--skip-release-notes'
      ]
    });
  } finally {
    await fs.rm(temporaryDirectory, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
