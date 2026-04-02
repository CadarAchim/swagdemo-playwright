import { expect, Page } from '@playwright/test';

export class CheckoutOverviewPage {
  constructor(private readonly page: Page) {}

  private readonly summaryContainer = this.page.locator('[data-test="checkout-summary-container"]');
  private readonly finishButton = this.page.locator('[data-test="finish"]');
  private readonly itemTotal = this.page.locator('[data-test="subtotal-label"]');
  private readonly tax = this.page.locator('[data-test="tax-label"]');
  private readonly total = this.page.locator('[data-test="total-label"]');

  async assertLoaded(): Promise<void> {
    await expect(this.summaryContainer).toBeVisible();
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  async verifyProductPresent(productName: string): Promise<void> {
    await expect(this.page.locator('[data-test="inventory-item-name"]', { hasText: productName })).toBeVisible();
  }

  async verifySummaryLabels(): Promise<void> {
    await expect(this.itemTotal).toBeVisible();
    await expect(this.tax).toBeVisible();
    await expect(this.total).toBeVisible();
  }

  async assertSummaryTotals(expectedItemTotal: string, expectedTax: string, expectedTotal: string): Promise<void> {
    await expect(this.itemTotal).toHaveText(expectedItemTotal);
    await expect(this.tax).toHaveText(expectedTax);
    await expect(this.total).toHaveText(expectedTotal);
  }

  async getDisplayedPriceForProduct(productName: string): Promise<string> {
    const itemRow = this.page.locator('[data-test="cart-list"] .cart_item').filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName })
    });

    return (await itemRow.locator('[data-test="inventory-item-price"]').innerText()).trim();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }
}
