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
import { Loader } from '../Loader/Loader';
import styles from './App.module.css';
import { CurrentUserContext, LocalizationContext } from '../../context';
import ruPrime from '../../utils/ruPrime.json';
import * as auth from '../../utils/api/auth';
import * as calendarApi from '../../utils/api/calendars';
import * as eventApi from '../../utils/api/events';
import { NotFound } from '../NotFound/NotFound';
import { Color, Status } from '../../utils/common';
import {
	PopupLogin,
	PopupNewEvent,
	PopupNewCalendar,
	PopupEditUser,
	PopupEditCalendar,
	PopupChangePassword,
	PopupEditEvent,
	PopupDialog,
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
	const [currentUser, setCurrentUser] = useState({});
	const [loggedIn, setLoggedIn] = useState(false);
	const [visiblePopupLogin, setVisiblePopupLogin] = useState(false);
	const [visiblePopupNewEvent, setVisiblePopupNewEvent] = useState(false);
	const [visiblePopupNewCalendar, setVisiblePopupNewCalendar] = useState(false);
	const [visiblePopupEditUser, setVisiblePopupEditUser] = useState(false);
	const [visiblePopupEditEvent, setVisiblePopupEditEvent] = useState(false);
	const [visiblePopupEditCalendar, setVisiblePopupEditCalendar] =
		useState(false);
	const [visiblePopupChangePassword, setVisiblePopupChangePassword] =
		useState(false);
	const [allUserCalendars, setAllUserCalendars] = useState([]);
	const [allUserEvents, setAllUserEvents] = useState([]);
	const [showMessage, setShowMessage] = useState(false);
	const [dialogMessage, setDialogMessage] = useState('');
	const [isDialogError, setIsDialogError] = useState(false);
	const [chosenCalendars, setChosenCalendars] = useState([]);
	const [editableCalendar, setEditableCalendar] = useState({});
	const [editableEvent, setEditableEvent] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	// по идее мы должны считать дату старта не от текущей даты, а от отображаемой и прибавлять не год, а месяцы
	const today = new Date();
	const start = [today.getFullYear(), '-01-01'].join('');
	const finish = [today.getFullYear() + 1, '-01-01'].join('');

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

	const handleGetAllCalendars = () => {
		setIsLoading(true);
		calendarApi
			.getAllUserCalendars()
			.then((data) => {
				setAllUserCalendars(data);
				setChosenCalendars(data.map((c) => c.id));
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log('ОШИБКА: ', err.message);
			})
			.finally(() => {
				setIsLoading(false);
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
	}, [loggedIn]);

	useEffect(() => {
		const calendarsId = allUserCalendars.map((c) => c.id);

		eventApi
			.getAllUserEvents({
				start,
				finish,
				calendar: allUserCalendars.length !== 0 ? calendarsId : '',
			})
			.then((result) => {
				setAllUserEvents(
					result.map((event) => {
						/* eslint-disable no-param-reassign */
						event.title = event.name;
						event.start = new Date(event.datetime_start);
						event.end = new Date(event.datetime_finish);
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
	}, [allUserCalendars, start, finish]);

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
			chosenCalendars,
			setChosenCalendars,
			editableCalendar,
			setEditableCalendar,
			editableEvent,
			setEditableEvent,
		}),
		[
			currentUser,
			loggedIn,
			allUserCalendars,
			allUserEvents,
			chosenCalendars,
			editableCalendar,
			editableEvent,
		]
	);

	// TODO: custom hook useOverlayClick?

	const handleCreateCalendar = ({ name, description, color }) => {
		setIsLoading(true);
		calendarApi
			.createNewCalendar({ name, description, color })
			.then((newCalendar) => {
				setAllUserCalendars((prevState) => [newCalendar, ...prevState]);
				setVisiblePopupNewCalendar(false);
				showToast('Новый календарь создан!', Status.SUCCESS);
			})
			.catch((err) => {
				showDialog(err.message, true);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleCreateEvent = (data) => {
		setIsLoading(true);
		eventApi
			.createNewEvent(data)
			.then((event) => {
				event.title = event.name;
				event.start = event.datetime_start;
				event.end = event.datetime_finish;
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
	};

	const handleEditEvent = (formData) => {
		setIsLoading(true);
		eventApi
			.partChangeEvent(formData)
			.then((updatedEvent) => {
				updatedEvent.title = updatedEvent.name;
				updatedEvent.start = updatedEvent.datetime_start;
				updatedEvent.end = updatedEvent.datetime_finish;
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
	};

	const handleDeleteEvent = (idEvent) => {
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
	};

	const handleLogin = ({ email, password }) => {
		setIsLoading(true);
		auth
			.authorize(email, password)
			.then((data) => {
				localStorage.setItem('jwtAccess', data.access);
				localStorage.setItem('jwtRefresh', data.refresh);
				setLoggedIn(true);
				handleGetAllCalendars();
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
				auth.authorize(email, password).then((data) => {
					localStorage.setItem('jwtAccess', data.access);
					localStorage.setItem('jwtRefresh', data.refresh);
					calendarApi
						.createNewCalendar({
							name: 'Личное',
							description: '',
							color: Color.LIGHT_GREEN,
						})
						.then((newCalendar) => {
							setAllUserCalendars((prevState) => [newCalendar, ...prevState]);
							setLoggedIn(true);
							handleGetAllCalendars();
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
		setIsLoading(true);
		auth
			.updateUserData(userData)
			.then((result) => {
				setCurrentUser({
					email: result.email,
					username: result.username,
					picture: result.profile_picture,
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
	};

	const handleChangePassword = (data) => {
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
	};

	const logout = () => {
		localStorage.clear();
		setLoggedIn(false);
		setCurrentUser({});
		setAllUserCalendars([]);
		setAllUserEvents([]);
		showToast('Вы вышли из аккаунта!', Status.SUCCESS);
	};

	const handleDeleteUser = (password) => {
		setIsLoading(true);
		auth
			.deleteUser(password)
			.then((res) => {
				if (res.status === 204) {
					setVisiblePopupEditUser(false);
					logout();
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
	};

	const handleEditCalendar = (calendar) => {
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
	};

	const handleDeleteCalendar = (idCalendar) => {
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

					<Loader isLoading={isLoading} />

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

					<Toast ref={toast} />

					<PopupDialog
						showMessage={showMessage}
						setShowMessage={setShowMessage}
						isDialogError={isDialogError}
						dialogMessage={dialogMessage}
					/>
				</div>
			</CurrentUserContext.Provider>
		</LocalizationContext.Provider>
	);
}

export default App;
