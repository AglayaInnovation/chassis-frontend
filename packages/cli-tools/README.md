# `@aglaya/cli-tools`

A command-line interface (CLI) library for scaffolding and managing frontend projects with pre-configured templates.

## Features

- 🚀 Quick project scaffolding
- 📦 Multiple project templates (HTML with Tailwind CSS)
- 🎨 Pre-configured build tools
- 📝 Interactive prompts for project setup
- 🛠️ Automatic dependency installation

## Installation

### Global Installation

To install the CLI library globally:

```bash
npm install -g @aglaya/cli-tools
# or
yarn global add @aglaya/cli-tools
```

### Local Installation (for development)

```bash
npm install @aglaya/cli-tools
# or
yarn add @aglaya/cli-tools
```

## Usage

### Create a New Project

Create a new project with an interactive setup:

```bash
aglaya-cli create <project-name>
```

**Example:**

```bash
aglaya-cli create my-awesome-project
```

This command will:

1. Prompt you to select a project type:
   - `templates-html` - HTML project with Tailwind CSS pre-configured
   - `none` - Empty project structure
2. Ask for a project description
3. Create the project folder structure
4. Install dependencies automatically (for templated projects)
5. Run the initial build

### Available Project Types

#### 1. HTML Template (`templates-html`)

Creates a complete HTML project with:

- Tailwind CSS configured and ready to use
- Pre-configured build scripts
- Optimized folder structure
- Sample HTML files
- CSS processing pipeline

**Generated Structure:**

```
my-project/
├── src/
│   ├── css/
│   ├── js/
│   └── index.html
├── dist/
├── package.json
├── tailwind.config.js
└── .gitignore
```

#### 2. None (`none`)

Creates an empty project folder - perfect for custom setups.

### Display Help

View available commands and usage information:

```bash
aglaya-cli help
# or
aglaya-cli --help
```

## Commands Reference

| Command                    | Description              |
| -------------------------- | ------------------------ |
| `aglaya-cli create <name>` | Create a new project     |
| `aglaya-cli help`          | Display help information |
| `aglaya-cli --version`     | Show CLI version         |

## Development

### Working Locally

To work on this CLI tool locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/AglayaInnovation/chassis-frontend.git
   cd chassis-frontend/packages/cli-tools
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Link the package globally:

   ```bash
   npm link
   # or
   yarn link
   ```

4. Test your changes:
   ```bash
   aglaya-cli create test-project
   ```

### Project Structure

```
cli-tools/
├── bin/
│   └── cli.js           # Entry point for the CLI
├── src/
│   ├── commands/        # Command implementations
│   │   ├── create.js
│   │   └── help.js
│   ├── files/           # Template files
│   ├── utils/           # Utility functions
│   └── index.js         # Main exports
├── package.json
└── README.md
```

## Requirements

- Node.js >= 18
- npm or yarn

## Troubleshooting

### Command Not Found

If you get a "command not found" error after installation:

1. Ensure the package is installed globally
2. Check your PATH includes npm/yarn global bin directory
3. Try re-linking: `npm link` or `yarn link`

### Installation Fails

If dependency installation fails during project creation:

1. Ensure you have a stable internet connection
2. Try using a different package manager (npm vs yarn)
3. Check Node.js version compatibility

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Monster50

## Links

- [GitHub Repository](https://github.com/AglayaInnovation/chassis-frontend)
- [Report Issues](https://github.com/AglayaInnovation/chassis-frontend/issues)
