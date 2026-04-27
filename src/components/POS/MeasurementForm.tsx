import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { usePOSStore } from '@/store/use-pos-store';
const measurementSchema = z.object({
  neck: z.union([z.coerce.number(), z.literal('')]).optional(),
  chest: z.union([z.coerce.number(), z.literal('')]).optional(),
  waist: z.union([z.coerce.number(), z.literal('')]).optional(),
  hips: z.union([z.coerce.number(), z.literal('')]).optional(),
  shoulder: z.union([z.coerce.number(), z.literal('')]).optional(),
  sleeve: z.union([z.coerce.number(), z.literal('')]).optional(),
  inseam: z.union([z.coerce.number(), z.literal('')]).optional(),
  length: z.union([z.coerce.number(), z.literal('')]).optional(),
});
type MeasurementValues = z.infer<typeof measurementSchema>;
export function MeasurementForm() {
  const draftMeasurements = usePOSStore((s) => s.draftMeasurements);
  const updateDraftMeasurement = usePOSStore((s) => s.updateDraftMeasurement);
  const { register } = useForm<MeasurementValues>({
    resolver: zodResolver(measurementSchema),
    defaultValues: (draftMeasurements || {}) as MeasurementValues,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Graceful handling of empty or invalid input
    if (value === '') {
      updateDraftMeasurement(name, 0);
      return;
    }
    const numValue = parseFloat(value);
    updateDraftMeasurement(name, isNaN(numValue) ? 0 : numValue);
  };
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
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-1.5">
          <Label htmlFor={field.name} className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            {field.label}
          </Label>
          <Input
            id={field.name}
            type="number"
            step="0.1"
            {...register(field.name as keyof MeasurementValues)}
            onChange={handleChange}
            className="h-12 text-lg font-bold bg-white border-slate-200 focus:ring-indigo-500 rounded-xl"
            placeholder="0.0"
          />
        </div>
      ))}
    </div>
  );
}