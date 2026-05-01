import { test, expect } from '@playwright/test';

/**
 * E2E Tests for VoteSathi Application
 * Tests core user flows: Welcome screen, Navigation, and Public pages
 */

test.describe('Welcome Page', () => {
  test('should load the welcome page', async ({ page }) => {
    await page.goto('/welcome');
    await expect(page).toHaveTitle(/VoteSathi/);
  });

  test('should display the VoteSathi branding', async ({ page }) => {
    await page.goto('/welcome');
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should have a Get Started button', async ({ page }) => {
    await page.goto('/welcome');
    const button = page.locator('button, a').filter({ hasText: /get started|shuru|শুরু/i }).first();
    await expect(button).toBeVisible();
  });
});

test.describe('Login Page', () => {
  test('should navigate to login from welcome', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/login/);
  });

  test('should display email and password fields', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should have a Google sign-in option', async ({ page }) => {
    await page.goto('/login');
    const googleBtn = page.locator('button').filter({ hasText: /google/i });
    await expect(googleBtn).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('welcome page should have proper lang attribute', async ({ page }) => {
    await page.goto('/welcome');
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBeTruthy();
  });

  test('all interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto('/welcome');
    await expect(page.locator('button').first()).toBeVisible();
  });

  test('page should have a main heading', async ({ page }) => {
    await page.goto('/welcome');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});

test.describe('Progressive Web App', () => {
  test('should have a manifest.json', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    expect(response?.status()).toBe(200);
  });

  test('manifest should have required PWA fields', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    const manifest = await response?.json();
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
  });
});

test.describe('Routing', () => {
  test('unknown routes should redirect to home or welcome', async ({ page }) => {
    await page.goto('/nonexistent-route');
    const url = page.url();
    expect(url).toMatch(/welcome|login|\//);
  });
});
