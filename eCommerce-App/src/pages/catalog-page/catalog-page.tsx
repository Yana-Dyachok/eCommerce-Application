import { useState, useCallback } from 'react';
import HeaderMainPage from '../../components/header-main-page/header-main-page';
import styles from './catalog-page.module.css';
import PriceInput from '../../components/price-input/price-input';
import SearchInput from '../../components/search-input/search-input';
import Catalog from '../../components/catalog/catalog';
import SortSelect from '../../components/sort-select/sort-select';
import { AccordionCatalog } from '../../components/catalog-accordion/catalog-accordion';
import Footer from '../../components/footer/footer';
import useCountCart from '../../components/header-main-page/useCountCart-hook';

function CatalogPage() {
  const { countCart, setCountCart } = useCountCart();
  const [query, setQuery] = useState<object>({});
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [sortOption, setSortOption] = useState<string | undefined>(undefined);
  const [categoryOption, setCategoryOption] = useState<string | undefined>(
    undefined,
  );

  const handlePriceChange = useCallback(
    (
      newMinPrice?: number,
      newMaxPrice?: number,
      newSearch?: string,
      selectedSort?: string,
      selectedCategory?: string,
    ) => {
      let priceFilter = '';
      if ((newMinPrice === undefined || newMinPrice === 0) && newMaxPrice) {
        priceFilter = `variants.price.centAmount:range (0 to ${newMaxPrice * 100})`;
      }
      if ((newMaxPrice === undefined || newMaxPrice === 0) && newMinPrice) {
        priceFilter = `variants.price.centAmount:range (${newMinPrice * 100} to 99999)`;
      }
      if (newMaxPrice && newMinPrice) {
        priceFilter = `variants.price.centAmount:range (${newMinPrice * 100} to ${newMaxPrice * 100})`;
      }
      let newQuery = {};
      if (selectedCategory === undefined || selectedCategory === '') {
        newQuery = {
          queryArgs: {
            sort: [selectedSort],
            ...(newSearch ? { [`text.en-US`]: newSearch } : {}),
            filter: [priceFilter],
          },
        };
      }
      if (selectedCategory) {
        newQuery = {
          queryArgs: {
            sort: [selectedSort],
            ...(newSearch ? { [`text.en-US`]: newSearch } : {}),
            filter: [priceFilter, `categories.id:"${selectedCategory}"`],
          },
        };
      }
      setQuery(newQuery);
    },
    [],
  );

  // filter: [`categories.id:"${categoryId}"`],

  const handlePriceInputChange = (
    newMinPrice?: number,
    newMaxPrice?: number,
  ) => {
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
    handlePriceChange(
      newMinPrice,
      newMaxPrice,
      search,
      sortOption,
      categoryOption,
    );
  };

  const handleSearchChange = (newSearch: string) => {
    if (newSearch.trim() === '') {
      setSearch(undefined);
      handlePriceChange(minPrice, maxPrice, undefined);
    } else {
      setSearch(newSearch);
      handlePriceChange(
        minPrice,
        maxPrice,
        newSearch,
        sortOption,
        categoryOption,
      );
    }
  };

  const handleSortChange = (newSelectedSort: string) => {
    setSortOption(newSelectedSort);
    handlePriceChange(
      minPrice,
      maxPrice,
      search,
      newSelectedSort,
      categoryOption,
    );
  };

  const handleCategoryChange = (newSelectedCategory: string) => {
    setCategoryOption(newSelectedCategory);
    handlePriceChange(
      minPrice,
      maxPrice,
      search,
      sortOption,
      newSelectedCategory,
    );
  };

  return (
    <>
      <HeaderMainPage countCart={countCart.count} />
      <div className={styles.catalogCategorySection}>
        <div className={styles.wrapper}>
          <AccordionCatalog onCategoryChange={handleCategoryChange} />
          <div className={styles.catalogWrapper}>
            <div className={styles.wrapperFilter}>
              <SortSelect onSortChange={handleSortChange} />
              <PriceInput onPriceChange={handlePriceInputChange} />
              <SearchInput onSearchChange={handleSearchChange} />
            </div>
            <Catalog query={query} setCountCart={setCountCart} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CatalogPage;
