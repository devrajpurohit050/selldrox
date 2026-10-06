import { AuthForm } from '@/components/auth-form';

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const next = searchParams.next;
  const redirectPath = next?.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? next : '/account';

  return (
    <main className="container-shell flex min-h-[70vh] items-center justify-center py-20">
      <AuthForm mode="login" redirectPath={redirectPath} />
    </main>
  );
}
