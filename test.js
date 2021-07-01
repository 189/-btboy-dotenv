const initEnv = require("./dist/dotenv.umd");

process.env.NODE_ENV = "production";

initEnv();

console.log(process.env.DB_SECRET_KEY);
