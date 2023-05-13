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
	const [loggedIn, setLoggedIn] = useState(false);
	const [visiblePopupLogin, setVisiblePopupLogin] = useState(false);

	useEffect(() => {
		if (loggedIn) {
			setCurrentUser({
				name: 'testName',
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

	return (
		<CurrentUserContext.Provider value={user}>
			<div className={styles.app}>
				<Header onLogin={setVisiblePopupLogin} />
				<Main />
				<YearCalendar localizer={localizer} />
				<PopupLogin
					visible={visiblePopupLogin}
					setVisible={setVisiblePopupLogin}
				/>
			</div>
		</CurrentUserContext.Provider>
	);
}

export default App;
