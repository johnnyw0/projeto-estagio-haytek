import React, { useState, useEffect } from 'react';
import type { Product } from '../services/ProductsService';
import './ProductForm.css'; 

interface ProductFormProps {
  initialData?: Product; 
  onSubmit: (product: Omit<Product, 'id' | 'active'>, id?: string) => void; 
  onCancel: () => void; 
  isEditMode?: boolean; 
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel, isEditMode = false }) => {
  const [model, setModel] = useState<string>(initialData?.model || '');
  const [brand, setBrand] = useState<string>(initialData?.brand || '');
  const [type, setType] = useState<string>(initialData?.type || '');
  const [focalLength, setFocalLength] = useState<string>(initialData?.focalLength || '');
  const [maxAperture, setMaxAperture] = useState<string>(initialData?.maxAperture || '');
  const [mount, setMount] = useState<string>(initialData?.mount || '');
  const [weight, setWeight] = useState<number>(initialData?.weight || 0); 
  const [hasStabilization, setHasStabilization] = useState<boolean>(initialData?.hasStabilization ?? false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setModel(initialData.model || '');
      setBrand(initialData.brand || '');
      setType(initialData.type || '');
      setFocalLength(initialData.focalLength || '');
      setMaxAperture(initialData.maxAperture || '');
      setMount(initialData.mount || '');
      setWeight(initialData.weight || 0);
      setHasStabilization(initialData.hasStabilization ?? false);
    }
  }, [initialData])

  const validate = () => {
    const newErrors: { [key: string]: string } = {}; 

    
    if (!model.trim()) newErrors.model = 'O modelo é obrigatório.';
    if (!brand.trim()) newErrors.brand = 'A marca é obrigatória.';
    if (!type.trim()) newErrors.type = 'O tipo é obrigatório.';
    
    if (typeof weight !== 'number' || isNaN(weight) || weight <= 0) {
      newErrors.weight = 'O peso deve ser um número positivo e válido.';
    }

    setErrors(newErrors); 
    return Object.keys(newErrors).length === 0; 
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (validate()) { 
      const productData: Omit<Product, 'id' | 'active'> = {
        model,
        brand,
        type,
        focalLength,
        maxAperture,
        mount,
        weight, 
        hasStabilization,
      };
      onSubmit(productData, isEditMode ? initialData?.id : undefined);
    }
  };

  return (
    <div className="product-form-container">
      <h2>{isEditMode ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="model">Modelo:</label>
          <input
            type="text"
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={errors.model ? 'input-error' : ''} 
          />
          {errors.model && <span className="error-text">{errors.model}</span>} 
        </div>

        <div className="form-group">
          <label htmlFor="brand">Marca:</label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className={errors.brand ? 'input-error' : ''}
          />
          {errors.brand && <span className="error-text">{errors.brand}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type">Tipo:</label>
          <input
            type="text"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={errors.type ? 'input-error' : ''}
          />
          {errors.type && <span className="error-text">{errors.type}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="focalLength">Comprimento Focal:</label>
          <input
            type="text"
            id="focalLength"
            value={focalLength}
            onChange={(e) => setFocalLength(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxAperture">Abertura Máxima:</label>
          <input
            type="text"
            id="maxAperture"
            value={maxAperture}
            onChange={(e) => setMaxAperture(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="mount">Mount:</label>
          <input
            type="text"
            id="mount"
            value={mount}
            onChange={(e) => setMount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Peso (g):</label>
          <input
            type="number" 
            id="weight"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))} 
            className={errors.weight ? 'input-error' : ''}
          />
          {errors.weight && <span className="error-text">{errors.weight}</span>}
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="hasStabilization"
            checked={hasStabilization}
            onChange={(e) => setHasStabilization(e.target.checked)}
          />
          <label htmlFor="hasStabilization">Possui Estabilização?</label>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            {isEditMode ? 'Salvar Alterações' : 'Adicionar Produto'}
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;