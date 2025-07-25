

export interface Payment {
  paymentId: number;
  bookingId: number;
  paymentStatus: "Pending" | "Completed" | "Failed";
  paymentDate?: string;
  amount: number | string;
  receiptUrl?: string | null; // Optional receipt URL
}

export type PaymentsPageProps = {
  payments: Payment[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
};

// ✅ Format ISO date to readable string
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PaymentsPage({
  payments,
  isLoading,
  isError,
  error,
}: PaymentsPageProps) {
  if (isLoading) return <p>Loading payments...</p>;
  if (isError) return <p className="text-red-600">{`${error}`}</p>;
  if (payments.length === 0) return <p>No payments found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-400">
        💳 Payments
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Payment ID</th>
              <th className="px-4 py-2 text-left">Booking ID</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const normalizedStatus = p.paymentStatus.toUpperCase() as
                | "PENDING"
                | "COMPLETED"
                | "FAILED";

              return (
                <tr
                  key={p.paymentId}
                  className="border-t dark:border-gray-700"
                >
                  <td className="px-4 py-2">{p.paymentId}</td>
                  <td className="px-4 py-2">{p.bookingId}</td>
                  <td className="px-4 py-2">
                    {p.paymentDate ? formatDate(p.paymentDate) : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    ${Number(p.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={normalizedStatus} />
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {normalizedStatus === "PENDING" && (
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() =>
                          alert(`Proceed to pay for payment ${p.paymentId}`)
                        }
                      >
                        Pay Now
                      </button>
                    )}

                    {normalizedStatus === "FAILED" && (
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() =>
                          alert(`Retry payment ${p.paymentId}`)
                        }
                      >
                        Retry
                      </button>
                    )}

                    {normalizedStatus === "COMPLETED" &&
                      (p.receiptUrl ? (
                        <a
                          href={p.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                        >
                          View Receipt
                        </a>
                      ) : (
                        <span
                          className="text-gray-400 cursor-not-allowed"
                          title="Receipt not available"
                        >
                          No Receipt
                        </span>
                      ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "COMPLETED" | "PENDING" | "FAILED";
}) {
  const colors = {
    COMPLETED: "bg-green-200 text-green-800",
    PENDING: "bg-yellow-200 text-yellow-800",
    FAILED: "bg-red-200 text-red-800",
  } as const;

  return (
    <span className={`px-2 py-1 rounded font-semibold ${colors[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
