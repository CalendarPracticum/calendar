import { useState, useEffect, useMemo } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import ruLocale from 'date-fns/locale/ru';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { dateFnsLocalizer } from 'react-big-calendar';
import { Main } from '../Main/Main';
import { YearCalendar } from '../YearCalendar/YearCalendar';
import { Header } from '../Header/Header';
import styles from './App.module.css';
import CurrentUserContext from '../../context/CurrentUserContext';
import { PopupLogin } from '../PopupLogin/PopupLogin';
import * as auth from '../../utils/api/auth';
// import * as calendarApi from '../../utils/api/calendars';
// import * as eventApi from '../../utils/api/events';

const locales = {
	ru: ruLocale,
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

function App() {
	const [currentUser, setCurrentUser] = useState({});
	const [loggedIn, setLoggedIn] = useState(true);
	const [visiblePopupLogin, setVisiblePopupLogin] = useState(false);

	useEffect(() => {
		if (loggedIn) {
			setCurrentUser({
				name: 'Pink Elephant',
				email: 'test@test.test',
			});
		}
	}, [loggedIn]);

	const user = useMemo(
		() => ({
			currentUser,
			setCurrentUser,
			loggedIn,
			setLoggedIn,
		}),
		[currentUser, loggedIn]
	);

	const handleLogin = (formData) => {
		auth
			.authorize(formData.email, formData.password)
			.then((data) => {
				localStorage.setItem('jwtAccess', data.access);
				localStorage.setItem('jwtRefresh', data.refresh);
				setLoggedIn(true);
			})
			.catch((err) => {
        // eslint-disable-next-line no-console
				console.log('ОШИБКА: ', err);
			});
	};

	const handleRegister = (formData) => {
		auth
			.register(formData.email, formData.password)
			.then(() => handleLogin(formData))
			.catch((err) => {
        // eslint-disable-next-line no-console
				console.log('ОШИБКА: ', err);
			});
	};

	return (
		<CurrentUserContext.Provider value={user}>
			<div className={styles.app}>
				<Header onLogin={setVisiblePopupLogin} />
				<Main localizer={localizer} />
				<YearCalendar localizer={localizer} />
				<PopupLogin
					visible={visiblePopupLogin}
					setVisible={setVisiblePopupLogin}
					handleRegister={handleRegister}
					handleLogin={handleLogin}
				/>
			</div>
		</CurrentUserContext.Provider>
	);
}

export default App;
