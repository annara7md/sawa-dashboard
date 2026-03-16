import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { DatagridPagination } from "@dashboard/components/TablePagination";
import { getPrevLocationState } from "@dashboard/hooks/useBackLinkWithState";
import useNavigator from "@dashboard/hooks/useNavigator";
import { type ListProps, type SortPage } from "@dashboard/types";
import { type Item } from "@glideapps/glide-data-grid";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { type Wallet } from "../../types";
import { type WalletListUrlSortField, walletUrl } from "../../urls";
import { createGetCellContent, walletListStaticColumnsAdapter } from "./datagrid";
import { messages } from "./messages";

interface WalletListDatagridProps extends ListProps, SortPage<WalletListUrlSortField> {
  wallets: Wallet[] | undefined;
  loading: boolean;
  hasRowHover?: boolean;
  onSelectWalletIds: (rowsIndex: number[], clearSelection: () => void) => void;
}

export const WalletListDatagrid = ({
  wallets,
  sort,
  loading,
  settings,
  onUpdateListSettings,
  hasRowHover,
  disabled,
  onSelectWalletIds,
  onSort,
}: WalletListDatagridProps) => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigator();
  const datagrid = useDatagridChangeState();

  const walletListStaticColumns = useMemo(
    () => walletListStaticColumnsAdapter(intl, sort),
    [intl, sort],
  );

  const onColumnChange = useCallback(
    (picked: string[]) => {
      if (onUpdateListSettings) {
        onUpdateListSettings("columns", picked.filter(Boolean));
      }
    },
    [onUpdateListSettings],
  );

  const { handlers, visibleColumns, staticColumns, selectedColumns, recentlyAddedColumn } =
    useColumns({
      gridName: "wallet_list",
      staticColumns: walletListStaticColumns,
      selectedColumns: settings?.columns ?? [],
      onSave: onColumnChange,
    });

  const getCellContent = useCallback(
    createGetCellContent({
      wallets,
      columns: visibleColumns,
    }),
    [wallets, visibleColumns],
  );

  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!wallets) {
        return;
      }

      const rowData: Wallet = wallets[row];
      navigate(walletUrl(rowData.id));
    },
    [navigate, wallets],
  );

  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      if (!wallets) {
        return "";
      }

      const rowData: Wallet = wallets[row];
      return walletUrl(rowData.id);
    },
    [wallets],
  );

  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as WalletListUrlSortField;
      onSort(columnName);
    },
    [visibleColumns, onSort],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        readonly
        loading={loading}
        rowMarkers="checkbox-visible"
        columnSelect="single"
        hasRowHover={hasRowHover}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={false}
        rows={wallets?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        onRowSelectionChange={onSelectWalletIds}
        getCellContent={getCellContent}
        getCellError={() => false}
        selectionActions={() => null}
        menuItems={() => []}
        onRowClick={handleRowClick}
        onHeaderClicked={handleHeaderClick}
        rowAnchor={handleRowAnchor}
        recentlyAddedColumn={recentlyAddedColumn}
        renderColumnPicker={() => (
          <ColumnPicker
            staticColumns={staticColumns}
            selectedColumns={selectedColumns}
            onToggle={handlers.onToggle}
          />
        )}
        navigatorOpts={{ state: getPrevLocationState(location) }}
      />

      <DatagridPagination
        component="div"
        settings={settings}
        disabled={disabled}
        onUpdateListSettings={onUpdateListSettings}
      />
    </DatagridChangeStateContext.Provider>
  );
};