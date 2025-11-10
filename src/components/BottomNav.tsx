'use client';

import { cn } from '@/lib/utils';
import { Home, BookMarked, Wind, User, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/language-context';

export default function BottomNav() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();

  const navItems = [
    { href: '/home', icon: Home, label: dictionary.nav.home },
    { href: '/journal', icon: BookMarked, label: dictionary.nav.journal },
    { href: '/breathing', icon: Wind, label: dictionary.nav.breathe },
    { href: '/chat', icon: MessageCircle, label: dictionary.nav.chat },
    { href: '/profile', icon: User, label: dictionary.nav.profile },
  ];

  return (
    <nav className="flex-shrink-0 border-t bg-background/95 backdrop-blur-sm">
      <div className="mx-auto grid h-[68px] grid-cols-5 items-center px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-muted-foreground transition-colors hover:text-primary'
              )}
            >
              <item.icon
                className={cn(
                  'h-6 w-6 transition-all',
                  isActive ? 'text-primary' : ''
                )}
              />
              <span
                className={cn(
                  'text-[10px] font-medium transition-all',
                  isActive ? 'text-primary' : ''
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute -top-1 h-1 w-6 rounded-full bg-primary"
                  initial={false}
                  animate={{ y: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
