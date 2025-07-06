import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Product } from './product.model';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.', type: Product })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @ApiBody({ type: CreateProductDto, description: 'Dados para criar um novo produto' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os produtos com paginação e filtros' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso.', type: [Product] })
  @ApiResponse({ status: 400, description: 'Parâmetros de consulta inválidos.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página (padrão: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limite de itens por página (padrão: 10)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Termo de busca genérico (model, brand, type)' })
  @ApiQuery({ name: 'brand', required: false, type: String, description: 'Filtra por marca específica' })
  @ApiQuery({ name: 'type', required: false, type: String, description: 'Filtra por tipo de produto (ex: Zoom, Prime)' })
  @ApiQuery({ name: 'active', required: false, type: Boolean, description: 'Filtra por status ativo (true/false)' })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um produto por ID' })
  @ApiParam({ name: 'id', description: 'ID único do produto (UUID v4)', type: String })
  @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso.', type: Product })
  @ApiResponse({ status: 404, description: 'Produto não encontrado ou inativo.' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um produto existente' })
  @ApiParam({ name: 'id', description: 'ID único do produto a ser atualizado (UUID v4)', type: String })
  @ApiBody({ type: UpdateProductDto, description: 'Campos do produto a serem atualizados' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.', type: Product })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado ou inativo.' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta (soft-delete) um produto' })
  @ApiParam({ name: 'id', description: 'ID único do produto a ser deletado (UUID v4)', type: String })
  @ApiResponse({ status: 200, description: 'Produto deletado (marcado como inativo) com sucesso.', type: Product })
  @ApiResponse({ status: 404, description: 'Produto não encontrado ou já inativo.' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
