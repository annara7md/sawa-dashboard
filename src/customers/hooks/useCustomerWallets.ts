import { ApolloError, useQuery } from "@apollo/client";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { type GraphQLError } from "graphql";
import { useEffect, useMemo, useState } from "react";

import { walletListQuery } from "../../wallets/queries";
import { buildWalletListFilter, buildWalletListSort } from "../../wallets/queryVariables";
import { type Wallet } from "../../wallets/types";

interface UseCustomerWalletsProps {
  userId: string;
}

export const useCustomerWallets = ({ userId }: UseCustomerWalletsProps) => {
  const [handledError, setHandledError] = useState<ApolloError | undefined>();
  const queryResult = useQuery(walletListQuery, {
    variables: {
      first: 20,
      filter: buildWalletListFilter({ userId }),
      sortBy: buildWalletListSort(false),
    },
    errorPolicy: "all",
    onError: setHandledError,
    skip: !userId,
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

  useEffect(() => {
    setHandledError(undefined);
  }, [userId]);

  useEffect(() => {
    if (data?.wallets) {
      setHandledError(undefined);
    }
  }, [data]);

  useEffect(() => {
    let isSubscribed = true;

    if (!loading && data?.wallets === null && !error && !handledError && userId) {
      void client
        .query({
          query: walletListQuery,
          variables: {
            first: 20,
            filter: buildWalletListFilter({ userId }),
            sortBy: buildWalletListSort(false),
          },
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
                    fetchError instanceof Error
                      ? fetchError
                      : new Error("Failed to load customer wallets."),
                }),
          );
        });
    }

    return () => {
      isSubscribed = false;
    };
  }, [client, data?.wallets, error, handledError, loading, userId]);

  return {
    wallets: (mapEdgesToItems(data?.wallets) as Wallet[] | undefined) ?? [],
    loading,
    error: error ?? handledError ?? derivedError,
    refetch,
  };
};
