import {
  parseWalletListSortParams,
  parseWalletTopUpRequestListSortParams,
} from "@dashboard/wallets";

describe("wallet sort params parsing", () => {
  it("falls back to createdAt sort when wallet list sort is invalid", () => {
    const params = parseWalletListSortParams({
      asc: "true",
      sort: "name",
    });

    expect(params.sort).toBe("createdAt");
    expect(params.asc).toBe(false);
  });

  it("falls back to createdAt sort when top-up request sort is invalid", () => {
    const params = parseWalletTopUpRequestListSortParams({
      asc: "true",
      sort: "name",
    });

    expect(params.sort).toBe("createdAt");
    expect(params.asc).toBe(false);
  });
});
