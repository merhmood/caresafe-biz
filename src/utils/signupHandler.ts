import { SignUpCredentials } from "@/types/authCredentials";
import { API_URL } from "./constants";

// Handles the sign up request
const signUpHandler = (
  signUpCredentials: SignUpCredentials,
  setUserSignUp: (value: boolean) => void,
  setErrorResponse: (value: string | null) => void,
  setDisableButton: (value: boolean | { (value: boolean): boolean }) => void
) => {
  fetch(`${API_URL}/signup`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ signUp: signUpCredentials }),
    method: "POST",
  })
    .then((data) => {
      if (data.status === 200) {
        setUserSignUp(true);
      }
      if (data.status === 409) {
        setErrorResponse("information already exists");
        setDisableButton(false);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export default signUpHandler;
