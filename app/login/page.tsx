import { AuthForm } from '@/components/auth-form';

export default function LoginPage() {
  return (
    <main className="container-shell flex min-h-[70vh] items-center justify-center py-20">
      <AuthForm mode="login" />
    </main>
  );
}
