export type ValidationError = { code: number; msg?: string };

export type FormError = {
  invalidEmail: boolean;
  passwordNotSame: boolean;
  invalidPassword: boolean;
  empty: boolean;
};
