"use client";
import Link from "next/link";
import { useEffect } from "react";
import { addReceipt, getReceipt as getStoredReceipt } from "./lib/receiptStore";

// Demo receipts (copied from /receipts/page.tsx)
const demoReceipts = [
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
      status: "Paid" as const,
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
      status: "Partial" as const,
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
      status: "Paid" as const,
      paidBy: ["Alice", "Bob", "You"],
      createdAt: "2024-03-13T15:45:00Z",
    },
  },
];

export default function Home() {
  useEffect(() => {
    demoReceipts.forEach((receipt) => {
      if (!getStoredReceipt(receipt.id)) {
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
    <main className="container py-4">
      <div className="text-center px-3">
        <div className="mb-5">
          <h1 className="display-1 fw-bold text-white mb-2">QuickSplit</h1>
          <div className="text-info fs-4 fw-light">Split bills instantly</div>
        </div>

        <p className="lead mb-4 text-white-75">
          Split bills and receipts instantly with friends. Upload a receipt or
          scan a bill to get started.
        </p>

        <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
          <Link href="/upload" className="btn btn-primary btn-lg px-4 py-3">
            Upload a Receipt
          </Link>
          <Link href="/pay" className="btn btn-outline-light btn-lg px-4 py-3">
            Pay my share
          </Link>
        </div>
      </div>
    </main>
  );
}
