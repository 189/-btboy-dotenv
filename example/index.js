const path = require("path");
const initEnv = require("../dist/dotenv.umd");

process.env.NODE_ENV = "production";

initEnv({
  cwd: path.join(process.cwd(), "example")
});

console.log("process.env.LOCAL_VAR_A =>", process.env.LOCAL_VAR_A);
console.log("process.env.LOCAL_VAR_B =>", process.env.LOCAL_VAR_B);
console.log("process.env.DB_SECRET_KEY =>", process.env.DB_SECRET_KEY);
