import { DashboardCard } from "@dashboard/components/Card";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type Wallet } from "../../types";

interface WalletInfoProps {
  wallet: Wallet | undefined;
  loading: boolean;
}

export const WalletInfo = ({ wallet, loading }: WalletInfoProps) => {
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
          <Box display="flex" flexDirection="column" gap={3}>
            {[1, 2, 3, 4].map(i => (
              <Box key={i}>
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

  const infoItems = [
    {
      label: intl.formatMessage({
        id: "wallet.info.user",
        defaultMessage: "User",
      }),
      value: `${wallet.user.firstName} ${wallet.user.lastName}`,
    },
    {
      label: intl.formatMessage({
        id: "wallet.info.email",
        defaultMessage: "Email",
      }),
      value: wallet.user.email,
    },
    {
      label: intl.formatMessage({
        id: "wallet.info.currency",
        defaultMessage: "Currency",
      }),
      value: wallet.currency,
    },
    {
      label: intl.formatMessage({
        id: "wallet.info.created",
        defaultMessage: "Created",
      }),
      value: new Date(wallet.createdAt).toLocaleDateString(),
    },
    {
      label: intl.formatMessage({
        id: "wallet.info.updated",
        defaultMessage: "Last Updated",
      }),
      value: new Date(wallet.updatedAt).toLocaleDateString(),
    },
  ];

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "wallet.info.title",
            defaultMessage: "Wallet Information",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box display="flex" flexDirection="column" gap={3}>
          {infoItems.map((item, index) => (
            <Box key={index}>
              <Text size={2} color="default2">
                {item.label}
              </Text>
              <Text size={3} fontWeight="bold" marginTop={1} display="block">
                {item.value}
              </Text>
            </Box>
          ))}
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
