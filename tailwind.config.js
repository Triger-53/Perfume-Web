/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./context/**/*.{js,ts,jsx,tsx}",
        "./hooks/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                'serif': ['Cormorant Garamond', 'serif'],
                'sans': ['Inter', 'sans-serif'],
            },
            colors: {
                'brand-primary': '#1a1a1a',
                'brand-primary-hover': '#333333',
                'brand-secondary': '#fdfaf6',
                'brand-accent': '#c5a47e',
                'brand-accent-hover': '#b8946b',
                'brand-light': '#f7f2ec',
            }
        },
    },
    plugins: [],
}
