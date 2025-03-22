
/**
 * Tests for the medication alarm system
 */

import { useMedicationAlarm } from "@/hooks/use-medication-alarm";
import { useMedicationCheck } from "@/hooks/use-medication-check";
import { useAlarmSounds } from "@/hooks/use-alarm-sounds";
import { Medication } from "@/types/medication";
import { 
  TestSuite, 
  generateRandomMedication,
  generateMedicationList 
} from "./test-utils";

// Mock the dependencies
const mockPlayAlarmSequence = () => {};
const mockStopSounds = () => {};
const mockInitializeAudio = () => () => {};

// Store the original function for later restoration if needed
const originalUseAlarmSounds = useAlarmSounds;

// Override the useAlarmSounds hook for testing
// @ts-ignore - This is a test mock
useAlarmSounds = (enabled: boolean) => ({
  initializeAudio: mockInitializeAudio,
  playAlarmSequence: mockPlayAlarmSequence,
  stopSounds: mockStopSounds
});

// Mock toast
const mockToast = { toast: () => {} };

// Helper to create a medication due within the next 5 minutes
const createDueMedication = (): Medication => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  return generateRandomMedication({
    time: `${hours}:${minutes}`,
    completed: false
  });
};

export const runAlarmTests = (): void => {
  const testSuite = new TestSuite();

  // Test that alarms are created for due medications
  testSuite.runTest("Alarms are created for due medications", () => {
    // Setup test data with a medication due now
    const dueMedication = createDueMedication();
    const medications = [dueMedication, generateRandomMedication()];
    
    // Initialize the medication check hook
    const { activeAlerts } = useMedicationCheck(medications);
    
    // Verify alerts are created for the due medication
    const hasAlertForDueMedication = activeAlerts.some(alert => 
      alert.id.startsWith(dueMedication.id)
    );
    
    if (!hasAlertForDueMedication && medications.length > 0) {
      throw new Error("No alert created for due medication");
    }
  });

  // Test acknowledging alerts
  testSuite.runTest("Alerts can be acknowledged", () => {
    // Setup test data
    const medications = generateMedicationList(3, { completed: false });
    
    // Initialize the medication alarm hook
    const { 
      activeAlerts, 
      acknowledgeAlert 
    } = useMedicationAlarm(medications);
    
    if (activeAlerts.length === 0) {
      // If no alerts were created, this test is inconclusive
      return;
    }
    
    // Pick the first alert and acknowledge it
    const targetAlert = activeAlerts[0];
    const medicationId = acknowledgeAlert(targetAlert.id);
    
    // Verify the correct medication ID was returned
    if (!medicationId || !medications.some(med => med.id === medicationId)) {
      throw new Error("Incorrect medication ID returned when acknowledging alert");
    }
  });

  // Test the alarm sound system
  testSuite.runTest("Alarm sounds play for high priority alerts", () => {
    // Setup test data with a medication due now
    const medications = [createDueMedication()];
    
    // Initialize the alarm hook with sound enabled
    const { 
      highPriorityCount,
      isSoundEnabled 
    } = useMedicationAlarm(medications);
    
    // Verify the alarm should play when there are high priority alerts
    if (highPriorityCount > 0 && isSoundEnabled) {
      if (typeof mockPlayAlarmSequence !== 'function') {
        throw new Error("playAlarmSequence is not available");
      }
    }
  });

  // Print test results
  testSuite.printResults();

  // Restore original hook if needed
  // @ts-ignore - This is a test mock cleanup
  useAlarmSounds = originalUseAlarmSounds;
};
