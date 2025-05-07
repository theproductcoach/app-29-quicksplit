"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { put } from "@vercel/blob";
import { addReceipt } from "../../lib/receiptStore";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

export default function UploadPreviewPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get file info from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("upload-preview");
    if (stored) {
      const { name, type, dataUrl } = JSON.parse(stored);
      setPreviewUrl(dataUrl);
      // Convert Data URL to Blob and File
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          setFile(new File([blob], name, { type }));
        });
    } else {
      router.replace("/upload");
    }
    // Cleanup preview URL
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    try {
      const uniqueName = `receipt-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${file.name.split(".").pop() || "jpg"}`;
      const blob = await put(uniqueName, file, { access: "public" });
      const response = await fetch("/api/analyze-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: blob.url }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze receipt");
      }
      const receiptData = await response.json();
      const id = uuidv4();
      addReceipt(id, { ...receiptData, url: blob.url });
      router.push(`/receipts/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card bg-dark border-secondary">
            <div className="card-body text-center">
              <h2 className="card-title mb-4">Preview & Upload</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {previewUrl && (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  className="img-fluid rounded mb-4"
                  width={400}
                  height={400}
                  style={{
                    maxHeight: 400,
                    width: "100%",
                    objectFit: "contain",
                    background: "#222",
                  }}
                  unoptimized
                  priority
                />
              )}
              <button
                className="btn btn-primary btn-lg w-100"
                onClick={handleUpload}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Uploading...
                  </>
                ) : (
                  "Upload Image"
                )}
              </button>
              <button
                className="btn btn-outline-light w-100 mt-3"
                onClick={() => router.replace("/upload")}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
