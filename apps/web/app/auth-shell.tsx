import Image from 'next/image';
import { LoginStage } from './login/login-stage';
import { Splash } from './splash';

/**
 * The frame shared by the login and sign-up pages: the white illustration
 * panel fixed to the left edge, the form side on the page background.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <LoginStage className="grid min-h-dvh bg-bg lg:h-dvh lg:grid-cols-[1.05fr_1fr] lg:overflow-hidden">
      <Splash />
      <section
        className="relative hidden overflow-hidden bg-white text-[#141414] lg:sticky lg:top-0 lg:block lg:h-dvh lg:self-start"
        style={{ borderTopRightRadius: 28, borderBottomRightRadius: 28 }}
      >
        <div
          data-anim="art"
          className="absolute bottom-0 left-0 aspect-square"
          style={{
            height: 'calc((100% - 235px) / 0.78)',
            maskImage: 'linear-gradient(to right, #000 86%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, #000 86%, transparent)',
          }}
        >
          <Image
            src="/brand/banyan-square-ink.png"
            alt="A family sitting in the shade of a large banyan tree"
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
        </div>
        <div className="relative flex flex-col gap-8 p-10">
          <div data-anim="logo" className="flex items-center gap-3">
            <Image
              src="/brand/mark-b-roots-ink.png"
              alt=""
              width={215}
              height={285}
              className="h-11 w-auto"
            />
            <span className="font-serif text-[28px] leading-none tracking-tight">bargad</span>
          </div>
          <p className="font-serif text-[56px] leading-[1.02] tracking-[-0.02em]">
            <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span data-anim="line" className="block">
                One family.
              </span>
            </span>
            <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <em data-anim="line" className="block">
                Many roots.
              </em>
            </span>
          </p>
        </div>
      </section>

      <section className="flex flex-col items-center px-6 py-[clamp(16px,4dvh,48px)] [scrollbar-width:none] lg:overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <div className="my-auto flex w-full flex-col items-center">{children}</div>
      </section>
    </LoginStage>
  );
}
