import { ApiClient } from "../client";

describe("ApiClient", () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient({
      baseURL: "https://api.example.com",
    });
  });

  it("should create an instance", () => {
    expect(client).toBeInstanceOf(ApiClient);
  });

  it("should have correct default config", () => {
    const defaultClient = new ApiClient();
    expect(defaultClient).toBeDefined();
  });
});
