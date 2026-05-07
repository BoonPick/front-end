import { test, expect } from '@playwright/test';

// TODO: flaky
  test('keyword input page renders without crashing', async ({ page }) => {
  await page.route('**/api/**', route =>
    route.fulfill({ status: 200, body: JSON.stringify([]) })
  );
  await page.route('**dapi.kakao.com**', route =>
    route.fulfill({ status: 200, body: JSON.stringify([]) })
  );
  await page.route('**oapi.map.naver.com**', route =>
    route.fulfill({ status: 200, body: JSON.stringify([]) })
  );

  await page.goto('/keywords');
  await expect(page.locator('body')).toBeVisible();
});
