
import React, { useState } from 'react';
import { Clock, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DosageScheduleSelectorProps {
  frequency: string;
  specificTimes: string[];
  onFrequencyChange: (frequency: string) => void;
  onSpecificTimesChange: (times: string[]) => void;
}

export const DosageScheduleSelector: React.FC<DosageScheduleSelectorProps> = ({
  frequency,
  specificTimes,
  onFrequencyChange,
  onSpecificTimesChange
}) => {
  const [newTime, setNewTime] = useState('');

  const handleAddTime = () => {
    if (!newTime) return;
    
    // Add new time to specific times
    const updatedTimes = [...specificTimes, newTime].sort((a, b) => {
      // Sort times chronologically
      return a.localeCompare(b);
    });
    
    onSpecificTimesChange(updatedTimes);
    setNewTime('');
  };

  const handleRemoveTime = (indexToRemove: number) => {
    const updatedTimes = specificTimes.filter((_, index) => index !== indexToRemove);
    onSpecificTimesChange(updatedTimes);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Frequency</label>
        <Select value={frequency} onValueChange={onFrequencyChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="once">Once a day</SelectItem>
            <SelectItem value="twice">Twice a day</SelectItem>
            <SelectItem value="three">Three times a day</SelectItem>
            <SelectItem value="four">Four times a day</SelectItem>
            <SelectItem value="custom">Custom schedule</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Specific Times</label>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="pr-10"
            />
            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <Button 
            type="button" 
            onClick={handleAddTime}
            size="icon"
            className="bg-primary"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {specificTimes.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {specificTimes.map((time, index) => (
            <div 
              key={index} 
              className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center"
            >
              <Clock className="h-3 w-3 mr-1" />
              {time}
              <button 
                type="button"
                onClick={() => handleRemoveTime(index)}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
