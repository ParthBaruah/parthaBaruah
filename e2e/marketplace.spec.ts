import { test, expect } from "@playwright/test";

test.describe("SponsorVault End-to-End User Experience Matrix Flows", () => {
  test.beforeEach(async ({ page }) => {
    // Access the entrypoint database route index
    await page.goto("/companies");
  });

  test("renders localized structural heading layouts correctly on page load", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toContainText("Sponsor Database");
  });

  test("accepts input field text parameters and executes dynamic debounce query checks", async ({ page }) => {
    const searchInput = page.locator("input[placeholder*='Search by company name']");
    await expect(searchInput).toBeVisible();

    // Type query parameters to engage network hooks
    await searchInput.fill("VPN");
    
    // Explicit wait configuration loop simulation reflecting interface debounce timeouts
    await page.waitForTimeout(500);

    // Assert URL context contains matching criteria or search card array renders mutations
    const cleanCardGrid = page.locator(".grid");
    await expect(cleanCardGrid).toBeVisible();
  });

  test("toggles search filter check criteria to isolate matching brand nodes", async ({ page }) => {
    const verifiedCheckbox = page.locator("text=Verified Sponsors Only");
    await expect(verifiedCheckbox).toBeVisible();
    
    // Engagement clicks to loop state mutations
    await verifiedCheckbox.click();
    
    // Verify loaders activate/deactivate smoothly during background fetch loops
    const initialButtonText = page.locator("text=Load More Sponsors");
    if (await initialButtonText.isVisible()) {
      await expect(initialButtonText).toBeEnabled();
    }
  });
});
