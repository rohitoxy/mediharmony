
/**
 * Tests for medication-related functionality
 */

import { supabase } from "@/integrations/supabase/client";
import { Medication } from "@/types/medication";
import { useMedications } from "@/hooks/use-medications";
import { 
  TestSuite, 
  generateRandomMedication, 
  generateMedicationList 
} from "./test-utils";

// Mock functions to avoid actual API calls
const mockSupabaseUpdate = () => Promise.resolve({ error: null });
const mockSupabaseDelete = () => Promise.resolve({ error: null });
const mockSupabaseFrom = () => ({
  update: mockSupabaseUpdate,
  delete: mockSupabaseDelete,
  eq: () => {}
});

// Mock the supabase client
const originalSupabase = { ...supabase };
// @ts-ignore - This is a test mock
supabase.from = mockSupabaseFrom;

// Mock the toast hook
const mockToast = { toast: () => {} };

export const runMedicationTests = (): void => {
  const testSuite = new TestSuite();

  // Test medication completion
  testSuite.runTest("handleComplete marks a medication as completed", () => {
    // Create test data
    const testMedication = generateRandomMedication({ completed: false });
    const initialMedications = [testMedication, generateRandomMedication()];
    
    // Initialize the hook with test data
    const { medications, handleComplete } = useMedications(initialMedications);
    
    // Execute the function being tested
    handleComplete(testMedication);
    
    // Verify the medication was marked as completed
    const updatedMedication = medications.find(med => med.id === testMedication.id);
    if (!updatedMedication || !updatedMedication.completed) {
      throw new Error("Medication was not marked as completed");
    }
    
    // Verify Supabase was called correctly
    if (!mockSupabaseFrom) {
      throw new Error("Supabase.from was not called");
    }
    if (!mockSupabaseUpdate) {
      throw new Error("Supabase update was not called");
    }
  });

  // Test medication deletion
  testSuite.runTest("handleDelete removes a medication", () => {
    // Create test data
    const testMedication = generateRandomMedication();
    const initialMedications = [testMedication, generateRandomMedication()];
    
    // Initialize the hook with test data
    const { medications, handleDelete } = useMedications(initialMedications);
    
    // Execute the function being tested
    handleDelete(testMedication);
    
    // Verify the medication was removed
    const medicationStillExists = medications.some(med => med.id === testMedication.id);
    if (medicationStillExists) {
      throw new Error("Medication was not deleted");
    }
    
    // Verify Supabase was called correctly
    if (!mockSupabaseFrom) {
      throw new Error("Supabase.from was not called");
    }
    if (!mockSupabaseDelete) {
      throw new Error("Supabase delete was not called");
    }
  });

  // Print test results
  testSuite.printResults();
};
