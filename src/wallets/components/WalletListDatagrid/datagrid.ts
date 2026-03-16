import { readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type IntlShape } from "react-intl";

import { type Wallet } from "../../types";
import { type WalletListUrlSortField } from "../../urls";
import { columnsMessages } from "./messages";

export const walletListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort<WalletListUrlSortField>,
): AvailableColumn[] =>
  [
    {
      id: "user",
      title: intl.formatMessage(columnsMessages.user),
      width: 300,
    },
    {
      id: "currency",
      title: intl.formatMessage(columnsMessages.currency),
      width: 120,
    },
    {
      id: "currentBalance",
      title: intl.formatMessage(columnsMessages.currentBalance),
      width: 150,
    },
    {
      id: "reservedBalance",
      title: intl.formatMessage(columnsMessages.reservedBalance),
      width: 150,
    },
    {
      id: "spendableBalance",
      title: intl.formatMessage(columnsMessages.spendableBalance),
      width: 150,
    },
    {
      id: "isActive",
      title: intl.formatMessage(columnsMessages.status),
      width: 100,
    },
    {
      id: "createdAt",
      title: intl.formatMessage(columnsMessages.createdAt),
      width: 150,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const createGetCellContent =
  ({ wallets, columns }: { wallets: Wallet[] | undefined; columns: AvailableColumn[] }) =>
  ([column, row]: Item): GridCell => {
    const rowData = wallets?.[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "user":
        return readonlyTextCell(
          `${rowData.user.firstName} ${rowData.user.lastName} (${rowData.user.email})`,
        );
      case "currency":
        return readonlyTextCell(rowData.currency);
      case "currentBalance":
        return readonlyTextCell(
          `${rowData.currentBalance.amount.toFixed(2)} ${rowData.currentBalance.currency}`,
        );
      case "reservedBalance":
        return readonlyTextCell(
          `${rowData.reservedBalance.amount.toFixed(2)} ${rowData.reservedBalance.currency}`,
        );
      case "spendableBalance":
        return readonlyTextCell(
          `${rowData.spendableBalance.amount.toFixed(2)} ${rowData.spendableBalance.currency}`,
        );
      case "isActive":
        return readonlyTextCell(rowData.isActive ? "Active" : "Inactive");
      case "createdAt":
        return readonlyTextCell(new Date(rowData.createdAt).toLocaleDateString());
      default:
        return readonlyTextCell("");
    }
  };