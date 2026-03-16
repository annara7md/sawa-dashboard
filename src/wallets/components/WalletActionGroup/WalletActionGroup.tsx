import { Box, Button } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type Wallet } from "../../types";

interface WalletActionGroupProps {
  wallet?: Pick<Wallet, "id" | "isActive">;
  disabled?: boolean;
  onAddCredit: () => void;
  onManualAdjustment: () => void;
  onRefund: () => void;
  onToggleActive: () => void;
}

export const WalletActionGroup = ({
  wallet,
  disabled = false,
  onAddCredit,
  onManualAdjustment,
  onRefund,
  onToggleActive,
}: WalletActionGroupProps) => {
  const intl = useIntl();

  if (!wallet) {
    return null;
  }

  return (
    <Box display="flex" gap={2} flexWrap="wrap" justifyContent="flex-end">
      <Button variant="secondary" size="small" disabled={disabled} onClick={onRefund}>
        {intl.formatMessage({
          id: "IeUH3/",
          defaultMessage: "Refund",
        })}
      </Button>
      <Button variant="secondary" size="small" disabled={disabled} onClick={onManualAdjustment}>
        {intl.formatMessage({
          id: "gdiN/9",
          defaultMessage: "Manual adjustment",
        })}
      </Button>
      <Button variant="secondary" size="small" disabled={disabled} onClick={onToggleActive}>
        {wallet.isActive
          ? intl.formatMessage({
              id: "e0kEtS",
              defaultMessage: "Deactivate",
            })
          : intl.formatMessage({
              id: "AcxDgz",
              defaultMessage: "Activate",
            })}
      </Button>
      <Button size="small" disabled={disabled} onClick={onAddCredit}>
        {intl.formatMessage({
          id: "N2W+L6",
          defaultMessage: "Add credit",
        })}
      </Button>
    </Box>
  );
};
