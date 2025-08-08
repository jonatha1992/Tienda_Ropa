/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1a1a1a',
                secondary: '#f2f2f2',
                accent: '#999999',
            },
            fontFamily: {
                sans: ['Helvetica', 'Arial', 'sans-serif'],
            },
        },
    },
    plugins: [],
}