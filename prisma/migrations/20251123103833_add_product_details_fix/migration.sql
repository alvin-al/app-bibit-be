-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "age" TEXT,
ADD COLUMN     "specifications" JSONB,
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'Pcs';
