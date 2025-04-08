
import React, { useEffect } from 'react';
import { 
  Pill, 
  Syringe, 
  Droplets, 
  Wind, 
  Paintbrush, 
  Heart 
} from 'lucide-react';

type MedicineType = 'pill' | 'injection' | 'liquid' | 'inhaler' | 'topical' | 'drops';

interface MedicineTypeSelectorProps {
  selectedType: MedicineType;
  onChange: (type: MedicineType) => void;
  onDosageFormatChange?: (format: string) => void;
}

export const MedicineTypeSelector: React.FC<MedicineTypeSelectorProps> = ({ 
  selectedType, 
  onChange,
  onDosageFormatChange 
}) => {
  // Medicine type options with icons, labels, and default dosage formats
  const medicineTypes: Array<{
    type: MedicineType;
    icon: React.ReactNode;
    label: string;
    color: string;
    defaultDosageFormat: string;
  }> = [
    { 
      type: 'pill', 
      icon: <Pill className="w-6 h-6" />, 
      label: 'Pills',
      color: 'text-blue-500',
      defaultDosageFormat: 'tablets' 
    },
    { 
      type: 'injection', 
      icon: <Syringe className="w-6 h-6" />, 
      label: 'Injection',
      color: 'text-red-500',
      defaultDosageFormat: 'mL' 
    },
    { 
      type: 'liquid', 
      icon: <Droplets className="w-6 h-6" />, 
      label: 'Liquid',
      color: 'text-teal-500',
      defaultDosageFormat: 'mL' 
    },
    { 
      type: 'inhaler', 
      icon: <Wind className="w-6 h-6" />, 
      label: 'Inhaler',
      color: 'text-purple-500',
      defaultDosageFormat: 'puffs' 
    },
    { 
      type: 'topical', 
      icon: <Paintbrush className="w-6 h-6" />, 
      label: 'Topical',
      color: 'text-amber-500',
      defaultDosageFormat: 'application' 
    },
    { 
      type: 'drops', 
      icon: <Heart className="w-6 h-6" />, 
      label: 'Drops',
      color: 'text-pink-500',
      defaultDosageFormat: 'drops' 
    }
  ];

  // Update dosage format when medicine type changes
  useEffect(() => {
    if (onDosageFormatChange) {
      const selectedMedicineType = medicineTypes.find(type => type.type === selectedType);
      if (selectedMedicineType) {
        onDosageFormatChange(selectedMedicineType.defaultDosageFormat);
      }
    }
  }, [selectedType, onDosageFormatChange]);

  return (
    <div className="grid grid-cols-3 gap-3">
      {medicineTypes.map(({ type, icon, label, color }) => (
        <div
          key={type}
          onClick={() => onChange(type)}
          className={`flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer transition-all ${
            selectedType === type 
              ? 'bg-primary/20 border-2 border-primary' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <div className={`mb-2 ${color}`}>
            {icon}
          </div>
          <span className="text-xs font-medium text-center">{label}</span>
        </div>
      ))}
    </div>
  );
};
