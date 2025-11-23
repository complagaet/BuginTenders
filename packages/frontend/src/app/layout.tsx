import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/src/components/Header';
import DictionaryProvider from '@/src/contexts/DictionaryContext';

export const metadata: Metadata = {
    title: 'Bügın’ Tenders',
    description: '...',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
};

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <DictionaryProvider>
                <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#EBE7E5] p-[16px]`}>
                    <Header />
                    {children}
                </body>
            </DictionaryProvider>
        </html>
    );
}
