
import { Volume2, VolumeX, Bell, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface NurseHeaderProps {
  currentTime: Date;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  highPriorityCount: number;
  setShowAlertsPanel: (show: boolean) => void;
}

export const NurseHeader = ({
  currentTime,
  isSoundEnabled,
  toggleSound,
  highPriorityCount,
  setShowAlertsPanel
}: NurseHeaderProps) => {
  // Create a local state for more accurate time display
  const [localTime, setLocalTime] = useState(new Date());
  
  // Update the time every second for more accuracy
  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg shadow-sm border border-border/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Calendar className="text-primary h-6 w-6 mr-2" />
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-primary">
              Medication Schedule
            </h2>
            <p className="text-muted-foreground text-sm">
              {currentTime.toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="bg-card px-3 py-1.5 rounded-md shadow-sm text-primary font-medium border border-border/30">
            <Clock className="inline-block h-4 w-4 mr-1.5 text-primary" />
            {formatTime(localTime)}
          </div>
          
          {highPriorityCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAlertsPanel(true)}
              className="relative bg-card border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <Bell className="h-4 w-4 text-red-500" />
              <Badge 
                className="absolute -top-2 -right-2 bg-red-500 text-white animate-pulse" 
                variant="destructive"
              >
                {highPriorityCount}
              </Badge>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSound}
            title={isSoundEnabled ? "Disable sounds" : "Enable sounds"}
            className={`bg-card ${isSoundEnabled ? 'border-primary/30' : 'border-muted-foreground/30'}`}
          >
            {isSoundEnabled ? (
              <Volume2 className="h-4 w-4 text-primary" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only ml-2 md:not-sr-only text-xs">{isSoundEnabled ? "Sound On" : "Sound Off"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
