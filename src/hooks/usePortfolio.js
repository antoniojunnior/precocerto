import { useState, useEffect } from 'react';
import { initialProducts, processPortfolio } from '../lib/data';

const STORAGE_KEY = 'dashboardGiroMargemCG:produtos:v1';

export function usePortfolio() {
  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState({ products: [], averages: {} });
  const [isLoaded, setIsLoaded] = useState(false);

  // On mount, load from LocalStorage or seed data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored !== '[]') {
      try {
        setProducts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse localStorage data', e);
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    }
    setIsLoaded(true);
  }, []);

  // Recalculate portfolio whenever products change, and sync to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    
    if (products.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      setPortfolio(processPortfolio(products));
    } else if (products.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      setPortfolio({ products: [], averages: { margin: 0, turnover: 0 } });
    }
  }, [products, isLoaded]);

  const addProduct = (newProduct) => {
    const productWithId = { ...newProduct, id: crypto.randomUUID() };
    setProducts((prev) => [...prev, productWithId]);
    return productWithId;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const duplicateProduct = (id) => {
    const productToCopy = products.find((p) => p.id === id);
    if (productToCopy) {
      const { id: oldId, ...rest } = productToCopy;
      addProduct({ ...rest, name: `${rest.name} (Cópia)` });
    }
  };

  return {
    products, // Raw base inputs
    portfolio, // Calculated outputs array & averages
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct
  };
}
