import { useState, useEffect, useMemo, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { Toast } from 'primereact/toast';
import { Main } from '../Main/Main';
import { Header } from '../Header/Header';
import styles from './App.module.css';
import { CurrentUserContext, LocalizationContext } from '../../context';
import { PopupLogin } from '../PopupLogin/PopupLogin';
import { PopupNewEvent } from '../PopupNewEvent/PopupNewEvent';
import ruPrime from '../../utils/ruPrime.json';
import * as auth from '../../utils/api/auth';
import * as calendarApi from '../../utils/api/calendars';
import * as eventApi from '../../utils/api/events';
import { NotFound } from '../NotFound/NotFound';
import { PopupNewCalendar } from '../PopupNewCalendar/PopupNewCalendar';
import { PopupEditUser } from '../PopupEditUser/PopupEditUser';
import { PopupEditCalendar } from '../PopupEditCalendar/PopupEditCalendar';
import { Color, Status } from '../../utils/common';

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
	const [visiblePopupNewCalendar, setVisiblePopupNewCalendar] = useState(false);
	const [visiblePopupEditUser, setVisiblePopupEditUser] = useState(false);
	const [visiblePopupEditCalendar, setVisiblePopupEditCalendar] =
		useState(false);
	const [allUserCalendars, setAllUserCalendars] = useState([]);
	const [allUserEvents, setAllUserEvents] = useState([]);
	const [dialogMessage, setDialogMessage] = useState('');
	const [isDialogError, setIsDialogError] = useState(false);
	const [chooseCalendar, setChooseCalendar] = useState([]);
	const [editableCalendar, setEditableCalendar] = useState({});

	// по идее мы должны считать дату старта не от текущей даты, а от отображаемой и прибавлять не год, а месяцы
	const today = new Date();
	const start = [today.getFullYear(), '-01-01'].join('');
	const finish = [today.getFullYear() + 1, '-01-01'].join('');

	const toast = useRef(null);

	const showMessage = (message, status) => {
		toast.current.show({
			severity: status,
			summary: status,
			detail: message,
			life: 3000,
		});
	};

	const handleGetAllCalendars = () => {
		calendarApi
			.getAllUserCalendars()
			.then((data) => {
				setAllUserCalendars(data);
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log('ОШИБКА: ', err.message);
			});
	};

	useEffect(() => {
		if (loggedIn) {
			auth
				.getUserData()
				.then((result) => {
					setCurrentUser({
						email: result.email,
						username: result.username,
						picture: result.profile_picture,
						darkMode: result.settings.dark_mode,
					});
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.log('ОШИБКА: ', err.message);
				});
		}

		eventApi
			// жутчаий хардкод на получение личного календря т.к. пока возможности переключения между ними нету
			.getAllUserEvents({
				start,
				finish,
				calendar:
					allUserCalendars.length !== 0
						? Object.values(chooseCalendar)
								.filter((c) => c !== '')
								.join()
						: '',
			})
			.then((result) => {
				setAllUserEvents(
					result.map((event) => {
						/* eslint-disable no-param-reassign */
						event.title = event.name;
						event.start = event.datetime_start;
						event.end = event.datetime_finish;
						event.allDay = event.all_day;
						// TODO: почистить объект от лишних полей
						return event;
					})
				);
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.log('ОШИБКА: ', error.message);
			});
	}, [loggedIn, allUserCalendars, chooseCalendar, start, finish]);

	useEffect(() => {
		if (localStorage.getItem('jwtAccess')) {
			auth
				.getUserData()
				.then((res) => {
					if (res) {
						setLoggedIn(true);
						handleGetAllCalendars();
					}
				})
				.catch((error) => {
					// eslint-disable-next-line no-console
					console.log('ОШИБКА: ', error.message);
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
			chooseCalendar,
			setChooseCalendar,
			editableCalendar,
			setEditableCalendar,
		}),
		[
			currentUser,
			loggedIn,
			allUserCalendars,
			allUserEvents,
			chooseCalendar,
			editableCalendar,
		]
	);

	// TODO: custom hook useOverlayClick?

	const handleCreateCalendar = ({ name, description, color }) => {
		calendarApi
			.createNewCalendar({ name, description, color })
			.then((newCalendar) =>
				setAllUserCalendars((prevState) => [newCalendar, ...prevState])
			)
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log('ОШИБКА: ', err.message);
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
				console.log('ОШИБКА: ', err.message);
			});
	};

	const handleLogin = ({ email, password }) =>
		auth
			.authorize(email, password)
			.then((data) => {
				localStorage.setItem('jwtAccess', data.access);
				localStorage.setItem('jwtRefresh', data.refresh);
				setLoggedIn(true);
				handleGetAllCalendars();
				setTimeout(() => {
					setVisiblePopupLogin(false);
				}, 1000);
				setIsDialogError(false);
			})
			.catch((err) => {
				setDialogMessage(err.message);
				setIsDialogError(true);
			});

	const handleRegister = ({ email, password }) =>
		auth
			.register(email, password)
			.then(() =>
				auth.authorize(email, password).then((data) => {
					localStorage.setItem('jwtAccess', data.access);
					localStorage.setItem('jwtRefresh', data.refresh);
					handleCreateCalendar({ name: 'Личное', color: Color.LIGHT_GREEN });
					setLoggedIn(true);
					handleGetAllCalendars();
					setTimeout(() => {
						setVisiblePopupLogin(false);
					}, 1000);
					setIsDialogError(false);
				})
			)
			.catch((err) => {
				setDialogMessage(err.message);
				setIsDialogError(true);
			});

	const handleUpdateUser = (userData) => {
		auth
			.updateUserData(userData)
			.then((result) => {
				setCurrentUser({
					email: result.email,
					username: result.username,
					picture: result.profile_picture,
					darkMode: result.settings.dark_mode,
				});
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log('ОШИБКА: ', err.message);
			});
	};

	const logout = () => {
		localStorage.clear();
		setLoggedIn(false);
		setCurrentUser({});
		setAllUserCalendars([]);
		setAllUserEvents([]);
	};

	const handleDeleteUser = (password) => {
		auth
			.deleteUser(password)
			.then((res) => {
				if (res.status === 204) {
					logout();
				} else {
					throw new Error(`Неверный пароль`);
				}
			})
			.catch((err) => {
				showMessage(err.message, Status.ERROR);
			});
	};

	const handleEditCalendar = (calendar) => {
		calendarApi
			.partChangeCalendar(calendar)
			.then((updatedCalendar) => {
				setAllUserCalendars((prevState) =>
					prevState.map((c) => (c.id === calendar.id ? updatedCalendar : c))
				);
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log('ОШИБКА: ', err.message);
			});
	};

	const handleDeleteCalendar = (idCalendar) => {
		calendarApi
			.deleteCalendar(idCalendar)
			.then((res) => {
				if (res.status === 204) {
					showMessage('Календарь удалён', Status.SUCCESS);
					setAllUserCalendars((prevState) =>
						prevState.filter((c) => c.id !== idCalendar)
					);
				} else {
					throw new Error(`Что-то пошло не так`);
				}
			})
			.catch((err) => {
				showMessage(err.message, Status.ERROR);
			});
	};

	return (
		<LocalizationContext.Provider value={localizer}>
			<CurrentUserContext.Provider value={user}>
				<div className={styles.app}>
					<Routes>
						<Route
							exact
							path="/"
							element={
								<>
									<Header
										onLogin={setVisiblePopupLogin}
										onUserClick={setVisiblePopupEditUser}
										logout={logout}
									/>
									<Main
										onNewEventClick={setVisiblePopupNewEvent}
										onNewCalendarClick={setVisiblePopupNewCalendar}
										onEditCalendarClick={setVisiblePopupEditCalendar}
									/>
								</>
							}
						/>
						<Route path="*" element={<NotFound />} />
					</Routes>

					<PopupLogin
						visible={visiblePopupLogin}
						setVisible={setVisiblePopupLogin}
						handleRegister={handleRegister}
						handleLogin={handleLogin}
						message={dialogMessage}
						isError={isDialogError}
					/>

					<PopupNewEvent
						visible={visiblePopupNewEvent}
						setVisible={setVisiblePopupNewEvent}
						onCreateEvent={handleCreateEvent}
					/>

					<PopupNewCalendar
						visible={visiblePopupNewCalendar}
						setVisible={setVisiblePopupNewCalendar}
						onCreateCalendar={handleCreateCalendar}
					/>

					<PopupEditUser
						visible={visiblePopupEditUser}
						setVisible={setVisiblePopupEditUser}
						onUpdateUser={handleUpdateUser}
						onDeleteUser={handleDeleteUser}
					/>

					<PopupEditCalendar
						visible={visiblePopupEditCalendar}
						setVisible={setVisiblePopupEditCalendar}
						onEditCalendar={handleEditCalendar}
						onDeleteCalendar={handleDeleteCalendar}
					/>

					<Toast ref={toast} />
				</div>
			</CurrentUserContext.Provider>
		</LocalizationContext.Provider>
	);
}

export default App;
