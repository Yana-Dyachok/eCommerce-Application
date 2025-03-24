import React, { useEffect, useState } from 'react';
import { Category } from '@commercetools/platform-sdk';
import getCategories from '../../api/getCategories';
import styles from './tree-categories.module.css';

interface CategorySelectProps {
  onCategoryChange: (selectedCategory: string) => void;
}

function CategorySelect({ onCategoryChange }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then((response) => {
        let rootCategories;
        if (response.category) {
          rootCategories = response.category.filter(
            (category: Category) => !category.parent,
          );
          setCategories(rootCategories);
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = event.target.value;
    onCategoryChange(selectedCategory);
  };

  return (
    <div className={styles.categorySelectBlock}>
      <select className={styles.categorySelect} onChange={handleSelectChange}>
        <option value="">Category</option>
        {categories.map((category) => (
          <option
            className={styles.categoryOption}
            key={category.id}
            value={category.id}
          >
            {category.name['en-US']}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategorySelect;
