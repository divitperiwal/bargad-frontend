import type { Metadata } from 'next';
import { DocPage, Section } from '../doc-page';

export const metadata: Metadata = { title: 'Terms · Bargad' };

export default function TermsPage() {
  return (
    <DocPage title="Terms of use">
      <Section title="What Bargad is">
        <p>
          Bargad is a family investing app. It shows one household's accounts across brokers in one
          place and, with each member's consent, lets the family head place orders on a member's
          account.
        </p>
        <p>
          Bargad is not a broker. Orders are placed at your own broker, on your own account, and
          your broker remains responsible for them.
        </p>
      </Section>

      <Section title="Who can use it">
        <p>You must be 18 or older. Bargad does not offer accounts for minors.</p>
        <p>
          Trading features (stored broker logins, approvals and limited grants) are available only
          between people the SEBI framework counts as family: yourself, your spouse, your dependent
          children and your dependent parents. Anyone else can join a household, but view-only.
        </p>
      </Section>

      <Section title="Consent comes first">
        <p>
          The head of a family can place an order on your account in only two ways. Either you
          approve that specific basket on your own phone, or you give the head a limited grant that
          you set and can revoke at any time.
        </p>
        <p>
          A grant has a time limit, a total rupee cap, a per-order cap, and covers delivery equity
          only. Every order placed under a grant sends a notification to your phone with a one-tap
          revoke.
        </p>
      </Section>

      <Section title="How orders are placed">
        <p>
          Every order placed through family features is a limit order, priced within the band you
          approved. Bargad never sends a market order. If the price moves outside your band, the
          order waits and you are asked again.
        </p>
      </Section>

      <Section title="Your broker login">
        <p>
          You choose how each broker account signs in: through your broker's own login page, or with
          stored credentials that you opt into. Nobody, including the head of your family and
          Bargad's own administrators, can view or change stored credentials. An administrator can
          only revoke them, which wipes them and asks you to link again.
        </p>
      </Section>

      <Section title="No advice">
        <p>
          Bargad does not recommend securities and does not file taxes. Its assistant answers
          questions about amounts and allocation and never names a security to buy or sell.
        </p>
      </Section>

      <Section title="Leaving a household">
        <p>
          If you leave, or the head removes you, every grant ends, unexecuted baskets are cancelled
          (including open broker orders placed from them), and the head loses all access to your
          data, including history. Trades that already executed stay. You keep your own audit log and
          history.
        </p>
      </Section>

      <Section title="Changes and contact">
        <p>
          We will tell you before these terms change in a way that affects your rights. Contact
          details will be added here before launch.
        </p>
      </Section>
    </DocPage>
  );
}
