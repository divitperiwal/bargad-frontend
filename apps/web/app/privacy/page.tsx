import type { Metadata } from 'next';
import { DocPage, Section } from '../doc-page';

export const metadata: Metadata = { title: 'Privacy · Bargad' };

export default function PrivacyPage() {
  return (
    <DocPage title="Privacy policy">
      <Section title="What we collect">
        <p>
          Your name, email, mobile number and date of birth when you sign up. From each broker you
          link: your holdings, orders and valuations. Anything you enter by hand in the ledger, such
          as a fixed deposit, gold or a loan.
        </p>
      </Section>

      <Section title="Whose data it is">
        <p>
          Each member's financial data is theirs. Under India's Digital Personal Data Protection Act
          you can ask to see it, correct it, or have it erased.
        </p>
      </Section>

      <Section title="Who sees what">
        <p>
          You see your own accounts, plus household totals. You do not see other members' individual
          data.
        </p>
        <p>
          The head of the family sees each member's holdings, orders, profit and loss and ledger,
          except anything that member has hidden. A hidden account or ledger entry is also left out
          of the household totals, so it cannot be worked out by subtraction.
        </p>
      </Section>

      <Section title="Broker credentials">
        <p>
          If you choose stored credentials, they are sealed with a key that only the order engine
          holds. The product API cannot read them, and neither can the head or an administrator.
          Viewing or changing them needs your passkey.
        </p>
      </Section>

      <Section title="The audit log">
        <p>
          Every proposal, approval, rejection, grant, revoke and order placed under a grant is
          recorded in an append-only log that nobody can edit or delete. You can read the entries
          that touch your own accounts.
        </p>
      </Section>

      <Section title="When you leave">
        <p>
          The head loses all access to your data, including history. You keep your own history and
          audit log.
        </p>
      </Section>

      <Section title="Contact">
        <p>Contact details for privacy requests will be added here before launch.</p>
      </Section>
    </DocPage>
  );
}
