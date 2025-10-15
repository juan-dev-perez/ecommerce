import { Brand, Category, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Función de utilidad para "slugificar" texto.
// Convierte "Laptop Gamer XYZ" en "laptop-gamer-xyz"
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, ''); // Elimina caracteres extraños
}

async function main() {
  console.log('🌱 Empezando el proceso de seeding...');

  // 1. Limpiar la base de datos
  console.log('🧹 Limpiando la base de datos...');
  await prisma.image.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();
  console.log('🗑️ Base de datos limpiada.');

  // 2. Crear Marcas
  console.log('🏭 Creando 5 marcas...');
  const brands: Brand[] = [];
  for (let i = 0; i < 5; i++) {
    const companyName = faker.company.name();
    const brand = await prisma.brand.create({
      data: {
        name: companyName,
        slug: slugify(companyName), // Slug simple para la marca
        logo: `https://picsum.photos/seed/${slugify(companyName )}/200/200`,
      },
    });
    brands.push(brand);
  }
  console.log(`✨ Creadas ${brands.length} marcas.`);

  // ... (el resto del código, como la limpieza y la creación de marcas, sigue igual) ...

// 3. Crear Categorías con Jerarquía (CORREGIDO)
console.log('📚 Creando categorías con jerarquía...');
const allCategories: Category[] = [];

// Función interna para crear una categoría con slug único
const createUniqueCategory = async (baseName: string, parentId: number | null = null) => {
  // Añadimos un fragmento aleatorio para garantizar la unicidad del nombre
  const uniqueName = `${baseName} ${faker.string.uuid().slice(0, 4)}`;
  const category = await prisma.category.create({
    data: {
      name: baseName, // Guardamos el nombre limpio
      slug: slugify(uniqueName), // Creamos el slug a partir del nombre único
      parentId: parentId,
    },
  });
  return category;
};

const numRootCategories = 5;
console.log(`  - Creando ${numRootCategories} categorías raíz...`);
for (let i = 0; i < numRootCategories; i++) {
  const department = faker.commerce.department();
  const category = await createUniqueCategory(department);
  allCategories.push(category);
}

const numLevel2Categories = 8;
console.log(`  - Creando ${numLevel2Categories} subcategorías (nivel 2)...`);
for (let i = 0; i < numLevel2Categories; i++) {
  const productAdjective = faker.commerce.productAdjective();
  const parentCategory = faker.helpers.arrayElement(allCategories);
  const category = await createUniqueCategory(`${productAdjective} Items`, parentCategory.id);
  allCategories.push(category);
}

const numLevel3Categories = 10;
console.log(`  - Creando ${numLevel3Categories} sub-subcategorías (nivel 3)...`);
for (let i = 0; i < numLevel3Categories; i++) {
  const material = faker.commerce.productMaterial();
  const parentCategory = faker.helpers.arrayElement(allCategories);
  const category = await createUniqueCategory(material, parentCategory.id);
  allCategories.push(category);
}
console.log(`✨ Creadas un total de ${allCategories.length} categorías.`);

// ... (la creación de productos sigue igual) ...


  // 4. Crear 100 Productos con la nueva lógica de Slugs
  console.log('📦 Creando 100 productos con slugs predecibles...');
  for (let i = 0; i < 100; i++) {
    const productName = faker.commerce.productName();
    const discountPercentageValue = faker.helpers.maybe(() => parseFloat(faker.number.float({ min: 5, max: 70 }).toFixed(2)), { probability: 0.3 });

    // Paso 4.1: Crear el producto con un slug temporal
    const createdProduct = await prisma.product.create({
      data: {
        name: productName,
        slug: `temp-slug-${i}`, // Slug temporal que será sobrescrito
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 20, max: 2000 })),
        stock: faker.number.int({ min: 0, max: 250 }),
        isActive: faker.datatype.boolean(0.95),
        brandId: faker.helpers.maybe(() => faker.helpers.arrayElement(brands).id, { probability: 0.8 }),
        categoryId: faker.helpers.maybe(() => faker.helpers.arrayElement(allCategories).id, { probability: 0.85 }),
        cost: faker.helpers.maybe(() => parseFloat(faker.commerce.price({ min: 10, max: 1000 })), { probability: 0.7 }),
        promotionalPrice: faker.helpers.maybe(() => parseFloat(faker.commerce.price({ min: 15, max: 1800 })), { probability: 0.3 }),
        discountPercentage: discountPercentageValue,
        images: {
          create: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map((_, index) => ({
            url: `https://picsum.photos/seed/${slugify(productName )}-${index}/640/480`,
          })),
        },
      },
    });

    // Paso 4.2: Construir el slug final ahora que tenemos el ID
    const finalSlug = `${createdProduct.id}-${slugify(createdProduct.name)}`;

    // Paso 4.3: Actualizar el producto con su slug final
    await prisma.product.update({
      where: { id: createdProduct.id },
      data: { slug: finalSlug },
    });
  }
  console.log('✨ Creados 100 productos.');

  console.log('✅ Seeding completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    if (e.code) {
      console.error('Código de error de Prisma:', e.code);
      console.error('Meta del error:', e.meta);
    }
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
