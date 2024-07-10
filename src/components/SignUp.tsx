"use client";

import { isEmail, isEmpty, isStrongPassword } from "validator";

import React from "react";
import Image from "next/image";
import { SignUpCredentials } from "@/types/authCredentials";
import { SignUpProps } from "@/types/props";
import { ValidationError, FormError } from "@/types/Error";
import setValidationErrorHandler from "@/utils/setValidationErrorHandler";

const SignUp = ({
  fields,
  onUserSignUp,
  signUpHandler,
  errors,
  setErrors,
  disableButton,
  setDisabledButton,
  errorResponse,
  setErrorResponse,
  children,
}: SignUpProps) => {
  return (
    <section className="grid place-items-center h-svh lg:h-screen">
      <div className="w-10/12 max-w-80">
        <h3 className="text-center m-3 text-2xl font-semibold">Sign Up</h3>
        <p className="text-xs mb-5">
          Create an account for a healthcare provider
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          <FormErrorMessage errors={errors} />
          {errorResponse && (
            <p className="text-red-600 text-xs mb-2">{errorResponse}</p>
          )}
          {
            // maps through the fields and displays the input fields
            children
          }
          {disableButton && <span className="text-xs mb-1">loading...</span>}
          <div className="flex justify-center">
            <button
              className={`${
                disableButton ? "bg-blue-400" : "bg-blue-700"
              } my-3 px-4 py-2 text-white text-sm rounded-md`}
              disabled={disableButton}
              onClick={() => {
                signUpValidation(fields, (error) => {
                  setValidationErrorHandler(
                    error,
                    setErrors,
                    signUpHandler,
                    setErrorResponse,
                    onUserSignUp,
                    fields,
                    setDisabledButton
                  );
                });
              }}
            >
              Create an account
            </button>
          </div>
        </form>
        <p className="text-xs text-left">
          Already have an account.
          <button
            className="text-blue-500 ml-1"
            onClick={() => onUserSignUp(true)}
          >
            login
          </button>
        </p>
        {/*logo and app name*/}
        <div className="flex justify-center items-center mt-10 mb-6">
          <Image
            src="/logo.svg"
            alt="Omnihale logo"
            width={30}
            height={30}
            className="mr-3 rounded-md"
          />
          <p className="font-semibold mr-1">Caresafe</p>
          <p className="text-gray-500">for Business</p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;

const FormErrorMessage = ({ errors }: { errors: FormError }) => {
  return (
    <ul className="mb-2">
      {errors.invalidEmail && (
        <li className="text-red-600 text-xs"> You entered an invalid email.</li>
      )}
      {errors.empty && (
        <li className="text-red-600 text-xs">Some fields are empty.</li>
      )}
      {errors.invalidPassword && (
        <li className="text-red-600 text-xs">Enter a valid password.</li>
      )}
      {errors.passwordNotSame && (
        <li className="text-red-600 text-xs">Passwords are not the same.</li>
      )}
    </ul>
  );
};

//
const signUpValidation = (
  fields: SignUpCredentials,
  validationErrorHandler: (error: ValidationError) => void
) => {
  if (!isEmail(fields.email)) {
    validationErrorHandler({ code: 11, msg: "invalid email" });
    return;
  }
  if (fields.password !== fields.confirmPassword) {
    validationErrorHandler({ code: 13, msg: "password doesn't match" });
    return;
  }
  if (
    !isStrongPassword(fields.password, {
      minLength: 8,
      minUppercase: 0,
      minSymbols: 0,
      minNumbers: 0,
      minLowercase: 0,
    })
  ) {
    validationErrorHandler({ code: 14, msg: "invalid password" });
    return;
  }

  const arrayFields = Object.entries(fields);
  for (let value of arrayFields) {
    if (isEmpty(value[1])) {
      validationErrorHandler({ code: 12, msg: "empty field" });
      return;
    }
  }

  validationErrorHandler({ code: 99, msg: "no error" });
  return;
};
