import { useMutation } from "@apollo/client";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { useIntl } from "react-intl";

import {
  walletCreditMutation,
  walletManualAdjustmentMutation,
  walletRefundForWalletMutation,
  walletSetActiveMutation,
} from "../mutations";
import { type Wallet } from "../types";

interface UseWalletActionHandlersProps {
  wallet?: Pick<Wallet, "id" | "isActive" | "currency">;
  onComplete?: () => void | Promise<void>;
}

const parsePositiveAmount = (value: string) => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return amount.toFixed(2);
};

const parseSignedAmount = (value: string) => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount === 0) {
    return null;
  }

  return amount.toFixed(2);
};

export const useWalletActionHandlers = ({ wallet, onComplete }: UseWalletActionHandlersProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const [creditWallet, creditState] = useMutation(walletCreditMutation);
  const [manualAdjustWallet, manualAdjustmentState] = useMutation(walletManualAdjustmentMutation);
  const [refundWallet, refundState] = useMutation(walletRefundForWalletMutation);
  const [setWalletActive, setWalletActiveState] = useMutation(walletSetActiveMutation);

  const showError = (fallbackMessage: string) => {
    notify({
      status: "error",
      text: fallbackMessage,
    });
  };

  const runCompletion = async () => {
    if (onComplete) {
      await onComplete();
    }
  };

  const handleAddCredit = async () => {
    if (!wallet) {
      return;
    }

    try {
      const amountInput = window.prompt(
        intl.formatMessage(
          {
            id: "j+0Xdk",
            defaultMessage: "Enter the credit amount in {currency}",
          },
          { currency: wallet.currency },
        ),
      );

      if (amountInput === null) {
        return;
      }

      const amount = parsePositiveAmount(amountInput);

      if (!amount) {
        showError(
          intl.formatMessage({
            id: "8jbA6L",
            defaultMessage: "Enter a valid positive amount.",
          }),
        );

        return;
      }

      const reason = window.prompt(
        intl.formatMessage({
          id: "EoaYGM",
          defaultMessage: "Add a reason for this credit",
        }),
      );

      if (!reason?.trim()) {
        return;
      }

      const note = window.prompt(
        intl.formatMessage({
          id: "BLxCJJ",
          defaultMessage: "Optional note",
        }),
      );

      const { data } = await creditWallet({
        variables: {
          walletId: wallet.id,
          amount,
          reason: reason.trim(),
          note: note?.trim() || undefined,
        },
      });

      const errors = data?.walletCredit?.walletErrors ?? [];

      if (errors.length > 0) {
        showError(errors[0]?.message || "Failed to add credit.");

        return;
      }

      notify({
        status: "success",
        text: intl.formatMessage({
          id: "4hfwvX",
          defaultMessage: "Credit added successfully.",
        }),
      });

      await runCompletion();
    } catch (error) {
      showError(
        intl.formatMessage({
          id: "82I17J",
          defaultMessage: "Failed to add credit.",
        }),
      );
    }
  };

  const handleManualAdjustment = async () => {
    if (!wallet) {
      return;
    }

    try {
      const amountInput = window.prompt(
        intl.formatMessage(
          {
            id: "Da5xEz",
            defaultMessage:
              "Enter the adjustment amount in {currency}. Use a negative value to debit.",
          },
          { currency: wallet.currency },
        ),
      );

      if (amountInput === null) {
        return;
      }

      const amount = parseSignedAmount(amountInput);

      if (!amount) {
        showError(
          intl.formatMessage({
            id: "8uXVD1",
            defaultMessage: "Enter a valid non-zero amount.",
          }),
        );

        return;
      }

      const reason = window.prompt(
        intl.formatMessage({
          id: "bjCM8d",
          defaultMessage: "Add a reason for this adjustment",
        }),
      );

      if (!reason?.trim()) {
        return;
      }

      const note = window.prompt(
        intl.formatMessage({
          id: "BLxCJJ",
          defaultMessage: "Optional note",
        }),
      );

      const { data } = await manualAdjustWallet({
        variables: {
          walletId: wallet.id,
          amount,
          reason: reason.trim(),
          note: note?.trim() || undefined,
        },
      });

      const errors = data?.walletManualAdjustment?.walletErrors ?? [];

      if (errors.length > 0) {
        showError(errors[0]?.message || "Failed to adjust wallet balance.");

        return;
      }

      notify({
        status: "success",
        text: intl.formatMessage({
          id: "PvYdLI",
          defaultMessage: "Wallet adjusted successfully.",
        }),
      });

      await runCompletion();
    } catch (error) {
      showError(
        intl.formatMessage({
          id: "0yu7OE",
          defaultMessage: "Failed to adjust wallet balance.",
        }),
      );
    }
  };

  const handleToggleActive = async () => {
    if (!wallet) {
      return;
    }

    const nextState = !wallet.isActive;
    const confirmMessage = nextState
      ? intl.formatMessage({
          id: "UxW3OT",
          defaultMessage: "Activate this wallet?",
        })
      : intl.formatMessage({
          id: "IDAkxn",
          defaultMessage: "Deactivate this wallet?",
        });
    const confirmed = window.confirm(confirmMessage);

    if (!confirmed) {
      return;
    }

    try {
      const { data } = await setWalletActive({
        variables: {
          walletId: wallet.id,
          isActive: nextState,
        },
      });

      const errors = data?.walletSetActive?.walletErrors ?? [];

      if (errors.length > 0) {
        showError(errors[0]?.message || "Failed to update wallet status.");

        return;
      }

      const successMessage = nextState
        ? intl.formatMessage({
            id: "h+S5Bl",
            defaultMessage: "Wallet activated successfully.",
          })
        : intl.formatMessage({
            id: "8aaCAg",
            defaultMessage: "Wallet deactivated successfully.",
          });

      notify({
        status: "success",
        text: successMessage,
      });

      await runCompletion();
    } catch (error) {
      showError(
        intl.formatMessage({
          id: "xale/S",
          defaultMessage: "Failed to update wallet status.",
        }),
      );
    }
  };

  const handleRefund = async () => {
    if (!wallet) {
      return;
    }

    try {
      const orderNumber = window.prompt(
        intl.formatMessage({
          id: "ExE4q0",
          defaultMessage: "Enter the order number to refund into this wallet",
        }),
      );

      if (!orderNumber?.trim()) {
        return;
      }

      const amountInput = window.prompt(
        intl.formatMessage(
          {
            id: "prTKSH",
            defaultMessage: "Enter the refund amount in {currency}",
          },
          { currency: wallet.currency },
        ),
      );

      if (amountInput === null) {
        return;
      }

      const amount = parsePositiveAmount(amountInput);

      if (!amount) {
        showError(
          intl.formatMessage({
            id: "xbOYBa",
            defaultMessage: "Enter a valid positive refund amount.",
          }),
        );

        return;
      }

      const reason = window.prompt(
        intl.formatMessage({
          id: "me8VcJ",
          defaultMessage: "Add a reason for this refund",
        }),
      );

      const note = window.prompt(
        intl.formatMessage({
          id: "BLxCJJ",
          defaultMessage: "Optional note",
        }),
      );

      const { data } = await refundWallet({
        variables: {
          walletId: wallet.id,
          orderNumber: orderNumber.trim(),
          amount,
          reason: reason?.trim() || undefined,
          note: note?.trim() || undefined,
        },
      });

      const errors = data?.walletRefundForWallet?.walletErrors ?? [];

      if (errors.length > 0) {
        showError(errors[0]?.message || "Failed to refund into wallet.");

        return;
      }

      notify({
        status: "success",
        text: intl.formatMessage({
          id: "phH7sE",
          defaultMessage: "Refund added to wallet successfully.",
        }),
      });

      await runCompletion();
    } catch (_error) {
      showError(
        intl.formatMessage({
          id: "E2iHnB",
          defaultMessage: "Failed to refund into wallet.",
        }),
      );
    }
  };

  return {
    handleAddCredit,
    handleManualAdjustment,
    handleRefund,
    handleToggleActive,
    loading:
      creditState.loading ||
      manualAdjustmentState.loading ||
      refundState.loading ||
      setWalletActiveState.loading,
  };
};
