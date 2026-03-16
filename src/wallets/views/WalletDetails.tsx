import { WindowTitle } from "@dashboard/components/WindowTitle";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { sectionNames } from "@dashboard/intl";
import { type ConfirmButtonTransitionState } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

import { WalletDetailsPage } from "../components/WalletDetailsPage";
import { useWalletDetails } from "../hooks/useWalletDetails";
import { WalletDetailsProvider } from "../providers/WalletDetailsProvider";
import { type WalletUrlQueryParams, walletListUrl } from "../urls";

interface WalletDetailsProps {
  id: string;
  params: WalletUrlQueryParams;
}

const WalletDetails = ({ id, params }: WalletDetailsProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();
  
  const [saveButtonBarState, setSaveButtonBarState] = useState<ConfirmButtonTransitionState>("default");
  
  const { wallet, loading, refetch } = useWalletDetails({ id });

  const handleBack = () => {
    navigate(walletListUrl());
  };

  const handleSubmit = async () => {
    setSaveButtonBarState("loading");
    
    try {
      // TODO: Implement wallet update mutation
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "wallet.updated",
          defaultMessage: "Wallet updated successfully",
        }),
      });
      setSaveButtonBarState("success");
    } catch (error) {
      notify({
        status: "error",
        text: intl.formatMessage({
          id: "wallet.updateError",
          defaultMessage: "Failed to update wallet",
        }),
      });
      setSaveButtonBarState("error");
    }
  };

  const handleManualAdjustment = () => {
    // TODO: Open manual adjustment dialog
    console.log("Manual adjustment dialog");
  };

  const handleRefund = () => {
    // TODO: Open refund dialog
    console.log("Refund dialog");
  };

  return (
    <WalletDetailsProvider wallet={wallet} loading={loading} refetch={refetch}>
      <WindowTitle title={intl.formatMessage(sectionNames.wallets)} />
      <WalletDetailsPage
        wallet={wallet}
        loading={loading}
        saveButtonBarState={saveButtonBarState}
        backHref={walletListUrl()}
        onBack={handleBack}
        onSubmit={handleSubmit}
        onManualAdjustment={handleManualAdjustment}
        onRefund={handleRefund}
      />
    </WalletDetailsProvider>
  );
};

export default WalletDetails;
