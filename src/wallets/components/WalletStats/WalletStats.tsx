import { DashboardCard } from "@dashboard/components/Card";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
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
      <DashboardCard>
        <DashboardCard.Content>
          <Box display="grid" __gridTemplateColumns="repeat(3, 1fr)" gap={4}>
            {[1, 2, 3].map(i => (
              <Box key={i} textAlign="center">
                <Skeleton />
                <Skeleton />
              </Box>
            ))}
          </Box>
        </DashboardCard.Content>
      </DashboardCard>
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
    },
    {
      label: intl.formatMessage({
        id: "wallet.stats.reservedBalance",
        defaultMessage: "Reserved Balance",
      }),
      value: `${wallet.reservedBalance.amount.toFixed(2)} ${wallet.reservedBalance.currency}`,
    },
    {
      label: intl.formatMessage({
        id: "wallet.stats.spendableBalance",
        defaultMessage: "Spendable Balance",
      }),
      value: `${wallet.spendableBalance.amount.toFixed(2)} ${wallet.spendableBalance.currency}`,
    },
  ];

  return (
    <DashboardCard>
      <DashboardCard.Content>
        <Box marginBottom={4}>
          <Text size={5} fontWeight="bold">
            {intl.formatMessage({
              id: "wallet.stats.title",
              defaultMessage: "Wallet Balance",
            })}
          </Text>
        </Box>
        
        <Box display="grid" __gridTemplateColumns="repeat(3, 1fr)" gap={4}>
          {stats.map((stat, index) => (
            <Box key={index} textAlign="center" padding={3} borderRadius={2} backgroundColor="default2">
              <Text size={2} color="default2">
                {stat.label}
              </Text>
              <Text size={5} fontWeight="bold" marginTop={1} display="block">
                {stat.value}
              </Text>
            </Box>
          ))}
        </Box>
        
        <Box
          marginTop={4}
          padding={3}
          borderRadius={2}
          backgroundColor={wallet.isActive ? "success1" : "critical1"}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Text size={3} fontWeight="bold" color="default1">
              {intl.formatMessage({
                id: "wallet.stats.status",
                defaultMessage: "Status",
              })}
            </Text>
            <Text
              size={3}
              fontWeight="bold"
              color="default1"
            >
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
      </DashboardCard.Content>
    </DashboardCard>
  );
};
