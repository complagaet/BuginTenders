import type { Metadata } from 'next';
import { inter } from '@/src/app/fonts';
import './globals.css';
import Header from '@/src/components/Header';
import DictionaryProvider from '@/src/contexts/DictionaryContext';
import SearchProvider from '@/src/contexts/SearchContext';

export const metadata: Metadata = {
    title: 'Bügın’ Tenders',
    description: '...',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <DictionaryProvider>
                <SearchProvider>
                    <body
                        className={`
                            ${inter.className}
                            antialiased bg-[#EBE7E5] p-[16px] h-[100dvh] h-screen-fallback
                        `}
                    >
                        <Header />
                        {children}
                    </body>
                </SearchProvider>
            </DictionaryProvider>
        </html>
    );
}
