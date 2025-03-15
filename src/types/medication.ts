
// Types related to medications and alerts
export interface Medication {
  id: string;
  patientId: string;
  roomNumber: string;
  medicineName: string;
  dosage: string;
  durationDays: number;
  foodTiming: string;
  time: string;
  notes?: string;
  completed?: boolean;
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
