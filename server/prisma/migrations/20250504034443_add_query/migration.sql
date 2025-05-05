-- CreateEnum
CREATE TYPE "QueryStatus" AS ENUM ('OPEN', 'RESOLVED');

-- AlterTable
ALTER TABLE "form_data" ADD CONSTRAINT "form_data_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Query" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "QueryStatus" NOT NULL DEFAULT 'OPEN',
    "formDataId" UUID NOT NULL,

    CONSTRAINT "Query_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Query_formDataId_key" ON "Query"("formDataId");

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_formDataId_fkey" FOREIGN KEY ("formDataId") REFERENCES "form_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
