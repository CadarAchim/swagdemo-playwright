import { expect, Page } from '@playwright/test';

export class CheckoutCompletePage {
  constructor(private readonly page: Page) {}

  private readonly completeHeader = this.page.locator('[data-test="complete-header"]');
  private readonly completeText = this.page.locator('[data-test="complete-text"]');
  private readonly backHomeButton = this.page.locator('[data-test="back-to-products"]');

  async assertOrderSuccess(expectedHeader: string, expectedBody: string): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-complete/);
    await expect(this.completeHeader).toHaveText(expectedHeader);
    await expect(this.completeText).toHaveText(expectedBody);
    await expect(this.backHomeButton).toBeVisible();
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
    await expect(this.page).toHaveURL(/inventory/);
  }
}
