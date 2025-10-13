import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProductDto,
  FilterProductPaginationDto,
  UpdateProductDto,
} from './dto';
import { generateSlug } from 'src/common/utils/generate-slug';
import { CategoriesService } from '../categories/categories.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(filters: FilterProductPaginationDto) {
    const { page, limit, category, brand, priceMin, priceMax, search, sortBy = 'createdAt', sortOrder = 'desc' } =
      filters;

    const conditions: Prisma.Sql[] = [Prisma.sql`"isActive" = true`];    

    // Inicio de filtros

    if (search) {
      const formattedQuery = search
        .trim()
        .split(' ')
        .filter(Boolean)
        .join(' & ');
      conditions.push(
        Prisma.sql`"search_vector" @@ to_tsquery('spanish', ${formattedQuery})`,
      );
    }

    if (category) {
      const categoryIds = await this.categoriesService
        .getCategoryAndDescendantIds(category)
        .catch((error) => {
          console.log(
            `Filtro por categoría no existente: ${category}. Devolviendo 0 resultados.`,
          );
          return [];
        });

      if (categoryIds.length === 0) {
        return { data: [], meta: { total: 0, page, lastPage: 1 } };
      }
      conditions.push(
        Prisma.sql`"categoryId" IN (${Prisma.join(categoryIds)})`,
      );
    }

    if (brand) {
      conditions.push(
        Prisma.sql`"brandId" = (SELECT "id" FROM "public"."Brand" WHERE "slug" = ${brand})`,
      );
    }

    if (priceMin) {
      conditions.push(Prisma.sql`"price" >= ${priceMin}`);
    }
    if (priceMax) {
      conditions.push(Prisma.sql`"price" <= ${priceMax}`);
    }

    // Fin de los filtros

    const whereClause = Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`;

    // Logica de ordenamiento

    const orderByMapping = {
      createdAt: Prisma.sql`"createdAt"`,
      price: Prisma.sql`"price"`,
      name: Prisma.sql`"name"`
    };

    const orderByColumn = orderByMapping[sortBy] || orderByMapping.createdAt;
    const orderByDirection = sortOrder === 'asc' ? Prisma.sql`ASC` : Prisma.sql`DESC`;
    const orderByClause = Prisma.sql`ORDER BY ${orderByColumn} ${orderByDirection}`;

    // Fin logica de ordenamiento

    const baseQuery = Prisma.sql`FROM "public"."Product" ${whereClause}`;
    const countQuery = Prisma.sql`SELECT COUNT(*) ${baseQuery}`;
    const dataQuery = Prisma.sql`SELECT "id" ${baseQuery} ${orderByClause} LIMIT ${limit} OFFSET ${(page - 1) * limit}`;

    const [totalResult, productsResult] = await this.prisma.$transaction([
      this.prisma.$queryRaw<{ count: bigint }[]>(countQuery),
      this.prisma.$queryRaw<{ id: number }[]>(dataQuery),
    ]);

    const total = Number(totalResult[0].count);
    const productIds = productsResult.map((p) => p.id);

    if (productIds.length === 0) {
      return {
        data: [],
        meta: { total, page, limit, lastPage: Math.ceil(total / limit) },
      };
    }

    const productsWithRelations = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, slug: true } },
        images: { select: { url: true } },
      }
    });

    // Se reordena por ultima vez
    const sortedProducts = productIds.map(id => 
      productsWithRelations.find(p => p.id === id)
    );

    const lastPage = Math.ceil(total / limit);

    return {
      data: sortedProducts,
      meta: { total, page, limit, lastPage },
    };
  }

  async create(createProductDto: CreateProductDto) {
    const { category: categoryId, ...productData } = createProductDto;
    const name = productData.name.trim();
    const slug = generateSlug(name);

    const newProduct = await this.prisma.product.create({
      data: {
        ...productData,
        name,
        slug,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
      include: { images: true },
    });

    return newProduct;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { category: categoryId } = updateProductDto;
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
      include: { images: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
