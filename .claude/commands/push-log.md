# /push-log — Boonpick 프론트엔드 푸쉬 로그

프론트엔드 GitHub push 후 Discord 채널에 변경 로그를 전송한다.

## Discord 채널
- **채널 ID**: `1498308224770769028` (boonpick 프론트엔드 로그 채널)

## 실행 절차

1. Bash로 최근 커밋 목록 조회:
   ```bash
   cd "C:\Users\yoonc\OneDrive\바탕 화면\github\boonpick\front-end"
   git log --oneline -10
   ```

2. 가장 최근 push에 포함된 커밋들을 파악한다 (직전 push 이후 커밋).

3. 아래 포맷으로 Discord 메시지를 작성한다:
   ```
   ## 🎨 Boonpick 프론트엔드 푸쉬 로그
   **날짜**: YYYY-MM-DD
   
   | 커밋 | 내용 |
   |------|------|
   | `abc1234` | 커밋 메시지 |
   ...
   
   ### 주요 변경사항
   - 변경된 페이지, 컴포넌트, UI 기능 요약
   ```

4. `mcp__plugin_discord_discord__reply` 툴을 사용해 전송:
   - `chat_id`: `1498308224770769028`
   - `text`: 작성한 메시지

## 주의사항
- push가 없으면 실행하지 않는다
- 항상 이 프로젝트(`front-end`)의 git log를 기준으로 한다
