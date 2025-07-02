'use server';

/**
 * @fileOverview A database service for managing patient data using Prisma and PostgreSQL.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PatientInput {
    name: string;
    age: number;
    notes: string;
}

/**
 * Adds a patient to the database.
 * @param patient The patient data to add.
 * @returns A promise that resolves with a success message and the new patient's ID.
 */
export async function addPatient(patient: PatientInput): Promise<{ success: boolean; message: string; patientId: string }> {
    try {
        const newPatient = await prisma.patient.create({
            data: {
                name: patient.name,
                age: patient.age,
                notes: patient.notes,
            },
        });

        const message = `Baik, data untuk pasien '${newPatient.name}' telah berhasil disimpan dengan ID: ${newPatient.id}.`;
        console.log(message);

        return {
            success: true,
            message: message,
            patientId: newPatient.id,
        };
    } catch (error) {
        console.error("Failed to add patient to DB:", error);
        const errorMessage = "Maaf, terjadi kesalahan saat menyimpan data pasien ke database.";
        return {
            success: false,
            message: errorMessage,
            patientId: '',
        };
    }
}


/**
 * Retrieves all patients from the database, ordered by the last visit.
 * @returns A promise that resolves to an array of patients.
 */
export async function getPatients() {
    try {
        const patients = await prisma.patient.findMany({
            orderBy: {
                lastVisit: 'desc',
            },
        });
        return patients;
    } catch (error) {
        console.error("Failed to retrieve patients:", error);
        // In a real app, you might want to throw the error or handle it differently.
        return [];
    }
}
