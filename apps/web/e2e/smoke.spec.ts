import { expect, test } from "@playwright/test";

test("la página carga y muestra el título del producto", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "ColdChain Telemetry Platform" })).toBeVisible();
});
