// app/api/materials/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ApiResponse, LectureMaterial } from '@/lib/types';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<LectureMaterial[]>>> {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query');
        
        let whereClause: any = {};
        
        if (query) {
            // Search across multiple fields: title, code, and subject
            // Convert query to lowercase for case-insensitive search
            const lowerQuery = query.toLowerCase();
            
            whereClause.OR = [
                {
                    title: {
                        contains: lowerQuery
                    }
                },
                {
                    code: {
                        contains: lowerQuery
                    }
                },
                {
                    subject: {
                        contains: lowerQuery
                    }
                }
            ];
        }
        
        // If specific subject filter is provided, add it as an AND condition

        const materials = await prisma.lectureMaterial.findMany({
            where: whereClause,
            orderBy: { uploadDate: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: materials
        });
    } catch (error) {
        console.error('Error searching materials:', error);
        return NextResponse.json({
            success: false,
            error: 'Search failed'
        }, { status: 500 });
    }
}