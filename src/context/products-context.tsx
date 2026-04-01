"use client";

import React, { createContext, useContext, useMemo } from 'react';
import { StreamingService, AccountCredential, Order, WebhookConfig } from '@/lib/types';
import { sendWebhookAction } from '@/lib/webhook-actions';
import { 
  useFirestore, 
  useCollection, 
  useDoc, 
  useMemoFirebase,
  setDocumentNonBlocking,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking
} from '@/firebase';
import { collection, doc } from 'firebase/firestore';

type ProductsContextType = {
  products: StreamingService[];
  orders: Order[];
  webhookSettings: WebhookConfig;
  isLoading: boolean;
  addProduct: (product: StreamingService) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (product: StreamingService) => void;
  updateProductsOrder: (reorderedProducts: StreamingService[]) => void;
  addCredential: (productId: string, credential: Omit<AccountCredential, 'id' | 'addedAt' | 'sold'>) => void;
  removeCredential: (productId: string, credentialId: string) => void;
  sellCredential: (productId: string) => AccountCredential | null;
  addOrder: (order: Order) => void;
  updateWebhookSettings: (settings: WebhookConfig) => void;
};

const DEFAULT_WEBHOOK: WebhookConfig = {
  url: '',
  enabled: false,
  fields: {
    orderId: true,
    customerName: true,
    customerPhone: true,
    total: true,
    items: true,
  }
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const db = useFirestore();

  // Queries memoizadas para o Firestore
  const productsQuery = useMemoFirebase(() => collection(db, 'products'), [db]);
  const ordersQuery = useMemoFirebase(() => collection(db, 'orders'), [db]);
  const webhookDocRef = useMemoFirebase(() => doc(db, 'settings', 'webhook'), [db]);

  // Hooks de tempo real do Firebase
  const { data: productsData, isLoading: loadingProducts } = useCollection<StreamingService>(productsQuery);
  const { data: ordersData, isLoading: loadingOrders } = useCollection<Order>(ordersQuery);
  const { data: webhookData, isLoading: loadingWebhook } = useDoc<WebhookConfig>(webhookDocRef);

  const products = useMemo(() => productsData || [], [productsData]);
  const orders = useMemo(() => ordersData || [], [ordersData]);
  const webhookSettings = useMemo(() => webhookData || DEFAULT_WEBHOOK, [webhookData]);
  const isLoading = loadingProducts || loadingOrders || loadingWebhook;

  const addProduct = (product: StreamingService) => {
    const productRef = doc(db, 'products', product.id);
    setDocumentNonBlocking(productRef, { ...product, credentials: [] }, { merge: true });
  };

  const deleteProduct = (id: string) => {
    const productRef = doc(db, 'products', id);
    deleteDocumentNonBlocking(productRef);
  };

  const updateProduct = (updated: StreamingService) => {
    const productRef = doc(db, 'products', updated.id);
    updateDocumentNonBlocking(productRef, updated);
  };

  const updateProductsOrder = (reordered: StreamingService[]) => {
    // Para simplificar no protótipo, atualizamos cada um
    reordered.forEach((p, index) => {
      const productRef = doc(db, 'products', p.id);
      updateDocumentNonBlocking(productRef, { ...p, sortOrder: index });
    });
  };

  const addCredential = (productId: string, credentialData: Omit<AccountCredential, 'id' | 'addedAt' | 'sold'>) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newCredential: AccountCredential = {
      ...credentialData,
      id: Math.random().toString(36).substr(2, 9),
      addedAt: new Date().toISOString(),
      sold: false
    };

    const updatedCredentials = [...(product.credentials || []), newCredential];
    const productRef = doc(db, 'products', productId);
    
    updateDocumentNonBlocking(productRef, {
      credentials: updatedCredentials,
      stock: updatedCredentials.filter(c => !c.sold).length
    });
  };

  const removeCredential = (productId: string, credentialId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const updatedCredentials = (product.credentials || []).filter(c => c.id !== credentialId);
    const productRef = doc(db, 'products', productId);

    updateDocumentNonBlocking(productRef, {
      credentials: updatedCredentials,
      stock: updatedCredentials.filter(c => !c.sold).length
    });
  };

  const sellCredential = (productId: string): AccountCredential | null => {
    const product = products.find(p => p.id === productId);
    if (!product) return null;

    const credentialIndex = (product.credentials || []).findIndex(c => !c.sold);
    if (credentialIndex === -1) return null;

    const updatedCredentials = [...(product.credentials || [])];
    const soldItem = { ...updatedCredentials[credentialIndex], sold: true };
    updatedCredentials[credentialIndex] = soldItem;

    const productRef = doc(db, 'products', productId);
    updateDocumentNonBlocking(productRef, {
      credentials: updatedCredentials,
      stock: updatedCredentials.filter(c => !c.sold).length
    });

    return soldItem;
  };

  const addOrder = (order: Order) => {
    const orderRef = doc(db, 'orders', order.id);
    setDocumentNonBlocking(orderRef, order, { merge: true });

    // Dispara o Webhook se estiver ativo
    if (webhookSettings.enabled && webhookSettings.url) {
      const sendWebhooksSequentially = async () => {
        for (let i = 0; i < order.items.length; i++) {
          const item = order.items[i];
          const payload = {
            nome: order.customerName,
            telefone: order.customerPhone,
            produto: item.productName,
            valor: order.total,
            emailConta: item.email,
            senhaConta: item.pass,
            perfil: item.screen,
            senhaPerfil: item.screenPass || 'Sem senha'
          };

          await sendWebhookAction(webhookSettings.url, payload);

          if (i < order.items.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 10000));
          }
        }
      };

      sendWebhooksSequentially();
    }
  };

  const updateWebhookSettings = (settings: WebhookConfig) => {
    const webhookRef = doc(db, 'settings', 'webhook');
    setDocumentNonBlocking(webhookRef, settings, { merge: true });
  };

  return (
    <ProductsContext.Provider value={{ 
      products: products.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0)), 
      orders,
      webhookSettings,
      isLoading,
      addProduct, 
      deleteProduct, 
      updateProduct, 
      updateProductsOrder,
      addCredential,
      removeCredential,
      sellCredential,
      addOrder,
      updateWebhookSettings
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