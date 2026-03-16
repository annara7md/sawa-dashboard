import { buildWalletListFilter, buildWalletListSort } from "./queryVariables";

describe("wallet query variables", () => {
  it("maps dashboard filters to the supported wallet GraphQL filter input", () => {
    expect(
      buildWalletListFilter({
        query: "customer@example.com",
        currency: "USD",
        isActive: "true",
        userId: "VXNlcjox",
      }),
    ).toEqual({
      currency: "USD",
      isActive: true,
      user: ["VXNlcjox"],
    });
  });

  it("omits unsupported values from the wallet GraphQL filter input", () => {
    expect(
      buildWalletListFilter({
        query: "ignored",
        currency: undefined,
        isActive: undefined,
        userId: "",
      }),
    ).toBeUndefined();
  });

  it("omits wallet sorting input until the backend exposes a supported wallet sort field", () => {
    expect(buildWalletListSort(true)).toBeUndefined();
    expect(buildWalletListSort(false)).toBeUndefined();
  });
});
