import { test } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { checkoutMessages, users } from '../utils/testData';

const acceptedActiveUsers = [
  users.standard,
  users.problem,
  users.performanceGlitch,
  users.error,
  users.visual
];

test.describe('Authentication coverage', () => {
  for (const user of acceptedActiveUsers) {
    test(`accepted user ${user.username} can log in`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.goto();
      await loginPage.login(user.username, user.password);

      await inventoryPage.assertLoaded();
    });
  }

  test('locked out user cannot log in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await loginPage.assertErrorMessage(checkoutMessages.lockedOut);
  });

  test('invalid login shows the correct error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, 'wrong_password');

    await loginPage.assertErrorMessage(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('unauthorized user is redirected to login when opening protected pages', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const protectedRoutes = ['/inventory.html', '/cart.html', '/checkout-step-one.html'];

    for (const route of protectedRoutes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await loginPage.assertLoaded();
    }
  });
});
