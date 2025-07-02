import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { getPatients } from "@/services/patient-db";

export async function PatientList() {
    const patients = await getPatients();

    return (
        <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-xl border border-card-foreground/10 shadow-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Daftar Pasien
                </CardTitle>
                <CardDescription>
                    Daftar pasien yang tercatat di dalam sistem. Data ini diambil langsung dari database.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-card-foreground/10">
                            <TableHead>ID Pasien</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Usia</TableHead>
                            <TableHead>Kunjungan Terakhir</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {patients.map((patient) => (
                             <TableRow key={patient.id} className="border-card-foreground/10">
                                <TableCell className="font-mono text-xs">{patient.id}</TableCell>
                                <TableCell className="font-medium">{patient.name}</TableCell>
                                <TableCell>{patient.age}</TableCell>
                                <TableCell>{patient.lastVisit.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={patient.isActive ? "default" : "outline"}>
                                        {patient.isActive ? "Aktif" : "Tidak Aktif"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {patients.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Belum ada data pasien yang tercatat.</p>
                        <p className="text-sm">Gunakan asisten chat untuk menambahkan pasien baru.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
