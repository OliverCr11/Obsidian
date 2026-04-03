import { useState, useEffect } from 'react';
import type { Glove } from '../types';
import api from '../api/axios';

export function useProducts(collectionType?: 'DROP' | 'CORE') {
  const [products, setProducts] = useState<Glove[]>([]);
  const [dropProduct, setDropProduct] = useState<Glove | null>(null);
  const [coreProducts, setCoreProducts] = useState<Glove[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = collectionType ? `/products/?collection_type=${collectionType}` : `/products/`;
        const response = await api.get(url);
        const data = response.data;
        
        setProducts(data);
        
        // Filter logic for Drop vs Core collections
        const drop = data.find((p: Glove) => p.collection_type?.toUpperCase() === 'DROP') || null;
        const cores = data.filter((p: Glove) => p.collection_type?.toUpperCase() === 'CORE');
        
        setDropProduct(drop);
        setCoreProducts(cores);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [collectionType]);

  return { products, dropProduct, coreProducts, loading, error };
}
