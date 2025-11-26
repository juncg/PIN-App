import { test, expect } from '@playwright/test';

test('offers can be created and viewed afterwards', async ({ page }) => {
    test.use({ storageState: 'storageState.json' });
    await page.goto('/offers?locale=en');
});
