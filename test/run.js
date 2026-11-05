const assert = require('node:assert/strict');
const vscode = require('vscode');

async function insert(source, selection, expected) {
  const document = await vscode.workspace.openTextDocument({ language: 'typescript', content: source });
  const editor = await vscode.window.showTextDocument(document);
  editor.selection = new vscode.Selection(...selection);
  await vscode.commands.executeCommand('quickLog.insert');
  assert.equal(document.getText(), expected);
  return editor;
}

async function run() {
  const settings = vscode.workspace.getConfiguration('quickLog');
  assert.equal(settings.get('prefix'), '🚀');
  const source = 'const group = reactive({ list: [] as Group[] });';
  const editor = await insert(source, [0, 6, 0, 11], source + "\nconsole.log('🚀 group: ', group);");
  await vscode.commands.executeCommand('undo');
  assert.equal(editor.document.getText(), source, 'Insertion should be one undo step');

  await settings.update('prefix', '[DEBUG]', vscode.ConfigurationTarget.Global);
  await insert('  const group = 1;\n  next();', [0, 10, 0, 10],
    "  const group = 1;\n  console.log('[DEBUG] group: ', group);\n  next();");

  await insert('const group = 1;\r\nnext();', [0, 6, 0, 11],
    "const group = 1;\r\nconsole.log('[DEBUG] group: ', group);\r\nnext();");

  await settings.update('prefix', '', vscode.ConfigurationTarget.Global);
  await insert('group', [0, 0, 0, 5], "group\nconsole.log('group: ', group);");
  await insert('const $group = 1;', [0, 9, 0, 9],
    "const $group = 1;\nconsole.log('$group: ', $group);");

  const prefix = "API's \\ trace\nnext\u2028line";
  await settings.update('prefix', prefix, vscode.ConfigurationTarget.Global);
  const expression = "group['list']";
  const document = await vscode.workspace.openTextDocument({ language: 'javascript', content: expression });
  const escapedEditor = await vscode.window.showTextDocument(document);
  escapedEditor.selection = new vscode.Selection(0, 0, 0, expression.length);
  await vscode.commands.executeCommand('quickLog.insert');
  const statement = document.lineAt(1).text;
  const logs = [];
  const group = { list: [1, 2] };
  new Function('console', 'group', statement)({ log: (...args) => logs.push(args) }, group);
  assert.deepEqual(logs, [[`${prefix} ${expression}: `, group.list]], 'Labels must remain string data');

  await settings.update('prefix', '🚀', vscode.ConfigurationTarget.Global);
  await insert('', [0, 0, 0, 0], "\nconsole.log('🚀');");
  await settings.update('messageTemplate', '{prefix} Trace [{variable}]: ', vscode.ConfigurationTarget.Global);
  await insert(source, [0, 6, 0, 11], source + "\nconsole.log('🚀 Trace [group]: ', group);");

  await settings.update('messageTemplate', '{prefix} Group data: ', vscode.ConfigurationTarget.Global);
  await insert(source, [0, 6, 0, 11], source + "\nconsole.log('🚀 Group data: ', group);");

  await settings.update('prefix', '$& {variable}', vscode.ConfigurationTarget.Global);
  await settings.update('messageTemplate', '{prefix} [{variable}]', vscode.ConfigurationTarget.Global);
  await insert('group', [0, 0, 0, 5], "group\nconsole.log('$& {variable} [group]', group);");
  console.log('Quick Log: all 11 integration checks passed (selection, undo, cursor, CRLF, empty prefix, dollar identifier, escaping, empty line, message template, fixed label, literal token values).');
}

module.exports = { run };
