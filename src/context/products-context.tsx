
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StreamingService } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';

type ProductsContextType = {
  products: StreamingService[];
  addProduct: (product: StreamingService) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (product: StreamingService) => void;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<StreamingService[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Carregar do localStorage ou usar iniciais
  useEffect(() => {
    const saved = localStorage.getItem('pj_contas_products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
    }
    setIsInitialized(true);
  }, []);

  // Salvar sempre que mudar
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('pj_contas_products', JSON.stringify(products));
    }
  }, [products, isInitialized]);

  const addProduct = (product: StreamingService) => {
    setProducts((prev) => [product, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProduct = (updated: StreamingService) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, deleteProduct, updateProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
