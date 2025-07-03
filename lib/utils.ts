import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function setToStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function getFromStorage(key: string) {
  return localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key)!)
    : null;
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Convert a course code to a URL-friendly slug
 * Handles spaces, special characters, and maintains readability
 */
export function slugifyCourseCode(courseCode: string): string {
  return courseCode
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace one or more spaces with single hyphen
    .replace(/[^a-z0-9-]/g, '') // Remove all characters except letters, numbers, and hyphens
    .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading and trailing hyphens
}

/**
 * Convert a slug back to a readable course code
 * Restores proper formatting and capitalization
 */
export function deslugifyCourseCode(slug: string): string {
  return slug
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .toUpperCase() // Convert to uppercase for course codes
    .trim();
}

/**
 * Format a course code for display (handles various input formats)
 */
export function formatCourseCodeForDisplay(courseCode: string): string {
  // If it's already in slug format, deslugify it
  if (courseCode.includes('-')) {
    return deslugifyCourseCode(courseCode);
  }
  
  // Otherwise, just ensure proper formatting
  return courseCode.toUpperCase().trim();
}
