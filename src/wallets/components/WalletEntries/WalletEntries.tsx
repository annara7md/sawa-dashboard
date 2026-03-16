import { DashboardCard } from "@dashboard/components/Card";
import TableRowLink from "@dashboard/components/TableRowLink";
import { Table, TableBody, TableCell, TableHead } from "@material-ui/core";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type Wallet, WalletEntryType } from "../../types";

interface WalletEntriesProps {
  wallet: Wallet | undefined;
  loading: boolean;
  onManualAdjustment: () => void;
  onRefund: () => void;
}

export const WalletEntries = ({ 
  wallet, 
  loading, 
  onManualAdjustment, 
  onRefund 
}: WalletEntriesProps) => {
  const intl = useIntl();

  if (loading) {
    return (
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title>
            <Skeleton />
          </DashboardCard.Title>
          <DashboardCard.Toolbar>
            <Skeleton />
          </DashboardCard.Toolbar>
        </DashboardCard.Header>
        <DashboardCard.Content>
          <Box display="flex" flexDirection="column" gap={2}>
            {[1, 2, 3].map(i => (
              <Skeleton key={i} />
            ))}
          </Box>
        </DashboardCard.Content>
      </DashboardCard>
    );
  }

  if (!wallet) {
    return null;
  }

  // Mock entries data - في التطبيق الحقيقي، ستأتي من GraphQL
  const mockEntries = [
    {
      id: "1",
      entryType: WalletEntryType.CREDIT,
      amount: { amount: 100, currency: wallet.currency },
      balanceAfter: { amount: 180, currency: wallet.currency },
      reason: "Top-up approved",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2", 
      entryType: WalletEntryType.DEBIT,
      amount: { amount: -50, currency: wallet.currency },
      balanceAfter: { amount: 80, currency: wallet.currency },
      reason: "Order payment",
      createdAt: "2024-01-14T15:30:00Z",
    },
    {
      id: "3",
      entryType: WalletEntryType.RESERVE,
      amount: { amount: -20, currency: wallet.currency },
      balanceAfter: { amount: 80, currency: wallet.currency },
      reason: "Order reservation",
      createdAt: "2024-01-13T12:00:00Z",
    },
  ];

  const getEntryTypeColor = (type: WalletEntryType) => {
    switch (type) {
      case WalletEntryType.CREDIT:
      case WalletEntryType.REFUND:
        return "success1";
      case WalletEntryType.DEBIT:
        return "critical1";
      case WalletEntryType.RESERVE:
      case WalletEntryType.ADJUSTMENT:
        return "warning1";
      default:
        return "default2";
    }
  };

  const getEntryTypeLabel = (type: WalletEntryType) => {
    switch (type) {
      case WalletEntryType.CREDIT:
        return intl.formatMessage({ id: "wallet.entry.credit", defaultMessage: "Credit" });
      case WalletEntryType.DEBIT:
        return intl.formatMessage({ id: "wallet.entry.debit", defaultMessage: "Debit" });
      case WalletEntryType.RESERVE:
        return intl.formatMessage({ id: "wallet.entry.reserve", defaultMessage: "Reserve" });
      case WalletEntryType.RELEASE:
        return intl.formatMessage({ id: "wallet.entry.release", defaultMessage: "Release" });
      case WalletEntryType.REFUND:
        return intl.formatMessage({ id: "wallet.entry.refund", defaultMessage: "Refund" });
      case WalletEntryType.ADJUSTMENT:
        return intl.formatMessage({ id: "wallet.entry.adjustment", defaultMessage: "Adjustment" });
      default:
        return type;
    }
  };

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "wallet.entries.title",
            defaultMessage: "Recent Transactions",
          })}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Box display="flex" gap={2}>
            <Button variant="secondary" size="small" onClick={onManualAdjustment}>
              {intl.formatMessage({
                id: "wallet.entries.manualAdjustment",
                defaultMessage: "Manual Adjustment",
              })}
            </Button>
            <Button variant="secondary" size="small" onClick={onRefund}>
              {intl.formatMessage({
                id: "wallet.entries.refund",
                defaultMessage: "Refund",
              })}
            </Button>
          </Box>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {mockEntries.length === 0 ? (
          <Box padding={4} textAlign="center">
            <Text color="default2">
              {intl.formatMessage({
                id: "wallet.entries.empty",
                defaultMessage: "No transactions found",
              })}
            </Text>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRowLink>
                <TableCell>
                  {intl.formatMessage({
                    id: "wallet.entries.type",
                    defaultMessage: "Type",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "wallet.entries.amount",
                    defaultMessage: "Amount",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "wallet.entries.balanceAfter",
                    defaultMessage: "Balance After",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "wallet.entries.reason",
                    defaultMessage: "Reason",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "wallet.entries.date",
                    defaultMessage: "Date",
                  })}
                </TableCell>
              </TableRowLink>
            </TableHead>
            <TableBody>
              {mockEntries.map(entry => (
                <TableRowLink key={entry.id}>
                  <TableCell>
                    <Text color={getEntryTypeColor(entry.entryType)}>
                      {getEntryTypeLabel(entry.entryType)}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text color={entry.amount.amount >= 0 ? "success1" : "critical1"}>
                      {entry.amount.amount >= 0 ? "+" : ""}
                      {entry.amount.amount.toFixed(2)} {entry.amount.currency}
                    </Text>
                  </TableCell>
                  <TableCell>
                    {entry.balanceAfter.amount.toFixed(2)} {entry.balanceAfter.currency}
                  </TableCell>
                  <TableCell>
                    {entry.reason}
                  </TableCell>
                  <TableCell>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRowLink>
              ))}
            </TableBody>
          </Table>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
