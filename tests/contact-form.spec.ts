import { expect, test } from "@playwright/test";

const FIELD_VALUES = {
  first_name: "Jane",
  last_name: "Tester",
  email: "jane.tester@example.com",
  organization: "Test Co",
  message: "Automated e2e test submission.",
};

test.describe("Contact form on the home (service) page", () => {
  test("renders all expected fields and the Netlify hidden form-name input", async ({
    page,
  }) => {
    await page.goto("/");

    const form = page.locator('form[name="contact"]');
    await expect(form).toBeVisible();
    await expect(form).toHaveAttribute("data-netlify", "true");
    await expect(form).toHaveAttribute("method", "POST");

    await expect(
      form.locator('input[type="hidden"][name="form-name"]')
    ).toHaveValue("contact");

    await expect(form.locator('input[name="first_name"]')).toBeVisible();
    await expect(form.locator('input[name="last_name"]')).toBeVisible();
    await expect(form.locator('input[name="email"]')).toBeVisible();
    await expect(form.locator('input[name="organization"]')).toBeVisible();
    await expect(form.locator('textarea[name="message"]')).toBeVisible();
    await expect(form.locator('button[type="submit"]')).toBeVisible();
  });

  test("fades in once scrolled into view and the CTA anchor reaches it", async ({
    page,
  }) => {
    await page.goto("/#contact");
    const card = page.locator(".contact-form");
    await card.scrollIntoViewIfNeeded();
    // RevealOnScroll adds .visible via IntersectionObserver; the CSS then
    // transitions opacity from 0 to 1.
    await expect(card).toHaveClass(/visible/);
    await expect
      .poll(async () => card.evaluate((el) => getComputedStyle(el).opacity))
      .toBe("1");
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("blocks submission when required fields are empty (HTML5 validation)", async ({
    page,
  }) => {
    await page.goto("/");

    const form = page.locator('form[name="contact"]');
    await form.scrollIntoViewIfNeeded();
    await form.locator('button[type="submit"]').click();

    const isValid = await form.evaluate(
      (el) => (el as HTMLFormElement).checkValidity()
    );
    expect(isValid).toBe(false);

    await expect(form).toBeVisible();
    await expect(page.getByRole("status")).toHaveCount(0);
  });

  test("posts URL-encoded form data to /__forms.html and shows success state on 200", async ({
    page,
  }) => {
    let captured:
      | { url: string; method: string; contentType: string; body: string }
      | null = null;

    await page.route("**/__forms.html", async (route) => {
      const request = route.request();
      captured = {
        url: request.url(),
        method: request.method(),
        contentType: request.headers()["content-type"] ?? "",
        body: request.postData() ?? "",
      };
      await route.fulfill({ status: 200, body: "ok" });
    });

    await page.goto("/");
    await fillForm(page);
    await page.locator('form[name="contact"] button[type="submit"]').click();

    await expect(page.getByRole("status")).toContainText(
      "Thank you - your message has been received."
    );
    await expect(page.locator('form[name="contact"]')).toHaveCount(0);

    expect(captured).not.toBeNull();
    expect(captured!.method).toBe("POST");
    expect(captured!.url).toMatch(/\/__forms\.html$/);
    expect(captured!.contentType).toContain(
      "application/x-www-form-urlencoded"
    );

    const params = new URLSearchParams(captured!.body);
    expect(params.get("form-name")).toBe("contact");
    expect(params.get("first_name")).toBe(FIELD_VALUES.first_name);
    expect(params.get("last_name")).toBe(FIELD_VALUES.last_name);
    expect(params.get("email")).toBe(FIELD_VALUES.email);
    expect(params.get("organization")).toBe(FIELD_VALUES.organization);
    expect(params.get("message")).toBe(FIELD_VALUES.message);
  });

  test("shows error banner and preserves field values when /__forms.html returns 500", async ({
    page,
  }) => {
    await page.route("**/__forms.html", (route) =>
      route.fulfill({ status: 500, body: "boom" })
    );

    await page.goto("/");
    await fillForm(page);
    await page.locator('form[name="contact"] button[type="submit"]').click();

    const form = page.locator('form[name="contact"]');
    await expect(form.locator('[role="alert"]')).toContainText(
      "Something went wrong sending your message"
    );

    await expect(form).toBeVisible();
    await expect(form.locator('input[name="first_name"]')).toHaveValue(
      FIELD_VALUES.first_name
    );
    await expect(form.locator('input[name="email"]')).toHaveValue(
      FIELD_VALUES.email
    );
    await expect(form.locator('textarea[name="message"]')).toHaveValue(
      FIELD_VALUES.message
    );

    const submit = form.locator('button[type="submit"]');
    await expect(submit).toBeEnabled();
  });

  test("static stub at /__forms.html exists with the contact form definition", async ({
    request,
  }) => {
    const response = await request.get("/__forms.html");
    expect(response.ok()).toBe(true);
    const body = await response.text();
    expect(body).toContain('name="contact"');
    expect(body).toContain('data-netlify="true"');
    expect(body).toContain('name="form-name"');
    for (const fieldName of [
      "first_name",
      "last_name",
      "email",
      "organization",
      "message",
    ]) {
      expect(body).toContain(`name="${fieldName}"`);
    }
  });
});

async function fillForm(page: import("@playwright/test").Page) {
  const form = page.locator('form[name="contact"]');
  await form.scrollIntoViewIfNeeded();
  await form.locator('input[name="first_name"]').fill(FIELD_VALUES.first_name);
  await form.locator('input[name="last_name"]').fill(FIELD_VALUES.last_name);
  await form.locator('input[name="email"]').fill(FIELD_VALUES.email);
  await form
    .locator('input[name="organization"]')
    .fill(FIELD_VALUES.organization);
  await form.locator('textarea[name="message"]').fill(FIELD_VALUES.message);
}
