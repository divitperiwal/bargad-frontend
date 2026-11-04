import type { Metadata } from 'next';
import { AuthFlow } from '../auth-flow';
import { AuthShell } from '../auth-shell';

export const metadata: Metadata = { title: 'Create account · Bargad' };

export default function SignupPage() {
  return (
    <AuthShell>
      <AuthFlow initial="signup" />
    </AuthShell>
  );
}
