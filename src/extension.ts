import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  console.log('Activating extension "file-to-markdown"');

  let disposable1 = vscode.commands.registerCommand(
    'extension.filesToMarkdown',
    async (uri: vscode.Uri, selectedFiles: vscode.Uri[]) => {
      console.log('Command "extension.filesToMarkdown" triggered');

      if (!selectedFiles || selectedFiles.length === 0) {
        selectedFiles = vscode.window.activeTextEditor
          ? [vscode.window.activeTextEditor.document.uri]
          : [];
      }

      if (selectedFiles.length === 0) {
        vscode.window.showErrorMessage('No files selected');
        return;
      }

      await convertFilesToMarkdown(selectedFiles);
    }
  );

  let disposable2 = vscode.commands.registerCommand('extension.tabsToMarkdown', async () => {
    console.log('Command "extension.tabsToMarkdown" triggered');

    const openTabs = vscode.window.tabGroups.all
      .flatMap((group) => group.tabs)
      .map((tab) => (tab.input instanceof vscode.TabInputText ? tab.input.uri : null))
      .filter((uri): uri is vscode.Uri => uri !== null);

    if (!Array.isArray(openTabs) || openTabs.length === 0) {
      vscode.window.showErrorMessage('No open tabs with text documents');
      return;
    }

    await convertFilesToMarkdown(openTabs);
  });

  let disposable3 = vscode.commands.registerCommand(
    'extension.singleFileToMarkdown',
    async (uri: vscode.Uri) => {
      console.log('Command "extension.singleFileToMarkdown" triggered');

      const targetUri =
        uri ||
        (vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.uri : null);

      if (targetUri) {
        await convertFilesToMarkdown([targetUri]);
      } else {
        vscode.window.showErrorMessage('No file to copy as markdown');
      }
    }
  );

  let disposable4 = vscode.commands.registerCommand(
    'extension.tabGroupToMarkdown',
    async (uri: vscode.Uri) => {
      console.log('Command "extension.tabGroupToMarkdown" triggered');

      const targetTabGroup = vscode.window.tabGroups.all.find((group) =>
        group.tabs.some(
          (tab) =>
            tab.input instanceof vscode.TabInputText && tab.input.uri.toString() === uri?.toString()
        )
      );

      if (!targetTabGroup) {
        vscode.window.showErrorMessage('Tab group not found');
        return;
      }

      const tabGroupUris = targetTabGroup.tabs
        .map((tab) => (tab.input instanceof vscode.TabInputText ? tab.input.uri : null))
        .filter((uri): uri is vscode.Uri => uri !== null);

      if (tabGroupUris.length === 0) {
        vscode.window.showErrorMessage('No tabs in this group to copy');
        return;
      }

      await convertFilesToMarkdown(tabGroupUris);
    }
  );

  context.subscriptions.push(disposable1);
  context.subscriptions.push(disposable2);
  context.subscriptions.push(disposable3);
  context.subscriptions.push(disposable4);
}

async function convertFilesToMarkdown(files: vscode.Uri[]) {
  let markdownContent = '';

  for (const file of files) {
    const relativePath = vscode.workspace.asRelativePath(file);
    let fileContent = fs.readFileSync(file.fsPath, 'utf8');

    // Remove BOM if present
    if (fileContent.charCodeAt(0) === 0xfeff) {
      fileContent = fileContent.slice(1);
    }

    const languageId = await getLanguageId(file);

    markdownContent += `## File: ${relativePath}\n`;
    markdownContent += '```' + languageId + '\n';
    markdownContent += fileContent + '\n';
    markdownContent += '```\n\n';
  }

  // Copy to clipboard
  vscode.env.clipboard.writeText(markdownContent).then(
    () => {
      vscode.window.showInformationMessage('File(s) copied to clipboard as markdown');
    },
    (error) => {
      vscode.window.showErrorMessage('Failed to copy to clipboard: ' + error);
    }
  );
}

async function getLanguageId(uri: vscode.Uri): Promise<string> {
  try {
    const document = await vscode.workspace.openTextDocument(uri);
    return document.languageId;
  } catch (error) {
    console.error(`Error detecting language for ${uri.fsPath}:`, error);
    return 'plaintext';
  }
}

export function deactivate() {}