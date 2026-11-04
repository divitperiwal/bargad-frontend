import Image from 'next/image';
import { LoginStage } from './login/login-stage';
import { Splash } from './splash';

/**
 * The frame shared by login, sign-up and password reset: the banyan engraving
 * on a paper panel inset from the window edge, the form on the page. On phones
 * the panel becomes a short banner above the form, cropped to the family
 * sitting under the tree.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <LoginStage className="grid min-h-dvh bg-bg lg:h-dvh lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:overflow-hidden">
      <Splash />

      <div className="p-3 pb-0 lg:h-dvh lg:pb-3">
        <section className="relative h-[clamp(184px,30dvh,260px)] overflow-hidden rounded-[20px] bg-panel text-panel-ink lg:h-full lg:rounded-[24px]">
          <div
            data-anim="art"
            className="absolute bottom-0 left-1/2 aspect-square h-[260%] -translate-x-[46%] lg:h-[calc(100%-200px)] lg:min-h-[420px] lg:-translate-x-1/2"
          >
            <Image
              src="/brand/banyan-square-ink.png"
              alt="A family sitting in the shade of a large banyan tree"
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-contain object-bottom"
            />
          </div>

          <div className="relative flex flex-col gap-6 p-5 lg:p-10">
            <div data-anim="logo" className="w-fit">
              <a
                href="/login"
                className="flex items-center gap-2.5 rounded-full bg-panel py-1.5 pr-3.5 pl-2.5 transition-opacity duration-200 hover:opacity-70 lg:rounded-lg lg:bg-transparent lg:p-0"
              >
                <Image
                  src="/brand/mark-b-roots-ink.png"
                  alt=""
                  width={215}
                  height={285}
                  className="h-7 w-auto lg:h-10"
                />
                <span className="font-serif text-[22px] font-medium leading-none tracking-[-0.01em] lg:text-[26px]">
                  bargad
                </span>
              </a>
            </div>

            <div className="hidden max-w-[34ch] lg:block">
              <p className="font-serif text-[clamp(40px,5.2dvh,52px)] font-medium leading-[1.1] tracking-[-0.025em]">
                <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                  <span data-anim="line" className="block">
                    One family.
                  </span>
                </span>
                <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                  <em data-anim="line" className="block font-normal">
                    Many roots.
                  </em>
                </span>
              </p>
              <p
                data-anim="rise"
                className="mt-4 max-w-[38ch] text-base leading-relaxed text-panel-ink-2"
              >
                Run your family's investments across every broker, while each member stays in
                control of their own account.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="flex flex-col px-6 pt-8 pb-6 [scrollbar-width:none] sm:px-10 lg:overflow-y-auto lg:px-12 lg:py-10 [&::-webkit-scrollbar]:hidden">
        <div className="my-auto flex w-full justify-center">{children}</div>
        <nav
          aria-label="Legal"
          className="mx-auto mt-10 flex w-full max-w-[420px] gap-5 text-sm text-ink-3"
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
