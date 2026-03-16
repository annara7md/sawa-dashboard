import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { SingleItem } from "./SingleItem";
import { type SidebarMenuItem } from "./types";

jest.mock("@dashboard/extensions/hooks/useExtensions", () => ({
  useExtensions: jest.fn(() => ({
    NAVIGATION_CATALOG: [],
    NAVIGATION_ORDERS: [],
    NAVIGATION_CUSTOMERS: [],
    NAVIGATION_DISCOUNTS: [],
    NAVIGATION_TRANSLATIONS: [],
    NAVIGATION_PAGES: [],
  })),
}));

const Wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <ThemeProvider>{children}</ThemeProvider>
  </MemoryRouter>
);

describe("SingleItem", () => {
  const menuItem: SidebarMenuItem = {
    id: "products",
    label: "Products",
    url: "/products",
    type: "item",
  };

  it("adds aria-current to the active link", () => {
    window.history.pushState({}, "Products", "/products");

    render(<SingleItem menuItem={menuItem} />, { wrapper: Wrapper });

    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("does not add aria-current to inactive links", () => {
    window.history.pushState({}, "Home", "/");

    render(<SingleItem menuItem={menuItem} />, { wrapper: Wrapper });

    expect(screen.getByRole("link", { name: "Products" })).not.toHaveAttribute("aria-current");
  });
});
