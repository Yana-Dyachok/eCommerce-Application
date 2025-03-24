import { Link } from 'react-router-dom';
import HeaderMainPage from '../../components/header-main-page/header-main-page';
import AboutUsCard from '../../components/about-us-card/about-us-card';
import Footer from '../../components/footer/footer';
import { aboutUs } from '../../components/about-us-card/about-us-info';
import Tags from '../../components/ui/tags/tags';
import styles from './about-us-page.module.css';
import useCountCart from '../../components/header-main-page/useCountCart-hook';

function AboutUsPage() {
  const { countCart } = useCountCart();
  return (
    <>
      <HeaderMainPage countCart={countCart.count} />
      <div className={styles.contentInner}>
        <div className={styles.wrapper}>
          <Tags.H2>Undefineds Team</Tags.H2>
          <div className={styles.aboutUsBlock}>
            {aboutUs.map((us) => (
              <AboutUsCard key={us.img} us={us} />
            ))}
          </div>
          <div className={styles.schoolBlock}>
            <Link to="https://rs.school/" className={styles.logoLink}>
              <div className={styles.logoRS} />
              <p>
                RS School, run by the Rolling Scopes community since 2013,
                offers a unique, free, community-based online education
                experience. With over 600 developer-volunteers from various
                countries and companies as mentors, the program connects people,
                promotes growth, and ensures learning is enjoyable.
              </p>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AboutUsPage;
