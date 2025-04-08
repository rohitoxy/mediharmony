
import { useState } from "react";
import { Medication } from "@/types/medication";
import { createScheduledDoses } from "@/services/medication-history-service";

export const useMedicationScheduler = () => {
  const [loading, setLoading] = useState(false);

  const scheduleMedicationDoses = async (medication: Medication) => {
    try {
      setLoading(true);
      return await createScheduledDoses(medication);
    } catch (error) {
      console.error('Error scheduling medication doses:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    scheduleMedicationDoses
  };
};
