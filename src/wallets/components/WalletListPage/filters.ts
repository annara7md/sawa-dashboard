import { type IFilter } from "@dashboard/components/Filter";
import { type FilterOpts } from "@dashboard/types";
import { type IntlShape } from "react-intl";

export enum WalletFilterKeys {
  query = "query",
  currency = "currency",
  isActive = "isActive",
  userId = "userId",
}

export interface WalletListFilterOpts extends FilterOpts {
  currency: {
    active: boolean;
    value: string[];
  };
  isActive: {
    active: boolean;
    value: boolean;
  };
  userId: {
    active: boolean;
    value: string;
  };
}

export function createFilterStructure(
  intl: IntlShape,
  opts: WalletListFilterOpts,
): IFilter<WalletFilterKeys> {
  return [
    {
      active: opts.currency.active,
      dependencies: [],
      label: intl.formatMessage({
        id: "wallets.filters.currency",
        defaultMessage: "Currency",
      }),
      name: WalletFilterKeys.currency,
      type: "select",
      value: opts.currency.value,
      options: [
        {
          label: "USD",
          value: "USD",
        },
        {
          label: "EUR",
          value: "EUR",
        },
        {
          label: "SAR",
          value: "SAR",
        },
      ],
    },
    {
      active: opts.isActive.active,
      dependencies: [],
      label: intl.formatMessage({
        id: "wallets.filters.status",
        defaultMessage: "Status",
      }),
      name: WalletFilterKeys.isActive,
      type: "select",
      value: opts.isActive.value ? ["active"] : ["inactive"],
      options: [
        {
          label: intl.formatMessage({
            id: "wallets.filters.status.active",
            defaultMessage: "Active",
          }),
          value: "active",
        },
        {
          label: intl.formatMessage({
            id: "wallets.filters.status.inactive",
            defaultMessage: "Inactive",
          }),
          value: "inactive",
        },
      ],
    },
  ];
}