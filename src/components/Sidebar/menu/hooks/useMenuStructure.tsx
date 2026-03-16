import { hasAllPermissions, hasAnyPermissions } from "@dashboard/auth/misc";
import { useUser } from "@dashboard/auth/useUser";
import { categoryListUrl } from "@dashboard/categories/urls";
import { collectionListUrl } from "@dashboard/collections/urls";
import { iconSize } from "@dashboard/components/icons";
import { createConfigurationMenu } from "@dashboard/configuration/createConfigurationMenu";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import { hasUserMenuItemPermissions } from "@dashboard/configuration/utils";
import { customerListUrl } from "@dashboard/customers/urls";
import { saleListUrl, voucherListUrl } from "@dashboard/discounts/urls";
import { SidebarAppAlert } from "@dashboard/extensions/components/AppAlerts/SidebarAppAlert";
import { useAppsAlert } from "@dashboard/extensions/components/AppAlerts/useAppsAlert";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  extensionsAppSection,
  extensionsCustomSection,
  ExtensionsPaths,
  extensionsPluginSection,
} from "@dashboard/extensions/urls";
import { giftCardListUrl } from "@dashboard/giftCards/urls";
import { PermissionEnum } from "@dashboard/graphql";
import { ConfigurationIcon } from "@dashboard/icons/Configuration";
import { CustomersIcon } from "@dashboard/icons/Customers";
import { DiscountsIcon } from "@dashboard/icons/Discounts";
import { HomeIcon } from "@dashboard/icons/Home";
import { MarketplaceIcon } from "@dashboard/icons/Marketplace";
import ModelingIcon from "@dashboard/icons/Modeling";
import { OrdersIcon } from "@dashboard/icons/Orders";
import { ProductsIcon } from "@dashboard/icons/Products";
import { SearchIcon as Search } from "@dashboard/icons/SearchIcon";
import { TranslationsIcon } from "@dashboard/icons/Translations";
import { WalletsIcon } from "@dashboard/icons/Wallets";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { ripplePagesAreModels } from "@dashboard/modeling/ripples/pagesAreModels";
import { pageListPath } from "@dashboard/modeling/urls";
import { pageTypeListUrl } from "@dashboard/modelTypes/urls";
import { orderDraftListUrl, orderListUrl } from "@dashboard/orders/urls";
import { productListUrl } from "@dashboard/products/urls";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { SearchShortcut } from "@dashboard/search/SearchShortcut";
import { menuListUrl } from "@dashboard/structures/urls";
import { languageListUrl } from "@dashboard/translations/urls";
import { walletListUrl } from "@dashboard/wallets/urls";
import { Box } from "@saleor/macaw-ui-next";
import isEmpty from "lodash/isEmpty";
import { useIntl } from "react-intl";

import { type SidebarMenuItem } from "../types";
import { mapToExtensionsItems } from "../utils";

export function useMenuStructure() {
  const { handleAppsListItemClick, hasProblems } = useAppsAlert();

  const extensions = useExtensions(extensionMountPoints.NAVIGATION_SIDEBAR);
  const intl = useIntl();
  const { user } = useUser();

  const appExtensionsHeaderItem: SidebarMenuItem = {
    id: "extensions",
    label: intl.formatMessage(sectionNames.appExtensions),
    type: "divider",
    paddingY: 1.5,
  };

  const getConfigurationChildren = (): SidebarMenuItem[] =>
    createConfigurationMenu(intl).flatMap((section, sectionIndex) => {
      const visibleItems = section.menuItems.filter(
        item => !item.hidden && !!user && hasUserMenuItemPermissions(item, user),
      );

      if (!visibleItems.length) {
        return [];
      }

      return [
        {
          id: `configuration-section-${sectionIndex}`,
          label: section.label,
          type: "divider",
          paddingY: 1.5,
        },
        ...visibleItems.map((item, itemIndex) => ({
          id: `configuration-item-${sectionIndex}-${itemIndex}`,
          label: item.title,
          url: item.url,
          permissions: item.permissions,
          requireAllPermissions: item.requireAllPermissions,
          hidden: item.hidden,
          type: "item" as const,
        })),
      ];
    });

  const getExtensionsSection = (): SidebarMenuItem => ({
    icon: renderIcon(<MarketplaceIcon />),
    label: intl.formatMessage(sectionNames.extensions),
    permissions: [],
    id: "installed-extensions",
    url: ExtensionsPaths.installedExtensions,
    type: "itemGroup",
    endAdornment: <SidebarAppAlert hasNewFailedAttempts={hasProblems} />,
    onClick: () => handleAppsListItemClick(new Date().toISOString()),
    children: [
      {
        label: (
          <Box display="flex" alignItems="center" gap={3}>
            {intl.formatMessage(sectionNames.installedExtensions)}
            <SidebarAppAlert hasNewFailedAttempts={hasProblems} small />
          </Box>
        ),
        id: "installed-extensions",
        url: ExtensionsPaths.installedExtensions,
        matchUrls: [
          ExtensionsPaths.installedExtensions,
          extensionsCustomSection,
          extensionsAppSection,
          extensionsPluginSection,
        ],
        permissions: [],
        type: "item",
      },
      {
        label: intl.formatMessage(sectionNames.exploreExtensions),
        id: "explore-extensions",
        url: ExtensionsPaths.exploreExtensions,
        permissions: [],
        type: "item" as const,
      },
    ],
  });

  const configurationChildren = getConfigurationChildren();

  const menuItems: SidebarMenuItem[] = [
    {
      icon: renderIcon(<HomeIcon />),
      label: intl.formatMessage(sectionNames.home),
      id: "home",
      url: "/",
      type: "item",
    },
    {
      icon: renderIcon(<Search size={iconSize.small} strokeWidth={2.4} />),
      label: (
        <Box display="flex" alignItems="center" gap={2}>
          {intl.formatMessage(sectionNames.search)}
          <SearchShortcut />
        </Box>
      ),
      id: "search",
      url: "/search",
      permissions: [
        PermissionEnum.MANAGE_PRODUCTS,
        PermissionEnum.MANAGE_PAGES,
        PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
        PermissionEnum.MANAGE_ORDERS,
      ],
      type: "item",
    },
    {
      children: [
        {
          label: intl.formatMessage(sectionNames.products),
          id: "products",
          url: productListUrl(),
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          type: "item",
        },
        {
          label: intl.formatMessage(sectionNames.categories),
          id: "categories",
          url: categoryListUrl(),
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          type: "item",
        },
        {
          label: intl.formatMessage(sectionNames.collections),
          id: "collections",
          url: collectionListUrl(),
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          type: "item",
        },
        {
          label: intl.formatMessage(sectionNames.giftCards),
          id: "giftCards",
          url: giftCardListUrl(),
          permissions: [PermissionEnum.MANAGE_GIFT_CARD],
          type: "item",
        },
        ...mapToExtensionsItems(extensions.NAVIGATION_CATALOG, appExtensionsHeaderItem),
      ],
      icon: renderIcon(<ProductsIcon />),
      url: productListUrl(),
      label: intl.formatMessage(sectionNames.catalog),
      permissions: [PermissionEnum.MANAGE_GIFT_CARD, PermissionEnum.MANAGE_PRODUCTS],
      id: "products",
      type: "itemGroup",
    },
    {
      children: [
        {
          label: intl.formatMessage(sectionNames.orders),
          permissions: [PermissionEnum.MANAGE_ORDERS],
          id: "orders",
          url: orderListUrl(),
          type: "item",
        },
        {
          label: intl.formatMessage(sectionNames.draftOrders),
          permissions: [PermissionEnum.MANAGE_ORDERS],
          id: "order-drafts",
          url: orderDraftListUrl(),
          type: "item",
        },
        ...mapToExtensionsItems(extensions.NAVIGATION_ORDERS, appExtensionsHeaderItem),
      ],
      icon: renderIcon(<OrdersIcon />),
      label: intl.formatMessage(sectionNames.fulfillment),
      permissions: [PermissionEnum.MANAGE_ORDERS],
      id: "orders",
      url: orderListUrl(),
      type: "itemGroup",
    },
    {
      children: !isEmpty(extensions.NAVIGATION_CUSTOMERS)
        ? [
            {
              label: intl.formatMessage(sectionNames.customers),
              permissions: [PermissionEnum.MANAGE_USERS],
              id: "customers",
              url: customerListUrl(),
              type: "item",
            },
            ...mapToExtensionsItems(extensions.NAVIGATION_CUSTOMERS, appExtensionsHeaderItem),
          ]
        : undefined,
      icon: renderIcon(<CustomersIcon />),
      label: intl.formatMessage(sectionNames.customers),
      permissions: [PermissionEnum.MANAGE_USERS],
      id: "customers",
      url: customerListUrl(),
      type: !isEmpty(extensions.NAVIGATION_CUSTOMERS) ? "itemGroup" : "item",
    },
    {
      icon: renderIcon(<WalletsIcon />),
      label: intl.formatMessage(sectionNames.wallets),
      permissions: [PermissionEnum.HANDLE_PAYMENTS],
      id: "wallets",
      url: walletListUrl(),
      type: "item",
    },
    {
      children: [
        {
          label: intl.formatMessage(sectionNames.promotions),
          id: "promotions",
          url: saleListUrl(),
          type: "item",
        },
        {
          label: intl.formatMessage(sectionNames.vouchers),
          id: "vouchers",
          url: voucherListUrl(),
          type: "item",
        },
        ...mapToExtensionsItems(extensions.NAVIGATION_DISCOUNTS, appExtensionsHeaderItem),
      ],
      icon: renderIcon(<DiscountsIcon />),
      label: intl.formatMessage(commonMessages.discounts),
      permissions: [PermissionEnum.MANAGE_DISCOUNTS],
      url: saleListUrl(),
      id: "discounts",
      type: "itemGroup",
    },
    {
      children: [
        {
          label: intl.formatMessage(sectionNames.models),
          id: "models",
          url: pageListPath,
          permissions: [PermissionEnum.MANAGE_PAGES],
          type: "item",
        },
        {
          label: intl.formatMessage(sectionNames.modelTypes),
          id: "model-types",
          url: pageTypeListUrl(),
          permissions: [
            PermissionEnum.MANAGE_PAGES,
            PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
          ],
          type: "item",
        },
        {
          label: intl.formatMessage(sectionNames.structures),
          id: "structures",
          url: menuListUrl(),
          permissions: [PermissionEnum.MANAGE_MENUS],
          type: "item",
        },
        ...mapToExtensionsItems(extensions.NAVIGATION_PAGES, appExtensionsHeaderItem),
      ],
      icon: renderIcon(<ModelingIcon />),
      label: intl.formatMessage(sectionNames.modeling),
      permissions: [PermissionEnum.MANAGE_PAGES, PermissionEnum.MANAGE_MENUS],
      id: "modeling",
      url: pageListPath,
      endAdornment: <Ripple model={ripplePagesAreModels} />,
      type: "itemGroup",
    },
    {
      children: !isEmpty(extensions.NAVIGATION_TRANSLATIONS)
        ? [...mapToExtensionsItems(extensions.NAVIGATION_TRANSLATIONS, appExtensionsHeaderItem)]
        : undefined,
      icon: renderIcon(<TranslationsIcon />),
      label: intl.formatMessage(sectionNames.translations),
      permissions: [PermissionEnum.MANAGE_TRANSLATIONS],
      id: "translations",
      url: languageListUrl,
      type: !isEmpty(extensions.NAVIGATION_TRANSLATIONS) ? "itemGroup" : "item",
    },
    getExtensionsSection(),
    ...(configurationChildren.length
      ? [
          {
            icon: renderIcon(<ConfigurationIcon />),
            label: intl.formatMessage(sectionNames.configuration),
            id: "configure",
            url: configurationMenuUrl,
            type: "itemGroup" as const,
            children: configurationChildren,
          },
        ]
      : []),
  ];
  const isMenuItemPermitted = (menuItem: SidebarMenuItem) => {
    if (menuItem.hidden) {
      return false;
    }

    if (!menuItem?.permissions || menuItem?.permissions?.length < 1) {
      return true;
    }

    if (menuItem.requireAllPermissions) {
      return !!user && hasAllPermissions(menuItem.permissions, user);
    }

    return !!user && hasAnyPermissions(menuItem.permissions, user);
  };
  const getFilteredMenuItems = (menuItems: SidebarMenuItem[]) =>
    menuItems.filter(isMenuItemPermitted);

  return menuItems.reduce((resultItems: SidebarMenuItem[], menuItem: SidebarMenuItem) => {
    if (!isMenuItemPermitted(menuItem)) {
      return resultItems;
    }

    const { children } = menuItem;
    const filteredChildren = children ? getFilteredMenuItems(children) : undefined;

    return [...resultItems, { ...menuItem, children: filteredChildren }];
  }, []);
}

function renderIcon(icon: React.ReactNode) {
  return (
    <Box color="default2" __width={20} __height={20}>
      {icon}
    </Box>
  );
}
