import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Tiva Labs "Black Gold Futurism" Color Palette
                background: '#0B0C15',
                primary: '#FFD700',
                secondary: '#C0C0C0',
                surface: 'rgba(255, 255, 255, 0.03)',
                'surface-hover': 'rgba(255, 255, 255, 0.08)',
                'text-body': '#A0A0A0',
                'text-heading': '#FFFFFF',
            },
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
                exo: ['Exo 2', 'sans-serif'],
            },
            backdropBlur: {
                glass: '12px',
            },
            borderRadius: {
                'glass': '16px',
            },
        },
    },
    plugins: [],
}

export default config
