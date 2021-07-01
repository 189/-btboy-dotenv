import initEnv from "../src/dotenv";

describe("Test Set Env", () => {
  it("Check development environment", () => {
    process.env.NODE_ENV = "development";
    initEnv({
      debug: true
    });
    expect(true).toBeTruthy();
  });
});
