import { render } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { WalletEntries } from "./WalletEntries/WalletEntries";
import { WalletEvents } from "./WalletEvents/WalletEvents";
import { WalletInfo } from "./WalletInfo/WalletInfo";
import { WalletStats } from "./WalletStats/WalletStats";

const boxProps: Array<Record<string, unknown>> = [];
const textProps: Array<Record<string, unknown>> = [];

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
  DashboardCard.Toolbar = function DashboardCardToolbar({
    children,
  }: {
    children: React.ReactNode;
  }) {
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

jest.mock("@dashboard/components/TableRowLink", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
}));

jest.mock("@material-ui/core", () => ({
  Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
  TableHead: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
  TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
  TableCell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
}));

jest.mock("@saleor/macaw-ui-next", () => ({
  Box: (props: Record<string, unknown>) => {
    boxProps.push(props);

    return <div>{props.children as React.ReactNode}</div>;
  },
  Button: (props: Record<string, unknown>) => <button>{props.children as React.ReactNode}</button>,
  Skeleton: () => <div />,
  Text: (props: Record<string, unknown>) => {
    textProps.push(props);

    return <span>{props.children as React.ReactNode}</span>;
  },
}));

const wallet = {
  id: "wallet-1",
  user: {
    id: "user-1",
    email: "user@example.com",
    firstName: "Test",
    lastName: "User",
  },
  currency: "SDG",
  currentBalance: { amount: 100, currency: "SDG" },
  reservedBalance: { amount: 20, currency: "SDG" },
  spendableBalance: { amount: 80, currency: "SDG" },
  isActive: true,
  createdAt: "2026-03-16T00:00:00Z",
  updatedAt: "2026-03-16T00:00:00Z",
  entries: [
    {
      id: "entry-1",
      entryType: "credit",
      amount: { amount: 100, currency: "SDG" },
      balanceAfter: { amount: 100, currency: "SDG" },
      reservedAfter: { amount: 0, currency: "SDG" },
      reason: "Initial credit",
      note: "",
      createdAt: "2026-03-16T00:00:00Z",
    },
  ],
  events: [
    {
      id: "event-1",
      type: "CREDITED",
      user: { id: "user-1", email: "user@example.com" },
      parameters: { amount: "100.00", currency: "SDG" },
      date: "2026-03-16T00:00:00Z",
    },
  ],
};

describe("Wallet details components", () => {
  beforeEach(() => {
    boxProps.length = 0;
    textProps.length = 0;
  });

  it("uses supported Macaw props and valid table structure", () => {
    const { container } = render(
      <IntlProvider locale="en" messages={{}}>
        <WalletStats wallet={wallet} loading={false} />
        <WalletInfo wallet={wallet} loading={false} />
        <WalletEntries wallet={wallet} loading={false} />
        <WalletEvents wallet={wallet} loading={false} />
      </IntlProvider>,
    );

    expect(boxProps.some(props => props.gridTemplateColumns === "repeat(3, 1fr)")).toBe(false);
    expect(boxProps.some(props => props.__gridTemplateColumns === "repeat(3, 1fr)")).toBe(true);

    expect(
      boxProps.some(props =>
        ["surfaceNeutralSubdued", "surfaceSuccessSubdued", "surfaceCriticalSubdued"].includes(
          String(props.backgroundColor),
        ),
      ),
    ).toBe(false);

    expect(
      textProps.some(props =>
        [
          "textSuccessDefault",
          "textCriticalDefault",
          "textWarningDefault",
          "textNeutralSubdued",
        ].includes(String(props.color)),
      ),
    ).toBe(false);

    expect(textProps.some(props => props.size === "small")).toBe(false);

    expect(container.querySelectorAll("table")).toHaveLength(2);
    expect(container.querySelectorAll("table thead")).toHaveLength(2);
    expect(container.querySelectorAll("table tbody")).toHaveLength(2);
  });
});
