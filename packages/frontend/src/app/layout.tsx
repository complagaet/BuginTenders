import type { Metadata } from 'next';
import { inter } from '@/src/app/fonts';
import './globals.css';
import Header from '@/src/components/Header';
import DictionaryProvider from '@/src/contexts/DictionaryContext';
import SearchProvider from '@/src/contexts/SearchContext';
import UIProvider from '@/src/contexts/UIContext';
import React from 'react';
import Modal from '@/src/components/Modal';
import Overlay from '@/src/components/Overlay';

export const metadata: Metadata = {
    title: 'Bügın’ Tenders',
    description:
        'Найдите товары, надёжных поставщиков, честные цены и актуальные объявления — всё в одном умном поиске.',
    icons: {
        icon: '/favicon.png',
        shortcut: '/favicon.png',
        apple: '/apple-touch-icon.png',
    },
    openGraph: {
        title: 'Bügın’ Tenders',
        description:
            'Найдите товары, надёжных поставщиков, честные цены и актуальные объявления — всё в одном умном поиске.',
        url: 'https://bugintenders.lukoyanov.love',
        siteName: 'Bügın’ Tenders',
        images: [
            {
                url: '/og-image.png', // путь к твоей OG-картинке
                width: 1200,
                height: 630,
                alt: 'Bügın’ Tenders',
            },
        ],
        locale: 'ru_RU',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="kk">
            <UIProvider>
                <DictionaryProvider>
                    <SearchProvider>
                        <body
                            className={`
                                ${inter.className}
                                antialiased bg-[#EBE7E5] p-[16px] h-[100dvh] h-screen-fallback relative
                            `}
                        >
                            <Header />
                            {children}
                            <Modal />
                            <Overlay />
                        </body>
                    </SearchProvider>
                </DictionaryProvider>
            </UIProvider>
        </html>
    );
}
