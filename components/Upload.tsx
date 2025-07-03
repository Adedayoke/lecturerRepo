// components/UploadForm.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface UploadFormProps {
  onUploadSuccess?: (material: any) => void;
  onCloseModal?: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({
  onUploadSuccess,
  onCloseModal,
}) => {
  const { lecturer, isAuthenticated } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    code: "",
    file: null as File | null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError("You must be logged in to upload materials");
      return;
    }

    if (
      !formData.file ||
      !formData.title ||
      !formData.subject ||
      !formData.code
    ) {
      setError("All fields are required");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", formData.file);
      uploadFormData.append("title", formData.title);
      uploadFormData.append("subject", formData.subject);
      uploadFormData.append("code", formData.code);

      const response = await fetch("/api/materials", {
        method: "POST",
        body: uploadFormData,
        // No need to set Content-Type header for FormData
        // The browser will set it automatically with the boundary
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message || "File uploaded successfully");
        setFormData({
          title: "",
          subject: "",
          code: "",
          file: null,
        });
        // Reset file input
        const fileInput = document.getElementById("file") as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Call callback if provided
        if (onUploadSuccess) {
          onUploadSuccess(result.data);
        }
        if(onCloseModal){
          onCloseModal()
        }
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = ()=> {
    if(onCloseModal){
      onCloseModal()
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <p className="text-red-600 mb-4">Please log in to upload materials</p>
          <a
            href="/login"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md h-[80vh] overflow-y-auto mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Upload Lecture Material
      </h2>

      {/* Display lecturer info */}
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          Uploading as:{" "}
          <span className="font-semibold">
            {lecturer?.title} {lecturer?.firstName} {lecturer?.lastName}
          </span>
        </p>
        <p className="text-xs text-gray-500">PF: {lecturer?.pfNumber}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter material title"
            required
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter subject name"
            required
          />
        </div>

        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Course Code *
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course code (e.g., CS101)"
            required
          />
        </div>

        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            File *
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT (Max 10MB)
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="flex items-center gap-4 md:flex-row flex-col">
          <button
            type="reset"
            onClick={handleCancel}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload Material"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
