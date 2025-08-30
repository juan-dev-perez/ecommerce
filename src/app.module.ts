import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [ProductModule, PrismaModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
