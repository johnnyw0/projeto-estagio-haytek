import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { Product, ProductDocument } from './product.model';


@Injectable()
export class ProductsService {

  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}


  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = await this.productModel.create({
      ...createProductDto,
      active: true,
      hasStabilization: createProductDto.hasStabilization ?? false,
    })

    return createdProduct.save();

  }

  async findAll(query: ProductQueryDto): Promise<{ data: Product[], meta: any }> {

    const { page = 1, limit = 6, search, brand, type, active} = query;
    const filter: any = {};

    if (active !== undefined) {
      filter.active = active;
    }
    if (brand) {
      filter.brand = { $regex: new RegExp(brand, 'i')}
    }
    if (type) {
      filter.type = { $regex: new RegExp(type, 'i')}
    }
    if (search) {
      filter.$or = [
        {model: { $regex: new RegExp(search, 'i')}},
        {brand: { $regex: new RegExp(search, 'i')}},
        {type: { $regex: new RegExp(search, 'i')}}
      ]
    }

    const skip = (page-1) *limit;
    const queryBuilder = this.productModel.find(filter)
    const totalItems = await this.productModel.countDocuments(filter).exec();
    const paginatedProducts = await queryBuilder.skip(skip).limit(limit).exec();
    const totalPages = Math.ceil(totalItems/limit);

    return  {
      data: paginatedProducts,
      meta: {
        totalItems,
        currentPage: page,
        itemsPerPage: limit,
        totalPages,
      }
    };

  }

  async findOne(id: string): Promise<Product> {

    const product = await this.productModel.findOne( { _id: id, active: true }).exec();

    if (!product) {
      throw new NotFoundException(`Produto com id: "${id}" não encontrado ou está inativo.`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      { _id: id, active: true},
      updateProductDto,
      { new: true, runValidators: true}
    ).exec();

    if(!updatedProduct) {
      throw new NotFoundException(`Produto com ID = "${id}" não encontrado ou inativo.`)
    }

    return updatedProduct;
  }

  async remove(id: string) {
    const product = await this.productModel.findOne({ _id: id, active: true }).exec();
    if (!product) {
      throw new NotFoundException(`Produto com ID "${id}" não encontrado ou inativo.`);
    }
    product.active = false;
    return product.save();
  }

}
