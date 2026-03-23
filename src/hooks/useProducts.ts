import { useState, useEffect } from 'react';
import type { Glove } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Glove[]>([]);
  const [dropProduct, setDropProduct] = useState<Glove | null>(null);
  const [coreProducts, setCoreProducts] = useState<Glove[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/products/');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
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
  }, []);

  return { products, dropProduct, coreProducts, loading, error };
}
