import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import styles from './Header.module.css';
import CurrentUserContext from '../../context/CurrentUserContext';

export function Header({ onLogin }) {
	const userContext = useContext(CurrentUserContext);
	const { currentUser, loggedIn } = userContext;
	const { name, email } = currentUser;

	const [value, setValue] = useState('light');
	const themeOptions = [
		{ icon: 'pi pi-moon', value: 'dark' },
		{ icon: 'pi pi-sun', value: 'light' },
	];
	const themeTemplate = (option) => <i className={option.icon} />;

	// TODO: добавить логотип, удалить логику показа логотипа или данных из контекста
	return (
		<header className={styles.header}>
			<div className={`${styles.wrapper} container`}>
				<div>{loggedIn ? `${name} ${email}` : 'Logo'}</div>
				<div className={styles.selectGroup}>
					<SelectButton
						value={value}
						options={themeOptions}
						onChange={(e) => setValue(e.value)}
						itemTemplate={themeTemplate}
						optionLabel="value"
					/>
				</div>
				<Button
					label="Войти"
					size="small"
					outlined
					className={styles.button}
					onClick={() => onLogin(true)}
				/>
			</div>
		</header>
	);
}

Header.propTypes = {
	onLogin: PropTypes.func.isRequired,
};
