// lib/middleware.ts
import { NextRequest } from 'next/server';

export function runMiddleware(req: any, res: any, fn: Function): Promise<any> {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

// Convert NextRequest to Node.js request format for multer
export function convertRequest(req: NextRequest, body: any): any {
    return {
        ...req,
        body,
        headers: Object.fromEntries(req.headers.entries()),
    };
}
