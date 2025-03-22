
/**
 * Utility functions for testing application functionality
 */

import { Medication } from "@/types/medication";

// Random data generators
export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const generateRandomRoomNumber = (): string => {
  return Math.floor(Math.random() * 500 + 100).toString();
};

export const generateRandomPatientId = (): string => {
  return `P${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

export const generateRandomMedicineName = (): string => {
  const medicines = [
    "Aspirin", "Lisinopril", "Atorvastatin", "Levothyroxine", 
    "Metformin", "Amlodipine", "Metoprolol", "Omeprazole", 
    "Simvastatin", "Losartan", "Albuterol", "Gabapentin", 
    "Hydrochlorothiazide", "Sertraline", "Fluticasone"
  ];
  return medicines[Math.floor(Math.random() * medicines.length)];
};

export const generateRandomDosage = (): string => {
  const amounts = ["10mg", "20mg", "50mg", "100mg", "200mg", "500mg", "1g", "2g"];
  return amounts[Math.floor(Math.random() * amounts.length)];
};

export const generateRandomFoodTiming = (): string => {
  return ["before", "with", "after"][Math.floor(Math.random() * 3)];
};

export const generateRandomTime = (): string => {
  const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Test data generators
export const generateRandomMedication = (overrides = {}): Medication => {
  return {
    id: generateRandomId(),
    patientId: generateRandomPatientId(),
    roomNumber: generateRandomRoomNumber(),
    medicineName: generateRandomMedicineName(),
    dosage: generateRandomDosage(),
    durationDays: Math.floor(Math.random() * 30) + 1,
    foodTiming: generateRandomFoodTiming(),
    time: generateRandomTime(),
    notes: Math.random() > 0.5 ? "Take with water" : undefined,
    completed: Math.random() > 0.7,
    ...overrides
  };
};

export const generateMedicationList = (count: number, overrides = {}): Medication[] => {
  return Array(count).fill(null).map(() => generateRandomMedication(overrides));
};

// Test result tracking
export interface TestResult {
  name: string;
  success: boolean;
  message: string;
  error?: any;
}

export class TestSuite {
  private results: TestResult[] = [];
  
  runTest(name: string, testFn: () => void | Promise<void>): void {
    try {
      const result = testFn();
      if (result instanceof Promise) {
        result
          .then(() => {
            this.results.push({
              name,
              success: true,
              message: 'Test passed',
            });
          })
          .catch((error) => {
            this.results.push({
              name,
              success: false,
              message: `Test failed: ${error.message}`,
              error,
            });
          });
      } else {
        this.results.push({
          name,
          success: true,
          message: 'Test passed',
        });
      }
    } catch (error) {
      this.results.push({
        name,
        success: false,
        message: `Test failed: ${error.message}`,
        error,
      });
    }
  }
  
  async runAsyncTest(name: string, testFn: () => Promise<void>): Promise<void> {
    try {
      await testFn();
      this.results.push({
        name,
        success: true,
        message: 'Test passed',
      });
    } catch (error) {
      this.results.push({
        name,
        success: false,
        message: `Test failed: ${error.message}`,
        error,
      });
    }
  }
  
  get testResults(): TestResult[] {
    return this.results;
  }
  
  get summary(): { total: number; passed: number; failed: number } {
    const total = this.results.length;
    const passed = this.results.filter(r => r.success).length;
    return {
      total,
      passed,
      failed: total - passed
    };
  }
  
  printResults(): void {
    console.log('--- Test Results ---');
    this.results.forEach(result => {
      console.log(`${result.success ? '✅' : '❌'} ${result.name}: ${result.message}`);
      if (result.error) {
        console.error(result.error);
      }
    });
    const summary = this.summary;
    console.log(`---------------------`);
    console.log(`Total: ${summary.total}, Passed: ${summary.passed}, Failed: ${summary.failed}`);
  }
}
