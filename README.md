# Generate Assets - VS Code Extension

Generate Assets is a Visual Studio Code extension designed for **Flutter developers**. It helps generate Dart constants for asset paths from a folder structure, making it easier to manage assets in Flutter projects.

## Features

- **Generate Asset Constants**: Automatically scans your `assets` folder and creates a Dart class with constants for all asset files.
- **Excludes Folders**: Skip specified subfolders in the configuration.
- **Customizable Output**:
  - Define the output file path.
  - Specify the class name.

## Getting Started

### Installation

1. Install the extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/).
2. Add a configuration file named `generate_assets_config.yaml` in your workspace.

### Configuration

Create a `generate_assets_config.yaml` file with the following format:

```yaml
assets_folder: assets                  # Path to the folder containing assets.
output_file: lib/app_drawables.dart    # Path to the output Dart file.
excluded_folders:                      # Subfolders to exclude from scanning.
  - temp
output_class_name: AppDrawables        # Name of the Dart class.
```

### Usage

1. Open the command palette (Ctrl+Shift+P / Cmd+Shift+P).
2. Run the command Generate Assets.
3. The Dart class with constants will be generated at the specified path.
