import { ApiClient } from "../client";
import { ApiError } from "../errors";
import { ApiServerClient } from "../server";

function jsonResponse(status: number, body: unknown, statusText = ""): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: async () => body,
    headers: new Headers({ "content-type": "application/json" }),
  } as Response;
}

function textResponse(status: number, statusText: string): Response {
  return {
    ok: false,
    status,
    statusText,
    json: async () => {
      throw new SyntaxError("Unexpected token < in JSON");
    },
    headers: new Headers({ "content-type": "text/html" }),
  } as unknown as Response;
}

async function catchApiError(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (error) {
    expect(error).toBeInstanceOf(ApiError);
    return error as ApiError;
  }
  throw new Error("Expected the request to fail");
}

describe("processRequest", () => {
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    fetchMock = jest.spyOn(global, "fetch");
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("HTTP errors", () => {
    const client = new ApiServerClient({ baseURL: "https://api.example.com" });

    it("keeps the server's message, errorCode and body", async () => {
      const body = { success: false,
        message: "Budget not found",
        errorCode: "BUDGET_NOT_FOUND" };
      fetchMock.mockResolvedValue(jsonResponse(404, body, "Not Found"));

      const error = await catchApiError(client.get("/budgets/1"));

      expect(error.message).toBe("Budget not found");
      expect(error.status).toBe(404);
      expect(error.code).toBe("BUDGET_NOT_FOUND");
      expect(error.data).toEqual(body);
    });

    it("accepts `code` as the error code field", async () => {
      fetchMock.mockResolvedValue(jsonResponse(409, { message: "Taken",
        code: "EMAIL_TAKEN" }));

      const error = await catchApiError(client.post("/users", { email: "a@b.c" }));

      expect(error.code).toBe("EMAIL_TAKEN");
    });

    it("falls back to the status line when the body is not JSON", async () => {
      fetchMock.mockResolvedValue(textResponse(502, "Bad Gateway"));

      const error = await catchApiError(client.get("/users"));

      expect(error.message).toBe("HTTP 502: Bad Gateway");
      expect(error.status).toBe(502);
      expect(error.code).toBe("HTTP_ERROR");
      expect(error.data).toBeUndefined();
    });
  });

  describe("with retry", () => {
    const client = new ApiServerClient({
      baseURL: "https://api.example.com",
      options: { retry: { maxRetries: 2,
        retryDelay: 1 } },
    });

    it("throws ApiError for a non-retryable status without retrying", async () => {
      fetchMock.mockResolvedValue(jsonResponse(404, { message: "Missing",
        errorCode: "NOT_FOUND" }, "Not Found"));

      const error = await catchApiError(client.get("/budgets/1"));

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(error.status).toBe(404);
      expect(error.code).toBe("NOT_FOUND");
    });

    it("throws ApiError with the last response once retries are exhausted", async () => {
      fetchMock.mockResolvedValue(jsonResponse(503, { message: "Down for maintenance" }, "Service Unavailable"));

      const error = await catchApiError(client.get("/users"));

      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(error.status).toBe(503);
      expect(error.message).toBe("Down for maintenance");
    });

    it("returns the response when a retry succeeds", async () => {
      fetchMock
        .mockResolvedValueOnce(jsonResponse(503, {}, "Service Unavailable"))
        .mockResolvedValueOnce(jsonResponse(200, { id: 1 }));

      const result = await client.get<{ id: number }>("/users/1");

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(result.response).toEqual({ id: 1 });
    });

    it("wraps a network failure in ApiError after retrying", async () => {
      fetchMock.mockRejectedValue(new TypeError("fetch failed"));

      const error = await catchApiError(client.get("/users"));

      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(error.code).toBe("NETWORK_ERROR");
      expect(error.status).toBeUndefined();
    });
  });

  describe("timeout", () => {
    // Resolves only when the request's signal aborts, like a hung server.
    function hangUntilAborted(_url: string, init?: RequestInit): Promise<Response> {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
      });
    }

    it("aborts with a TIMEOUT ApiError", async () => {
      fetchMock.mockImplementation(hangUntilAborted);
      const client = new ApiServerClient({ baseURL: "https://api.example.com",
        options: { timeout: 20 } });

      const error = await catchApiError(client.get("/slow"));

      expect(error.code).toBe("TIMEOUT");
      expect(error.message).toBe("Request timed out after 20ms");
    });

    it("lets a request override the default timeout", async () => {
      fetchMock.mockImplementation(hangUntilAborted);
      const client = new ApiServerClient({ baseURL: "https://api.example.com",
        options: { timeout: 60_000 } });

      const error = await catchApiError(client.get("/slow", { options: { timeout: 20 } }));

      expect(error.message).toBe("Request timed out after 20ms");
    });

    it("applies ApiClient's timeout config", async () => {
      fetchMock.mockImplementation(hangUntilAborted);
      const client = new ApiClient({ baseURL: "https://api.example.com",
        timeout: 20 });

      const error = await catchApiError(client.get("/slow"));

      expect(error.code).toBe("TIMEOUT");
    });

    it("sends no signal when no timeout is configured", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, {}));
      const client = new ApiServerClient({ baseURL: "https://api.example.com" });

      await client.get("/fast");

      expect(fetchMock.mock.calls[0][1].signal).toBeUndefined();
    });
  });
});
