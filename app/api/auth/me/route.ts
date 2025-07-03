// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { ApiResponse } from '@/lib/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface Lecturer {
  id: number;
  pfNumber: string;
  title: string;
  firstName?: string;
  lastName?: string;
  courses?: Array<{
    id: number;
    courseCode: string;
    courseName: string;
  }>;
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Lecturer>>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No authentication token found'
      }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 401 });
    }

    // Get lecturer details from database
    const lecturer = await prisma.lecturer.findUnique({
      where: { id: decoded.lecturerId },
      select: {
        id: true,
        pfNumber: true,
        title: true,
        firstName: true,
        lastName: true,
        lecturerCourses: {
          select: {
            id: true,
            courseCode: true,
            courseName: true
          }
        }
      }
    });

    if (!lecturer) {
      return NextResponse.json({
        success: false,
        error: 'Lecturer not found'
      }, { status: 404 });
    }

    // Format the response
    const lecturerData: Lecturer = {
      id: lecturer.id,
      pfNumber: lecturer.pfNumber,
      title: lecturer.title,
      firstName: lecturer.firstName || undefined,
      lastName: lecturer.lastName || undefined,
      courses: lecturer.lecturerCourses || undefined
    };

    return NextResponse.json({
      success: true,
      data: lecturerData
    });
  } catch (error) {
    console.error('Error fetching lecturer details:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}