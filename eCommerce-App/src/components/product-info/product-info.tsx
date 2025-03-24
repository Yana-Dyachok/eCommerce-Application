import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import getProductById from '../../api/getProductById';
import { getFromLocalStorage } from '../../utils/local-storage/ls-handler';
import { IProductCard } from '../ui/product-card/product-card-interface';
import Loading from '../ui/loading/loading';
import Tags from '../ui/tags/tags';
import ImgSlider from '../ui/each-img-slider/img-slider';
import getAllProducts from '../../api/getAllProduct';
import ProductCart from '../ui/product-cart/product-cart';

import styles from './product-info.module.css';
import { CountCart } from '../../types/types';
import toastProps from './toast-props';

function ProductInfo({
  setCountCart,
}: {
  setCountCart: React.Dispatch<React.SetStateAction<CountCart>>;
}) {
  const id: string | null = getFromLocalStorage('product-id');
  const [productCard, setProductCard] = useState<IProductCard>({
    id: '',
    imageUrl: '',
    imageUrlArray: [],
    name: '',
    key: '',
    description: '',
    price: 0,
    discount: 0,
  });

  useEffect(() => {
    getAllProducts().then(() => {});
    if (!id) return;
    getProductById(id)
      .then((response) => {
        const product = response.productProjection;
        if (product) {
          const { images } = product.masterVariant;
          let imageUrl = '';
          let imageUrlArray: string[] = [];
          if (images && images.length > 0) {
            imageUrl = images[0].url;
            imageUrlArray = images.map((image) => image.url);
          }

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

          setProductCard((prevState) => ({
            ...prevState,
            id: product.id,
            imageUrl,
            imageUrlArray,
            name,
            key,
            description,
            price,
            discount,
          }));
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [id]);

  const { imageUrl, name } = productCard;

  if (!imageUrl || !name) {
    return <Loading />;
  }

  function getDiscount(): number {
    return Math.floor(
      ((productCard.price - productCard.discount) / productCard.price) * 100,
    );
  }

  return (
    <>
      <div className={styles.productPageBlock}>
        <div className={styles.productPageImgSlider}>
          <ImgSlider productCard={productCard} />
        </div>
        <div className={styles.productPageInfo}>
          <Tags.H1>{productCard.name}</Tags.H1>
          <div className={styles.productInner}>
            <div className={styles.productPagePrices}>
              Price:&nbsp;
              <span className={styles.productPagePrice}>
                {productCard.price}$
              </span>
            </div>
            <ProductCart
              setCountCart={setCountCart}
              productCartId={productCard.id}
            />
          </div>
          {productCard.discount > 0 && (
            <div className={styles.productPagePrices}>
              Discount:&nbsp;{' '}
              <span className={styles.productPageDiscount}>
                {productCard.discount}$
              </span>{' '}
              <div className={styles.discountPercent}>{getDiscount()}%</div>
            </div>
          )}
          <p className={styles.productPageDescription}>
            {productCard.description}
          </p>
        </div>
      </div>
      <ToastContainer {...toastProps} />
    </>
  );
}

export default ProductInfo;
