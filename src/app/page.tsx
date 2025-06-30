import { AHPForm } from '@/components/ahp-form';
import { ChatPopup } from '@/components/chat-popup';
import { PatientList } from '@/components/patient-list';
import { Stethoscope, FileText, Users, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <section className="relative py-20 md:py-32 text-center bg-background border-b">
          <div
            className="absolute inset-0"
            style={{
                backgroundImage: 'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                opacity: '0.2',
                maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, white 70%, transparent 110%)'
            }}
          />
          <div className="container mx-auto px-4 relative">
              <div className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-lg p-3 mb-6 shadow-sm">
                <Stethoscope className="h-10 w-10"/>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground leading-tight">
                  Pusat Asisten Medis Cerdas
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                  Tingkatkan efisiensi klinis dengan alat bantu AI untuk analisis rujukan pasien, pencatatan data, dan konsultasi cerdas.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" asChild className="w-full sm:w-auto">
                      <a href="#referral-advisor">Mulai Analisis Rujukan</a>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Jadwalkan Demo
                  </Button>
              </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-muted/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Fitur Unggulan</h2>
              <p className="mt-2 text-lg text-muted-foreground">Alat bantu cerdas untuk menyederhanakan alur kerja klinis Anda.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-background rounded-lg shadow-sm border flex flex-col items-center">
                <div className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-lg p-4 mb-4">
                  <FileText className="h-8 w-8"/>
                </div>
                <h3 className="text-xl font-semibold mb-2">Analisis Rujukan Cerdas</h3>
                <p className="text-muted-foreground">Dapatkan rekomendasi rujukan pasien yang didukung oleh data dan AI untuk pengambilan keputusan yang lebih baik.</p>
              </div>
              <div className="text-center p-8 bg-background rounded-lg shadow-sm border flex flex-col items-center">
                <div className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-lg p-4 mb-4">
                  <Users className="h-8 w-8"/>
                </div>
                <h3 className="text-xl font-semibold mb-2">Manajemen Pasien AI</h3>
                <p className="text-muted-foreground">Catat dan kelola data pasien dengan mudah melalui asisten AI, mengurangi pekerjaan administrasi manual.</p>
              </div>
              <div className="text-center p-8 bg-background rounded-lg shadow-sm border flex flex-col items-center">
                <div className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-lg p-4 mb-4">
                  <MessageSquare className="h-8 w-8"/>
                </div>
                <h3 className="text-xl font-semibold mb-2">Konsultasi Instan</h3>
                <p className="text-muted-foreground">Berikan jawaban instan untuk pertanyaan umum seputar kesehatan dengan asisten chat yang selalu tersedia.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="referral-advisor" className="py-16 sm:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="ahp-advisor" className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 max-w-md mx-auto mb-10 h-auto sm:h-10">
                <TabsTrigger value="ahp-advisor" className="py-2 sm:py-1.5">
                  <FileText className="mr-2 h-4 w-4" />
                  Penasihat Rujukan AHP
                </TabsTrigger>
                <TabsTrigger value="patient-list" className="py-2 sm:py-1.5">
                  <Users className="mr-2 h-4 w-4" />
                  Daftar Pasien
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ahp-advisor">
                <AHPForm />
              </TabsContent>
              <TabsContent value="patient-list">
                <PatientList />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <footer className="text-center py-8 text-sm text-muted-foreground border-t bg-background">
          <p>© {new Date().getFullYear()} Ideatech.Devs. Semua Hak Dilindungi.</p>
      </footer>
      
      <ChatPopup />
    </div>
  );
}
