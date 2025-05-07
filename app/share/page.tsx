"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

export default function SharePage() {
  return (
    <Suspense fallback={null}>
      <SharePageContent />
    </Suspense>
  );
}

function SharePageContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (url) {
      QRCode.toDataURL(url, { width: 256, margin: 2 }, (err, dataUrl) => {
        if (!err) setQrDataUrl(dataUrl);
      });
    }
  }, [url]);

  const handleCopy = async () => {
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card bg-dark border-secondary">
            <div className="card-body text-center">
              <h2 className="card-title mb-3">Share Receipt</h2>
              {qrDataUrl && (
                <Image
                  src={qrDataUrl}
                  alt="QR Code"
                  className="mb-3"
                  width={256}
                  height={256}
                  priority
                />
              )}
              <div className="mb-3">
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control text-center mb-2"
                  value={url}
                  readOnly
                  style={{ background: "#222", color: "#fff" }}
                />
                <button
                  className="btn btn-primary w-100"
                  onClick={handleCopy}
                  disabled={!url}
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
              <div className="alert alert-info mt-3 mb-0">
                Ask your friends to scan the code or open the link to select
                their items.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
