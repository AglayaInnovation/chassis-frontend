import { ApiError } from "../errors";
import type { Authentication, RequestOptions } from "../types";

export function validationAuth(options?: RequestOptions, authentication?: Authentication): void {
  if (options?.requiredAuth && !authentication?.token) {
    throw new ApiError("Required Token", 401, "AUTH_TOKEN_REQUIRED");
  }

  if (options?.requiredOtp && !authentication?.otpToken) {
    throw new ApiError("Required OTP Token", 401, "OTP_TOKEN_REQUIRED");
  }
}
