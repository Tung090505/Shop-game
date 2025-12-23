/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#ffffff', // White for main backgrounds/cards
                secondary: '#f3f4f6', // Light Gray for page background
                'dark-bg': '#111827', // Deep Black/Blue for Hero/Footer/Dark Sections
                'card-dark': '#1f2937', // Darker Gray for dark mode cards
                accent: '#00e676', // Neon Green
                'accent-hover': '#00c853', // Darker Neon Green
                'gaming-blue': '#2979ff', // Bright Blue
                'gaming-red': '#ff1744', // Bright Red
                'text-main': '#111827', // Dark text for light mode
                'text-muted': '#6b7280', // Gray text
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
