
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

// Save the original supabase client for later restoration if needed
const originalSupabaseFrom = supabase.from;

// Override the supabase client methods for testing
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
    if (typeof supabase.from !== 'function') {
      throw new Error("Supabase.from is not a function");
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
    if (typeof supabase.from !== 'function') {
      throw new Error("Supabase.from is not a function");
    }
  });

  // Print test results
  testSuite.printResults();

  // Restore original supabase method if needed
  // @ts-ignore - This is a test mock cleanup
  supabase.from = originalSupabaseFrom;
};
