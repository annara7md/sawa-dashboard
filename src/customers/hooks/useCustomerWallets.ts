import { useQuery } from "@apollo/client";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { walletListQuery } from "../../wallets/queries";
import { type Wallet } from "../../wallets/types";

interface UseCustomerWalletsProps {
  userId: string;
}

export const useCustomerWallets = ({ userId }: UseCustomerWalletsProps) => {
  const { data, loading, error, refetch } = useQuery(walletListQuery, {
    variables: {
      first: 20,
      filter: {
        userId,
      },
      sortBy: {
        field: "CREATED_AT",
        direction: "DESC",
      },
    },
    errorPolicy: "all",
    skip: !userId,
  });

  return {
    wallets: (mapEdgesToItems(data?.wallets) as Wallet[] | undefined) ?? [],
    loading,
    error,
    refetch,
  };
};
