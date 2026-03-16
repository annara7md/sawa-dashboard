// Wallet types for Dashboard

export interface Wallet {
  id: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  currency: string;
  currentBalance: {
    amount: number;
    currency: string;
  };
  reservedBalance: {
    amount: number;
    currency: string;
  };
  spendableBalance: {
    amount: number;
    currency: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  entries?: WalletEntry[];
  events?: WalletEvent[];
}

export interface WalletEntry {
  id: string;
  wallet: Wallet;
  entryType: WalletEntryType;
  amount: {
    amount: number;
    currency: string;
  };
  balanceAfter: {
    amount: number;
    currency: string;
  };
  reservedAfter: {
    amount: number;
    currency: string;
  };
  createdByUser?: {
    id: string;
    email: string;
  };
  createdByApp?: {
    id: string;
    name: string;
  };
  order?: {
    id: string;
    number: string;
  };
  checkout?: {
    id: string;
  };
  topupRequest?: WalletTopUpRequest;
  reason: string;
  note: string;
  createdAt: string;
}

export enum WalletEntryType {
  CREDIT = "credit",
  DEBIT = "debit",
  RESERVE = "reserve",
  RELEASE = "release",
  REFUND = "refund",
  ADJUSTMENT = "adjustment",
}

export interface WalletTopUpRequest {
  id: string;
  wallet: Wallet;
  status: WalletTopUpStatus;
  amount: {
    amount: number;
    currency: string;
  };
  bankReference: string;
  transferReference: string;
  customerNote: string;
  reviewedBy?: {
    id: string;
    email: string;
  };
  reviewedByApp?: {
    id: string;
    name: string;
  };
  reviewedAt?: string;
  staffNote: string;
  rejectionReason: string;
  createdAt: string;
  updatedAt: string;
}

export enum WalletTopUpStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface WalletEvent {
  id: string;
  date: string;
  type: WalletEventType;
  user?: {
    id: string;
    email: string;
  };
  app?: {
    id: string;
    name: string;
  };
  wallet: Wallet;
  order?: {
    id: string;
    number: string;
  };
  checkout?: {
    id: string;
  };
  topupRequest?: WalletTopUpRequest;
  parameters: Record<string, any>;
}

export enum WalletEventType {
  CREDITED = "CREDITED",
  DEBITED = "DEBITED",
  RESERVED = "RESERVED",
  RESERVATION_RELEASED = "RESERVATION_RELEASED",
  REFUNDED = "REFUNDED",
  TOPUP_REQUESTED = "TOPUP_REQUESTED",
  TOPUP_APPROVED = "TOPUP_APPROVED",
  TOPUP_REJECTED = "TOPUP_REJECTED",
  MANUAL_ADJUSTMENT = "MANUAL_ADJUSTMENT",
  NOTE_ADDED = "NOTE_ADDED",
}

// Filter types
export interface WalletListFilters {
  query?: string;
  currency?: string;
  isActive?: boolean;
  userId?: string;
}

export interface WalletTopUpRequestListFilters {
  query?: string;
  status?: WalletTopUpStatus;
  walletId?: string;
}

// Sort types
export enum WalletSortField {
  CREATED_AT = "CREATED_AT",
  UPDATED_AT = "UPDATED_AT",
  CURRENT_BALANCE = "CURRENT_BALANCE",
  CURRENCY = "CURRENCY",
}

export enum WalletTopUpRequestSortField {
  CREATED_AT = "CREATED_AT",
  UPDATED_AT = "UPDATED_AT",
  AMOUNT = "AMOUNT",
  STATUS = "STATUS",
}

// Mutation input types
export interface WalletTopUpApproveInput {
  id: string;
  staffNote?: string;
}

export interface WalletTopUpRejectInput {
  id: string;
  rejectionReason: string;
  staffNote?: string;
}

export interface WalletManualAdjustmentInput {
  walletId: string;
  amount: string;
  reason: string;
  note?: string;
}

export interface WalletRefundInput {
  orderId: string;
  amount: string;
  reason?: string;
}

export interface WalletOrderRefundInput {
  orderId: string;
  amount: string;
  reason?: string;
}
