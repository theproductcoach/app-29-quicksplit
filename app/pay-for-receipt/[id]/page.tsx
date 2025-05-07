"use client";

import { useParams } from "next/navigation";
import { getReceipt, Receipt, ReceiptItem } from "../../lib/receiptStore";
import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function PayForReceiptPage() {
  const params = useParams();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

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

  useEffect(() => {
    if (showQrModal && qrRef.current && !scanning) {
      setQrError(null);
      setScanning(true);
      const qrId = "qr-reader-modal";
      qrRef.current.id = qrId;
      const html5QrCode = new Html5Qrcode(qrId);
      html5QrCodeRef.current = html5QrCode;
      html5QrCode
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            // On successful scan
            setShowQrModal(false);
            setScanning(false);
            html5QrCode.stop().then(() => html5QrCode.clear());
            // For now, just log the result. You can handle navigation or prefill here.
            console.log("Scanned QR:", decodedText);
          },
          () => {
            // ignore scan errors
          }
        )
        .catch((error) => {
          console.error("QR scan error:", error);
          setQrError("Failed to access camera or start QR scan.");
          setScanning(false);
        });
    }
    // Cleanup on modal close
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current?.clear();
        });
      }
      setScanning(false);
    };
  }, [showQrModal, scanning]);

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
      {/* QR Scan Modal */}
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
                <h4 className="fw-bold mb-3">Scan QR Code</h4>
                {qrError && <div className="alert alert-danger">{qrError}</div>}
                <div
                  ref={qrRef}
                  style={{
                    width: 280,
                    minHeight: 200,
                    background: "#222",
                    margin: "0 auto",
                    borderRadius: 8,
                  }}
                />
                <button
                  className="btn btn-outline-light mt-3 w-100"
                  onClick={() => setShowQrModal(false)}
                >
                  Cancel
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
                  title="Scan QR Code"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-qr-code-scan me-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2h2V1a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1V2zm1 1H2V2h1v1zm9-1h2V1a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v1h2V2zm1 1h-1V2h1v1zM2 14h2v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1v2zm1-1H2v-1h1v1zm9 1h2v1a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-1h2v1zm1-1h-1v-1h1v1z" />
                    <path d="M5 5h1v1H5V5zm2 0h1v1H7V5zm2 0h1v1H9V5zm0 2h1v1H9V7zm-2 0h1v1H7V7zm-2 0h1v1H5V7zm0 2h1v1H5V9zm2 0h1v1H7V9zm2 0h1v1H9V9zm0 2h1v1H9v-1zm-2 0h1v1H7v-1zm-2 0h1v1H5v-1z" />
                  </svg>
                  Scan QR
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
