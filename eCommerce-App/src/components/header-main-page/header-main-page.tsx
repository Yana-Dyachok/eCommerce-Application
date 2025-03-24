import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logOutClient from '../../utils/local-storage/logOutClient';
import LinkTemplateIcon from '../ui/link/link-icon';
import Logo from '../ui/logo/logo';
import CartHeader from '../ui/cart-header/cart-header';

import styles from './header-main-page.module.css';

function HeaderMainPage({ countCart }: { countCart: number }) {
  const navigate = useNavigate();
  const handleLogOut = () => {
    logOutClient();
    navigate('/catalog');
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const authToken = localStorage.getItem('authToken');

  return (
    <header className={styles.headerMain}>
      <div className={styles.wrapper}>
        <Logo />
        <button
          className={styles.burgerMenu}
          onClick={toggleMenu}
          type="button"
        >
          <div
            className={
              isMenuOpen
                ? `${styles.burgerIcon} ${styles.open}`
                : styles.burgerIcon
            }
          >
            <span className={styles.spanBurger} />
            <span className={styles.spanBurger} />
            <span className={styles.spanBurger} />
          </div>
        </button>
        <nav
          className={
            isMenuOpen ? `${styles.navMain} ${styles.open}` : styles.navMain
          }
        >
          <LinkTemplateIcon to="/catalog" className={styles.iconCatalog}>
            Catalog
          </LinkTemplateIcon>
          <LinkTemplateIcon to="/main" className={styles.iconMain}>
            Main
          </LinkTemplateIcon>
          <LinkTemplateIcon to="/about-us" className={styles.iconAboutUs}>
            About us
          </LinkTemplateIcon>
          <CartHeader countCart={countCart} />
          {authToken ? (
            <>
              <LinkTemplateIcon to="/profile" className={styles.iconProfile}>
                Profile
              </LinkTemplateIcon>
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
              <div
                onClick={handleLogOut}
                className={styles.linkBlock}
                role="button"
                tabIndex={0}
              >
                <div className={styles.iconLogOut} />
                <span className={styles.textLink}> Log out</span>
              </div>
            </>
          ) : (
            <>
              <LinkTemplateIcon to="/login" className={styles.iconLogIn}>
                Log in
              </LinkTemplateIcon>
              <LinkTemplateIcon
                to="/registration"
                className={styles.iconSignUp}
              >
                Sign up
              </LinkTemplateIcon>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default HeaderMainPage;
