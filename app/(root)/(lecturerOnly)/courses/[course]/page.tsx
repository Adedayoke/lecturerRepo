"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DocCard from "@/components/DocCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LectureMaterial, ApiResponse } from "@/lib/types";
import { deslugifyCourseCode, formatCourseCodeForDisplay } from "@/lib/utils";

export default function CourseDetailPage() {
  const { course } = useParams();
  const [materials, setMaterials] = useState<LectureMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert slug back to course code for API query
  const courseCode = course ? deslugifyCourseCode(course.toString()) : '';

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/materials?code=${courseCode}`);
        const result: ApiResponse<LectureMaterial[]> = await response.json();
        if (result.success && result.data) {
          setMaterials(result.data);
        }
      } catch (error) {
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };
    if (courseCode) fetchMaterials();
  }, [courseCode]);

  function handleDelete(fileId: number) {
    // Remove the deleted file from the materials state
    setMaterials(prev => prev.filter(material => material.id !== fileId));
  }

  // Format course code for display
  const displayCourseCode = course ? formatCourseCodeForDisplay(course.toString()) : '';

  return (
    // <ProtectedRoute>
      <div className="py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Files for Course: {displayCourseCode}</h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : materials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {materials.map((file) => (
              <DocCard key={file.id} file={file} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No files found for this course.</div>
        )}
      </div>
    // </ProtectedRoute>
  );
}
