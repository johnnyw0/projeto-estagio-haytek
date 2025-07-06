import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;

export interface Product {
    id: string
    model:string
    brand:string
    type: string
    focalLength: string
    maxAperture: string
    mount: string
    weight: number
    hasStabilization: boolean
    active: boolean
}

export interface ProductQuery {
    page?: number
    limit?: number
    search?: string
    brand?: string
    type?: string
    active?: boolean
}

export interface PaginatedResponse {
    data: Product[]
    meta: {
        totalItems: number
        currentPage: number
        itemsPerPage: number
        totalPages: number
    }
}

const productService = {

  async createProduct(productData: Omit<Product, 'id' | 'active'>): Promise<Product> {
    try {
      const response = await axios.post<Product>(API_URL, productData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  async getProducts(params?: ProductQuery): Promise<PaginatedResponse> {
    try {
      const response = await axios.get<PaginatedResponse>(API_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await axios.get<Product>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto com ID ${id}:`, error);
      throw error;
    }
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const response = await axios.patch<Product>(`${API_URL}/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto com ID ${id}:`, error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<Product> {
    try {
      const response = await axios.delete<Product>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar produto com ID ${id}:`, error);
      throw error;
    }
  },
}

export default productService