import { AHPForm } from '@/components/ahp-form';
import { ChatPopup } from '@/components/chat-popup';
import { PatientList } from '@/components/patient-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, FileText } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-muted">
      <header className="relative bg-primary text-primary-foreground">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x400.png"
            alt="Abstract background"
            data-ai-hint="medical abstract"
            fill
            className="object-cover opacity-10"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <Stethoscope className="mx-auto h-16 w-16 mb-4 text-primary-foreground/80"/>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Welcome to the Medical Assistant Hub
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-primary-foreground/90">
                An integrated platform to support your clinical decisions. Use our AI-powered tools for patient referral analysis and data management.
            </p>
        </div>
      </header>
      
      <main className="relative -mt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <Tabs defaultValue="ahp" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px] mx-auto h-auto bg-card shadow-md">
                    <TabsTrigger value="ahp" className="py-2.5 flex items-center gap-2">
                        <FileText className="h-5 w-5"/> AHP Referral Advisor
                    </TabsTrigger>
                    <TabsTrigger value="patients" className="py-2.5 flex items-center gap-2">
                        <Stethoscope className="h-5 w-5"/> Patient List
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="ahp" className="mt-6">
                    <AHPForm />
                </TabsContent>
                <TabsContent value="patients" className="mt-6">
                    <PatientList />
                </TabsContent>
            </Tabs>
        </div>
      </main>

      <footer className="text-center pb-8 text-sm text-muted-foreground">
          <p>Dibuat untuk Firebase Studio</p>
      </footer>
      
      <ChatPopup />
    </div>
  );
}
