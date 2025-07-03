"use client";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { slugifyCourseCode } from "@/lib/utils";

export default function CoursesPage() {
  const { lecturer } = useAuth();
  const router = useRouter();
  console.log(lecturer)

  const handleCourseClick = (courseCode: string) => {
    const slugifiedCourseCode = slugifyCourseCode(courseCode);
    router.push(`/courses/${slugifiedCourseCode}`);
  };

  return (
    // <ProtectedRoute>
      <div className="py-8 px-4 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">My Courses</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lecturer?.courses && lecturer.courses.length > 0 ? (
            lecturer.courses.map((course) => (
              <div
                key={course.courseCode}
                className="shadow-sm p-4 rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors relative"
                onClick={() => handleCourseClick(course.courseCode)}
              >
                <h2 className="text-gray-700 font-bold text-xl mb-2">
                  {course.courseCode}
                </h2>
                <p className="text-gray-600">{course.courseName}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No courses found.
            </div>
          )}
        </div>
      </div>
    // </ProtectedRoute>
  );
}
