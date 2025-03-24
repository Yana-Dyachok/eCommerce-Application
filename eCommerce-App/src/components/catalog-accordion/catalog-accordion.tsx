/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react';
import { Category } from '@commercetools/platform-sdk';
import getCategories from '../../api/getCategories';
import styles from './catalog-accordion.module.css';

interface CategorySelectProps {
  onCategoryChange: (selectedCategory: string) => void;
}

function AccordionSection({
  categories,
  category,
  isActiveSection,
  setActiveIndex,
  sectionIndex,
  onCategoryChange,
  activeCategory,
}: {
  categories: Category[];
  category: Category;
  isActiveSection: boolean;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  sectionIndex: number;
  onCategoryChange: (selectedCategory: string) => void;
  activeCategory: string;
}) {
  const toggleSection = () => {
    const nextIndex = isActiveSection ? null : sectionIndex;
    setActiveIndex(nextIndex!);
  };
  const handleCategoryChange = (event: React.MouseEvent<HTMLDivElement>) => {
    const selectedCategory = event.currentTarget.id;
    onCategoryChange(selectedCategory);
  };
  return (
    <div className={styles.accordionSection}>
      <div className={styles.accordionToggler} onClick={toggleSection}>
        <div
          className={`${styles.accordionTitle} ${activeCategory === category.id ? styles.activeTitle : ''}`}
          id={category.id}
          onClick={(e) => {
            handleCategoryChange(e);
          }}
        >
          {category.name['en-US']}
        </div>
        <div>{isActiveSection ? '-' : '+'}</div>
      </div>
      {isActiveSection &&
        categories.map((subCategory) => {
          return subCategory.parent?.id === category.id ? (
            <div
              key={subCategory.id}
              id={subCategory.id}
              className={styles.accordionContentWrapper}
              onClick={(e) => {
                handleCategoryChange(e);
              }}
            >
              <div
                className={`${styles.accordionContent} ${activeCategory === subCategory.id ? styles.activeContent : ''}`}
                id={subCategory.id}
              >
                {`${subCategory.name['en-US']}`}
              </div>
            </div>
          ) : null;
        })}
    </div>
  );
}

export function AccordionCatalog({ onCategoryChange }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('');
  useEffect(() => {
    getCategories()
      .then((response) => {
        if (response.category) {
          setCategories(response.category);
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, []);

  const handleCategoryChange = (selectedCategory: string) => {
    setActiveCategory(selectedCategory);
    onCategoryChange(selectedCategory);
  };

  return (
    <div className={styles.accordionWrapper}>
      {categories.map((category, index) => {
        return !category.parent ? (
          <AccordionSection
            key={category.id}
            category={category}
            categories={categories}
            isActiveSection={index === activeIndex}
            setActiveIndex={setActiveIndex}
            sectionIndex={index}
            onCategoryChange={handleCategoryChange}
            activeCategory={activeCategory}
          />
        ) : null;
      })}
    </div>
  );
}

export default AccordionCatalog;
