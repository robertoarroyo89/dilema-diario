/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Lienzo profundo con un punto azulado (la base sobre la que flota el glass)
        canvas: {
          DEFAULT: '#0a0c12',
          deep: '#070910',
        },
        // Etiquetas por opacidad, al estilo de los label colors de iOS
        ink: {
          DEFAULT: 'rgba(255,255,255,0.92)',
          muted: 'rgba(255,255,255,0.58)',
          faint: 'rgba(255,255,255,0.36)',
        },
        // La dualidad, ahora más vibrante para leerse sobre cristal
        optionA: {
          DEFAULT: '#ff9f45', // brasa
          tint: 'rgba(255,159,69,0.16)',
          ring: 'rgba(255,159,69,0.42)',
          glow: 'rgba(255,159,69,0.30)',
        },
        optionB: {
          DEFAULT: '#4fc3ff', // hielo
          tint: 'rgba(79,195,255,0.16)',
          ring: 'rgba(79,195,255,0.42)',
          glow: 'rgba(79,195,255,0.30)',
        },
      },
      fontFamily: {
        // SF Pro de serie en dispositivos Apple; degradado elegante en el resto
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Helvetica Neue"',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'system-ui',
          'sans-serif',
        ],
        mono: ['"SF Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.375rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        // Elevación iOS: brillo interior + sombra suave y difusa
        glass:
          'inset 0 1px 0 0 rgba(255,255,255,0.10), 0 10px 34px -10px rgba(0,0,0,0.65)',
        'glass-sm':
          'inset 0 1px 0 0 rgba(255,255,255,0.08), 0 6px 18px -8px rgba(0,0,0,0.55)',
        float: '0 16px 44px -12px rgba(0,0,0,0.75)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bar-grow': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        // Rebote tipo muelle de iOS al pulsar/revelar
        spring: {
          '0%': { transform: 'scale(0.94)', opacity: '0' },
          '55%': { transform: 'scale(1.015)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'bar-grow': 'bar-grow 0.75s cubic-bezier(0.34,1.4,0.5,1) forwards',
        spring: 'spring 0.42s cubic-bezier(0.34,1.4,0.5,1) forwards',
      },
    },
  },
  plugins: [],
}
