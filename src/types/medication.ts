
// Types related to medications and alerts
export interface Medication {
  id: string;
  patientId: string;
  roomNumber: string;
  medicineName: string;
  time: string;
  completed?: boolean;
  dosage?: string;
  priority?: string;
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
  renotify?: boolean;
}
