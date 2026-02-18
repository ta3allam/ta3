import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				"pine-blue": {
					"50": "#eef6f5",
					"100": "#ddeeeb",
					"200": "#bcdcd8",
					"300": "#9acbc4",
					"400": "#78bab1",
					"500": "#57a89d",
					"600": "#45877e",
					"700": "#34655e",
					"800": "#23433f",
					"900": "#11221f",
					"950": "#0c1816"
				},
				"rich-mahogany": {
					"50": "#f9ecee",
					"100": "#f3d8de",
					"200": "#e7b1bc",
					"300": "#da8b9b",
					"400": "#ce6479",
					"500": "#c23d58",
					"600": "#9b3146",
					"700": "#742535",
					"800": "#4e1823",
					"900": "#270c12",
					"950": "#1b090c"
				},
				"wine-plum": {
					"50": "#f8ecee",
					"100": "#f2d9dd",
					"200": "#e5b3bb",
					"300": "#d88d98",
					"400": "#cb6776",
					"500": "#be4154",
					"600": "#983443",
					"700": "#722732",
					"800": "#4c1a22",
					"900": "#260d11",
					"950": "#1b090c"
				},
				"evergreen": {
					"50": "#e5fffe",
					"100": "#ccfffc",
					"200": "#99fffa",
					"300": "#66fff7",
					"400": "#33fff5",
					"500": "#00fff2",
					"600": "#00ccc2",
					"700": "#009991",
					"800": "#006661",
					"900": "#003330",
					"950": "#002422"
				},
				"soft-linen": {
					"50": "#f6f4ee",
					"100": "#ede9de",
					"200": "#dcd3bc",
					"300": "#cabe9b",
					"400": "#b9a879",
					"500": "#a79258",
					"600": "#867546",
					"700": "#645835",
					"800": "#433a23",
					"900": "#211d12",
					"950": "#17140c"
				},
				"sand": {
					"50": "#f6f4ee",
					"100": "#ede9de",
					"200": "#dcd3bc",
					"300": "#cabd9b",
					"400": "#b9a779",
					"500": "#a79158",
					"600": "#867446",
					"700": "#645735",
					"800": "#433a23",
					"900": "#211d12",
					"950": "#17140c"
				},
				"ivory-mist": "#F2F2F0"
			},
			fontFamily: {
				arabic: ['Cairo', 'system-ui', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'gradient-x': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(8px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gradient-x': 'gradient-x 8s ease infinite',
				'fade-in': 'fade-in 0.4s var(--transition-ease)'
			}
		}
	},
	plugins: [tailwindAnimate],
} satisfies Config;
