-- Add sold field to Product table
ALTER TABLE "Product" ADD COLUMN "sold" BOOLEAN NOT NULL DEFAULT false;

-- Add photos array field to Product table
ALTER TABLE "Product" ADD COLUMN "photos" TEXT[] DEFAULT '{}';

-- Add representativePhotoIndex field to Product table
ALTER TABLE "Product" ADD COLUMN "representativePhotoIndex" INTEGER NOT NULL DEFAULT 0; 