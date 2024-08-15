import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  console.log('Activating extension "file-to-markdown"');

  let disposable = vscode.commands.registerCommand(
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

      let markdownContent = '';

      for (const file of selectedFiles) {
        const relativePath = vscode.workspace.asRelativePath(file);
        const fileContent = fs.readFileSync(file.fsPath, 'utf8');
        const languageId = await getLanguageId(file);

        markdownContent += `## File: ${relativePath}\n`;
        markdownContent += '```' + languageId + '\n';
        markdownContent += fileContent + '\n';
        markdownContent += '```\n\n';
      }

      // Copy to clipboard
      vscode.env.clipboard.writeText(markdownContent).then(
        () => {
          vscode.window.showInformationMessage('Files copied to clipboard as markdown');
        },
        (error) => {
          vscode.window.showErrorMessage('Failed to copy to clipboard: ' + error);
        }
      );
    }
  );

  context.subscriptions.push(disposable);
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
