import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Backlink } from "@dashboard/components/Backlink";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import { sectionNames } from "@dashboard/intl";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type Wallet } from "../../types";
import { WalletActionGroup } from "../WalletActionGroup";
import { WalletEntries } from "../WalletEntries/WalletEntries";
import { WalletEvents } from "../WalletEvents/WalletEvents";
import { WalletInfo } from "../WalletInfo/WalletInfo";
import { WalletStats } from "../WalletStats/WalletStats";

interface WalletDetailsPageProps {
  wallet: Wallet | undefined;
  loading: boolean;
  backHref: string;
  onAddCredit: () => void;
  onManualAdjustment: () => void;
  onRefund: () => void;
  onToggleActive: () => void;
  actionLoading: boolean;
}

export const WalletDetailsPage = ({
  wallet,
  loading,
  backHref,
  onAddCredit,
  onManualAdjustment,
  onRefund,
  onToggleActive,
  actionLoading,
}: WalletDetailsPageProps) => {
  const intl = useIntl();

  if (!wallet && !loading) {
    return (
      <Box padding={4}>
        <Text size={5} fontWeight="bold">
          {intl.formatMessage({
            id: "s9kCG7",
            defaultMessage: "Wallet not found",
          })}
        </Text>
      </Box>
    );
  }

  return (
    <DetailPageLayout>
      <TopNav
        href={backHref}
        title={
          wallet
            ? `${wallet.user.firstName} ${wallet.user.lastName} - ${wallet.currency} Wallet`
            : intl.formatMessage({
                id: "WvEoWE",
                defaultMessage: "Wallet Details",
              })
        }
      >
        <WalletActionGroup
          wallet={wallet}
          disabled={loading || actionLoading}
          onAddCredit={onAddCredit}
          onManualAdjustment={onManualAdjustment}
          onRefund={onRefund}
          onToggleActive={onToggleActive}
        />
      </TopNav>
      <DetailPageLayout.Content>
        <Backlink href={backHref}>{intl.formatMessage(sectionNames.wallets)}</Backlink>
        <WalletStats wallet={wallet} loading={loading} />
        <Box paddingTop={6}>
          <WalletEntries wallet={wallet} loading={loading} />
        </Box>
        <Box paddingTop={6}>
          <WalletEvents wallet={wallet} loading={loading} />
        </Box>
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar>
        <WalletInfo wallet={wallet} loading={loading} />
        {wallet && (
          <Box paddingTop={6}>
            <Metadata data={wallet} />
          </Box>
        )}
      </DetailPageLayout.RightSidebar>
    </DetailPageLayout>
  );
};
