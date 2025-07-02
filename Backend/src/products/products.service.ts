import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.model';
import { v4 } from 'uuid' 


@Injectable()
export class ProductsService {
  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = {
      id: v4(),
      ...createProductDto,
      active: true,
      hasStabilization: createProductDto.hasStabilization ?? false, 
    };
    return newProduct;
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
