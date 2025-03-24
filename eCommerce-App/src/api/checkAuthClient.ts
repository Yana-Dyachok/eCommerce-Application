import { ClientBuilder } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  CustomerSignin,
  CustomerSignInResult,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/customer';

import { ApiResponse } from './intefaceApi';
import { saveToLocalStorage } from '../utils/local-storage/ls-handler';

import {
  projectKey,
  authMiddlewareOptions,
  httpMiddlewareOptions,
} from './constForApi';

const credentialsFlowClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

const apiRoot = createApiBuilderFromCtpClient(
  credentialsFlowClient,
).withProjectKey({
  projectKey,
});

export const getProject = () => {
  return apiRoot.get().execute();
};

export function checkAuthClient(
  customerSignin: CustomerSignin,
): Promise<ApiResponse> {
  return new Promise((resolve, reject) => {
    apiRoot
      .login()
      .post({ body: customerSignin })
      .execute()
      .then((response) => {
        if (response.body.customer) {
          const personalId = response.body.customer.id;
          const personalVer = response.body.customer.version;
          saveToLocalStorage('personal-id', personalId);
          saveToLocalStorage('version', `${personalVer}`);
          const customerSignInResult: CustomerSignInResult = {
            customer: response.body.customer,
          };
          resolve({ customerSignInResult });
        } else {
          reject(new Error('Sign-in failed'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
