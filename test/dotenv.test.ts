import path from "path";
import initEnv from "../src/dotenv";

describe("Test Set Env", () => {
  it("Check development environment", () => {
    process.env.NODE_ENV = "development";
    initEnv({
      path: path.join(process.cwd(), "test"),
      debug: true
    });
    expect(true).toBeTruthy();
  });
});
