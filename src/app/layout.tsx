import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import { LanguageProvider } from '@/context/language-context';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'MindMate',
  description: 'Your friendly guide to mental wellness.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn(poppins.className, 'antialiased')}>
        <LanguageProvider>
          <div className="relative mx-auto flex h-screen max-h-[896px] w-full max-w-[414px] flex-col overflow-hidden rounded-[40px] border-8 border-black bg-background shadow-2xl bg-aurora">
            {children}
            <Toaster />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
