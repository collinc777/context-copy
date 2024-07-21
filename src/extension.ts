import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating extension "file-to-markdown"');

    let disposable = vscode.commands.registerCommand('extension.filesToMarkdown', (uri: vscode.Uri, selectedFiles: vscode.Uri[]) => {
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

        // Copy to clipboard
        vscode.env.clipboard.writeText(markdownContent).then(() => {
            vscode.window.showInformationMessage('Files copied to clipboard as markdown');
        }, (error) => {
            vscode.window.showErrorMessage('Failed to copy to clipboard: ' + error);
        });
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