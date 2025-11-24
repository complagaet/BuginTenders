import { Lora, Inter } from 'next/font/google';

export const lora = Lora({
    variable: '--font-lora',
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '700'],
});

export const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '600', '700'],
});
