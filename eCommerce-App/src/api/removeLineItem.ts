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
import { saveToLocalStorage } from '../utils/local-storage/ls-handler';
import { ApiResponse } from './intefaceApi';

const middleware = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

const apiRoot = createApiBuilderFromCtpClient(middleware).withProjectKey({
  projectKey,
});

export default function removeLineItemFromCart(
  cartId: string,
  lineItemId: string,
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
              action: 'removeLineItem',
              lineItemId,
            },
          ],
        },
      })
      .execute()
      .then((response) => {
        if (response.body) {
          const newVersionCart = response.body.version.toString();
          saveToLocalStorage('version-cart', newVersionCart);
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
