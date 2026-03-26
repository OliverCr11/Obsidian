import { useState, useEffect } from 'react';

const API_BASE = 'http://127.0.0.1:8000/api';

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
      // The explicit strict LocalStorage token interception requirement
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      
      if (!token) {
        setLoading(false);
        setError("Not authenticated.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/orders/my-orders/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch structural order history');
        }

        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Network isolation failure.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, loading, error };
}
