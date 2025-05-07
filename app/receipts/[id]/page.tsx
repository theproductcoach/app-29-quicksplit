"use client";

import { useParams, useRouter } from "next/navigation";
import { getReceipt } from "../../lib/receiptStore";
import { useEffect, useState } from "react";
import { Receipt } from "../../lib/receiptStore";
import QRCode from "qrcode";
import Image from "next/image";

function getStatusBadge(status: string) {
  const badges: Record<string, { text: string; class: string }> = {
    New: { text: "New", class: "bg-primary" },
    Partial: { text: "Partial", class: "bg-warning" },
    Paid: { text: "Paid", class: "bg-success" },
  };
  const badge = badges[status] || badges.New;
  return <span className={`badge ${badge.class} px-2 py-1`}>{badge.text}</span>;
}

interface ReceiptItem {
  name: string;
  price: number;
  paidBy?: string;
}

export default function ReceiptDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (params?.id) {
      const receiptData = getReceipt(params.id as string);
      if (receiptData) {
        setReceipt(receiptData);
      }
      // Generate QR code for the pay-for-receipt page
      const url = `${window.location.origin}/pay-for-receipt/${params.id}`;
      QRCode.toDataURL(url, { width: 200, margin: 2 }, (err, dataUrl) => {
        if (!err && dataUrl) setQrDataUrl(dataUrl);
        else setQrDataUrl("");
      });
    }
  }, [params?.id]);

  if (!receipt) {
    return (
      <div className="container py-4 text-center text-white-50">
        Loading receipt...
      </div>
    );
  }

  const { merchant, date, status, total, tax, items, paidBy } = receipt;

  const payUrl = `/pay-for-receipt/${params.id}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.origin + payUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card bg-dark border-secondary">
            <div className="card-body">
              <button
                className="btn btn-outline-light btn-sm w-100 mb-3"
                onClick={() => router.back()}
              >
                &larr; Back
              </button>
              <h2
                className="card-title mb-3 text-center"
                style={{ wordBreak: "break-word" }}
              >
                {merchant}
              </h2>
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
                  <span>${(total - tax).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">${total.toFixed(2)}</span>
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
              <div className="mb-3">
                <div className="fw-semibold mb-1">Who Paid</div>
                {paidBy && paidBy.length > 0 ? (
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
              <div className="mb-3">
                <div className="fw-semibold mb-2">Share Receipt</div>
                <div className="d-flex justify-content-center mb-3">
                  <div className="bg-white p-2 rounded">
                    {qrDataUrl && (
                      <Image
                        src={qrDataUrl}
                        alt="QR Code"
                        width={200}
                        height={200}
                        style={{ display: "block", margin: "0 auto" }}
                        unoptimized
                        priority
                      />
                    )}
                  </div>
                </div>
                <div className="text-center text-white-50 small mb-3">
                  Scan this QR code to view and pay for items
                </div>
              </div>
              <button
                className="btn btn-outline-light w-100"
                onClick={handleCopy}
              >
                {copied ? "Link Copied!" : "Generate Link"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
