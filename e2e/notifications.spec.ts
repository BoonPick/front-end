import { test, expect } from '@playwright/test';

test('notification settings page renders without crashing', async ({ page }) => {
  await page.route(/^https?:\/\/[^/]+\/api\//, route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  );
  await page.route('**dapi.kakao.com**', route =>
    route.fulfill({ status: 200, body: JSON.stringify([]) })
  );
  await page.route('**oapi.map.naver.com**', route =>
    route.fulfill({ status: 200, body: JSON.stringify([]) })
  );

  await page.goto('/notifications');
  await expect(page.locator('#root')).not.toBeEmpty();
});
