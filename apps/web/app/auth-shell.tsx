import Image from 'next/image';
import { HouseholdPreview } from './household-preview';
import { LoginStage } from './login/login-stage';
import { Splash } from './splash';

/**
 * The frame shared by login, sign-up and password reset. On wide screens a
 * Peacock-gradient frame, inset from the window edge, holds the headline and
 * a preview of the household view; the form sits on white beside it. On
 * phones the frame becomes a short banner with the logo and headline, and the
 * form follows straight away.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <LoginStage className="grid min-h-dvh bg-bg lg:h-dvh lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:overflow-hidden">
      <Splash />

      <div className="p-3 pb-0 lg:h-dvh lg:p-4 lg:pr-0">
        <section className="peacock flex h-full flex-col overflow-hidden rounded-[14px] p-6 text-brand-line lg:p-12">
          <a
            href="/login"
            className="flex w-fit items-center gap-2.5 rounded-lg transition-opacity duration-200 hover:opacity-80"
          >
            <span data-anim="logo" className="flex items-center gap-2.5">
              <Image
                src="/brand/mark-b-roots-light.webp"
                alt=""
                width={215}
                height={285}
                className="h-6 w-auto lg:h-8"
              />
              <span className="font-serif text-[22px] leading-none tracking-[-0.01em] text-white lg:text-[26px]">
                bargad
              </span>
            </span>
          </a>

          <div className="mt-8 lg:my-auto">
            <p className="font-serif text-[26px] leading-[1.1] tracking-[-0.02em] text-white lg:text-[clamp(48px,6.4dvh,64px)]">
              <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
                <span data-anim="line" className="block">
                  Grow your family's
                </span>
              </span>
              <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
                <span data-anim="line" className="block">
                  wealth, together.
                </span>
              </span>
            </p>
            <p
              data-anim="rise"
              className="mt-5 hidden max-w-[40ch] text-[17px] leading-relaxed text-brand-line/85 lg:block"
            >
              One household across every broker. Each member stays in control of their own account.
            </p>
          </div>

          <div data-anim="rise" className="hidden xl:block">
            <HouseholdPreview />
          </div>
        </section>
      </div>

      <section className="flex flex-col px-6 pt-8 pb-6 [scrollbar-width:none] sm:px-10 lg:overflow-y-auto lg:px-14 lg:py-10 [&::-webkit-scrollbar]:hidden">
        <div className="my-auto flex w-full justify-center">{children}</div>
        <nav
          aria-label="Legal"
          className="mx-auto mt-10 flex w-full max-w-[400px] gap-5 text-sm text-ink-3"
        >
          <a href="/terms" className="link-quiet">
            Terms
          </a>
          <a href="/privacy" className="link-quiet">
            Privacy
          </a>
        </nav>
      </section>
    </LoginStage>
  );
}
