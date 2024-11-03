import fs from 'fs';
import path from 'path';

export function createFolderStructure(basePath, structure) {
    Object.keys(structure).forEach(key => {
        const fullPath = path.join(basePath, key);
        if (typeof structure[key] === 'object') {
            fs.mkdirSync(fullPath, { recursive: true });
            createFolderStructure(fullPath, structure[key]);
        } else {
            const dirPath = path.dirname(fullPath);
            fs.mkdirSync(dirPath, { recursive: true });
            fs.writeFileSync(fullPath, structure[key] || '');
        }
    });
}


// Display the created folder structure
export function displayFolderStructure(dir, prefix = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const filteredEntries = entries.filter(entry => entry.name !== 'node_modules');

    filteredEntries.forEach((entry, index) => {
        const isLast = index === filteredEntries.length - 1;
        console.log(`${prefix}${isLast ? '└── ' : '├── '}${entry.name}`);
        if (entry.isDirectory()) {
            displayFolderStructure(path.join(dir, entry.name), `${prefix}${isLast ? '    ' : '│   '}`);
        }
    });
}
