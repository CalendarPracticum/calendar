import React, { useState, useContext } from 'react';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import 'primeicons/primeicons.css';
import styles from './Header.module.css';
import CurrentUserContext from '../../context/CurrentUserContext';

export function Header() {
  const userContext = useContext(CurrentUserContext);
  const { currentUser, loggedIn, setLoggedIn } = userContext;
  const { name, email } = currentUser;

  const [value, setValue] = useState('light');
  const themeOptions = [
    { icon: 'pi pi-moon', value: 'dark' },
    { icon: 'pi pi-sun', value: 'light' },
  ];
  const themeTemplate = (option) => <i className={option.icon} />;

  return (
    <header className={styles.header}>
      <div className={`${styles.wrapper} container`}>
        <button type="button" onClick={() => setLoggedIn(!loggedIn)}>
          {loggedIn ? `${name} ${email}` : 'Logo'}
        </button>
        <div className={styles.selectGroup}>
          <SelectButton
            value={value}
            options={themeOptions}
            onChange={(e) => setValue(e.value)}
            itemTemplate={themeTemplate}
            optionLabel="value"
          />
        </div>
        <Button label="Войти" size="small" outlined className={styles.button} />
      </div>
    </header>
  );
}
