
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Medication } from "@/types/medication";

interface NurseStatsProps {
  medications: Medication[];
}

export const NurseStats = ({ medications }: NurseStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
        <div className="bg-primary/10 p-2 rounded-full mr-3">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-xl font-semibold text-gray-800">{medications.length}</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
        <div className="bg-yellow-100 p-2 rounded-full mr-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-xl font-semibold text-gray-800">
            {medications.filter(m => !m.completed).length}
          </p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
        <div className="bg-green-100 p-2 rounded-full mr-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-xl font-semibold text-gray-800">
            {medications.filter(m => m.completed).length}
          </p>
        </div>
      </div>
    </div>
  );
};
