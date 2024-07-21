# Copy for Context - VS Code Extension

## Overview

"Copy for Context" is a Visual Studio Code extension that allows you to quickly copy selected files as formatted markdown. This is particularly useful when you need to share code snippets with AI assistants like ChatGPT or Claude, or when you want to create documentation that includes code from multiple files.

## Features

- Select multiple files in the VS Code Explorer
- Right-click and choose "Copy for Context"
- Automatically copies selected files as markdown to your clipboard
- Includes file paths and automatically detects language for syntax highlighting
- Works with all file types supported by VS Code

## Installation

### From VSIX File

1. Download the `.vsix` file from the [releases page](https://github.com/collinc777/context-copy/releases).
2. Open VS Code
3. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X on Mac)
4. Click on the '...' at the top of the Extensions view
5. Choose 'Install from VSIX...'
6. Select the downloaded `.vsix` file

### From VS Code Marketplace

*(Note: Include this section only if you've published to the VS Code Marketplace)*

1. Open VS Code
2. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X on Mac)
3. Search for "Copy for Context"
4. Click "Install"

## Usage

1. In the VS Code Explorer, select one or more files you want to copy.
2. Right-click on the selection.
3. Choose "Copy for Context" from the context menu.
4. The selected files will be copied to your clipboard as formatted markdown.
5. Paste the content wherever you need it (e.g., in a conversation with an AI assistant).

## Example Output

When you copy files using this extension, the output will look something like this:

```markdown
## File: src/example.js
Language: javascript

```javascript
function hello() {
    console.log("Hello, world!");
}
```

## File: src/styles.css
Language: css

```css
body {
    font-family: Arial, sans-serif;
}
```
```

## Configuration

Currently, this extension does not require any configuration. It works out of the box!

## Known Issues

*(List any known issues or limitations here. If there are none, you can omit this section.)*

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

*(Include your chosen license here. If you haven't chosen a license yet, consider using an open-source license like MIT or Apache 2.0.)*

## Support

If you encounter any problems or have any suggestions, please open an issue on the [GitHub repository](https://github.com/collinc777/context-copy).

---

Happy coding, and enjoy using Copy for Context!