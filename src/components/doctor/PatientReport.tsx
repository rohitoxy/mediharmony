
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Download, 
  Search, 
  User, 
  Pill, 
  CheckCircle, 
  XCircle, 
  Clock 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type PatientMedicationSummary = {
  patientId: string;
  totalMedications: number;
  takenCount: number;
  missedCount: number;
  scheduledCount: number;
  adherenceRate: number;
  medications: {
    medicineName: string;
    dosage: string;
    totalDoses: number;
    takenDoses: number;
    missedDoses: number;
    adherenceRate: number;
  }[];
};

const PatientReport = () => {
  const [patientId, setPatientId] = useState("");
  const [reportData, setReportData] = useState<PatientMedicationSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportNotes, setReportNotes] = useState("");
  const { toast } = useToast();

  const generatePatientReport = async () => {
    if (!patientId) {
      toast({
        title: "Error",
        description: "Please enter a patient ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Fetch medication history for this patient
      const { data: historyData, error: historyError } = await supabase
        .from('medication_history')
        .select('*')
        .eq('patient_id', patientId);

      if (historyError) throw historyError;

      if (!historyData || historyData.length === 0) {
        toast({
          title: "No Data",
          description: "No medication history found for this patient",
          variant: "destructive",
        });
        setReportData(null);
        setLoading(false);
        return;
      }

      // Calculate summary statistics
      const totalMedications = historyData.length;
      const takenCount = historyData.filter(item => item.status === 'taken').length;
      const missedCount = historyData.filter(item => item.status === 'missed').length;
      const scheduledCount = historyData.filter(item => item.status === 'scheduled').length;
      const adherenceRate = totalMedications > 0 
        ? Math.round((takenCount / (takenCount + missedCount)) * 100) 
        : 0;

      // Group by medication name to get per-medication statistics
      const medicationGroups = historyData.reduce((acc, item) => {
        if (!acc[item.medicine_name]) {
          acc[item.medicine_name] = {
            medicineName: item.medicine_name,
            dosage: item.dosage,
            totalDoses: 0,
            takenDoses: 0,
            missedDoses: 0,
            adherenceRate: 0
          };
        }
        
        acc[item.medicine_name].totalDoses++;
        
        if (item.status === 'taken') {
          acc[item.medicine_name].takenDoses++;
        } else if (item.status === 'missed') {
          acc[item.medicine_name].missedDoses++;
        }
        
        return acc;
      }, {} as Record<string, typeof reportData['medications'][0]>);

      // Calculate adherence rate for each medication
      Object.values(medicationGroups).forEach(medication => {
        const completedDoses = medication.takenDoses + medication.missedDoses;
        medication.adherenceRate = completedDoses > 0
          ? Math.round((medication.takenDoses / completedDoses) * 100)
          : 0;
      });

      setReportData({
        patientId,
        totalMedications,
        takenCount,
        missedCount,
        scheduledCount,
        adherenceRate,
        medications: Object.values(medicationGroups)
      });

    } catch (error) {
      console.error('Error generating patient report:', error);
      toast({
        title: "Error",
        description: "Failed to generate patient report",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;

    // Create a report text
    let reportText = `MEDICATION REPORT FOR PATIENT: ${reportData.patientId}\n`;
    reportText += `Generated on: ${format(new Date(), 'MMMM d, yyyy')}\n\n`;
    
    reportText += `SUMMARY:\n`;
    reportText += `Total Medications: ${reportData.totalMedications}\n`;
    reportText += `Taken: ${reportData.takenCount}\n`;
    reportText += `Missed: ${reportData.missedCount}\n`;
    reportText += `Scheduled: ${reportData.scheduledCount}\n`;
    reportText += `Overall Adherence Rate: ${reportData.adherenceRate}%\n\n`;
    
    reportText += `MEDICATION DETAILS:\n`;
    reportData.medications.forEach(med => {
      reportText += `\n${med.medicineName} (${med.dosage}):\n`;
      reportText += `  Total Doses: ${med.totalDoses}\n`;
      reportText += `  Taken: ${med.takenDoses}\n`;
      reportText += `  Missed: ${med.missedDoses}\n`;
      reportText += `  Adherence Rate: ${med.adherenceRate}%\n`;
    });
    
    if (reportNotes) {
      reportText += `\nNOTES:\n${reportNotes}\n`;
    }
    
    // Create a download link for the text file
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `patient_${reportData.patientId}_report_${new Date().toISOString().slice(0,10)}.txt`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Patient Medication Report</h2>
      
      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow">
          <Label htmlFor="patientIdInput">Patient ID</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              id="patientIdInput"
              placeholder="Enter patient ID" 
              value={patientId} 
              onChange={(e) => setPatientId(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="self-end">
          <Button 
            onClick={generatePatientReport} 
            disabled={loading || !patientId}
            className="h-10"
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                Loading...
              </span>
            ) : (
              <span className="flex items-center">
                <Search className="w-4 h-4 mr-2" />
                Generate Report
              </span>
            )}
          </Button>
        </div>
      </div>
      
      {reportData && (
        <div className="mt-6 space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Patient Summary
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-500 text-sm">Total Medications</p>
                <p className="text-2xl font-semibold">{reportData.totalMedications}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-500 text-sm">Taken</p>
                <p className="text-2xl font-semibold text-green-600">{reportData.takenCount}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-500 text-sm">Missed</p>
                <p className="text-2xl font-semibold text-red-600">{reportData.missedCount}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-500 text-sm">Adherence Rate</p>
                <p className="text-2xl font-semibold">{reportData.adherenceRate}%</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Pill className="w-5 h-5 mr-2" />
              Medication Details
            </h3>
            
            <div className="space-y-4">
              {reportData.medications.map((med, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{med.medicineName}</h4>
                      <p className="text-sm text-gray-500">{med.dosage}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Adherence: {med.adherenceRate}%</p>
                      <div className="flex items-center mt-1 justify-end">
                        <span className="flex items-center text-sm text-green-600 mr-3">
                          <CheckCircle size={14} className="mr-1" /> {med.takenDoses}
                        </span>
                        <span className="flex items-center text-sm text-red-600">
                          <XCircle size={14} className="mr-1" /> {med.missedDoses}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="reportNotes">Report Notes</Label>
            <Textarea 
              id="reportNotes"
              placeholder="Add notes to this report..." 
              value={reportNotes} 
              onChange={(e) => setReportNotes(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
          
          <Button onClick={downloadReport} className="w-full flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      )}
    </Card>
  );
};

export default PatientReport;
