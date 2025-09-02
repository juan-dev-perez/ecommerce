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
    const { page, limit, category, brand, priceMin, priceMax } = filters;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (category) {
      const categoryIds =
        await this.categoriesService.getCategoryAndDescendantIds(category);
      if (categoryIds.length > 0) {
        where.categoryId = { in: categoryIds };
      } else {
        return { data: [], meta: { total: 0, page, lastPage: 1 } };
      }
    }

    if (brand) {
      where.brand = {
        slug: brand,
      };
    }

    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) {
        where.price.gte = priceMin; // gte = Greater Than or Equal (>=)
      }
      if (priceMax) {
        where.price.lte = priceMax; // lte = Less Than or Equal (<=)
      }
    }

    const [total, products] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        include: {
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true, slug: true } }, // Incluir marca si existe
          images: true
        },
        orderBy: {
          createdAt: 'desc', // O por el criterio que prefieras
        },
      }),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data: products,
      meta: {
        total,
        page,
        lastPage,
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
