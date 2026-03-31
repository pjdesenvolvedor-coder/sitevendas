
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StreamingService, AccountCredential, Order } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';

type ProductsContextType = {
  products: StreamingService[];
  orders: Order[];
  addProduct: (product: StreamingService) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (product: StreamingService) => void;
  updateProductsOrder: (reorderedProducts: StreamingService[]) => void;
  addCredential: (productId: string, credential: Omit<AccountCredential, 'id' | 'addedAt' | 'sold'>) => void;
  removeCredential: (productId: string, credentialId: string) => void;
  sellCredential: (productId: string) => AccountCredential | null;
  addOrder: (order: Order) => void;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<StreamingService[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem('pj_contas_products');
    const savedOrders = localStorage.getItem('pj_contas_orders');
    
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        setProducts(parsed.map((p: any) => ({ ...p, credentials: p.credentials || [] })));
      } catch (e) {
        setProducts(INITIAL_PRODUCTS.map(p => ({ ...p, credentials: [] })));
      }
    } else {
      setProducts(INITIAL_PRODUCTS.map(p => ({ ...p, credentials: [] })));
    }

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        setOrders([]);
      }
    }
    
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('pj_contas_products', JSON.stringify(products));
      localStorage.setItem('pj_contas_orders', JSON.stringify(orders));
    }
  }, [products, orders, isInitialized]);

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

  const sellCredential = (productId: string): AccountCredential | null => {
    let soldItem: AccountCredential | null = null;
    
    setProducts((prev) => {
      const newProducts = prev.map((product) => {
        if (product.id === productId) {
          const credentialIndex = (product.credentials || []).findIndex(c => !c.sold);
          
          if (credentialIndex !== -1) {
            const updatedCredentials = [...(product.credentials || [])];
            updatedCredentials[credentialIndex] = {
              ...updatedCredentials[credentialIndex],
              sold: true
            };
            soldItem = updatedCredentials[credentialIndex];
            
            return {
              ...product,
              credentials: updatedCredentials,
              stock: updatedCredentials.filter(c => !c.sold).length
            };
          }
        }
        return product;
      });
      return newProducts;
    });
    
    return soldItem;
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <ProductsContext.Provider value={{ 
      products, 
      orders,
      addProduct, 
      deleteProduct, 
      updateProduct, 
      updateProductsOrder,
      addCredential,
      removeCredential,
      sellCredential,
      addOrder
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
