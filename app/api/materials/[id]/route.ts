// app/api/materials/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { deleteFromCloudinary } from '@/lib/cloudinary';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const materialId = parseInt(id);
    
    if (isNaN(materialId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid material ID'
      }, { status: 400 });
    }

    // Get file info from database
    const material = await prisma.lectureMaterial.findUnique({
      where: { id: materialId }
    });

    if (!material) {
      return NextResponse.json({
        success: false,
        error: 'File not found'
      }, { status: 404 });
    }

    // Only handle Cloudinary URLs
    if (material.filepath.startsWith('http')) {
      // Redirect to Cloudinary URL for viewing
      return NextResponse.redirect(material.filepath);
    } else {
      // Legacy local files are no longer supported
      return NextResponse.json({
        success: false,
        error: 'This file is no longer available. Please contact the administrator.'
      }, { status: 410 }); // 410 Gone - resource no longer available
    }

  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to serve file'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Get lecturer from token
    const auth = await getLecturerFromToken(request);
    if (!auth) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const { id } = await params;
    const materialId = parseInt(id);
    
    if (isNaN(materialId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid material ID'
      }, { status: 400 });
    }

    // Get material with lecturer info
    const material = await prisma.lectureMaterial.findUnique({
      where: { id: materialId },
      include: {
        lecturer: {
          select: {
            id: true,
            pfNumber: true
          }
        }
      }
    });

    if (!material) {
      return NextResponse.json({
        success: false,
        error: 'Material not found'
      }, { status: 404 });
    }

    // Check if the current lecturer owns this material
    if (material.lecturerId !== auth.lecturerId) {
      return NextResponse.json({
        success: false,
        error: 'You can only delete your own materials'
      }, { status: 403 });
    }

    // Delete from Cloudinary if it's a Cloudinary URL
    if (material.filepath.startsWith('http') && material.filepath.includes('cloudinary')) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = material.filepath.split('/');
        const publicId = urlParts[urlParts.length - 1].split('.')[0];
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await prisma.lectureMaterial.delete({
      where: { id: materialId }
    });

    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting material:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete material'
    }, { status: 500 });
  }
}