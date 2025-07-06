import { IsOptional, IsNumber, Min, IsString, IsBoolean} from 'class-validator';
import { Transform, Type } from 'class-transformer';


export class ProductQueryDto {
  @IsOptional()
  @Type(() => Number) 
  @IsNumber({}, { message: 'O número da página deve ser um número válido.' })
  @Min(1, { message: 'O número da página deve ser pelo menos 1.' })
  page?: number;

  @IsOptional()
  @Type(() => Number) 
  @IsNumber({}, { message: 'O limite por página deve ser um número válido.' })
  @Min(1, { message: 'O limite por página deve ser pelo menos 1.' })
  limit?: number;

  @IsOptional()
  @IsString({ message: 'O termo de busca deve ser uma string.' })
  search?: string;

  @IsOptional()
  @IsString({ message: 'A marca deve ser uma string.' })
  brand?: string;

  @IsOptional()
  @IsString({ message: 'O tipo deve ser uma string.' })
  type?: string; 

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === undefined || value === null || value === '') return undefined;
    return value;
  })
  @IsBoolean({ message: 'O status ativo deve ser um booleano.' })
  active?: boolean; 
}