import { WindowTitle } from "@dashboard/components/WindowTitle";
import { sectionNames } from "@dashboard/intl";
import { useIntl } from "react-intl";

import { type WalletTopUpRequestListUrlQueryParams } from "../urls";

interface WalletTopUpRequestListProps {
  params: WalletTopUpRequestListUrlQueryParams;
}

const WalletTopUpRequestList = ({ params }: WalletTopUpRequestListProps) => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.wallets)} />
      <div>
        <h1>Wallet Top-Up Requests</h1>
        <p>Params: {JSON.stringify(params)}</p>
        <p>This is the wallet top-up requests page. Implementation coming soon...</p>
      </div>
    </>
  );
};

export default WalletTopUpRequestList;