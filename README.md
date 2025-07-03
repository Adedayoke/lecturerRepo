# Lecturer Material Storage App

A modern web application for lecturers to securely upload, manage, and share course materials, built with Next.js, Prisma, and Cloudinary.

---

## 🚀 Features
- **Lecturer authentication** (login, protected routes)
- **Admin-only lecturer creation**
- **Upload lecture materials** (PDF, DOC, PPT, TXT, etc.)
- **Cloudinary cloud storage** (no local files)
- **Organize by course** (auto-assigns courses)
- **Search and filter materials**
- **Download and view files**
- **Delete your own files** (with confirmation)
- **Responsive, modern UI**

---

## 🛠️ Getting Started

### 1. **Clone the Repository**
```bash
git clone <repo-url>
cd client
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Set Up Environment Variables**
Create a `.env.local` file in the `client/` directory with the following:
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MAX_FILE_SIZE=10485760
```
- Get your Cloudinary credentials from [cloudinary.com](https://cloudinary.com/)
- Set a strong `JWT_SECRET`

### 4. **Run Database Migrations**
```bash
npx prisma migrate deploy
```

### 5. **Start the App**
```bash
npm run dev
```
- The app will be available at [http://localhost:3000](http://localhost:3000)

---

## 🧭 Navigation Guide

### **Login**
- Go to `/login` to sign in as a lecturer.
- Only existing lecturers can log in. New lecturers must be created by an admin/lecturer.

### **Dashboard (Home)**
- View all available materials.
- Search for materials by title, subject, or course code.
- Download or view files directly in your browser.
- Delete your own files (if you are the uploader).

### **Courses**
- Go to `/courses` to see all your assigned courses.
- Click a course to view all materials for that course.

### **Upload Material**
- Use the upload button (usually in the header or sidebar) to upload new materials.
- Fill in the title, subject, course code, and select a file.
- Only supported file types and sizes are allowed.

### **Logout**
- Use the logout button in the sidebar or header to securely sign out.

---

## 📝 Notes for Lecturers & Reviewers
- **All files are stored securely on Cloudinary.**
- **Only authenticated lecturers can upload, view, or delete materials.**
- **Lecturer creation is restricted to authenticated users (no public signup).**
- **Each file is auto-assigned to a course based on the course code.**
- **Deleting a file removes it from both the app and Cloudinary.**
- **Legacy local file support has been removed for security and scalability.**

---

## 📚 Tech Stack
- **Frontend/Backend:** Next.js (App Router)
- **Database:** Prisma + SQLite (easy to switch to PostgreSQL/MySQL)
- **Cloud Storage:** Cloudinary
- **Authentication:** JWT (HTTP-only cookies)
- **UI:** React, Tailwind CSS, MUI Icons

---

## 💡 Tips
- For best results, use Google Chrome or Microsoft Edge.
- If you encounter any issues, check the browser console and server logs.
- To add new lecturers, log in as an existing lecturer and use the "Add Lecturer" feature (if enabled).

---

## 👨‍🏫 For Your Lecturer/Reviewer
- This project demonstrates secure file management, cloud integration, and modern web development best practices.
- All code is well-commented and modular for easy review.
- Please see the codebase for further documentation and comments.

---

**Thank you for reviewing this project!**

If you have any questions or need a walkthrough, please contact the developer.
