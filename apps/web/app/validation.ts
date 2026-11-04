export type Account = {
  name: string;
  email: string;
  password: string;
  terms: boolean;
};

export type Details = {
  mobile: string;
  dob: string;
};

export type Profile = Account & Details;
export type ProfileErrors = Partial<Record<keyof Profile, string>>;

export function ageOn(dob: string, today = new Date()) {
  const d = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return age;
}

export function validateEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email.trim())
    ? undefined
    : "That email doesn't look quite right. Could there be a typo?";
}

/** Sign-up step one: who you are and how you'll log in. */
export function validateAccount(v: Account): ProfileErrors {
  const e: ProfileErrors = {};
  if (v.name.trim().length < 2) e.name = 'Please tell us your full name.';
  const email = validateEmail(v.email);
  if (email) e.email = email;
  if (v.password.length < 10) e.password = 'Your password needs at least 10 characters.';
  if (!v.terms) e.terms = 'Please tick this box to carry on.';
  return e;
}

/** Sign-up step two: how to reach you, and the age check (18 and over). */
export function validateDetails(v: Details): ProfileErrors {
  const e: ProfileErrors = {};
  if (!/^[6-9]\d{9}$/.test(v.mobile)) e.mobile = 'Please enter your 10-digit mobile number.';
  const age = ageOn(v.dob);
  if (age === null) e.dob = 'Please add your date of birth.';
  else if (age < 18) e.dob = 'You need to be 18 or older to have a Bargad account.';
  return e;
}

/** The rules every new account follows, whether it signs up or accepts an invite. */
export function validateProfile(v: Profile): ProfileErrors {
  return { ...validateAccount(v), ...validateDetails(v) };
}
