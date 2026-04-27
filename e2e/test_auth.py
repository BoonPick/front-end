"""
인증 플로우 E2E 테스트.

실제 브라우저에서 로그인·회원가입 UI를 조작하고
라우팅 결과가 올바른지 검증합니다.

이메일 인증 단계가 추가되거나 응답 포맷이 바뀌면
navigate("/keywords") 혹은 navigate("/board") 타이밍이 달라져 실패합니다.
"""

import json
import pytest
from playwright.sync_api import Page, Route


BASE = "http://127.0.0.1:7654"


# ── helpers ──────────────────────────────────────────────────────────────────

def mock_login_success(page: Page, user: dict):
    page.route("**/api/auth/login", lambda r: r.fulfill(
        status=200, content_type="application/json",
        body=json.dumps(user, ensure_ascii=False),
    ))

def mock_login_fail(page: Page):
    page.route("**/api/auth/login", lambda r: r.fulfill(
        status=400, content_type="application/json",
        body=json.dumps({"detail": "로그인에 실패했습니다."}, ensure_ascii=False),
    ))

def mock_signup_success(page: Page, user: dict):
    page.route("**/api/auth/signup", lambda r: r.fulfill(
        status=200, content_type="application/json",
        body=json.dumps(user, ensure_ascii=False),
    ))


# ── 로그인 테스트 ─────────────────────────────────────────────────────────────

class TestLogin:
    def test_로그인_페이지_렌더링(self, page: Page):
        page.goto(f"{BASE}/auth")
        assert page.locator("#login-email").is_visible()
        assert page.locator("#login-password").is_visible()
        assert page.get_by_role("button", name="로그인").is_visible()

    def test_키워드_없는_유저_로그인후_keywords_페이지_이동(self, page: Page):
        user_no_keywords = {
            "id": "1", "email": "test@boonpick.com",
            "name": "테스트", "keywords": []
        }
        mock_login_success(page, user_no_keywords)

        page.goto(f"{BASE}/auth")
        page.fill("#login-email", "test@boonpick.com")
        page.fill("#login-password", "pw123")
        page.get_by_role("button", name="로그인").click()

        page.wait_for_url("**/keywords", timeout=5000)
        assert "/keywords" in page.url

    def test_키워드_있는_유저_로그인후_board_페이지_이동(self, page: Page):
        user_with_keywords = {
            "id": "2", "email": "user@boonpick.com",
            "name": "기존유저", "keywords": ["AI", "장학금"]
        }
        mock_login_success(page, user_with_keywords)

        page.goto(f"{BASE}/auth")
        page.fill("#login-email", "user@boonpick.com")
        page.fill("#login-password", "pw123")
        page.get_by_role("button", name="로그인").click()

        page.wait_for_url("**/board**", timeout=5000)
        assert "/board" in page.url

    def test_로그인_실패시_에러_메시지_표시(self, page: Page):
        mock_login_fail(page)

        page.goto(f"{BASE}/auth")
        page.fill("#login-email", "wrong@boonpick.com")
        page.fill("#login-password", "wrongpw")
        page.get_by_role("button", name="로그인").click()

        error = page.locator("p.text-destructive").first
        error.wait_for(timeout=5000)
        assert error.is_visible()

    def test_비인증_사용자_board_접근시_auth_리다이렉트(self, page: Page):
        page.goto(f"{BASE}/board")
        page.wait_for_url("**/auth", timeout=5000)
        assert "/auth" in page.url


# ── 회원가입 테스트 ───────────────────────────────────────────────────────────

class TestSignup:
    def test_회원가입_탭_전환(self, page: Page):
        page.goto(f"{BASE}/auth")
        page.get_by_role("tab", name="회원가입").click()
        assert page.locator("#signup-email").is_visible()
        assert page.locator("#signup-name").is_visible()
        assert page.locator("#signup-password").is_visible()
        assert page.locator("#signup-confirm").is_visible()

    def test_회원가입_성공후_keywords_페이지_이동(self, page: Page):
        new_user = {
            "id": "10", "email": "new@boonpick.com",
            "name": "신규유저", "keywords": []
        }
        mock_signup_success(page, new_user)

        page.goto(f"{BASE}/auth")
        page.get_by_role("tab", name="회원가입").click()
        page.fill("#signup-name", "신규유저")
        page.fill("#signup-email", "new@boonpick.com")
        page.fill("#signup-password", "pw123456")
        page.fill("#signup-confirm", "pw123456")
        page.get_by_role("button", name="회원가입").click()

        page.wait_for_url("**/keywords", timeout=5000)
        assert "/keywords" in page.url

    def test_비밀번호_불일치시_경고_표시(self, page: Page):
        page.goto(f"{BASE}/auth")
        page.get_by_role("tab", name="회원가입").click()
        page.fill("#signup-password", "pw123456")
        page.fill("#signup-confirm", "different")

        warning = page.get_by_text("비밀번호가 일치하지 않습니다")
        assert warning.is_visible()
