"""
게시판 및 키워드 플로우 E2E 테스트.
"""

import json
import pytest
from playwright.sync_api import Page

BASE = "http://127.0.0.1:7654"

MOCK_USER = {"id": "1", "email": "u@boonpick.com", "name": "유저", "keywords": ["AI"]}


def login_and_goto(page: Page, path: str):
    """localStorage에 유저 정보를 직접 주입해 로그인 상태를 만든 뒤 경로로 이동."""
    page.goto(f"{BASE}/auth")
    page.evaluate(
        "user => localStorage.setItem('boonpick_user', JSON.stringify(user))",
        MOCK_USER,
    )
    page.goto(f"{BASE}{path}")


# ── 게시판 테스트 ─────────────────────────────────────────────────────────────

class TestBoardPage:
    def test_게시글_목록_렌더링(self, page: Page):
        login_and_goto(page, "/board")
        page.wait_for_selector("h1", timeout=5000)

        # API 응답의 title이 실제로 화면에 보여야 함
        assert page.get_by_text("2026년 1학기 장학금 모집").is_visible()
        assert page.get_by_text("AI 특강 안내").is_visible()

    def test_현재_키워드_칩_표시(self, page: Page):
        page.goto(f"{BASE}/auth")
        page.evaluate(
            "u => localStorage.setItem('boonpick_user', JSON.stringify(u))",
            MOCK_USER,
        )
        page.evaluate(
            "kw => localStorage.setItem('boonpick_keywords', JSON.stringify(kw))",
            ["AI", "장학금"],
        )
        page.goto(f"{BASE}/board")
        page.wait_for_selector("h1", timeout=5000)
        assert page.get_by_text("AI").first.is_visible()

    def test_키워드_없을때_설정_안내_표시(self, page: Page):
        page.goto(f"{BASE}/auth")
        page.evaluate(
            "u => { const user = Object.assign({}, u, {keywords: []}); localStorage.setItem('boonpick_user', JSON.stringify(user)); }",
            MOCK_USER,
        )
        page.evaluate("() => localStorage.removeItem('boonpick_keywords')")
        page.goto(f"{BASE}/board")
        page.wait_for_selector("h1", timeout=5000)
        assert page.get_by_text("키워드를 설정하면 맞춤 정보를 받아볼 수 있어요").is_visible()

    def test_카테고리_탭_존재(self, page: Page):
        login_and_goto(page, "/board")
        page.wait_for_selector("h1", timeout=5000)
        # CategoryTabs 컴포넌트가 렌더링됐는지 확인
        assert page.locator('[role="tablist"]').is_visible()

    def test_키워드_관리_버튼_클릭시_이동(self, page: Page):
        login_and_goto(page, "/board")
        page.wait_for_selector("h1", timeout=5000)
        page.get_by_role("link", name="키워드 관리").first.click()
        page.wait_for_url("**/keywords/edit", timeout=5000)
        assert "/keywords/edit" in page.url


# ── 키워드 입력 페이지 ────────────────────────────────────────────────────────

class TestKeywordInputPage:
    def test_키워드_입력_페이지_렌더링(self, page: Page):
        login_and_goto(page, "/keywords")
        page.get_by_text("관심").wait_for(timeout=5000)
        assert page.get_by_text("관심").is_visible()

    def test_로딩_없이_페이지_로드(self, page: Page):
        login_and_goto(page, "/keywords")
        # 500ms 내에 "로딩 중" 텍스트가 사라져야 함
        page.wait_for_timeout(500)
        loading = page.get_by_text("로딩 중")
        assert not loading.is_visible()
