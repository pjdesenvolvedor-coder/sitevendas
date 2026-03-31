
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StreamingService, AccountCredential } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';

type ProductsContextType = {
  products: StreamingService[];
  addProduct: (product: StreamingService) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (product: StreamingService) => void;
  updateProductsOrder: (reorderedProducts: StreamingService[]) => void;
  addCredential: (productId: string, credential: Omit<AccountCredential, 'id' | 'addedAt' | 'sold'>) => void;
  removeCredential: (productId: string, credentialId: string) => void;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<StreamingService[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pj_contas_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Garantir que todos os produtos tenham o campo credentials
        setProducts(parsed.map((p: any) => ({ ...p, credentials: p.credentials || [] })));
      } catch (e) {
        setProducts(INITIAL_PRODUCTS.map(p => ({ ...p, credentials: [] })));
      }
    } else {
      setProducts(INITIAL_PRODUCTS.map(p => ({ ...p, credentials: [] })));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('pj_contas_products', JSON.stringify(products));
    }
  }, [products, isInitialized]);

  const addProduct = (product: StreamingService) => {
    setProducts((prev) => [{ ...product, credentials: [] }, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProduct = (updated: StreamingService) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const updateProductsOrder = (reordered: StreamingService[]) => {
    setProducts(reordered);
  };

  const addCredential = (productId: string, credentialData: Omit<AccountCredential, 'id' | 'addedAt' | 'sold'>) => {
    setProducts((prev) => prev.map((product) => {
      if (product.id === productId) {
        const newCredential: AccountCredential = {
          ...credentialData,
          id: Math.random().toString(36).substr(2, 9),
          addedAt: new Date().toISOString(),
          sold: false
        };
        const updatedCredentials = [...(product.credentials || []), newCredential];
        return {
          ...product,
          credentials: updatedCredentials,
          stock: updatedCredentials.filter(c => !c.sold).length
        };
      }
      return product;
    }));
  };

  const removeCredential = (productId: string, credentialId: string) => {
    setProducts((prev) => prev.map((product) => {
      if (product.id === productId) {
        const updatedCredentials = (product.credentials || []).filter(c => c.id !== credentialId);
        return {
          ...product,
          credentials: updatedCredentials,
          stock: updatedCredentials.filter(c => !c.sold).length
        };
      }
      return product;
    }));
  };

  return (
    <ProductsContext.Provider value={{ 
      products, 
      addProduct, 
      deleteProduct, 
      updateProduct, 
      updateProductsOrder,
      addCredential,
      removeCredential
    }}>
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
