import { Brand, Category, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Función de utilidad para crear slugs amigables para URLs
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, ''); // Elimina caracteres no alfanuméricos excepto guiones
}

async function main() {
  console.log('🌱 Empezando el proceso de seeding para tu schema...');

  // 1. Limpiar la base de datos en el orden correcto para evitar errores de restricción de clave foránea.
  console.log('🧹 Limpiando la base de datos...');
  // Los modelos con relaciones deben borrarse antes que los modelos de los que dependen.
  await prisma.image.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany(); // También limpiamos usuarios por si acaso.
  console.log('🗑️ Base de datos limpiada.');

  // 2. Crear exactamente 5 Marcas (Brands)
  console.log('🏭 Creando 5 marcas...');
  const brands: Brand[] = [];
  for (let i = 0; i < 5; i++) {
    const companyName = faker.company.name();
    const brandSlug = generateSlug(companyName); 
    const brand = await prisma.brand.create({
      data: {
        name: companyName,
        slug: generateSlug(companyName),
        logo: `https://picsum.photos/seed/${brandSlug}/200/200`,
        isActive: true,
      },
    });
    brands.push(brand);
  }
  console.log(`✨ Creadas ${brands.length} marcas.`);

  // 3. Crear entre 5 y 10 Categorías
  console.log('📚 Creando categorías...');
  const categories: Category[] = [];
  const numCategories = faker.number.int({ min: 5, max: 10 });
  for (let i = 0; i < numCategories; i++) {
    const department = faker.commerce.department();
    
    const categoryName = `${department} ${faker.string.uuid().slice(0, 4)}`;
    const categorySlug = generateSlug(categoryName);

    const category = await prisma.category.create({
      data: {
        name: department,
        slug: categorySlug,
        isActive: true,
      },
    });
    categories.push(category);
  }
  console.log(`✨ Creadas ${categories.length} categorías.`);

  // 4. Crear exactamente 48 Productos con sus Imágenes
  console.log('📦 Creando 48 productos con imágenes...');
  for (let i = 0; i < 48; i++) {
    const productName = faker.commerce.productName();
    // Creamos un slug único para evitar colisiones, añadiendo un trozo de UUID.
    const productSlug = generateSlug(`${productName}-${faker.string.uuid().slice(0, 8)}`);

    const discountPercentageValue = faker.helpers.maybe(() => {
        const floatValue = faker.number.float({ min: 5, max: 70 });
        return parseFloat(floatValue.toFixed(2)); // Redondea a 2 decimales
    }, { probability: 0.3 });
    
    // Crear el producto
    await prisma.product.create({
      data: {
        name: productName,
        slug: productSlug,
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 20, max: 2000 })),
        stock: faker.number.int({ min: 0, max: 250 }),
        isActive: faker.datatype.boolean(0.95), // 95% de probabilidad de ser activo

        // Asignar relaciones de forma opcional para simular datos del mundo real
        brandId: faker.helpers.maybe(() => faker.helpers.arrayElement(brands).id, { probability: 0.8 }), // 80% de los productos tendrán marca
        categoryId: faker.helpers.maybe(() => faker.helpers.arrayElement(categories).id, { probability: 0.85 }), // 85% tendrán categoría

        // Campos opcionales que pueden ser nulos
        cost: faker.helpers.maybe(() => parseFloat(faker.commerce.price({ min: 10, max: 1000 })), { probability: 0.7 }),
        promotionalPrice: faker.helpers.maybe(() => parseFloat(faker.commerce.price({ min: 15, max: 1800 })), { probability: 0.3 }),
        discountPercentage: discountPercentageValue,

        // Crear imágenes relacionadas directamente usando una transacción anidada
        images: {
          create: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map((_, index) => ({
            url: `https://picsum.photos/seed/${productSlug}${index}/640/480`,
            // Tu modelo Image no tiene 'alt', así que no lo incluimos.
          })),
        },
      },
    });
    // El trigger de la BD se encargará de rellenar 'search_vector' automáticamente en esta operación de creación.
  }
  console.log('✨ Creados 48 productos con sus imágenes.');

  console.log('✅ Seeding completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    // Código de depuración mejorado para errores de Prisma
    if (e.code) {
      console.error('Código de error de Prisma:', e.code);
      console.error('Meta del error:', e.meta);
    }
    process.exit(1);
  })
  .finally(async () => {
    // Asegura que la conexión a la base de datos se cierre siempre
    await prisma.$disconnect();
  });
