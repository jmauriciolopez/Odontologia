import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ["class"],
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // HSL tokens
                border:     "hsl(var(--border))",
                input:      "hsl(var(--input))",
                ring:       "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT:    "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT:    "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT:    "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT:    "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT:    "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT:    "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT:    "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Brand palette (from reference)
                brand: {
                    50:  "var(--brand-50)",
                    100: "var(--brand-100)",
                    200: "var(--brand-200)",
                    300: "var(--brand-300)",
                    400: "var(--brand-400)",
                    500: "var(--brand-500)",
                    600: "var(--brand-600)",
                    700: "var(--brand-700)",
                    800: "var(--brand-800)",
                    900: "var(--brand-900)",
                    950: "var(--brand-950)",
                },
                // Dental aliases
                dental: {
                    blue:      "hsl(var(--primary))",
                    teal:      "hsl(var(--secondary))",
                    porcelain: "hsl(var(--background))",
                },
            },
            borderRadius: {
                dental: "var(--radius)",
                xl:     "calc(var(--radius) + 4px)",
                '2xl':  "calc(var(--radius) + 8px)",
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'medical':      '0 4px 20px -2px rgba(14,165,233,.08)',
                'medical-hover':'0 10px 25px -3px rgba(14,165,233,.12)',
                'glass':        '0 8px 32px 0 rgba(31,38,135,.07)',
                'premium':      '0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06)',
                'premium-lg':   '0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05)',
                'premium-xl':   '0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)',
                'modal':        '0 30px 60px -12px rgba(0,0,0,.25), 0 18px 36px -18px rgba(0,0,0,.3)',
            },
            animation: {
                'fade-in-up':    'fade-in-up .5s cubic-bezier(.16,1,.3,1) forwards',
                'scale-in':      'scale-in .4s cubic-bezier(.16,1,.3,1) forwards',
                'accordion-down':'accordion-down 0.2s ease-out',
                'accordion-up':  'accordion-up 0.2s ease-out',
            },
            keyframes: {
                'fade-in-up': {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to:   { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    from: { opacity: '0', transform: 'scale(.9) translateY(10px)' },
                    to:   { opacity: '1', transform: 'scale(1) translateY(0)' },
                },
                'accordion-down': {
                    from: { height: '0' },
                    to:   { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to:   { height: '0' },
                },
            },
        },
    },
    plugins: [],
    safelist: [
      'dark',
      'style-glass',
      'style-liquid',
      'style-bento',
      'style-neumorphic',
      'premium-mode',
    ],
}

export default config
