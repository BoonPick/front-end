import { useState, useCallback, useEffect } from "react";
import type { User } from "@/types";
import * as authApi from "@/api/auth";

const STORAGE_KEY = "boonpick_user";

function getStoredUser(): User | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await authApi.login(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (e) {
      const message = e instanceof Error ? e.message : "로그인에 실패했습니다.";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      verificationCode: string,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const newUser = await authApi.signup(
          email,
          password,
          name,
          verificationCode,
        );
        setUser(newUser);
        return newUser;
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "회원가입에 실패했습니다.";
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const sendVerificationCode = useCallback(async (email: string) => {
    setError(null);
    try {
      return await authApi.sendVerificationCode(email);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "인증코드 발송에 실패했습니다.";
      setError(message);
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("boonpick_keywords");
  }, []);

  return {
    user,
    loading,
    error,
    login,
    signup,
    sendVerificationCode,
    logout,
    isAuthenticated: !!user,
  };
}
