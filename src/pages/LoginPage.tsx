import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/store/use-app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Scissors, Lock } from 'lucide-react';
import { toast } from 'sonner';
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginFormValues = z.infer<typeof loginSchema>;
export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAppStore((s) => s.login);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const onSubmit = (data: LoginFormValues) => {
    login(data.email);
    toast.success('Atelier access granted. Welcome back.');
    navigate('/dashboard');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-wheat px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1598300046657-64047b76200d?auto=format&fit=crop&q=80&w=2000"
          alt="Artisan Tailor Workshop"
          className="w-full h-full object-cover opacity-20 grayscale sepia"
        />
        <div className="absolute inset-0 bg-brand-soil/20 mix-blend-multiply" />
      </div>
      <Card className="w-full max-w-md relative z-10 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-brand-wheat/95 backdrop-blur-xl leather-edge">
        <div className="bg-brand-saddle h-3 w-full" />
        <CardHeader className="space-y-6 pt-12 pb-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-brand-saddle text-brand-wheat shadow-2xl scale-110">
            <Scissors className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-serif font-bold tracking-tight text-brand-soil">LEAfrique</CardTitle>
            <CardDescription className="text-brand-saddle/60 font-black uppercase tracking-[0.3em] text-[10px]">Master Artisan Portal</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-12 px-10">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-brand-soil/80 ml-1">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="artisan@leafrique.com"
                className="rounded-2xl h-14 bg-brand-wheat border-brand-tan focus:ring-brand-forest text-lg px-5 font-bold text-brand-soil"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive font-medium mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-brand-soil/80">Security Key</Label>
                <Button variant="link" className="px-0 h-auto text-xs text-brand-saddle font-bold hover:text-brand-forest">Lost Keys?</Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="rounded-2xl h-14 bg-brand-wheat border-brand-tan focus:ring-brand-forest text-lg px-5 font-bold text-brand-soil"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive font-medium mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-16 rounded-2xl bg-brand-forest hover:bg-brand-moss text-brand-wheat text-xl font-bold shadow-2xl transition-all active:scale-95 gap-3"
            >
              <Lock className="h-5 w-5" />
              Open Workshop
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="absolute bottom-8 text-[10px] font-bold uppercase tracking-[0.5em] text-brand-saddle/40 z-10">
        Est. 2024 • LEAfrique Artisans
      </div>
    </div>
  );
}