-- This is an empty migration.

-- Reemplazamos la función existente por esta versión mejorada y a prueba de nulos.
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('spanish', coalesce(NEW.name, '')), 'A') ||
        setweight(to_tsvector('spanish', coalesce(NEW.description, '')), 'B') ||
        setweight(to_tsvector('spanish', coalesce((SELECT name FROM "Brand" WHERE id = NEW."brandId"), '')), 'C') ||
        setweight(to_tsvector('spanish', coalesce((SELECT name FROM "Category" WHERE id = NEW."categoryId"), '')), 'C') ||
        setweight(to_tsvector('simple', CAST(NEW.id AS TEXT)), 'A');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

UPDATE "Product" SET "search_vector" = 
    setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce((SELECT name FROM "Brand" WHERE id = "brandId"), '')), 'C') ||
    setweight(to_tsvector('spanish', coalesce((SELECT name FROM "Category" WHERE id = "categoryId"), '')), 'C') ||
    setweight(to_tsvector('simple', CAST(id AS TEXT)), 'A')
WHERE "search_vector" IS NULL;