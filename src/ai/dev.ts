import { config } from 'dotenv';
config();

import '@/ai/flows/generate-referral-reason.ts';
import '@/ai/flows/chat-consultation.ts';
import '@/ai/flows/extract-patient-data.ts';
