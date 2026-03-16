import { gql } from "@apollo/client";

// Basic wallet fragment
export const walletFragment = gql`
  fragment Wallet on Wallet {
    id
    user {
      id
      email
      firstName
      lastName
    }
    currency
    currentBalance {
      amount
      currency
    }
    reservedBalance {
      amount
      currency
    }
    spendableBalance {
      amount
      currency
    }
    isActive
    createdAt
    updatedAt
  }
`;

// Detailed wallet fragment with entries and events
export const walletDetailsFragment = gql`
  fragment WalletDetails on Wallet {
    ...Wallet
    entries(first: 20) {
      edges {
        node {
          id
          entryType
          amount {
            amount
            currency
          }
          balanceAfter {
            amount
            currency
          }
          reservedAfter {
            amount
            currency
          }
          createdByUser {
            id
            email
          }
          createdByApp {
            id
            name
          }
          order {
            id
            number
          }
          checkout {
            id
          }
          reason
          note
          createdAt
        }
      }
      totalCount
    }
    events(first: 20) {
      edges {
        node {
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
          order {
            id
            number
          }
          checkout {
            id
          }
          parameters
        }
      }
      totalCount
    }
  }
  ${walletFragment}
`;

// Wallet top-up request fragment
export const walletTopUpRequestFragment = gql`
  fragment WalletTopUpRequest on WalletTopUpRequest {
    id
    wallet {
      ...Wallet
    }
    status
    amount {
      amount
      currency
    }
    bankReference
    transferReference
    customerNote
    reviewedBy {
      id
      email
    }
    reviewedByApp {
      id
      name
    }
    reviewedAt
    staffNote
    rejectionReason
    createdAt
    updatedAt
  }
  ${walletFragment}
`;

// Wallet entry fragment
export const walletEntryFragment = gql`
  fragment WalletEntry on WalletEntry {
    id
    wallet {
      id
      currency
    }
    entryType
    amount {
      amount
      currency
    }
    balanceAfter {
      amount
      currency
    }
    reservedAfter {
      amount
      currency
    }
    createdByUser {
      id
      email
    }
    createdByApp {
      id
      name
    }
    order {
      id
      number
    }
    checkout {
      id
    }
    topupRequest {
      id
      status
    }
    reason
    note
    createdAt
  }
`;

// Wallet event fragment
export const walletEventFragment = gql`
  fragment WalletEvent on WalletEvent {
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
    wallet {
      id
      currency
    }
    order {
      id
      number
    }
    checkout {
      id
    }
    topupRequest {
      id
      status
    }
    parameters
  }
`;