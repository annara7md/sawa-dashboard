import { gql } from "@apollo/client";

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
    balance {
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
    }
    isActive
    createdAt
    updatedAt
  }
`;

export const walletEntryFragment = gql`
  fragment WalletEntry on WalletEntry {
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
`;

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
      firstName
      lastName
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
    order {
      id
      number
    }
    checkout {
      id
    }
    parameters
  }
`;

export const walletDetailsFragment = gql`
  fragment WalletDetails on Wallet {
    ...Wallet
    entries {
      ...WalletEntry
    }
    events {
      ...WalletEvent
    }
  }
  ${walletFragment}
  ${walletEntryFragment}
  ${walletEventFragment}
`;
