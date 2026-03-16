import { type FilterElement } from "@dashboard/components/Filter/types";
import {
  WalletFilterKeys,
  type WalletListFilterOpts,
} from "@dashboard/wallets/components/WalletListPage/filters";

import { createFilterTabUtils } from "../../../utils/filters";
import { type WalletListUrlFilters, WalletListUrlFiltersEnum } from "../../urls";

const WALLET_FILTERS_KEY = "walletFilters";

export function getFilterOpts(params: WalletListUrlFilters): WalletListFilterOpts {
  return {
    currency: {
      active: !!params.currency,
      value: params.currency ? [params.currency] : [],
    },
    isActive: {
      active: params.isActive !== undefined,
      value: params.isActive === "true",
    },
    userId: {
      active: !!params.userId,
      value: params.userId || "",
    },
  };
}

export function getFilterQueryParam(
  filter: FilterElement<WalletFilterKeys>,
): WalletListUrlFilters {
  const { name } = filter;

  switch (name) {
    case WalletFilterKeys.currency:
      return {
        currency: filter.value.length > 0 ? filter.value[0] : undefined,
      };

    case WalletFilterKeys.isActive:
      return {
        isActive: filter.value ? "true" : "false",
      };

    case WalletFilterKeys.userId:
      return {
        userId: filter.value || undefined,
      };

    default:
      return {};
  }
}

export const storageUtils = createFilterTabUtils<string>(WALLET_FILTERS_KEY);