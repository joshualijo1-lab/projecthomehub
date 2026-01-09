import Link from 'next/link';
import { signIn } from '../actions';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <form action={signIn} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold">Email</label>
            <Input name="email" type="email" required />
          </div>
          <div>
            <label className="text-sm font-semibold">Password</label>
            <Input name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          New to HomeHub?{' '}
          <Link href="/sign-up" className="font-semibold">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
