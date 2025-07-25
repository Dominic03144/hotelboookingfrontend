import React from "react";

interface ReceiptViewerProps {
  receiptUrl?: string | null;
}

export default function ReceiptViewer({ receiptUrl }: ReceiptViewerProps) {
  if (!receiptUrl) {
    return <p className="text-gray-500">No receipt available for this payment.</p>;
  }

  return (
    <a
      href={receiptUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      View Receipt
    </a>
  );
}
