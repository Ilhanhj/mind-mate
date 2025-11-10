import BottomNav from '@/components/BottomNav';
import { LanguageProvider } from '@/context/language-context';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <div className="flex h-full flex-col bg-transparent">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <BottomNav />
      </div>
    </LanguageProvider>
  );
}
