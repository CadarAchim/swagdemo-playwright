import { expect, Page } from '@playwright/test';

export async function expectCartBadgeCount(page: Page, expectedCount: number): Promise<void> {
  const badge = page.locator('[data-test="shopping-cart-badge"]');
  if (expectedCount === 0) {
    await expect(badge).toHaveCount(0);
    return;
  }

  await expect(badge).toHaveText(String(expectedCount));
}

export async function expectCurrentUrlIncludes(page: Page, value: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(escapeForRegExp(value)));
}

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
