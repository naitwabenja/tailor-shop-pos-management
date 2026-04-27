import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { usePOSStore } from '@/store/use-pos-store';
const measurementSchema = z.object({
  neck: z.coerce.number().optional(),
  chest: z.coerce.number().optional(),
  waist: z.coerce.number().optional(),
  hips: z.coerce.number().optional(),
  shoulder: z.coerce.number().optional(),
  sleeve: z.coerce.number().optional(),
  inseam: z.coerce.number().optional(),
  length: z.coerce.number().optional(),
});
type MeasurementValues = z.infer<typeof measurementSchema>;
export function MeasurementForm() {
  const draftMeasurements = usePOSStore((s) => s.draftMeasurements);
  const updateDraftMeasurement = usePOSStore((s) => s.updateDraftMeasurement);
  const { register } = useForm<MeasurementValues>({
    resolver: zodResolver(measurementSchema),
    values: draftMeasurements as MeasurementValues,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateDraftMeasurement(name, parseFloat(value) || 0);
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
            step="0.25"
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