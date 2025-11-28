import { test, expect } from '@playwright/test';

test('home page has title', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Home/);
});

test('home page has welcome message', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const welcomeMessage = await page.locator('h1').textContent();
    expect(welcomeMessage).toBe('Welcome to the Home Page!');
});