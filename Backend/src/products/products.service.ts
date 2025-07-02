import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.model';
import { v4 } from 'uuid' 



@Injectable()
export class ProductsService {

  private products: Product[] = []

  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = {
      id: v4(),
      ...createProductDto,
      active: true,
      hasStabilization: createProductDto.hasStabilization ?? false, 
    };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: string) {
    const product = this.products.find(p => p.id === id && p.active);
    if (!product) {
      throw new NotFoundException(`Produto com id: "${id}" não encontrado ou está inativo.`);
    }
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto): Product {

  const productIndex = this.products.findIndex(p => p.id === id && p.active);

  if (productIndex === -1) {
    throw new NotFoundException(`Produto com ID "${id}" não encontrado ou inativo.`);
  }

  this.products[productIndex] = {
    ...this.products[productIndex],
    ...updateProductDto,
  };
  return this.products[productIndex];
}

  remove(id: string) {
    const product = this.findOne(id);
    product.active = false;
    return product;
  }

}
