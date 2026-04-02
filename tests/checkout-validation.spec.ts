import { test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { customer, checkoutMessages, products, users } from '../utils/testData';

test.describe('Scenarii esentiale negative / validation', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.assertLoaded();

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
  });

  test('checkout fails when first name is missing', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.assertLoaded();
    await checkoutPage.fillCheckoutInformation(
      customer.missingFirstName.firstName,
      customer.missingFirstName.lastName,
      customer.missingFirstName.postalCode
    );
    await checkoutPage.continue();

    await checkoutPage.assertErrorMessage(checkoutMessages.firstNameRequired);
  });

  test('checkout fails when last name is missing', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.assertLoaded();
    await checkoutPage.fillCheckoutInformation(
      customer.missingLastName.firstName,
      customer.missingLastName.lastName,
      customer.missingLastName.postalCode
    );
    await checkoutPage.continue();

    await checkoutPage.assertErrorMessage(checkoutMessages.lastNameRequired);
  });

  test('checkout fails when postal code is missing', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.assertLoaded();
    await checkoutPage.fillCheckoutInformation(
      customer.missingPostalCode.firstName,
      customer.missingPostalCode.lastName,
      customer.missingPostalCode.postalCode
    );
    await checkoutPage.continue();

    await checkoutPage.assertErrorMessage(checkoutMessages.postalCodeRequired);
  });
});
