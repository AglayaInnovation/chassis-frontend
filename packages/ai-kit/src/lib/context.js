import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const LOCKFILES = [
    ['pnpm-lock.yaml', 'pnpm', 'pnpm'],
    ['yarn.lock', 'yarn', 'yarn'],
    ['bun.lockb', 'bun', 'bun run'],
    ['bun.lock', 'bun', 'bun run'],
    ['package-lock.json', 'npm', 'npm run'],
];

/**
 * Where each kind of file lands. A project install writes next to the code;
 * a global install writes to ~/.claude so the setup follows the developer
 * across every repo on that machine.
 */
export function resolveLayout({ dir, global }) {
    if (global) {
        const claudeDir = path.join(os.homedir(), '.claude');
        return {
            root: claudeDir,
            claudeDir,
            claudeMd: path.join(claudeDir, 'CLAUDE.md'),
            // User-level MCP servers live in ~/.claude.json, which also holds
            // Claude Code's own state: we do not touch it.
            mcpJson: null,
            hooksDir: '$HOME/.claude/hooks',
        };
    }
    const root = path.resolve(dir);
    return {
        root,
        claudeDir: path.join(root, '.claude'),
        claudeMd: path.join(root, 'CLAUDE.md'),
        mcpJson: path.join(root, '.mcp.json'),
        hooksDir: '$CLAUDE_PROJECT_DIR/.claude/hooks',
    };
}

/** Values available to templates as {{name}}. */
export function resolveVars(layout) {
    const pkgFile = path.join(layout.root, 'package.json');
    const pkg = fs.existsSync(pkgFile) ? JSON.parse(fs.readFileSync(pkgFile, 'utf8')) : {};
    const [, pm, pmRun] = LOCKFILES.find(([file]) => fs.existsSync(path.join(layout.root, file))) ?? [null, 'npm', 'npm run'];

    return {
        projectName: pkg.name ?? path.basename(layout.root),
        pm,
        pmRun,
        hooksDir: layout.hooksDir,
    };
}

export function render(text, vars) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => (key in vars ? vars[key] : match));
}
