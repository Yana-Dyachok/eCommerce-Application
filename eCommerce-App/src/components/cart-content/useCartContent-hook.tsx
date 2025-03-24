import { useEffect, useState } from 'react';
import { getFromLocalStorage } from '../../utils/local-storage/ls-handler';
import getAllProductFromCart from '../../api/getAllProductFromCart';
import { CartContent } from '../../types/interface';

function UseCartContent() {
  const [cartContent, setCartContent] = useState<CartContent>({
    totalLineItemQuantity: 0,
    totalPrice: 0,
    lineItems: [],
    version: 0,
  });

  useEffect(() => {
    async function getResponse() {
      try {
        const response = await getAllProductFromCart(
          getFromLocalStorage('cart-id'),
        );

        const responsedTotalQuantity =
          response.cartDraft?.totalLineItemQuantity || 0;
        const responsedTotalPrice =
          response.cartDraft!.totalPrice.centAmount / 100 || 0;
        const responsedLineItems = response.cartDraft?.lineItems || [];
        const responsedVersion = response.cartDraft?.version || 0;
        setCartContent({
          ...cartContent,
          totalLineItemQuantity: responsedTotalQuantity,
          totalPrice: responsedTotalPrice,
          lineItems: responsedLineItems,
          version: responsedVersion,
        });
      } catch (caughtError) {
        if (caughtError instanceof Error) {
          throw new Error(caughtError.message);
        }
      }
    }
    getResponse();
  }, []);

  return { cartContent, setCartContent };
}

export default UseCartContent;
