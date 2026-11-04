import Image from 'next/image';
import { HouseholdPreview } from './household-preview';
import { LoginStage } from './login/login-stage';
import { Splash } from './splash';

/**
 * The frame shared by login, sign-up and password reset. On wide screens a
 * jamun panel, inset from the window edge, carries the banyan engraving in
 * light linework, the tagline in its empty sky and a preview of the household
 * view. On phones the panel becomes a short banner cropped to the family under
 * the tree.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <LoginStage className="grid min-h-dvh bg-bg lg:h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:overflow-hidden">
      <Splash />

      <div className="p-3 pb-0 lg:h-dvh lg:p-4 lg:pr-0">
        <section className="relative h-[clamp(196px,30dvh,260px)] overflow-hidden rounded-[20px] bg-brand text-brand-line lg:h-full">
          <div data-anim="art" className="absolute inset-x-0 bottom-0 h-[230%] lg:h-[88%]">
            <Image
              src="/brand/banyan-family-line.webp"
              alt="An engraving of a family sitting in the shade of a large banyan tree"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain object-bottom"
            />
          </div>

          <div className="relative flex flex-col gap-8 p-5 lg:p-10">
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
                  className="h-7 w-auto lg:h-9"
                />
                <span className="font-serif text-[24px] leading-none tracking-[-0.01em] text-brand-ink lg:text-[28px]">
                  bargad
                </span>
              </span>
            </a>

            <div className="hidden lg:block">
              <p className="font-serif text-[clamp(44px,6dvh,60px)] leading-[1.05] tracking-[-0.025em] text-brand-ink">
                <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
                  <span data-anim="line" className="block">
                    One family.
                  </span>
                </span>
                <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
                  <em data-anim="line" className="block text-brand-muted">
                    Many roots.
                  </em>
                </span>
              </p>
              <p
                data-anim="rise"
                className="mt-5 max-w-[36ch] text-base leading-relaxed text-brand-line/85"
              >
                See your family's investments across every broker. Each member keeps control of
                their own account.
              </p>
            </div>
          </div>

          <div
            data-anim="rise"
            className="absolute right-8 bottom-[18%] hidden xl:block 2xl:right-12"
          >
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
