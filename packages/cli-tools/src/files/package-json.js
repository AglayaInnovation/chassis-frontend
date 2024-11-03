export const packageJsonTailwindCss = (name, description)=>({
    name: name,
    version: '1.0.0',
    description: description,
    scripts: {
        build: 'tailwindcss -i ./css/main.css -o ./css/tailwind.css',
        watch: 'tailwindcss -i ./css/main.css -o ./css/tailwind.css --watch'
    },
    keywords: [],
    author: '',
    license: 'ISC',
    devDependencies: {
        tailwindcss: '^3.3.0'
    }
})

export const packageJson = (name, description)=>({
    name: name,
    version: '1.0.0',
    description: description,
    main: 'index.js',
    scripts: {
        test: 'echo "Error: no test specified" && exit 1'
    },
    keywords: [],
    author: '',
    license: 'ISC'
})
