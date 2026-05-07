import { test, expect } from '@playwright/test';

test('notification settings page renders without crashing', async ({ page }) => {
  await page.route('**/api/**', route =>
    route.fulfill({ status: 200, body: JSON.stringify([]) })
  );
  await page.route('**dapi.kakao.com**', route =>
    route.fulfill({ status: 200, body: JSON.stringify([]) })
  );
  await page.route('**oapi.map.naver.com**', route =>
    route.fulfill({ status: 200, body: JSON.stringify([]) })
  );

  await page.goto('/notifications');
  await expect(page.locator('body')).toBeVisible();
});
