/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import styles from './Header.module.css';
import CurrentUserContext from '../../context/CurrentUserContext';
import { AvatarGroup } from '../AvatarGroup/AvatarGroup';

export function Header({ onLogin }) {
  const userContext = useContext(CurrentUserContext);
  const { loggedIn } = userContext;

  const [value, setValue] = useState('light');
  const [darkMode, setDarkMode] = useState(false);
  const themeOptions = [
    { icon: 'pi pi-moon', value: 'dark', constant: darkMode },
    { icon: 'pi pi-sun', value: 'light', constant: !darkMode },
  ];

  useEffect(() => {
    const themeLink = document.getElementById('app-theme');

    const darkTheme = 'lara-dark-blue';

    const lightTheme = 'soho-light';

    if (themeLink) {
      themeLink.href = `${process.env.PUBLIC_URL}/themes/${darkMode ? darkTheme : lightTheme
        }/theme.css`;
    }
  }, [darkMode]);

  const themeTemplate = (option) => <i className={option.icon} />;

  // TODO: добавить логотип, удалить логику показа аватарки

  return (
    <header className={styles.header}>
      <div className={`${styles.wrapper} container`}>
        <button type="button">
          CalenDaiLy
        </button>
        <div className={styles.selectGroup}>
          <SelectButton
            value={value}
            options={themeOptions}
            onChange={(e) => {
              setValue(e.value);
              setDarkMode(!darkMode);
            }}
            itemTemplate={themeTemplate}
            optionLabel="value"
            optionDisabled="constant"
          />
        </div>
        {loggedIn ? (
          <AvatarGroup />
        ) : (
          <Button
            label="Войти"
            size="small"
            className={styles.button}
            onClick={() => onLogin(true)}
          />
        )}
      </div>
    </header>
  );
}

Header.propTypes = {
  onLogin: PropTypes.func.isRequired,
};
