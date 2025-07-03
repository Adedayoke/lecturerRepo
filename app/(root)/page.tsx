"use client";
import DocCard from "@/components/DocCard";
import Header from "@/components/Header";
import { ApiResponse } from "@/lib/types";
import { LectureMaterial } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Home() {
  const [materials, setMaterials] = useState<LectureMaterial[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function getAllMaterials() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/materials", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result: ApiResponse<LectureMaterial[]> = await response.json();
      console.log("Materials fetched:", result);
      if (result.success && result.data) {
        setMaterials(result.data);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function searchMaterials(query: string) {
    if (!query.trim()) {
      // If search is empty, get all materials
      getAllMaterials();
      return;
    }

    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("query", query.trim());
      console.log(searchParams.toString());
      const response = await fetch(
        `/api/materials/search?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result: ApiResponse<LectureMaterial[]> = await response.json();
      console.log("Search results:", result);

      if (result.success && result.data) {
        setMaterials(result.data);
      }
    } catch (error) {
      console.error("Error searching materials:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    getAllMaterials();
  }, []);

  // Search when searchQuery changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMaterials(searchQuery);
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  function handleUploaded() {
    // After upload, if there's a search query, maintain the search
    // Otherwise, refresh all materials
    if (searchQuery.trim()) {
      searchMaterials(searchQuery);
    } else {
      getAllMaterials();
    }
  }

  function handleDelete(fileId: number) {
    // Remove the deleted file from the materials state
    setMaterials(prev => prev.filter(material => material.id !== fileId));
  }

  return (
    <main className="bg-[#F2F4F8] min-h-[100vh]">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleUploaded={handleUploaded}
      />

      <div className="px-4 py-3">
        {/* Search results info */}
        {searchQuery.trim() && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              {isLoading
                ? "Searching..."
                : `Found ${materials.length} result${
                    materials.length !== 1 ? "s" : ""
                  } for "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Materials grid */}
        {!isLoading && (
          <>
            {materials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {materials.map((file) => (
                  <DocCard key={file.id} file={file} onDelete={handleDelete} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-gray-500 text-center">
                  <p className="text-xl mb-2">
                    {searchQuery.trim()
                      ? "No materials found"
                      : "No materials available"}
                  </p>
                  <p className="text-sm">
                    {searchQuery.trim()
                      ? "Try adjusting your search terms"
                      : "Upload some materials to get started"}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
