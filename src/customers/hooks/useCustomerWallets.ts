import { useQuery } from "@apollo/client";
import { useMemo } from "react";

import { userWalletQuery } from "../../wallets/queries";

interface UseCustomerWalletsProps {
  userId: string;
  currencies?: string[];
}

export const useCustomerWallets = ({ userId, currencies = ["USD", "SAR"] }: UseCustomerWalletsProps) => {
  // For now, use mock data until GraphQL schema is updated
  const useMockData = true;

  // Mock wallets data for the customer
  const mockWallets = useMemo(() => [
    {
      id: `wallet_${userId}_USD`,
      user: {
        id: userId,
        email: "customer@example.com",
        firstName: "John",
        lastName: "Doe",
      },
      currency: "USD",
      currentBalance: { amount: 150.0, currency: "USD" },
      reservedBalance: { amount: 25.0, currency: "USD" },
      spendableBalance: { amount: 125.0, currency: "USD" },
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      lastTransaction: "2024-01-15T10:00:00Z",
    },
    {
      id: `wallet_${userId}_SAR`,
      user: {
        id: userId,
        email: "customer@example.com", 
        firstName: "John",
        lastName: "Doe",
      },
      currency: "SAR",
      currentBalance: { amount: 500.0, currency: "SAR" },
      reservedBalance: { amount: 0.0, currency: "SAR" },
      spendableBalance: { amount: 500.0, currency: "SAR" },
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-14T15:30:00Z",
      lastTransaction: "2024-01-14T15:30:00Z",
    },
  ], [userId]);

  // GraphQL queries for each currency (when ready)
  const walletQueries = currencies.map(currency => 
    useQuery(userWalletQuery, {
      variables: { userId, currency },
      skip: useMockData,
      errorPolicy: "all",
    })
  );

  const wallets = useMemo(() => {
    if (useMockData) {
      return mockWallets.filter(wallet => 
        currencies.includes(wallet.currency)
      );
    }

    // Combine results from all currency queries
    return walletQueries
      .map(query => query.data?.user?.wallet)
      .filter(Boolean);
  }, [useMockData, mockWallets, currencies, walletQueries]);

  const loading = useMockData ? false : walletQueries.some(query => query.loading);
  const error = useMockData ? null : walletQueries.find(query => query.error)?.error;

  const refetch = () => {
    if (!useMockData) {
      walletQueries.forEach(query => query.refetch());
    }
  };

  return {
    wallets,
    loading,
    error,
    refetch,
  };
};