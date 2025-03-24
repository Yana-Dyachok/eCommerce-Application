import Button from '../ui/button/button';
import Tags from '../ui/tags/tags';
import styles from './main-content.module.css';

function MainContent() {
  return (
    <div className={styles.mainContent}>
      <div className={styles.wrapper}>
        <section className={styles.mainSection}>
          <Tags.H1>Welcome to our online shop!</Tags.H1>
          <Tags.H2>Transform your space with us</Tags.H2>
          <Button btnType="button" to="/catalog">
            shop now
          </Button>
        </section>
        <section className={styles.mainSection}>
          <Tags.H2>Don&apos;t miss out!</Tags.H2>
          <Tags.H2>Enjoy grand opening discounts storewide!</Tags.H2>
          <p>Use promocode:</p>
          <div className={styles.promocode}>DECOR</div>
        </section>
      </div>
    </div>
  );
}

export default MainContent;
