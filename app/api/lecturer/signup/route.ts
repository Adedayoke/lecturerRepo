// app/api/lecturer/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { ApiResponse } from '@/lib/types';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface SignupRequest {
  pfNumber: string;
  title: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password: string;
}

interface LecturerResponse {
  id: string;
  pfNumber: string;
  title: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  courses?: Array<{
    id: number;
    courseCode: string;
    courseName: string;
  }>;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<LecturerResponse>>> {
  try {
    // Require authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired token'
      }, { status: 401 });
    }

    const { 
      pfNumber, 
      title, 
      firstName, 
      lastName, 
      email, 
      password
    }: SignupRequest = await request.json();

    // Validate required fields
    if (!pfNumber || !title || !password) {
      return NextResponse.json({
        success: false,
        error: 'PF Number, title, and password are required'
      }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 6 characters long'
      }, { status: 400 });
    }

    // Check if lecturer already exists
    const existingLecturer = await prisma.lecturer.findFirst({
      where: {
        OR: [
          { pfNumber },
          ...(email ? [{ email }] : [])
        ]
      }
    });

    if (existingLecturer) {
      return NextResponse.json({
        success: false,
        error: 'Lecturer with this PF Number or email already exists'
      }, { status: 409 });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create lecturer
    const newLecturer = await prisma.lecturer.create({
      data: {
        pfNumber,
        title,
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        password: hashedPassword
      }
    });

    // Prepare response data (exclude password)
    const responseData: LecturerResponse = {
      id: newLecturer.id.toString(),
      pfNumber: newLecturer.pfNumber,
      title: newLecturer.title,
      firstName: newLecturer.firstName || undefined,
      lastName: newLecturer.lastName || undefined,
      email: newLecturer.email || undefined,
      courses: undefined // Courses will be auto-generated when materials are uploaded
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      message: 'Lecturer account created successfully. Courses will be auto-assigned when you upload materials.'
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Account creation failed'
    }, { status: 500 });
  }
}