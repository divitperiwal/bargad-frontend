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
  if (v.name.trim().length < 2) e.name = 'Please tell us your full name.';
  if (!/^[6-9]\d{9}$/.test(v.mobile)) e.mobile = 'Please enter your 10-digit mobile number.';
  const age = ageOn(v.dob);
  if (age === null) e.dob = 'Please add your date of birth.';
  else if (age < 18) e.dob = 'You need to be 18 or older to have a Bargad account.';
  if (v.password.length < 10) e.password = 'Your password needs at least 10 characters.';
  if (v.confirm !== v.password) e.confirm = "These two passwords don't match yet.";
  if (!v.terms) e.terms = 'Please tick this box to carry on.';
  return e;
}
