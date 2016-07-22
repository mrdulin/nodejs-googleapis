import dotenv from "dotenv";
import path from "path";

const dotenvOutput = dotenv.config({
  debug: process.env.NODE_ENV !== "production",
  path: path.resolve(__dirname, "../.env"),
});

if (dotenvOutput.error) {
  throw dotenvOutput.error;
}
console.log(dotenvOutput.parsed);
