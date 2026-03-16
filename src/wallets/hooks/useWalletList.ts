import { ApolloError, useQuery } from "@apollo/client";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { type GraphQLError } from "graphql";
import { useEffect, useMemo, useState } from "react";

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
  const [handledError, setHandledError] = useState<ApolloError | undefined>();
  const queryKey = useMemo(() => JSON.stringify(variables), [variables]);
  const queryResult = useQuery(walletListQuery, {
    variables,
    errorPolicy: "all",
    onError: setHandledError,
  });
  const { client, data, loading, error, refetch } = queryResult;
  const queryErrors = (queryResult as typeof queryResult & { errors?: readonly GraphQLError[] })
    .errors;
  const derivedError = useMemo(() => {
    if (!queryErrors || queryErrors.length === 0) {
      return undefined;
    }

    return new ApolloError({
      graphQLErrors: [...queryErrors],
    });
  }, [queryErrors]);
  const wallets = mapEdgesToItems(data?.wallets) as Wallet[] | undefined;

  useEffect(() => {
    setHandledError(undefined);
  }, [queryKey]);

  useEffect(() => {
    if (data?.wallets) {
      setHandledError(undefined);
    }
  }, [data]);

  useEffect(() => {
    let isSubscribed = true;

    if (!loading && data?.wallets === null && !error && !handledError) {
      void client
        .query({
          query: walletListQuery,
          variables,
          fetchPolicy: "network-only",
          errorPolicy: "all",
        })
        .then(result => {
          if (!isSubscribed) {
            return;
          }

          if (result.error) {
            setHandledError(result.error);

            return;
          }

          if (result.errors?.length) {
            setHandledError(
              new ApolloError({
                graphQLErrors: [...result.errors],
              }),
            );
          }
        })
        .catch(fetchError => {
          if (!isSubscribed) {
            return;
          }

          setHandledError(
            fetchError instanceof ApolloError
              ? fetchError
              : new ApolloError({
                  networkError:
                    fetchError instanceof Error ? fetchError : new Error("Failed to load wallets."),
                }),
          );
        });
    }

    return () => {
      isSubscribed = false;
    };
  }, [client, data?.wallets, error, handledError, loading, variables]);

  return {
    wallets,
    loading,
    error: error ?? handledError ?? derivedError,
    refetch,
    pageInfo: data?.wallets?.pageInfo,
    totalCount: data?.wallets?.totalCount,
  };
};
