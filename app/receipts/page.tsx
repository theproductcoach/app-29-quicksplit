"use client";

import { useEffect } from "react";
import {
  addReceipt,
  getReceipt as getStoredReceipt,
} from "../lib/receiptStore";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  // Ensure demo receipts are in localStorage
  useEffect(() => {
    demoReceipts.forEach((receipt) => {
      // Only add if not already present
      if (!getStoredReceipt(receipt.id)) {
        // Convert demo receipt to the Receipt type expected by addReceipt
        addReceipt(receipt.id, {
          merchant: receipt.data.merchant,
          date: receipt.data.date,
          items: receipt.data.items,
          total: receipt.data.total,
          tax: receipt.data.tax,
          status: receipt.data.status,
          paidBy: receipt.data.paidBy,
          url: "",
        });
      }
    });
  }, []);

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
                    onClick={() => router.push(`/receipts/${receipt.id}`)}
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
    </div>
  );
}
