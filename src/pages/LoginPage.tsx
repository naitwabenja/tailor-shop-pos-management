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
    <div className="min-h-screen flex items-center justify-center bg-brand-beige/50 dark:bg-brand-slate px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80&w=2000"
          alt="Workshop Background"
          className="w-full h-full object-cover opacity-15 dark:opacity-5 grayscale sepia transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-brand-brown/10 mix-blend-multiply" />
      </div>
      <Card className="w-full max-w-md relative z-10 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/90 backdrop-blur-xl">
        <div className="bg-brand-brown h-2.5 w-full" />
        <CardHeader className="space-y-6 pt-12 pb-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-brand-brown text-white shadow-2xl shadow-brand-brown/20 scale-110">
            <Scissors className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-serif font-bold tracking-tight text-foreground">LEAfrique</CardTitle>
            <CardDescription className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-[10px]">Atelier Management</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-12 px-10">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="artisan@leafrique.com"
                className="rounded-2xl h-14 bg-background border-border/50 focus:ring-brand-green text-lg px-5"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive font-medium mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Security Access</Label>
                <Button variant="link" className="px-0 h-auto text-xs text-brand-brown font-bold hover:text-brand-green">Lost Keys?</Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="rounded-2xl h-14 bg-background border-border/50 focus:ring-brand-green text-lg px-5"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive font-medium mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-16 rounded-2xl bg-brand-brown hover:bg-brand-green text-white text-xl font-bold shadow-2xl shadow-brand-brown/20 transition-all active:scale-95 gap-3"
            >
              <Lock className="h-5 w-5" />
              Sign Into Workshop
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="absolute bottom-8 text-[10px] font-bold uppercase tracking-[0.5em] text-brand-brown/40 z-10">
        Est. 2024 • LEAfrique Artisans
      </div>
    </div>
  );
}