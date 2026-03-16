import { WalletListUrlSortField } from "@dashboard/wallets/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

// For wallet entries sorting
export enum WalletEntrySortField {
  CREATED_AT = "CREATED_AT",
  AMOUNT = "AMOUNT",
  TYPE = "TYPE",
}

// For wallet events sorting  
export enum WalletEventSortField {
  DATE = "DATE",
  TYPE = "TYPE",
}

function getWalletSortQueryField(sort: WalletListUrlSortField) {
  switch (sort) {
    case WalletListUrlSortField.createdAt:
      return "CREATED_AT";
    case WalletListUrlSortField.updatedAt:
      return "UPDATED_AT";
    case WalletListUrlSortField.currentBalance:
      return "CURRENT_BALANCE";
    case WalletListUrlSortField.currency:
      return "CURRENCY";
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getWalletSortQueryField);