"use client";

import { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function PayPage() {
  const [scanning, setScanning] = useState(false);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const startScan = async () => {
    setError(null);
    setQrResult(null);
    setScanning(true);
    if (qrRef.current) {
      try {
        const html5QrCode = new Html5Qrcode(qrRef.current.id);
        html5QrCodeRef.current = html5QrCode;
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            setQrResult(decodedText);
            stopScan();
          },
          () => {
            // ignore scan errors
          }
        );
      } catch (error) {
        console.error("Error starting QR scan:", error);
        setError("Failed to access camera or start QR scan.");
        setScanning(false);
      }
    }
  };

  const stopScan = () => {
    setScanning(false);
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current?.clear();
      });
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card bg-dark border-secondary">
            <div className="card-body text-center">
              <h2 className="card-title mb-3">Scan to Pay</h2>
              <p className="text-white-50 mb-4">
                Use your phone camera to scan a QR code and pay instantly.
              </p>
              {error && <div className="alert alert-danger">{error}</div>}
              {qrResult && (
                <div className="alert alert-success">
                  <strong>QR Code Detected:</strong>
                  <div className="mt-2 text-break">{qrResult}</div>
                </div>
              )}
              {!scanning ? (
                <button
                  className="btn btn-primary px-4 py-2"
                  onClick={startScan}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-qr-code-scan me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2h2V1a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1V2zm1 1H2V2h1v1zm9-1h2V1a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v1h2V2zm1 1h-1V2h1v1zM2 14h2v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1v2zm1-1H2v-1h1v1zm9 1h2v1a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-1h2v1zm1-1h-1v-1h1v1z" />
                    <path d="M5 5h1v1H5V5zm2 0h1v1H7V5zm2 0h1v1H9V5zm0 2h1v1H9V7zm-2 0h1v1H7V7zm-2 0h1v1H5V7zm0 2h1v1H5V9zm2 0h1v1H7V9zm2 0h1v1H9V9zm0 2h1v1H9v-1zm-2 0h1v1H7v-1zm-2 0h1v1H5v-1z" />
                  </svg>
                  Start QR Scan
                </button>
              ) : (
                <>
                  <div
                    id="qr-reader"
                    ref={qrRef}
                    style={{ width: 280, margin: "0 auto" }}
                  />
                  <button
                    className="btn btn-outline-light mt-3"
                    onClick={stopScan}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
