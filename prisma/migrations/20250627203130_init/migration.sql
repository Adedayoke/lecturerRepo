-- CreateTable
CREATE TABLE "LectureMaterial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "LectureMaterial_subject_idx" ON "LectureMaterial"("subject");

-- CreateIndex
CREATE INDEX "LectureMaterial_title_idx" ON "LectureMaterial"("title");

-- CreateIndex
CREATE INDEX "LectureMaterial_code_idx" ON "LectureMaterial"("code");
