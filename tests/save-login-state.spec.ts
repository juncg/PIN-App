import { expect, test } from '@playwright/test';


// this test logs in automatically, stores cookies and shi. DONT DELETE IT PLEASE ILL CRY
test('save login state', async ({ page }) => {
  // Go to login page
  await page.goto('/auth/login?locale=es');

  // Fill login form
  await page.getByPlaceholder('m@example.com').fill('josepgb04@gmail.com');
  await page.locator('#password').fill('0123456');


  // Click login button
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  // Wait for some element visible after login
  
  await expect(page.locator('text=Peticiones.')).toBeVisible();

  // Save cookies and localStorage into a file
  await page.context().storageState({ path: 'storageState.json' }); 
});


// my password is 0123456 