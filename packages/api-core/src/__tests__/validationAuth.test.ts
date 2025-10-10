import { ApiError } from "../errors";
import { validationAuth } from "../utils";

describe("validationAuth", () => {
  it("should throw error when auth token is required but not provided", () => {
    expect(() => {
      validationAuth({ requiredAuth: true }, {});
    }).toThrow(ApiError);

    expect(() => {
      validationAuth({ requiredAuth: true }, {});
    }).toThrow("Required Token");
  });

  it("should throw error when OTP token is required but not provided", () => {
    expect(() => {
      validationAuth({ requiredOtp: true }, {});
    }).toThrow(ApiError);

    expect(() => {
      validationAuth({ requiredOtp: true }, {});
    }).toThrow("Required OTP Token");
  });

  it("should not throw when auth token is provided", () => {
    expect(() => {
      validationAuth({ requiredAuth: true }, { token: "test-token" });
    }).not.toThrow();
  });

  it("should not throw when OTP token is provided", () => {
    expect(() => {
      validationAuth({ requiredOtp: true }, { otpToken: "123456" });
    }).not.toThrow();
  });

  it("should not throw when no auth is required", () => {
    expect(() => {
      validationAuth({}, {});
    }).not.toThrow();
  });
});
