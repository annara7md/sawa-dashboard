import { useQuery } from "@apollo/client";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { walletListQuery } from "../queries";
import { type Wallet, type WalletListFilters } from "../types";

interface UseWalletListProps {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
  filter?: WalletListFilters;
  sortBy?: any;
}

export const useWalletList = (variables: UseWalletListProps) => {
  const { data, loading, error, refetch } = useQuery(walletListQuery, {
    variables,
    errorPolicy: "all",
  });
  const wallets = mapEdgesToItems(data?.wallets) as Wallet[] | undefined;

  return {
    wallets,
    loading,
    error,
    refetch,
    pageInfo: data?.wallets?.pageInfo,
    totalCount: data?.wallets?.totalCount,
  };
};
