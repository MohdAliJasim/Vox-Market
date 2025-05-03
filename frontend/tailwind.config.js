/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			primary: {
				50: '#EEF2FF',
				100: '#D9E2FF',
				200: '#B0C4FF',
				300: '#85A5FF',
				400: '#5B87FF',
				500: '#3563E9', // primary color
				600: '#2A51C9',
				700: '#1F3E9D',
				800: '#152C70',
				900: '#0A1A43',
			  },
			  secondary: {
				50: '#E6F4F1',
				100: '#CCE8E3',
				200: '#99D1C7',
				300: '#66BAAB',
				400: '#33A38F',
				500: '#23856D', // secondary color
				600: '#1C6958',
				700: '#154E42',
				800: '#0E342C',
				900: '#071A16',
			  },
			  accent: {
				50: '#FFF4E5',
				100: '#FFE9CC',
				200: '#FFD399',
				300: '#FFBD66',
				400: '#FFA733',
				500: '#FF8B00', // accent color
				600: '#CC7000',
				700: '#995400',
				800: '#663800',
				900: '#331C00',
			  },
			  success: {
				500: '#00C48C',
			  },
			  warning: {
				500: '#FFBD00',
			  },
			  error: {
				500: '#FF3B30',
			  },
			  neutral: {
				50: '#F9FAFB',
				100: '#F3F4F6',
				200: '#E5E7EB',
				300: '#D1D5DB',
				400: '#9CA3AF',
				500: '#6B7280',
				600: '#4B5563',
				700: '#374151',
				800: '#1F2937',
				900: '#111827',
			  },
			},
			fontFamily: {
			  sans: [
				'"Inter"',
				'system-ui',
				'-apple-system',
				'BlinkMacSystemFont',
				'"Segoe UI"',
				'Roboto',
				'"Helvetica Neue"',
				'Arial',
				'sans-serif',
			  ],
			},
			spacing: {
			  '72': '18rem',
			  '84': '21rem',
			  '96': '24rem',
			},
			animation: {
			  'fade-in': 'fadeIn 0.5s ease-in',
			  'slide-up': 'slideUp 0.5s ease-out',
			},
			keyframes: {
			  fadeIn: {
				'0%': { opacity: '0' },
				'100%': { opacity: '1' },
			  },
			  slideUp: {
				'0%': { transform: 'translateY(20px)', opacity: '0' },
				'100%': { transform: 'translateY(0)', opacity: '1' },
			  },
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			poppins: ['Poppins', 'sans-serif']
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
