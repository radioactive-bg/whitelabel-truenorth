import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { createPreOrder } from '@/app/lib/api/orders';

const PreorderDialog = ({
  product,
  isDialogOpen,
  setIsOpenDialog,
}: {
  product: any;
  isDialogOpen: boolean;
  setIsOpenDialog: (isOpen: boolean) => void;
}) => {
  const [quantity, setQuantity] = useState(1); // State to manage the quantity
  const [message, setMessage] = useState<string | null>(null); // State for success/error message
  const [isPreorderSuccess, setIsPreorderSuccess] = useState(false); // State to hide preorder button after success
  const [isError, setIsError] = useState(false); // State to track if the message is an error

  const PreorderItem = async (product: any, quantity: number) => {
    try {
      console.log('Preordering item:', { product, quantity });
      const productsArray = [{ productId: product.id, quantity }];
      const preorderResponse = await createPreOrder(productsArray, null);

      if (preorderResponse.success) {
        setMessage(
          `Preorder of ${quantity} unit(s) of "${product.groupName}" was successful!`,
        );
        setIsPreorderSuccess(true);
        setIsError(false); // Successful preorder
      } else {
        setMessage(`Preorder failed. Please try again.`);
        setIsError(true); // Preorder failed
      }
    } catch (error) {
      console.error('Error in preordering item:', error);
      setMessage(`An error occurred. Please try again.`);
      setIsError(true); // API call failed
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preorder Product</DialogTitle>
          <DialogDescription>
            Review the product details and specify the quantity to preorder.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center">
            <img
              src={product?.logo || '/NoPhoto.jpg'}
              alt={product?.groupName || 'Product Image'}
              className="h-16 w-16 rounded-md object-contain"
            />
          </div>
          <div>
            <strong>Product Name:</strong> {product?.groupName || 'Unknown'}
          </div>
          <div>
            <strong>Group:</strong> {product?.group || 'Unknown'}
          </div>
          <div>
            <strong>Price:</strong> {product?.price}
            {product?.currency === 'USD' ? '$' : '€'}
          </div>
          <div>
            <strong>Sale Price:</strong> {product?.salePrice || 'N/A'}
          </div>
          {!isPreorderSuccess && (
            <div>
              <label htmlFor="quantity" className="block font-semibold">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 rounded-md border border-gray-300 px-2 py-1 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-black/70"
              />
            </div>
          )}
          {message && (
            <div
              className={`mt-4 rounded-md px-4 py-2 ${
                isError
                  ? 'bg-red-100 text-red-800' // Error styling
                  : 'bg-green-100 text-green-800' // Success styling
              }`}
            >
              {message}
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          {!isPreorderSuccess && (
            <button
              onClick={() => PreorderItem(product, quantity)}
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Preorder
            </button>
          )}
          <button
            onClick={() => setIsOpenDialog(false)}
            className="rounded-md bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            {isPreorderSuccess ? 'Close' : 'Cancel'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreorderDialog;
