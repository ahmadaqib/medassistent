import { AHPForm } from '@/components/ahp-form';
import { ChatPopup } from '@/components/chat-popup';
import { PatientList } from '@/components/patient-list';
import { Stethoscope, FileText, Users } from 'lucide-react';
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
                Selamat Datang di Pusat Asisten Medis
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-primary-foreground/90">
                Platform terintegrasi untuk mendukung keputusan klinis Anda. Gunakan alat bertenaga AI kami untuk analisis rujukan pasien dan manajemen data.
            </p>
        </div>
      </header>
      
      <main className="relative -mt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-12">
            <section id="ahp-advisor">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-8 w-8 text-primary"/>
                <h2 className="text-3xl font-bold">Penasihat Rujukan AHP</h2>
              </div>
              <AHPForm />
            </section>

            <section id="patient-list">
               <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-primary"/>
                <h2 className="text-3xl font-bold">Daftar Pasien</h2>
              </div>
              <PatientList />
            </section>
        </div>
      </main>

      <footer className="text-center pb-8 text-sm text-muted-foreground">
          <p>Dibuat untuk Firebase Studio</p>
      </footer>
      
      <ChatPopup />
    </div>
  );
}
