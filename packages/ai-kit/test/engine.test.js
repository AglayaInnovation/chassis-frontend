import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { beforeEach, describe, it } from 'node:test';

import { resolveLayout, resolveVars } from '../src/lib/context.js';
import { applyPlan, BLOCK_END, BLOCK_START, buildPlan, readManifest } from '../src/lib/engine.js';
import { mergeConfig } from '../src/lib/merge.js';
import { resolvePresets } from '../src/lib/presets.js';

let dir;
let layout;

function install(presets = [], opts = {}) {
    const resolved = resolvePresets(presets);
    const plan = buildPlan(resolved, layout, resolveVars(layout));
    return applyPlan(plan, layout, { presets, kitVersion: 'test', ...opts });
}

const read = (rel) => fs.readFileSync(path.join(dir, rel), 'utf8');
const statusOf = (report, rel) => report.find((r) => r.file === rel)?.status;

beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-kit-'));
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'demo-app' }));
    fs.writeFileSync(path.join(dir, 'yarn.lock'), '');
    layout = resolveLayout({ dir });
});

describe('install', () => {
    it('creates core files, renders vars and writes a manifest', () => {
        install();
        assert.match(read('CLAUDE.md'), /Package manager: `yarn`/);
        assert.ok(fs.existsSync(path.join(dir, '.claude/agents/code-reviewer.md')));
        const settings = JSON.parse(read('.claude/settings.json'));
        assert.ok(settings.permissions.allow.includes('Bash(yarn test:*)'));
        assert.match(settings.hooks.PreToolUse[0].hooks[0].command, /\$CLAUDE_PROJECT_DIR\/\.claude\/hooks/);
        assert.deepEqual(readManifest(layout).presets, []);
        assert.equal(fs.existsSync(path.join(dir, '.mcp.json')), false);
    });

    it('layers presets on top of core', () => {
        install(['frontend']);
        assert.ok(fs.existsSync(path.join(dir, '.claude/agents/senior-frontend-mentor.md')));
        assert.ok(JSON.parse(read('.mcp.json')).mcpServers.playwright);
        assert.match(read('CLAUDE.md'), /Team standards[\s\S]*Frontend standards/);
    });

    it('is idempotent', () => {
        install(['library']);
        const report = install(['library']);
        assert.ok(report.every((r) => r.status === 'unchanged'), JSON.stringify(report));
    });

    it('rejects unknown presets', () => {
        assert.throws(() => resolvePresets(['nope']), /Unknown preset/);
    });
});

describe('sync', () => {
    it('keeps locally edited files and reports a conflict', () => {
        install();
        const rel = '.claude/agents/code-reviewer.md';
        fs.writeFileSync(path.join(dir, rel), 'local tweak');
        // Simulate a new team version of the file.
        const manifestPath = path.join(dir, '.claude/ai-kit.lock.json');
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        manifest.files[rel] = 'old-team-hash';
        fs.writeFileSync(manifestPath, JSON.stringify(manifest));

        const report = install();
        assert.equal(statusOf(report, rel), 'conflict');
        assert.equal(read(rel), 'local tweak');
        assert.equal(statusOf(install([], { force: true }), rel), 'updated');
    });

    it('updates untouched files when the template changes', () => {
        install();
        const rel = '.claude/commands/commit.md';
        const manifestPath = path.join(dir, '.claude/ai-kit.lock.json');
        // Pretend the installed copy came from an older template.
        fs.writeFileSync(path.join(dir, rel), 'old template');
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        manifest.files[rel] = sha256('old template');
        fs.writeFileSync(manifestPath, JSON.stringify(manifest));

        assert.equal(statusOf(install(), rel), 'updated');
        assert.match(read(rel), /Conventional Commit/);
    });

    it('removes untouched files dropped from the selected presets', () => {
        install(['library']);
        const rel = '.claude/commands/release-check.md';
        assert.ok(fs.existsSync(path.join(dir, rel)));
        assert.equal(statusOf(install([]), rel), 'removed');
        assert.equal(fs.existsSync(path.join(dir, rel)), false);
    });

    it('preserves project content outside the managed CLAUDE.md block', () => {
        fs.writeFileSync(path.join(dir, 'CLAUDE.md'), '# Demo\n\nDomain: invoices.\n');
        install();
        install();
        const md = read('CLAUDE.md');
        assert.match(md, /^# Demo\n\nDomain: invoices\./);
        assert.equal(md.split(BLOCK_START).length, 2);
        assert.ok(md.includes(BLOCK_END));
    });

    it('merges team settings without dropping local ones', () => {
        fs.mkdirSync(path.join(dir, '.claude'));
        fs.writeFileSync(
            path.join(dir, '.claude/settings.json'),
            JSON.stringify({ model: 'opus', permissions: { allow: ['Bash(make:*)'] } }),
        );
        install();
        const settings = JSON.parse(read('.claude/settings.json'));
        assert.equal(settings.model, 'opus');
        assert.ok(settings.permissions.allow.includes('Bash(make:*)'));
        assert.ok(settings.permissions.allow.includes('Bash(git status:*)'));
        assert.ok(settings.permissions.deny.length > 0);
    });
});

describe('mergeConfig', () => {
    it('unions arrays, recurses objects, keeps local scalars', () => {
        assert.deepEqual(mergeConfig({ a: [1, 2], b: { c: 'local' } }, { a: [2, 3], b: { c: 'team', d: 1 } }), {
            a: [1, 2, 3],
            b: { c: 'local', d: 1 },
        });
    });
});

function sha256(content) {
    return createHash('sha256').update(content).digest('hex');
}
