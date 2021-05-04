import { render, screen } from "@testing-library/react";
import App from "../pages/index";

describe("Frontend testing", () => {
  it("Home page renders", () => {
    render(<App />);
    expect(
      screen.getByText("Amethyst: A Shopify Dev Challenge")
    ).toBeInTheDocument();
  });
});