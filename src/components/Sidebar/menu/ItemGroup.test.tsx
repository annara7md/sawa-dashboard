import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { ItemGroup } from "./ItemGroup";
import { type SidebarMenuItem } from "./types";

jest.mock("./Item", () => ({
  MenuItem: ({ menuItem }: { menuItem: SidebarMenuItem }) => <div>{menuItem.label}</div>,
}));

const Wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <ThemeProvider>{children}</ThemeProvider>
  </MemoryRouter>
);

describe("ItemGroup", () => {
  it("renders the disclosure button with an accessible name that describes the section", () => {
    const menuItem: SidebarMenuItem = {
      id: "catalog",
      label: "Catalog",
      url: "/products",
      type: "itemGroup",
      children: [
        {
          id: "products",
          label: "Products",
          url: "/products",
          type: "item",
        },
      ],
    };

    render(<ItemGroup menuItem={menuItem} />, { wrapper: Wrapper });

    const link = screen.getByRole("link", { name: "Catalog" });
    const toggleButton = screen.getByTestId("sidebar-group-toggle-catalog");

    expect(link).toBeInTheDocument();
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAccessibleName("Toggle Catalog");
    expect(toggleButton.querySelector("svg")).not.toBeNull();
    expect(toggleButton.parentElement).toHaveStyle({
      gridTemplateColumns: "minmax(0, 1fr) auto",
    });
  });

  it("starts expanded when a descendant is active", () => {
    window.history.pushState({}, "Categories", "/categories");

    const menuItem: SidebarMenuItem = {
      id: "catalog",
      label: "Catalog",
      url: "/products",
      type: "itemGroup",
      children: [
        {
          id: "products",
          label: "Products",
          url: "/products",
          type: "item",
        },
        {
          id: "categories",
          label: "Categories",
          url: "/categories",
          type: "item",
        },
      ],
    };

    render(<ItemGroup menuItem={menuItem} />, { wrapper: Wrapper });

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });
});
