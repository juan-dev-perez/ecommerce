import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: any) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      throw new NotFoundException('Recurso no encontrado');
    }

    if (error.code === 'P2002') {
      throw new BadRequestException('Valor duplicado en campo único');
    }

    if (error.code === 'P2023') {
      throw new BadRequestException('El valor debe ser un UUID válido');
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new BadRequestException('Datos inválidos para la consulta');
  }

  // Por defecto
  console.error('Error inesperado en Prisma:', error);
  throw new InternalServerErrorException('Error interno en la base de datos');
}
