export const getJwtSecret = (): string | undefined => {
  const secret = process.env.JWT_SECRET;
  return secret && secret.length >= 32 ? secret : undefined;
};
