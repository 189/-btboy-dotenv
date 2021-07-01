import path from "path";
import fs from "fs";
import expand from "./expand";
import { config, DotenvConfigOptions, DotenvConfigOutput } from "./core";

export default function init(options?: DotenvConfigOptions): DotenvConfigOutput {
  const { NODE_ENV } = process.env;
  const dotenv = path.join(process.cwd(), ".env");
  const dotenvFiles = [
    `${dotenv}.${NODE_ENV}.local`,
    NODE_ENV !== "test" && `${dotenv}.local`,
    `${dotenv}.${NODE_ENV}`,
    dotenv
  ].filter(Boolean);

  return dotenvFiles.reduce<DotenvConfigOutput>(
    (prev, dotenvFile) => {
      if (typeof dotenvFile === "string" && fs.existsSync(dotenvFile)) {
        const { error, parsed } = expand(config(options));
        if (error) {
          throw new Error(error.toString());
        }
        prev.parsed = Object.assign({}, prev.parsed, parsed);
        return prev;
      }
      return { error: undefined, parsed: {} };
    },
    { error: undefined, parsed: {} }
  );
}
