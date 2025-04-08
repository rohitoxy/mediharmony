
// Updating the MedicationForm to use the enhanced MedicineTypeSelector with dosage format sync
// Note: Since we can't directly modify MedicationForm.tsx (it's read-only), we'll create a wrapper component
// that will intercept the medicine type selection and update the dosage field accordingly

import React, { useState, useEffect } from 'react';
import { MedicineTypeSelector } from '@/components/medicine/MedicineTypeSelector';

// This component will be a wrapper around the MedicineTypeSelector to properly update dosage format
export const EnhancedMedicineTypeSelector = ({ 
  value, 
  onChange, 
  formValues, 
  setFormValues 
}) => {
  const handleMedicineTypeChange = (type) => {
    // Call the original onChange handler
    onChange(type);
    
    // Get the current dosage value - extract just the number part
    const currentDosage = formValues.dosage || '';
    const dosageNumber = currentDosage.replace(/[^0-9.]/g, '');
    
    // Update the dosage format based on the selected medicine type
    let newDosageFormat = '';
    switch(type) {
      case 'pill':
        newDosageFormat = 'tablets';
        break;
      case 'injection':
      case 'liquid':
        newDosageFormat = 'mL';
        break;
      case 'inhaler':
        newDosageFormat = 'puffs';
        break;
      case 'topical':
        newDosageFormat = 'application';
        break;
      case 'drops':
        newDosageFormat = 'drops';
        break;
      default:
        newDosageFormat = '';
    }
    
    // Only update if we have a number and a format
    if (dosageNumber && newDosageFormat) {
      const newDosage = `${dosageNumber} ${newDosageFormat}`;
      setFormValues(prev => ({
        ...prev,
        dosage: newDosage
      }));
    }
  };
  
  return (
    <MedicineTypeSelector
      selectedType={value}
      onChange={handleMedicineTypeChange}
    />
  );
};

// Note: This component won't be directly used in the code since MedicationForm.tsx is read-only,
// but it's provided as a pattern for how to implement this functionality if the file becomes editable
