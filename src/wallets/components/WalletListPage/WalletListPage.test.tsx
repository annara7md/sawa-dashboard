import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import WalletListPage from "./WalletListPage";

jest.mock("@dashboard/components/AppLayout/TopNav", () => ({
  TopNav: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@dashboard/components/FilterPresetsSelect", () => ({
  FilterPresetsSelect: () => null,
}));

jest.mock("../WalletListDatagrid/WalletListDatagrid", () => ({
  WalletListDatagrid: () => <div data-test-id="wallet-datagrid" />,
}));

describe("WalletListPage", () => {
  it("renders filters without requiring conditional filter context", () => {
    render(
      <IntlProvider locale="en" messages={{}}>
        <WalletListPage
          selectedFilterPreset={0}
          filterOpts={{
            currency: { active: false, value: [] },
            isActive: { active: false, value: false },
            userId: { active: false, value: "" },
          }}
          filterPresets={[]}
          initialSearch=""
          onSearchChange={jest.fn()}
          onFilterChange={jest.fn()}
          onFilterPresetsAll={jest.fn()}
          onFilterPresetChange={jest.fn()}
          onFilterPresetDelete={jest.fn()}
          onFilterPresetUpdate={jest.fn()}
          onFilterPresetPresetSave={jest.fn()}
          hasPresetsChanged={() => false}
          wallets={[]}
          settings={{ rowNumber: 20 }}
          disabled={false}
          loading={false}
          onUpdateListSettings={jest.fn()}
          onSort={jest.fn()}
          selectedWallet={undefined}
          selectedWalletIds={[]}
          onSelectWalletIds={jest.fn()}
          onAddCredit={jest.fn()}
          onManualAdjustment={jest.fn()}
          onRefund={jest.fn()}
          onToggleActive={jest.fn()}
          walletActionLoading={false}
          sort={{ asc: true, sort: "createdAt" }}
        />
      </IntlProvider>,
    );

    expect(screen.getByPlaceholderText("Search wallets...")).toBeInTheDocument();
  });
});
