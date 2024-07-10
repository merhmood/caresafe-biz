export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  name: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type AuthCredentials = LoginCredentials | SignUpCredentials;

export default AuthCredentials;
