// https://www.jestjs.cn/docs/expect

import path from "path";
import initEnv from "../src/dotenv";

describe("Test Set Env", () => {
  it("Check development environment", () => {
    process.env.NODE_ENV = "development";
    initEnv({
      cwd: path.join(process.cwd(), "example"),
      debug: true
    });
    expect(process.env.LOCAL_VAR_A).toBe("a");
    expect(process.env.LOCAL_VAR_B).toBe("B");
    expect(process.env.DB_SECRET_KEY).toBe("dev_secret_key");
  });
  // it("Check prouction environment", () => {
  //   process.env.NODE_ENV = "production";
  //   initEnv({
  //     cwd: path.join(process.cwd(), "example"),
  //     debug: true
  //   });
  //   expect(process.env.LOCAL_VAR_A).toBe("a");
  //   expect(process.env.LOCAL_VAR_B).toBe("B");
  //   expect(process.env.DB_SECRET_KEY).toBe("prod_secret_key");
  // });
});
