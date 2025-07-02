'use server';
/**
 * @fileOverview A consultation chat AI agent.
 *
 * - chatConsultation - A function that handles the chat consultation process.
 * - ChatConsultationInput - The input type for the chatConsultation function.
 * - ChatConsultationOutput - The return type for the chatConsultation function.
 */

import {ai} from '@/ai/genkit';
import {addPatient as addPatientToDb, updatePatient as updatePatientToDb, deletePatient as deletePatientFromDb, getPatients as getPatientsFromDb, searchPatientsByName as searchPatientsByNameFromDb, searchPatientById as searchPatientByIdFromDb} from '@/services/patient-db';
import {z} from 'genkit';

type Message = {
  role: 'user' | 'model' | 'system';
  content: { text: string }[];
};

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatConsultationInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The chat history, where the last message is the current user query.'),
});
export type ChatConsultationInput = z.infer<typeof ChatConsultationInputSchema>;

const ChatConsultationOutputSchema = z.string();
export type ChatConsultationOutput = z.infer<typeof ChatConsultationOutputSchema>;

const addPatientTool = ai.defineTool(
  {
    name: 'addPatientData',
    description: "Gunakan tool ini untuk menambah data pasien baru. Bisa juga mengatur status aktif dan last visit jika disebutkan.",
    inputSchema: z.object({
      name: z.string().describe("Nama lengkap pasien."),
      age: z.number().describe("Umur pasien."),
      notes: z.string().describe("Catatan/keluhan pasien."),
      isActive: z.boolean().optional().describe("Status aktif pasien (opsional, default: true)."),
      lastVisit: z.string().optional().describe("Tanggal kunjungan terakhir (opsional, default: sekarang, format ISO)."),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const result = await addPatientToDb({
      ...input,
      lastVisit: input.lastVisit ? new Date(input.lastVisit) : undefined,
    });
    if (result.success) {
      return `✅ Data pasien '${input.name}' berhasil ditambahkan dengan ID: ${result.patientId}.`;
    } else {
      return `❌ Gagal menambah data pasien. ${result.message}`;
    }
  }
);

const updatePatientTool = ai.defineTool(
  {
    name: 'updatePatientData',
    description: "Gunakan tool ini untuk mengupdate data pasien, misal status aktif.",
    inputSchema: z.object({
      id: z.string().describe("ID pasien yang akan diupdate."),
      isActive: z.boolean().optional().describe("Status aktif pasien (opsional)."),
      name: z.string().optional().describe("Nama pasien (opsional)."),
      age: z.number().optional().describe("Umur pasien (opsional)."),
      notes: z.string().optional().describe("Catatan pasien (opsional)."),
      lastVisit: z.string().optional().describe("Tanggal kunjungan terakhir (opsional, format ISO)."),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const { id, lastVisit, ...rest } = input;
    const result = await updatePatientToDb(id, {
      ...rest,
      lastVisit: lastVisit ? new Date(lastVisit) : undefined,
    });
    if (result.success) {
      return `✅ Data pasien dengan ID: ${id} berhasil diupdate.`;
    } else {
      return `❌ Gagal mengupdate data pasien. ${result.message}`;
    }
  }
);

const deletePatientTool = ai.defineTool(
  {
    name: 'deletePatientData',
    description: "Gunakan tool ini untuk menghapus data pasien berdasarkan ID.",
    inputSchema: z.object({
      id: z.string().describe("ID pasien yang akan dihapus."),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const result = await deletePatientFromDb(input.id);
    if (result.success) {
      return `✅ Data pasien dengan ID: ${input.id} berhasil dihapus.`;
    } else {
      return `❌ Gagal menghapus data pasien. ${result.message}`;
    }
  }
);

// Tool untuk melihat daftar pasien
const getPatientsTool = ai.defineTool(
  {
    name: 'getPatientsData',
    description: "Gunakan tool ini untuk melihat daftar pasien yang tercatat di sistem.",
    inputSchema: z.object({}),
    outputSchema: z.string(),
  },
  async () => {
    const patients = await getPatientsFromDb();
    if (!patients.length) return "Belum ada data pasien yang tercatat.";
    // Tampilkan daftar nama, umur, dan ID singkat
    return patients.map(
      (p, i) =>
        `${i + 1}. ${p.name} (umur ${p.age}) - ID: ${p.id.slice(0, 8)}...`
    ).join('\n');
  }
);

// Tool untuk mencari pasien berdasarkan nama
const searchPatientsByNameTool = ai.defineTool(
  {
    name: 'searchPatientsByName',
    description: "Gunakan tool ini untuk mencari pasien berdasarkan nama.",
    inputSchema: z.object({
      name: z.string().describe("Nama pasien yang ingin dicari."),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const patients = await searchPatientsByNameFromDb(input.name);
    if (!patients.length) return `Tidak ditemukan pasien dengan nama mengandung '${input.name}'.`;
    return patients.map(
      (p, i) =>
        `${i + 1}. ${p.name} (umur ${p.age}) - ID: ${p.id.slice(0, 8)}...`
    ).join('\n');
  }
);

// Tool untuk mencari pasien berdasarkan ID
const searchPatientByIdTool = ai.defineTool(
  {
    name: 'searchPatientById',
    description: "Gunakan tool ini untuk mencari pasien berdasarkan ID.",
    inputSchema: z.object({
      id: z.string().describe("ID pasien yang ingin dicari."),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const patient = await searchPatientByIdFromDb(input.id);
    if (!patient) return `Tidak ditemukan pasien dengan ID '${input.id}'.`;
    return `Detail pasien:\nNama: ${patient.name}\nUmur: ${patient.age}\nCatatan: ${patient.notes}\nStatus: ${patient.isActive ? "Aktif" : "Tidak Aktif"}\nKunjungan terakhir: ${new Date(patient.lastVisit).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}\nID: ${patient.id}`;
  }
);

export async function chatConsultation(input: ChatConsultationInput): Promise<ChatConsultationOutput> {
  return chatConsultationFlow(input);
}

const chatConsultationFlow = ai.defineFlow(
  {
    name: 'chatConsultationFlow',
    inputSchema: ChatConsultationInputSchema,
    outputSchema: ChatConsultationOutputSchema,
  },
  async ({ history }) => {
    const systemPrompt = `You are a helpful medical assistant. Your role is to provide general medical information and advice for consultation purposes. 
You are not a real doctor and you must always remind the user to consult with a qualified healthcare professional for any serious medical concerns or before making any health decisions. Do not provide a diagnosis.
You can also record new patient data. If the user asks you to record a new patient, use the 'addPatientData' tool. Untuk mengupdate atau menghapus data pasien, gunakan 'updatePatientData' atau 'deletePatientData'. Ask for clarification if any information like name, age, or complaint is missing.
Anda juga dapat melihat, mencari daftar pasien berdasarkan nama, atau mencari detail pasien berdasarkan ID yang tercatat di sistem.
Respond in Bahasa Indonesia.`;

    const messages: Message[] = [
        {role: 'system', content: [{text: systemPrompt}]},
        ...history.map(msg => ({role: msg.role, content: [{text: msg.content}]})),
    ];

    const response = await ai.generate({
      messages: messages,
      tools: [addPatientTool, updatePatientTool, deletePatientTool, getPatientsTool, searchPatientsByNameTool, searchPatientByIdTool],
    });

    return response.text;
  }
);
