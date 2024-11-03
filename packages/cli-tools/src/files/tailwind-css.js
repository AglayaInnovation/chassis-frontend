export const tailwindCss = `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
 `;

export const tailwindConfig = `
    /** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.html"],
    theme: {
        extend: {},
    },
    plugins: [],
    }
    `;
