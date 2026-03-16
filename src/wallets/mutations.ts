import { gql } from "@apollo/client";

import { walletFragment, walletTopUpRequestFragment } from "../fragments/wallets";

// Approve top-up request
export const walletTopUpApproveMutation = gql`
  mutation WalletTopUpApprove($id: ID!, $staffNote: String) {
    walletTopupApprove(id: $id, staffNote: $staffNote) {
      topupRequest {
        ...WalletTopUpRequest
      }
      walletErrors {
        field
        message
        code
      }
    }
  }
  ${walletTopUpRequestFragment}
`;

// Reject top-up request
export const walletTopUpRejectMutation = gql`
  mutation WalletTopUpReject($id: ID!, $rejectionReason: String!, $staffNote: String) {
    walletTopupReject(id: $id, rejectionReason: $rejectionReason, staffNote: $staffNote) {
      topupRequest {
        ...WalletTopUpRequest
      }
      walletErrors {
        field
        message
        code
      }
    }
  }
  ${walletTopUpRequestFragment}
`;

// Manual wallet adjustment (staff only)
export const walletManualAdjustmentMutation = gql`
  mutation WalletManualAdjustment(
    $walletId: ID!
    $amount: String!
    $reason: String!
    $note: String
  ) {
    walletManualAdjustment(walletId: $walletId, amount: $amount, reason: $reason, note: $note) {
      wallet {
        ...Wallet
      }
      walletErrors {
        field
        message
        code
      }
    }
  }
  ${walletFragment}
`;

export const walletCreditMutation = gql`
  mutation WalletCredit($walletId: ID!, $amount: String!, $reason: String!, $note: String) {
    walletCredit(walletId: $walletId, amount: $amount, reason: $reason, note: $note) {
      wallet {
        ...Wallet
      }
      walletErrors {
        field
        message
        code
      }
    }
  }
  ${walletFragment}
`;

export const walletSetActiveMutation = gql`
  mutation WalletSetActive($walletId: ID!, $isActive: Boolean!) {
    walletSetActive(walletId: $walletId, isActive: $isActive) {
      wallet {
        ...Wallet
      }
      walletErrors {
        field
        message
        code
      }
    }
  }
  ${walletFragment}
`;

export const walletRefundForWalletMutation = gql`
  mutation WalletRefundForWallet(
    $walletId: ID!
    $orderNumber: String!
    $amount: String!
    $reason: String
    $note: String
  ) {
    walletRefundForWallet(
      walletId: $walletId
      orderNumber: $orderNumber
      amount: $amount
      reason: $reason
      note: $note
    ) {
      wallet {
        ...Wallet
      }
      walletErrors {
        field
        message
        code
      }
    }
  }
  ${walletFragment}
`;

// Refund to wallet
export const walletRefundMutation = gql`
  mutation WalletRefund($orderId: ID!, $amount: String!, $reason: String) {
    walletRefund(orderId: $orderId, amount: $amount, reason: $reason) {
      wallet {
        ...Wallet
      }
      walletErrors {
        field
        message
        code
      }
    }
  }
  ${walletFragment}
`;

// Refund order amount to wallet
export const walletOrderRefundMutation = gql`
  mutation WalletOrderRefund($orderId: ID!, $amount: String!, $reason: String) {
    walletOrderRefund(orderId: $orderId, amount: $amount, reason: $reason) {
      order {
        id
        number
      }
      walletErrors {
        field
        message
        code
      }
    }
  }
`;

// Apply wallet to checkout
export const walletApplyToCheckoutMutation = gql`
  mutation WalletApplyToCheckout($checkoutId: ID!, $amount: String!) {
    walletApplyToCheckout(checkoutId: $checkoutId, amount: $amount) {
      checkout {
        id
        walletAmount {
          amount
          currency
        }
      }
      walletErrors {
        field
        message
        code
      }
    }
  }
`;

// Remove wallet from checkout
export const walletRemoveFromCheckoutMutation = gql`
  mutation WalletRemoveFromCheckout($checkoutId: ID!) {
    walletRemoveFromCheckout(checkoutId: $checkoutId) {
      checkout {
        id
        walletAmount {
          amount
          currency
        }
      }
      walletErrors {
        field
        message
        code
      }
    }
  }
`;
