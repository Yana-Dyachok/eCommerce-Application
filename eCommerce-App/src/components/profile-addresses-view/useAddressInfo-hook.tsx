import { useEffect, useState } from 'react';
import { BaseAddress } from '@commercetools/platform-sdk';
import { useLocation } from 'react-router-dom';
import fetchPersonalData from '../../api/fetchPersonalData';
import { getFromLocalStorage } from '../../utils/local-storage/ls-handler';

export interface AddressType {
  defaultBillingAddressId: string;
  defaultShippingAddressId: string;
  billingAddressIds: string[];
  shippingAddressIds: string[];
}

export interface CustomAddressInterface {
  id: string;
  streetName: string;
  city: string;
  country: string;
  postalCode: string;

  addressType: AddressType;
}

export interface ClientAddressData {
  addresses?: BaseAddress[];
  defaultBillingAddressId?: string;
  defaultShippingAddressId?: string;
  billingAddressIds?: string[];
  shippingAddressIds?: string[];
}

function UseAddressInfo() {
  const location = useLocation();
  const [personalData, setPersonalData] = useState<ClientAddressData>({
    addresses: [],
    defaultBillingAddressId: '',
    defaultShippingAddressId: '',
    billingAddressIds: [],
    shippingAddressIds: [],
  });
  useEffect(() => {
    async function getResponse() {
      try {
        const response = await fetchPersonalData(
          getFromLocalStorage('personal-id'),
        );
        setPersonalData({
          ...personalData,
          addresses: response.customer?.addresses,
          defaultBillingAddressId: response.customer?.defaultBillingAddressId,
          defaultShippingAddressId: response.customer?.defaultShippingAddressId,
          billingAddressIds: response.customer?.billingAddressIds,
          shippingAddressIds: response.customer?.shippingAddressIds,
        });
      } catch (caughtError) {
        if (caughtError instanceof Error) {
          throw new Error(caughtError.message);
        }
      }
    }
    getResponse();
  }, [location]);
  return personalData;
}

export default UseAddressInfo;
