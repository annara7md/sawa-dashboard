import { Card, CardContent, CardHeader } from "@dashboard/components/Card";
import { Skeleton } from "@dashboard/components/Skeleton";
import { TableBody, TableCell, TableHead, TableRow } from "@dashboard/components/TableRowLink";
import { Box, Text } from "@saleor/macaw-ui-next";
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
      <Card>
        <CardHeader title={<Skeleton />} />
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {[1, 2, 3].map(i => (
              <Skeleton key={i} />
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return null;
  }

  // Mock events data - في التطبيق الحقيقي، ستأتي من GraphQL
  const mockEvents = [
    {
      id: "1",
      type: WalletEventType.CREDITED,
      user: { id: "1", email: "admin@example.com" },
      date: "2024-01-15T10:00:00Z",
      parameters: { amount: "100.00", currency: wallet.currency },
    },
    {
      id: "2",
      type: WalletEventType.DEBITED,
      user: null,
      app: { id: "1", name: "Store Frontend" },
      date: "2024-01-14T15:30:00Z",
      parameters: { amount: "50.00", currency: wallet.currency, orderId: "ORD-123" },
    },
    {
      id: "3",
      type: WalletEventType.TOPUP_APPROVED,
      user: { id: "2", email: "staff@example.com" },
      date: "2024-01-13T12:00:00Z",
      parameters: { amount: "100.00", currency: wallet.currency, requestId: "REQ-456" },
    },
  ];

  const getEventTypeLabel = (type: WalletEventType) => {
    switch (type) {
      case WalletEventType.CREDITED:
        return intl.formatMessage({ id: "wallet.event.credited", defaultMessage: "Credited" });
      case WalletEventType.DEBITED:
        return intl.formatMessage({ id: "wallet.event.debited", defaultMessage: "Debited" });
      case WalletEventType.RESERVED:
        return intl.formatMessage({ id: "wallet.event.reserved", defaultMessage: "Reserved" });
      case WalletEventType.RESERVATION_RELEASED:
        return intl.formatMessage({ id: "wallet.event.released", defaultMessage: "Released" });
      case WalletEventType.REFUNDED:
        return intl.formatMessage({ id: "wallet.event.refunded", defaultMessage: "Refunded" });
      case WalletEventType.TOPUP_REQUESTED:
        return intl.formatMessage({ id: "wallet.event.topupRequested", defaultMessage: "Top-up Requested" });
      case WalletEventType.TOPUP_APPROVED:
        return intl.formatMessage({ id: "wallet.event.topupApproved", defaultMessage: "Top-up Approved" });
      case WalletEventType.TOPUP_REJECTED:
        return intl.formatMessage({ id: "wallet.event.topupRejected", defaultMessage: "Top-up Rejected" });
      case WalletEventType.MANUAL_ADJUSTMENT:
        return intl.formatMessage({ id: "wallet.event.manualAdjustment", defaultMessage: "Manual Adjustment" });
      case WalletEventType.NOTE_ADDED:
        return intl.formatMessage({ id: "wallet.event.noteAdded", defaultMessage: "Note Added" });
      default:
        return type;
    }
  };

  const getEventTypeColor = (type: WalletEventType) => {
    switch (type) {
      case WalletEventType.CREDITED:
      case WalletEventType.REFUNDED:
      case WalletEventType.TOPUP_APPROVED:
        return "textSuccessDefault";
      case WalletEventType.DEBITED:
      case WalletEventType.TOPUP_REJECTED:
        return "textCriticalDefault";
      case WalletEventType.RESERVED:
      case WalletEventType.TOPUP_REQUESTED:
      case WalletEventType.MANUAL_ADJUSTMENT:
        return "textWarningDefault";
      default:
        return "textNeutralDefault";
    }
  };

  return (
    <Card>
      <CardHeader
        title={intl.formatMessage({
          id: "wallet.events.title",
          defaultMessage: "Recent Activity",
        })}
      />
      <CardContent>
        {mockEvents.length === 0 ? (
          <Box padding={4} textAlign="center">
            <Text color="textNeutralSubdued">
              {intl.formatMessage({
                id: "wallet.events.empty",
                defaultMessage: "No activity found",
              })}
            </Text>
          </Box>
        ) : (
          <Box>
            <TableHead>
              <TableRow>
                <TableCell>
                  {intl.formatMessage({
                    id: "wallet.events.type",
                    defaultMessage: "Event",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "wallet.events.actor",
                    defaultMessage: "Actor",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "wallet.events.details",
                    defaultMessage: "Details",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "wallet.events.date",
                    defaultMessage: "Date",
                  })}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Text color={getEventTypeColor(event.type)}>
                      {getEventTypeLabel(event.type)}
                    </Text>
                  </TableCell>
                  <TableCell>
                    {event.user ? (
                      <Text>{event.user.email}</Text>
                    ) : event.app ? (
                      <Text color="textNeutralSubdued">{event.app.name}</Text>
                    ) : (
                      <Text color="textNeutralSubdued">System</Text>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column" gap={1}>
                      {event.parameters.amount && (
                        <Text variant="caption">
                          Amount: {event.parameters.amount} {event.parameters.currency}
                        </Text>
                      )}
                      {event.parameters.orderId && (
                        <Text variant="caption">
                          Order: {event.parameters.orderId}
                        </Text>
                      )}
                      {event.parameters.requestId && (
                        <Text variant="caption">
                          Request: {event.parameters.requestId}
                        </Text>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(event.date).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};