# Quick Log: Console Shortcuts

![Quick Log icon](assets/icon.png)

Insert `console.log` with one keyboard shortcut and customize the generated label through VS Code settings.

Quick Log has no runtime dependencies, background file scanning, file watchers, telemetry, or network requests. It activates when you run its command.

## Install

Install **Quick Log: Console Shortcuts** from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=quick-log.vscode-quick-log), or run this command in VS Code Quick Open:

```text
ext install quick-log.vscode-quick-log
```

## Usage

1. Select a variable or expression, or place the cursor on a variable name.
2. Press **Cmd+Shift+L** on macOS or **Ctrl+Shift+L** on Windows and Linux.
3. A log statement appears on the next line, preserving the current indentation.

```ts
const group = reactive({ list: [] as Group[] });
console.log('🚀 group: ', group);
```

The shortcut is available in JavaScript, TypeScript, JSX, TSX, and Vue files. You can also run **Quick Log: Insert Console Log** from the Command Palette. To change the shortcut, search for that command in Keyboard Shortcuts.

If the cursor is on an empty line and nothing is selected, the command inserts `console.log('🚀');` and places the cursor before the closing parenthesis.

## Settings

Search for **Quick Log** in VS Code settings, or add these entries to your user or workspace `settings.json`:

```json
{
  "quickLog.prefix": "🚀",
  "quickLog.messageTemplate": "{prefix} {variable}: "
}
```

| Setting | Default | Purpose |
| --- | --- | --- |
| `quickLog.prefix` | `🚀` | The prefix inserted by `{prefix}`. An empty string removes it. |
| `quickLog.messageTemplate` | `{prefix} {variable}: ` | The quoted label generated for a variable or expression. |

Both settings apply immediately. Templates replace `{prefix}` with your prefix and `{variable}` with the selected variable or expression. Leading whitespace in the expanded label is removed.

For example:

```json
{
  "quickLog.prefix": "[DEBUG]",
  "quickLog.messageTemplate": "{prefix} Trace [{variable}]: "
}
```

```ts
console.log('[DEBUG] Trace [group]: ', group);
```

To use a fixed description, set `quickLog.messageTemplate` to `{prefix} Group data: `. This generates:

```ts
console.log('[DEBUG] Group data: ', group);
```

The template only changes the quoted label. The logged expression remains unchanged. Empty logs use the prefix directly.

## Insertion behavior

- The command inserts after the current line, or the last line of a selection.
- It operates on one selection at a time and leaves the clipboard untouched.
- It does not parse the surrounding code. For a multiline declaration, place the cursor after the completed declaration before inserting the log. Move the statement if needed to keep it inside the correct scope.
- This extension does not execute your code or display runtime output. Run your application normally to see the log.

## Development

Use Node.js 24 and pnpm 12:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm package
```

The integration tests run in an isolated VS Code profile. By default, the test runner downloads VS Code through `@vscode/test-electron`. To reuse an installed build, set `VSCODE_EXECUTABLE_PATH` to its executable before running `pnpm test`.

See [Publishing](PUBLISHING.md) for the Marketplace release process.

## License

[MIT](LICENSE).
