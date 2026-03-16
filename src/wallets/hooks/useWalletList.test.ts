import { ApolloError } from "@apollo/client";
import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { GraphQLError } from "graphql";

import { useWalletList } from "./useWalletList";

const mockUseQuery = jest.fn();
const mockMapEdgesToItems = jest.fn();

jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
}));

jest.mock("@dashboard/utils/maps", () => ({
  mapEdgesToItems: (...args: unknown[]) => mockMapEdgesToItems(...args),
}));

describe("useWalletList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMapEdgesToItems.mockReturnValue(undefined);
  });

  it("surfaces GraphQL errors reported through onError", async () => {
    const error = new ApolloError({
      graphQLErrors: [new GraphQLError("HANDLE_PAYMENTS permission is required")],
    });

    mockUseQuery.mockImplementation((_query, options = {}) => {
      queueMicrotask(() => {
        options.onError?.(error);
      });

      return {
        data: undefined,
        error: undefined,
        loading: false,
        refetch: jest.fn(),
      };
    });

    const { result } = renderHook(() => useWalletList({}));

    await waitFor(() => {
      expect(result.current.error).toBe(error);
    });
  });

  it("surfaces GraphQL errors returned by a follow-up client query when the watched result is null", async () => {
    const clientQuery = jest.fn().mockResolvedValue({
      data: {
        wallets: null,
      },
      errors: [new GraphQLError("To access this path, you need HANDLE_PAYMENTS")],
    });

    mockUseQuery.mockReturnValue({
      data: {
        wallets: null,
      },
      error: undefined,
      client: {
        query: clientQuery,
      },
      loading: false,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useWalletList({}));

    await waitFor(() => {
      expect(result.current.error?.message).toContain("HANDLE_PAYMENTS");
    });
  });
});
