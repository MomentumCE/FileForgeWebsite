import { expect, test } from "@playwright/test";

// Smoke coverage for the pages this site exists to serve: every public page
// renders, the home rewrite works, the service hands off to Finder, the CTAs
// reach the contact form, and the feedback form is wired to Netlify Forms the
// way public/__forms.html promises. The contact form itself is exercised in
// contact-form.spec.ts.

test.describe("FileForge site", () => {
  test("home page serves the Paper to Digital service page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("main.ff-page")).toBeVisible();
    // The service leads: the nav CTA is the discovery call, not the download.
    await expect(page.locator('nav a[href="/#contact"]')).toBeVisible();
    await expect(page.locator('form[name="contact"]')).toBeVisible();
    await expect(page.locator("#pricing")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/fileforge-service$/
    );
  });

  test("service page hands off to FileForge Finder", async ({ page }) => {
    await page.goto("/fileforge-service");
    const callout = page.locator("#finder");
    await callout.scrollIntoViewIfNeeded();
    await expect(
      callout.getByRole("link", { name: /Learn about FileForge Finder/i })
    ).toHaveAttribute("href", "/finder");
  });

  test("/finder renders the Finder landing page with the download CTA", async ({ page }) => {
    await page.goto("/finder");
    await expect(page.locator("main.ff-page")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Download FileForge Finder/i }).first()
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Terms of Use/i }).first()).toBeVisible();
  });

  test("/fileforge-plus renders", async ({ page }) => {
    await page.goto("/fileforge-plus");
    await expect(page.locator("main.ff-page")).toBeVisible();
    await expect(page.getByRole("link", { name: /Back to FileForge Finder/i })).toBeVisible();
  });

  test("/fileforge-service renders with CTAs pointing at the contact form", async ({
    page,
  }) => {
    await page.goto("/fileforge-service");
    await expect(page.locator("main.ff-page")).toBeVisible();
    await expect(page.locator("#pricing")).toBeVisible();
    await expect(page.locator('main a[href="/#contact"]').first()).toBeVisible();
    await expect(page.locator("#contact form[name=\"contact\"]")).toBeVisible();
  });

  test("legal pages render their documents", async ({ page }) => {
    await page.goto("/finder/terms");
    await expect(page.locator("article.article-body")).toContainText(/Terms of Use/i);
    await page.goto("/finder/privacy");
    await expect(page.locator("article.article-body")).toContainText(/Privacy Policy/i);
  });

  test("feedback page renders the Netlify form with the expected fields", async ({ page }) => {
    await page.goto("/finder/feedback");
    const form = page.locator('form[name="fileforge-feedback"]');
    await expect(form).toBeVisible();
    await expect(form.locator('input[type="hidden"][name="form-name"]')).toHaveValue(
      "fileforge-feedback"
    );
    for (const name of ["topic", "message", "name", "email", "app_version"]) {
      await expect(form.locator(`[name="${name}"]`)).toBeVisible();
    }
  });

  test("static stub at /__forms.html registers the feedback form", async ({ request }) => {
    const response = await request.get("/__forms.html");
    expect(response.ok()).toBe(true);
    const body = await response.text();
    expect(body).toContain('name="fileforge-feedback"');
    expect(body).toContain('data-netlify="true"');
    for (const name of ["topic", "message", "name", "email", "app_version"]) {
      expect(body).toContain(`name="${name}"`);
    }
  });

  test("sitemap and robots are generated", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain("/fileforge-service");

    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toMatch(/Sitemap: .*\/sitemap\.xml/);
  });
});
