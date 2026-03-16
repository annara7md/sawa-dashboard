import { walletUrl } from "@dashboard/wallets/urls";
import { fireEvent, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { CustomerWallets } from "./CustomerWallets";

const navigateMock = jest.fn();
const refetchMock = jest.fn();

jest.mock("@dashboard/components/Card", () => {
  const DashboardCard = function DashboardCard({ children }: { children: React.ReactNode }) {
    return <section>{children}</section>;
  };

  DashboardCard.Header = function DashboardCardHeader({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
  DashboardCard.Title = function DashboardCardTitle({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
  DashboardCard.Content = function DashboardCardContent({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div>{children}</div>;
  };

  return { DashboardCard };
});

jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: () => navigateMock,
}));

jest.mock("@dashboard/wallets/components/WalletActionGroup", () => ({
  WalletActionGroup: function WalletActionGroup() {
    return <div data-test-id="wallet-action-group" />;
  },
}));

jest.mock("@dashboard/wallets/hooks/useWalletActionHandlers", () => ({
  useWalletActionHandlers: () => ({
    handleAddCredit: jest.fn(),
    handleManualAdjustment: jest.fn(),
    handleRefund: jest.fn(),
    handleToggleActive: jest.fn(),
    loading: false,
  }),
}));

jest.mock("../../hooks/useCustomerWallets", () => ({
  useCustomerWallets: jest.fn(),
}));

jest.mock("@saleor/macaw-ui-next", () => ({
  Box: function Box(props: Record<string, unknown>) {
    return <div>{props.children as React.ReactNode}</div>;
  },
  Button: function Button(props: Record<string, unknown>) {
    return (
      <button onClick={props.onClick as () => void}>{props.children as React.ReactNode}</button>
    );
  },
  Skeleton: function Skeleton() {
    return <div>loading</div>;
  },
  Text: function Text(props: Record<string, unknown>) {
    return <span>{props.children as React.ReactNode}</span>;
  },
}));

const { useCustomerWallets } = jest.requireMock("../../hooks/useCustomerWallets") as {
  useCustomerWallets: jest.Mock;
};

const customer = {
  id: "customer-1",
  email: "customer@example.com",
} as any;

const wallets = [
  {
    id: "wallet-1",
    currency: "USD",
    isActive: true,
    currentBalance: { amount: 120, currency: "USD" },
    spendableBalance: { amount: 100, currency: "USD" },
    reservedBalance: { amount: 20, currency: "USD" },
  },
];

describe("CustomerWallets", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    refetchMock.mockReset();
  });

  it("renders customer wallets with shared actions and navigates to wallet details", () => {
    useCustomerWallets.mockReturnValue({
      wallets,
      loading: false,
      refetch: refetchMock,
    });

    render(
      <IntlProvider locale="en" messages={{}}>
        <CustomerWallets customer={customer} />
      </IntlProvider>,
    );

    expect(screen.getByText("Customer Wallets")).toBeInTheDocument();
    expect(screen.getByText("USD: 120.00 USD")).toBeInTheDocument();
    expect(screen.getByText("Spendable: 100.00 USD")).toBeInTheDocument();
    expect(screen.getByText("Reserved: 20.00 USD")).toBeInTheDocument();
    expect(screen.getByText("Total Wallets")).toBeInTheDocument();
    expect(screen.getByText("$120.00")).toBeInTheDocument();
    expect(screen.getByTestId("wallet-action-group")).toBeInTheDocument();

    fireEvent.click(screen.getByText("View Details"));

    expect(navigateMock).toHaveBeenCalledWith(walletUrl("wallet-1"));
  });

  it("renders empty state when customer has no wallets", () => {
    useCustomerWallets.mockReturnValue({
      wallets: [],
      loading: false,
      refetch: refetchMock,
    });

    render(
      <IntlProvider locale="en" messages={{}}>
        <CustomerWallets customer={customer} />
      </IntlProvider>,
    );

    expect(screen.getByText("No wallets found for this customer")).toBeInTheDocument();
  });
});
