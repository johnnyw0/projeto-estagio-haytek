import { useState } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import productService from './services/ProductsService';
import type { Product } from './services/ProductsService';
import './App.css'; 

function App() {
  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const [refreshListTrigger, setRefreshListTrigger] = useState(0);

  const handleSubmitProduct = async (
    productData: Omit<Product, 'id' | 'active'>, 
    id?: string 
  ) => {
    try {
      if (id) {
        await productService.updateProduct(id, productData);
        alert('Produto atualizado com sucesso!');
      } else {
        await productService.createProduct(productData);
        alert('Produto adicionado com sucesso!');
      }
      
      setShowForm(false);
      setEditingProduct(undefined);
      setRefreshListTrigger(prev => prev + 1);

    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).join('\n');
        alert(`Erro de validação:\n${errorMessages}`);
      } else if (error.response && error.response.data && error.response.data.message) {
        alert(`Erro da API: ${error.response.data.message}`);
      } else {
        alert('Ocorreu um erro ao salvar o produto.');
      }
      console.error('Erro ao salvar produto:', error);
    }
  };


  const handleAddProductClick = () => {
    setEditingProduct(undefined); 
    setShowForm(true); 
  };


  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true); 
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(undefined); 
  };

  return (
    <div className="App">
      {!showForm ? (
        <>
          <button className="add-product-button" onClick={handleAddProductClick}>
            Adicionar Novo Produto
          </button>
          <ProductList onEditProduct={handleEditProductClick} refreshListTrigger={refreshListTrigger} />
        </>
      ) : (
        <ProductForm
          initialData={editingProduct} 
          onSubmit={handleSubmitProduct} 
          onCancel={handleCancelForm} 
          isEditMode={!!editingProduct} 
        />
      )}
    </div>
  );
}

export default App;