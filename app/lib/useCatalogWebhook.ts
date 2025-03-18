import { useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
const socket = io(SOCKET_URL);

const useCatalogWebhook = (onCatalogUpdate: (data: any) => void) => {
  useEffect(() => {
    const handleCatalogUpdated = (data: any) => {
      console.log('Webhook event received:', data);
      onCatalogUpdate(data);
    };

    socket.on('catalog-updated', handleCatalogUpdated);

    return () => {
      socket.off('catalog-updated', handleCatalogUpdated);
    };
  }, [onCatalogUpdate]);
};

export default useCatalogWebhook;
