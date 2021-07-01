import { DotenvConfigOutput } from "./core";

export default function expand(config: DotenvConfigOutput): DotenvConfigOutput {
  const environment = process.env;

  if (config.error) {
    return config;
  }

  const interpolate = function(envValue: string): string {
    const matches = envValue.match(/(.?\${?(?:[a-zA-Z0-9_]+)?}?)/g) || [];

    return matches.reduce<string>((newEnv, match) => {
      const parts = /(.?)\${?([a-zA-Z0-9_]+)?}?/g.exec(match) || [];
      const prefix = parts[1];

      let value;
      let replacePart;

      if (prefix === "\\") {
        replacePart = parts[0];
        value = replacePart.replace("\\$", "$");
      } else {
        let key = parts[2];
        replacePart = parts[0].substring(prefix.length);
        // process.env value 'wins' over .env file's value
        value = environment.hasOwnProperty(key) ? environment[key] : config?.parsed?.[key] || "";

        // Resolve recursive interpolations
        value = interpolate(value || "");
      }

      return newEnv.replace(replacePart, value);
    }, envValue);
  };

  for (let configKey in config.parsed) {
    if (config.parsed.hasOwnProperty(configKey)) {
      let value = environment.hasOwnProperty(configKey)
        ? environment[configKey]
        : config.parsed[configKey];

      config.parsed[configKey] = interpolate(value || "");
    }
  }

  for (let processKey in config.parsed) {
    if (config.parsed.hasOwnProperty(processKey)) {
      environment[processKey] = config.parsed[processKey];
    }
  }

  return config;
}
