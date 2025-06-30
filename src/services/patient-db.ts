'use server';

/**
 * @fileOverview A mock database service for managing patient data.
 */

export interface Patient {
    name: string;
    age: number;
    notes: string;
}

/**
 * Simulates adding a patient to a database.
 * In a real application, this would interact with a real database like Firestore or a SQL database.
 * @param patient The patient data to add.
 * @returns A promise that resolves with a success message and a mock patient ID.
 */
export async function addPatient(patient: Patient): Promise<{ success: boolean; message: string; patientId: string }> {
    console.log('Simulating adding patient to DB:', patient);

    // Generate a mock patient ID
    const patientId = `PID_${Date.now()}`;
    
    // Simulate a successful database write operation.
    const message = `Baik, data untuk pasien '${patient.name}' telah berhasil disimpan dengan ID: ${patientId}.`;

    console.log(message);

    return {
        success: true,
        message: message,
        patientId: patientId,
    };
}
