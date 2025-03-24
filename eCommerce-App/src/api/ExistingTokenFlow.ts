import { ClientBuilder } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  projectKey,
  httpMiddlewareOptions,
  authorization,
} from './constForApi';

const existingTokenFlowClient = new ClientBuilder()
  .withHttpMiddleware(httpMiddlewareOptions)
  .withExistingTokenFlow(authorization, { force: true })
  .build();

export default function authWithToken() {
  const apiRoot = createApiBuilderFromCtpClient(
    existingTokenFlowClient,
  ).withProjectKey({
    projectKey,
  });

  apiRoot
    .me()
    .get()
    .execute()
    .then((response) => {
      console.log('Customer profile: ', response.body);
    })
    .catch((error) => {
      throw new Error(error);
    });
}
