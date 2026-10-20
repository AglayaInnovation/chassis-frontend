import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TEMPLATES_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../templates');

// `core` is always applied first; every other preset layers on top of it.
export const BASE_PRESET = 'core';

export function listPresets() {
    return fs
        .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => {
            const meta = readJson(path.join(TEMPLATES_DIR, entry.name, 'preset.json')) ?? {};
            return { name: entry.name, description: meta.description ?? '' };
        });
}

export function resolvePresets(requested = []) {
    const available = new Set(listPresets().map((p) => p.name));
    const unknown = requested.filter((name) => !available.has(name));
    if (unknown.length) {
        throw new Error(`Unknown preset(s): ${unknown.join(', ')}. Available: ${[...available].join(', ')}`);
    }
    return [BASE_PRESET, ...requested.filter((name) => name !== BASE_PRESET)];
}

function readJson(file) {
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}
