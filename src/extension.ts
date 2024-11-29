import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

export function activate(context: vscode.ExtensionContext) {
  const generateAssetsCommand = vscode.commands.registerCommand(
    'generate-assets.generateAssets',
    async () => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

      if (!workspaceFolder) {
        vscode.window.showErrorMessage('Vui lòng mở một workspace trước.');
        return;
      }

      const configPath = path.join(workspaceFolder, 'generate_assets_config.yaml');
      if (!fs.existsSync(configPath)) {
        vscode.window.showErrorMessage('Không tìm thấy file generate_assets_config.yaml.');
        return;
      }

      const configContent = fs.readFileSync(configPath, 'utf8');
      const config = yaml.parse(configContent);

      const assetsFolder = path.join(workspaceFolder, config.assets_folder || 'assets');
      const outputPath = path.join(workspaceFolder, config.output_file || 'lib/app_drawables.dart');
      const excludedFolders = new Set(config.excluded_folders || []);

      if (!fs.existsSync(assetsFolder)) {
        vscode.window.showErrorMessage('Thư mục assets không tồn tại.');
        return;
      }

      const assetPaths: { variableName: string; relativePath: string }[] = [];
      function scanFolder(folder: string) {
        const entries = fs.readdirSync(folder, { withFileTypes: true });
        for (const entry of entries) {
          const entryPath = path.join(folder, entry.name);
          const relativePath = path.relative(assetsFolder, entryPath).replace(/\\/g, '/');

          if (entry.isDirectory()) {
            if (!excludedFolders.has(entry.name)) {
              scanFolder(entryPath);
            }
          } else if (entry.isFile()) {
            const fileName = entry.name; // Lấy tên file
            const variableName = fileName.replace(/\./g, '_').toLowerCase(); // Tạo tên biến từ tên file
            assetPaths.push({ variableName, relativePath });
          }
        }
      }
      scanFolder(assetsFolder);

      const outputClassName = config.output_class_name || 'AppDrawables';
      const outputClassContent = `
class ${outputClassName} {
  const ${outputClassName}._();

${assetPaths
  .map(
    ({ variableName, relativePath }) =>
      `  static const String ${variableName} = '${config.assets_folder}/${relativePath}';`
  )
  .join('\n')}
}
`;

      fs.writeFileSync(outputPath, outputClassContent.trim());
      vscode.window.showInformationMessage('File AppDrawables.dart đã được tạo thành công!');
    }
  );

  context.subscriptions.push(generateAssetsCommand);
}

export function deactivate() {}
