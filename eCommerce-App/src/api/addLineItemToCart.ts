import {
  Cart,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { ClientBuilder } from '@commercetools/sdk-client-v2';

import {
  projectKey,
  authMiddlewareOptions,
  httpMiddlewareOptions,
} from './constForApi';
import { ApiResponse } from './intefaceApi';

const middleware = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

const apiRoot = createApiBuilderFromCtpClient(middleware).withProjectKey({
  projectKey,
});

export default function addLineItemToCart(
  cartId: string,
  productId: string,
  variantId: number,
  quantity: number,
): Promise<ApiResponse> {
  const versionCart = Number(localStorage.getItem('version-cart'));

  return new Promise((resolve, reject) => {
    apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: versionCart,
          actions: [
            {
              action: 'addLineItem',
              productId,
              variantId,
              quantity,
            },
          ],
        },
      })
      .execute()
      .then((response) => {
        if (response.body) {
          const newVersionCart = response.body.version.toString();
          localStorage.setItem('version-cart', newVersionCart);
          const cartDraft: Cart = {
            ...response.body,
          };
          resolve({ cartDraft });
        } else {
          reject(new Error('No response body'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
