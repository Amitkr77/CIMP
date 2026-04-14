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
        bg:       '#F0F4F9',
        'bg-alt': '#E8EEF6',
        surface:  '#FFFFFF',
        'surface-2': '#F7FAFD',
        border:   '#D1DDF0',
        'border-2': '#B8CDE8',
        navy:     '#0F2144',
        'navy-2': '#1A3560',
        brand:    '#1D4ED8',
        'brand-2':'#3B82F6',
        muted:    '#6B87A8',
        faint:    '#9BB3CC',
        secondary:'#3D5A80',
        amber:    '#D97706',
        'amber-bg':'#FEF3C7',
      },
      fontFamily: {
        display: ['Lora', 'serif'],
        body:    ['Plus Jakarta Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-up':    'fadeUp 0.4s ease forwards',
        'fade-in':    'fadeIn 0.3s ease forwards',
        'pulse-amber':'pulseAmber 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { from:{opacity:'0',transform:'translateY(12px)'}, to:{opacity:'1',transform:'translateY(0)'} },
        fadeIn:    { from:{opacity:'0'}, to:{opacity:'1'} },
        pulseAmber:{ '0%,100%':{boxShadow:'0 0 0 0 rgba(217,119,6,0)'}, '50%':{boxShadow:'0 0 0 6px rgba(217,119,6,0.2)'} },
      },
      boxShadow: {
        card:    '0 1px 3px rgba(15,33,68,0.06), 0 1px 2px rgba(15,33,68,0.04)',
        'card-md':'0 4px 12px rgba(15,33,68,0.08), 0 2px 4px rgba(15,33,68,0.04)',
        'card-lg':'0 10px 30px rgba(15,33,68,0.1), 0 4px 8px rgba(15,33,68,0.06)',
        blue:    '0 0 0 3px rgba(59,130,246,0.15), 0 4px 12px rgba(29,78,216,0.12)',
        amber:   '0 0 0 3px rgba(217,119,6,0.15),  0 4px 12px rgba(217,119,6,0.12)',
      },
    },
  },
  plugins: [],
};
