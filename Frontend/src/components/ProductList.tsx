import React, { useEffect, useState, useCallback } from 'react'; 
import productService from '../services/ProductsService';
import type { Product } from '../services/ProductsService';
import './ProductList.css';

interface ProductListProps {
  onEditProduct: (product: Product) => void;
  refreshListTrigger: number; 
}

const ProductList: React.FC<ProductListProps> = ({ onEditProduct, refreshListTrigger }) => { 
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(6);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  
  const [search, setSearch] = useState<string>('');
  const [brandFilter, setBrandFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

  
  const [applyFilterTrigger, setApplyFilterTrigger] = useState<number>(0);


  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts({
        page,
        limit,
        search: search || undefined,
        brand: brandFilter || undefined,
        type: typeFilter || undefined,
        active: activeFilter,
      });
      setProducts(response.data);
      setTotalItems(response.meta.totalItems);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      setError('Falha ao carregar produtos. Tente novamente mais tarde.');
      console.error('Erro detalhado:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, brandFilter, typeFilter, activeFilter, applyFilterTrigger]); 

  useEffect(() => {
    fetchProducts();
  }, [page, limit, applyFilterTrigger, refreshListTrigger]);

  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value); 
  };

  const handleApplyFilters = () => {
    setPage(1); 
    setApplyFilterTrigger(prev => prev + 1); 
  };

  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja desativar este produto?')) {
      try {
        await productService.deleteProduct(id);
        alert('Produto desativado com sucesso!');
        setApplyFilterTrigger(prev => prev + 1); 
      } catch (err) {
        alert('Erro ao desativar produto. Verifique o console.');
        console.error('Erro ao desativar:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="error-message">Erro: {error}</div>;
  }

  return (
    <div className="product-list-container">
      <h1>Gestão de Produtos</h1>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Buscar por modelo, marca ou tipo..."
          value={search}
          onChange={handleSearchChange}
          onKeyPress={(e) => { if (e.key === 'Enter') handleApplyFilters(); }}
        />
        <input
          type="text"
          placeholder="Filtrar por marca..."
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleApplyFilters(); }}
        />
        <input
          type="text"
          placeholder="Filtrar por tipo..."
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleApplyFilters(); }}
        />
        <select value={activeFilter === undefined ? '' : activeFilter.toString()} onChange={(e) => {
          const value = e.target.value;
          setActiveFilter(value === '' ? undefined : value === 'true');
        }}>
          <option value="">Status (Todos)</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
        <button onClick={handleApplyFilters}>Aplicar Filtros</button>
      </div>

      {products.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Marca</th>
              <th>Tipo</th>
              <th>Peso (g)</th>
              <th>Estabilização</th> 
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.model}</td>
                <td>{product.brand}</td>
                <td>{product.type}</td>
                <td>{product.weight}</td>
                <td>{product.hasStabilization ? 'Sim' : 'Não'}</td>
                <td>{product.active ? 'Sim' : 'Não'}</td>
                <td>
                  <button
                    className="action-button edit-button"
                    onClick={() => onEditProduct(product)}
                  >
                    Editar
                  </button>
                  <button className="action-button delete-button" onClick={() => handleDelete(product.id!)}>Desativar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      
      <div className="pagination-controls">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          Próxima
        </button>
        <span className="total-items">Total de Itens: {totalItems}</span>
      </div>
    </div>
  );
};

export default ProductList;