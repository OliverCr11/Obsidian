import { useState, useEffect } from 'react';
import type { Glove } from '../types';
import api from '../api/axios';

export function useProductDetail(id: string | undefined) {
  const [product, setProduct] = useState<Glove | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Invalid product ID');
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}/`);
        const data = response.data;
        setProduct(data);
        setError(null);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Product not found');
        } else {
          setError(err.message || 'An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}
