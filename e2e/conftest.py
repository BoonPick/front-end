"""
Playwright E2E 테스트 설정.

빌드된 프론트엔드를 로컬 HTTP 서버로 서빙하고,
모든 API 호출은 page.route()로 가로채서 mock 응답을 반환합니다.

이 방식의 장점:
  - 실제 브라우저에서 React 렌더링·라우팅·이벤트 처리를 검증
  - 이메일 인증이 추가되면 mock 응답이 맞지 않아 즉시 실패
  - 응답 포맷·플로우 변경을 탐지
"""

import json
import threading
import http.server
import functools
from pathlib import Path

import pytest
from playwright.sync_api import sync_playwright, Page, Route

DIST_DIR   = Path(__file__).parent.parent / "dist"
SERVER_HOST = "127.0.0.1"
SERVER_PORT = 7654
BASE_URL    = f"http://{SERVER_HOST}:{SERVER_PORT}"
CHROMIUM    = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

# ── mock API 데이터 ────────────────────────────────────────────────────────────

MOCK_USER = {"id": "1", "email": "test@boonpick.com", "name": "테스트유저", "keywords": []}
MOCK_USER_WITH_KEYWORDS = {**MOCK_USER, "keywords": ["AI", "장학금"]}

MOCK_KEYWORDS = ["AI", "장학금", "취업", "인턴", "교환학생"]

MOCK_BOARD_ITEMS = [
    {
        "id": "1", "category": "scholarship", "title": "2026년 1학기 장학금 모집",
        "summary": "성적 우수 장학금 신청 안내",
        "body": "장학금 신청 기간은 3월 1일부터 3월 31일까지입니다.",
        "source": "sogang_scholarship", "sourceUrl": "https://example.com/1",
        "date": "2026-04-01", "keywords": ["장학금"],
    },
    {
        "id": "2", "category": "announcement", "title": "AI 특강 안내",
        "summary": "AI 관련 특강이 개설됩니다",
        "body": "AI 특강 상세 내용입니다.",
        "source": "sogang_notice", "sourceUrl": "https://example.com/2",
        "date": "2026-04-15", "keywords": ["AI"],
    },
]

MOCK_RECOMMENDATION = {
    "itemId": "1", "matchScore": 85,
    "matchReason": "장학금 키워드와 높은 연관성",
    "preparationTips": ["성적 관리", "에세이 준비"],
}

MOCK_ADMIN_KEYWORDS = [
    {"id": 1, "keyword_name": "AI"},
    {"id": 2, "keyword_name": "장학금"},
]


def json_route(page: Page, pattern: str, body: object, status: int = 200):
    """API 경로를 가로채어 JSON mock 응답을 반환합니다."""
    def handler(route: Route):
        route.fulfill(
            status=status,
            content_type="application/json",
            body=json.dumps(body, ensure_ascii=False),
        )
    page.route(pattern, handler)


def setup_default_mocks(page: Page):
    """기본 API mock을 모두 등록합니다."""
    json_route(page, "**/api/auth/login",  MOCK_USER)
    json_route(page, "**/api/auth/signup", MOCK_USER)
    json_route(page, "**/api/keywords",    MOCK_KEYWORDS)
    json_route(page, "**/api/board?**",    MOCK_BOARD_ITEMS)
    json_route(page, "**/api/board/1",     MOCK_BOARD_ITEMS[0])
    json_route(page, "**/api/board/2",     MOCK_BOARD_ITEMS[1])
    json_route(page, "**/api/recommendations/**", MOCK_RECOMMENDATION)
    json_route(page, "**/api/admin/keywords", MOCK_ADMIN_KEYWORDS)


# ── static file server ─────────────────────────────────────────────────────────

class _SilentHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def do_GET(self):
        # SPA fallback: 파일이 없으면 index.html 반환
        path = DIST_DIR / self.path.lstrip("/").split("?")[0]
        if not path.exists() or path.is_dir():
            self.path = "/index.html"
        super().do_GET()


@pytest.fixture(scope="session")
def static_server():
    handler = functools.partial(_SilentHandler, directory=str(DIST_DIR))
    server  = http.server.HTTPServer((SERVER_HOST, SERVER_PORT), handler)
    thread  = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    yield BASE_URL
    server.shutdown()


@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as pw:
        b = pw.chromium.launch(
            headless=True,
            executable_path=CHROMIUM,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        yield b
        b.close()


@pytest.fixture
def page(browser, static_server):
    ctx  = browser.new_context(base_url=static_server)
    page = ctx.new_page()
    setup_default_mocks(page)
    yield page
    ctx.close()
