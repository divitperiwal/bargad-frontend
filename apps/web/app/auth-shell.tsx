import Image from 'next/image';
import { HouseholdPreview } from './household-preview';
import { LoginStage } from './login/login-stage';
import { RootsPattern } from './roots-pattern';
import { Splash } from './splash';

/**
 * The frame shared by login, sign-up and password reset: a canopy panel on
 * the left (45%) and the form in a spacious column on the right (55%). The
 * panel leads with the product itself, a preview of the household view, and
 * stays put while the form scrolls. On phones it becomes a short banner with
 * the logo and a one-line headline, and the form follows straight away.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <LoginStage className="grid min-h-dvh bg-bg lg:h-dvh lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:overflow-hidden">
      <Splash />

      <div className="p-3 pb-0 lg:h-dvh lg:p-3 lg:pr-0">
        <section className="canopy flex h-full flex-col overflow-hidden rounded-[24px] p-6 text-brand-line lg:p-12">
          <RootsPattern className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-canopy-line opacity-[0.08]" />

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

          <p
            data-anim="rise"
            className="mt-6 max-w-[22ch] font-serif text-[22px] leading-[1.2] tracking-[-0.01em] text-white lg:mt-10 lg:text-[clamp(26px,3.4dvh,32px)]"
          >
            Your whole family's investments, in one calm view.
          </p>

          <div className="mt-auto hidden pt-10 [zoom:0.86] xl:block 2xl:[zoom:1] [@media(max-height:820px)]:[zoom:0.7]">
            <HouseholdPreview />
          </div>
        </section>
      </div>

      <section className="flex flex-col px-6 pt-10 pb-6 [scrollbar-width:none] sm:px-12 lg:overflow-y-auto lg:px-16 lg:py-12 [&::-webkit-scrollbar]:hidden">
        <div className="my-auto flex w-full justify-center py-6">{children}</div>
        <nav
          aria-label="Legal"
          className="mx-auto mt-8 flex w-full max-w-[420px] gap-6 text-sm text-ink-3"
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
