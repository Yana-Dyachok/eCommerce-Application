import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import { ToastContainer } from 'react-toastify';
import ProductCard from '../ui/product-card/product-card';
import { IProductCard } from '../ui/product-card/product-card-interface';
import getAllProducts from '../../api/getAllProduct';
import Loading from '../ui/loading/loading';
import styles from './catalog.module.css';
import { CountCart } from '../../types/types';
import toastProps from './toast-props';

interface CatalogProps {
  query?: object;
  setCountCart: React.Dispatch<React.SetStateAction<CountCart>>;
}

function Catalog({ query = {}, setCountCart }: CatalogProps) {
  const [productCards, setProductCards] = useState<IProductCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setLoading(true);
    getAllProducts(query)
      .then((response) => {
        const products = response.productProjectionArr;
        const mappedProductCards = products!.map((product) => {
          const { images } = product.masterVariant;
          const imageUrlArray = images
            ? images.map((img: { url: string }) => img.url)
            : [];
          const [imageUrl] =
            imageUrlArray.length > 0 ? [imageUrlArray[0]] : [''];

          const name = product.name['en-US'];
          const key = product.key || '';
          let description = '';
          if (product.description) description = product.description['en-US'];

          let price = 0;
          let discount = 0;
          if (product.masterVariant.prices) {
            price = product.masterVariant.prices[0].value.centAmount / 100;
            discount =
              product.masterVariant.prices[0].discounted?.value.centAmount ?? 0;
            if (typeof discount === 'number') {
              discount /= 100;
            }
          }

          return {
            id: product.id,
            imageUrl,
            imageUrlArray,
            name,
            key,
            description,
            price,
            discount,
          };
        });

        setProductCards(mappedProductCards);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products', error);
        setLoading(false);
      });
  }, [query]);

  if (loading) {
    return <Loading />;
  }

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const displayedProducts = productCards.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );
  return (
    <>
      <div className={styles.catalogBlock}>
        <div className={styles.catalogInner}>
          {displayedProducts.length > 0 ? (
            displayedProducts.map((productCard) => (
              <ProductCard
                key={productCard.id}
                productCard={productCard}
                setCountCart={setCountCart}
              />
            ))
          ) : (
            <p>No products found based on the selected criteria</p>
          )}
        </div>
        <Pagination
          className={styles.pagination}
          count={Math.ceil(productCards.length / itemsPerPage)}
          page={page}
          onChange={handleChange}
          sx={{ button: { color: 'inherit' } }}
        />
      </div>
      <ToastContainer {...toastProps} />
    </>
  );
}

export default Catalog;
