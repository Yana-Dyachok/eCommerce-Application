import {
  CustomerDraft,
  CustomerSignInResult,
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

export default function createClients(
  customerDraft: CustomerDraft,
): Promise<ApiResponse> {
  return new Promise((resolve, reject) => {
    apiRoot
      .customers()
      .post({ body: customerDraft })
      .execute()
      .then((response) => {
        if (response.body.customer) {
          const customerSignInResult: CustomerSignInResult = {
            customer: response.body.customer,
          };
          resolve({ customerSignInResult });
        } else {
          reject(new Error('Sign-Up failed'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
