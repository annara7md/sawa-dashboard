import { WindowTitle } from "@dashboard/components/WindowTitle";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { sectionNames } from "@dashboard/intl";
import { ListViews } from "@dashboard/types";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { getSortParams } from "@dashboard/utils/sort";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import WalletListPage from "../components/WalletListPage/WalletListPage";
import { useWalletList } from "../hooks/useWalletList";
import { type WalletListUrlQueryParams, walletListUrl } from "../urls";
import { getFilterOpts, getFilterQueryParam } from "./WalletList/filters";

interface WalletListProps {
  params: WalletListUrlQueryParams;
}

const WalletList = ({ params }: WalletListProps) => {
  const navigate = useNavigator();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(ListViews.WALLET_LIST);
  
  usePaginationReset(walletListUrl, params, settings.rowNumber);

  const {
    clearRowSelection,
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection(params);

  const paginationState = createPaginationState(settings.rowNumber, params);
  
  const queryVariables = useMemo(
    () => ({
      ...paginationState,
      filter: {
        query: params.query,
        currency: params.currency,
        isActive: params.isActive === "true" ? true : params.isActive === "false" ? false : undefined,
      },
      sortBy: {
        field: params.sort || "CREATED_AT",
        direction: params.asc ? "ASC" : "DESC",
      },
    }),
    [params, paginationState],
  );

  const { wallets, loading, pageInfo, refetch } = useWalletList(queryVariables);

  const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
    cleanupFn: clearRowSelection,
    createUrl: walletListUrl,
    getFilterQueryParam,
    navigate,
    params,
    keepActiveTab: true,
  });

  const paginationValues = usePaginator({
    pageInfo,
    paginationState,
    queryString: params,
  });

  const handleSort = createSortHandler(navigate, walletListUrl, params);
  
  const handleSetSelectedWalletIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!wallets || wallets.length === 0) {
        return;
      }

      const rowsIds = rows.map(row => wallets[row]?.id).filter((id): id is string => id !== undefined);
      const haveSameValues = JSON.stringify(rowsIds) === JSON.stringify(selectedRowIds);

      if (!haveSameValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [wallets, selectedRowIds, setClearDatagridRowSelectionCallback, setSelectedRowIds],
  );

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <WindowTitle title={intl.formatMessage(sectionNames.wallets)} />
      <WalletListPage
        selectedFilterPreset={0}
        filterOpts={getFilterOpts(params)}
        filterPresets={[]}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onFilterPresetsAll={resetFilters}
        onFilterPresetChange={() => {}}
        onFilterPresetDelete={() => {}}
        onFilterPresetUpdate={() => {}}
        onFilterPresetPresetSave={() => {}}
        hasPresetsChanged={() => false}
        wallets={wallets || []}
        settings={settings}
        disabled={loading}
        loading={loading}
        onUpdateListSettings={updateListSettings}
        onSort={handleSort}
        selectedWalletIds={selectedRowIds || []}
        onSelectWalletIds={handleSetSelectedWalletIds}
        sort={getSortParams(params)}
      />
    </PaginatorContext.Provider>
  );
};

export default WalletList;