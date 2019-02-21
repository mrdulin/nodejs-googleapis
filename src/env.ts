import dotenv from "dotenv";

const dotenvOutput = dotenv.config({ debug: process.env.NODE_ENV !== "production" });

if (dotenvOutput.error) {
  throw dotenvOutput.error;
}
console.log(dotenvOutput.parsed);
