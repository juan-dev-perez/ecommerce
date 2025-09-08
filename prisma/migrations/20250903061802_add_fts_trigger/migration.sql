CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('spanish', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple', NEW.id::text), 'A') ||
    setweight(to_tsvector('spanish', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('spanish', (
      SELECT b.name FROM "Brand" b WHERE b.id = NEW."brandId"
    )), 'C') ||
    setweight(to_tsvector('spanish', (
      SELECT c.name FROM "Category" c WHERE c.id = NEW."categoryId"
    )), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS product_search_vector_update ON "Product";
CREATE TRIGGER product_search_vector_update
BEFORE INSERT OR UPDATE ON "Product"
FOR EACH ROW
EXECUTE FUNCTION update_search_vector();
