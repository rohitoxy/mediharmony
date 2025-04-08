
import { supabase, MedicationHistoryRow } from "@/integrations/supabase/client";
import { Medication } from "@/types/medication";

/**
 * Fetches an existing scheduled record for a medication
 */
export const getExistingScheduledRecord = async (medicationId: string) => {
  const { data: existingRecords, error: checkError } = await supabase
    .from('medication_history')
    .select('*')
    .eq('medication_id', medicationId)
    .eq('status', 'scheduled')
    .order('scheduled_time', { ascending: false })
    .limit(1);
  
  if (checkError) throw checkError;
  
  // Cast the data to our known type
  return existingRecords as unknown as MedicationHistoryRow[];
};

/**
 * Updates an existing medication history record to 'taken' status
 */
export const updateRecordAsTaken = async (recordId: string, currentTime: string) => {
  const { error } = await supabase
    .from('medication_history')
    .update({
      status: 'taken',
      taken_time: currentTime
    })
    .eq('id', recordId);
  
  if (error) throw error;
  
  return true;
};

/**
 * Updates an existing medication history record to 'missed' status
 */
export const updateRecordAsMissed = async (recordId: string) => {
  const { error } = await supabase
    .from('medication_history')
    .update({
      status: 'missed',
      notes: `Medication missed at ${new Date().toLocaleTimeString()}`
    })
    .eq('id', recordId);
  
  if (error) throw error;
  
  return true;
};

/**
 * Updates the medication's completed status in the medications table
 */
export const updateMedicationStatus = async (medicationId: string, completed: boolean) => {
  const { error } = await supabase
    .from('medications')
    .update({
      completed
    })
    .eq('id', medicationId);
    
  if (error) throw error;
  
  return true;
};

/**
 * Creates a new 'taken' medication history record
 */
export const createTakenRecord = async (medication: Medication, currentTime: string) => {
  const { error } = await supabase
    .from('medication_history')
    .insert([{
      medication_id: medication.id,
      patient_id: medication.patientId,
      medicine_name: medication.medicineName,
      dosage: medication.dosage,
      scheduled_time: currentTime,
      taken_time: currentTime,
      status: 'taken',
      notes: `Medication taken at ${new Date().toLocaleTimeString()}`
    }]);
  
  if (error) throw error;
  
  return true;
};

/**
 * Creates a new 'missed' medication history record
 */
export const createMissedRecord = async (medication: Medication) => {
  const { error } = await supabase
    .from('medication_history')
    .insert([{
      medication_id: medication.id,
      patient_id: medication.patientId,
      medicine_name: medication.medicineName,
      dosage: medication.dosage,
      scheduled_time: new Date().toISOString(),
      taken_time: null,
      status: 'missed',
      notes: `Medication missed at ${new Date().toLocaleTimeString()}`
    }]);
  
  if (error) throw error;
  
  return true;
};

/**
 * Creates scheduled dose records for a medication
 */
export const createScheduledDoses = async (medication: Medication) => {
  const scheduledDoses = [];
  const now = new Date();
  
  // Schedule doses for the duration of the medication
  for (let day = 0; day < medication.durationDays; day++) {
    // For each specific time in the medication
    for (const timeStr of medication.specificTimes || [medication.time]) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      const doseDate = new Date(now);
      doseDate.setDate(now.getDate() + day);
      doseDate.setHours(hours, minutes, 0, 0);
      
      // Only schedule future doses
      if (doseDate > now) {
        scheduledDoses.push({
          medication_id: medication.id,
          patient_id: medication.patientId,
          medicine_name: medication.medicineName,
          dosage: medication.dosage,
          scheduled_time: doseDate.toISOString(),
          status: 'scheduled',
          notes: `${medication.medicineType} ${medication.foodTiming} food`
        });
      }
    }
  }
  
  if (scheduledDoses.length > 0) {
    const { error } = await supabase
      .from('medication_history')
      .insert(scheduledDoses as any);
    
    if (error) throw error;
    
    console.log(`Scheduled ${scheduledDoses.length} doses for medication ${medication.id}`);
    return true;
  }
  
  return false;
};
