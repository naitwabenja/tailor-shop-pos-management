import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { usePOSStore } from '@/store/use-pos-store';
import { useShallow } from 'zustand/react/shallow';
export function MeasurementForm() {
  const draftMeasurements = usePOSStore(useShallow((s) => s.draftMeasurements));
  const updateDraftMeasurement = usePOSStore((s) => s.updateDraftMeasurement);
  const fields = [
    { name: 'neck', label: 'Neck' },
    { name: 'chest', label: 'Chest' },
    { name: 'waist', label: 'Waist' },
    { name: 'hips', label: 'Hips' },
    { name: 'shoulder', label: 'Shoulder' },
    { name: 'sleeve', label: 'Sleeve' },
    { name: 'inseam', label: 'Inseam' },
    { name: 'length', label: 'Length' },
  ];
  const handleChange = (name: string, value: string) => {
    if (value === '') {
      updateDraftMeasurement(name, 0);
      return;
    }
    const numValue = parseFloat(value);
    updateDraftMeasurement(name, isNaN(numValue) ? 0 : numValue);
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-1.5">
          <Label htmlFor={field.name} className="text-[9px] uppercase font-bold tracking-[0.2em] text-foreground/40 ml-1">
            {field.label}
          </Label>
          <Input
            id={field.name}
            type="number"
            step="0.1"
            value={draftMeasurements[field.name] ?? ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="h-11 text-lg font-bold bg-background border-border focus-visible:ring-primary rounded-xl shadow-sm text-foreground"
            placeholder="0.0"
          />
        </div>
      ))}
    </div>
  );
}