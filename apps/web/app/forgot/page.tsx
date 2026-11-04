import type { Metadata } from 'next';
import { AuthFlow } from '../auth-flow';
import { AuthShell } from '../auth-shell';

export const metadata: Metadata = { title: 'Reset password · Bargad' };

export default function ForgotPage() {
  return (
    <AuthShell>
      <AuthFlow initial="forgot" />
    </AuthShell>
  );
}
