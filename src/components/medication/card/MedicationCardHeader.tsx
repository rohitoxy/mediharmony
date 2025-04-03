
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle } from "lucide-react";

interface MedicationCardHeaderProps {
  time: string;
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
  timeStatus: "past" | "upcoming" | "future";
}

// Function to determine the priority badge styling
const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
  switch(priority) {
    case 'high':
      return {
        bg: 'bg-red-100',
        text: 'text-red-600',
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
        label: 'High'
      };
    case 'medium':
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-600',
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
        label: 'Medium'
      };
    case 'low':
      return {
        bg: 'bg-green-100',
        text: 'text-green-600',
        icon: <Clock className="w-3 h-3 mr-1" />,
        label: 'Low'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
        label: 'Medium'
      };
  }
};

export const MedicationCardHeader = ({ time, priority, completed, timeStatus }: MedicationCardHeaderProps) => {
  const isAlertActive = timeStatus === "upcoming" && !completed;
  const priorityBadge = getPriorityBadge(priority);

  return (
    <div className="flex justify-between items-center">
      <Badge
        variant="outline"
        className={`${
          completed
            ? "bg-green-100 text-green-800"
            : timeStatus === "upcoming"
            ? "bg-red-500 text-white animate-pulse"
            : timeStatus === "past"
            ? "bg-muted"
            : "bg-primary text-primary-foreground"
        } flex items-center`}
      >
        <Clock className="w-3 h-3 mr-1" />
        {time}
      </Badge>
      
      {/* Priority Badge */}
      <Badge
        variant="outline"
        className={`${priorityBadge.bg} ${priorityBadge.text} flex items-center`}
      >
        {priorityBadge.icon}
        {priorityBadge.label}
      </Badge>
    </div>
  );
};
