/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // SmartBell design system colours
                'sb-bg': '#0d1117',
                'sb-sur': '#161b22',
                'sb-card': '#1c2333',
                'sb-bdr': '#30363d',
                'sb-muted': '#8b949e',
            },
            fontFamily: {
                mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
                sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-once': 'pulse 0.6s ease-in-out 1',
                'slide-down': 'slideDown 0.3s ease-out',
            },
            keyframes: {
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};