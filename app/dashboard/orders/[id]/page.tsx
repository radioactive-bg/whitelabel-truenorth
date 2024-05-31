// pages/dashboard/orders/[id].tsx
'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchOrderById } from '@/app/lib/api/orders'; // Assume this function fetches the order details from your API

console.log(`OrderDetails`);
const OrderDetails = () => {
  const { id } = useParams();
  console.log('id:', id, ' typeof: ', typeof id);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`OrderDetails`);
    if (id) {
      console.log('id:', typeof id);
      fetchOrderDetails(id as string);
    }
  }, [id]);
  useEffect(() => {
    console.log(`OrderDetails []`);
  }, []);

  const fetchOrderDetails = async (orderId: string) => {
    setLoading(true);
    try {
      const response = await fetchOrderById(orderId);
      console.log('Order details:', response.data);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>No order details found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Order Details</h1>
      <div className="mt-4">
        <p>
          <strong>Order ID:</strong> {order.id}
        </p>
        <p>
          <strong>Client:</strong> {order.client}
        </p>
        <p>
          <strong>Price:</strong> {order.priceListAmount}
        </p>
        <p>
          <strong>Status:</strong> {order.statusText}
        </p>
        <p>
          <strong>Create Date:</strong> {order.createdAt}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
