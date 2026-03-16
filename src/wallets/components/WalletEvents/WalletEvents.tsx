import { DashboardCard } from "@dashboard/components/Card";
import TableRowLink from "@dashboard/components/TableRowLink";
import { Table, TableBody, TableCell, TableHead } from "@material-ui/core";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type Wallet, WalletEventType } from "../../types";

interface WalletEventsProps {
  wallet: Wallet | undefined;
  loading: boolean;
}

export const WalletEvents = ({ wallet, loading }: WalletEventsProps) => {
  const intl = useIntl();

  if (loading) {
    return (
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title>
            <Skeleton />
          </DashboardCard.Title>
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

  const events = wallet.events ?? [];

  const getEventTypeLabel = (type: WalletEventType) => {
    switch (type) {
      case WalletEventType.CREDITED:
        return intl.formatMessage({ id: "ChZ06t", defaultMessage: "Credited" });
      case WalletEventType.DEBITED:
        return intl.formatMessage({ id: "VmjvtO", defaultMessage: "Debited" });
      case WalletEventType.RESERVED:
        return intl.formatMessage({ id: "sI/NFi", defaultMessage: "Reserved" });
      case WalletEventType.RESERVATION_RELEASED:
        return intl.formatMessage({ id: "GnNfTd", defaultMessage: "Released" });
      case WalletEventType.REFUNDED:
        return intl.formatMessage({ id: "Gs86nL", defaultMessage: "Refunded" });
      case WalletEventType.TOPUP_REQUESTED:
        return intl.formatMessage({
          id: "6G6fGJ",
          defaultMessage: "Top-up Requested",
        });
      case WalletEventType.TOPUP_APPROVED:
        return intl.formatMessage({
          id: "YfTem1",
          defaultMessage: "Top-up Approved",
        });
      case WalletEventType.TOPUP_REJECTED:
        return intl.formatMessage({
          id: "y9+LhI",
          defaultMessage: "Top-up Rejected",
        });
      case WalletEventType.MANUAL_ADJUSTMENT:
        return intl.formatMessage({
          id: "IZeuSS",
          defaultMessage: "Manual Adjustment",
        });
      case WalletEventType.NOTE_ADDED:
        return intl.formatMessage({ id: "vqBEFb", defaultMessage: "Note Added" });
      default:
        return type;
    }
  };

  const getEventTypeColor = (type: WalletEventType) => {
    switch (type) {
      case WalletEventType.CREDITED:
      case WalletEventType.REFUNDED:
      case WalletEventType.TOPUP_APPROVED:
        return "success1";
      case WalletEventType.DEBITED:
      case WalletEventType.TOPUP_REJECTED:
        return "critical1";
      case WalletEventType.RESERVED:
      case WalletEventType.TOPUP_REQUESTED:
      case WalletEventType.MANUAL_ADJUSTMENT:
        return "warning1";
      default:
        return "default2";
    }
  };

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "nc8QpJ",
            defaultMessage: "Recent Activity",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {events.length === 0 ? (
          <Box padding={4} textAlign="center">
            <Text color="default2">
              {intl.formatMessage({
                id: "dp2TEO",
                defaultMessage: "No activity found",
              })}
            </Text>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRowLink>
                <TableCell>
                  {intl.formatMessage({
                    id: "m1czzY",
                    defaultMessage: "Event",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "CHXoWz",
                    defaultMessage: "Actor",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "Lv0zJu",
                    defaultMessage: "Details",
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
              {events.map(event => (
                <TableRowLink key={event.id}>
                  <TableCell>
                    <Text color={getEventTypeColor(event.type)}>
                      {getEventTypeLabel(event.type)}
                    </Text>
                  </TableCell>
                  <TableCell>
                    {event.user ? (
                      <Text>{event.user.email}</Text>
                    ) : event.app ? (
                      <Text color="default2">{event.app.name}</Text>
                    ) : (
                      <Text color="default2">System</Text>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column" gap={1}>
                      {event.parameters.amount && (
                        <Text size={2} color="default2">
                          Amount: {event.parameters.amount} {event.parameters.currency}
                        </Text>
                      )}
                      {event.parameters.orderId && (
                        <Text size={2} color="default2">
                          Order: {event.parameters.orderId}
                        </Text>
                      )}
                      {event.parameters.requestId && (
                        <Text size={2} color="default2">
                          Request: {event.parameters.requestId}
                        </Text>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                </TableRowLink>
              ))}
            </TableBody>
          </Table>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
