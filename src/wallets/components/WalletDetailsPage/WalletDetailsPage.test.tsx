import { render } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { WalletDetailsPage } from "./WalletDetailsPage";

const topNavProps: Array<Record<string, unknown>> = [];
const boxProps: Array<Record<string, unknown>> = [];

jest.mock("@dashboard/components/AppLayout/TopNav", () => ({
  TopNav: (props: Record<string, unknown>) => {
    topNavProps.push(props);

    return <div>{props.children as React.ReactNode}</div>;
  },
}));

jest.mock("@dashboard/components/Layouts", () => {
  const Content = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const RightSidebar = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const DetailPageLayout = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

  DetailPageLayout.Content = Content;
  DetailPageLayout.RightSidebar = RightSidebar;

  return { DetailPageLayout };
});

jest.mock("@dashboard/components/Backlink", () => ({
  Backlink: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@dashboard/components/Metadata", () => ({
  Metadata: () => <div />,
}));

jest.mock("../WalletInfo/WalletInfo", () => ({
  WalletInfo: () => <div />,
}));

jest.mock("../WalletStats/WalletStats", () => ({
  WalletStats: () => <div />,
}));

jest.mock("../WalletEntries/WalletEntries", () => ({
  WalletEntries: () => <div />,
}));

jest.mock("../WalletEvents/WalletEvents", () => ({
  WalletEvents: () => <div />,
}));

jest.mock("../WalletActionGroup", () => ({
  WalletActionGroup: () => <div />,
}));

jest.mock("@saleor/macaw-ui-next", () => ({
  Box: (props: Record<string, unknown>) => {
    boxProps.push(props);

    return <div>{props.children as React.ReactNode}</div>;
  },
  Text: (props: Record<string, unknown>) => <span>{props.children as React.ReactNode}</span>,
}));

describe("WalletDetailsPage", () => {
  beforeEach(() => {
    topNavProps.length = 0;
    boxProps.length = 0;
  });

  it("uses supported TopNav and Box props for the details layout", () => {
    render(
      <IntlProvider locale="en" messages={{}}>
        <WalletDetailsPage
          wallet={{
            id: "wallet-1",
            user: {
              id: "user-1",
              email: "user@example.com",
              firstName: "Test",
              lastName: "User",
            },
            currency: "SDG",
            currentBalance: { amount: 10, currency: "SDG" },
            reservedBalance: { amount: 2, currency: "SDG" },
            spendableBalance: { amount: 8, currency: "SDG" },
            isActive: true,
            createdAt: "2026-03-16T00:00:00Z",
            updatedAt: "2026-03-16T00:00:00Z",
          }}
          loading={false}
          backHref="/wallets/"
          onAddCredit={jest.fn()}
          onManualAdjustment={jest.fn()}
          onRefund={jest.fn()}
          onToggleActive={jest.fn()}
          actionLoading={false}
        />
      </IntlProvider>,
    );

    expect(topNavProps[0]).not.toHaveProperty("onBack");
    expect(topNavProps[0]).toHaveProperty("href");
    expect(boxProps.some(props => props.gridTemplateColumns !== undefined)).toBe(false);
    expect(boxProps.some(props => props.paddingTop === 6)).toBe(true);
  });
});
