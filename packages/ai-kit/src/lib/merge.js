/**
 * Merges team defaults into a local JSON config (settings.json, .mcp.json).
 *
 * - Objects are merged recursively.
 * - Arrays are unioned (deduplicated by value), so team permissions/hooks are
 *   added without dropping the ones a project added on its own.
 * - Scalars: the local value wins, so a project can override a team default.
 */
export function mergeConfig(local, team) {
    if (Array.isArray(local) && Array.isArray(team)) {
        const seen = new Set(local.map((item) => JSON.stringify(item)));
        return [...local, ...team.filter((item) => !seen.has(JSON.stringify(item)))];
    }
    if (isObject(local) && isObject(team)) {
        const result = { ...local };
        for (const [key, value] of Object.entries(team)) {
            result[key] = key in local ? mergeConfig(local[key], value) : value;
        }
        return result;
    }
    return local === undefined ? team : local;
}

function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
