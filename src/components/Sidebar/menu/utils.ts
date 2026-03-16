// @ts-strict-ignore
import { type Extension } from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { orderDraftListUrl, orderListUrl } from "@dashboard/orders/urls";
import { matchPath } from "react-router";

import { type SidebarMenuItem } from "./types";

export const mapToExtensionsItems = (extensions: Extension[], header: SidebarMenuItem) => {
  const items: SidebarMenuItem[] = extensions.map(({ label, id, app, url, permissions, open }) => ({
    id: `extension-${id}`,
    label,
    url: ExtensionsUrls.resolveDashboardUrlFromAppCompleteUrl(url, app.appUrl, app.id),
    permissions,
    onClick: open,
    type: "item",
  }));

  if (items.length) {
    items.unshift(header);
  }

  return items;
};

export function isCurrentMenuItem(location: string, menuItem: SidebarMenuItem) {
  return getMenuUrlsToCheck(menuItem).some(menuItemUrl =>
    matchNormalizedLocation(location, menuItemUrl),
  );
}

export function hasActiveDescendant(location: string, menuItem: SidebarMenuItem) {
  return (menuItem.children || []).some(child => {
    if (child.type === "divider") {
      return false;
    }

    if (child.url && child.url === menuItem.url) {
      return false;
    }

    return isCurrentMenuItem(location, child) || hasActiveDescendant(location, child);
  });
}

export function isMenuActive(location: string, menuItem: SidebarMenuItem) {
  const menuUrlsToCheck = getMenuUrlsToCheck(menuItem);

  if (menuUrlsToCheck.length === 0) {
    return false;
  }

  const activeUrl = getPureUrl(location.split("?")[0]);

  if (
    activeUrl === orderDraftListUrl().split("?")[0] &&
    menuUrlsToCheck.some(url => url === orderListUrl().split("?")[0])
  ) {
    return false;
  }

  return isCurrentMenuItem(location, menuItem);
}

const getPureUrl = (url: string) => {
  if (url.includes("/dashboard")) {
    return url.split("/dashboard")[1];
  }

  return url;
};

const getMenuUrlsToCheck = (menuItem: SidebarMenuItem) =>
  [...(menuItem.matchUrls || []), menuItem.url].filter(Boolean).map(item => item.split("?")[0]);

const matchNormalizedLocation = (location: string, menuItemUrl: string) => {
  return !!matchPath(getPureUrl(location.split("?")[0]), {
    exact: menuItemUrl === "/",
    path: menuItemUrl,
  });
};

export const getMenuItemExtension = (
  extensions: Record<
    | "NAVIGATION_CATALOG"
    | "NAVIGATION_ORDERS"
    | "NAVIGATION_CUSTOMERS"
    | "NAVIGATION_DISCOUNTS"
    | "NAVIGATION_TRANSLATIONS"
    | "NAVIGATION_PAGES",
    Extension[]
  >,
  id: string,
) => {
  const extensionsList = Object.values(extensions).reduce(
    (list, extensions) => list.concat(extensions),
    [],
  );
  const extension = extensionsList.find(extension => id === `extension-${extension.id}`);

  return extension;
};
