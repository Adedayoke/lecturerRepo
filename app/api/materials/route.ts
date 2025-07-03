// app/api/materials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { ApiResponse, LectureMaterial } from '@/lib/types';
import { uploadToCloudinary } from '@/lib/cloudinary';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to extract lecturer ID from token
async function getLecturerFromToken(request: NextRequest): Promise<{ lecturerId: number } | null> {
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

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<LectureMaterial[]>>> {
    try {
        const { searchParams } = new URL(request.url);
        const lecturerId = searchParams.get('lecturerId');
        const code = searchParams.get('code');
        
        // Build where clause based on params
        let whereClause: any = {};
        if (lecturerId) {
            whereClause.lecturerId = parseInt(lecturerId);
        }
        if (code) {
            whereClause.code = code;
        }
        
        const materials = await prisma.lectureMaterial.findMany({
            where: whereClause,
            include: {
                lecturer: {
                    select: {
                        title: true,
                        firstName: true,
                        lastName: true,
                        pfNumber: true
                    }
                }
            },
            orderBy: { uploadDate: 'desc' }
        });
        
        return NextResponse.json({
            success: true,
            data: materials
        });
    } catch (error) {
        console.error('Error fetching materials:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch materials'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<LectureMaterial>>> {
    try {
        // Get lecturer from token
        const auth = await getLecturerFromToken(request);
        if (!auth) {
            return NextResponse.json({
                success: false,
                error: 'Authentication required'
            }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string;
        const subject = formData.get('subject') as string;
        const code = formData.get('code') as string;

        if (!file) {
            return NextResponse.json({
                success: false,
                error: 'No file uploaded'
            }, { status: 400 });
        }

        if (!title || !subject || !code) {
            return NextResponse.json({
                success: false,
                error: 'Title, subject and code are required'
            }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt'];
        const fileExt = path.extname(file.name).toLowerCase();
        
        if (!allowedTypes.includes(fileExt)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, TXT allowed'
            }, { status: 400 });
        }

        // Check file size (10MB limit)
        const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760');
        if (file.size > maxSize) {
            return NextResponse.json({
                success: false,
                error: 'File too large'
            }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(buffer, file.name);

        // Use transaction to create material and auto-assign course
        const result = await prisma.$transaction(async (tx) => {
            // Create the lecture material
            const material = await tx.lectureMaterial.create({
                data: {
                    title,
                    subject,
                    code,
                    filename: file.name,
                    filepath: cloudinaryResult.secure_url, // Store Cloudinary URL instead of local path
                    fileSize: file.size,
                    fileType: fileExt,
                    lecturerId: auth.lecturerId
                }
            });

            // Check if lecturer already has this course assigned
            const existingCourse = await tx.lecturerCourse.findFirst({
                where: {
                    lecturerId: auth.lecturerId,
                    courseCode: code
                }
            });

            // If course doesn't exist for this lecturer, create it
            if (!existingCourse) {
                await tx.lecturerCourse.create({
                    data: {
                        lecturerId: auth.lecturerId,
                        courseCode: code,
                        courseName: subject // Using subject as course name
                    }
                });
            }

            return material;
        });

        // Fetch the created material with lecturer info for response
        const materialWithLecturer = await prisma.lectureMaterial.findUnique({
            where: { id: result.id },
            include: {
                lecturer: {
                    select: {
                        title: true,
                        firstName: true,
                        lastName: true,
                        pfNumber: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: materialWithLecturer!,
            message: 'File uploaded successfully to Cloudinary and course auto-assigned'
        }, { status: 201 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to upload file'
        }, { status: 500 });
    }
}