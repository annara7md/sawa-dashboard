import { Card, CardContent, CardHeader } from "@dashboard/components/Card";
import { Skeleton } from "@dashboard/components/Skeleton";
import { Box, Text } from "@saleor/macaw-ui-next";
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
      <Card>
        <CardHeader
          title={
            <Skeleton />
          }
        />
        <CardContent>
          <Box display="flex" flexDirection="column" gap={3}>
            {[1, 2, 3, 4].map(i => (
              <Box key={i}>
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
    <Card>
      <CardHeader
        title={intl.formatMessage({
          id: "wallet.info.title",
          defaultMessage: "Wallet Information",
        })}
      />
      <CardContent>
        <Box display="flex" flexDirection="column" gap={3}>
          {infoItems.map((item, index) => (
            <Box key={index}>
              <Text variant="caption" color="textNeutralSubdued">
                {item.label}
              </Text>
              <Text variant="bodyStrong" marginTop={1}>
                {item.value}
              </Text>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};