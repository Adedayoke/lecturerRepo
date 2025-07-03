// lib/types.ts
export interface LectureMaterial {
  id: number;
  title: string;
  subject: string;
  filename: string;
  filepath: string;
  fileSize: number;
  fileType: string;
  uploadDate: Date;
  code: string;
  lecturerId?: number;
  lecturer?: {
    title: string;
    firstName?: string | null;
    lastName?: string | null;
    pfNumber: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchParams {
  query?: string;
  subject?: string;
}

export type LecturerLoginType = {
  username: string;
  password: string;
} 

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  user?: T;
  data?: T;
}