/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        colors: {
          'ims-primary': '#6941C6', // Purple for primary actions, buttons, links
          'ims-primary-light': '#E9D5FF', // Light purple for badges and highlights
          'ims-primary-hover': '#5B21B6', // Darker purple for hover states
          'ims-secondary': '#1D4ED8', // Dark blue for secondary actions
          'ims-bg-dark': '#1F1F1F', // Dark background (outer shell)
          'ims-bg-light': '#F9FAFB', // Light gray background
          'ims-surface': '#FFFFFF', // White surfaces (cards, table)
          'ims-text-primary': '#111827', // Dark text (headings, primary content)
          'ims-text-secondary': '#6B7280', // Medium gray text (labels, secondary)
          'ims-text-tertiary': '#9CA3AF', // Light gray text (placeholders)
          'ims-success': '#10B981', // Green for success states
          'ims-error': '#EF4444', // Red for delete/error actions
          'ims-warning': '#F59E0B', // Orange for warnings
          'ims-border': '#E5E7EB', // Light borders (table, inputs)
          'ims-border-dark': '#D1D5DB', // Slightly darker borders
          'ims-hover': '#F3F4F6', // Hover background for rows
          'ims-badge': '#F3E8FF', // Light purple badge background
          'ims-text-primary': '#666666', // greyish
          'ims-text-secondary':"#222222" //light greyish
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'], // H1/H2
        sans: ['Roboto', 'ui-sans-serif', 'system-ui'], // H3–P, body,p
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable to avoid conflicts with PrimeNG
  },
};
