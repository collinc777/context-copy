import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.filesToMarkdown', (uri: vscode.Uri, selectedFiles: vscode.Uri[]) => {
        if (!selectedFiles || selectedFiles.length === 0) {
            vscode.window.showErrorMessage('No files selected');
            return;
        }

        let markdownContent = '';

        selectedFiles.forEach(file => {
            const relativePath = vscode.workspace.asRelativePath(file);
            const fileContent = fs.readFileSync(file.fsPath, 'utf8');
            const languageId = getLanguageId(file.fsPath);

            markdownContent += `## File: ${relativePath}\n`;
            markdownContent += `Language: ${languageId}\n\n`;
            markdownContent += '```' + languageId + '\n';
            markdownContent += fileContent + '\n';
            markdownContent += '```\n\n';
        });

        // Create a new untitled document with the markdown content
        vscode.workspace.openTextDocument({ content: markdownContent, language: 'markdown' })
            .then(doc => vscode.window.showTextDocument(doc));
    });

    context.subscriptions.push(disposable);
}

function getLanguageId(filePath: string): string {
    const extension = path.extname(filePath).toLowerCase();
    // This is a basic mapping, you might want to expand it
    const languageMap: {[key: string]: string} = {
        '.js': 'javascript',
        '.ts': 'typescript',
        '.py': 'python',
        '.html': 'html',
        '.css': 'css',
        '.json': 'json',
        // Add more mappings as needed
    };
    return languageMap[extension] || 'plaintext';
}

export function deactivate() {}