import { DashboardCard } from "@dashboard/components/Card";
import TableRowLink from "@dashboard/components/TableRowLink";
import { Table, TableBody, TableCell, TableHead } from "@material-ui/core";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type Wallet, WalletEntryType } from "../../types";

interface WalletEntriesProps {
  wallet: Wallet | undefined;
  loading: boolean;
}

export const WalletEntries = ({ wallet, loading }: WalletEntriesProps) => {
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

  const entries = wallet.entries ?? [];

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
        return intl.formatMessage({ id: "mLvz+r", defaultMessage: "Credit" });
      case WalletEntryType.DEBIT:
        return intl.formatMessage({ id: "MxD6vP", defaultMessage: "Debit" });
      case WalletEntryType.RESERVE:
        return intl.formatMessage({ id: "PCjq1b", defaultMessage: "Reserve" });
      case WalletEntryType.RELEASE:
        return intl.formatMessage({ id: "E8zzIG", defaultMessage: "Release" });
      case WalletEntryType.REFUND:
        return intl.formatMessage({ id: "IeUH3/", defaultMessage: "Refund" });
      case WalletEntryType.ADJUSTMENT:
        return intl.formatMessage({ id: "LaLTJR", defaultMessage: "Adjustment" });
      default:
        return type;
    }
  };

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "GMkXVd",
            defaultMessage: "Recent Transactions",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {entries.length === 0 ? (
          <Box padding={4} textAlign="center">
            <Text color="default2">
              {intl.formatMessage({
                id: "LER0RZ",
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
                    id: "+U6ozc",
                    defaultMessage: "Type",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "/0TOL5",
                    defaultMessage: "Amount",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "Mre3DV",
                    defaultMessage: "Balance After",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "AkCxS/",
                    defaultMessage: "Reason",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "P7PLVj",
                    defaultMessage: "Date",
                  })}
                </TableCell>
              </TableRowLink>
            </TableHead>
            <TableBody>
              {entries.map(entry => (
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
                  <TableCell>{entry.reason || entry.note || "-"}</TableCell>
                  <TableCell>{new Date(entry.createdAt).toLocaleDateString()}</TableCell>
                </TableRowLink>
              ))}
            </TableBody>
          </Table>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
