'use client';
// useCatalogWebhook.ts
import { useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'b2b.hksglobal.group/api/v1/webhook';

// Create a single socket instance (you could also create this inside the hook if needed)
const socket = io(SOCKET_URL);

const useCatalogWebhook = (onCatalogUpdate: (data: any) => void) => {
  useEffect(() => {
    const handleCatalogUpdated = (data: any) => {
      console.log('Webhook event received:', data);
      onCatalogUpdate(data);
    };

    socket.on('catalog-updated', handleCatalogUpdated);

    // Cleanup the event listener on unmount
    return () => {
      socket.off('catalog-updated', handleCatalogUpdated);
    };
  }, [onCatalogUpdate]);
};

export default useCatalogWebhook;
