"use client";

import { useState, useMemo, type FC } from 'react';
import { generateReferralReason } from '@/ai/flows/generate-referral-reason';
import { extractPatientData } from '@/ai/flows/extract-patient-data';
import { calculateFuzzyRecommendation, type FuzzyResult } from '@/lib/fuzzy-logic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { HeartPulse, ShieldCheck, Smile, Loader2, Info, Lightbulb, Scale, BrainCircuit } from 'lucide-react';

interface AhpResult {
  score: number;
  recommendation: 'Kemungkinan Dirujuk' | 'Tidak Mungkin Dirujuk';
}

interface CombinedResult extends AhpResult {
  reason: string;
}

const SliderControl: FC<{
    icon: React.ElementType;
    title: string;
    description?: string;
    value: number;
    onValueChange: (value: number) => void;
    disabled?: boolean;
    percentage?: number;
}> = ({ icon: Icon, title, description, value, onValueChange, disabled, percentage }) => (
    <div className="space-y-3">
        <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-base">
                <Icon className="h-5 w-5 text-primary" />
                {title}
            </Label>
            <span className="w-16 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground font-mono bg-muted">
                {percentage !== undefined ? `${percentage.toFixed(0)}%` : value}
            </span>
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <Slider
            value={[value]}
            onValueChange={(vals) => onValueChange(vals[0])}
            max={100}
            step={1}
            disabled={disabled}
        />
    </div>
);

const ResultCard: FC<{
    icon: React.ElementType;
    title: string;
    score: number;
    description: string;
    level?: string;
}> = ({ icon: Icon, title, score, description, level }) => (
    <Card className="flex-1 bg-background/50">
        <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
                <Icon className="h-5 w-5 text-primary" />
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-4xl font-bold text-foreground">{score}<span className="text-xl text-muted-foreground">/100</span></div>
            <p className="text-xs text-muted-foreground">{description}</p>
            {level && <Badge variant="outline" className="mt-2">{level}</Badge>}
        </CardContent>
    </Card>
);

export function AHPForm() {
    // Patient criteria scores
    const [clinicalScore, setClinicalScore] = useState(50);
    const [insuranceScore, setInsuranceScore] = useState(50);
    const [personalPreferenceScore, setPersonalPreferenceScore] = useState(50);

    // Criteria weights
    const [clinicalWeight, setClinicalWeight] = useState(50);
    const [insuranceWeight, setInsuranceWeight] = useState(25);
    const [personalPreferenceWeight, setPersonalPreferenceWeight] = useState(25);
    const [useDefaultWeights, setUseDefaultWeights] = useState(true);

    const [ahpResult, setAhpResult] = useState<AhpResult | null>(null);
    const [fuzzyResult, setFuzzyResult] = useState<FuzzyResult | null>(null);
    const [aiReason, setAiReason] = useState<string>('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    
    // AI Data Extraction
    const [patientNotes, setPatientNotes] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);

    const normalizedWeights = useMemo(() => {
        if (useDefaultWeights) {
            return { clinical: 50, insurance: 25, personalPreference: 25 };
        }
        const totalWeight = clinicalWeight + insuranceWeight + personalPreferenceWeight;
        if (totalWeight === 0) return { clinical: 33.33, insurance: 33.33, personalPreference: 33.34 };

        return {
            clinical: (clinicalWeight / totalWeight) * 100,
            insurance: (insuranceWeight / totalWeight) * 100,
            personalPreference: (personalPreferenceWeight / totalWeight) * 100,
        };
    }, [useDefaultWeights, clinicalWeight, insuranceWeight, personalPreferenceWeight]);

    const handleAnalyzeWithAI = async () => {
        if (!patientNotes.trim()) return;
        setIsExtracting(true);
        try {
            const result = await extractPatientData({ notes: patientNotes });
            setClinicalScore(result.clinicalScore);
            setInsuranceScore(result.insuranceScore);
            setPersonalPreferenceScore(result.personalPreferenceScore);
        } catch (error) {
            console.error("AI data extraction failed:", error);
            // Optionally, show a toast notification to the user
        } finally {
            setIsExtracting(false);
        }
    };

    const handleCalculate = async () => {
        setStatus('loading');
        setAhpResult(null);
        setFuzzyResult(null);
        setAiReason('');

        // 1. AHP Calculation
        const ahpScore =
            (clinicalScore * (normalizedWeights.clinical / 100)) +
            (insuranceScore * (normalizedWeights.insurance / 100)) +
            (personalPreferenceScore * (normalizedWeights.personalPreference / 100));
        const roundedAhpScore = Math.round(ahpScore);
        const referralRecommended = roundedAhpScore > 60;
        const recommendation = referralRecommended ? 'Kemungkinan Dirujuk' : 'Tidak Mungkin Dirujuk';
        
        setAhpResult({ score: roundedAhpScore, recommendation });
        
        // 2. Fuzzy Logic Calculation
        const fuzzy = calculateFuzzyRecommendation({ clinicalScore, insuranceScore, personalPreferenceScore });
        setFuzzyResult(fuzzy);

        // 3. AI Reason Generation
        try {
            const aiResult = await generateReferralReason({
                clinicalScore,
                insuranceScore,
                personalPreferenceScore,
                ahpScore: roundedAhpScore,
                fuzzyScore: fuzzy.score,
                fuzzyLevel: fuzzy.level,
                referralRecommended
            });
            setAiReason(aiResult.reason);
        } catch (error) {
            console.error("AI reason generation failed:", error);
            setAiReason("Tidak dapat membuat ringkasan karena terjadi kesalahan.");
        } finally {
            setStatus('success');
        }
    };
    
    return (
        <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-xl border border-card-foreground/10 shadow-2xl">
            <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* LEFT COLUMN: INPUTS */}
                    <div className="space-y-6">
                        <Card className="bg-background/30 border-card-foreground/10">
                            <CardHeader>
                                <CardTitle className="text-xl">Ekstraksi Data AI</CardTitle>
                                <CardDescription>
                                    Tempelkan catatan pasien di bawah dan biarkan AI mengekstrak skor untuk Anda.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="e.g., Pasien, Bp. John Doe, mengeluh nyeri dada selama 3 hari. Memiliki riwayat penyakit jantung. Asuransi BPJS kelas 1. Pasien ingin segera dirujuk ke spesialis jantung..."
                                    value={patientNotes}
                                    onChange={(e) => setPatientNotes(e.target.value)}
                                    rows={5}
                                    disabled={isExtracting}
                                    className="bg-background/70"
                                />
                                <Button onClick={handleAnalyzeWithAI} disabled={isExtracting || !patientNotes.trim()} className="w-full">
                                    {isExtracting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menganalisis...
                                        </>
                                    ) : (
                                        "Analisis dengan AI"
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-foreground">Kriteria Pasien</h3>
                            <div className="space-y-6">
                                <SliderControl icon={HeartPulse} title="Klinis" value={clinicalScore} onValueChange={setClinicalScore} />
                                <SliderControl icon={ShieldCheck} title="Asuransi" value={insuranceScore} onValueChange={setInsuranceScore} />
                                <SliderControl icon={Smile} title="Preferensi Pribadi" value={personalPreferenceScore} onValueChange={setPersonalPreferenceScore} />
                            </div>
                        </div>

                        <Separator className="my-6 bg-card-foreground/10" />

                        <div>
                             <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-foreground">Bobot Kriteria (AHP)</h3>
                                <div className="flex items-center space-x-2">
                                    <Switch id="default-weights" checked={useDefaultWeights} onCheckedChange={setUseDefaultWeights} />
                                    <Label htmlFor="default-weights">Gunakan Default</Label>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <SliderControl icon={HeartPulse} title="Klinis" value={clinicalWeight} onValueChange={setClinicalWeight} disabled={useDefaultWeights} percentage={normalizedWeights.clinical} />
                                <SliderControl icon={ShieldCheck} title="Asuransi" value={insuranceWeight} onValueChange={setInsuranceWeight} disabled={useDefaultWeights} percentage={normalizedWeights.insurance} />
                                <SliderControl icon={Smile} title="Preferensi Pribadi" value={personalPreferenceWeight} onValueChange={setPersonalPreferenceWeight} disabled={useDefaultWeights} percentage={normalizedWeights.personalPreference} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: RESULTS */}
                    <div className="bg-background/30 border-card-foreground/10 rounded-lg p-6 flex flex-col justify-center items-center min-h-[300px] lg:min-h-full">
                        {status === 'idle' && (
                            <div className="text-center text-muted-foreground">
                                <Info className="mx-auto h-12 w-12 mb-4"/>
                                <h4 className="font-semibold text-lg">Menunggu Perhitungan</h4>
                                <p className="text-sm">Masukkan data pasien, lalu klik "Hitung" untuk melihat rekomendasi.</p>
                            </div>
                        )}
                        {status === 'loading' && (
                             <div className="w-full space-y-4">
                                 <Skeleton className="h-8 w-1/2 mx-auto" />
                                 <div className="flex gap-4">
                                     <Skeleton className="h-32 w-1/2 rounded-lg" />
                                     <Skeleton className="h-32 w-1/2 rounded-lg" />
                                 </div>
                                 <div className="space-y-2 pt-4">
                                     <Skeleton className="h-6 w-1/3" />
                                     <Skeleton className="h-4 w-full" />
                                     <Skeleton className="h-4 w-full" />
                                     <Skeleton className="h-4 w-3/4" />
                                 </div>
                             </div>
                        )}
                        {status === 'success' && ahpResult && fuzzyResult && (
                            <div className="text-center w-full animate-in fade-in">
                                <Badge variant={ahpResult.recommendation === 'Kemungkinan Dirujuk' ? 'default' : 'destructive'} className="text-lg px-4 py-1 mb-4">
                                    {ahpResult.recommendation}
                                </Badge>
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <ResultCard
                                        icon={Scale}
                                        title="Skor AHP"
                                        score={ahpResult.score}
                                        description="Skor rata-rata tertimbang"
                                    />
                                    <ResultCard
                                        icon={BrainCircuit}
                                        title="Logika Fuzzy"
                                        score={fuzzyResult.score}
                                        description="Prioritas berbasis aturan"
                                        level={fuzzyResult.level}
                                    />
                                </div>
                                
                                <Card className="text-left bg-transparent border-0 shadow-none">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <Lightbulb className="h-5 w-5 text-primary"/>
                                            Ringkasan oleh AI
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-foreground">{aiReason}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-black/5 dark:bg-white/5 p-6 border-t border-card-foreground/10">
                <Button size="lg" onClick={handleCalculate} disabled={status === 'loading'} className="w-full sm:w-auto">
                    {status === 'loading' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghitung...</> : 'Hitung Rekomendasi'}
                </Button>
            </CardFooter>
        </Card>
    );
}
