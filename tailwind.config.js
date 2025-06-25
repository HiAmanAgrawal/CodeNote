/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'fade-in': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-in': {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			'scale-in': {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			'bounce-in': {
  				'0%': {
  					transform: 'scale(0.3)',
  					opacity: '0'
  				},
  				'50%': {
  					transform: 'scale(1.05)'
  				},
  				'70%': {
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			'gradient': {
  				'0%': {
  					backgroundPosition: '0% 50%'
  				},
  				'50%': {
  					backgroundPosition: '100% 50%'
  				},
  				'100%': {
  					backgroundPosition: '0% 50%'
  				}
  			},
  			'typing': {
  				'0%': {
  					width: '0'
  				},
  				'100%': {
  					width: '100%'
  				}
  			},
  			'blink-caret': {
  				'0%, 100%': {
  					borderColor: 'transparent'
  				},
  				'50%': {
  					borderColor: 'hsl(var(--primary))'
  				}
  			},
  			'pulse-slow': {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.5'
  				}
  			},
  			'shimmer': {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(100%)'
  				}
  			},
  			'float': {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			},
  			'spin-slow': {
  				'0%': {
  					transform: 'rotate(0deg)'
  				},
  				'100%': {
  					transform: 'rotate(360deg)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.5s ease-in-out',
  			'slide-in': 'slide-in 0.3s ease-out',
  			'scale-in': 'scale-in 0.2s ease-out',
  			'bounce-in': 'bounce-in 0.6s ease-out',
  			'gradient': 'gradient 15s ease infinite',
  			'typing': 'typing 3.5s steps(40, end)',
  			'blink-caret': 'blink-caret 0.75s step-end infinite',
  			'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'shimmer': 'shimmer 2s infinite',
  			'float': 'float 3s ease-in-out infinite',
  			'spin-slow': 'spin-slow 3s linear infinite'
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'Fira Code',
  				'monospace'
  			]
  		},
  		fontSize: {
  			'2xs': [
  				'0.625rem',
  				{
  					lineHeight: '0.75rem'
  				}
  			],
  			'3xl': [
  				'1.875rem',
  				{
  					lineHeight: '2.25rem'
  				}
  			],
  			'4xl': [
  				'2.25rem',
  				{
  					lineHeight: '2.5rem'
  				}
  			],
  			'5xl': [
  				'3rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'6xl': [
  				'3.75rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'7xl': [
  				'4.5rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'8xl': [
  				'6rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'9xl': [
  				'8rem',
  				{
  					lineHeight: '1'
  				}
  			]
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'128': '32rem'
  		},
  		maxWidth: {
  			'8xl': '88rem',
  			'9xl': '96rem'
  		},
  		minHeight: {
  			'screen-75': '75vh',
  			'screen-50': '50vh'
  		},
  		height: {
  			'screen-75': '75vh',
  			'screen-50': '50vh'
  		},
  		width: {
  			'screen-75': '75vw',
  			'screen-50': '50vw'
  		},
  		zIndex: {
  			'60': '60',
  			'70': '70',
  			'80': '80',
  			'90': '90',
  			'100': '100'
  		},
  		backdropBlur: {
  			xs: '2px'
  		},
  		boxShadow: {
  			'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
  			'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  			'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  			'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
  			'glow-lg': '0 0 40px rgba(59, 130, 246, 0.3)'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  			'gradient-mesh': 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
  			'gradient-sunset': 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
  			'gradient-ocean': 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
  			'gradient-forest': 'linear-gradient(45deg, #11998e 0%, #38ef7d 100%)',
  			'gradient-fire': 'linear-gradient(45deg, #ff416c 0%, #ff4b2b 100%)'
  		},
  		backgroundSize: {
  			'auto': 'auto',
  			'cover': 'cover',
  			'contain': 'contain',
  			'200%': '200%',
  			'300%': '300%'
  		},
  		backgroundPosition: {
  			'center': 'center',
  			'top': 'top',
  			'bottom': 'bottom',
  			'left': 'left',
  			'right': 'right',
  			'top-left': 'top left',
  			'top-right': 'top right',
  			'bottom-left': 'bottom left',
  			'bottom-right': 'bottom right'
  		},
  		transitionProperty: {
  			'height': 'height',
  			'spacing': 'margin, padding',
  			'transform': 'transform',
  			'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
  			'opacity': 'opacity',
  			'shadow': 'box-shadow',
  			'filter': 'filter',
  			'backdrop': 'backdrop-filter'
  		},
  		transitionDuration: {
  			'400': '400ms',
  			'600': '600ms',
  			'800': '800ms',
  			'1000': '1000ms',
  			'1500': '1500ms',
  			'2000': '2000ms'
  		},
  		transitionTimingFunction: {
  			'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  			'bounce-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  			'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  			'ease-out-cubic': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  			'ease-in-cubic': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} 