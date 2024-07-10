"use client";

import React, { useState } from "react";
import Image from "next/image";

import AuthInput from "./Input";
import { LoginCredentials } from "@/types/authCredentials";

type LoginProps = {
  fields: LoginCredentials;
  onUserSignUp: (value: boolean) => void;
  loginHandler: (
    loginCredentials: LoginCredentials,
    setIsUserLogin: (value: boolean) => void,
    setErrorResponse: (value: string | null) => void,
    setDisabledLoginButton: (value: boolean) => void
  ) => void;
  errorErrorResponse: string | null;
  setErrorResponse: (value: string | null) => void;
  setIsUserLogin: (value: boolean) => void;
  disableLoginButton: boolean;
  onDisabledLoginButton: (value: boolean) => void;
  children: React.ReactNode;
};

const Login = ({
  fields,
  onUserSignUp,
  loginHandler,
  errorErrorResponse,
  setErrorResponse,
  setIsUserLogin,
  disableLoginButton,
  onDisabledLoginButton,
  children,
}: LoginProps) => {
  return (
    <section className="grid place-items-center h-svh lg:h-screen">
      <div className="w-10/12 max-w-80">
        <h3 className="text-center m-3 text-2xl font-semibold">Log In</h3>
        {errorErrorResponse && (
          <p className="text-red-600 text-xs mb-2">{errorErrorResponse}</p>
        )}
        <form onSubmit={(e) => e.preventDefault()}>
          {children}
          {disableLoginButton && <p className="text-sm my-2">Logging in...</p>}
          <div className="flex justify-center">
            <button
              className={`${
                disableLoginButton ? "bg-blue-500" : "bg-blue-700"
              } my-3 px-4 py-2 text-white text-sm rounded-md`}
              disabled={disableLoginButton}
              onClick={() => {
                loginHandler(
                  fields,
                  setIsUserLogin,
                  setErrorResponse,
                  onDisabledLoginButton
                );
                onDisabledLoginButton(true);
              }}
            >
              Login to account
            </button>
          </div>
        </form>
        <p className="text-xs text-left">
          {"Don't have an account,"}
          <button
            className="text-blue-500 ml-1"
            onClick={() => onUserSignUp(false)}
          >
            Sign Up
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
          <p className="font-semibold mr-1">caresafe</p>
          <p className="text-gray-500">for Business</p>
        </div>
      </div>
    </section>
  );
};

export default Login;
