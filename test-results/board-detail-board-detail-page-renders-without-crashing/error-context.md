# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: board-detail.spec.ts >> board detail page renders without crashing
- Location: e2e/board-detail.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('body')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('body')
    9 × locator resolved to <body>…</body>
      - unexpected value "hidden"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // TODO: flaky
  4  |   test('board detail page renders without crashing', async ({ page }) => {
  5  |   await page.route('**/api/**', route =>
  6  |     route.fulfill({ status: 200, body: JSON.stringify([]) })
  7  |   );
  8  |   await page.route('**dapi.kakao.com**', route =>
  9  |     route.fulfill({ status: 200, body: JSON.stringify([]) })
  10 |   );
  11 |   await page.route('**oapi.map.naver.com**', route =>
  12 |     route.fulfill({ status: 200, body: JSON.stringify([]) })
  13 |   );
  14 | 
  15 |   await page.goto('/board/1');
> 16 |   await expect(page.locator('body')).toBeVisible();
     |                                      ^ Error: expect(locator).toBeVisible() failed
  17 | });
  18 | 
```