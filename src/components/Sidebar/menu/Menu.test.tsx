import { render, screen, within } from "@testing-library/react";

import { Menu } from "./Menu";

jest.mock("../shortcuts", () => ({
  Shortcusts: () => <div data-test-id="sidebar-shortcuts">Shortcuts</div>,
}));

jest.mock("./hooks/useMenuStructure", () => ({
  useMenuStructure: jest.fn(() => []),
}));

describe("Menu", () => {
  it("renders the sidebar items inside a named navigation landmark", () => {
    render(<Menu />);

    const navigation = screen.getByRole("navigation", { name: "Dashboard navigation" });

    expect(navigation).toBeInTheDocument();
    expect(within(navigation).getByTestId("menu-list")).toBeInTheDocument();
  });
});
