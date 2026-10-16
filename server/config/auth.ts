export const getJwtSecret = (): string | undefined => {
  const secret = process.env.JWT_SECRET || 'fixnear-super-secure-jwt-secret-key-at-least-32-chars-long-2026';
  return secret && secret.length >= 32 ? secret : undefined;
};
