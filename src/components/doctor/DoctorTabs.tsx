
import { useState } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, ClipboardList, FileText } from "lucide-react";

type DoctorTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const DoctorTabs = ({ activeTab, onTabChange }: DoctorTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-3 rounded-xl p-1 mb-6">
      <TabsTrigger 
        value="add-medication" 
        className={`rounded-lg py-3 ${activeTab === 'add-medication' ? 'bg-primary text-primary-foreground' : ''}`}
        onClick={() => onTabChange('add-medication')}
      >
        <Pill className="h-4 w-4 mr-2" />
        Add Medication
      </TabsTrigger>
      
      <TabsTrigger 
        value="medication-history" 
        className={`rounded-lg py-3 ${activeTab === 'medication-history' ? 'bg-primary text-primary-foreground' : ''}`}
        onClick={() => onTabChange('medication-history')}
      >
        <ClipboardList className="h-4 w-4 mr-2" />
        Medication History
      </TabsTrigger>
      
      <TabsTrigger 
        value="patient-report" 
        className={`rounded-lg py-3 ${activeTab === 'patient-report' ? 'bg-primary text-primary-foreground' : ''}`}
        onClick={() => onTabChange('patient-report')}
      >
        <FileText className="h-4 w-4 mr-2" />
        Patient Report
      </TabsTrigger>
    </TabsList>
  );
};

export default DoctorTabs;
