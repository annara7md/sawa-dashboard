import { createContext, type ReactNode } from "react";

import { type Wallet } from "../types";

export interface WalletDetailsContextType {
  wallet: Wallet | undefined;
  loading: boolean;
  refetch: () => void;
}

export const WalletDetailsContext = createContext<WalletDetailsContextType | undefined>(undefined);

interface WalletDetailsProviderProps {
  children: ReactNode;
  wallet: Wallet | undefined;
  loading: boolean;
  refetch: () => void;
}

export const WalletDetailsProvider = ({
  children,
  wallet,
  loading,
  refetch,
}: WalletDetailsProviderProps) => {
  const value: WalletDetailsContextType = {
    wallet,
    loading,
    refetch,
  };

  return (
    <WalletDetailsContext.Provider value={value}>
      {children}
    </WalletDetailsContext.Provider>
  );
};