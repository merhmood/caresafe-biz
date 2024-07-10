import { ValidationError, FormError } from "@/types/Error";
import { SignUpCredentials } from "@/types/authCredentials";

const setValidationErrorHandler = (
  error: ValidationError,
  setErrors: (value: FormError | { (state: FormError): FormError }) => void,
  signUpHandler: (
    fields: SignUpCredentials,
    setUserSignUp: (value: boolean) => void,
    setErrorResponse: (value: string | null) => void,
    setDisableButton: (value: boolean | { (value: boolean): boolean }) => void
  ) => void,
  setErrorResponse: (value: string | null) => void,
  setUserSignUp: (value: boolean) => void,
  signUpCredentials: SignUpCredentials,
  setDisableButton: (value: boolean | { (value: boolean): boolean }) => void
) => {
  //checks for invalid email
  error.code === 11
    ? setErrors((state) => ({ ...state, invalidEmail: true }))
    : setErrors((state) => ({ ...state, invalidEmail: false }));

  //checks for empty value
  error.code === 12
    ? setErrors((state) => ({ ...state, empty: true }))
    : setErrors((state) => ({ ...state, empty: false }));

  //checks for invalid password
  error.code === 14
    ? setErrors((state) => ({
        ...state,
        invalidPassword: true,
      }))
    : setErrors((state) => ({
        ...state,
        invalidPassword: false,
      }));

  //checks for empty value
  error.code === 13
    ? setErrors((state) => ({
        ...state,
        passwordNotSame: true,
      }))
    : setErrors((state) => ({
        ...state,
        passwordNotSame: false,
      }));

  //no error
  if (error.code === 99) {
    setDisableButton(true);
    signUpHandler(
      signUpCredentials,
      setUserSignUp,
      setErrorResponse,
      setDisableButton
    );
  }
};

export default setValidationErrorHandler;
