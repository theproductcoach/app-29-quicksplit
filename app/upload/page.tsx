"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { put } from "@vercel/blob";
import { addReceipt } from "../lib/receiptStore";
import { v4 as uuidv4 } from "uuid";

// Helper to generate a unique filename
function generateUniqueFilename(extension = "jpg") {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `receipt-${timestamp}-${random}.${extension}`;
}

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const startCamera = async () => {
    console.log("startCamera called");
    try {
      console.log("Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      console.log("Camera access granted, stream:", mediaStream);
      setStream(mediaStream);
      setShowCamera(true);
    } catch (err) {
      setError("Failed to access camera. Please check your permissions.");
      console.error("getUserMedia error:", err);
    }
  };

  useEffect(() => {
    if (showCamera && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      console.log("Camera stream set (useEffect):", stream);
      videoRef.current.onloadedmetadata = () => {
        console.log("Video metadata loaded, attempting to play (useEffect).");
        videoRef.current
          ?.play()
          .then(() => {
            console.log("Video playing (useEffect).");
          })
          .catch((err) => {
            console.error("Error calling play() (useEffect):", err);
          });
      };
      videoRef.current.onerror = (e) => {
        console.error("Video element error (useEffect):", e);
      };
    }
  }, [showCamera, stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], generateUniqueFilename("jpg"), {
              type: "image/jpeg",
            });
            setSelectedFile(file);
            stopCamera();
          }
        }, "image/jpeg");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file or take a photo");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const uniqueName = generateUniqueFilename(selectedFile.name.split('.').pop() || 'jpg');
      const blob = await put(uniqueName, selectedFile, {
        access: "public",
      });

      const response = await fetch("/api/analyze-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: blob.url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze receipt");
      }

      const receiptData = await response.json();
      const id = uuidv4();
      addReceipt(id, {
        ...receiptData,
        url: blob.url,
      });
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
        <div className="col-md-8">
          <div className="card bg-dark border-secondary">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Upload Receipt</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {showCamera ? (
                <div className="text-center mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="img-fluid rounded mb-3"
                    style={{
                      minHeight: "200px",
                      maxHeight: "400px",
                      width: "100%",
                      objectFit: "cover",
                      background: "#222",
                    }}
                    onError={(e) =>
                      console.error("Video element error event:", e)
                    }
                  />
                  <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-primary" onClick={capturePhoto}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-camera me-2"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                        <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                      </svg>
                      Take Photo
                    </button>
                    <button className="btn btn-secondary" onClick={stopCamera}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ paddingBottom: 80 }}>
                  <div className="row g-4">
                    {/* Take Photo Section */}
                    <div className="col-12">
                      <div className="card bg-dark border-secondary h-100">
                        <div className="card-body text-center p-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            fill="currentColor"
                            className="bi bi-camera text-primary mb-3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                            <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                          </svg>
                          <h5 className="text-white mb-3">Take a Photo</h5>
                          <p className="text-white-50 mb-3">
                            Use your device&apos;s camera to capture a receipt
                          </p>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              console.log("Open Camera button clicked");
                              startCamera();
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-camera me-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                              <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                            </svg>
                            Open Camera
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Choose File Section */}
                    <div className="col-12">
                      <div className="card bg-dark border-secondary h-100">
                        <div className="card-body text-center p-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            fill="currentColor"
                            className="bi bi-upload text-primary mb-3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                          </svg>
                          <h5 className="text-white mb-3">Upload a File</h5>
                          <p className="text-white-50 mb-3">
                            Choose an existing receipt image from your device
                          </p>
                          <label className="btn btn-outline-primary">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-upload me-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                            </svg>
                            Choose File
                            <input
                              type="file"
                              className="d-none"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {selectedFile && (
                      <div className="col-12">
                        <div className="alert alert-info mb-0">
                          <div className="d-flex align-items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-file-earmark-text me-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                            </svg>
                            Selected: {selectedFile.name}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="fixed-bottom bg-dark border-top border-secondary py-3">
                    <div className="container">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 btn-lg"
                        disabled={!selectedFile || isLoading}
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
                          "Upload Receipt"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
