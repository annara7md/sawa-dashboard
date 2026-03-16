import { Card, CardContent } from "@dashboard/components/Card";
import { Skeleton } from "@dashboard/components/Skeleton";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type Wallet } from "../../types";

interface WalletStatsProps {
  wallet: Wallet | undefined;
  loading: boolean;
}

export const WalletStats = ({ wallet, loading }: WalletStatsProps) => {
  const intl = useIntl();

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}>
            {[1, 2, 3].map(i => (
              <Box key={i} textAlign="center">
                <Skeleton />
                <Skeleton />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return null;
  }

  const stats = [
    {
      label: intl.formatMessage({
        id: "wallet.stats.currentBalance",
        defaultMessage: "Current Balance",
      }),
      value: `${wallet.currentBalance.amount.toFixed(2)} ${wallet.currentBalance.currency}`,
      color: "default" as const,
    },
    {
      label: intl.formatMessage({
        id: "wallet.stats.reservedBalance",
        defaultMessage: "Reserved Balance",
      }),
      value: `${wallet.reservedBalance.amount.toFixed(2)} ${wallet.reservedBalance.currency}`,
      color: "warning" as const,
    },
    {
      label: intl.formatMessage({
        id: "wallet.stats.spendableBalance",
        defaultMessage: "Spendable Balance",
      }),
      value: `${wallet.spendableBalance.amount.toFixed(2)} ${wallet.spendableBalance.currency}`,
      color: "success" as const,
    },
  ];

  return (
    <Card>
      <CardContent>
        <Box marginBottom={4}>
          <Text variant="heading" size="small">
            {intl.formatMessage({
              id: "wallet.stats.title",
              defaultMessage: "Wallet Balance",
            })}
          </Text>
        </Box>
        
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}>
          {stats.map((stat, index) => (
            <Box key={index} textAlign="center" padding={3} borderRadius={2} backgroundColor="surfaceNeutralSubdued">
              <Text variant="caption" color="textNeutralSubdued">
                {stat.label}
              </Text>
              <Text variant="heading" size="medium" marginTop={1}>
                {stat.value}
              </Text>
            </Box>
          ))}
        </Box>
        
        <Box marginTop={4} padding={3} borderRadius={2} backgroundColor={wallet.isActive ? "surfaceSuccessSubdued" : "surfaceCriticalSubdued"}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Text variant="bodyStrong">
              {intl.formatMessage({
                id: "wallet.stats.status",
                defaultMessage: "Status",
              })}
            </Text>
            <Text variant="bodyStrong" color={wallet.isActive ? "textSuccessDefault" : "textCriticalDefault"}>
              {wallet.isActive
                ? intl.formatMessage({
                    id: "wallet.status.active",
                    defaultMessage: "Active",
                  })
                : intl.formatMessage({
                    id: "wallet.status.inactive",
                    defaultMessage: "Inactive",
                  })}
            </Text>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};