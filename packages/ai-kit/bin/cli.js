#!/usr/bin/env node

import { parseArgs } from 'node:util';

import { init, list, status, sync } from '../src/commands.js';

const HELP = `Usage: aglaya-ai <command> [options]

Commands:
  init      Install the team AI setup into a project (or ~/.claude with --global)
  sync      Update an existing install to the current ai-kit version
  status    Show drift against the current ai-kit version (exits 1 if out of sync)
  list      List available presets

Options:
  -p, --preset <names>  Comma separated presets, e.g. frontend,library
  -g, --global          Target ~/.claude instead of the current project
  -d, --dir <path>      Project directory (default: current directory)
  -f, --force           Overwrite files that were edited locally
      --dry-run         Show what would change without writing
  -v, --verbose         Also list unchanged files
  -h, --help            Show this help
`;

const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
        preset: { type: 'string', short: 'p' },
        global: { type: 'boolean', short: 'g', default: false },
        dir: { type: 'string', short: 'd', default: process.cwd() },
        force: { type: 'boolean', short: 'f', default: false },
        'dry-run': { type: 'boolean', default: false },
        verbose: { type: 'boolean', short: 'v', default: false },
        help: { type: 'boolean', short: 'h', default: false },
    },
});

const options = {
    ...values,
    dryRun: values['dry-run'],
    preset: values.preset?.split(',').map((s) => s.trim()).filter(Boolean),
};

const commands = { init, sync, status, list };
const command = commands[positionals[0]];

if (values.help || !command) {
    console.log(HELP);
    process.exit(values.help ? 0 : 1);
}

try {
    process.exitCode = await command(options);
} catch (error) {
    console.error(`aglaya-ai: ${error.message}`);
    process.exitCode = 1;
}
