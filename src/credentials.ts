import "./env";

const credentials = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URL: process.env.REDIRECT_URL,
  SCOPES: process.env.SCOPES || "",
};

export { credentials };
