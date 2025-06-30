"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { ChatConsultation } from '@/components/chat-consultation';
import { MessageSquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';

const PopupContent = () => (
  <>
    <DialogHeader className="p-6 pb-2 border-b text-left">
      <DialogTitle>Chat Konsultasi</DialogTitle>
      <DialogDescription>
        Ajukan pertanyaan terkait kesehatan. Asisten AI akan membantu memberikan informasi umum dan mencatat data pasien.
      </DialogDescription>
    </DialogHeader>
    <div className="flex-1 min-h-0 p-6">
      <ChatConsultation />
    </div>
  </>
);

export function ChatPopup() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => { setIsClient(true) }, [])

  const isMobile = useIsMobile();

  if (!isClient) {
    return (
      <Button variant="default" size="icon" className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg z-50" disabled>
        <MessageSquare className="h-8 w-8" />
        <span className="sr-only">Buka Chat</span>
      </Button>
    );
  }
  
  const TriggerButton = (
    <Button variant="default" size="icon" className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg z-50">
      <MessageSquare className="h-8 w-8" />
      <span className="sr-only">Buka Chat</span>
    </Button>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          {TriggerButton}
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90dvh] p-0 flex flex-col">
          <PopupContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {TriggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg flex flex-col h-[80vh] max-h-[700px] p-0">
        <PopupContent />
      </DialogContent>
    </Dialog>
  );
}
