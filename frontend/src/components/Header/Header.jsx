import React, { useState, useContext } from 'react';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import 'primeicons/primeicons.css';
import styles from './Header.module.css';
import CurrentUserContext from '../../context/CurrentUserContext';

export function Header() {
  const userContext = useContext(CurrentUserContext);
  const { currentUser, loggedIn, setLoggedIn } = userContext;
  const { name, email } = currentUser;

  const [checked, setChecked] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`${styles.wrapper} container`}>
        <button type="button" onClick={() => setLoggedIn(!loggedIn)}>
          {loggedIn ? `${name} ${email}` : 'Logo'}
        </button>
        <div className={styles.switchGroup}>
          <i className="pi pi-moon" style={{ fontSize: '1.5rem' }} />
          <InputSwitch
            checked={checked}
            onChange={(e) => setChecked(e.value)}
          />
          <i className="pi pi-sun" style={{ fontSize: '1.5rem' }} />
        </div>
        <Button label="Войти" size="small" outlined className={styles.button} />
      </div>
    </header>
  );
}
