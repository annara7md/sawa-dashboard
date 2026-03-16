import { WindowTitle } from "@dashboard/components/WindowTitle";
import { sectionNames } from "@dashboard/intl";
import { useIntl } from "react-intl";

import { WalletDetailsPage } from "../components/WalletDetailsPage";
import { useWalletActionHandlers } from "../hooks/useWalletActionHandlers";
import { useWalletDetails } from "../hooks/useWalletDetails";
import { WalletDetailsProvider } from "../providers/WalletDetailsProvider";
import { walletListUrl, type WalletUrlQueryParams } from "../urls";

interface WalletDetailsProps {
  id: string;
  params: WalletUrlQueryParams;
}

const WalletDetails = ({ id, params: _params }: WalletDetailsProps) => {
  const intl = useIntl();
  const { wallet, loading, refetch } = useWalletDetails({ id });
  const {
    handleAddCredit,
    handleManualAdjustment,
    handleRefund,
    handleToggleActive,
    loading: walletActionLoading,
  } = useWalletActionHandlers({
    wallet,
    onComplete: refetch,
  });

  return (
    <WalletDetailsProvider wallet={wallet} loading={loading} refetch={refetch}>
      <WindowTitle title={intl.formatMessage(sectionNames.wallets)} />
      <WalletDetailsPage
        wallet={wallet}
        loading={loading}
        backHref={walletListUrl()}
        onAddCredit={handleAddCredit}
        onManualAdjustment={handleManualAdjustment}
        onRefund={handleRefund}
        onToggleActive={handleToggleActive}
        actionLoading={walletActionLoading}
      />
    </WalletDetailsProvider>
  );
};

export default WalletDetails;
