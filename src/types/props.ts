import { FormError } from "./Error";
import { SignUpCredentials } from "./authCredentials";

export type SignUpProps = {
  fields: SignUpCredentials;
  onUserSignUp: (value: boolean) => void;
  signUpHandler: (
    signUpCredentials: SignUpCredentials,
    setUserSignUp: (value: boolean) => void,
    setErrorResponse: (value: string | null) => void,
    setDisableButton: (value: boolean | { (value: boolean): boolean }) => void
  ) => void;
  errors: FormError;
  setErrors: (value: FormError | { (state: FormError): FormError }) => void;
  errorResponse: string | null;
  setErrorResponse: (value: string | null) => void;
  disableButton: boolean;
  setDisabledButton: (value: boolean | { (value: boolean): boolean }) => void;
  children: React.ReactNode;
};
