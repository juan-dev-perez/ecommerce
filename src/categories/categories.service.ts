import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Category } from '@prisma/client';

type CategoryWithCounts = Category & {
  _count: {
    product: number;
  };
};

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategoryAndDescendantIds(categorySlug: string): Promise<number[]> {
    const parentCategory = await this.prisma.category.findUnique({
      where: { slug: categorySlug, isActive: true },
      select: { id: true },
    });

    if (!parentCategory) {
      throw new NotFoundException(
        `La categoría con el slug "${categorySlug}" no fue encontrada o está inactiva.`,
      );
    }

    const categoryIdsResult = await this.prisma.$queryRaw<
      Array<{ id: number }>
    >`
      WITH RECURSIVE CategoryTree AS (
        -- categoría padre
        SELECT id, "parentId", "isActive"
        FROM "Category"
        WHERE id = ${parentCategory.id}
        
        UNION ALL
        -- subcategorías con sus padres encontrados
        SELECT c.id, c."parentId", c."isActive"
        FROM "Category" c
        INNER JOIN CategoryTree ct ON c."parentId" = ct.id
        WHERE c."isActive" = true
      )
      SELECT id FROM CategoryTree;
    `;

    const ids = categoryIdsResult.map((cat) => cat.id);

    if (ids.length === 0) {
      return [];
    }

    return ids;
  }

  async findActiveCategories() {
    const activeCategoriesWithCounts = await this.prisma.category.findMany({
      where: {
        isActive: true,
      },
      include: {
        _count: {
          select: {
            product: { where: { isActive: true } },
          },
        },
      },
    });

    if (activeCategoriesWithCounts.length === 0) {
      return [];
    }

    const categoryMap = new Map<number, CategoryWithCounts>(
      activeCategoriesWithCounts.map((c) => [c.id, c]),
    );

    const countCache = new Map<number, number>();

    function getTotalProductCount(categoryId: number): number {
      if (countCache.has(categoryId)) {
        return countCache.get(categoryId)!;
      }

      const category = categoryMap.get(categoryId);
      if (!category) return 0;

      let total = category._count.product;

      for (const c of categoryMap.values()) {
        if (c.parentId === categoryId) {
          total += getTotalProductCount(c.id);
        }
      }

      countCache.set(categoryId, total);
      return total;
    }

    for (const category of activeCategoriesWithCounts) {
      getTotalProductCount(category.id);
    }

    const finalVisibleCategories = activeCategoriesWithCounts.filter(
      (category) => {
        const totalCount = countCache.get(category.id);
        return totalCount !== undefined && totalCount > 0;
      },
    );

    return finalVisibleCategories;
  }

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
