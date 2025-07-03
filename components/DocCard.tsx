import { useOutsideClick } from "@/hooks/useClickOutside";
import { LectureMaterial } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  EllipsisVertical,
  FileText,
  Image,
  Eye,
  Download,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface DocCardProps {
  file: Partial<LectureMaterial>;
  onDelete?: (fileId: number) => void;
}

export default function DocCard({ file, onDelete }: DocCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { lecturer } = useAuth();
  const ref = useOutsideClick(() => setShowDropdown(false));

  // Check if current lecturer owns this file
  const isOwner = lecturer && file.lecturerId === parseInt(lecturer.id);

  const handleFileView = () => {
    if (file?.id) {
      // Open file in new tab for viewing
      window.open(`/api/materials/${file.id}`, "_blank");
    }
    setShowDropdown(false);
  };

  const handleFileDownload = () => {
    if (file?.id) {
      // Trigger download
      window.open(`/api/materials/${file.id}/download`, "_blank");
    }
    setShowDropdown(false);
  };

  const handleDelete = async () => {
    if (!file?.id) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/materials/${file.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        // Call the onDelete callback to update the parent component
        if (onDelete) {
          onDelete(file.id);
        }
        setShowDeleteConfirm(false);
      } else {
        alert(result.error || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting the file');
    } finally {
      setIsDeleting(false);
      setShowDropdown(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when dropdown is clicked
    if (ref.current && ref.current.contains(e.target as Node)) {
      return;
    }
    // Default action: view file
    handleFileView();
  };

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  return (
    <figure
      className="shadow-sm p-4 rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors relative"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between">
        <span className="bg-primary/[0.4] backdrop-blur-2xl p-4 rounded-full">
          {file?.fileType === ".pdf" ? (
            <FileText size={30} color="red" />
          ) : file?.fileType === ".docx" ? (
            <FileText size={30} color="blue" />
          ) : file?.fileType === ".ppt" || file?.fileType === ".pptx" ? (
            <FileText size={30} color="orange" />
          ) : file?.fileType === ".png" || file?.fileType === ".jpg" ? (
            <Image size={30} color="blue" />
          ) : (
            <FileText size={30} color="yellow" />
          )}
        </span>

        <div
          className="flex flex-col gap-3 justify-between items-end relative"
          ref={ref}
        >
          <button
            onClick={handleDropdownToggle}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="More options"
          >
            <EllipsisVertical size={25} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
              <button
                onClick={handleFileView}
                className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg"
              >
                <Eye size={16} />
                <span className="text-sm">View</span>
              </button>
              <button
                onClick={handleFileDownload}
                className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <Download size={16} />
                <span className="text-sm">Download</span>
              </button>
              {isOwner && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 transition-colors last:rounded-b-lg border-t border-gray-100"
                >
                  <Trash2 size={16} />
                  <span className="text-sm">Delete</span>
                </button>
              )}
            </div>
          )}

          <span className="text-sm">
            {file?.fileSize
              ? `${(file.fileSize / 1024 / 1024).toFixed(2)}MB`
              : "1mb"}
          </span>
        </div>
      </div>

      <h2 className="text-gray-700 font-bold text-2xl mt-2">
        {file?.code || "File"}
      </h2>
      <p className="text-gray-600">{file?.title}</p>
      <p className="mt-4 text-gray-500 text-sm">
        {file?.uploadDate && formatDate(`${file?.uploadDate}`)}
      </p>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{file.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </figure>
  );
}
