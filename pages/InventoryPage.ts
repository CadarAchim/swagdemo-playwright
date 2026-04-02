import { expect, Page } from '@playwright/test';
import { toCartButtonId } from '../utils/selectors';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  private readonly inventoryContainer = this.page.locator('[data-test="inventory-container"]');
  private readonly shoppingCartLink = this.page.locator('[data-test="shopping-cart-link"]');
  private readonly burgerMenuButton = this.page.locator('#react-burger-menu-btn');
  private readonly logoutLink = this.page.locator('[data-test="logout-sidebar-link"]');

  async assertLoaded(): Promise<void> {
    await expect(this.inventoryContainer).toBeVisible();
    await expect(this.page).toHaveURL(/inventory/);
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.page.locator(`[data-test="${toCartButtonId(productName)}"]`).click();
    await expect(this.page.locator(`[data-test="${toCartButtonId(productName)}"]`)).toHaveCount(0);
  }

  async getDisplayedPriceForProduct(productName: string): Promise<string> {
    const itemCard = this.page.locator('[data-test="inventory-item"]').filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName })
    });

    return (await itemCard.locator('[data-test="inventory-item-price"]').innerText()).trim();
  }

  async openCart(): Promise<void> {
    await this.shoppingCartLink.click();
    await expect(this.page).toHaveURL(/cart\.html$/);
  }

  async logout(): Promise<void> {
    await this.burgerMenuButton.click();
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/\/$/);
  }
}
