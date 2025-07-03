// app/api/materials/[id]/download/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: NextRequest, 
    { params }: RouteParams
): Promise<NextResponse | Response> {
    try {
        const { id } = await params;
        const materialId = parseInt(id);
        
        const material = await prisma.lectureMaterial.findUnique({
            where: { id: materialId }
        });

        if (!material) {
            return NextResponse.json({
                success: false,
                error: 'Material not found'
            }, { status: 404 });
        }

        // Only handle Cloudinary URLs
        if (material.filepath.startsWith('http')) {
            // Redirect to Cloudinary URL for download
            return NextResponse.redirect(material.filepath);
        } else {
            // Legacy local files are no longer supported
            return NextResponse.json({
                success: false,
                error: 'This file is no longer available. Please contact the administrator.'
            }, { status: 410 }); // 410 Gone - resource no longer available
        }
    } catch (error) {
        console.error('Error downloading file:', error);
        return NextResponse.json({
            success: false,
            error: 'Download failed'
        }, { status: 500 });
    }
}
