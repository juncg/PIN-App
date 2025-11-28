import { test, expect } from '@playwright/test';
import { formatFullDateWithOrdinal } from '../app/dateFormat';

test.use({ storageState: 'storageState.json' });

test('offers can be created and viewed afterwards', async ({ page }) => {
    
    await page.goto('/auth/login?locale=es');

    // Fill login form
    await page.getByPlaceholder('m@example.com').fill('josepgb04@gmail.com');
    await page.locator('#password').fill('0123456');


    // Click login button
    await page.getByRole('button', { name: 'Iniciar sesión' }).click(); //copiando save-login-state pq las cookkies no quieren ir

    await page.waitForTimeout(2000); // give it time to load stuff
    await page.goto('/offers?locale=en');
    

    await page.locator('button:has-text("Nueva Oferta")').click();

    const offerName:string = 'Oferta test random' + (Math.random() * 100);
    await page.locator('#title').fill(offerName);

    await page.locator('#text').fill('Descripción genérica.');

    await page.locator('#target_progress').fill('50'); //Objetivo numerico

    await page.locator('#fee').fill('50'); // Precio entrada

    await page.locator('#target_completition_date').click(); // abre date picker

    const currentDay: string = formatFullDateWithOrdinal();

    await page.getByRole('button', { name: currentDay }).click(); // hace click en una fecha 
    // WARNING: HAY QUE CAMBIAR MANUALMENTE FECHA CADA VEZ, si alguien sabe arreglarlo q lo arregle xd
    // probablmente se pueda cogiendo la fecha actual y pasandolo a una string con el formato que usamos 

    await page.locator('#forum_id').click(); // dropdown foro

    await page.getByRole('option', { name: 'Foro EcoVida' }).click(); // elige foro

    await page.locator('#allow_comments').click(); // permite comentarios

    await page.getByRole('button', { name: 'Crear Oferta' }).click(); // boton crear oferta se clicka al final


    await page.waitForTimeout(20000); // give it time to load stuff
    await expect(page.locator(`text=${offerName}`)).toBeVisible();


});
