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
import { addLocale } from 'primereact/api';
import { Main } from '../Main/Main';
import { YearCalendar } from '../YearCalendar/YearCalendar';
import { Header } from '../Header/Header';
import styles from './App.module.css';
import CurrentUserContext from '../../context/CurrentUserContext';
import { PopupLogin } from '../PopupLogin/PopupLogin';
import { PopupNewEvent } from '../PopupNewEvent/PopupNewEvent';
import ruPrime from '../../utils/ruPrime.json';
import * as auth from '../../utils/api/auth';
import * as calendarApi from '../../utils/api/calendars';
import * as eventApi from '../../utils/api/events';

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

addLocale('ru', ruPrime);

function App() {
	const [currentUser, setCurrentUser] = useState({});
	const [loggedIn, setLoggedIn] = useState(false);
	const [visiblePopupLogin, setVisiblePopupLogin] = useState(false);
	const [visiblePopupNewEvent, setVisiblePopupNewEvent] = useState(false);
	const [allUserCalendars, setAllUserCalendars] = useState([]);
	const [allUserEvents, setAllUserEvents] = useState([]);
	const start = '2023-01-01';
	const finish = '2024-01-01';

	useEffect(() => {
		if (loggedIn) {
			const jwtAccess = localStorage.getItem('jwtAccess');
			auth
				.getUserData(jwtAccess)
				.then((result) => {
					setCurrentUser(result);
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.log('ОШИБКА: ', err);
				})
    }

    eventApi
    // жутчаий хардкод на получение личного календря т.к. пока возможности переключения между ними нету
      .getAllUserEvents(start, finish, allUserCalendars.length !== 0 ? allUserCalendars[0].id : '')
      .then((result) => {
        setAllUserEvents(result.map(event => {
          /* eslint-disable no-param-reassign */
          event.title = event.name;
          event.start = event.datetime_start;
          event.end = event.datetime_finish;
          event.allDay = event.all_day;
          return event;
        }));
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('ОШИБКА: ', error);
      });
	}, [loggedIn, allUserCalendars]);

	useEffect(() => {
		if (localStorage.getItem('jwtAccess')) {
			const jwtAccess = localStorage.getItem('jwtAccess');
			auth
				.getUserData(jwtAccess)
				.then((res) => {
					if (res) {
						setLoggedIn(true);
            // eslint-disable-next-line
            handleGetAllCalendars();
					}
				})
				.catch((error) => {
					// eslint-disable-next-line no-console
					console.log('ОШИБКА: ', error);
				});
		}
	}, []);

	const user = useMemo(
		() => ({
			currentUser,
			setCurrentUser,
			loggedIn,
			setLoggedIn,
			allUserCalendars,
			setAllUserCalendars,
      allUserEvents,
      setAllUserEvents,
		}),
		[currentUser, loggedIn, allUserCalendars, allUserEvents]
	);

	// TODO: closeAllPopups?
	// TODO: custom hook useOverlayClick?

	const handleGetAllCalendars = () => {
		calendarApi
			.getAllUserCalendars()
			.then((data) => {
				setAllUserCalendars(data)
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log('ОШИБКА: ', err);
			});
	};

	const handleCreateCalendar = ({ name, description, color }) => {
		calendarApi
			.createNewCalendar(name, description, color)
			.then()
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log('ОШИБКА: ', err);
			});
	};

	const handleCreateEvent = (data) => {
		eventApi
			.createNewEvent(data)
			.then((event) => {
        event.title = event.name;
        event.start = event.datetime_start;
        event.end = event.datetime_finish;
        event.allDay = event.all_day;
				setAllUserEvents([event, ...allUserEvents]);
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log('ОШИБКА: ', err);
			});
	};

	const handleLogin = ({ email, password }) => {
		auth
			.authorize(email, password)
			.then((data) => {
				localStorage.setItem('jwtAccess', data.access);
				localStorage.setItem('jwtRefresh', data.refresh);
				setLoggedIn(true);
				handleGetAllCalendars();
				setVisiblePopupLogin(false); // всплывашка подтверждения тоже закрывается, доработать
      })
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log('ОШИБКА: ', err);
			});
	};

	const handleRegister = ({ email, password }) => {
		auth
			.register(email, password)
			.then(
        auth
				.authorize(email, password)
				.then((data) => {
					localStorage.setItem('jwtAccess', data.access);
					localStorage.setItem('jwtRefresh', data.refresh);
					handleCreateCalendar({ name: 'Личное', color: '#91DED3' });
					setLoggedIn(true);
					handleGetAllCalendars();
					setVisiblePopupLogin(false); // всплывашка подтверждения тоже закрывается, доработать
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.log('ОШИБКА: ', err);
				})
      )
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log('ОШИБКА: ', err);
			});
	};

	return (
		<CurrentUserContext.Provider value={user}>
			<div className={styles.app}>
				<Header onLogin={setVisiblePopupLogin} />
				<Main
					localizer={localizer}
					onNewEventClick={setVisiblePopupNewEvent}
					events={allUserEvents}
				/>
				<YearCalendar localizer={localizer} />
				<PopupLogin
					visible={visiblePopupLogin}
					setVisible={setVisiblePopupLogin}
					handleRegister={handleRegister}
					handleLogin={handleLogin}
				/>
				<PopupNewEvent
					visible={visiblePopupNewEvent}
					setVisible={setVisiblePopupNewEvent}
					onCreateEvent={handleCreateEvent}
					allUserCalendars={allUserCalendars}
				/>
			</div>
		</CurrentUserContext.Provider>
	);
}

export default App;
