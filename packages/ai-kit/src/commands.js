import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

import { resolveLayout, resolveVars } from './lib/context.js';
import { applyPlan, buildPlan, readManifest } from './lib/engine.js';
import { BASE_PRESET, listPresets, resolvePresets } from './lib/presets.js';

const KIT_VERSION = JSON.parse(
    fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../package.json'), 'utf8'),
).version;

const ICONS = {
    created: '+',
    updated: '~',
    merged: '~',
    removed: '-',
    unchanged: '=',
    conflict: '!',
    orphaned: '?',
};

export async function init(options) {
    const layout = resolveLayout(options);
    let requested = options.preset;
    if (!requested && process.stdin.isTTY) requested = await askPresets();
    return run(layout, resolvePresets(requested ?? []), options);
}

export function sync(options) {
    const layout = resolveLayout(options);
    const manifest = readManifest(layout);
    if (!manifest) {
        console.error(`No ai-kit install found in ${layout.root}. Run \`aglaya-ai init\` first.`);
        return 1;
    }
    // --preset on sync replaces the recorded presets (e.g. adding `library` later).
    return run(layout, resolvePresets(options.preset ?? manifest.presets), options);
}

/** Dry-run of sync. Exits non-zero on drift, so CI can enforce the standard. */
export function status(options) {
    const layout = resolveLayout(options);
    const manifest = readManifest(layout);
    if (!manifest) {
        console.error(`No ai-kit install found in ${layout.root}.`);
        return 1;
    }
    const report = runPlan(layout, resolvePresets(manifest.presets), { ...options, dryRun: true });
    printReport(report, { verbose: options.verbose });
    if (manifest.kitVersion !== KIT_VERSION) {
        console.log(`\nInstalled with ai-kit ${manifest.kitVersion}, current is ${KIT_VERSION}.`);
    }
    const drift = report.filter((r) => r.status !== 'unchanged');
    console.log(drift.length ? `\n${drift.length} file(s) out of sync.` : '\nUp to date.');
    return drift.length ? 1 : 0;
}

export function list() {
    for (const { name, description } of listPresets()) {
        console.log(`  ${name.padEnd(12)} ${description}${name === BASE_PRESET ? ' (always applied)' : ''}`);
    }
    return 0;
}

function run(layout, presets, options) {
    console.log(`ai-kit ${KIT_VERSION} → ${layout.root} [${presets.join(', ')}]${options.dryRun ? ' (dry run)' : ''}\n`);
    const report = runPlan(layout, presets, options);
    printReport(report, { verbose: options.verbose });

    const conflicts = report.filter((r) => r.status === 'conflict');
    if (conflicts.length) {
        console.log(
            `\n${conflicts.length} file(s) were edited locally and kept as is. ` +
                'Upstream the change to ai-kit, or re-run with --force to take the team version.',
        );
    }
    return 0;
}

function runPlan(layout, presets, options) {
    const plan = buildPlan(presets, layout, resolveVars(layout));
    return applyPlan(plan, layout, {
        presets: presets.filter((p) => p !== BASE_PRESET),
        kitVersion: KIT_VERSION,
        force: options.force,
        dryRun: options.dryRun,
    });
}

function printReport(report, { verbose }) {
    for (const { status, file } of report) {
        if (status === 'unchanged' && !verbose) continue;
        console.log(`  ${ICONS[status]} ${status.padEnd(9)} ${file}`);
    }
}

async function askPresets() {
    const optional = listPresets().filter((p) => p.name !== BASE_PRESET);
    console.log('Presets (core is always included):');
    optional.forEach((p, i) => console.log(`  ${i + 1}) ${p.name.padEnd(12)} ${p.description}`));

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await rl.question('Pick presets (comma separated numbers or names, empty for none): ');
    rl.close();

    return answer
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => (/^\d+$/.test(s) ? optional[Number(s) - 1]?.name ?? s : s));
}
