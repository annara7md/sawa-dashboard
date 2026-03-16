import { DashboardCard } from "@dashboard/components/Card";
import { type CustomerDetailsQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { WalletActionGroup } from "@dashboard/wallets/components/WalletActionGroup";
import { useWalletActionHandlers } from "@dashboard/wallets/hooks/useWalletActionHandlers";
import { type Wallet } from "@dashboard/wallets/types";
import { walletUrl } from "@dashboard/wallets/urls";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { useCustomerWallets } from "../../hooks/useCustomerWallets";

interface CustomerWalletsProps {
  customer: CustomerDetailsQuery["user"];
  loading?: boolean;
}

interface CustomerWalletRowProps {
  wallet: Wallet;
  onViewWallet: (walletId: string) => void;
  onComplete: () => void | Promise<void>;
}

const CustomerWalletRow = ({ wallet, onViewWallet, onComplete }: CustomerWalletRowProps) => {
  const { handleAddCredit, handleManualAdjustment, handleRefund, handleToggleActive, loading } =
    useWalletActionHandlers({
      wallet,
      onComplete,
    });

  return (
    <Box
      padding={3}
      marginBottom={2}
      borderRadius={2}
      backgroundColor="default1"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      gap={3}
    >
      <Box>
        <Text size={4}>
          {wallet.currency}: {wallet.currentBalance.amount.toFixed(2)}{" "}
          {wallet.currentBalance.currency}
        </Text>
        <Text size={2}>
          Spendable: {wallet.spendableBalance.amount.toFixed(2)} {wallet.spendableBalance.currency}
        </Text>
        {wallet.reservedBalance.amount > 0 && (
          <Text size={2}>
            Reserved: {wallet.reservedBalance.amount.toFixed(2)} {wallet.reservedBalance.currency}
          </Text>
        )}
      </Box>
      <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2}>
        <Text size={2}>{wallet.isActive ? "Active" : "Inactive"}</Text>
        <WalletActionGroup
          wallet={wallet}
          disabled={loading}
          onAddCredit={handleAddCredit}
          onManualAdjustment={handleManualAdjustment}
          onRefund={handleRefund}
          onToggleActive={handleToggleActive}
        />
        <Button variant="secondary" size="small" onClick={() => onViewWallet(wallet.id)}>
          View Details
        </Button>
      </Box>
    </Box>
  );
};

export const CustomerWallets = ({ customer, loading: customerLoading }: CustomerWalletsProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const {
    wallets,
    loading: walletsLoading,
    refetch,
  } = useCustomerWallets({
    userId: customer?.id || "",
  });

  const loading = customerLoading || walletsLoading;

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
            {[1, 2].map(i => (
              <Skeleton key={i} />
            ))}
          </Box>
        </DashboardCard.Content>
      </DashboardCard>
    );
  }

  if (!customer) {
    return null;
  }

  const handleViewWallet = (walletId: string) => {
    navigate(walletUrl(walletId));
  };

  const totalBalance = wallets.reduce((sum, wallet) => {
    const rate = wallet.currency === "SAR" ? 0.27 : wallet.currency === "EUR" ? 1.1 : 1;

    return sum + wallet.currentBalance.amount * rate;
  }, 0);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "bUuTZl",
            defaultMessage: "Customer Wallets",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box marginBottom={4}>
          <Text>
            {intl.formatMessage({
              id: "lWxUhg",
              defaultMessage: "Manage customer wallet balances and transactions",
            })}
          </Text>
        </Box>

        {wallets.length === 0 ? (
          <Box padding={4} __textAlign="center">
            <Text>
              {intl.formatMessage({
                id: "EvIXzC",
                defaultMessage: "No wallets found for this customer",
              })}
            </Text>
          </Box>
        ) : (
          <Box>
            {wallets.map(wallet => (
              <CustomerWalletRow
                key={wallet.id}
                wallet={wallet}
                onViewWallet={handleViewWallet}
                onComplete={refetch}
              />
            ))}

            {/* Summary */}
            <Box marginTop={4} padding={3} borderRadius={2} backgroundColor="default1">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Text>
                  {intl.formatMessage({
                    id: "vyZGQ8",
                    defaultMessage: "Total Wallets",
                  })}
                </Text>
                <Text>{wallets.length}</Text>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={1}>
                <Text>
                  {intl.formatMessage({
                    id: "siTdEk",
                    defaultMessage: "Total Value (USD)",
                  })}
                </Text>
                <Text>${totalBalance.toFixed(2)}</Text>
              </Box>
            </Box>
          </Box>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
