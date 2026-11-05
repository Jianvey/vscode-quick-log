const vscode = require('vscode');

function quote(text) {
  return "'" + text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    .replace(/\r/g, '\\r').replace(/\n/g, '\\n')
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + "'";
}

function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand('quickLog.insert', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const { document, selection } = editor;
    const range = selection.isEmpty
      ? document.getWordRangeAtPosition(selection.active, /[$\p{ID_Start}][$\p{ID_Continue}]*/u)
      : selection;
    const expression = range ? document.getText(range).trim() : '';
    const settings = vscode.workspace.getConfiguration('quickLog', document.uri);
    const prefix = settings.get('prefix', '🚀');
    const template = settings.get('messageTemplate', '{prefix} {variable}: ');
    const label = expression
      ? template.replace(/\{(prefix|variable)\}/g, (_, name) => name === 'prefix' ? prefix : expression).trimStart()
      : prefix;
    const statement = `console.log(${quote(label)}${expression ? `, ${expression}` : ''});`;
    const line = document.lineAt(selection.end.line);
    const indent = line.text.match(/^\s*/)[0];
    const newline = document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
    const applied = await editor.edit(edit => edit.insert(line.range.end, newline + indent + statement));
    if (!applied) return;

    const cursor = new vscode.Position(line.lineNumber + 1, indent.length + statement.length - (expression ? 0 : 2));
    editor.selection = new vscode.Selection(cursor, cursor);
    editor.revealRange(new vscode.Range(cursor, cursor));
  }));
}

module.exports = { activate };
