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
    const { page, limit, category, brand, priceMin, priceMax, search } =
      filters;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (search) {
      const formattedQuery = search
        .trim()
        .split(' ')
        .filter(Boolean)
        .join(' & ');
      (where as any).search_vector = {
        search: formattedQuery,
      };
    }

    if (category) {
      const categoryIds = await this.categoriesService
        .getCategoryAndDescendantIds(category)
        .catch(error => {
          console.log(`Filtro por categoría no existente: ${category}. Devolviendo 0 resultados.`);
          return [];
        });

      if (categoryIds.length === 0) {
        return { data: [], meta: { total: 0, page, lastPage: 1 } };
      }
      where.categoryId = { in: categoryIds };
    }

    if (brand) {
      where.brand = {
        slug: brand,
      };
    }

    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) {
        where.price.gte = priceMin;
      }
      if (priceMax) {
        where.price.lte = priceMax;
      }
    }

    const { search_vector, ...countWhere } = where as any;

    const [ products] = await this.prisma.$transaction([
      // this.prisma.product.count({ where: countWhere }),
      this.prisma.product.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        include: {
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true, slug: true } },
          images: { take: 1, select: { url: true } },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    // const lastPage = Math.ceil(total / limit);

    return {
      data: products,
      meta: {
        // total,
        page,
        // lastPage,
      },
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
