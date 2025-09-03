import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class FilterProductPaginationDto {
  @IsPositive()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page: number = 1;

  @IsPositive()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number = 12;

  // Filtros de Producto
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priceMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priceMax?: number;

  @IsOptional() 
  @IsString()   
  search?: string;
}
