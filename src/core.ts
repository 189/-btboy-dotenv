import fs from "fs";
import path from "path";
import os from "os";

type DotenvParseOptions = {
  debug?: boolean;
};

export type DotenvParseOutput = { [key: string]: string };

export type DotenvConfigOptions = {
  path?: string;
  encoding?: BufferEncoding;
  debug?: boolean;
};

export type DotenvConfigOutput = {
  parsed?: DotenvParseOutput;
  error?: Error;
};

function log(message: string) {
  console.log(`[dotenv][DEBUG] ${message}`);
}

const NEWLINE = "\n";
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const RE_NEWLINES = /\\n/g;
const NEWLINES_MATCH = /\r\n|\n|\r/;

// Parses src into an Object
function parse(filecontent: string | Buffer, options: DotenvParseOptions): DotenvParseOutput {
  const debug = Boolean(options && options.debug);
  const obj: AnyKV<string> = {};

  // convert Buffers before splitting into lines and processing
  filecontent
    .toString()
    .split(NEWLINES_MATCH)
    .forEach((line, idx) => {
      // matching "KEY' and 'VAL' in 'KEY=VAL'
      const keyValueArr = line.match(RE_INI_KEY_VAL);
      // matched?
      if (keyValueArr != null) {
        const key = keyValueArr[1];
        // default undefined or missing values to empty string
        let val = keyValueArr[2] || "";
        const end = val.length - 1;
        const isDoubleQuoted = val[0] === '"' && val[end] === '"';
        const isSingleQuoted = val[0] === "'" && val[end] === "'";

        // if single or double quoted, remove quotes
        if (isSingleQuoted || isDoubleQuoted) {
          val = val.substring(1, end);

          // if double quoted, expand newlines
          if (isDoubleQuoted) {
            val = val.replace(RE_NEWLINES, NEWLINE);
          }
        } else {
          // remove surrounding whitespace
          val = val.trim();
        }

        obj[key] = val;
      } else if (debug) {
        log(`did not match key and value when parsing line ${idx + 1}: ${line}`);
      }
    });

  return obj;
}

function resolveHome(envPath: string) {
  return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
}

// Populates process.env from .env file
function config(options?: DotenvConfigOptions): DotenvConfigOutput {
  let dotenvPath = path.resolve(process.cwd(), ".env");
  let encoding: BufferEncoding = "utf8";
  let debug = false;

  if (options) {
    dotenvPath = options.path ? resolveHome(options.path) : "";
    encoding = options.encoding || "utf8";
    debug = Boolean(options.debug);
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug });

    Object.keys(parsed).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key];
      } else if (debug) {
        log(`"${key}" is already defined in \`process.env\` and will not be overwritten`);
      }
    });

    return { parsed };
  } catch (e) {
    return { error: e };
  }
}

export { config };
