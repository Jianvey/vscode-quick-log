# Publishing

The extension is packaged from the files listed in `.vscodeignore`. Tests, local evidence, dependencies, and development configuration are excluded from the VSIX.

## Marketplace publisher

The `publisher` field in `package.json` must match a Marketplace publisher you own. A GitHub account does not create a Marketplace publisher automatically.

1. Sign in to [Manage Publishers & Extensions](https://marketplace.visualstudio.com/manage).
2. Create or select your publisher. This repository uses `jianvey`.
3. Select **Trusted Publishing** and create a policy with these exact values:

| Field | Value |
| --- | --- |
| Policy name | Quick Log releases |
| Repository owner | `Jianvey` |
| Repository | `vscode-quick-log` |
| Workflow | `publish.yml` |
| Environment | Leave empty |

The policy allows the repository's publishing workflow to use GitHub's short-lived OIDC token. No Marketplace token is stored in this repository.

## Release

1. Update `version` in `package.json` and add release notes to `CHANGELOG.md`.
2. Run `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test`, and `pnpm package`.
3. Commit and push the release to the default branch.
4. In GitHub Actions, run **Publish to Marketplace** on that branch.
5. Wait for the workflow and Marketplace validation to complete, then verify that the listed version can be installed.

The workflow runs the checks and publishes with `vsce publish --oidc`. The same version cannot be published twice.

For a manual first upload, run `pnpm package` and upload the generated VSIX through the publisher management page.

The extension ID is `jianvey.quick-log-console-shortcuts`. If `quick-log.vscode-quick-log` is installed, uninstall it and install the new ID; changing publishers creates a separate Marketplace identity.

See the official [extension publishing guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) for account setup and troubleshooting.
