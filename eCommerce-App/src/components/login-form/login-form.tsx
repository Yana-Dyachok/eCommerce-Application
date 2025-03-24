import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/button/button';
import { LoginFormType } from '../../types/types';
import LoginEmail from '../login-email/login-email';
import LoginPassword from '../login-password/login-password';
import LinkTemplate from '../ui/link/link';

import styles from './login-form.module.css';
import { checkAuthClient } from '../../api/checkAuthClient';
import authWithPassword from '../../api/authWithPassword';

function LoginForm() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState<LoginFormType>({
    email: '',
    password: '',
  });

  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await checkAuthClient(loginData);
      console.log('Response from checkAuthClient:', response);
      await authWithPassword(loginData);
      navigate('/catalog');
    } catch (caughtError) {
      if (caughtError instanceof Error)
        setError(`* ${caughtError.message.toLowerCase()}`);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      navigate('/catalog');
    }
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.titleLogin}>Welcome!!!</h2>
      <p className={styles.titleLogin}>
        Don&apos;t have an account?&nbsp;
        <LinkTemplate to="/registration">Sign up</LinkTemplate>
      </p>
      <div>
        <LoginEmail
          loginData={loginData}
          setLoginData={setLoginData}
          setEmailValid={setEmailValid}
          setError={setError}
        />
        <LoginPassword
          eyeDisplay
          loginData={loginData}
          setLoginData={setLoginData}
          setPasswordValid={setPasswordValid}
          setError={setError}
          label={undefined}
        />
        {error && <div className={styles.error}>{error}</div>}
      </div>
      <div className={styles.btnBlock}>
        <Button btnType="submit" disabled={!(emailValid && passwordValid)}>
          Log in
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
