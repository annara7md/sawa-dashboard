import { PermissionEnum } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";

import { useMenuStructure } from "./useMenuStructure";

jest.mock("@dashboard/auth/useUser", () => ({
  useUser: jest.fn(),
}));

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

jest.mock("@dashboard/extensions/components/AppAlerts/useAppsAlert", () => ({
  useAppsAlert: jest.fn(() => ({
    handleAppsListItemClick: jest.fn(),
    hasProblems: false,
  })),
}));

jest.mock("react-intl", () => ({
  defineMessages: (messages: unknown) => messages,
  useIntl: jest.fn(() => ({
    formatMessage: ({ defaultMessage, id }: { defaultMessage?: string; id?: string }) =>
      defaultMessage || id || "",
  })),
}));

const { useUser } = jest.requireMock("@dashboard/auth/useUser");

describe("useMenuStructure", () => {
  it("adds configuration children derived from the configuration menu source", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: {
        userPermissions: [
          { code: PermissionEnum.MANAGE_SETTINGS },
          { code: PermissionEnum.MANAGE_CHANNELS },
          { code: PermissionEnum.MANAGE_STAFF },
          { code: PermissionEnum.MANAGE_SHIPPING },
          { code: PermissionEnum.MANAGE_PRODUCTS },
          { code: PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES },
          { code: PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES },
        ],
      },
    });

    const { result } = renderHook(() => useMenuStructure());
    const configurationItem = result.current.find(item => item.id === "configure");

    expect(configurationItem?.type).toBe("itemGroup");
    expect(configurationItem?.children?.some(child => child.label === "Channels")).toBe(true);
    expect(configurationItem?.children?.some(child => child.label === "Site Settings")).toBe(
      true,
    );
  });

  it("respects requireAllPermissions for configuration descendants", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: {
        userPermissions: [{ code: PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES }],
      },
    });

    const { result } = renderHook(() => useMenuStructure());
    const configurationItem = result.current.find(item => item.id === "configure");
    const childLabels = configurationItem?.children?.map(child => child.label);

    expect(childLabels).not.toContain("Attributes");
    expect(childLabels).toContain("Product Types");
  });
});
