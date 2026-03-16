interface WalletFilterParams {
  query?: string;
  currency?: string;
  isActive?: string;
  userId?: string;
}

export const buildWalletListFilter = ({ currency, isActive, userId }: WalletFilterParams) => {
  const filter = {
    ...(currency ? { currency } : {}),
    ...(isActive === "true" ? { isActive: true } : {}),
    ...(isActive === "false" ? { isActive: false } : {}),
    ...(userId ? { user: [userId] } : {}),
  };

  return Object.keys(filter).length > 0 ? filter : undefined;
};

export const buildWalletListSort = (_asc?: boolean) => undefined;
