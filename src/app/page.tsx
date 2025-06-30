import { AHPForm } from '@/components/ahp-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold font-headline text-foreground">
            AHP Referral Advisor
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Aplikasi pendukung keputusan untuk kelayakan rujukan pasien menggunakan metode Analytic Hierarchy Process (AHP).
          </p>
        </header>
        <main>
          <AHPForm />
        </main>
        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p>Dibuat untuk Firebase Studio</p>
        </footer>
      </div>
    </div>
  );
}
