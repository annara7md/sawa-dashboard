import { WindowTitle } from "@dashboard/components/WindowTitle";
import { sectionNames } from "@dashboard/intl";
import { useIntl } from "react-intl";

import { type WalletUrlQueryParams } from "../urls";

interface WalletDetailsProps {
  id: string;
  params: WalletUrlQueryParams;
}

const WalletDetails = ({ id, params }: WalletDetailsProps) => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.wallets)} />
      <div>
        <h1>Wallet Details: {id}</h1>
        <p>Params: {JSON.stringify(params)}</p>
        <p>This is the wallet details page. Implementation coming soon...</p>
      </div>
    </>
  );
};

export default WalletDetails;