import { test, expect } from '@playwright/test';

//npx playwright codegen --output=tests-playwright/create-subscribe-offer.spec.ts http://localhost:3000/?locale=en 
// comando para hacer tests automaticos
// para ejecutar ((headed para ver como lo hace)) npx playwright test --headed tests-playwright/create-subscribe-offer.spec.ts
const offerName:string = 'offer' + (Math.random() * 100);

test('test', async ({ page }) => {  
  
  await page.getByRole('link', { name: 'Ir al inicio' }).click();
  await page.getByRole('link', { name: 'Iniciar sesión.' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('josepgb04@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('0123456');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.getByRole('button', { name: 'Toggle Sidebar' }).click();
  await page.getByRole('link', { name: 'Ofertas', exact: true }).click();
  await page.getByRole('button', { name: 'Nueva Oferta' }).click();
  await page.getByRole('textbox', { name: 'Título *' }).click();

  await page.getByRole('textbox', { name: 'Título *' }).fill(offerName);
  await page.getByRole('textbox', { name: 'Descripción *' }).click();
  await page.getByRole('textbox', { name: 'Descripción *' }).fill(offerName);
  await page.getByRole('spinbutton', { name: 'Objetivo numérico *' }).click();
  await page.getByRole('spinbutton', { name: 'Objetivo numérico *' }).fill('150');
  await page.getByRole('spinbutton', { name: 'Precio Entrada *' }).click();
  await page.getByRole('spinbutton', { name: 'Precio Entrada *' }).fill('32');
  await page.getByRole('button', { name: 'Fecha límite del objetivo *' }).click();
  await page.getByLabel('Choose the Year').selectOption('2030');
  await page.getByRole('button', { name: 'Tuesday, November 12th,' }).click();
  await page.getByRole('combobox', { name: 'Foro asociado *' }).click();
  await page.getByRole('option', { name: 'bcuirpwgbvyue' }).click();
  await page.getByPlaceholder('Selecciona los tags para la').click();
  await page.getByRole('option', { name: 'Innovación' }).click();
  await page.getByRole('option', { name: 'Sostenibilidad' }).click();
  await page.getByText('Título*Descripción*Objetivo').click();
  await page.getByRole('button', { name: 'Crear Oferta' }).click();
  await page.getByRole('textbox', { name: 'Búsqueda por nombre...' }).click();
  await page.getByRole('textbox', { name: 'Búsqueda por nombre...' }).fill(offerName);
  await page.getByRole('link', { name: offerName }).nth(1).click();
  await page.getByRole('button', { name: 'Suscribirme' }).click();
  await page.getByRole('button', { name: 'Confirmar suscripción' }).click();
  await page.getByRole('textbox', { name: 'Escribe un comentario...' }).click();
  await page.getByRole('textbox', { name: 'Escribe un comentario...' }).fill('Nice product!');
  await page.getByRole('button', { name: 'Publicar' }).click();
  await page.getByRole('link', { name: 'Deal&Buy.' }).click();
  await page.getByRole('button', { name: 'Cerrar sesión.' }).click();
});