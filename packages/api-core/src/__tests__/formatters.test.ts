import {
  formatQueryParams,
  formatHeaders,
  formatBody,
  isFormData,
} from "../utils";

describe("formatQueryParams", () => {
  it("should format query parameters correctly", () => {
    const params = {
      page: 1,
      limit: 10,
      search: "test",
    };
    expect(formatQueryParams(params)).toBe("?page=1&limit=10&search=test");
  });

  it("should return empty string when no params", () => {
    expect(formatQueryParams()).toBe("");
    expect(formatQueryParams({})).toBe("");
  });

  it("should skip undefined and null values", () => {
    const params = {
      page: 1,
      limit: undefined,
      search: null,
    };
    expect(formatQueryParams(params)).toBe("?page=1");
  });
});

describe("formatHeaders", () => {
  it("should include authorization header when auth token is provided", () => {
    const headers = formatHeaders(
      {},
      { token: "test-token" },
      { requiredAuth: true }
    );
    expect(headers["Authorization"]).toBe("Bearer test-token");
  });

  it("should include otp-token header when OTP is provided", () => {
    const headers = formatHeaders(
      {},
      { otpToken: "123456" },
      { requiredOtp: true }
    );
    expect(headers["otp-token"]).toBe("123456");
  });

  it("should merge custom headers", () => {
    const headers = formatHeaders({
      "X-Custom": "value",
    });
    expect(headers["X-Custom"]).toBe("value");
    expect(headers["Content-Type"]).toBe("application/json");
  });
});

describe("formatBody", () => {
  it("should stringify JSON body", () => {
    const body = {
      name: "test",
    };
    expect(formatBody(body)).toBe(JSON.stringify(body));
  });

  it("should return FormData as is", () => {
    const formData = new FormData();
    expect(formatBody(formData)).toBe(formData);
  });

  it("should return undefined when no body", () => {
    expect(formatBody()).toBeUndefined();
  });
});

describe("isFormData", () => {
  it("should return true for FormData", () => {
    const formData = new FormData();
    expect(isFormData(formData)).toBe(true);
  });

  it("should return false for non-FormData", () => {
    expect(isFormData({})).toBe(false);
    expect(isFormData("string")).toBe(false);
    expect(isFormData(null)).toBe(false);
  });
});
