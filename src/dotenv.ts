import path from "path";
import fs from "fs";
import expand from "./expand";
import { config, DotenvConfigOptions, DotenvConfigOutput } from "./core";

export type Option = Pick<DotenvConfigOptions, "debug" | "encoding"> & { cwd?: string };

export default function init(options?: Option): DotenvConfigOutput {
  const { cwd = process.cwd() } = options || {};
  const { NODE_ENV } = process.env;
  const dotenv = path.join(cwd, ".env");
  const dotenvFiles = [
    `${dotenv}.${NODE_ENV}.local`,
    `${dotenv}.local`,
    `${dotenv}.${NODE_ENV}`,
    dotenv
  ].filter(Boolean);
  return dotenvFiles.reduce<DotenvConfigOutput>(
    (prev, dotenvFile) => {
      if (typeof dotenvFile === "string" && fs.existsSync(dotenvFile)) {
        const { error, parsed } = expand(
          config({
            path: dotenvFile
          })
        );
        if (error) {
          throw new Error(error.toString());
        }
        Object.assign(prev.parsed, parsed);
        return prev;
      }
      return { error: undefined, parsed: {} };
    },
    { error: undefined, parsed: {} }
  );
}
