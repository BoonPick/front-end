import type { User } from "@/types";
import { mockUsers } from "@/mocks/users";

// TODO: 백엔드 완성 시 apiClient로 교체
// import { apiClient } from "./client";

export async function login(
  email: string,
  _password: string,
): Promise<User> {
  // Mock: 이메일로 유저 찾기 (비밀번호 검증 생략)
  await delay(300);
  const user = mockUsers.find((u) => u.email === email);
  if (!user) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  return user;

  // 실제 API:
  // return apiClient<User>("/api/auth/login", {
  //   method: "POST",
  //   body: JSON.stringify({ email, password }),
  // });
}

export async function signup(
  email: string,
  _password: string,
  name: string,
): Promise<User> {
  await delay(300);
  const exists = mockUsers.find((u) => u.email === email);
  if (exists) {
    throw new Error("이미 가입된 이메일입니다.");
  }
  const newUser: User = {
    id: String(Date.now()),
    email,
    name,
    keywords: [],
  };
  mockUsers.push(newUser);
  return newUser;

  // 실제 API:
  // return apiClient<User>("/api/auth/signup", {
  //   method: "POST",
  //   body: JSON.stringify({ email, password, name }),
  // });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
