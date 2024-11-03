import { packageJsontailwindCss, htmlTailwindCss, tailwindCss, tailwindConfig, gitignore } from '../files';
export const htmlProjectStructure = (name, description) => ({
    'js': {
        'components': {
            'Header.js': '',
            'Footer.js': '',
            'Sidebar.js': ''
        },
        'utils': {
            'helpers.js': '',
            'constants.js': ''
        },
        'index.js': ''
    },
    'css': {
        'main.css': tailwindCss.trim()
    },
    'tailwind.config.js': tailwindConfig.trim(),
    'index.html': htmlTailwindCss(name).trim(),
    '.gitignore': gitignore.trim(),
    'README.md': '# Project Documentation',
    'package.json': JSON.stringify(packageJsontailwindCss(name,description), null, 2)
});
