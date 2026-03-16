import { gql } from "@apollo/client";

import { walletFragment, walletTopUpRequestFragment } from "./fragments";

// Approve top-up request
export const walletTopUpApproveMutation = gql`
  mutation WalletTopUpApprove($id: ID!, $staffNote: String) {
    walletTopUpApprove(id: $id, staffNote: $staffNote) {
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
    walletTopUpReject(id: $id, rejectionReason: $rejectionReason, staffNote: $staffNote) {
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
  mutation WalletManualAdjustment($walletId: ID!, $amount: Decimal!, $reason: String!, $note: String) {
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

// Refund to wallet
export const walletRefundMutation = gql`
  mutation WalletRefund($orderId: ID!, $amount: PositiveDecimal!, $reason: String) {
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
        walletAmount
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
        walletAmount
      }
      walletErrors {
        field
        message
        code
      }
    }
  }
`;
