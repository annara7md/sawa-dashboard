import { WalletDetailsContext } from "@dashboard/wallets/providers/WalletDetailsProvider";
import { useContext } from "react";

export const useWalletDetailsContext = () => {
  const walletDetails = useContext(WalletDetailsContext);

  if (!walletDetails) {
    throw new Error("useWalletDetailsContext must be used within WalletDetailsProvider");
  }

  return walletDetails;
};