
import { useState, useEffect } from "react";
import { supabase, MedicationHistoryRow } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Calendar, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type MedicationHistoryItem = {
  id: string;
  medication_id: string;
  patient_id: string;
  medicine_name: string;
  dosage: string;
  scheduled_time: string;
  taken_time: string | null;
  status: 'scheduled' | 'taken' | 'missed';
  notes: string | null;
  created_at: string;
};

interface MedicationHistoryProps {
  refreshTrigger?: number;
  onMedicationDelete?: (medicationId: string) => void;
}

const MedicationHistory = ({ refreshTrigger = 0, onMedicationDelete }: MedicationHistoryProps) => {
  const [history, setHistory] = useState<MedicationHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<MedicationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientFilter, setPatientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [medicationIds, setMedicationIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchMedicationHistory();
  }, [refreshTrigger]);

  useEffect(() => {
    // Apply filters whenever filter values or history changes
    let filtered = history;

    if (patientFilter) {
      filtered = filtered.filter(item => 
        item.patient_id.toLowerCase().includes(patientFilter.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredHistory(filtered);
    
    // Update the set of unique medication IDs
    const uniqueIds = new Set<string>();
    filtered.forEach(item => uniqueIds.add(item.medication_id));
    setMedicationIds(uniqueIds);
  }, [patientFilter, statusFilter, history]);

  const fetchMedicationHistory = async () => {
    try {
      setLoading(true);
      // Using 'from' with a type cast to handle the new medication_history table
      const { data, error } = await supabase
        .from('medication_history')
        .select('*')
        .order('scheduled_time', { ascending: false });

      if (error) throw error;

      if (data) {
        // Cast the data to the MedicationHistoryItem type
        const typedData = data as unknown as MedicationHistoryItem[];
        setHistory(typedData);
        setFilteredHistory(typedData);
        
        // Update the set of unique medication IDs
        const uniqueIds = new Set<string>();
        typedData.forEach(item => uniqueIds.add(item.medication_id));
        setMedicationIds(uniqueIds);
      }
    } catch (error) {
      console.error('Error fetching medication history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch medication history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    // Create a CSV string from the filtered history data
    const headers = ["Patient ID", "Medicine", "Dosage", "Scheduled Time", "Taken Time", "Status", "Notes"];
    
    const csvRows = [
      headers.join(','),
      ...filteredHistory.map(item => [
        item.patient_id,
        item.medicine_name,
        item.dosage,
        new Date(item.scheduled_time).toLocaleString(),
        item.taken_time ? new Date(item.taken_time).toLocaleString() : 'N/A',
        item.status,
        item.notes || 'N/A'
      ].join(','))
    ];
    
    const csvString = csvRows.join('\n');
    
    // Create a download link for the CSV
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `medication_report_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'taken':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Taken</Badge>;
      case 'missed':
        return <Badge className="bg-red-500"><AlertCircle className="w-3 h-3 mr-1" /> Missed</Badge>;
      default:
        return <Badge className="bg-blue-500"><Clock className="w-3 h-3 mr-1" /> Scheduled</Badge>;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Medication History</h2>
        <Button onClick={generateReport} className="flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Label htmlFor="patientFilter">Patient ID</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              id="patientFilter"
              placeholder="Filter by patient" 
              value={patientFilter} 
              onChange={(e) => setPatientFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="statusFilter">Status</Label>
          <select 
            id="statusFilter"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="taken">Taken</option>
            <option value="missed">Missed</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          No medication history found matching your criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Medicine</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Scheduled Time</TableHead>
                <TableHead>Taken Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.patient_id}</TableCell>
                  <TableCell>{item.medicine_name}</TableCell>
                  <TableCell>{item.dosage}</TableCell>
                  <TableCell>{format(new Date(item.scheduled_time), 'MMM d, yyyy h:mm a')}</TableCell>
                  <TableCell>
                    {item.taken_time 
                      ? format(new Date(item.taken_time), 'MMM d, yyyy h:mm:ss a') 
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell>{item.notes || '—'}</TableCell>
                  <TableCell>
                    {onMedicationDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMedicationDelete(item.medication_id)}
                        className="h-8 w-8 hover:bg-red-100 hover:text-red-600 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {medicationIds.size > 0 && onMedicationDelete && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Medication Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from(medicationIds).map(medicationId => {
              const item = history.find(h => h.medication_id === medicationId);
              if (!item) return null;
              
              return (
                <Card key={medicationId} className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{item.medicine_name}</h4>
                      <p className="text-sm text-gray-600">Patient: {item.patient_id}</p>
                      <p className="text-sm text-gray-600">Dosage: {item.dosage}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMedicationDelete(medicationId)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};

export default MedicationHistory;
