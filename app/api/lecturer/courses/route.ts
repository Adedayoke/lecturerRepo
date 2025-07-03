// app/api/lecturer/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { ApiResponse } from '@/lib/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface CourseResponse {
  id: number;
  courseCode: string;
  courseName: string;
  materialCount: number; // Number of materials for this course
}

// Helper function to extract lecturer ID from token
async function getLecturerFromToken(): Promise<{ lecturerId: number } | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;
        
        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return { lecturerId: decoded.lecturerId };
    } catch (error) {
        return null;
    }
}

export async function GET(): Promise<NextResponse<ApiResponse<CourseResponse[]>>> {
    try {
        // Get lecturer from token
        const auth = await getLecturerFromToken();
        if (!auth) {
            return NextResponse.json({
                success: false,
                error: 'Authentication required'
            }, { status: 401 });
        }

        // Get lecturer's courses with material count
        const courses = await prisma.lecturerCourse.findMany({
            where: {
                lecturerId: auth.lecturerId
            },
            select: {
                id: true,
                courseCode: true,
                courseName: true
            },
            orderBy: {
                courseCode: 'asc'
            }
        });

        // Get material counts manually since the above query is complex
        const coursesWithCounts = await Promise.all(
            courses.map(async (course) => {
                const materialCount = await prisma.lectureMaterial.count({
                    where: {
                        lecturerId: auth.lecturerId,
                        code: course.courseCode
                    }
                });

                return {
                    id: course.id,
                    courseCode: course.courseCode,
                    courseName: course.courseName,
                    materialCount
                };
            })
        );

        return NextResponse.json({
            success: true,
            data: coursesWithCounts,
            message: `Found ${coursesWithCounts.length} courses`
        });

    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch courses'
        }, { status: 500 });
    }
}