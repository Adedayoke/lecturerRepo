// app/api/lecturer/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { ApiResponse } from '@/lib/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

interface LoginRequest {
  username: string;
  password: string;
}

interface LecturerResponse {
  id: string;
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

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<LecturerResponse>>> {
  try {
    const { username, password }: LoginRequest = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Username and password are required'
      }, { status: 400 });
    }

    // Find lecturer by username (could be pfNumber or email)
    const lecturer = await prisma.lecturer.findFirst({
      where: {
        OR: [
          { pfNumber: username },
          { email: username }
        ]
      },
      include: {
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
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, lecturer.password);
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        lecturerId: lecturer.id,
        pfNumber: lecturer.pfNumber 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    // Prepare response data (exclude sensitive information)
    const responseData: LecturerResponse = {
      id: lecturer.id.toString(),
      pfNumber: lecturer.pfNumber,
      title: lecturer.title,
      firstName: lecturer.firstName || undefined,
      lastName: lecturer.lastName || undefined,
      courses: lecturer.lecturerCourses || undefined
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Login failed'
    }, { status: 500 });
  }
}