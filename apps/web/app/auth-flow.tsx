'use client';

import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ThumbprintIcon } from './login/thumbprint-icon';
import { DateField } from './signup/date-field';
import { control, Field, Message } from './signup/field';
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
    title: 'Log in to your household',
    subtitle: 'Your family, across every broker.',
    doc: 'Log in · Bargad',
    button: 'Continue with password',
    toast: "Sign-in isn't connected yet. Try again once accounts are set up.",
  },
  signup: {
    title: 'Create your household',
    subtitle: 'Start with your own account. You can invite family next.',
    doc: 'Create account · Bargad',
    button: 'Create account',
    toast: "Sign-up isn't connected yet. Try again once accounts are set up.",
  },
  forgot: {
    title: 'Reset your password',
    subtitle: "Enter your email and we'll send you a link to choose a new one.",
    doc: 'Reset password · Bargad',
    button: 'Send reset link',
    toast: "Password reset isn't connected yet. Try again once accounts are set up.",
  },
} as const;

const press = { type: 'spring', stiffness: 500, damping: 30 } as const;
const ease = [0.22, 1, 0.36, 1] as const;

// One compact size for both modes, so switching never makes controls jump.
const compact = {
  '--ctl': 'clamp(40px, 5.6dvh, 48px)',
  '--stack': 'clamp(6px, 1.3dvh, 12px)',
} as React.CSSProperties;

function validate(mode: Mode, v: Values): Errors {
  const e: Errors = {};
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "That doesn't look like an email address.";
  if (mode === 'forgot') return e;
  if (mode === 'login') {
    if (!v.password) e.password = 'Enter your password.';
    return e;
  }
  return { ...e, ...validateProfile(v) };
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
  const stagger = index * 0.045;
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
                  height: { type: 'spring', stiffness: 150, damping: 24, mass: 0.9, delay: stagger },
                  opacity: { duration: 0.35, delay: stagger + 0.06, ease },
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

export function AuthFlow({ initial }: { initial: Mode }) {
  const [mode, setMode] = useState<Mode>(initial);
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const signup = mode === 'signup';
  const forgot = mode === 'forgot';
  const login = mode === 'login';
  const ready = signup
    ? v.name.trim() !== '' &&
      v.email.trim() !== '' &&
      v.mobile !== '' &&
      v.dob !== '' &&
      v.password !== '' &&
      v.confirm !== '' &&
      v.terms
    : forgot
      ? v.email.trim() !== ''
      : v.email.trim() !== '' && v.password !== '';

  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname;
      setMode(path.startsWith('/signup') ? 'signup' : path.startsWith('/forgot') ? 'forgot' : 'login');
      setErrors({});
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function go(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setErrors({});
    window.history.pushState(null, '', `/${next}`);
    document.title = copy[next].doc;
  }

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const cls = (key: keyof Values) => `${control} ${errors[key] ? 'border-ink' : 'border-line'}`;
  const aria = (key: keyof Values) => ({
    'aria-invalid': errors[key] ? (true as const) : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : undefined,
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ready) return;
    const found = validate(mode, v);
    setErrors(found);
    const first = (['name', 'email', 'mobile', 'dob', 'password', 'confirm', 'terms'] as const).find(
      (k) => found[k],
    );
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    // Wrong credentials and taken emails will come back from the API inline;
    // network and rate-limit failures land in the toast.
    setToast(copy[mode].toast);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        style={compact}
        className="flex w-full flex-col items-center gap-[clamp(14px,2.8dvh,28px)]"
      >
        <p data-anim="rise" className="font-serif text-4xl tracking-tight lg:hidden">
          bargad
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease }}
            className="flex flex-col items-center gap-[clamp(6px,1.4dvh,16px)] text-center"
          >
            <h1
              data-anim="rise"
              className="max-w-[14ch] font-serif text-[clamp(30px,5.4dvh,40px)] leading-[1.05] tracking-[-0.02em] sm:max-w-none"
            >
              {copy[mode].title}
            </h1>
            <p data-anim="rise" className="text-base text-ink-3">
              {copy[mode].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="w-full max-w-[390px]">
          <Collapse show={login} index={0}>
            <div data-anim="rise">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                transition={press}
                className="flex h-[var(--ctl)] w-full items-center justify-center gap-3 rounded-full bg-ink text-base font-medium text-bg transition-opacity hover:opacity-90"
              >
                <ThumbprintIcon size={20} />
                Log in with passkey
              </motion.button>
            </div>
          </Collapse>

          <Collapse show={login} index={1}>
            <div data-anim="rise" className="flex items-center gap-4 text-sm text-ink-3">
              <span className="h-px flex-1 bg-line" />
              or
              <span className="h-px flex-1 bg-line" />
            </div>
          </Collapse>

          <form onSubmit={onSubmit} noValidate>
            <Collapse show={signup} index={0}>
              <Field id="name" label="Full name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  value={v.name}
                  onChange={(e) => set('name', e.target.value)}
                  autoComplete="name"
                  placeholder="As on your PAN"
                  className={cls('name')}
                  {...aria('name')}
                />
              </Field>
            </Collapse>

            <Row>
              <Field id="email" label="Email" error={errors.email}>
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
                    onChange={(e) => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    autoComplete="tel-national"
                    placeholder="98765 43210"
                    className={`${cls('mobile')} pl-[3.25rem]`}
                    {...aria('mobile')}
                  />
                </div>
              </Field>
            </Collapse>

            <Collapse show={signup} index={2}>
              <DateField
                id="dob"
                value={v.dob}
                onChange={(iso) => set('dob', iso)}
                error={errors.dob}
                inputClass={cls('dob')}
              />
            </Collapse>

            <Collapse show={!forgot} index={0}>
              <div data-anim="rise" className="flex min-w-0 flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="password" className="text-[13px] font-medium text-ink-2">
                    Password
                  </label>
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
                        className="text-[13px] text-ink-3 underline underline-offset-2 hover:text-ink"
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
                    placeholder={signup ? 'At least 10 characters' : undefined}
                    className={`${cls('password')} pr-20`}
                    {...aria('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-pressed={showPassword}
                    className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-full px-3 text-sm font-medium text-ink-3 transition-colors hover:text-ink"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <Message id="password" error={errors.password} />
              </div>
            </Collapse>

            <Collapse show={signup} index={3}>
              <Field id="confirm" label="Confirm password" error={errors.confirm}>
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
                <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-ink-2">
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
                    className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-md border border-line bg-surface text-bg transition-colors peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.4 6.3 4.9 8.8 9.7 3.4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>
                    I'm 18 or older, and I agree to the{' '}
                    <a href="/terms" className="text-ink underline underline-offset-2">
                      Terms
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-ink underline underline-offset-2">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
                <Message id="terms" error={errors.terms} />
              </div>
            </Collapse>

            <div data-anim="rise">
              <motion.button
                type="submit"
                disabled={!ready}
                whileTap={ready ? { scale: 0.98 } : undefined}
                transition={press}
                className="h-[var(--ctl)] w-full overflow-hidden rounded-full bg-ink text-base font-medium text-bg transition-[background-color,color,opacity] duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-3 disabled:opacity-100"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mode}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.14, ease }}
                    className="block"
                  >
                    {copy[mode].button}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </form>

          <p data-anim="rise" className="pt-[calc(var(--stack)+4px)] text-center text-sm text-ink-3">
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
                      className="text-ink underline underline-offset-2 transition-opacity hover:opacity-70"
                    >
                      Log in
                    </a>
                  </>
                ) : (
                  <>
                    New here?{' '}
                    <a
                      href="/signup"
                      onClick={(e) => {
                        e.preventDefault();
                        go('signup');
                      }}
                      className="text-ink underline underline-offset-2 transition-opacity hover:opacity-70"
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
