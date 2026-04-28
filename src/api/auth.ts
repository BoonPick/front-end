import type { User } from "@/types";
import { apiClient } from "./client";

export async function login(email: string, password: string): Promise<User> {
  return apiClient<User>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(
  email: string,
  password: string,
  name: string,
  verificationCode: string,
): Promise<User> {
  return apiClient<User>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      name,
      verification_code: verificationCode,
    }),
  });
}

export async function sendVerificationCode(
  email: string,
): Promise<{ ok: boolean; expires_in: number }> {
  return apiClient<{ ok: boolean; expires_in: number }>(
    "/api/auth/send-code",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  );
}
