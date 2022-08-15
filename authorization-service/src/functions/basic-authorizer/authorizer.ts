const { USERNAME, PASSWORD } = process.env;

type AuthorizePayload = {
    login: string;
    password: string;
};

export const authorize = ({ login, password }: AuthorizePayload) => {
  if (login !== USERNAME || password !== PASSWORD) {
    throw new Error('Username or password is invalid.');
  }
};
