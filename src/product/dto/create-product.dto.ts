import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    @IsPositive()
    price: number;

    @IsNumber()
    @IsPositive()
    stock: number;

    @IsString()
    @IsOptional()
    category: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    discountPercentage?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
