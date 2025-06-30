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
    { id: "PID_1678886400", name: "Siti Aminah", age: 30, lastVisit: "2024-05-10", status: "Active" },
    { id: "PID_1678886401", name: "Budi Santoso", age: 45, lastVisit: "2024-05-12", status: "Active" },
    { id: "PID_1678886402", name: "Rina Marlina", age: 28, lastVisit: "2024-04-28", status: "Discharged" },
];

export function PatientList() {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Patient List
                </CardTitle>
                <CardDescription>
                    A list of patients currently in the system. This is a demonstration and is not yet connected to a live database.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Age</TableHead>
                            <TableHead>Last Visit</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockPatients.map((patient) => (
                             <TableRow key={patient.id}>
                                <TableCell className="font-mono text-xs">{patient.id}</TableCell>
                                <TableCell className="font-medium">{patient.name}</TableCell>
                                <TableCell>{patient.age}</TableCell>
                                <TableCell>{patient.lastVisit}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={patient.status === "Active" ? "default" : "outline"}>
                                        {patient.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {mockPatients.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No patient data recorded yet.</p>
                        <p className="text-sm">Use the chat assistant to add new patients.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
