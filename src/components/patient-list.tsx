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

const mockPatients = [
    { id: "PID_1678886400", name: "Siti Aminah", age: 30, lastVisit: "2024-05-10", status: "Aktif" },
    { id: "PID_1678886401", name: "Budi Santoso", age: 45, lastVisit: "2024-05-12", status: "Aktif" },
    { id: "PID_1678886402", name: "Rina Marlina", age: 28, lastVisit: "2024-04-28", status: "Selesai" },
];

export function PatientList() {
    return (
        <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-xl border border-card-foreground/10 shadow-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Daftar Pasien
                </CardTitle>
                <CardDescription>
                    Daftar pasien yang saat ini ada di sistem. Ini adalah demonstrasi dan belum terhubung ke database langsung.
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
                        {mockPatients.map((patient) => (
                             <TableRow key={patient.id} className="border-card-foreground/10">
                                <TableCell className="font-mono text-xs">{patient.id}</TableCell>
                                <TableCell className="font-medium">{patient.name}</TableCell>
                                <TableCell>{patient.age}</TableCell>
                                <TableCell>{patient.lastVisit}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={patient.status === "Aktif" ? "default" : "outline"}>
                                        {patient.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {mockPatients.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Belum ada data pasien yang tercatat.</p>
                        <p className="text-sm">Gunakan asisten chat untuk menambahkan pasien baru.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
