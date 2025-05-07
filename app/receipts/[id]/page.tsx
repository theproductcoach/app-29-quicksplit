"use client";

import { useSearchParams, useRouter } from "next/navigation";

function getStatusBadge(status: string) {
  switch (status) {
    case "New":
      return <span className="badge bg-primary">New</span>;
    case "Partial":
      return <span className="badge bg-warning text-dark">Partial</span>;
    case "Paid":
      return <span className="badge bg-success">Paid</span>;
    default:
      return null;
  }
}

interface ReceiptItem {
  name: string;
  price: number;
  paidBy?: string;
}

export default function ReceiptDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url") || "";
  const merchant = searchParams.get("merchant") || "";
  const date = searchParams.get("date") || "";
  const status = searchParams.get("status") || "New";
  const total = searchParams.get("total") || "";
  const tax = searchParams.get("tax") || "";
  const items = searchParams.get("items")
    ? (JSON.parse(searchParams.get("items")!) as ReceiptItem[])
    : [];
  const paidBy = searchParams.get("paidBy")
    ? JSON.parse(searchParams.get("paidBy")!)
    : [];

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card bg-dark border-secondary">
            <div className="card-body">
              <h2 className="card-title mb-3">{merchant}</h2>
              <div
                className="mb-2 text-white-50"
                style={{ fontSize: "0.95rem" }}
              >
                {date}
              </div>
              <div className="mb-3">{getStatusBadge(status)}</div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">Subtotal:</span>
                  <span>
                    ${(parseFloat(total) - parseFloat(tax)).toFixed(2)}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">Tax:</span>
                  <span>${parseFloat(tax).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">
                    ${parseFloat(total).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mb-3">
                <div className="fw-semibold mb-2">Items</div>
                <ul className="list-group list-group-flush">
                  {items.map((item: ReceiptItem, idx: number) => (
                    <li
                      key={idx}
                      className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center px-0 py-2 border-0"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span>{item.name}</span>
                        {item.paidBy && (
                          <span
                            className="badge bg-info text-dark ms-2"
                            style={{ fontSize: "0.85em" }}
                          >
                            Paid by {item.paidBy}
                          </span>
                        )}
                      </div>
                      <span className="text-end">${item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-2">
                <div className="fw-semibold mb-1">Who Paid</div>
                {paidBy.length > 0 ? (
                  <ul className="list-inline mb-0">
                    {paidBy.map((name: string, idx: number) => (
                      <li
                        key={idx}
                        className="list-inline-item badge bg-success text-white me-1 mb-1"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-white-50">No payments yet</span>
                )}
              </div>
              {url && (
                <button
                  className="btn btn-primary w-100 mt-4"
                  onClick={() =>
                    router.push(`/share?url=${encodeURIComponent(url)}`)
                  }
                >
                  Share
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
