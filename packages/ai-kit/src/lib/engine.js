import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { render } from './context.js';
import { mergeConfig } from './merge.js';
import { TEMPLATES_DIR } from './presets.js';

export const MANIFEST_NAME = 'ai-kit.lock.json';
export const BLOCK_START = '<!-- aglaya-ai-kit:start (managed, do not edit by hand: run `aglaya-ai sync`) -->';
export const BLOCK_END = '<!-- aglaya-ai-kit:end -->';

/*
 * Templates avoid literal `.claude/`, `CLAUDE.md` and `.mcp.json` names so
 * Claude Code does not load them as live config while working on this repo.
 *
 *   templates/<preset>/claude/**        -> .claude/**  (copied)
 *   templates/<preset>/claude/settings.json -> merged into .claude/settings.json
 *   templates/<preset>/mcp.json         -> merged into .mcp.json
 *   templates/<preset>/CLAUDE.block.md  -> composed into the managed block of CLAUDE.md
 */
export function buildPlan(presets, layout, vars) {
    const files = new Map(); // absolute dest -> content
    const blocks = [];
    let settings = {};
    let mcp = {};

    for (const preset of presets) {
        const presetDir = path.join(TEMPLATES_DIR, preset);
        for (const rel of walk(presetDir)) {
            const content = render(fs.readFileSync(path.join(presetDir, rel), 'utf8'), vars);
            const posixRel = rel.split(path.sep).join('/');

            if (posixRel === 'preset.json') continue;
            if (posixRel === 'CLAUDE.block.md') blocks.push(content.trim());
            else if (posixRel === 'claude/settings.json') settings = mergeConfig(settings, JSON.parse(content));
            else if (posixRel === 'mcp.json') mcp = mergeConfig(mcp, JSON.parse(content));
            else if (posixRel.startsWith('claude/')) {
                // Later presets override earlier ones for the same path.
                files.set(path.join(layout.claudeDir, posixRel.slice('claude/'.length)), content);
            }
        }
    }

    return {
        files,
        settings,
        mcp: layout.mcpJson ? mcp : null,
        block: blocks.join('\n\n'),
    };
}

/**
 * Applies a plan to disk. Copied files are tracked by hash in the manifest so
 * a later sync can tell "the team changed this file" apart from "someone in
 * this project edited it locally" and never silently overwrite the latter.
 */
export function applyPlan(plan, layout, { presets, kitVersion, force = false, dryRun = false }) {
    const manifestPath = path.join(layout.claudeDir, MANIFEST_NAME);
    const previous = readJson(manifestPath)?.files ?? {};
    const tracked = {};
    const report = [];
    const write = (file, content) => {
        if (dryRun) return;
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, content);
    };

    for (const [file, content] of plan.files) {
        const rel = path.relative(layout.root, file);
        const nextHash = hash(content);
        const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
        const currentHash = current === null ? null : hash(current);

        if (current === null) {
            write(file, content);
            report.push({ status: 'created', file: rel });
        } else if (currentHash === nextHash) {
            report.push({ status: 'unchanged', file: rel });
        } else if (currentHash === previous[rel] || force) {
            write(file, content);
            report.push({ status: 'updated', file: rel });
        } else {
            // Edited locally: keep it, and keep its last known team hash so
            // the conflict is still reported on the next sync.
            report.push({ status: 'conflict', file: rel });
            if (previous[rel]) tracked[rel] = previous[rel];
            continue;
        }
        tracked[rel] = nextHash;
    }

    // Files the kit used to ship but no longer does.
    for (const [rel, oldHash] of Object.entries(previous)) {
        if (rel in tracked || report.some((r) => r.file === rel)) continue;
        const file = path.join(layout.root, rel);
        if (!fs.existsSync(file)) continue;
        if (hash(fs.readFileSync(file, 'utf8')) === oldHash || force) {
            if (!dryRun) fs.rmSync(file);
            report.push({ status: 'removed', file: rel });
        } else {
            report.push({ status: 'orphaned', file: rel });
        }
    }

    report.push(applyJson(path.join(layout.claudeDir, 'settings.json'), plan.settings, layout, dryRun));
    if (plan.mcp && Object.keys(plan.mcp).length) report.push(applyJson(layout.mcpJson, plan.mcp, layout, dryRun));
    report.push(applyClaudeMd(layout, plan.block, dryRun));

    if (!dryRun) {
        write(
            manifestPath,
            JSON.stringify({ kitVersion, presets, files: sortKeys(tracked) }, null, 2) + '\n',
        );
    }
    return report;
}

function applyJson(file, team, layout, dryRun) {
    const rel = path.relative(layout.root, file);
    const current = readJson(file);
    const next = mergeConfig(current ?? {}, team);
    const nextText = JSON.stringify(next, null, 2) + '\n';

    if (current !== null && JSON.stringify(current, null, 2) + '\n' === nextText) {
        return { status: 'unchanged', file: rel };
    }
    if (!dryRun) {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, nextText);
    }
    return { status: current === null ? 'created' : 'merged', file: rel };
}

function applyClaudeMd(layout, block, dryRun) {
    const rel = path.relative(layout.root, layout.claudeMd);
    const managed = `${BLOCK_START}\n${block}\n${BLOCK_END}`;
    const current = fs.existsSync(layout.claudeMd) ? fs.readFileSync(layout.claudeMd, 'utf8') : null;

    let next;
    if (current === null) {
        next = `# Project notes\n\n<!-- Project-specific context goes here: architecture, domain, gotchas. -->\n\n${managed}\n`;
    } else {
        const start = current.indexOf(BLOCK_START);
        const end = current.indexOf(BLOCK_END);
        next =
            start !== -1 && end > start
                ? current.slice(0, start) + managed + current.slice(end + BLOCK_END.length)
                : `${current.trimEnd()}\n\n${managed}\n`;
    }

    if (next === current) return { status: 'unchanged', file: rel };
    if (!dryRun) {
        fs.mkdirSync(path.dirname(layout.claudeMd), { recursive: true });
        fs.writeFileSync(layout.claudeMd, next);
    }
    return { status: current === null ? 'created' : 'updated', file: rel };
}

export function readManifest(layout) {
    return readJson(path.join(layout.claudeDir, MANIFEST_NAME));
}

function walk(dir, base = dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(full, base) : [path.relative(base, full)];
    });
}

function readJson(file) {
    return file && fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

function hash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}

function sortKeys(obj) {
    return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));
}
