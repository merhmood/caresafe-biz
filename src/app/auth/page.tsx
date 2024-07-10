"use client";

import React, { ChangeEventHandler, useEffect, useState } from "react";

import SignUp from "@/components/SignUp";
import Login from "@/components/Login";
import signUpHandler from "@/utils/signupHandler";
import AuthInput from "@/components/Input";
import { redirect } from "next/navigation";
import { LoginCredentials, SignUpCredentials } from "@/types/authCredentials";
import { loginHandler } from "@/utils/loginHandler";

export default function AuthPage() {
  // State for sign up form fields
  const [signUp, setSignUp] = useState<SignUpCredentials>({
    name: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for login form fields
  const [login, setLogin] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  // State for rendering sign up or login component
  const [isUserSignUp, setIsUserSignUp] = useState(true);
  const [isUserLogin, setIsUserLogin] = useState(true);

  // State for login error response
  const [loginErrorResponse, setLoginErrorResponse] = useState<string | null>(
    null
  );

  // State for sign up form errors
  const [errors, setErrors] = useState({
    invalidEmail: false,
    passwordNotSame: false,
    invalidPassword: false,
    empty: false,
  });

  // State for sign up error response
  const [signUpErrorResponse, setSignUpErrorResponse] = useState<string | null>(
    null
  );

  // State for disabling the sign up button
  const [disableButton, setDisabledButton] = useState(false);

  // State for disabling the login button
  const [disableLoginButton, setDisabledLoginButton] = useState(false);

  // Checks if the user is logged in
  useEffect(() => {
    // Redirects the user to the dashboard if the user is logged in
    if (!localStorage.getItem("token")) {
      setIsUserLogin(false);
    } else {
      redirect("/");
    }
  }, []);

  // Handles sign up form field changes
  const onChangeHandlerSignUp: ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSignUp((state) => ({ ...state, [name]: value }));
  };

  // Sign up component props
  const signUpProps = {
    fields: signUp,
    onUserSignUp: setIsUserSignUp,
    signUpHandler,
    errors,
    setErrors,
    disableButton,
    setDisabledButton,
    errorResponse: signUpErrorResponse,
    setErrorResponse: setSignUpErrorResponse,
  };

  // Login component props
  const loginProps = {
    fields: login,
    onUserSignUp: setIsUserSignUp,
    loginHandler,
    errorErrorResponse: loginErrorResponse,
    setErrorResponse: setLoginErrorResponse,
    disableLoginButton,
    onDisabledLoginButton: setDisabledLoginButton,
    setIsUserLogin,
  };

  // Renders sign up or login component based on user selection
  if (!isUserLogin) {
    if (!isUserSignUp) {
      // Renders the sign up form
      return (
        <SignUp {...signUpProps}>
          {Object.entries(signUp).map((value, index) => {
            const { fieldType, placeholder } = getPlaceHolderandFieldType(
              value[0]
            );
            return (
              <React.Fragment key={index}>
                {
                  // Renders the input fields
                  <>
                    <AuthInput
                      key={index}
                      type={fieldType}
                      onChange={(e) => {
                        onChangeHandlerSignUp(e);
                        setSignUpErrorResponse(null);
                      }}
                      placeholder={placeholder}
                      value={value[0]}
                    />
                    {value[0] === "password" && (
                      <p className="text-xs mb-4">
                        8 or more character password
                      </p>
                    )}
                  </>
                }
              </React.Fragment>
            );
          })}
        </SignUp>
      );
    } else {
      // Renders the login form
      return (
        <Login {...loginProps}>
          {Object.entries(login).map((value, index) => {
            const { fieldType, placeholder } = getPlaceHolderandFieldType(
              value[0]
            );
            return (
              <AuthInput
                key={index}
                type={fieldType}
                placeholder={placeholder}
                onChange={(e) => {
                  const name = e.target.name;
                  const value = e.target.value;
                  setLogin((state) => ({ ...state, [name]: value }));
                  setErrors({
                    invalidEmail: false,
                    passwordNotSame: false,
                    invalidPassword: false,
                    empty: false,
                  });
                  setLoginErrorResponse(null);
                }}
                value={value[0]}
              />
            );
          })}
        </Login>
      );
    }
  }
}

// Gets the placeholder and field type
const getPlaceHolderandFieldType = (value: string) => {
  const placeholder = value === "confirmPassword" ? "confirm password" : value;
  const fieldType =
    value === "password" || value === "confirmPassword"
      ? "password"
      : value === "email"
      ? "email"
      : "text";
  return { placeholder, fieldType };
};
