import { AHPForm } from '@/components/ahp-form';
import { ChatConsultation } from '@/components/chat-consultation';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold font-headline text-foreground">
            AHP Referral Advisor
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Aplikasi pendukung keputusan untuk kelayakan rujukan pasien menggunakan metode Analytic Hierarchy Process (AHP).
          </p>
        </header>
        <main className="space-y-8">
          <AHPForm />
          <ChatConsultation />
        </main>
        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p>Dibuat untuk Firebase Studio</p>
        </footer>
      </div>
    </div>
  );
}
