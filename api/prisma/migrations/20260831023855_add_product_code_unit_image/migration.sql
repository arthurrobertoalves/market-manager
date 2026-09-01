-- AlterTable
ALTER TABLE "products" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'UN';

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");
