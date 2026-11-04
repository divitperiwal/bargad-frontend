import Image from 'next/image';
import { Headline, RotatingMessages } from './brand-panel';
import { LoginStage } from './login/login-stage';
import { RootsPattern } from './roots-pattern';
import { Splash } from './splash';

/**
 * The frame shared by login, sign-up and password reset: a canopy panel on
 * the left (45%) and the form, centred, on the right (55%). The panel carries
 * the logo, one large line and a bar of rotating messages, and stays put while
 * the form scrolls. On phones it becomes a short banner with the logo and the
 * line, and the form follows straight away.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <LoginStage className="grid min-h-dvh content-start bg-bg lg:h-dvh lg:content-stretch lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:overflow-hidden">
      <Splash />

      <div className="p-3 pb-0 lg:h-dvh lg:p-3 lg:pr-0">
        <section className="canopy flex h-full flex-col overflow-hidden rounded-[24px] p-6 text-brand-line lg:p-12">
          <RootsPattern className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-canopy-line opacity-[0.09]" />

          <a
            href="/login"
            className="flex w-fit items-center gap-3 rounded-xl transition-opacity duration-200 hover:opacity-80"
          >
            <span data-anim="logo" className="flex items-center gap-3">
              <Image
                src="/brand/mark-b-roots-light.webp"
                alt=""
                width={215}
                height={285}
                className="h-9 w-auto lg:h-11"
              />
              <span className="font-serif text-[26px] leading-none tracking-[-0.01em] text-white lg:text-[30px]">
                bargad
              </span>
            </span>
          </a>

          <Headline className="mt-8 max-w-[19ch] font-serif text-[30px] leading-[1.08] tracking-[-0.02em] text-white lg:mt-auto lg:mb-[14dvh] lg:text-[clamp(44px,6dvh,64px)]" />

          <div className="hidden border-t border-white/15 pt-6 lg:block">
            <RotatingMessages />
          </div>
        </section>
      </div>

      <section className="relative flex flex-col px-6 pt-10 pb-6 [scrollbar-width:none] sm:px-12 lg:overflow-y-auto lg:px-16 lg:py-10 [&::-webkit-scrollbar]:hidden">
        {/* Same height as the legal links below, so the form sits at the exact
            vertical centre while the links stay in the flow and never overlap it. */}
        <div aria-hidden="true" className="hidden h-[60px] shrink-0 lg:block" />
        <div className="my-auto flex w-full justify-center">{children}</div>
        <nav
          aria-label="Legal"
          className="mx-auto mt-10 flex h-5 w-full max-w-[420px] shrink-0 items-center gap-6 text-sm text-ink-3"
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
