import { gql } from "@apollo/client";

import {
  walletDetailsFragment,
  walletFragment,
  walletTopUpRequestFragment,
} from "./fragments";

// List all wallets (staff only)
export const walletListQuery = gql`
  query WalletList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: WalletFilterInput
    $sortBy: WalletSortingInput
  ) {
    wallets(
      first: $first
      after: $after
      last: $last
      before: $before
      filter: $filter
      sortBy: $sortBy
    ) {
      edges {
        node {
          ...Wallet
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${walletFragment}
`;

// Get single wallet details
export const walletDetailsQuery = gql`
  query WalletDetails($id: ID!) {
    wallet(id: $id) {
      ...WalletDetails
    }
  }
  ${walletDetailsFragment}
`;

// List all top-up requests
export const walletTopUpRequestListQuery = gql`
  query WalletTopUpRequestList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: WalletTopUpRequestFilterInput
    $sortBy: WalletTopUpRequestSortingInput
  ) {
    walletTopupRequests(
      first: $first
      after: $after
      last: $last
      before: $before
      filter: $filter
      sortBy: $sortBy
    ) {
      edges {
        node {
          ...WalletTopUpRequest
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${walletTopUpRequestFragment}
`;

// Get single top-up request details
export const walletTopUpRequestDetailsQuery = gql`
  query WalletTopUpRequestDetails($id: ID!) {
    walletTopupRequest(id: $id) {
      ...WalletTopUpRequest
      events {
        id
        date
        type
        user {
          id
          email
        }
        app {
          id
          name
        }
        parameters
      }
    }
  }
  ${walletTopUpRequestFragment}
`;

// Get user's wallet by currency
export const userWalletQuery = gql`
  query UserWallet($userId: ID!, $currency: String!) {
    user(id: $userId) {
      id
      wallet(currency: $currency) {
        ...WalletDetails
      }
    }
  }
  ${walletDetailsFragment}
`;
