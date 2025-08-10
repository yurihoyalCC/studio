import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { MainLayout } from '@/components/layout/main-layout';

export const metadata: Metadata = {
  title: 'Clearhold Exchange',
  description: 'Credit-based exchange for confirmed 3–7 night reservations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
