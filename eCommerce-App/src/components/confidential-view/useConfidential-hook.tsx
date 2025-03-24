import { useEffect, useState } from 'react';
import fetchPersonalData from '../../api/fetchPersonalData';
import { LoginFormType } from '../../types/types';

function UseConfidential() {
  const [personalData, setPersonalData] = useState<LoginFormType>({
    email: '',
    password: '',
  });
  useEffect(() => {
    async function getResponse() {
      try {
        const response = await fetchPersonalData(
          localStorage.getItem('personal-id')!,
        );
        if (response.customer?.email !== undefined) {
          setPersonalData({
            ...personalData,
            email: response.customer?.email,
          });
        }
      } catch (caughtError) {
        if (caughtError instanceof Error) {
          throw new Error(caughtError.message);
        }
      }
    }
    getResponse();
  }, []);
  return personalData;
}

export default UseConfidential;
