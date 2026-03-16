import { type Wallet, type WalletTopUpRequest, WalletTopUpStatus } from "./types";

export const wallet: Wallet = {
  id: "V2FsbGV0OjE=",
  user: {
    id: "VXNlcjox",
    email: "customer@example.com",
    firstName: "John",
    lastName: "Doe",
  },
  currency: "USD",
  currentBalance: {
    amount: 100.0,
    currency: "USD",
  },
  reservedBalance: {
    amount: 20.0,
    currency: "USD",
  },
  spendableBalance: {
    amount: 80.0,
    currency: "USD",
  },
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-15T00:00:00Z",
};

export const wallets: Wallet[] = [
  wallet,
  {
    ...wallet,
    id: "V2FsbGV0OjI=",
    user: {
      id: "VXNlcjoy",
      email: "customer2@example.com",
      firstName: "Jane",
      lastName: "Smith",
    },
    currency: "EUR",
    currentBalance: {
      amount: 250.0,
      currency: "EUR",
    },
    reservedBalance: {
      amount: 0.0,
      currency: "EUR",
    },
    spendableBalance: {
      amount: 250.0,
      currency: "EUR",
    },
  },
];

export const walletTopUpRequest: WalletTopUpRequest = {
  id: "V2FsbGV0VG9wVXBSZXF1ZXN0OjE=",
  wallet,
  status: WalletTopUpStatus.PENDING,
  amount: {
    amount: 100.0,
    currency: "USD",
  },
  bankReference: "TXN123456",
  transferReference: "",
  customerNote: "Bank transfer from my account",
  staffNote: "",
  rejectionReason: "",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
};

export const walletTopUpRequests: WalletTopUpRequest[] = [
  walletTopUpRequest,
  {
    ...walletTopUpRequest,
    id: "V2FsbGV0VG9wVXBSZXF1ZXN0OjI=",
    status: WalletTopUpStatus.APPROVED,
    amount: {
      amount: 50.0,
      currency: "USD",
    },
    bankReference: "TXN789012",
    reviewedBy: {
      id: "VXNlcjoz",
      email: "staff@example.com",
      firstName: "Admin",
      lastName: "User",
    },
    reviewedAt: "2024-01-14T15:30:00Z",
    staffNote: "Verified bank transfer",
    createdAt: "2024-01-14T14:00:00Z",
    updatedAt: "2024-01-14T15:30:00Z",
  },
  {
    ...walletTopUpRequest,
    id: "V2FsbGV0VG9wVXBSZXF1ZXN0OjM=",
    status: WalletTopUpStatus.REJECTED,
    amount: {
      amount: 200.0,
      currency: "USD",
    },
    bankReference: "TXN345678",
    reviewedBy: {
      id: "VXNlcjoz",
      email: "staff@example.com",
      firstName: "Admin",
      lastName: "User",
    },
    reviewedAt: "2024-01-13T12:00:00Z",
    staffNote: "Internal note",
    rejectionReason: "Bank reference not found",
    createdAt: "2024-01-13T10:00:00Z",
    updatedAt: "2024-01-13T12:00:00Z",
  },
];
