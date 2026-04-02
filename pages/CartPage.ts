import { expect, Page } from '@playwright/test';
import { toRemoveButtonId } from '../utils/selectors';

export class CartPage {
  constructor(private readonly page: Page) {}

  private readonly cartList = this.page.locator('[data-test="cart-list"]');
  private readonly checkoutButton = this.page.locator('[data-test="checkout"]');

  async assertLoaded(): Promise<void> {
    await expect(this.cartList).toBeVisible();
    await expect(this.page).toHaveURL(/cart/);
  }

  async verifyProductPresent(productName: string): Promise<void> {
    await expect(this.page.locator('[data-test="inventory-item-name"]', { hasText: productName })).toBeVisible();
  }

  async verifyProductNotPresent(productName: string): Promise<void> {
    await expect(this.page.locator('[data-test="inventory-item-name"]', { hasText: productName })).toHaveCount(0);
  }

  async getDisplayedPriceForProduct(productName: string): Promise<string> {
    const itemRow = this.page.locator('.cart_item').filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName })
    });

    return (await itemRow.locator('[data-test="inventory-item-price"]').innerText()).trim();
  }

  async removeProduct(productName: string): Promise<void> {
    await this.page.locator(`[data-test="${toRemoveButtonId(productName)}"]`).click();
    await expect(this.page.locator(`[data-test="${toRemoveButtonId(productName)}"]`)).toHaveCount(0);
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }
}
