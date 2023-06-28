/* Core */
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';

/* Libraries */
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import ruLocale from 'date-fns/locale/ru';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import parseISO from 'date-fns/parseISO';
import { dateFnsLocalizer } from 'react-big-calendar';
import { addLocale } from 'primereact/api';
import { Toast } from 'primereact/toast';

/* Instruments */
import ruPrime from '../../utils/ruPrime.json';
import {
	Color,
	Status,
	holidaysCalendar,
	BASE_URL,
} from '../../utils/constants';
import * as auth from '../../utils/api/auth';
import * as calendarApi from '../../utils/api/calendars';
import * as eventApi from '../../utils/api/events';
import {
	CurrentUserContext,
	LocalizationContext,
	CalendarsContext,
} from '../../context';
import styles from './App.module.css';

/* Components */
import { Header } from '../Header/Header';
import { Main } from '../Main/Main';
import { Loader } from '../Loader/Loader';
import { NotFound } from '../NotFound/NotFound';
import {
	PopupLogin,
	PopupNewEvent,
	PopupNewCalendar,
	PopupEditUser,
	PopupEditCalendar,
	PopupChangePassword,
	PopupEditEvent,
	PopupDialog,
	PopupEditAvatar,
} from '../Popups';

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
	// User
	const [loggedIn, setLoggedIn] = useState(false);
	const [currentUser, setCurrentUser] = useState({});

	// Calendars & Events
	const [holidays, setHolidays] = useState([]);
	const [allUserCalendars, setAllUserCalendars] = useState([]);
	const [allUserEvents, setAllUserEvents] = useState([]);
	const [chosenCalendars, setChosenCalendars] = useState([]);
	const [editableCalendar, setEditableCalendar] = useState({});
	const [editableEvent, setEditableEvent] = useState({});

	// Popups
	const [visiblePopupLogin, setVisiblePopupLogin] = useState(false);
	const [visiblePopupNewEvent, setVisiblePopupNewEvent] = useState(false);
	const [visiblePopupNewCalendar, setVisiblePopupNewCalendar] = useState(false);
	const [visiblePopupEditUser, setVisiblePopupEditUser] = useState(false);
	const [visiblePopupEditEvent, setVisiblePopupEditEvent] = useState(false);
	const [visiblePopupEditAvatar, setVisiblePopupEditAvatar] = useState(false);
	const [visiblePopupEditCalendar, setVisiblePopupEditCalendar] =
		useState(false);
	const [visiblePopupChangePassword, setVisiblePopupChangePassword] =
		useState(false);

	// Helpers
	const [showMessage, setShowMessage] = useState(false);
	const [dialogMessage, setDialogMessage] = useState('');
	const [isDialogError, setIsDialogError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const today = new Date();
	const start = useRef([today.getFullYear(), '-01-01'].join(''));
	const finish = useRef([today.getFullYear() + 1, '-01-01'].join(''));

	const toast = useRef(null);

	const showToast = (message, status) => {
		toast.current.show({
			severity: status,
			summary: 'Успех',
			detail: message,
			life: 3000,
		});
	};

	const showDialog = (message, status) => {
		setDialogMessage(message);
		if (status === false) {
			setTimeout(() => {
				setShowMessage(false);
			}, 1500);
		}
		setIsDialogError(status);
		setShowMessage(true);
	};

	const logout = useCallback((message = null) => {
		localStorage.clear();
		setLoggedIn(false);
		setCurrentUser({});
		setAllUserCalendars([]);
		setAllUserEvents([]);
		setChosenCalendars(holidaysCalendar.map((c) => c.id));

		if (message) {
			showToast(message, Status.SUCCESS);
		}
	}, []);

	const checkTokens = useCallback(
		(access, refresh, launch) => {
			auth
				.verify(access)
				.then(() => {
					if (launch) {
						setLoggedIn(true);
					}
				})
				.catch(() => {
					if (refresh) {
						auth
							.refreshAccess(refresh)
							.then((data) => {
								localStorage.setItem('jwtAccess', data.access);
								setLoggedIn(true);
							})
							.catch(() => {
								logout();
								showDialog('Введите логин и пароль повторно.', true);
							});
					}
				});
		},
		[logout]
	);

	useEffect(() => {
		eventApi
			.getHolidays({
				start: start.current,
				finish: finish.current,
				calendar: holidaysCalendar.map((c) => c.id),
			})
			.then((result) => {
				const preparedData = result.map((event) => {
					/* eslint-disable no-param-reassign */
					event.title = event.name;
					event.start = parseISO(event.datetime_start);
					event.end = parseISO(event.datetime_finish);
					event.allDay = event.all_day;

					return event;
				});

				setHolidays(preparedData);
				setChosenCalendars(holidaysCalendar.map((c) => c.id));
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.log('ОШИБКА: ', error.message);
			});
	}, []);

	useEffect(() => {
		if (loggedIn) {
			calendarApi
				.getAllUserCalendars()
				.then((calendars) => {
					setAllUserCalendars(calendars);
					setChosenCalendars((prevState) => [
						...calendars.map((c) => c.id),
						...prevState,
					]);
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.log('ОШИБКА: ', err.message);
				});
		}
	}, [loggedIn]);

	useEffect(() => {
		if (loggedIn) {
			const calendarsId = allUserCalendars.map((c) => c.id);
			eventApi
				.getAllUserEvents({
					start: start.current,
					finish: finish.current,
					calendar: calendarsId,
				})
				.then((result) => {
					const preparedData = result.map((event) => {
						/* eslint-disable no-param-reassign */
						event.title = event.name;
						event.start = parseISO(event.datetime_start);
						event.end = parseISO(event.datetime_finish);
						event.allDay = event.all_day;
						return event;
					});

					setAllUserEvents(preparedData);
				})
				.catch((error) => {
					// eslint-disable-next-line no-console
					console.log('ОШИБКА: ', error.message);
				});
		}
	}, [loggedIn, allUserCalendars]);

	useEffect(() => {
		if (loggedIn) {
			auth
				.getUserData()
				.then((result) => {
					const fullUrl = result.profile_picture
						? `${BASE_URL}${result.profile_picture}`
						: result.profile_picture;

					setCurrentUser({
						email: result.email,
						username: result.username,
						picture: fullUrl,
						darkMode: result.settings.dark_mode,
					});
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.log('ОШИБКА: ', err.message);
				});
		}
	}, [loggedIn]);

	useEffect(() => {
		const access = localStorage.getItem('jwtAccess');
		const refresh = localStorage.getItem('jwtRefresh');

		if (access && refresh) {
			checkTokens(access, refresh, true);
		}
	}, [checkTokens]);

	const user = useMemo(
		() => ({
			currentUser,
			loggedIn,
		}),
		[currentUser, loggedIn]
	);

	const calendars = useMemo(
		() => ({
			holidays,
			allUserCalendars,
			allUserEvents,
			chosenCalendars,
			setChosenCalendars,
			editableCalendar,
			setEditableCalendar,
			editableEvent,
			setEditableEvent,
		}),
		[
			holidays,
			allUserCalendars,
			allUserEvents,
			chosenCalendars,
			editableCalendar,
			editableEvent,
		]
	);

	// User
	const handleLogin = ({ email, password }) => {
		setIsLoading(true);
		auth
			.authorize(email, password)
			.then((data) => {
				localStorage.setItem('jwtAccess', data.access);
				localStorage.setItem('jwtRefresh', data.refresh);

				setLoggedIn(true);
				setVisiblePopupLogin(false);
				showDialog('Вы успешно вошли!', false);
			})
			.catch((err) => {
				showDialog(err.message, true);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleRegister = ({ email, password }) => {
		setIsLoading(true);
		auth
			.register(email, password)
			.then(() =>
				auth.authorize(email, password).then((tokens) => {
					localStorage.setItem('jwtAccess', tokens.access);
					localStorage.setItem('jwtRefresh', tokens.refresh);

					calendarApi
						.createNewCalendar({
							name: 'Личное',
							description: '',
							color: Color.DEFAULT,
						})
						.then(() => {
							setLoggedIn(true);
							setVisiblePopupLogin(false);
							showDialog('Регистрация прошла успешно!', false);
						});
				})
			)
			.catch((err) => {
				showDialog(err.message, true);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleUpdateUser = (userData) => {
		const access = localStorage.getItem('jwtAccess');
		const refresh = localStorage.getItem('jwtRefresh');

		if (access && refresh) {
			checkTokens(access, refresh, false);
			setIsLoading(true);
			auth
				.updateUserData(userData)
				.then((result) => {
					const picture = `${BASE_URL}${result.profile_picture}`;

					setCurrentUser({
						email: result.email,
						username: result.username,
						picture: result.profile_picture ? picture : null,
						darkMode: result.settings.dark_mode,
					});

					setVisiblePopupEditUser(false);
					showToast('Данные успешно обновлены!', Status.SUCCESS);
				})
				.catch((err) => {
					showDialog(err.message, true);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			logout();
			showDialog('Введите логин и пароль повторно.', true);
			setVisiblePopupEditUser(false);
		}
	};

	const handleChangePassword = (data) => {
		const access = localStorage.getItem('jwtAccess');
		const refresh = localStorage.getItem('jwtRefresh');

		if (access && refresh) {
			checkTokens(access, refresh, false);
			setIsLoading(true);
			auth
				.changePassword(data)
				.then((res) => {
					if (res.status === 204) {
						setVisiblePopupChangePassword(false);
						showToast('Пароль изменён', Status.SUCCESS);
					} else {
						throw new Error(`Неверный пароль`);
					}
				})
				.catch((err) => {
					showDialog(err.message, true);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			logout();
			showDialog('Введите логин и пароль повторно.', true);
			setVisiblePopupChangePassword(false);
		}
	};

	const handleEditAvatar = (data) => {
		const access = localStorage.getItem('jwtAccess');
		const refresh = localStorage.getItem('jwtRefresh');

		if (access && refresh) {
			checkTokens(access, refresh, false);
			setIsLoading(true);
			auth
				.updateAvatar(data)
				.then((result) => {
					const picture = `${BASE_URL}${result.profile_picture}`;

					setCurrentUser({
						email: result.email,
						username: result.username,
						picture,
						darkMode: result.settings.dark_mode,
					});

					setVisiblePopupEditAvatar(false);
					showToast('Аватарка сохранена', Status.SUCCESS);
				})
				.catch((err) => {
					showDialog(err.message, true);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			logout();
			showDialog('Введите логин и пароль повторно.', true);
			setVisiblePopupEditCalendar(false);
		}
	};

	const handleDeleteAvatar = () => {
		const access = localStorage.getItem('jwtAccess');
		const refresh = localStorage.getItem('jwtRefresh');

		if (access && refresh) {
			checkTokens(access, refresh, false);
			setIsLoading(true);
			auth
				.updateAvatar({ picture: null })
				.then((result) => {
					setCurrentUser({
						email: result.email,
						username: result.username,
						picture: result.profile_picture,
						darkMode: result.settings.dark_mode,
					});

					setVisiblePopupEditAvatar(false);
					showToast('Аватарка удалена', Status.SUCCESS);
				})
				.catch((err) => {
					showDialog(err.message, true);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			logout();
			showDialog('Введите логин и пароль повторно.', true);
			setVisiblePopupEditCalendar(false);
		}
	};

	const handleDeleteUser = (password) => {
		const access = localStorage.getItem('jwtAccess');
		const refresh = localStorage.getItem('jwtRefresh');

		if (access && refresh) {
			checkTokens(access, refresh, false);
			setIsLoading(true);
			auth
				.deleteUser(password)
				.then((res) => {
					if (res.status === 204) {
						setVisiblePopupEditUser(false);
						logout('Вы удалили аккаунт!');
					} else {
						throw new Error(`Неверный пароль`);
					}
				})
				.catch((err) => {
					showDialog(err.message, true);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			logout();
			showDialog('Введите логин и пароль повторно.', true);
			setVisiblePopupEditUser(false);
		}
	};

	// Calendars
	const handleCreateCalendar = ({ name, description, color }) => {
		const access = localStorage.getItem('jwtAccess');
		const refresh = localStorage.getItem('jwtRefresh');

		if (access && refresh) {
			checkTokens(access, refresh, false);
			setIsLoading(true);
			calendarApi
				.createNewCalendar({ name, description, color })
				.then((newCalendar) => {
					setAllUserCalendars((prevState) => [newCalendar, ...prevState]);
					setChosenCalendars((prevState) => [newCalendar.id, ...prevState]);
					setVisiblePopupNewCalendar(false);
					showToast('Новый календарь создан!', Status.SUCCESS);
				})
				.catch((err) => {
					showDialog(err.message, true);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			logout();
			showDialog('Введите логин и пароль повторно.', true);
			setVisiblePopupNewCalendar(false);
		}
	};

	const handleEditCalendar = (calendar) => {
		const access = localStorage.getItem('jwtAccess');
		const refresh = localStorage.getItem('jwtRefresh');

		if (access && refresh) {
			checkTokens(access, refresh, false);
			setIsLoading(true);
			calendarApi
				.partChangeCalendar(calendar)
				.then((updatedCalendar) => {
					setAllUserCalendars((prevState) =>
						prevState.map((c) => (c.id === calendar.id ? updatedCalendar : c))
					);
					setVisiblePopupEditCalendar(false);
					showToast('Данные календаря успешно обновлены!', Status.SUCCESS);
				})
				.catch((err) => {
					showDialog(err.message, true);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			logout();
			showDialog('Введите логин и пароль повторно.', true);
			setVisiblePopupEditCalendar(false);
		}
	};

	const handleDeleteCalendar = (idCalendar) => {
		const access = localStorage.getItem('jwtAccess');
		const refresh = localStorage.getItem('jwtRefresh');

		if (access && refresh) {
			checkTokens(access, refresh, false);
			setIsLoading(true);
			calendarApi
				.deleteCalendar(idCalendar)
				.then((res) => {
					if (res.status === 204) {
						setVisiblePopupEditCalendar(false);
						showToast('Календарь удалён', Status.SUCCESS);
						setAllUserCalendars((prevState) =>
							prevState.filter((c) => c.id !== idCalendar)
						);
						setChosenCalendars((prevState) =>
							prevState.filter((id) => id !== idCalendar)
						);
					} else {
						throw new Error(`Что-то пошло не так`);
					}
				})
				.catch((err) => {
					showDialog(err.message, true);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			logout();
			showDialog('Введите логин и пароль повторно.', true);
			setVisiblePopupEditCalendar(false);
		}
	};

	// Events
	const handleCreateEvent = (data) => {
		const access = localStorage.getItem('jwtAccess');
		const refresh = localStorage.getItem('jwtRefresh');

		if (access && refresh) {
			checkTokens(access, refresh, false);
			setIsLoading(true);
			eventApi
				.createNewEvent(data)
				.then((event) => {
					event.title = event.name;
					event.start = parseISO(event.datetime_start);
					event.end = parseISO(event.datetime_finish);
					event.allDay = event.all_day;
					setAllUserEvents([event, ...allUserEvents]);
					setVisiblePopupNewEvent(false);
					showToast('Событие создано!', Status.SUCCESS);
				})
				.catch((err) => {
					showDialog(err.message, true);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			logout();
			showDialog('Введите логин и пароль повторно.', true);
			setVisiblePopupNewEvent(false);
		}
	};

	const handleEditEvent = (formData) => {
		const access = localStorage.getItem('jwtAccess');
		const refresh = localStorage.getItem('jwtRefresh');

		if (access && refresh) {
			checkTokens(access, refresh, false);
			setIsLoading(true);
			eventApi
				.partChangeEvent(formData)
				.then((updatedEvent) => {
					updatedEvent.title = updatedEvent.name;
					updatedEvent.start = parseISO(updatedEvent.datetime_start);
					updatedEvent.end = parseISO(updatedEvent.datetime_finish);
					updatedEvent.allDay = updatedEvent.all_day;
					setAllUserEvents((prevState) =>
						prevState.map((event) =>
							event.id === updatedEvent.id ? updatedEvent : event
						)
					);
					setVisiblePopupEditEvent(false);
					showToast('Событие изменено!', Status.SUCCESS);
				})
				.catch((err) => {
					showDialog(err.message, true);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			logout();
			showDialog('Введите логин и пароль повторно.', true);
			setVisiblePopupEditEvent(false);
		}
	};

	const handleDeleteEvent = (idEvent) => {
		const access = localStorage.getItem('jwtAccess');
		const refresh = localStorage.getItem('jwtRefresh');

		if (access && refresh) {
			checkTokens(access, refresh, false);
			setIsLoading(true);
			eventApi
				.deleteEvent(idEvent)
				.then((res) => {
					if (res.status === 204) {
						setAllUserEvents((prevState) =>
							prevState.filter((event) => event.id !== idEvent)
						);
						setVisiblePopupEditEvent(false);
						showToast('Событие удалено!', Status.SUCCESS);
					} else {
						throw new Error(`Что-то пошло не так`);
					}
				})
				.catch((err) => {
					showDialog(err.message, true);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			logout();
			showDialog('Введите логин и пароль повторно.', true);
			setVisiblePopupEditEvent(false);
		}
	};

	return (
		<LocalizationContext.Provider value={localizer}>
			<CurrentUserContext.Provider value={user}>
				<CalendarsContext.Provider value={calendars}>
					<div className={styles.app}>
						<Routes>
							<Route
								exact
								path="/"
								element={
									<>
										<Header
											onLogin={setVisiblePopupLogin}
											onAvatarClick={setVisiblePopupEditAvatar}
											onUserClick={setVisiblePopupEditUser}
											onPasswordClick={setVisiblePopupChangePassword}
											logout={logout}
										/>
										<Main
											onNewEventClick={setVisiblePopupNewEvent}
											onEventDoubleClick={setVisiblePopupEditEvent}
											onNewCalendarClick={setVisiblePopupNewCalendar}
											onEditCalendarClick={setVisiblePopupEditCalendar}
										/>
									</>
								}
							/>
							<Route path="*" element={<NotFound />} />
						</Routes>

						{isLoading && <Loader />}

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

						<PopupChangePassword
							visible={visiblePopupChangePassword}
							setVisible={setVisiblePopupChangePassword}
							onChangePassword={handleChangePassword}
						/>

						<PopupEditEvent
							visible={visiblePopupEditEvent}
							setVisible={setVisiblePopupEditEvent}
							onEditEvent={handleEditEvent}
							onDeleteEvent={handleDeleteEvent}
						/>

						<PopupEditAvatar
							visible={visiblePopupEditAvatar}
							setVisible={setVisiblePopupEditAvatar}
							onEditAvatar={handleEditAvatar}
							onDeleteAvatar={handleDeleteAvatar}
						/>

						<Toast ref={toast} />

						<PopupDialog
							showMessage={showMessage}
							setShowMessage={setShowMessage}
							isDialogError={isDialogError}
							dialogMessage={dialogMessage}
						/>
					</div>
				</CalendarsContext.Provider>
			</CurrentUserContext.Provider>
		</LocalizationContext.Provider>
	);
}

export default App;
