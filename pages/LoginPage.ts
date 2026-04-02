import { expect, Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  private readonly usernameInput = this.page.locator('[data-test="username"]');
  private readonly passwordInput = this.page.locator('[data-test="password"]');
  private readonly loginButton = this.page.locator('[data-test="login-button"]');
  private readonly errorMessage = this.page.locator('[data-test="error"]');

  async goto(): Promise<void> {
    await this.gotoWithRetry('/');
    await expect(this.usernameInput).toBeVisible();
  }

  async assertLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/$/);
    await expect(this.usernameInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertErrorMessage(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(expectedMessage);
  }

  private async gotoWithRetry(url: string, attempts = 3): Promise<void> {
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
        return;
      } catch (error) {
        if (attempt === attempts) {
          throw error;
        }
      }
    }
  }
}
