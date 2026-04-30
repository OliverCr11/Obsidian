import { useState, useEffect } from 'react';
import api from '../api/axios';

export interface OrderItem {
  id: number;
  quantity: number;
  price: number | string;
  glove_name?: string;
  glove_name_es?: string;
  glove_image?: string;
}

export interface Order {
  id?: number | string;
  order_id: string; // Dynamic UUID
  created_at: string;
  status: string;
  total_paid: number | string;
  items?: OrderItem[];
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders/');
        setOrders(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
        } else {
          setError("FAILED TO FETCH STRUCTURAL ORDER HISTORY");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, loading, error };
}
