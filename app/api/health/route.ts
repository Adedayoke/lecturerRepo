// app/api/health/route.ts
import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';

export async function GET(): Promise<NextResponse<ApiResponse>> {
    return NextResponse.json({
        success: true,
        data: {
            message: 'Lecture Materials Repository API',
            version: '1.0.0',
            status: 'healthy',
            timestamp: new Date().toISOString()
        }
    });
}