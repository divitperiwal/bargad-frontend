export type Profile = {
  name: string;
  mobile: string;
  dob: string;
  password: string;
  confirm: string;
  terms: boolean;
};
export type ProfileErrors = Partial<Record<keyof Profile, string>>;

export function ageOn(dob: string, today = new Date()) {
  const d = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return age;
}

/** The rules every new account follows, whether it signs up or accepts an invite. */
export function validateProfile(v: Profile): ProfileErrors {
  const e: ProfileErrors = {};
  if (v.name.trim().length < 2) e.name = 'Enter your full name.';
  if (!/^[6-9]\d{9}$/.test(v.mobile)) e.mobile = 'Enter a 10-digit mobile number.';
  const age = ageOn(v.dob);
  if (age === null) e.dob = 'Enter your date of birth.';
  else if (age < 18) e.dob = 'Bargad accounts are for people 18 and over.';
  if (v.password.length < 10) e.password = 'Use at least 10 characters.';
  if (v.confirm !== v.password) e.confirm = "The passwords don't match.";
  if (!v.terms) e.terms = 'Accept the terms to continue.';
  return e;
}
