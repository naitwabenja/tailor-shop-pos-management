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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name} className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-brand-brown/40 ml-1">
            {field.label}
          </Label>
          <Input
            id={field.name}
            type="number"
            step="0.1"
            value={draftMeasurements[field.name] ?? ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="h-14 text-xl font-bold bg-white/80 border-brand-brown/10 focus-visible:ring-brand-brown rounded-2xl shadow-sm text-brand-brown"
            placeholder="0.0"
          />
        </div>
      ))}
    </div>
  );
}