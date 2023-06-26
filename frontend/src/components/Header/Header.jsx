/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import styles from './Header.module.css';
import { CurrentUserContext } from '../../context';
import { AvatarGroup } from '../AvatarGroup/AvatarGroup';
import logo from '../../images/calendarLogo.svg';
import logoDark from '../../images/MyCalenDaily_dark.svg';
import logoLight from '../../images/MyCalenDaily_light.svg';

export function Header({
	onLogin,
	onAvatarClick,
	onUserClick,
	onPasswordClick,
	logout,
}) {
	const userContext = useContext(CurrentUserContext);
	const { loggedIn, currentUser } = userContext;
	const { darkMode: userDarkMode } = currentUser;

	const [value, setValue] = useState('light');
	const [darkMode, setDarkMode] = useState(userDarkMode);

	const themeOptions = [
		{ icon: 'pi pi-moon', value: 'dark', constant: darkMode },
		{ icon: 'pi pi-sun', value: 'light', constant: !darkMode },
	];

	useEffect(() => {
		const themeLink = document.getElementById('app-theme');
		const darkTheme = 'lara-dark-blue';
		const lightTheme = 'soho-light';

		if (themeLink) {
			themeLink.href = `${process.env.PUBLIC_URL}/themes/${
				darkMode ? darkTheme : lightTheme
			}/theme.css`;
		}
	}, [darkMode]);

	useEffect(() => {
		if (loggedIn) {
			setDarkMode(userDarkMode);
			setValue(userDarkMode ? 'dark' : 'light');
		}
	}, [loggedIn, userDarkMode]);

	const themeTemplate = (option) => <i className={option.icon} />;

	return (
		<header className={styles.header} id="header">
			<div className={`${styles.wrapper} container`}>
				<div className={styles.logoGroup}>
					<img src={logo} alt="Логотип MyCalenDaily" />
					{darkMode ? (
						<img
							className={styles.logo}
							src={logoDark}
							alt="Логотип MyCalenDaily"
						/>
					) : (
						<img
							className={styles.logo}
							src={logoLight}
							alt="Логотип MyCalenDaily"
						/>
					)}
				</div>
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
					<AvatarGroup
						onAvatarClick={onAvatarClick}
						onUserClick={onUserClick}
						onPasswordClick={onPasswordClick}
						logout={logout}
					/>
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
	onAvatarClick: PropTypes.func.isRequired,
	onUserClick: PropTypes.func.isRequired,
	onPasswordClick: PropTypes.func.isRequired,
	logout: PropTypes.func.isRequired,
};
