"use client";

import { useState } from "react";
import { put } from "@vercel/blob";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const router = useRouter();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    try {
      setIsUploading(true);

      // Upload to Vercel Blob
      const blob = await put(selectedFile.name, selectedFile, {
        access: "public",
      });

      setUploadSuccess(true);
      // Clear the form after successful upload
      setSelectedFile(null);
      setPreview(null);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Upload your receipt</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="receipt" className="form-label">
            Select an image
          </label>
          <input
            type="file"
            className="form-control"
            id="receipt"
            accept="image/*"
            onChange={handleFileSelect}
            required
          />
        </div>

        {preview && (
          <div className="mb-3">
            <img
              src={preview}
              alt="Preview"
              className="img-fluid"
              style={{ maxHeight: "300px" }}
            />
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Receipt"}
        </button>
      </form>

      {uploadSuccess && (
        <div className="alert alert-success" role="alert">
          Receipt uploaded successfully!
        </div>
      )}
    </div>
  );
}
