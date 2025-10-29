/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        //Primary Brand
        'ims-primary': '#10B981',
        'ims-primary-light': '#D1FAE5', //background hover highlight
        'ims-primary-hover': '#059669', //  hover tone
        'ims-primary-hover-light': '#ECFDF5', // Very light hover background
        'ims-primary-border': '#6EE7B7', // Border accent for focus rings

        //Secondary & Supporting
        'ims-secondary': '#14B8A6',
        'ims-accent': '#22C55E', // Vibrant green accent for icons or states

        //Text & Content
        'ims-text-primary': '#1F2937', // Main text (headings)
        'ims-text-secondary': '#4B5563', // Secondary text (labels, metadata)
        'ims-text-tertiary': '#9CA3AF', // Placeholder / subtle text
        'ims-text-general': '#334155', // General readable text tone

        //landing page
        'landing-hero-bg': '#FFFFFF',
        'landing-section-alt': '#F9FAFB',
        'landing-accent-wash': '#F0FDF4',
        'landing-gradient-start': '#ECFDF5',
        'landing-gradient-end': '#FFFFFF',
        'landing-footer-bg': '#D1FAE5', // Soft mint
        'landing-footer-text': '#047857', // Dark green text
      },

      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },

      borderRadius: {
        '2xl': '1rem',
      },

      boxShadow: {
        'ims-card': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'ims-focus': '0 0 0 2px #A7F3D0',
      },
    },
  },
  plugins: [require('tailwindcss-primeui')],
  corePlugins: {
    preflight: false,
  },
};
