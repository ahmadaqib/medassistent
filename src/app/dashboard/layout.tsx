import { AppHeader } from '@/components/app-header';
import { ChatPopup } from '@/components/chat-popup';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AppHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:p-8">
        {children}
      </main>
      <ChatPopup />
    </div>
  );
}
