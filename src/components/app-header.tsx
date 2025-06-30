"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stethoscope, FileText, Users, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';

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
         <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm">Hubungi Sales</Button>
            <Button size="sm">Dapatkan Bantuan</Button>
         </div>
         
         <div className="md:hidden">
            <Sheet>
               <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                     <Menu className="h-5 w-5" />
                     <span className="sr-only">Buka Menu</span>
                  </Button>
               </SheetTrigger>
               <SheetContent side="left" className="bg-card/80 backdrop-blur-xl border-card-foreground/10 p-0">
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <div className="flex h-full flex-col">
                     <div className="p-6 border-b border-card-foreground/10">
                        <Link
                           href="/"
                           className="flex items-center gap-2 text-lg font-semibold"
                        >
                           <Stethoscope className="h-6 w-6 text-primary" />
                           <span className="font-bold">MedAsisten</span>
                        </Link>
                     </div>
                     <nav className="grid gap-2 p-6 text-lg font-medium">
                        {navLinks.map((link) => (
                           <Link
                              key={link.href}
                              href={link.href}
                              className={cn(
                                 "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                 pathname === link.href && "bg-muted text-primary"
                              )}
                           >
                              <link.icon className="h-5 w-5" />
                              {link.label}
                           </Link>
                        ))}
                     </nav>
                     <div className="mt-auto flex flex-col gap-2 p-6 border-t border-card-foreground/10">
                         <Button variant="ghost">Hubungi Sales</Button>
                         <Button>Dapatkan Bantuan</Button>
                     </div>
                  </div>
               </SheetContent>
            </Sheet>
         </div>
      </div>
    </header>
  );
}
