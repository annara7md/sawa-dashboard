import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface BankTransferReceiptInfoProps {
  receipt: {
    id: string;
    receiptImage?: string | null;
    status: string;
    notes?: string | null;
    uploadedAt: string;
    reviewedAt?: string | null;
  };
}

export const BankTransferReceiptInfo: React.FC<BankTransferReceiptInfoProps> = ({ receipt }) => {
  if (!receipt) {
    return null;
  }

  return (
    <Box paddingX={5} paddingY={4} display="flex" flexDirection="column" gap={4}>
      <Text size={5} display="block" marginBottom={2}>
        <FormattedMessage defaultMessage="Bank Transfer Receipt" id="bankTransferReceiptInfo.title" />
      </Text>
      
      <Box display="flex" gap={4} alignItems="flex-start">
        {receipt.receiptImage && (
          <Box
            __width="120px"
            __height="120px"
            borderWidth={1}
            borderStyle="solid"
            borderColor="default1"
            borderRadius={4}
            overflow="hidden"
          >
            <img 
              src={receipt.receiptImage} 
              alt="Bank Transfer Receipt" 
              style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }} 
              onClick={() => window.open(receipt.receiptImage as string, '_blank')}
            />
          </Box>
        )}
        
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" gap={2}>
            <Text color="default2">
              <FormattedMessage defaultMessage="Status:" id="bankTransferReceiptInfo.statusLabel" />
            </Text>
            <Text>
              {receipt.status.toUpperCase()}
            </Text>
          </Box>
          
          <Box display="flex" gap={2}>
            <Text color="default2">
              <FormattedMessage defaultMessage="Uploaded At:" id="bankTransferReceiptInfo.uploadedAt" />
            </Text>
            <Text>
              {new Date(receipt.uploadedAt).toLocaleString()}
            </Text>
          </Box>

          {receipt.notes && (
            <Box display="flex" flexDirection="column" gap={1} marginTop={2}>
              <Text color="default2">
                <FormattedMessage defaultMessage="Customer Notes:" id="bankTransferReceiptInfo.notesLabel" />
              </Text>
              <Text>
                {receipt.notes}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
