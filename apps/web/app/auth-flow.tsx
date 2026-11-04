'use client';

import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ShieldIcon } from './icons';
import { DateField } from './signup/date-field';
import { controlState, Field, Label, Message } from './signup/field';
import { Toast } from './toast';
import { type ProfileErrors, validateAccount, validateDetails, validateEmail } from './validation';

type Mode = 'login' | 'signup' | 'forgot';
/** Login: 1 = email, 2 = password. Sign-up: 1 = account, 2 = details. */
type Step = 1 | 2;

type Values = {
  name: string;
  email: string;
  mobile: string;
  dob: string;
  password: string;
  terms: boolean;
};
type Errors = ProfileErrors;

const empty: Values = { name: '', email: '', mobile: '', dob: '', password: '', terms: false };

type Screen = {
  title: string;
  subtitle: string;
  button: string;
  pending: string;
};

const screens: Record<Mode, Record<Step, Screen>> = {
  login: {
    1: {
      title: 'Welcome back',
      subtitle: 'Log in to see how your family is doing.',
      button: 'Continue',
      pending: 'Checking',
    },
    2: {
      title: 'Enter your password',
      subtitle: '',
      button: 'Log in',
      pending: 'Logging you in',
    },
  },
  signup: {
    1: {
      title: "Let's set up your household",
      subtitle: "Start with your own account. You can invite your family once you're in.",
      button: 'Continue',
      pending: 'Continue',
    },
    2: {
      title: 'Just two more details',
      subtitle:
        "Your mobile number helps keep your account safe, and your date of birth confirms you're 18 or older.",
      button: 'Create my account',
      pending: 'Setting things up',
    },
  },
  forgot: {
    1: {
      title: 'Forgot your password?',
      subtitle: "It happens. Tell us your email and we'll send you a link to set a new one.",
      button: 'Send me a link',
      pending: 'Sending your link',
    },
    2: {
      title: 'Forgot your password?',
      subtitle: '',
      button: 'Send me a link',
      pending: 'Sending your link',
    },
  },
};

const toasts: Record<Mode, string> = {
  login: "We can't log you in just yet. We're still setting up accounts, so please try again soon.",
  signup:
    "We can't create accounts just yet. We're still setting things up, so please try again soon.",
  forgot: "Password resets aren't ready yet. Please try again soon.",
};

const docTitles: Record<Mode, string> = {
  login: 'Log in | Bargad',
  signup: 'Create account | Bargad',
  forgot: 'Reset password | Bargad',
};

const order = ['name', 'email', 'password', 'terms', 'mobile', 'dob'] as const;

const ease = [0.22, 1, 0.36, 1] as const;
const press = { duration: 0.15, ease } as const;

const button =
  'relative flex h-[var(--ctl)] w-full items-center justify-center gap-2.5 rounded-xl text-base font-medium transition-[background-color,color] duration-200 ease-[var(--ease)] disabled:cursor-progress';
const primary = `${button} bg-brand text-brand-ink hover:bg-brand-hover`;

/**
 * Stand-in for the API call until the backend lands: waits like a request
 * would, then reports that accounts aren't connected. Replace with the typed
 * API client; field errors from the server go into `errors`, the rest into
 * the toast. Login step one will also ask the server whether this email has a
 * passkey; until then it always goes on to the password.
 */
function request(): Promise<{ ok: false }> {
  return new Promise((resolve) => setTimeout(() => resolve({ ok: false }), 700));
}

function Spinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="animate-spin motion-reduce:animate-none"
    >
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      <path d="M16 9a7 7 0 0 0-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function AuthFlow({ initial }: { initial: Mode }) {
  const [mode, setMode] = useState<Mode>(initial);
  const [step, setStep] = useState<Step>(1);
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const moved = useRef(false);

  const screen = screens[mode][step];
  const signup = mode === 'signup';
  const login = mode === 'login';

  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname;
      setMode(
        path.startsWith('/signup') ? 'signup' : path.startsWith('/forgot') ? 'forgot' : 'login',
      );
      setStep(1);
      setErrors({});
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // After moving between steps, put the cursor in the first field of the new one.
  useEffect(() => {
    if (!moved.current) return;
    const id = login && step === 2 ? 'password' : signup && step === 2 ? 'mobile' : null;
    if (id) document.getElementById(id)?.focus();
  }, [login, signup, step]);

  function go(next: Mode) {
    if (pending) return;
    moved.current = true;
    setMode(next);
    setStep(1);
    setErrors({});
    window.history.pushState(null, '', `/${next}`);
    document.title = docTitles[next];
  }

  function toStep(next: Step) {
    moved.current = true;
    setErrors({});
    setStep(next);
  }

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof Errors]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const cls = (key: keyof Errors) => controlState(errors[key]);
  const aria = (key: keyof Errors) => ({
    'aria-invalid': errors[key] ? (true as const) : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : undefined,
  });

  function check(): Errors {
    if (signup) return step === 1 ? validateAccount(v) : validateDetails(v);
    const e: Errors = {};
    const email = validateEmail(v.email);
    if (email) e.email = email;
    if (login && step === 2 && !v.password) e.password = 'Please enter your password.';
    return e;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const found = check();
    setErrors(found);
    const first = order.find((k) => found[k]);
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    if (step === 1 && (login || signup)) {
      toStep(2);
      return;
    }
    setPending(true);
    await request();
    setPending(false);
    setToast(toasts[mode]);
  }

  const key = `${mode}-${step}`;

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex w-full max-w-[420px] flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease }}
          >
            <header className="flex flex-col gap-3">
              {signup && (
                <p data-anim="rise" className="text-sm font-medium text-ink-3">
                  Step {step} of 2
                </p>
              )}
              <h1
                data-anim="rise"
                className="font-serif text-[clamp(32px,4.6dvh,42px)] leading-[1.1] tracking-[-0.025em]"
              >
                {screen.title}
              </h1>
              {screen.subtitle && (
                <p data-anim="rise" className="text-base leading-relaxed text-ink-3">
                  {screen.subtitle}
                </p>
              )}
              {login && step === 2 && (
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-ink-2">
                  <span className="selectable">{v.email.trim()}</span>
                  <button type="button" onClick={() => toStep(1)} className="link text-sm">
                    Change
                  </button>
                </p>
              )}
            </header>

            <form
              onSubmit={onSubmit}
              noValidate
              aria-busy={pending}
              className="mt-[clamp(28px,4.4dvh,40px)] flex flex-col gap-[var(--stack)]"
            >
              {signup && step === 1 && (
                <Field
                  id="name"
                  label="Your full name"
                  error={errors.name}
                  hint="As it appears on your PAN card."
                >
                  <input
                    id="name"
                    name="name"
                    value={v.name}
                    onChange={(e) => set('name', e.target.value)}
                    autoComplete="name"
                    className={cls('name')}
                    {...aria('name')}
                  />
                </Field>
              )}

              {step === 1 && (
                <Field id="email" label="Email address" error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    value={v.email}
                    onChange={(e) => set('email', e.target.value)}
                    // "webauthn" lets the browser offer a saved passkey right here.
                    autoComplete={signup ? 'email' : 'username webauthn'}
                    placeholder="name@example.com"
                    className={cls('email')}
                    {...aria('email')}
                  />
                </Field>
              )}

              {((login && step === 2) || (signup && step === 1)) && (
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <Label htmlFor="password">Password</Label>
                    {login && (
                      <a
                        href="/forgot"
                        onClick={(e) => {
                          e.preventDefault();
                          go('forgot');
                        }}
                        className="link text-sm"
                      >
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={v.password}
                      onChange={(e) => set('password', e.target.value)}
                      autoComplete={signup ? 'new-password' : 'current-password'}
                      className={`${cls('password')} pr-20`}
                      {...aria('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-pressed={showPassword}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-lg px-3 text-sm font-medium text-ink-2 transition-colors duration-200 hover:bg-surface-2 hover:text-ink"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <Message id="password" error={errors.password} />
                  {signup && !errors.password && (
                    <p className="text-sm text-ink-3">
                      10 or more characters. A short phrase is easy to remember.
                    </p>
                  )}
                </div>
              )}

              {signup && step === 1 && (
                <div className="flex flex-col gap-1.5">
                  <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-snug text-ink-2">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={v.terms}
                      onChange={(e) => set('terms', e.target.checked)}
                      className="peer sr-only"
                      {...aria('terms')}
                    />
                    <span
                      aria-hidden="true"
                      className={`mt-px grid h-[22px] w-[22px] shrink-0 place-items-center rounded-md border bg-surface text-brand-ink transition-colors duration-200 peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100 ${
                        errors.terms ? 'border-danger' : 'border-line-strong'
                      }`}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.4 6.3 4.9 8.8 9.7 3.4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>
                      I agree to the{' '}
                      <a href="/terms" className="link">
                        Terms
                      </a>{' '}
                      and the{' '}
                      <a href="/privacy" className="link">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                  <Message id="terms" error={errors.terms} />
                </div>
              )}

              {signup && step === 2 && (
                <>
                  <Field id="mobile" label="Mobile number" error={errors.mobile}>
                    <div className="relative">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-px left-px grid w-14 place-items-center rounded-l-[11px] border-r border-line bg-surface-2 text-base text-ink-2"
                      >
                        +91
                      </span>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        inputMode="numeric"
                        value={v.mobile}
                        onChange={(e) =>
                          set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))
                        }
                        autoComplete="tel-national"
                        className={`${cls('mobile')} pl-[4.5rem]`}
                        {...aria('mobile')}
                      />
                    </div>
                  </Field>
                  <DateField
                    id="dob"
                    value={v.dob}
                    onChange={(iso) => set('dob', iso)}
                    error={errors.dob}
                    inputClass={cls('dob')}
                  />
                </>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <motion.button
                  type="submit"
                  disabled={pending}
                  whileTap={pending ? undefined : { scale: 0.97 }}
                  transition={press}
                  className={primary}
                >
                  {pending && <Spinner />}
                  {pending ? screen.pending : screen.button}
                </motion.button>
                {signup && step === 2 && (
                  <button
                    type="button"
                    onClick={() => toStep(1)}
                    className="h-11 rounded-xl text-sm font-medium text-ink-2 transition-colors duration-200 hover:bg-surface-2 hover:text-ink"
                  >
                    Back
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </AnimatePresence>

        <p data-anim="rise" className="mt-8 text-base text-ink-3">
          {signup || mode === 'forgot' ? (
            <>
              {mode === 'forgot' ? 'Remembered it?' : 'Already have an account?'}{' '}
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  go('login');
                }}
                className="link"
              >
                Log in
              </a>
            </>
          ) : (
            <>
              New to Bargad?{' '}
              <a
                href="/signup"
                onClick={(e) => {
                  e.preventDefault();
                  go('signup');
                }}
                className="link"
              >
                Create an account
              </a>
            </>
          )}
        </p>

        <p
          data-anim="rise"
          className="mt-10 flex items-start gap-3 border-t border-line pt-6 text-sm leading-relaxed text-ink-3"
        >
          <ShieldIcon size={18} className="mt-0.5 shrink-0 text-ink-2" />
          <span>
            Your data stays yours. You choose what your family sees, and nobody can read your broker
            login.{' '}
            <a href="/privacy" className="link whitespace-nowrap">
              How we protect it
            </a>
          </span>
        </p>

        <Toast message={toast} onClose={() => setToast(null)} />
      </div>
    </MotionConfig>
  );
}
