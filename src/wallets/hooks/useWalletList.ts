import { useQuery } from "@apollo/client";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useMemo } from "react";

import { wallets as mockWallets } from "../fixtures";
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
  // For now, use mock data until GraphQL schema is updated
  const useMockData = true;

  const { data, loading, error, refetch } = useQuery(walletListQuery, {
    variables,
    errorPolicy: "all",
    skip: useMockData,
  });

  const wallets: Wallet[] | undefined = useMemo(() => {
    if (useMockData) {
      // Filter mock data based on query
      let filteredWallets = mockWallets;
      
      if (variables.filter?.query) {
        const query = variables.filter.query.toLowerCase();
        filteredWallets = filteredWallets.filter(
          wallet =>
            wallet.user.firstName.toLowerCase().includes(query) ||
            wallet.user.lastName.toLowerCase().includes(query) ||
            wallet.user.email.toLowerCase().includes(query) ||
            wallet.currency.toLowerCase().includes(query)
        );
      }

      if (variables.filter?.currency) {
        filteredWallets = filteredWallets.filter(
          wallet => wallet.currency === variables.filter?.currency
        );
      }

      if (variables.filter?.isActive !== undefined) {
        filteredWallets = filteredWallets.filter(
          wallet => wallet.isActive === variables.filter?.isActive
        );
      }

      return filteredWallets;
    }
    
    return mapEdgesToItems(data?.wallets);
  }, [data?.wallets, variables.filter, useMockData]);

  return {
    wallets,
    loading: useMockData ? false : loading,
    error: useMockData ? null : error,
    refetch,
    pageInfo: useMockData ? {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    } : data?.wallets?.pageInfo,
    totalCount: useMockData ? wallets?.length || 0 : data?.wallets?.totalCount,
  };
};