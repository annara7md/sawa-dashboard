import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import {
  type ActiveTab,
  type BulkAction,
  type Dialog,
  type Filters,
  type Pagination,
  type SingleAction,
  type Sort,
  type TabActionDialog,
} from "../types";

const walletSection = "/wallets/";

// Wallet List
export const walletListPath = walletSection;

export enum WalletListUrlFiltersEnum {
  query = "query",
  currency = "currency",
  isActive = "isActive",
  userId = "userId",
}

export type WalletListUrlFilters = Filters<WalletListUrlFiltersEnum>;
export type WalletListUrlDialog = "remove" | TabActionDialog;

export enum WalletListUrlSortField {
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  currentBalance = "currentBalance",
  currency = "currency",
}

type WalletListUrlSort = Sort<WalletListUrlSortField>;

export type WalletListUrlQueryParams = ActiveTab &
  BulkAction &
  WalletListUrlFilters &
  WalletListUrlSort &
  Dialog<WalletListUrlDialog> &
  Pagination;

export const walletListUrl = (params?: WalletListUrlQueryParams) =>
  walletListPath + "?" + stringifyQs(params);

// Wallet Details
export const walletPath = (id: string) => urlJoin(walletSection, id);

type WalletUrlDialog = "adjust" | "refund" | "remove";

export type WalletUrlQueryParams = Dialog<WalletUrlDialog>;

export const walletUrl = (id: string, params?: WalletUrlQueryParams) =>
  walletPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

// Wallet Top-Up Requests
export const walletTopUpRequestListPath = urlJoin(walletSection, "topup-requests");

export enum WalletTopUpRequestListUrlFiltersEnum {
  query = "query",
  status = "status",
  walletId = "walletId",
}

export type WalletTopUpRequestListUrlFilters = Filters<WalletTopUpRequestListUrlFiltersEnum>;
export type WalletTopUpRequestListUrlDialog = "approve" | "reject" | TabActionDialog;

export enum WalletTopUpRequestListUrlSortField {
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  amount = "amount",
  status = "status",
}

type WalletTopUpRequestListUrlSort = Sort<WalletTopUpRequestListUrlSortField>;

export type WalletTopUpRequestListUrlQueryParams = ActiveTab &
  BulkAction &
  WalletTopUpRequestListUrlFilters &
  WalletTopUpRequestListUrlSort &
  Dialog<WalletTopUpRequestListUrlDialog> &
  Pagination &
  SingleAction;

export const walletTopUpRequestListUrl = (params?: WalletTopUpRequestListUrlQueryParams) =>
  walletTopUpRequestListPath + "?" + stringifyQs(params);

// Wallet Top-Up Request Details
export const walletTopUpRequestPath = (id: string) =>
  urlJoin(walletSection, "topup-requests", id);

type WalletTopUpRequestUrlDialog = "approve" | "reject";

export type WalletTopUpRequestUrlQueryParams = Dialog<WalletTopUpRequestUrlDialog>;

export const walletTopUpRequestUrl = (id: string, params?: WalletTopUpRequestUrlQueryParams) =>
  walletTopUpRequestPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
