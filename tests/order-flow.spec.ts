import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import {
  checkoutMessages,
  checkoutTotals,
  customer,
  productPrices,
  products,
  users
} from '../utils/testData';
import { expectCartBadgeCount, expectCurrentUrlIncludes } from '../utils/helpers';

test.describe('Scenarii happy path', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.assertLoaded();
  });

  test('successful order placement with one product', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new CheckoutOverviewPage(page);
    const completePage = new CheckoutCompletePage(page);

    await inventoryPage.addProductToCart(products.backpack);
    await expectCartBadgeCount(page, 1);

    await inventoryPage.openCart();
    await cartPage.assertLoaded();
    await cartPage.verifyProductPresent(products.backpack);

    await cartPage.proceedToCheckout();
    await checkoutPage.assertLoaded();
    await checkoutPage.fillCheckoutInformation(
      customer.valid.firstName,
      customer.valid.lastName,
      customer.valid.postalCode
    );
    await checkoutPage.continue();

    await overviewPage.assertLoaded();
    await overviewPage.verifyProductPresent(products.backpack);
    await overviewPage.assertSummaryTotals(
      checkoutTotals.backpackOnly.itemTotal,
      checkoutTotals.backpackOnly.tax,
      checkoutTotals.backpackOnly.total
    );
    await overviewPage.finishOrder();

    await completePage.assertOrderSuccess(
      checkoutMessages.successHeader,
      checkoutMessages.successBody
    );
  });

  test('successful order placement with multiple products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new CheckoutOverviewPage(page);
    const completePage = new CheckoutCompletePage(page);

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    await expectCartBadgeCount(page, 2);

    await inventoryPage.openCart();
    await cartPage.assertLoaded();
    await cartPage.verifyProductPresent(products.backpack);
    await cartPage.verifyProductPresent(products.bikeLight);

    await cartPage.proceedToCheckout();
    await checkoutPage.assertLoaded();
    await checkoutPage.fillCheckoutInformation(
      customer.valid.firstName,
      customer.valid.lastName,
      customer.valid.postalCode
    );
    await checkoutPage.continue();

    await overviewPage.assertLoaded();
    await overviewPage.verifyProductPresent(products.backpack);
    await overviewPage.verifyProductPresent(products.bikeLight);
    await overviewPage.assertSummaryTotals(
      checkoutTotals.backpackAndBikeLight.itemTotal,
      checkoutTotals.backpackAndBikeLight.tax,
      checkoutTotals.backpackAndBikeLight.total
    );
    await overviewPage.finishOrder();

    await completePage.assertOrderSuccess(
      checkoutMessages.successHeader,
      checkoutMessages.successBody
    );
  });
});

test.describe('Scenarii importante de consistenta', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.assertLoaded();
  });

  test('cart preserves selected product before checkout', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart(products.backpack);
    await expectCartBadgeCount(page, 1);

    await inventoryPage.openCart();
    await cartPage.assertLoaded();
    await cartPage.verifyProductPresent(products.backpack);
  });

  test('order summary displays correct item / price / total', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new CheckoutOverviewPage(page);

    await inventoryPage.addProductToCart(products.backpack);

    await inventoryPage.openCart();
    await cartPage.assertLoaded();
    await cartPage.proceedToCheckout();
    await checkoutPage.assertLoaded();
    await checkoutPage.fillCheckoutInformation(
      customer.valid.firstName,
      customer.valid.lastName,
      customer.valid.postalCode
    );
    await checkoutPage.continue();

    await overviewPage.assertLoaded();
    await overviewPage.verifyProductPresent(products.backpack);
    expect(await overviewPage.getDisplayedPriceForProduct(products.backpack)).toBe(productPrices.backpack);
    await overviewPage.assertSummaryTotals(
      checkoutTotals.backpackOnly.itemTotal,
      checkoutTotals.backpackOnly.tax,
      checkoutTotals.backpackOnly.total
    );
  });

  test('user can finish order and see confirmation page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new CheckoutOverviewPage(page);
    const completePage = new CheckoutCompletePage(page);

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.assertLoaded();
    await cartPage.proceedToCheckout();
    await checkoutPage.assertLoaded();
    await checkoutPage.fillCheckoutInformation(
      customer.valid.firstName,
      customer.valid.lastName,
      customer.valid.postalCode
    );
    await checkoutPage.continue();

    await overviewPage.assertLoaded();
    await overviewPage.finishOrder();

    await completePage.assertOrderSuccess(
      checkoutMessages.successHeader,
      checkoutMessages.successBody
    );
  });

  test('cancel from checkout returns the user to the cart page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.assertLoaded();
    await cartPage.proceedToCheckout();
    await checkoutPage.assertLoaded();

    await checkoutPage.cancel();
    await cartPage.assertLoaded();
    await cartPage.verifyProductPresent(products.backpack);
  });

  test('price and total stay consistent from inventory to cart to overview', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new CheckoutOverviewPage(page);

    const inventoryPrice = await inventoryPage.getDisplayedPriceForProduct(products.backpack);
    expect(inventoryPrice).toBe(productPrices.backpack);

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.assertLoaded();

    const cartPrice = await cartPage.getDisplayedPriceForProduct(products.backpack);
    expect(cartPrice).toBe(inventoryPrice);

    await cartPage.proceedToCheckout();
    await checkoutPage.assertLoaded();
    await checkoutPage.fillCheckoutInformation(
      customer.valid.firstName,
      customer.valid.lastName,
      customer.valid.postalCode
    );
    await checkoutPage.continue();

    await overviewPage.assertLoaded();
    const overviewPrice = await overviewPage.getDisplayedPriceForProduct(products.backpack);
    expect(overviewPrice).toBe(inventoryPrice);
    await overviewPage.assertSummaryTotals(
      checkoutTotals.backpackOnly.itemTotal,
      checkoutTotals.backpackOnly.tax,
      checkoutTotals.backpackOnly.total
    );
  });

  test('cart is cleared after successful order completion', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new CheckoutOverviewPage(page);
    const completePage = new CheckoutCompletePage(page);

    await inventoryPage.addProductToCart(products.backpack);
    await expectCartBadgeCount(page, 1);
    await inventoryPage.openCart();
    await cartPage.assertLoaded();
    await cartPage.proceedToCheckout();
    await checkoutPage.assertLoaded();
    await checkoutPage.fillCheckoutInformation(
      customer.valid.firstName,
      customer.valid.lastName,
      customer.valid.postalCode
    );
    await checkoutPage.continue();

    await overviewPage.assertLoaded();
    await overviewPage.finishOrder();
    await completePage.assertOrderSuccess(
      checkoutMessages.successHeader,
      checkoutMessages.successBody
    );

    await completePage.backHome();
    await inventoryPage.assertLoaded();
    await expectCartBadgeCount(page, 0);
  });
});

test.describe('Optional solid coverage', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.assertLoaded();
  });

  test('remove product from cart before checkout', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    await expectCartBadgeCount(page, 2);

    await inventoryPage.openCart();
    await cartPage.assertLoaded();

    await cartPage.removeProduct(products.bikeLight);
    await cartPage.verifyProductPresent(products.backpack);
    await cartPage.verifyProductNotPresent(products.bikeLight);
    await expectCartBadgeCount(page, 1);
  });

  test('logout does not break cart/session expectations', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);

    await inventoryPage.addProductToCart(products.backpack);
    await expectCartBadgeCount(page, 1);

    await inventoryPage.logout();
    await expectCurrentUrlIncludes(page, 'saucedemo.com/');

    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.assertLoaded();
    await expectCartBadgeCount(page, 1);

    await inventoryPage.openCart();
    await cartPage.assertLoaded();
    await cartPage.verifyProductPresent(products.backpack);
  });
});
