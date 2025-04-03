
export const getMedicationColor = (
  isCompleted: boolean,
  isAlertActive: boolean,
  timeStatus: "past" | "upcoming" | "future",
  priority: 'high' | 'medium' | 'low'
): string => {
  if (isCompleted) return "text-green-500";
  if (isAlertActive) return "text-red-500";
  if (timeStatus === "past") return "text-gray-400";
  
  switch(priority) {
    case 'high': return "text-red-600";
    case 'medium': return "text-amber-600";
    case 'low': return "text-green-600";
    default: return "text-primary";
  }
};

export const getIconBackgroundColor = (
  isCompleted: boolean,
  isAlertActive: boolean,
  priority: 'high' | 'medium' | 'low'
): string => {
  if (isCompleted) return 'bg-green-100';
  if (isAlertActive) return 'bg-red-100';
  
  switch(priority) {
    case 'high': return 'bg-red-100';
    case 'medium': return 'bg-amber-100';
    case 'low': return 'bg-green-100';
    default: return 'bg-primary/10';
  }
};

export const getPriorityBorderColor = (
  isCompleted: boolean,
  priority: 'high' | 'medium' | 'low'
): string => {
  if (isCompleted) return 'border-green-200';
  
  switch(priority) {
    case 'high': return 'border-red-300';
    case 'medium': return 'border-amber-200';
    case 'low': return 'border-green-200';
    default: return 'border-border/30';
  }
};

export const getStatusIndicatorColor = (
  isCompleted: boolean,
  timeStatus: "past" | "upcoming" | "future",
  priority: 'high' | 'medium' | 'low'
): string => {
  if (isCompleted) return 'bg-green-500';
  if (timeStatus === "upcoming") return 'bg-red-500';
  
  switch(priority) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-amber-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-300';
  }
};
