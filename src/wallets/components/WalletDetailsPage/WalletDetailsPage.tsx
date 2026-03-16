import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { sectionNames } from "@dashboard/intl";
import { type ConfirmButtonTransitionState } from "@saleor/macaw-ui-next";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type Wallet } from "../../types";
import { WalletInfo } from "../WalletInfo/WalletInfo";
import { WalletStats } from "../WalletStats/WalletStats";
import { WalletEntries } from "../WalletEntries/WalletEntries";
import { WalletEvents } from "../WalletEvents/WalletEvents";

interface WalletDetailsPageProps {
  wallet: Wallet | undefined;
  loading: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  backHref: string;
  onBack: () => void;
  onSubmit: () => void;
  onManualAdjustment: () => void;
  onRefund: () => void;
}

export const WalletDetailsPage = ({
  wallet,
  loading,
  saveButtonBarState,
  backHref,
  onBack,
  onSubmit,
  onManualAdjustment,
  onRefund,
}: WalletDetailsPageProps) => {
  const intl = useIntl();

  if (!wallet && !loading) {
    return (
      <Box padding={4}>
        <Text size={5} fontWeight="bold">
          {intl.formatMessage({
            id: "wallet.notFound",
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
                id: "wallet.details.title",
                defaultMessage: "Wallet Details",
              })
        }
      />
      
      <DetailPageLayout.Content>
        <Box display="grid" __gridTemplateColumns="2fr 1fr" gap={6}>
          <Box display="flex" flexDirection="column" gap={6}>
            {/* Wallet Statistics */}
            <WalletStats wallet={wallet} loading={loading} />
            
            {/* Recent Entries */}
            <WalletEntries 
              wallet={wallet} 
              loading={loading}
              onManualAdjustment={onManualAdjustment}
              onRefund={onRefund}
            />
            
            {/* Recent Events */}
            <WalletEvents wallet={wallet} loading={loading} />
          </Box>
          
          <Box display="flex" flexDirection="column" gap={6}>
            {/* Wallet Information */}
            <WalletInfo wallet={wallet} loading={loading} />
            
            {/* Metadata */}
            {wallet && (
              <Metadata data={wallet} />
            )}
          </Box>
        </Box>
      </DetailPageLayout.Content>
      
      <Savebar
        state={saveButtonBarState}
        disabled={loading}
        onCancel={onBack}
        onSubmit={onSubmit}
        labels={{
          confirm: intl.formatMessage({
            id: "wallet.save",
            defaultMessage: "Save wallet",
          }),
          delete: intl.formatMessage({
            id: "wallet.delete",
            defaultMessage: "Delete wallet",
          }),
        }}
      />
    </DetailPageLayout>
  );
};
