import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseAddress } from '@commercetools/platform-sdk';
import { LoginFormType } from '../../types/types';
import styles from './registration-page.module.css';
import Button from '../../components/ui/button/button';
import Tags from '../../components/ui/tags/tags';
import LinkTemplate from '../../components/ui/link/link';
import LogoHeader from '../../components/ui/logo/logo';

import {
  nameInput,
  dateInput,
  selectInput,
  adressInputs,
} from './inputs-const';

import {
  CredentialsData,
  ModalText,
  PostBody,
} from '../../types/registration-form/registration-int';
import CredentialsForm from '../../components/credentials-form/credentials-form';
import AdressForm from '../../components/adress-form/address-forms';
import createClients from '../../api/createClient';
import PopUp from '../../components/ui/popup/popup';
import { checkAuthClient } from '../../api/checkAuthClient';
import authWithPassword from '../../api/authWithPassword';

function RegistrationPage() {
  const [shippingValues, setShippingInput] = useState<BaseAddress>({
    streetName: '',
    postalCode: '',
    city: '',
    country: '',
  });
  const [billingValues, setBillingInput] = useState<BaseAddress>({
    streetName: '',
    postalCode: '',
    city: '',
    country: '',
  });
  const [loginData, setLoginData] = useState<LoginFormType>({
    email: '',
    password: '',
  });
  const [credentialsValues, setCredentialsValues] = useState<CredentialsData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });
  const [useSameAddress, setUseSameAddress] = useState<boolean>(false);

  const [useDefaultShipping, setDefaultShipping] = useState<boolean>(false);
  const [useDefaultBilling, setDefaultBilling] = useState<boolean>(false);
  const [modalText, setModalText] = useState<ModalText>({
    title: '',
    text: '',
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showFormError, setShowFormError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const handleInputChange = (
    addressType: 'billing' | 'shipping',
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (addressType === 'shipping') {
      setShippingInput({
        ...shippingValues,
        [e.currentTarget.name]: e.currentTarget.value,
      });
      if (useSameAddress) {
        setBillingInput({
          ...billingValues,
          [e.currentTarget.name]: e.currentTarget.value,
        });
        const getCurrrentName = document.getElementsByName(
          e.currentTarget.name,
        );
        getCurrrentName.forEach((elem) => {
          elem.setAttribute('data-focused', 'true');
        });
      }
    } else {
      setBillingInput({
        ...billingValues,
        [e.currentTarget.name]: e.currentTarget.value,
      });
    }
  };
  const handleSameAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setUseSameAddress(e.target.checked);
    const getBillingField = document.getElementsByName('billing');
    const getBillingCheck = document.getElementById('default-billing-check');
    if (e.target.checked) {
      setBillingInput(shippingValues);
      getBillingCheck?.parentElement?.setAttribute(
        'style',
        'pointer-events: auto',
      );
      getBillingField.forEach((elem) => {
        elem.setAttribute('style', 'pointer-events: none');
      });
    } else {
      getBillingCheck?.parentElement?.removeAttribute('style');
      getBillingField.forEach((elem) => {
        elem.removeAttribute('style');
      });
    }
  };

  const handleDefaultAddress = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.id === 'default-shipping-check') {
      setDefaultShipping(e.target.checked);
    } else {
      setDefaultBilling(e.target.checked);
    }
  };

  const onCredentialsChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setCredentialsValues({
      ...credentialsValues,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowFormError(false);
    const createArrOfAddresses = [
      {
        firstName: credentialsValues.firstName,
        lastName: credentialsValues.lastName,
        email: loginData.email,
        ...shippingValues,
      },
      {
        firstName: credentialsValues.firstName,
        lastName: credentialsValues.lastName,
        email: loginData.email,
        ...billingValues,
      },
    ];
    const createArrOfShipping = [0];
    const createArrOfBilling = [1];
    const postBody = {
      email: loginData.email,
      password: loginData.password,
      ...credentialsValues,
    } as PostBody;
    postBody.addresses = createArrOfAddresses;
    postBody.shippingAddresses = createArrOfShipping;
    postBody.billingAddresses = createArrOfBilling;
    if (useDefaultBilling) {
      postBody.defaultBillingAddress = 1;
    }
    if (useDefaultShipping) {
      postBody.defaultShippingAddress = 0;
    }
    try {
      const response = await createClients(postBody);
      setModalText({
        ...modalText,
        title: `Hello, ${response.customerSignInResult?.customer.firstName} ${response.customerSignInResult?.customer.lastName}!`,
        text: 'Your account has been succesfully created!',
      });
      setShowModal(true);
      try {
        const responseAuth = await checkAuthClient(loginData);
        console.log('Response from checkAuthClient:', responseAuth);
        await authWithPassword(loginData);
      } catch (caughtError) {
        if (caughtError instanceof Error) throw new Error(caughtError.message);
      }
    } catch (caughtError) {
      if (caughtError instanceof Error) {
        setShowFormError(true);
        setErrorText(`* ${caughtError.message.toLocaleLowerCase()}`);
      }
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      navigate('/main');
    }
  });

  const onCloseModal = async () => {
    if (localStorage.getItem('authToken')) {
      navigate('/catalog');
    }
  };

  return (
    <>
      <LogoHeader />
      <div className={styles.registrationRoot}>
        <form className={styles.registrationForm} onSubmit={(e) => onSubmit(e)}>
          <Tags.H2>Sign Up!</Tags.H2>
          <p className={styles.titleRegistration}>
            Already have an account?&nbsp;
            <LinkTemplate to="/login">Log in</LinkTemplate>
          </p>
          <CredentialsForm
            loginData={loginData}
            setLoginData={setLoginData}
            dateInput={dateInput}
            nameInput={nameInput}
            values={credentialsValues}
            onChange={(e) => onCredentialsChange(e)}
          />
          <AdressForm
            checkedDefault={useDefaultShipping}
            onDefaultCheckboxChange={(e) => handleDefaultAddress(e)}
            fieldName="shipping"
            checked={useSameAddress}
            onCheckboxChange={(e) => handleSameAddress(e)}
            fieldLegend="Shipping Address"
            adressInputs={adressInputs}
            selectInput={selectInput}
            onChange={(e) => handleInputChange('shipping', e)}
            values={shippingValues}
          />
          <AdressForm
            checkedDefault={useDefaultBilling}
            onDefaultCheckboxChange={(e) => handleDefaultAddress(e)}
            fieldName="billing"
            checked={useSameAddress}
            onCheckboxChange={(e) => handleSameAddress(e)}
            fieldLegend="Billing Address"
            adressInputs={adressInputs}
            selectInput={selectInput}
            onChange={(e) => handleInputChange('billing', e)}
            values={billingValues}
          />
          {showFormError && <span>{errorText}</span>}
          <Button btnType="submit">Submit</Button>
        </form>
      </div>
      {showModal && (
        <PopUp
          onClose={onCloseModal}
          title={modalText.title}
          text={modalText.text}
        />
      )}
    </>
  );
}

export default RegistrationPage;
