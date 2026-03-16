import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { sectionNames } from "@dashboard/intl";
import {
  type FilterPagePropsWithPresets,
  type PageListProps,
  type SortPage,
} from "@dashboard/types";
import { Box } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

import { type Wallet } from "../../types";
import { type WalletListUrlSortField } from "../../urls";
import { WalletListDatagrid } from "../WalletListDatagrid/WalletListDatagrid";
import { type WalletFilterKeys, type WalletListFilterOpts } from "./filters";

interface WalletListPageProps
  extends PageListProps,
    FilterPagePropsWithPresets<WalletFilterKeys, WalletListFilterOpts>,
    SortPage<WalletListUrlSortField> {
  wallets: Wallet[] | undefined;
  selectedWalletIds: string[];
  loading: boolean;
  onSelectWalletIds: (rows: number[], clearSelection: () => void) => void;
}

const WalletListPage = ({
  selectedFilterPreset,
  initialSearch,
  onFilterPresetsAll,
  onFilterPresetDelete,
  onFilterPresetUpdate,
  onSearchChange,
  onFilterPresetChange,
  onFilterPresetPresetSave,
  filterPresets,
  selectedWalletIds,
  hasPresetsChanged,
  ...walletListProps
}: WalletListPageProps) => {
  const intl = useIntl();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);

  return (
    <>
      <TopNav
        title={intl.formatMessage(sectionNames.wallets)}
        withoutBorder
        isAlignToRight={false}
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged()}
              onSelect={onFilterPresetChange}
              onRemove={onFilterPresetDelete}
              onUpdate={onFilterPresetUpdate}
              savedPresets={filterPresets}
              activePreset={selectedFilterPreset}
              onSelectAll={onFilterPresetsAll}
              onSave={onFilterPresetPresetSave}
              isOpen={isFilterPresetOpen}
              onOpenChange={setFilterPresetOpen}
              selectAllLabel={intl.formatMessage({
                id: "wallets.all",
                defaultMessage: "All wallets",
                description: "tab name",
              })}
            />
          </Box>
        </Box>
      </TopNav>
      <Box>
        <ListFilters
          type="expression-filter"
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "wallets.search.placeholder",
            defaultMessage: "Search wallets...",
          })}
          onSearchChange={onSearchChange}
        />
        <WalletListDatagrid
          {...walletListProps}
          hasRowHover={!isFilterPresetOpen}
          onSelectWalletIds={onSelectWalletIds}
        />
      </Box>
    </>
  );
};

WalletListPage.displayName = "WalletListPage";
export default WalletListPage;