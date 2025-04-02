
// Types related to medications and alerts
export interface Medication {
  id: string;
  patientId: string; // This is now auto-generated and unique
  roomNumber: string;
  medicineName: string; // Changed from pillsName
  dosage: string;
  durationDays: number;
  foodTiming: string;
  time: string;
  notes?: string;
  completed?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export interface MedicationAlert {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  priority: 'high' | 'medium' | 'low';
  acknowledged: boolean;
}

export interface ExtendedNotificationOptions extends NotificationOptions {
  data?: {
    medicationId?: string;
    priority?: 'high' | 'medium' | 'low';
    timestamp?: number;
    [key: string]: any;
  };
  vibrate?: number[];
  renotify?: boolean;
}
