export interface RegistrationDetails {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const validateRegistration = ({
  name,
  email,
  password,
  confirmPassword,
}: RegistrationDetails): string | null => {
  if (!name.trim()) return 'Please enter your full name.';
  if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return 'Please enter a valid email address.';
  }
  if (password.length < 6 || password.length > 128) {
    return 'Password must be between 6 and 128 characters long.';
  }
  if (password !== confirmPassword) return 'Passwords do not match.';
  return null;
};
