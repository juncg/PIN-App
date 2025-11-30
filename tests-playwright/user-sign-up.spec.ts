import { test, expect } from "@playwright/test";

test("User Sign Up Flow", async ({ page }) => {
	const timestamp = Date.now();
	const userData = {
		name: "Test",
		surnames: "User",
		username: `testuser_${timestamp}`,
		email: `test.user.${timestamp}@gmail.com`,
		password: "Password123!",
		birthDate: "1990-01-01",
	};

	await page.goto("/auth/sign-up");

	await page.fill("#name", userData.name);
	await page.fill("#surnames", userData.surnames);
	await page.fill("#username", userData.username);
	await page.fill("#email", userData.email);
	await page.fill("#password", userData.password);
	await page.fill("#repeat-password", userData.password);
	await page.fill("#birth-date", userData.birthDate);

	await page.click('button[type="submit"]');

	try {
		await expect(page).toHaveURL(/\/auth\/sign-up-success/, { timeout: 5000 });
	} catch (e) {
		const errorMessage = page.locator(".text-red-500");
		if (await errorMessage.isVisible()) {
			console.log("Sign-up failed with error:", await errorMessage.textContent());
		}
		throw e;
	}
});
