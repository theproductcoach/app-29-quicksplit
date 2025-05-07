"use client";

import { useParams } from "next/navigation";
import { getReceipt, Receipt, ReceiptItem } from "../../lib/receiptStore";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

export default function PayForReceiptPage() {
  const params = useParams();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (params?.id) {
      const receiptData = getReceipt(params.id as string);
      if (receiptData) {
        setReceipt(receiptData);
      } else {
        setReceipt(null);
      }
    }
  }, [params?.id]);

  // Generate QR code for sharing
  useEffect(() => {
    if (showQrModal && params?.id) {
      const url = `${window.location.origin}/pay-for-receipt/${params.id}`;
      QRCode.toDataURL(url, { width: 200, margin: 2 }, (err, dataUrl) => {
        if (!err && dataUrl) setQrDataUrl(dataUrl);
        else setQrDataUrl("");
      });
    } else {
      setQrDataUrl("");
    }
  }, [showQrModal, params?.id]);

  if (!receipt) {
    return (
      <div className="container py-4 text-center text-white-50">
        Loading receipt...
      </div>
    );
  }

  const { merchant, date, items } = receipt;

  const handleToggle = (idx: number) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const total = selected.reduce((sum, idx) => sum + items[idx].price, 0);
  const selectedItems = selected.map((idx) => items[idx]);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return (
    <div className="container py-4">
      {/* QR Share Modal */}
      {showQrModal && (
        <div
          className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.85)", zIndex: 3000 }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: 400, width: "95%" }}
          >
            <div className="modal-content bg-dark text-white border border-secondary rounded-4 shadow-lg position-relative">
              <div className="modal-body p-4 text-center">
                <h4 className="fw-bold mb-3">Share This Receipt</h4>
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
                <button
                  className="btn btn-outline-light mt-3 w-100"
                  onClick={() => setShowQrModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card bg-dark border-secondary">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="card-title mb-0">Select Items to Pay</h2>
                <button
                  className="btn btn-outline-info btn-sm"
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  title="Show QR Code"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-qr-code me-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2h2V1a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1V2zm1 1H2V2h1v1zm9-1h2V1a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v1h2V2zm1 1h-1V2h1v1zM2 14h2v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1v2zm1-1H2v-1h1v1zm9 1h2v1a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-1h2v1zm1-1h-1v-1h1v1z" />
                    <path d="M5 5h1v1H5V5zm2 0h1v1H7V5zm2 0h1v1H9V5zm0 2h1v1H9V7zm-2 0h1v1H7V7zm-2 0h1v1H5V7zm0 2h1v1H5V9zm2 0h1v1H7V9zm2 0h1v1H9V9zm0 2h1v1H9v-1zm-2 0h1v1H7v-1zm-2 0h1v1H5v-1z" />
                  </svg>
                  Show QR
                </button>
              </div>
              <div
                className="mb-2 text-white-50"
                style={{ fontSize: "0.95rem" }}
              >
                {merchant} &mdash; {date}
              </div>
              <form onSubmit={handlePay}>
                <ul className="list-group list-group-flush mb-4">
                  {items.map((item: ReceiptItem, idx: number) => (
                    <li
                      key={idx}
                      className={`list-group-item bg-dark text-white d-flex justify-content-between align-items-center px-0 py-2 border-0`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleToggle(idx)}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selected.includes(idx)}
                          onChange={() => handleToggle(idx)}
                          onClick={(e) => e.stopPropagation()}
                          className="form-check-input me-2"
                          style={{ cursor: "pointer" }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span>${item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                {selected.length > 0 && (
                  <div className="mb-3">
                    <div className="fw-semibold mb-1">Selected Items</div>
                    <ul className="list-group list-group-flush">
                      {selectedItems.map((item, idx) => (
                        <li
                          key={idx}
                          className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center px-0 py-1 border-0"
                        >
                          <span>{item.name}</span>
                          <span>${item.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-semibold">Total to Pay:</span>
                  <span className="fw-bold fs-5">${total.toFixed(2)}</span>
                </div>
                <button
                  className="btn btn-success w-100"
                  type="submit"
                  disabled={selected.length === 0}
                >
                  Pay My Share
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.85)", zIndex: 2000 }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: 400, width: "95%" }}
          >
            <div className="modal-content bg-dark text-white border border-secondary rounded-4 shadow-lg position-relative">
              <div className="modal-body p-4 text-center">
                <h4 className="fw-bold mb-3">Payment Confirmed!</h4>
                <div className="mb-3">You have selected:</div>
                <ul className="list-group list-group-flush mb-3">
                  {selectedItems.map((item, idx) => (
                    <li
                      key={idx}
                      className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center px-0 py-1 border-0"
                    >
                      <span>{item.name}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="fw-bold mb-3">
                  Total Paid: ${total.toFixed(2)}
                </div>
                <button
                  className="btn btn-outline-light w-100"
                  onClick={() => setShowConfirm(false)}
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
