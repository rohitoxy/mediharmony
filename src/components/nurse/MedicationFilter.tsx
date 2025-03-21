
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MedicationFilterProps {
  filterStatus: 'all' | 'pending' | 'completed';
  setFilterStatus: (status: 'all' | 'pending' | 'completed') => void;
}

export const MedicationFilter = ({ filterStatus, setFilterStatus }: MedicationFilterProps) => {
  return (
    <div className="mb-4 flex items-center space-x-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Filter:</span>
      <div className="flex bg-card rounded-lg shadow-sm overflow-hidden border border-border/40">
        <Button 
          variant={filterStatus === 'all' ? "default" : "ghost"} 
          size="sm" 
          onClick={() => setFilterStatus('all')}
          className={`rounded-none px-3 ${filterStatus === 'all' ? '' : 'text-muted-foreground'}`}
        >
          All
        </Button>
        <Button 
          variant={filterStatus === 'pending' ? "default" : "ghost"} 
          size="sm" 
          onClick={() => setFilterStatus('pending')}
          className={`rounded-none px-3 ${filterStatus === 'pending' ? '' : 'text-muted-foreground'}`}
        >
          Pending
        </Button>
        <Button 
          variant={filterStatus === 'completed' ? "default" : "ghost"} 
          size="sm" 
          onClick={() => setFilterStatus('completed')}
          className={`rounded-none px-3 ${filterStatus === 'completed' ? '' : 'text-muted-foreground'}`}
        >
          Completed
        </Button>
      </div>
    </div>
  );
};
