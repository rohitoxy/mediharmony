
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MedicationCardActionsProps {
  id: string;
  completed?: boolean;
  isAlertActive: boolean;
  onComplete: () => void;
  onDelete: () => void;
  compact?: boolean;
  showDeleteButton?: boolean;
}

export const MedicationCardActions = ({
  id,
  completed,
  isAlertActive,
  onComplete,
  onDelete,
  compact = false,
  showDeleteButton = true
}: MedicationCardActionsProps) => {
  if (compact) {
    return (
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity rounded-md">
        <div className="flex gap-1">
          <Checkbox
            id={`checkbox-${id}`}
            checked={completed}
            onCheckedChange={onComplete}
            className={`h-4 w-4 border-2 bg-background ${isAlertActive ? 'animate-pulse' : ''}`}
          />
          {showDeleteButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-6 w-6 bg-white hover:bg-red-100 hover:text-red-600 rounded-full"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-2 right-2 flex gap-2 z-10">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`checkbox-${id}`}
          checked={completed}
          onCheckedChange={onComplete}
          className={`h-4 w-4 border-2 ${isAlertActive ? 'animate-pulse' : ''}`}
        />
      </div>
      {showDeleteButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="h-6 w-6 hover:bg-red-100 hover:text-red-600 rounded-full"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
