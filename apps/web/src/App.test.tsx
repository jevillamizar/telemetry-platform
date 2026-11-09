import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { App } from "./App";

describe("App", () => {
  it("muestra el título del producto", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "ColdChain Telemetry Platform" })).toBeDefined();
  });
});
