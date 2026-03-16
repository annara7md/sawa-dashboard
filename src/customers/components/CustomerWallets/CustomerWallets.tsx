import { DashboardCard } from "@dashboard/components/Card";
import useNavigator from "@dashboard/hooks/useNavigator";
import { walletUrl } from "@dashboard/wallets/urls";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type CustomerDetailsQuery } from "@dashboard/graphql";
import { useCustomerWallets } from "../../hooks/useCustomerWallets";

interface CustomerWalletsProps {
  customer: CustomerDetailsQuery["user"];
  loading?: boolean;
}

export const CustomerWallets = ({ customer, loading: customerLoading }: CustomerWalletsProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const { wallets, loading: walletsLoading } = useCustomerWallets({
    userId: customer?.id || "",
    currencies: ["USD", "SAR", "EUR"],
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

  const handleTopUpRequest = () => {
    console.log("Top-up request dialog for customer:", customer.id);
  };

  const handleManualAdjustment = () => {
    console.log("Manual adjustment dialog for customer:", customer.id);
  };

  const totalBalance = wallets.reduce((sum: number, wallet: any) => {
    const rate = wallet.currency === "SAR" ? 0.27 : wallet.currency === "EUR" ? 1.1 : 1;
    return sum + (wallet.currentBalance.amount * rate);
  }, 0);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "customer.wallets.title",
            defaultMessage: "Customer Wallets",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={4}>
          <Text>
            {intl.formatMessage({
              id: "customer.wallets.description",
              defaultMessage: "Manage customer wallet balances and transactions",
            })}
          </Text>
          <Box display="flex" gap={2}>
            <Button variant="secondary" size="small" onClick={handleTopUpRequest}>
              {intl.formatMessage({
                id: "customer.wallets.topUp",
                defaultMessage: "Top Up",
              })}
            </Button>
            <Button variant="secondary" size="small" onClick={handleManualAdjustment}>
              {intl.formatMessage({
                id: "customer.wallets.adjust",
                defaultMessage: "Adjust",
              })}
            </Button>
          </Box>
        </Box>

        {wallets.length === 0 ? (
          <Box padding={4} __textAlign="center">
            <Text>
              {intl.formatMessage({
                id: "customer.wallets.empty",
                defaultMessage: "No wallets found for this customer",
              })}
            </Text>
            <Box marginTop={2}>
              <Button variant="primary" size="small" onClick={handleTopUpRequest}>
                {intl.formatMessage({
                  id: "customer.wallets.createFirst",
                  defaultMessage: "Create First Wallet",
                })}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            {wallets.map((wallet) => (
              <Box 
                key={wallet.id} 
                padding={3} 
                marginBottom={2} 
                borderRadius={2} 
                backgroundColor="default1"
                display="flex" 
                justifyContent="space-between" 
                alignItems="center"
              >
                <Box>
                  <Text size={4}>
                    {wallet.currency}: {wallet.currentBalance.amount.toFixed(2)} {wallet.currentBalance.currency}
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
                <Box display="flex" alignItems="center" gap={2}>
                  <Text size={2}>
                    {wallet.isActive ? "Active" : "Inactive"}
                  </Text>
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={() => handleViewWallet(wallet.id)}
                  >
                    {intl.formatMessage({
                      id: "customer.wallets.view",
                      defaultMessage: "View Details",
                    })}
                  </Button>
                </Box>
              </Box>
            ))}
            
            {/* Summary */}
            <Box marginTop={4} padding={3} borderRadius={2} backgroundColor="default1">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Text>
                  {intl.formatMessage({
                    id: "customer.wallets.totalWallets",
                    defaultMessage: "Total Wallets",
                  })}
                </Text>
                <Text>{wallets.length}</Text>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={1}>
                <Text>
                  {intl.formatMessage({
                    id: "customer.wallets.totalValue",
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