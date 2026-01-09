import Link from 'next/link';
import { signUp } from '../actions';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card>
        <h1 className="text-2xl font-semibold">Create account</h1>
        <form action={signUp} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold">Full name</label>
            <Input name="name" required />
          </div>
          <div>
            <label className="text-sm font-semibold">Email</label>
            <Input name="email" type="email" required />
          </div>
          <div>
            <label className="text-sm font-semibold">Password</label>
            <Input name="password" type="password" required />
          </div>
          <div>
            <label className="text-sm font-semibold">Role</label>
            <select name="role" className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" required>
              <option value="CUSTOMER">Customer</option>
              <option value="PROVIDER">Service provider</option>
            </select>
          </div>
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-semibold">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
