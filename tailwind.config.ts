import type { Config } from "tailwindcss";

const colors = require('tailwindcss/colors');

const spacing = require('./src/config/tailwind/spacing');
const spacingPercent = require('./src/config/tailwind/spacingPercent');
const spacingScreen = require('./src/config/tailwind/spacingScreen');
const fontSize = require('./src/config/tailwind/fontSize');
const fontWeight = require('./src/config/tailwind/fontWeight');
const designColors = require('./src/config/tailwind/colors');
const borderRadius = require('./src/config/tailwind/borderRadius');

const config: Config = {
    prefix: 'tw-',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/shared/utils/common.utils.ts',
    ],
    theme: {
        colors: {
            ...colors,
            ...designColors,
        },
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            lineClamp: {
                10: '10',
            },
            lineHeight: {
                '3.5': '0.875rem',
                '46px': '2.875rem',
                '67px': '67px',
            },
            fontSize,
            fontWeight,
            fontFamily: {
                'nunito-sans': ['var(--font-nunito)'],
                'passion-ae': ['var(--font-passion-ae)'],
                'passion-ag': ['var(--font-passion-ag)'],
                'passion-ai': ['var(--font-passion-ai)'],
            },
            minHeight: {
                ...spacing,
            },
            opacity: {
                80: '.8',
            },
            zIndex: {
                auto: 'auto',
                0: '0',
                10: '10',
                20: '20',
                30: '30',
                40: '40',
                50: '50',
                999: '999',
                1000: '1000',
                1050: '1050', // dropdown
                1052: '1052', // header, ant modal mask
                header: '1080',
                mask: '1088',
                1099: '1099', // ant modal wrapper content
                9999: '9999',
                10000: '10000',
            },
            inset: ({ negative }: any) => ({
                ...spacing,
                ...negative?.(spacing),
            }),
            height: {
                ...spacing,
                ...spacingPercent,
                ...spacingScreen,
            },
            width: {
                ...spacing,
                ...spacingPercent,
                ...spacingScreen,
            },
            maxHeight: {
                ...spacing,
            },
            maxWidth: {
                ...spacing,
            },
            minWidth: {
                ...spacing,
            },
            backgroundSize: {
                ...spacing,
            },
            margin: ({ negative }: any) => ({
                ...spacing,
                ...negative('spacing'),
            }),
            padding: {
                ...spacing,
            },
            borderRadius: {
                ...borderRadius,
            },
            gap: {
                '35': '8.75rem',
            },
            spacing: {
                ...spacing,
            },
            translate: {
                ...spacing,
            },
            transitionDuration: {
                '300': '300ms',
            },
        },
    },
    plugins: [],
};
export default config;
