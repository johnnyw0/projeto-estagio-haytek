import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getModelToken } from '@nestjs/mongoose'; 
import { Model } from 'mongoose'; 
import { Product, ProductDocument } from './product.model'; 
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException } from '@nestjs/common';
import { ProductQueryDto } from './dto/product-query.dto';


const mockProductModel = {
  create: jest.fn().mockImplementation((dto) => {
    return Promise.resolve({
      ...dto,
      _id: 'mocked-uuid-create-id-' + Math.random().toString(36).slice(2, 9),
      id: 'mocked-uuid-create-id-' + Math.random().toString(36).slice(2, 9),
      __v: 0,
      active: true,
      hasStabilization: dto.hasStabilization ?? false, 
    });
  }),


  findOne: jest.fn().mockImplementation((filter) => ({
    exec: jest.fn().mockResolvedValue(null), 
  })),

  find: jest.fn().mockImplementation((filter) => ({
    skip: jest.fn().mockReturnThis(), 
    limit: jest.fn().mockReturnThis(), 
    exec: jest.fn().mockResolvedValue([]), 
  })),

  countDocuments: jest.fn().mockImplementation((filter) => ({
    exec: jest.fn().mockResolvedValue(0), 
  })),

  findByIdAndUpdate: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue(null), 
  })),
};

describe('ProductsService', () => {
  let service: ProductsService;
  let model: Model<ProductDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    model = module.get<Model<ProductDocument>>(getModelToken(Product.name));
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('create', () => {
    it('should successfully create a product and return it', async () => {
      const createDto: CreateProductDto = {
        model: 'Nova Lente',
        brand: 'Nikon',
        type: 'Zoom',
        focalLength: '24-90mm',
        maxAperture: 'f/2.8',
        mount: 'F-Mount',
        weight: 800,
        hasStabilization: true,
      };

      const mockSavedProduct = {
        _id: 'test-uuid-123',
        id: 'test-uuid-123', 
        ...createDto,
        active: true,
        __v: 0,
      } as ProductDocument;

      jest.spyOn(model, 'create').mockReturnValue({
        ...mockSavedProduct,
        save: jest.fn().mockResolvedValue(mockSavedProduct),
      } as any); 

      const result = await service.create(createDto);

      expect(result).toEqual(mockSavedProduct);
      expect(model.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: createDto.model,
          brand: createDto.brand,
          type: createDto.type,
          weight: createDto.weight,
          hasStabilization: createDto.hasStabilization,
          active: true, 
        })
      );
    });
  });


  describe('findAll', () => {
    const mockProducts = [
      { id: 'uuid1', model: 'Produto A', brand: 'Marca X', type: 'Prime', active: true } as ProductDocument,
      { id: 'uuid2', model: 'Produto B', brand: 'Marca Y', type: 'Zoom', active: false } as ProductDocument,
      { id: 'uuid3', model: 'Produto C', brand: 'Marca X', type: 'Prime', active: true } as ProductDocument,
    ];

    beforeEach(() => {
      jest.spyOn(model, 'find').mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts),
      } as any);


      jest.spyOn(model, 'countDocuments').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProducts.length),
      } as any);
    });

    it('should return all products with default pagination if no query is provided', async () => {
      const query: ProductQueryDto = {};
      const result = await service.findAll(query);

      expect(result.data.length).toBe(mockProducts.length);
      expect(result.meta.totalItems).toBe(mockProducts.length);
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.itemsPerPage).toBe(6);
      expect(model.find).toHaveBeenCalledWith({}); 
      expect(model.find().skip).toHaveBeenCalledWith(0); 
      expect(model.find().limit).toHaveBeenCalledWith(6);
    });

    it('should apply pagination correctly', async () => {
      const paginatedMock = [mockProducts[0]]; 
      jest.spyOn(model, 'find').mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(paginatedMock),
      } as any);

      const query: ProductQueryDto = { page: 1, limit: 1 };
      const result = await service.findAll(query);

      expect(result.data).toEqual(paginatedMock);
      expect(result.meta.totalItems).toBe(mockProducts.length); 
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.itemsPerPage).toBe(1);
      expect(result.meta.totalPages).toBe(3); 
      expect(model.find().skip).toHaveBeenCalledWith(0);
      expect(model.find().limit).toHaveBeenCalledWith(1);
    });

    it('should filter by active status correctly', async () => {
        const activeProducts = mockProducts.filter(p => p.active);
        jest.spyOn(model, 'find').mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(activeProducts),
        } as any);
        jest.spyOn(model, 'countDocuments').mockReturnValue({
            exec: jest.fn().mockResolvedValue(activeProducts.length),
        } as any);

        const query: ProductQueryDto = { active: true };
        const result = await service.findAll(query);

        expect(result.data.length).toBe(2);
        expect(result.data.every(p => p.active)).toBe(true);
        expect(model.find).toHaveBeenCalledWith({ active: true });
    });

    it('should filter by brand correctly (case-insensitive)', async () => {
        const marcaXProducts = mockProducts.filter(p => p.brand === 'Marca X');
        jest.spyOn(model, 'find').mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(marcaXProducts),
        } as any);
        jest.spyOn(model, 'countDocuments').mockReturnValue({
            exec: jest.fn().mockResolvedValue(marcaXProducts.length),
        } as any);

        const query: ProductQueryDto = { brand: 'marca x' }; 
        const result = await service.findAll(query);

        expect(result.data.length).toBe(2);
        expect(result.data.every(p => p.brand === 'Marca X')).toBe(true);
        expect(model.find).toHaveBeenCalledWith(
            expect.objectContaining({ brand: { '$regex': expect.any(RegExp) } }) 
        );
    });

    it('should filter by search term across multiple fields (case-insensitive)', async () => {
        const searchProducts = [mockProducts[0], mockProducts[1]]; 
        jest.spyOn(model, 'find').mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(searchProducts),
        } as any);
        jest.spyOn(model, 'countDocuments').mockReturnValue({
            exec: jest.fn().mockResolvedValue(searchProducts.length),
        } as any);

        const query: ProductQueryDto = { search: 'produto' };
        const result = await service.findAll(query);

        expect(result.data.length).toBe(2);
        expect(model.find).toHaveBeenCalledWith(
            expect.objectContaining({
                $or: expect.arrayContaining([
                    expect.objectContaining({ model: { '$regex': expect.any(RegExp) } }),
                    expect.objectContaining({ brand: { '$regex': expect.any(RegExp) } }),
                    expect.objectContaining({ type: { '$regex': expect.any(RegExp) } }),
                ]),
            })
        );
    });
  });


  describe('findOne', () => {
    it('should return a product if found and active', async () => {
      const mockProduct = { _id: 'test-uuid', id: 'test-uuid', model: 'Test Model', active: true } as ProductDocument;
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      } as any);

      const result = await service.findOne('test-uuid');
      expect(result).toEqual(mockProduct);
      expect(model.findOne).toHaveBeenCalledWith({ _id: 'test-uuid', active: true });
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findOne('non-existent-uuid')).rejects.toThrow(NotFoundException);
      expect(model.findOne).toHaveBeenCalledWith({ _id: 'non-existent-uuid', active: true });
    });

    it('should throw NotFoundException if product is found but inactive', async () => {
        jest.spyOn(model, 'findOne').mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        } as any); 

        await expect(service.findOne('inactive-uuid')).rejects.toThrow(NotFoundException);
        expect(model.findOne).toHaveBeenCalledWith({ _id: 'inactive-uuid', active: true });
    });
  });

  describe('update', () => {
    it('should update a product and return the updated product', async () => {
      const existingProduct = { _id: 'update-uuid', id: 'update-uuid', model: 'Old Model', brand: 'Old Brand', active: true } as ProductDocument;
      const updateDto: UpdateProductDto = { model: 'New Model', brand: 'New Brand' };
      const updatedProductMock = { ...existingProduct, ...updateDto } as ProductDocument;

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedProductMock),
      } as any);

      const result = await service.update('update-uuid', updateDto);
      expect(result).toEqual(updatedProductMock);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: 'update-uuid', active: true }, 
        updateDto,
        { new: true, runValidators: true }
      );
    });

    it('should throw NotFoundException if product to update is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null), 
      } as any);

      await expect(service.update('non-existent-uuid', { model: 'Any' })).rejects.toThrow(NotFoundException);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: 'non-existent-uuid', active: true },
        { model: 'Any' },
        { new: true, runValidators: true }
      );
    });
  });

  describe('remove', () => {
    it('should soft-delete a product by setting active to false', async () => {
      const existingProduct = {
        _id: 'delete-uuid',
        id: 'delete-uuid', 
        model: 'To Be Deleted', 
        active: true,
        save: jest.fn().mockResolvedValue(true), 
      } as Partial<ProductDocument> & { save: jest.Mock };

      const updatedProductAfterSave = { ...existingProduct, active: false } as ProductDocument;

    
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingProduct),
      } as any); 

      jest.spyOn(existingProduct, 'save').mockResolvedValue(updatedProductAfterSave);

      const result = await service.remove('delete-uuid');
      expect(result.active).toBe(false);
      expect(model.findOne).toHaveBeenCalledWith({ _id: 'delete-uuid', active: true });
      expect(existingProduct.save).toHaveBeenCalled(); 
    });

    it('should throw NotFoundException if product to remove is not found or already inactive', async () => {
        jest.spyOn(model, 'findOne').mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        } as any);

        await expect(service.remove('non-existent-uuid')).rejects.toThrow(NotFoundException);
        expect(model.findOne).toHaveBeenCalledWith({ _id: 'non-existent-uuid', active: true });
    });
  });
});