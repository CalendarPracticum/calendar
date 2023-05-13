/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { Avatar } from 'primereact/avatar';
import styles from './Header.module.css';
import CurrentUserContext from '../../context/CurrentUserContext';

export function Header({ onLogin }) {
	const userContext = useContext(CurrentUserContext);
	const { loggedIn, setLoggedIn } = userContext;

	const [value, setValue] = useState('light');
	const [darkMode, setDarkMode] = useState(false);
	const themeOptions = [
		{ icon: 'pi pi-moon', value: 'dark', constant: darkMode },
		{ icon: 'pi pi-sun', value: 'light', constant: !darkMode },
	];

	useEffect(() => {
		const themeLink = document.getElementById('app-theme');

		const darkTheme = 'lara-dark-indigo';

		const lightTheme = 'lara-light-indigo';

		if (themeLink) {
			themeLink.href = `${process.env.PUBLIC_URL}/themes/${
				darkMode ? darkTheme : lightTheme
			}/theme.css`;
		}
	}, [darkMode]);

	const themeTemplate = (option) => <i className={option.icon} />;

	// TODO: добавить логотип, удалить логику показа аватарки
	return (
		<header className={styles.header}>
			<div className={`${styles.wrapper} container`}>
				<button type="button" onClick={() => setLoggedIn((prev) => !prev)}>
					Logo
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
				{!loggedIn ? (
					<Button
						label="Войти"
						size="small"
						className={styles.button}
						onClick={() => onLogin(true)}
					/>
				) : (
					<Avatar
						icon="pi pi-user"
						size="large"
						style={{ backgroundColor: '#a5b4fc', color: '#1c2127' }}
						shape="circle"
					/>
				)}
			</div>
		</header>
	);
}

Header.propTypes = {
	onLogin: PropTypes.func.isRequired,
};
