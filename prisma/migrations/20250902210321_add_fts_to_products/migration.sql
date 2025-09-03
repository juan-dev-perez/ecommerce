-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "search_vector" tsvector;

-- CreateIndex
CREATE INDEX "Product_search_vector_idx" ON "Product" USING GIN ("search_vector");

CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('spanish', coalesce(NEW.name, '')), 'A') ||
        setweight(to_tsvector('spanish', coalesce(NEW.description, '')), 'B') ||
        setweight(to_tsvector('spanish', (SELECT name FROM "Brand" WHERE id = NEW."brandId")), 'C') ||
        setweight(to_tsvector('spanish', (SELECT name FROM "Category" WHERE id = NEW."categoryId")), 'C') ||
        setweight(to_tsvector('simple', CAST(NEW.id AS TEXT)), 'A');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER product_search_vector_update
BEFORE INSERT OR UPDATE ON "Product"
FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

UPDATE "Product" SET "search_vector" = 
    setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('spanish', (SELECT name FROM "Brand" WHERE id = "brandId")), 'C') ||
    setweight(to_tsvector('spanish', (SELECT name FROM "Category" WHERE id = "categoryId")), 'C') ||
    setweight(to_tsvector('simple', CAST(id AS TEXT)), 'A');