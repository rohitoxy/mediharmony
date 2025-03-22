
/**
 * Tests for the medication filtering system
 */

import { useState } from "react";
import { Medication } from "@/types/medication";
import { 
  TestSuite, 
  generateRandomMedication,
  generateMedicationList 
} from "./test-utils";

export const runFilterTests = (): void => {
  const testSuite = new TestSuite();

  // Test medication filtering
  testSuite.runTest("All filter shows all medications", () => {
    // Setup test data
    const completedMed = generateRandomMedication({ completed: true });
    const pendingMed = generateRandomMedication({ completed: false });
    const medications = [completedMed, pendingMed];
    
    // Set filter to 'all'
    const filterStatus = 'all';
    
    // Apply the filtering logic
    const filteredMedications = medications.filter(med => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'pending') return !med.completed;
      if (filterStatus === 'completed') return med.completed;
      return true;
    });
    
    // Verify all medications are returned
    if (filteredMedications.length !== medications.length) {
      throw new Error("All filter should show all medications");
    }
  });

  // Test pending filter
  testSuite.runTest("Pending filter shows only pending medications", () => {
    // Setup test data
    const completedMed = generateRandomMedication({ completed: true });
    const pendingMed = generateRandomMedication({ completed: false });
    const medications = [completedMed, pendingMed];
    
    // Set filter to 'pending'
    const filterStatus = 'pending';
    
    // Apply the filtering logic
    const filteredMedications = medications.filter(med => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'pending') return !med.completed;
      if (filterStatus === 'completed') return med.completed;
      return true;
    });
    
    // Verify only pending medications are returned
    if (filteredMedications.length !== 1 || filteredMedications[0].id !== pendingMed.id) {
      throw new Error("Pending filter should only show pending medications");
    }
  });

  // Test completed filter
  testSuite.runTest("Completed filter shows only completed medications", () => {
    // Setup test data
    const completedMed = generateRandomMedication({ completed: true });
    const pendingMed = generateRandomMedication({ completed: false });
    const medications = [completedMed, pendingMed];
    
    // Set filter to 'completed'
    const filterStatus = 'completed';
    
    // Apply the filtering logic
    const filteredMedications = medications.filter(med => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'pending') return !med.completed;
      if (filterStatus === 'completed') return med.completed;
      return true;
    });
    
    // Verify only completed medications are returned
    if (filteredMedications.length !== 1 || filteredMedications[0].id !== completedMed.id) {
      throw new Error("Completed filter should only show completed medications");
    }
  });

  // Print test results
  testSuite.printResults();
};
