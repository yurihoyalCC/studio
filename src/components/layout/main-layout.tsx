"use client";

import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { useEffect, useState } from 'react';

export function MainLayout({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Toaster />
        </div>
    );
}
