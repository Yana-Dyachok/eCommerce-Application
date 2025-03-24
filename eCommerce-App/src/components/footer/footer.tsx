import { Link } from 'react-router-dom';
import LinkTemplate from '../ui/link/link';
import styles from './footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrapper}>
        <Link to="https://rs.school/" className={styles.linkBlock}>
          <div className={styles.logoRS} />
        </Link>
        <p className={styles.year}>2024 &copy;</p>
        <div className={styles.teamBlock}>
          <Link to="/about-us" className={styles.linkBlock}>
            <div className={styles.iconGitHub} />
            <span className={styles.text}>Our team</span>
          </Link>
          <nav className={styles.footerNav}>
            {' '}
            <LinkTemplate to="https://github.com/rs0048">
              Roman Sokolov
            </LinkTemplate>
            <LinkTemplate to="https://github.com/Yana-Dyachok">
              Yana Dyachok
            </LinkTemplate>
            <LinkTemplate to="https://github.com/lonelybush">
              Nikita Radevich
            </LinkTemplate>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
