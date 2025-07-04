import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { handlePrismaError } from 'src/common/utils/handle-prisma-error';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const name = createProductDto.name.trim();
      const slug = name
        .toLowerCase()
        .normalize('NFD') // para quitar tildes
        .replace(/[\u0300-\u036f]/g, '') // remueve caracteres acentuados
        .replace(/[^a-z0-9 ]/g, '') // remueve caracteres especiales
        .replace(/\s+/g, '-');
      const data = { ...createProductDto, name, slug };
      return await this.prisma.product.create({
        data,
        include: { images: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findAll() {
    try {
      return await this.prisma.product.findMany({
        include: { images: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findOne(id: string) {
    // try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: { images: true },
      });

      if (!product) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      return product;
    // } catch (error) {
    //   handlePrismaError(error);
    // }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // await this.findOne(id);
    try {
      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        include: { images: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
