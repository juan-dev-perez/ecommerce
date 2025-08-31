import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.image.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const createdCategories = await prisma.category.createMany({
    data: [
      { name: 'microprocesadores', slug: 'microprocesadores' },
      { name: 'motherboards', slug: 'motherboards' },
      { name: 'memoria ram',slug: 'memoria-ram' },
      { name: 'almacenamiento', slug: 'almacenamiento' },
      { name: 'fuentes de poder', slug: 'fuentes-de-poder' },
    ],
  });

  const allCategories = await prisma.category.findMany();

  const imageUrls = [
    'https://picsum.photos/id/0/5000/3333',
    'https://picsum.photos/id/1/5000/3333',
    'https://picsum.photos/id/2/5000/3333',
    'https://picsum.photos/id/3/5000/3333',
    'https://picsum.photos/id/4/5000/3333',
    'https://picsum.photos/id/5/5000/3334',
    'https://picsum.photos/id/6/5000/3333',
    'https://picsum.photos/id/7/4728/3168',
    'https://picsum.photos/id/8/5000/3333',
    'https://picsum.photos/id/9/5000/3269',
    'https://picsum.photos/id/10/2500/1667',
    'https://picsum.photos/id/11/2500/1667',
    'https://picsum.photos/id/12/2500/1667',
    'https://picsum.photos/id/13/2500/1667',
    'https://picsum.photos/id/14/2500/1667',
    'https://picsum.photos/id/15/2500/1667',
    'https://picsum.photos/id/16/2500/1667',
    'https://picsum.photos/id/17/2500/1667',
    'https://picsum.photos/id/18/2500/1667',
    'https://picsum.photos/id/19/2500/1667',
    'https://picsum.photos/id/20/3670/2462',
    'https://picsum.photos/id/21/3008/2008',
    'https://picsum.photos/id/22/4434/3729',
    'https://picsum.photos/id/23/3887/4899',
    'https://picsum.photos/id/24/4855/1803',
    'https://picsum.photos/id/25/5000/3333',
    'https://picsum.photos/id/26/4209/2769',
    'https://picsum.photos/id/27/3264/1836',
    'https://picsum.photos/id/28/4928/3264',
    'https://picsum.photos/id/29/4000/2670',
  ];

  for (let i = 1; i <= 50; i++) {
    const randomCategory =
      allCategories[Math.floor(Math.random() * allCategories.length)];

    await prisma.product.create({
      data: {
        name: `Producto Gamer ${i}`,
        slug: `producto-gamer-${i}`,
        description: `Descripción del producto gamer número ${i}`,
        price: parseFloat((Math.random() * 100000 + 10000).toFixed(2)),
        stock: Math.floor(Math.random() * 50) + 1,
        discountPercentage:
          Math.random() > 0.5
            ? parseFloat((Math.random() * 30).toFixed(2))
            : null,
        isActive: true,
        categories: {
          connect: [{ id: randomCategory.id }],
        },
        images: {
          create: [
            {
              url: imageUrls[Math.floor(Math.random() * imageUrls.length)],
            },
          ],
        },
      },
    });
  }
}

// const productos = [
//   {
//     name: 'Producto Gamer 1',
//     slug: 'producto-gamer-1',
//     description:
//       'Descripci\u00f3n del producto gamer 1, ideal para setups de alto rendimiento.',
//     price: '996.61',
//     stock: 54,
//     category: 'memoria ram',
//     discountPercentage: '13.59',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/23/3887/4899',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 2',
//     slug: 'producto-gamer-2',
//     description:
//       'Descripci\u00f3n del producto gamer 2, ideal para setups de alto rendimiento.',
//     price: '215.89',
//     stock: 66,
//     category: 'almacenamiento',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/18/2500/1667',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 3',
//     slug: 'producto-gamer-3',
//     description:
//       'Descripci\u00f3n del producto gamer 3, ideal para setups de alto rendimiento.',
//     price: '1035.22',
//     stock: 68,
//     category: 'memoria ram',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/23/3887/4899',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 4',
//     slug: 'producto-gamer-4',
//     description:
//       'Descripci\u00f3n del producto gamer 4, ideal para setups de alto rendimiento.',
//     price: '1397.09',
//     stock: 72,
//     category: 'memoria ram',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/7/4728/3168',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 5',
//     slug: 'producto-gamer-5',
//     description:
//       'Descripci\u00f3n del producto gamer 5, ideal para setups de alto rendimiento.',
//     price: '749.57',
//     stock: 39,
//     category: 'motherboards',
//     discountPercentage: '23.02',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/14/2500/1667',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 6',
//     slug: 'producto-gamer-6',
//     description:
//       'Descripci\u00f3n del producto gamer 6, ideal para setups de alto rendimiento.',
//     price: '431.07',
//     stock: 31,
//     category: 'almacenamiento',
//     discountPercentage: '15.64',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/24/4855/1803',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 7',
//     slug: 'producto-gamer-7',
//     description:
//       'Descripci\u00f3n del producto gamer 7, ideal para setups de alto rendimiento.',
//     price: '516.77',
//     stock: 20,
//     category: 'fuentes de poder',
//     discountPercentage: '1.02',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/27/3264/1836',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 8',
//     slug: 'producto-gamer-8',
//     description:
//       'Descripci\u00f3n del producto gamer 8, ideal para setups de alto rendimiento.',
//     price: '295.37',
//     stock: 44,
//     category: 'almacenamiento',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/10/2500/1667',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 9',
//     slug: 'producto-gamer-9',
//     description:
//       'Descripci\u00f3n del producto gamer 9, ideal para setups de alto rendimiento.',
//     price: '94.62',
//     stock: 25,
//     category: 'almacenamiento',
//     discountPercentage: '23.72',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/17/2500/1667',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 10',
//     slug: 'producto-gamer-10',
//     description:
//       'Descripci\u00f3n del producto gamer 10, ideal para setups de alto rendimiento.',
//     price: '741.4',
//     stock: 10,
//     category: 'memoria ram',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/25/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 11',
//     slug: 'producto-gamer-11',
//     description:
//       'Descripci\u00f3n del producto gamer 11, ideal para setups de alto rendimiento.',
//     price: '1245.6',
//     stock: 46,
//     category: 'fuentes de poder',
//     discountPercentage: '9.99',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/2/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 12',
//     slug: 'producto-gamer-12',
//     description:
//       'Descripci\u00f3n del producto gamer 12, ideal para setups de alto rendimiento.',
//     price: '841.2',
//     stock: 23,
//     category: 'memoria ram',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/26/4209/2769',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 13',
//     slug: 'producto-gamer-13',
//     description:
//       'Descripci\u00f3n del producto gamer 13, ideal para setups de alto rendimiento.',
//     price: '334.05',
//     stock: 95,
//     category: 'motherboards',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/5/5000/3334',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 14',
//     slug: 'producto-gamer-14',
//     description:
//       'Descripci\u00f3n del producto gamer 14, ideal para setups de alto rendimiento.',
//     price: '820.33',
//     stock: 22,
//     category: 'motherboards',
//     discountPercentage: '17.42',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/17/2500/1667',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 15',
//     slug: 'producto-gamer-15',
//     description:
//       'Descripci\u00f3n del producto gamer 15, ideal para setups de alto rendimiento.',
//     price: '620.91',
//     stock: 99,
//     category: 'fuentes de poder',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/27/3264/1836',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 16',
//     slug: 'producto-gamer-16',
//     description:
//       'Descripci\u00f3n del producto gamer 16, ideal para setups de alto rendimiento.',
//     price: '1030.58',
//     stock: 5,
//     category: 'microprocesadores',
//     discountPercentage: '20.64',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/24/4855/1803',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 17',
//     slug: 'producto-gamer-17',
//     description:
//       'Descripci\u00f3n del producto gamer 17, ideal para setups de alto rendimiento.',
//     price: '1341.82',
//     stock: 30,
//     category: 'memoria ram',
//     discountPercentage: '2.38',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/8/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 18',
//     slug: 'producto-gamer-18',
//     description:
//       'Descripci\u00f3n del producto gamer 18, ideal para setups de alto rendimiento.',
//     price: '387.47',
//     stock: 42,
//     category: 'memoria ram',
//     discountPercentage: '1.79',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/0/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 19',
//     slug: 'producto-gamer-19',
//     description:
//       'Descripci\u00f3n del producto gamer 19, ideal para setups de alto rendimiento.',
//     price: '959.29',
//     stock: 6,
//     category: 'microprocesadores',
//     discountPercentage: '21.58',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/9/5000/3269',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 20',
//     slug: 'producto-gamer-20',
//     description:
//       'Descripci\u00f3n del producto gamer 20, ideal para setups de alto rendimiento.',
//     price: '1165.08',
//     stock: 40,
//     category: 'fuentes de poder',
//     discountPercentage: '1.24',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/3/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 21',
//     slug: 'producto-gamer-21',
//     description:
//       'Descripci\u00f3n del producto gamer 21, ideal para setups de alto rendimiento.',
//     price: '1278.27',
//     stock: 43,
//     category: 'microprocesadores',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/7/4728/3168',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 22',
//     slug: 'producto-gamer-22',
//     description:
//       'Descripci\u00f3n del producto gamer 22, ideal para setups de alto rendimiento.',
//     price: '770.09',
//     stock: 35,
//     category: 'microprocesadores',
//     discountPercentage: '20.89',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/23/3887/4899',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 23',
//     slug: 'producto-gamer-23',
//     description:
//       'Descripci\u00f3n del producto gamer 23, ideal para setups de alto rendimiento.',
//     price: '755.13',
//     stock: 15,
//     category: 'memoria ram',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/19/2500/1667',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 24',
//     slug: 'producto-gamer-24',
//     description:
//       'Descripci\u00f3n del producto gamer 24, ideal para setups de alto rendimiento.',
//     price: '155.71',
//     stock: 41,
//     category: 'motherboards',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/7/4728/3168',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 25',
//     slug: 'producto-gamer-25',
//     description:
//       'Descripci\u00f3n del producto gamer 25, ideal para setups de alto rendimiento.',
//     price: '217.28',
//     stock: 86,
//     category: 'motherboards',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/25/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 26',
//     slug: 'producto-gamer-26',
//     description:
//       'Descripci\u00f3n del producto gamer 26, ideal para setups de alto rendimiento.',
//     price: '607.25',
//     stock: 23,
//     category: 'motherboards',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/13/2500/1667',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 27',
//     slug: 'producto-gamer-27',
//     description:
//       'Descripci\u00f3n del producto gamer 27, ideal para setups de alto rendimiento.',
//     price: '774.73',
//     stock: 43,
//     category: 'almacenamiento',
//     discountPercentage: '14.74',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/1/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 28',
//     slug: 'producto-gamer-28',
//     description:
//       'Descripci\u00f3n del producto gamer 28, ideal para setups de alto rendimiento.',
//     price: '370.15',
//     stock: 11,
//     category: 'microprocesadores',
//     discountPercentage: '3.07',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/22/4434/3729',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 29',
//     slug: 'producto-gamer-29',
//     description:
//       'Descripci\u00f3n del producto gamer 29, ideal para setups de alto rendimiento.',
//     price: '662.07',
//     stock: 40,
//     category: 'microprocesadores',
//     discountPercentage: '12.57',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/15/2500/1667',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 30',
//     slug: 'producto-gamer-30',
//     description:
//       'Descripci\u00f3n del producto gamer 30, ideal para setups de alto rendimiento.',
//     price: '771.72',
//     stock: 39,
//     category: 'fuentes de poder',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/1/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 31',
//     slug: 'producto-gamer-31',
//     description:
//       'Descripci\u00f3n del producto gamer 31, ideal para setups de alto rendimiento.',
//     price: '1141.97',
//     stock: 91,
//     category: 'fuentes de poder',
//     discountPercentage: '24.99',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/23/3887/4899',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 32',
//     slug: 'producto-gamer-32',
//     description:
//       'Descripci\u00f3n del producto gamer 32, ideal para setups de alto rendimiento.',
//     price: '80.11',
//     stock: 53,
//     category: 'fuentes de poder',
//     discountPercentage: '6.73',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/27/3264/1836',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 33',
//     slug: 'producto-gamer-33',
//     description:
//       'Descripci\u00f3n del producto gamer 33, ideal para setups de alto rendimiento.',
//     price: '707.61',
//     stock: 78,
//     category: 'memoria ram',
//     discountPercentage: '3.6',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/10/2500/1667',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 34',
//     slug: 'producto-gamer-34',
//     description:
//       'Descripci\u00f3n del producto gamer 34, ideal para setups de alto rendimiento.',
//     price: '165.44',
//     stock: 99,
//     category: 'almacenamiento',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/5/5000/3334',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 35',
//     slug: 'producto-gamer-35',
//     description:
//       'Descripci\u00f3n del producto gamer 35, ideal para setups de alto rendimiento.',
//     price: '957.91',
//     stock: 80,
//     category: 'almacenamiento',
//     discountPercentage: '7.19',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/27/3264/1836',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 36',
//     slug: 'producto-gamer-36',
//     description:
//       'Descripci\u00f3n del producto gamer 36, ideal para setups de alto rendimiento.',
//     price: '225.56',
//     stock: 10,
//     category: 'memoria ram',
//     discountPercentage: '8.84',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/10/2500/1667',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 37',
//     slug: 'producto-gamer-37',
//     description:
//       'Descripci\u00f3n del producto gamer 37, ideal para setups de alto rendimiento.',
//     price: '1228.79',
//     stock: 28,
//     category: 'memoria ram',
//     discountPercentage: '15.37',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/24/4855/1803',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 38',
//     slug: 'producto-gamer-38',
//     description:
//       'Descripci\u00f3n del producto gamer 38, ideal para setups de alto rendimiento.',
//     price: '567.42',
//     stock: 98,
//     category: 'motherboards',
//     discountPercentage: '4.4',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/8/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 39',
//     slug: 'producto-gamer-39',
//     description:
//       'Descripci\u00f3n del producto gamer 39, ideal para setups de alto rendimiento.',
//     price: '1053.54',
//     stock: 71,
//     category: 'almacenamiento',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/12/2500/1667',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 40',
//     slug: 'producto-gamer-40',
//     description:
//       'Descripci\u00f3n del producto gamer 40, ideal para setups de alto rendimiento.',
//     price: '1058.37',
//     stock: 98,
//     category: 'almacenamiento',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/2/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 41',
//     slug: 'producto-gamer-41',
//     description:
//       'Descripci\u00f3n del producto gamer 41, ideal para setups de alto rendimiento.',
//     price: '705.53',
//     stock: 66,
//     category: 'motherboards',
//     discountPercentage: '11.68',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/16/2500/1667',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 42',
//     slug: 'producto-gamer-42',
//     description:
//       'Descripci\u00f3n del producto gamer 42, ideal para setups de alto rendimiento.',
//     price: '299.75',
//     stock: 74,
//     category: 'fuentes de poder',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/23/3887/4899',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 43',
//     slug: 'producto-gamer-43',
//     description:
//       'Descripci\u00f3n del producto gamer 43, ideal para setups de alto rendimiento.',
//     price: '485.07',
//     stock: 36,
//     category: 'motherboards',
//     discountPercentage: '3.73',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/16/2500/1667',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 44',
//     slug: 'producto-gamer-44',
//     description:
//       'Descripci\u00f3n del producto gamer 44, ideal para setups de alto rendimiento.',
//     price: '437.26',
//     stock: 80,
//     category: 'almacenamiento',
//     discountPercentage: '21.14',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/25/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 45',
//     slug: 'producto-gamer-45',
//     description:
//       'Descripci\u00f3n del producto gamer 45, ideal para setups de alto rendimiento.',
//     price: '1028.67',
//     stock: 58,
//     category: 'motherboards',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/8/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 46',
//     slug: 'producto-gamer-46',
//     description:
//       'Descripci\u00f3n del producto gamer 46, ideal para setups de alto rendimiento.',
//     price: '191.59',
//     stock: 43,
//     category: 'fuentes de poder',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/28/4928/3264',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 47',
//     slug: 'producto-gamer-47',
//     description:
//       'Descripci\u00f3n del producto gamer 47, ideal para setups de alto rendimiento.',
//     price: '1158.85',
//     stock: 28,
//     category: 'fuentes de poder',
//     discountPercentage: '8.37',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/2/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 48',
//     slug: 'producto-gamer-48',
//     description:
//       'Descripci\u00f3n del producto gamer 48, ideal para setups de alto rendimiento.',
//     price: '474.28',
//     stock: 80,
//     category: 'fuentes de poder',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/4/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 49',
//     slug: 'producto-gamer-49',
//     description:
//       'Descripci\u00f3n del producto gamer 49, ideal para setups de alto rendimiento.',
//     price: '963.94',
//     stock: 11,
//     category: 'almacenamiento',
//     discountPercentage: '7.11',
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/2/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 50',
//     slug: 'producto-gamer-50',
//     description:
//       'Descripci\u00f3n del producto gamer 50, ideal para setups de alto rendimiento.',
//     price: '441.88',
//     stock: 48,
//     category: 'almacenamiento',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/4/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 51',
//     slug: 'producto-gamer-51',
//     description:
//       'Descripci\u00f3n del producto gamer 51, ideal para setups de alto rendimiento.',
//     price: '441.88',
//     stock: 48,
//     category: 'almacenamiento',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/4/5000/3333',
//         },
//       ],
//     },
//   },
//   {
//     name: 'Producto Gamer 52',
//     slug: 'producto-gamer-52',
//     description:
//       'Descripci\u00f3n del producto gamer 52, ideal para setups de alto rendimiento.',
//     price: '441.88',
//     stock: 48,
//     category: 'almacenamiento',
//     discountPercentage: null,
//     isActive: true,
//     images: {
//       create: [
//         {
//           url: 'https://picsum.photos/id/4/5000/3333',
//         },
//       ],
//     },
//   },
// ];

//   for (const product of productos) {
//     await prisma.product.create({
//       data: product,
//     });
//   }

//   console.log('🌱 Seed completado con éxito');
// }

main()
  .then(() => console.log())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
