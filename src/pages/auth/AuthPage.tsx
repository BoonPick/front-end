import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function AuthPage() {
  const navigate = useNavigate();
  const { login, signup, sendVerificationCode, error, loading, isAuthenticated } = useAuth();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    verificationCode: "",
  });
  const [codeSent, setCodeSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const [sendCodeError, setSendCodeError] = useState<string | null>(null);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => {
      setResendCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  if (isAuthenticated) {
    navigate("/board", { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(loginForm.email, loginForm.password);
      if (user.keywords.length > 0) {
        navigate("/board");
      } else {
        navigate("/keywords");
      }
    } catch {
      // error is set in useAuth
    }
  };

  const handleSendCode = async () => {
    if (!signupForm.email) return;
    setSendCodeError(null);
    setSendingCode(true);
    try {
      const res = await sendVerificationCode(signupForm.email);
      setCodeSent(true);
      setResendCooldown(60);
      // expires_in은 서버 기본 600초 — UI에는 재발송 쿨다운만 노출
      void res;
    } catch (e) {
      setSendCodeError(
        e instanceof Error ? e.message : "인증코드 발송에 실패했습니다.",
      );
    } finally {
      setSendingCode(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      return;
    }
    if (!signupForm.verificationCode) {
      return;
    }
    try {
      await signup(
        signupForm.email,
        signupForm.password,
        signupForm.name,
        signupForm.verificationCode,
      );
      navigate("/keywords");
    } catch {
      // error is set in useAuth
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">BoonPick</CardTitle>
          <p className="text-sm text-muted-foreground">
            서강대 공지, 인턴쉽 추천
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="signup">회원가입</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">이메일</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">비밀번호</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "로그인 중..." : "로그인"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  테스트: test@boonpick.com (아무 비밀번호)
                </p>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">이름</Label>
                  <Input
                    id="signup-name"
                    placeholder="이름을 입력하세요"
                    value={signupForm.name}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">이메일</Label>
                  <div className="flex gap-2">
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="이메일을 입력하세요"
                      value={signupForm.email}
                      onChange={(e) => {
                        setSignupForm({ ...signupForm, email: e.target.value });
                        setCodeSent(false);
                        setSendCodeError(null);
                      }}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendCode}
                      disabled={
                        !signupForm.email || sendingCode || resendCooldown > 0
                      }
                    >
                      {resendCooldown > 0
                        ? `${resendCooldown}초`
                        : sendingCode
                        ? "발송 중"
                        : codeSent
                        ? "재발송"
                        : "인증코드 받기"}
                    </Button>
                  </div>
                  {sendCodeError && (
                    <p className="text-sm text-destructive">{sendCodeError}</p>
                  )}
                  {codeSent && !sendCodeError && (
                    <p className="text-xs text-muted-foreground">
                      메일로 발송된 6자리 인증코드를 10분 안에 입력해주세요.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-code">인증코드</Label>
                  <Input
                    id="signup-code"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="이메일로 받은 6자리 코드"
                    value={signupForm.verificationCode}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        verificationCode: e.target.value
                          .replace(/[^0-9]/g, "")
                          .slice(0, 6),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">비밀번호</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={signupForm.password}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">비밀번호 확인</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={signupForm.confirmPassword}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                  {signupForm.password &&
                    signupForm.confirmPassword &&
                    signupForm.password !== signupForm.confirmPassword && (
                      <p className="text-sm text-destructive">
                        비밀번호가 일치하지 않습니다.
                      </p>
                    )}
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "가입 중..." : "회원가입"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
