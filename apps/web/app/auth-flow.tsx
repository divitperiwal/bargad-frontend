'use client';

import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { FingerprintIcon } from './icons';
import { DateField } from './signup/date-field';
import { controlState, Field, Label, Message } from './signup/field';
import { Toast } from './toast';
import { validateProfile } from './validation';

type Mode = 'login' | 'signup' | 'forgot';

type Values = {
  name: string;
  email: string;
  mobile: string;
  dob: string;
  password: string;
  confirm: string;
  terms: boolean;
};
type Errors = Partial<Record<keyof Values, string>>;

const empty: Values = {
  name: '',
  email: '',
  mobile: '',
  dob: '',
  password: '',
  confirm: '',
  terms: false,
};

const copy = {
  login: {
    title: 'Welcome back',
    subtitle: 'Log in to see how your family is doing.',
    doc: 'Log in | Bargad',
    button: 'Log in with password',
    pending: 'Logging you in',
    toast:
      "We can't log you in just yet. We're still setting up accounts, so please try again soon.",
  },
  signup: {
    title: "Let's set up your household",
    subtitle: "Start with your own account. You can invite your family once you're in.",
    doc: 'Create account | Bargad',
    button: 'Create my account',
    pending: 'Setting things up',
    toast:
      "We can't create accounts just yet. We're still setting things up, so please try again soon.",
  },
  forgot: {
    title: 'Forgot your password?',
    subtitle: "It happens. Tell us your email and we'll send you a link to set a new one.",
    doc: 'Reset password | Bargad',
    button: 'Send me a link',
    pending: 'Sending your link',
    toast: "Password resets aren't ready yet. Please try again soon.",
  },
} as const;

const ease = [0.22, 1, 0.36, 1] as const;
const press = { duration: 0.15, ease } as const;

const button =
  'relative flex h-[var(--ctl)] w-full items-center justify-center gap-2.5 rounded-full text-base font-medium transition-[background-color,color] duration-200 ease-[var(--ease)] disabled:cursor-progress';
const primary = `${button} bg-brand text-brand-ink hover:bg-brand-hover`;
const secondary = `${button} border border-line-strong bg-surface text-ink hover:bg-surface-2`;

function validate(mode: Mode, v: Values): Errors {
  const e: Errors = {};
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim()))
    e.email = "That email doesn't look quite right. Could there be a typo?";
  if (mode === 'forgot') return e;
  if (mode === 'login') {
    if (!v.password) e.password = 'Please enter your password.';
    return e;
  }
  return { ...e, ...validateProfile(v) };
}

/**
 * Stand-in for the API call until the backend lands: waits like a request
 * would, then reports that accounts aren't connected. Replace with the typed
 * API client; field errors from the server go into `errors`, the rest into
 * the toast.
 */
function request(): Promise<{ ok: false }> {
  return new Promise((resolve) => setTimeout(() => resolve({ ok: false }), 700));
}

/** A row that opens and closes in place; its spacing goes with it. */
function Collapse({
  show,
  index = 0,
  children,
}: {
  show: boolean;
  /** Position in the cascade: later rows start a beat after earlier ones. */
  index?: number;
  children: React.ReactNode;
}) {
  const [settled, setSettled] = useState(true);
  const reduce = useReducedMotion();
  const stagger = index * 0.04;
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          key="row"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  height: { duration: 0.4, ease, delay: stagger },
                  opacity: { duration: 0.3, delay: stagger + 0.06, ease },
                }
          }
          onAnimationStart={() => setSettled(false)}
          onAnimationComplete={() => setSettled(true)}
          // Clipped while moving, free afterwards so the calendar can open.
          style={{ overflow: settled ? 'visible' : 'hidden' }}
        >
          <div className="pb-[var(--stack)]">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="pb-[var(--stack)]">{children}</div>;
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
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const signup = mode === 'signup';
  const forgot = mode === 'forgot';
  const login = mode === 'login';

  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname;
      setMode(
        path.startsWith('/signup') ? 'signup' : path.startsWith('/forgot') ? 'forgot' : 'login',
      );
      setErrors({});
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function go(next: Mode) {
    if (next === mode || pending) return;
    setMode(next);
    setErrors({});
    window.history.pushState(null, '', `/${next}`);
    document.title = copy[next].doc;
  }

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const cls = (key: keyof Values) => controlState(errors[key]);
  const aria = (key: keyof Values) => ({
    'aria-invalid': errors[key] ? (true as const) : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : undefined,
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const found = validate(mode, v);
    setErrors(found);
    const first = (
      ['name', 'email', 'mobile', 'dob', 'password', 'confirm', 'terms'] as const
    ).find((k) => found[k]);
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    setPending(true);
    await request();
    setPending(false);
    setToast(copy[mode].toast);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex w-full max-w-[400px] flex-col gap-[clamp(28px,4.6dvh,44px)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.header
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease }}
            className="flex flex-col gap-3"
          >
            <h1
              data-anim="rise"
              className="font-serif text-[clamp(32px,5dvh,44px)] leading-[1.08] tracking-[-0.025em]"
            >
              {copy[mode].title}
            </h1>
            <p data-anim="rise" className="text-base leading-relaxed text-ink-3">
              {copy[mode].subtitle}
            </p>
          </motion.header>
        </AnimatePresence>

        <div>
          <Collapse show={login} index={0}>
            <div data-anim="rise">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                transition={press}
                className={primary}
              >
                <FingerprintIcon size={20} />
                Log in with passkey
              </motion.button>
            </div>
          </Collapse>

          <Collapse show={login} index={1}>
            <div data-anim="rise" className="flex items-center gap-4 py-1 text-sm text-ink-3">
              <span className="h-px flex-1 bg-line" />
              or
              <span className="h-px flex-1 bg-line" />
            </div>
          </Collapse>

          <form onSubmit={onSubmit} noValidate aria-busy={pending}>
            <Collapse show={signup} index={0}>
              <Field id="name" label="Your full name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  value={v.name}
                  onChange={(e) => set('name', e.target.value)}
                  autoComplete="name"
                  placeholder="As on your PAN card"
                  className={cls('name')}
                  {...aria('name')}
                />
              </Field>
            </Collapse>

            <Row>
              <Field id="email" label="Email address" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={v.email}
                  onChange={(e) => set('email', e.target.value)}
                  autoComplete={signup ? 'email' : 'username webauthn'}
                  placeholder="name@example.com"
                  className={cls('email')}
                  {...aria('email')}
                />
              </Field>
            </Row>

            <Collapse show={signup} index={1}>
              <div className="grid gap-[var(--stack)] sm:grid-cols-2 sm:gap-3">
                <Field id="mobile" label="Mobile number" error={errors.mobile}>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-ink-3">
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
                      placeholder="98765 43210"
                      className={`${cls('mobile')} pl-[3.25rem]`}
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
              </div>
            </Collapse>

            <Collapse show={!forgot} index={2}>
              <div data-anim="rise" className="flex min-w-0 flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="password">Password</Label>
                  <AnimatePresence initial={false}>
                    {login && (
                      <motion.a
                        key="forgot"
                        href="/forgot"
                        onClick={(e) => {
                          e.preventDefault();
                          go('forgot');
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="link text-sm"
                      >
                        Forgot password?
                      </motion.a>
                    )}
                  </AnimatePresence>
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
                    className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-full px-3 text-sm font-medium text-ink-2 transition-colors duration-200 hover:bg-surface-2 hover:text-ink"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <Message id="password" error={errors.password} />
                {signup && !errors.password && (
                  <p className="text-sm text-ink-3">
                    Use 10 or more characters. A short phrase is easy to remember.
                  </p>
                )}
              </div>
            </Collapse>

            <Collapse show={signup} index={3}>
              <Field id="confirm" label="Type your password again" error={errors.confirm}>
                <input
                  id="confirm"
                  name="confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={v.confirm}
                  onChange={(e) => set('confirm', e.target.value)}
                  autoComplete="new-password"
                  className={cls('confirm')}
                  {...aria('confirm')}
                />
              </Field>
            </Collapse>

            <Collapse show={signup} index={4}>
              <div data-anim="rise" className="flex flex-col gap-1.5">
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
                    className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-md border bg-surface text-brand-ink transition-colors duration-200 peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100 ${
                      errors.terms ? 'border-danger' : 'border-line-strong'
                    }`}
                  >
                    <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
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
                    I'm 18 or older, and I agree to the{' '}
                    <a href="/terms" className="link">
                      Terms
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="link">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
                <Message id="terms" error={errors.terms} />
              </div>
            </Collapse>

            <div data-anim="rise" className="pt-1">
              <motion.button
                type="submit"
                disabled={pending}
                whileTap={pending ? undefined : { scale: 0.97 }}
                transition={press}
                className={login ? secondary : primary}
              >
                {pending && <Spinner />}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={`${mode}-${pending}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.14, ease }}
                    className="block"
                  >
                    {pending ? copy[mode].pending : copy[mode].button}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </form>

          <p data-anim="rise" className="pt-[var(--stack)] text-base text-ink-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.14 }}
                className="inline-block"
              >
                {signup || forgot ? (
                  <>
                    {forgot ? 'Remembered it?' : 'Already have an account?'}{' '}
                    <a
                      href="/login"
                      onClick={(e) => {
                        e.preventDefault();
                        go('login');
                      }}
                      className="link font-medium"
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
                      className="link font-medium"
                    >
                      Create an account
                    </a>
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </p>
        </div>

        <Toast message={toast} onClose={() => setToast(null)} />
      </div>
    </MotionConfig>
  );
}
