import { test, expect } from '@playwright/test';

test('offers can be created and viewed afterwards', async ({ page }) => {
    test.use({ storageState: 'storageState.json' });
    await page.goto('/offers?locale=en');

    await page.getByRole('button', { name: 'Nueva Oferta' }).click();

    await page.locator('#title').fill('Oferta test random' + (Math.random() * 100) );

    await page.locator('#text').fill('Descripción genérica.');

    await page.locator('#target_progress').fill('50'); //Objetivo numerico

    await page.locator('#fee').fill('50'); // Precio entrada

    await page.locator('#target_completition_date').click(); // abre date picker

    await page.getByRole('button', { name: 'November 28, 2025' }).click(); // hace click en una fecha

    await page.locator('#forum_id').click(); // dropdown foro

    await page.getByRole('option', { name: 'Foro EcoVida' }).click(); // elige foro

    await page.locator('#allow_comments').click(); // permite comentarios

    await page.getByRole('button', { name: 'Crear Oferta' }).click(); // boton crear oferta se clicka al final




});
