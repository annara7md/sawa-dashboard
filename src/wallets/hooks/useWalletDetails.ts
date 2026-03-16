import { useQuery } from "@apollo/client";

import { walletDetailsQuery } from "../queries";
import { type Wallet } from "../types";

interface UseWalletDetailsProps {
  id: string;
}

export const useWalletDetails = ({ id }: UseWalletDetailsProps) => {
  const { data, loading, error, refetch } = useQuery(walletDetailsQuery, {
    variables: { id },
    errorPolicy: "all",
  });

  return {
    wallet: data?.wallet as Wallet | undefined,
    loading,
    error,
    refetch,
  };
};
