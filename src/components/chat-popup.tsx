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
import { ChatConsultation } from '@/components/chat-consultation';
import { MessageSquare } from 'lucide-react';

export function ChatPopup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg z-50"
        >
          <MessageSquare className="h-8 w-8" />
          <span className="sr-only">Buka Chat</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] flex flex-col h-[80vh] max-h-[700px] p-0">
        <DialogHeader className="p-6 pb-2 border-b">
          <DialogTitle>Chat Konsultasi</DialogTitle>
          <DialogDescription>
            Ajukan pertanyaan terkait kesehatan Anda. Asisten AI akan membantu memberikan informasi umum.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 p-6">
             <ChatConsultation />
        </div>
      </DialogContent>
    </Dialog>
  );
}
