"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stethoscope, FileText, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navLinks = [
  { href: '/dashboard/referral-advisor', label: 'Penasihat Rujukan', icon: FileText },
  { href: '/dashboard/patient-list', label: 'Daftar Pasien', icon: Users },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <Link href="/" className="flex items-center gap-2 font-semibold text-lg mr-4">
        <Stethoscope className="h-6 w-6 text-primary" />
        <span className="font-bold">MedAsisten</span>
      </Link>
      <nav className="hidden h-full flex-1 md:flex">
        <ul className="flex h-full items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <li key={link.href} className="h-full">
              <Link
                href={link.href}
                className={cn(
                  'flex h-full items-center gap-2 transition-colors text-muted-foreground hover:text-foreground border-b-2',
                  pathname === link.href ? 'border-primary text-foreground' : 'border-transparent'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="ml-auto flex items-center gap-2">
         <Button variant="ghost" size="sm">Hubungi Sales</Button>
         <Button size="sm">Dapatkan Bantuan</Button>
      </div>
    </header>
  );
}
