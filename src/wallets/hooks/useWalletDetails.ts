import { useQuery } from "@apollo/client";
import { useMemo } from "react";

import { wallet as mockWallet } from "../fixtures";
import { walletDetailsQuery } from "../queries";
import { type Wallet } from "../types";

interface UseWalletDetailsProps {
  id: string;
}

export const useWalletDetails = ({ id }: UseWalletDetailsProps) => {
  // For now, use mock data until GraphQL schema is updated
  const useMockData = true;

  const { data, loading, error, refetch } = useQuery(walletDetailsQuery, {
    variables: { id },
    errorPolicy: "all",
    skip: useMockData,
  });

  const wallet: Wallet | undefined = useMemo(() => {
    if (useMockData) {
      // Return mock wallet if ID matches, otherwise undefined
      return mockWallet.id === id ? mockWallet : undefined;
    }
    
    return data?.wallet;
  }, [data?.wallet, id, useMockData]);

  return {
    wallet,
    loading: useMockData ? false : loading,
    error: useMockData ? null : error,
    refetch,
  };
};