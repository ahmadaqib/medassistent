"use client";

import { useState, useRef, useEffect } from 'react';
import { chatConsultation } from '@/ai/flows/chat-consultation';
import type { ChatConsultationInput } from '@/ai/flows/chat-consultation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bot, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
    role: 'user' | 'model';
    content: string;
};

export function ChatConsultation() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewportRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollViewportRef.current) {
            scrollViewportRef.current.scrollTo({
                top: scrollViewportRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        const newMessages: Message[] = [...messages, userMessage];

        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const history: ChatConsultationInput['history'] = newMessages.map(msg => ({ role: msg.role, content: msg.content }));
            const response = await chatConsultation({ history });
            const modelMessage: Message = { role: 'model', content: response };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error: any) {
            console.error("Chat consultation failed:", error);
            let errorMsg = "Maaf, terjadi kesalahan saat memproses permintaan Anda.";
            // Deteksi error 503 dari Google Generative AI
            if (
                error?.message?.includes("503") ||
                error?.message?.toLowerCase().includes("service unavailable") ||
                error?.status === 503
            ) {
                errorMsg = "Maaf, layanan AI sedang sibuk. Silakan coba beberapa saat lagi.";
            }
            const errorMessage: Message = { role: 'model', content: errorMsg };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 pr-4 -mr-4" viewportRef={scrollViewportRef}>
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center text-muted-foreground pt-8 text-center">
                            <Bot className="h-10 w-10 mb-4" />
                            <h3 className="font-semibold text-lg">Selamat Datang!</h3>
                            <p className="text-sm whitespace-pre-wrap text-left bg-muted p-4 rounded-md mt-4">
                                {`Selamat datang di Asisten AI Medis.

Anda dapat:
1. Bertanya seputar informasi medis umum.
2. Mencatat data pasien baru.
   Contoh: 'Catat pasien Budi, 45 tahun, keluhan pusing.'
3. Mengatur status aktif dan tanggal kunjungan terakhir pasien (opsional).
   Contoh: 'Catat pasien Budi, 45 tahun, keluhan pusing, tidak aktif, terakhir berkunjung 1 Mei 2024.'

Jika status aktif dan tanggal kunjungan terakhir tidak disebutkan, akan otomatis diisi aktif dan hari ini.

Anda juga dapat mengubah atau menghapus data pasien berdasarkan ID.`}
                            </p>
                             <p className="text-xs mt-4 italic">
                                Selalu konsultasikan dengan tenaga medis profesional untuk diagnosis.
                            </p>
                        </div>
                    )}
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex items-start gap-3",
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            {message.role === 'model' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={cn(
                                    "rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap",
                                    message.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                )}
                            >
                                {message.content}
                            </div>
                            {message.role === 'user' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3 justify-start">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                                <Loader2 className="h-5 w-5 animate-spin"/>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
             <div className="mt-4 flex w-full items-center space-x-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ketik pertanyaan Anda di sini..."
                    disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
                    <span className="sr-only">Kirim</span>
                </Button>
            </div>
        </div>
    );
}
