import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import createCart from './api/createCart';

const appContainer = document.createElement('div');
appContainer.id = 'root';
document.body.append(appContainer);

const initializeApp = async () => {
  if (!localStorage.getItem('cart-id')) {
    try {
      const response = (await createCart()).cart;
      if (response) {
        localStorage.setItem('cart-id', response.id);
        localStorage.setItem('version-cart', '1');
      }
    } catch (error) {
      console.error('Failed to create cart:', error);
    }
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
};

initializeApp();
