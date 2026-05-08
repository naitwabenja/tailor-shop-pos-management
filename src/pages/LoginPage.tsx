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
    toast.success('Welcome back to LEAfrique');
    navigate('/dashboard');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80&w=2000" 
          alt="Workshop Background" 
          className="w-full h-full object-cover opacity-10 dark:opacity-5 grayscale"
        />
      </div>
      <Card className="w-full max-w-md relative z-10 border-none shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-indigo-600 h-2 w-full" />
        <CardHeader className="space-y-4 pt-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
            <Scissors className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">LEAfrique</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Atelier Management System</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-10 px-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="tailor@leafrique.com" 
                className="rounded-xl h-12"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" className="px-0 h-auto text-xs text-indigo-600 font-bold">Forgot Access?</Button>
              </div>
              <Input 
                id="password" 
                type="password" 
                className="rounded-xl h-12"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-lg shadow-indigo-100 dark:shadow-none gap-2"
            >
              <Lock className="h-5 w-5" />
              Sign Into Atelier
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}