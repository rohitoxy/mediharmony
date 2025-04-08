
/**
 * Utilities for medication handling
 */

export type MedicineType = 'pill' | 'injection' | 'liquid' | 'inhaler' | 'topical' | 'drops';

// Map medicine types to their default dosage formats
export const getMedicineDosageFormat = (medicineType: MedicineType): string => {
  switch(medicineType) {
    case 'pill':
      return 'tablets';
    case 'injection':
    case 'liquid':
      return 'mL';
    case 'inhaler':
      return 'puffs';
    case 'topical':
      return 'application';
    case 'drops':
      return 'drops';
    default:
      return '';
  }
};

// Extract just the numeric part of a dosage string
export const extractDosageNumber = (dosage: string): string => {
  return dosage.replace(/[^0-9.]/g, '');
};

// Format a dosage with the appropriate unit based on medicine type
export const formatDosage = (dosageNumber: string, medicineType: MedicineType): string => {
  const format = getMedicineDosageFormat(medicineType);
  return `${dosageNumber} ${format}`;
};
