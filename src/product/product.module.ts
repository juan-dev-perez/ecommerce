import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [PrismaModule, CategoriesModule],
})
export class ProductModule {}
