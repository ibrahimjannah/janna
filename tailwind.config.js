import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                playfair: ['"Playfair Display"', 'serif'],
                poppins: ['Poppins', 'sans-serif'],
            },
            colors: {
                'royal-gold': '#D4AF37',
                'royal-red': '#8B0000',
                'royal-brown': '#5D4037',
                'royal-cream': '#FFF8DC',
                'royal-spice': '#FF8C00'
            },
        },
    },

    plugins: [forms],
};
