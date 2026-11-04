import type { Metadata } from 'next';
import { AuthFlow } from '../auth-flow';
import { AuthShell } from '../auth-shell';

export const metadata: Metadata = { title: 'Log in · Bargad' };

export default function LoginPage() {
  return (
    <AuthShell>
      <AuthFlow initial="login" />
    </AuthShell>
  );
}
