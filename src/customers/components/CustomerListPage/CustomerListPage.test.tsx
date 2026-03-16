import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import CustomerListPage from "./CustomerListPage";

jest.mock("@dashboard/components/AppLayout/TopNav", () => ({
  TopNav: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@dashboard/components/AppLayout/ListFilters", () => ({
  ListFilters: ({ actions }: { actions?: React.ReactNode }) => <div>{actions}</div>,
}));

jest.mock("@dashboard/components/FilterPresetsSelect", () => ({
  FilterPresetsSelect: () => null,
}));

jest.mock("@dashboard/components/BulkDeleteButton", () => ({
  BulkDeleteButton: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

jest.mock("@dashboard/components/ButtonGroupWithDropdown", () => ({
  ButtonGroupWithDropdown: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
}));

jest.mock("@dashboard/extensions/hooks/useExtensions", () => ({
  useExtensions: () => ({
    CUSTOMER_OVERVIEW_CREATE: [],
    CUSTOMER_OVERVIEW_MORE_ACTIONS: [],
  }),
}));

jest.mock("@dashboard/hooks/useNavigator", () => () => jest.fn());

jest.mock("@dashboard/wallets/components/WalletActionGroup", () => ({
  WalletActionGroup: () => <div data-test-id="wallet-action-group" />,
}));

jest.mock("../CustomerListDatagrid/CustomerListDatagrid", () => ({
  CustomerListDatagrid: () => <div data-test-id="customer-datagrid" />,
}));

describe("CustomerListPage", () => {
  it("shows wallet actions when exactly one customer with wallet is selected", () => {
    render(
      <IntlProvider locale="en" messages={{}}>
        <CustomerListPage
          selectedFilterPreset={0}
          initialSearch=""
          onFilterPresetsAll={jest.fn()}
          onFilterPresetDelete={jest.fn()}
          onFilterPresetUpdate={jest.fn()}
          onSearchChange={jest.fn()}
          onFilterPresetChange={jest.fn()}
          onFilterPresetPresetSave={jest.fn()}
          filterPresets={[]}
          filterOpts={{} as any}
          customers={[]}
          selectedCustomerIds={["customer-1"]}
          selectedCustomerWallet={{
            id: "wallet-1",
            currency: "USD",
            isActive: true,
          }}
          hasPresetsChanged={() => false}
          onCustomersDelete={jest.fn()}
          onAddCredit={jest.fn()}
          onManualAdjustment={jest.fn()}
          onRefund={jest.fn()}
          onToggleActive={jest.fn()}
          walletActionLoading={false}
          loading={false}
          disabled={false}
          settings={{ rowNumber: 20 }}
          onUpdateListSettings={jest.fn()}
          onSelectCustomerIds={jest.fn()}
          onSort={jest.fn()}
          sort={{ asc: true, sort: "createdAt" }}
        />
      </IntlProvider>,
    );

    expect(screen.getByTestId("wallet-action-group")).toBeInTheDocument();
  });
});
