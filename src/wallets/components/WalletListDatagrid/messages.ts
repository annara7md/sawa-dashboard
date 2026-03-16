import { defineMessages } from "react-intl";

export const messages = defineMessages({
  empty: {
    id: "wallets.list.empty",
    defaultMessage: "No wallets found",
    description: "Empty state message for wallet list",
  },
});

export const columnsMessages = defineMessages({
  user: {
    id: "wallets.list.columns.user",
    defaultMessage: "User",
    description: "Column header for user",
  },
  currency: {
    id: "wallets.list.columns.currency",
    defaultMessage: "Currency",
    description: "Column header for currency",
  },
  currentBalance: {
    id: "wallets.list.columns.currentBalance",
    defaultMessage: "Current Balance",
    description: "Column header for current balance",
  },
  reservedBalance: {
    id: "wallets.list.columns.reservedBalance",
    defaultMessage: "Reserved Balance",
    description: "Column header for reserved balance",
  },
  spendableBalance: {
    id: "wallets.list.columns.spendableBalance",
    defaultMessage: "Spendable Balance",
    description: "Column header for spendable balance",
  },
  status: {
    id: "wallets.list.columns.status",
    defaultMessage: "Status",
    description: "Column header for status",
  },
  createdAt: {
    id: "wallets.list.columns.createdAt",
    defaultMessage: "Created",
    description: "Column header for creation date",
  },
});