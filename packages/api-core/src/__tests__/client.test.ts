import { ApiClient } from "../client";
import { ApiError } from "../errors";

describe("ApiClient", () => {
  const client: ApiClient = new ApiClient({
    baseURL: "https://api.example.com",
    timeout: 5000,
    contentType: "application/json",
  });

  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    // Mock global fetch
    fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
      headers: new Headers({
        "content-type": "application/json",
      }),
    } as Response);
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it("should create an instance", () => {
    expect(client).toBeInstanceOf(ApiClient);
  });

  describe("OTP authentication", () => {
    it("should include otp-token header when requiredOtp is true", async () => {
      await client.get("/secure-endpoint", {
        authentication: {
          token: "auth-token",
          otpToken: "123456",
        },
        options: {
          requiredAuth: true,
          requiredOtp: true,
        },
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, config] = fetchMock.mock.calls[0];

      expect(url).toBe("https://api.example.com/secure-endpoint");
      expect(config.headers).toMatchObject({
        Authorization: "Bearer auth-token",
        "otp-token": "123456",
        "Content-Type": "application/json",
      });
    });

    it("should include only otp-token header when requiredOtp is true without auth", async () => {
      await client.get("/otp-only", {
        authentication: {
          otpToken: "654321",
        },
        options: {
          requiredOtp: true,
        },
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [, config] = fetchMock.mock.calls[0];

      expect(config.headers).toMatchObject({
        "otp-token": "654321",
        "Content-Type": "application/json",
      });
      expect(config.headers.Authorization).toBeUndefined();
    });

    it("should override request-specific OTP token", async () => {
      await client.post("/update", {
        body: { data: "test" },
        authentication: {
          token: "auth-token",
          otpToken: "override-otp",
        },
        options: {
          requiredAuth: true,
          requiredOtp: true,
        },
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [, config] = fetchMock.mock.calls[0];

      expect(config.headers).toMatchObject({
        Authorization: "Bearer auth-token",
        "otp-token": "override-otp",
        "Content-Type": "application/json",
      });
    });

    it("should not include otp-token header when requiredOtp is false", async () => {
      await client.get("/public-endpoint", {
        authentication: {
          token: "auth-token",
          otpToken: "123456",
        },
        options: {
          requiredAuth: true,
        },
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [, config] = fetchMock.mock.calls[0];

      expect(config.headers["otp-token"]).toBeUndefined();
      expect(config.headers.Authorization).toBe("Bearer auth-token");
    });
  });

  describe("Error handling", () => {
    it("should throw ApiError when auth token is required but not provided", async () => {
      await expect(
        client.get("/secure-endpoint", {
          options: {
            requiredAuth: true,
          },
        })
      ).rejects.toThrow(ApiError);

      await expect(
        client.get("/secure-endpoint", {
          options: {
            requiredAuth: true,
          },
        })
      ).rejects.toThrow("Required Token");
    });

    it("should throw ApiError when OTP token is required but not provided", async () => {
      await expect(
        client.get("/secure-endpoint", {
          authentication: {
            token: "auth-token",
          },
          options: {
            requiredAuth: true,
            requiredOtp: true,
          },
        })
      ).rejects.toThrow(ApiError);

      await expect(
        client.get("/secure-endpoint", {
          authentication: {
            token: "auth-token",
          },
          options: {
            requiredAuth: true,
            requiredOtp: true,
          },
        })
      ).rejects.toThrow("Required OTP Token");
    });

    it("should throw ApiError with correct status code and error code", async () => {
      try {
        await client.get("/secure-endpoint", {
          options: {
            requiredAuth: true,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(401);
        expect((error as ApiError).code).toBe("AUTH_TOKEN_REQUIRED");
      }
    });

    it("should throw ApiError with correct error code for OTP", async () => {
      try {
        await client.get("/secure-endpoint", {
          authentication: {
            token: "auth-token",
          },
          options: {
            requiredAuth: true,
            requiredOtp: true,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(401);
        expect((error as ApiError).code).toBe("OTP_TOKEN_REQUIRED");
      }
    });
  });
});
