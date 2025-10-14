import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '@/prisma/prisma.service';

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
