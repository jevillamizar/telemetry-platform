import { render } from "@testing-library/react-native";

import Index from "../app/index";

describe("Index", () => {
  it("muestra el título del producto", async () => {
    const { getByText } = await render(<Index />);

    expect(getByText("TEIOT")).toBeTruthy();
  });
});
