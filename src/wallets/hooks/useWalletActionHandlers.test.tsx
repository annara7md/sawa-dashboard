import { useMutation } from "@apollo/client";
import { act, renderHook } from "@testing-library/react-hooks";
import { IntlProvider } from "react-intl";

import { useWalletActionHandlers } from "./useWalletActionHandlers";

const notifyMock = jest.fn();

jest.mock("@apollo/client", () => ({
  gql: jest.fn((strings: TemplateStringsArray) => strings[0]),
  useMutation: jest.fn(),
}));

jest.mock("@dashboard/hooks/useNotifier", () => ({
  useNotifier: () => notifyMock,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={{}}>
    {children}
  </IntlProvider>
);

describe("useWalletActionHandlers", () => {
  const wallet = {
    id: "wallet-1",
    currency: "USD",
    isActive: true,
  };

  beforeEach(() => {
    notifyMock.mockReset();
    jest.clearAllMocks();
  });

  it("credits the selected wallet and notifies on success", async () => {
    const creditWallet = jest.fn().mockResolvedValue({
      data: {
        walletCredit: {
          walletErrors: [],
        },
      },
    });
    const onComplete = jest.fn();

    (useMutation as jest.Mock)
      .mockReturnValueOnce([creditWallet, { loading: false }])
      .mockReturnValueOnce([jest.fn(), { loading: false }])
      .mockReturnValueOnce([jest.fn(), { loading: false }])
      .mockReturnValueOnce([jest.fn(), { loading: false }]);

    const promptSpy = jest
      .spyOn(window, "prompt")
      .mockReturnValueOnce("25")
      .mockReturnValueOnce("Top up")
      .mockReturnValueOnce("admin note");

    const { result } = renderHook(
      () =>
        useWalletActionHandlers({
          wallet,
          onComplete,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.handleAddCredit();
    });

    expect(creditWallet).toHaveBeenCalledWith({
      variables: {
        walletId: "wallet-1",
        amount: "25.00",
        reason: "Top up",
        note: "admin note",
      },
    });
    expect(onComplete).toHaveBeenCalled();
    expect(notifyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
      }),
    );

    promptSpy.mockRestore();
  });

  it("toggles wallet activity and notifies on success", async () => {
    const setWalletActive = jest.fn().mockResolvedValue({
      data: {
        walletSetActive: {
          walletErrors: [],
        },
      },
    });
    const onComplete = jest.fn();

    (useMutation as jest.Mock)
      .mockReturnValueOnce([jest.fn(), { loading: false }])
      .mockReturnValueOnce([jest.fn(), { loading: false }])
      .mockReturnValueOnce([jest.fn(), { loading: false }])
      .mockReturnValueOnce([setWalletActive, { loading: false }]);

    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);

    const { result } = renderHook(
      () =>
        useWalletActionHandlers({
          wallet,
          onComplete,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.handleToggleActive();
    });

    expect(setWalletActive).toHaveBeenCalledWith({
      variables: {
        walletId: "wallet-1",
        isActive: false,
      },
    });
    expect(onComplete).toHaveBeenCalled();
    expect(notifyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
      }),
    );

    confirmSpy.mockRestore();
  });
});
