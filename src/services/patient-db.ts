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
    isActive?: boolean;      // opsional
    lastVisit?: Date;        // opsional
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
                isActive: patient.isActive ?? true,
                lastVisit: patient.lastVisit ?? new Date(),
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

// Update status atau data pasien
export async function updatePatient(id: string, data: Partial<PatientInput>) {
    try {
        const updated = await prisma.patient.update({
            where: { id },
            data,
        });
        return { success: true, message: "Data pasien berhasil diupdate.", patient: updated };
    } catch (error) {
        console.error("Failed to update patient:", error);
        return { success: false, message: "Gagal mengupdate data pasien." };
    }
}

// Hapus pasien
export async function deletePatient(id: string) {
    try {
        await prisma.patient.delete({ where: { id } });
        return { success: true, message: "Data pasien berhasil dihapus." };
    } catch (error) {
        console.error("Failed to delete patient:", error);
        return { success: false, message: "Gagal menghapus data pasien." };
    }
}

export async function searchPatientsByName(name: string) {
    try {
        const patients = await prisma.patient.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            },
            orderBy: {
                lastVisit: 'desc',
            },
        });
        return patients;
    } catch (error) {
        console.error("Failed to search patients:", error);
        return [];
    }
}

export async function searchPatientById(id: string) {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id },
        });
        return patient;
    } catch (error) {
        console.error("Failed to search patient by ID:", error);
        return null;
    }
}
