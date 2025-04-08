
import { useState } from "react";
import { Medication } from "@/types/medication";
import { useMedicationTaken } from "@/hooks/use-medication-taken";
import { useMedicationMissed } from "@/hooks/use-medication-missed";
import { useMedicationScheduler } from "@/hooks/use-medication-scheduler";
import { MedicationHistoryRow } from "@/integrations/supabase/client";

export interface MedicationHistoryItem extends MedicationHistoryRow {}

export const useMedicationHistory = () => {
  const { loading: loadingTaken, recordMedicationTaken } = useMedicationTaken();
  const { loading: loadingMissed, recordMedicationMissed } = useMedicationMissed();
  const { loading: loadingScheduler, scheduleMedicationDoses } = useMedicationScheduler();
  
  // Determine overall loading state
  const loading = loadingTaken || loadingMissed || loadingScheduler;

  return {
    loading,
    recordMedicationTaken,
    recordMedicationMissed,
    scheduleMedicationDoses
  };
};
