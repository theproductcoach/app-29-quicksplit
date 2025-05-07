"use client";

import { useState } from "react";

interface ReceiptItem {
  name: string;
  price: number;
  paidBy?: string;
}

interface ReceiptData {
  merchant: string;
  date: string;
  items: ReceiptItem[];
  total: number;
  tax: number;
  status: "New" | "Partial" | "Paid";
  paidBy: string[];
  createdAt: string;
}

interface Receipt {
  id: string;
  data: ReceiptData;
}

const demoReceipts: Receipt[] = [
  {
    id: "1",
    data: {
      merchant: "Coffee Shop",
      date: "15/03/2024",
      items: [
        { name: "Latte", price: 4.5, paidBy: "Alice" },
        { name: "Bagel", price: 3.75 },
        { name: "Muffin", price: 4.0, paidBy: "Bob" },
      ],
      total: 12.25,
      tax: 1.25,
      status: "Paid",
      paidBy: ["Alice", "Bob"],
      createdAt: "2024-03-15T10:00:00Z",
    },
  },
  {
    id: "2",
    data: {
      merchant: "Pizza Place",
      date: "14/03/2024",
      items: [
        { name: "Large Pizza", price: 18.0, paidBy: "You" },
        { name: "Soda", price: 2.5 },
        { name: "Salad", price: 7.46 },
      ],
      total: 27.96,
      tax: 2.96,
      status: "Partial",
      paidBy: ["You"],
      createdAt: "2024-03-14T19:30:00Z",
    },
  },
  {
    id: "3",
    data: {
      merchant: "Grocery Store",
      date: "13/03/2024",
      items: [
        { name: "Milk", price: 3.49, paidBy: "Alice" },
        { name: "Eggs", price: 2.99, paidBy: "Bob" },
        { name: "Bread", price: 4.99, paidBy: "You" },
      ],
      total: 11.47,
      tax: 0.97,
      status: "Paid",
      paidBy: ["Alice", "Bob", "You"],
      createdAt: "2024-03-13T15:45:00Z",
    },
  },
];

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

export default function ReceiptsPage() {
  const [openReceipt, setOpenReceipt] = useState<Receipt | null>(null);

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card bg-dark border-secondary">
            <div className="card-body">
              <h2 className="card-title mb-4">My Receipts</h2>
              <div className="d-flex flex-column gap-3">
                {demoReceipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="receipt-card bg-secondary bg-opacity-10 border border-secondary rounded-3 px-4 py-3 d-flex justify-content-between align-items-center"
                    style={{ minHeight: 90, cursor: "pointer" }}
                    onClick={() => setOpenReceipt(receipt)}
                  >
                    <div
                      className="d-flex flex-column justify-content-between align-items-start flex-grow-1"
                      style={{ minWidth: 0 }}
                    >
                      <span
                        className="fw-bold fs-4 text-white mb-1"
                        style={{
                          minWidth: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {receipt.data.merchant}
                      </span>
                      {getStatusBadge(receipt.data.status)}
                    </div>
                    <div
                      className="d-flex flex-column align-items-end justify-content-between ms-3"
                      style={{ minWidth: 110 }}
                    >
                      <span
                        className="text-white-50 mb-2"
                        style={{ fontSize: "1.05rem" }}
                      >
                        {receipt.data.date}
                      </span>
                      <span className="fw-bold text-white fs-4">
                        ${receipt.data.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {openReceipt && (
        <div
          className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.85)", zIndex: 2000 }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: 420, width: "95%" }}
          >
            <div className="modal-content bg-dark text-white border border-secondary rounded-4 shadow-lg position-relative">
              <button
                className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                aria-label="Close"
                onClick={() => setOpenReceipt(null)}
                style={{ zIndex: 10 }}
              />
              <div className="modal-body p-4">
                <h4 className="fw-bold mb-1">{openReceipt.data.merchant}</h4>
                <div
                  className="mb-2 text-white-50"
                  style={{ fontSize: "0.95rem" }}
                >
                  {openReceipt.data.date}
                </div>
                <div className="mb-3">
                  {getStatusBadge(openReceipt.data.status)}
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span className="fw-semibold">Subtotal:</span>
                    <span>
                      $
                      {(openReceipt.data.total - openReceipt.data.tax).toFixed(
                        2
                      )}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="fw-semibold">Tax:</span>
                    <span>${openReceipt.data.tax.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between border-top pt-2 mt-2">
                    <span className="fw-bold">Total:</span>
                    <span className="fw-bold">
                      ${openReceipt.data.total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="fw-semibold mb-2">Items</div>
                  <ul className="list-group list-group-flush">
                    {openReceipt.data.items.map((item, idx) => (
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
                        <span className="text-end">
                          ${item.price.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <div className="fw-semibold mb-1">Who Paid</div>
                  {openReceipt.data.paidBy.length > 0 ? (
                    <ul className="list-inline mb-0">
                      {openReceipt.data.paidBy.map((name, idx) => (
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
                <button
                  className="btn btn-outline-light w-100 mt-3"
                  onClick={() => setOpenReceipt(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
