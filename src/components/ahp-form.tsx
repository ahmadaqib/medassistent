"use client";

import { useState, useMemo, type FC } from 'react';
import { generateReferralReason } from '@/ai/flows/generate-referral-reason';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { HeartPulse, ShieldCheck, Smile, Loader2, Info, Lightbulb } from 'lucide-react';

interface Result {
  score: number;
  recommendation: 'Likely Referral' | 'Unlikely Referral';
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

    const [result, setResult] = useState<Result | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

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

    const handleCalculate = async () => {
        setStatus('loading');
        setResult(null);

        const finalScore =
            (clinicalScore * (normalizedWeights.clinical / 100)) +
            (insuranceScore * (normalizedWeights.insurance / 100)) +
            (personalPreferenceScore * (normalizedWeights.personalPreference / 100));

        const roundedScore = Math.round(finalScore);
        const referralRecommended = roundedScore > 60;
        const recommendation = referralRecommended ? 'Likely Referral' : 'Unlikely Referral';

        try {
            const aiResult = await generateReferralReason({
                clinicalScore,
                insuranceScore,
                personalPreferenceScore,
                referralRecommended
            });

            setResult({
                score: roundedScore,
                recommendation,
                reason: aiResult.reason,
            });
            setStatus('success');
        } catch (error) {
            console.error("AI reason generation failed:", error);
            setResult({
                score: roundedScore,
                recommendation,
                reason: "Could not generate reason due to an error.",
            });
            setStatus('success');
        }
    };
    
    return (
        <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* LEFT COLUMN: INPUTS */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-foreground">Patient Criteria</h3>
                            <div className="space-y-6">
                                <SliderControl icon={HeartPulse} title="Clinical" value={clinicalScore} onValueChange={setClinicalScore} />
                                <SliderControl icon={ShieldCheck} title="Insurance" value={insuranceScore} onValueChange={setInsuranceScore} />
                                <SliderControl icon={Smile} title="Personal Preference" value={personalPreferenceScore} onValueChange={setPersonalPreferenceScore} />
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div>
                             <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-foreground">Criteria Weights</h3>
                                <div className="flex items-center space-x-2">
                                    <Switch id="default-weights" checked={useDefaultWeights} onCheckedChange={setUseDefaultWeights} />
                                    <Label htmlFor="default-weights">Use Defaults</Label>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <SliderControl icon={HeartPulse} title="Clinical" value={clinicalWeight} onValueChange={setClinicalWeight} disabled={useDefaultWeights} percentage={normalizedWeights.clinical} />
                                <SliderControl icon={ShieldCheck} title="Insurance" value={insuranceWeight} onValueChange={setInsuranceWeight} disabled={useDefaultWeights} percentage={normalizedWeights.insurance} />
                                <SliderControl icon={Smile} title="Personal Preference" value={personalPreferenceWeight} onValueChange={setPersonalPreferenceWeight} disabled={useDefaultWeights} percentage={normalizedWeights.personalPreference} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: RESULTS */}
                    <div className="bg-muted/50 rounded-lg p-6 flex flex-col justify-center items-center min-h-[300px] lg:min-h-full">
                        {status === 'idle' && (
                            <div className="text-center text-muted-foreground">
                                <Info className="mx-auto h-12 w-12 mb-4"/>
                                <h4 className="font-semibold text-lg">Awaiting Calculation</h4>
                                <p className="text-sm">Adjust criteria and weights, then click "Calculate" to see the referral recommendation.</p>
                            </div>
                        )}
                        {status === 'loading' && (
                             <div className="w-full space-y-4">
                                 <Skeleton className="h-8 w-1/2 mx-auto" />
                                 <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                                 <div className="space-y-2 pt-4">
                                     <Skeleton className="h-6 w-1/3" />
                                     <Skeleton className="h-4 w-full" />
                                     <Skeleton className="h-4 w-full" />
                                     <Skeleton className="h-4 w-3/4" />
                                 </div>
                             </div>
                        )}
                        {status === 'success' && result && (
                            <div className="text-center w-full animate-in fade-in">
                                <Badge variant={result.recommendation === 'Likely Referral' ? 'default' : 'destructive'} className={`text-lg px-4 py-1 mb-4 ${result.recommendation === 'Likely Referral' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                                    {result.recommendation}
                                </Badge>
                                <div className="text-6xl font-bold text-foreground">{result.score}<span className="text-2xl text-muted-foreground">/100</span></div>
                                <p className="text-muted-foreground font-medium mb-6">Overall Suitability Score</p>
                                
                                <Card className="text-left bg-background/70">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <Lightbulb className="h-5 w-5 text-primary"/>
                                            AI Generated Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-foreground">{result.reason}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-slate-50 p-6 border-t">
                <Button size="lg" onClick={handleCalculate} disabled={status === 'loading'} className="w-full sm:w-auto">
                    {status === 'loading' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating...</> : 'Calculate Recommendation'}
                </Button>
            </CardFooter>
        </Card>
    );
}
