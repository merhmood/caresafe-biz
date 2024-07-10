import { LoginCredentials } from "@/types/authCredentials";
import { API_URL } from "./constants";

// Handles the login request
export const loginHandler = (
  loginCredentials: LoginCredentials,
  setIsUserLogin: (value: boolean) => void,
  setErrorResponse: (value: string | null) => void,
  setDisbaledLoginButton: (value: boolean) => void
) => {
  fetch(`${API_URL}/login`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ login: loginCredentials }),
    method: "POST",
  })
    .then((data) => {
      if (data.status === 200) {
        location.href = "/";
      }
      if (data.status === 401) {
        setErrorResponse("Invalid credentials");
        setDisbaledLoginButton(false);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("fields");
        localStorage.removeItem("user_id");
      }
      return data.json();
    })
    .then((data) => {
      if (!data.message) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_id", data.user);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
