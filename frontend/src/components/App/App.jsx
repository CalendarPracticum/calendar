/* eslint-disable no-console */
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
	ErrorMessage,
	SuccessMessage,
	WarningMessage,
} from '../../utils/constants';
import { PICTURE_URL, verify, refreshAccess } from '../../utils/api/commonApi';
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
	PopupAskToRegister,
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
	const [visiblePopupAskToRegister, setVisiblePopupAskToRegister] =
		useState(false);

	// Helpers
	const [showMessage, setShowMessage] = useState(false);
	const [dialogMessage, setDialogMessage] = useState('');
	const [isDialogError, setIsDialogError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isFormLogin, setIsFormLogin] = useState(true);

	const today = new Date();
	const start = useRef([today.getFullYear(), '-01-01'].join(''));
	const finish = useRef([today.getFullYear() + 1, '-01-01'].join(''));

	const toast = useRef(null);

	const showToast = (message, status, summary) => {
		toast.current.show({
			severity: status,
			summary,
			detail: message,
			life: 2500,
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

	const closeAllPopups = () => {
		setVisiblePopupNewEvent(false);
		setVisiblePopupNewCalendar(false);
		setVisiblePopupEditUser(false);
		setVisiblePopupEditEvent(false);
		setVisiblePopupEditAvatar(false);
		setVisiblePopupEditCalendar(false);
		setVisiblePopupChangePassword(false);
	};

	const logout = useCallback((message = null) => {
		localStorage.clear();
		setLoggedIn(false);
		setCurrentUser({});
		setAllUserCalendars([]);
		setAllUserEvents([]);
		setChosenCalendars(holidaysCalendar.map((c) => c.id));
		closeAllPopups();

		if (message) {
			showToast(message, Status.SUCCESS, 'Успех!');
		}
	}, []);

	const showDefaultErrorMessage = useCallback(() => {
		showDialog(ErrorMessage.DEFAULT, true);
	}, []);

	const handleErrors = useCallback(
		({ error, res }) => {
			console.log('---handleErrors---');
			if (error.code === 'token_not_valid') {
				console.log('code', error.code);
				logout();
				showDialog(ErrorMessage.UNAUTHORIZED, true);
			} else if (res.status === 401) {
				console.log('status', res.status);
				logout();
				showDialog(ErrorMessage.UNAUTHORIZED, true);
			} else {
				console.log('Упс', { error, res });
				showDefaultErrorMessage();
			}
		},
		[logout, showDefaultErrorMessage]
	);

	useEffect(() => {
		const access = localStorage.getItem('jwtAccess');
		if (access) {
			verify()
				.then(() => {
					setLoggedIn(true);
				})
				.catch(() => {
					refreshAccess()
						.then((data) => {
							localStorage.setItem('jwtAccess', data.access);
							setLoggedIn(true);
						})
						.catch((err) => {
							handleErrors(err);
						});
				});
		} else {
			showToast(WarningMessage.DEFAULT, Status.WARNING, 'Внимание');
		}
	}, [handleErrors]);

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
			.catch((err) => {
				console.log('ОШИБКА holidays: ', err);
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

					return calendars;
				})
				.then((calendars) => {
					const calendarsId = calendars.map((c) => c.id);
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
						});
				})
				.catch((err) => {
					handleErrors(err);
				});
		}
	}, [loggedIn, handleErrors]);

	useEffect(() => {
		if (loggedIn) {
			auth
				.getUserData()
				.then((result) => {
					const fullUrl = result.profile_picture
						? `${PICTURE_URL}${result.profile_picture}`
						: result.profile_picture;

					setCurrentUser({
						email: result.email,
						username: result.username,
						picture: fullUrl,
						darkMode: result.settings.dark_mode,
					});
				})
				.catch((err) => {
					handleErrors(err);
				});
		}
	}, [loggedIn, handleErrors]);

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
				showDialog(SuccessMessage.LOGIN, false);
			})
			.catch((err) => {
				console.log(err);
				showDialog(ErrorMessage.LOGIN, true);
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
							setIsFormLogin(true);
							setVisiblePopupLogin(false);
							showDialog(SuccessMessage.REGISTER, false);
						});
				})
			)
			.catch(({ error, res }) => {
				console.log({ error, res });
				if (res.status === 400 && error.password) {
					showDialog(ErrorMessage.REGISTER_PASSWORD, true);
				} else if (res.status === 400 && error.email) {
					showDialog(ErrorMessage.REGISTER_EMAIL, true);
				} else {
					showDefaultErrorMessage();
				}
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
				const picture = `${PICTURE_URL}${result.profile_picture}`;

				setCurrentUser({
					email: result.email,
					username: result.username,
					picture: result.profile_picture ? picture : null,
					darkMode: result.settings.dark_mode,
				});

				setVisiblePopupEditUser(false);
				showToast(SuccessMessage.UPDATE_USER, Status.SUCCESS, 'Успех!');
			})
			.catch(({ error, res }) => {
				console.log({ error, res });
				showDefaultErrorMessage();
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
					showToast(SuccessMessage.CHANGE_PASSWORD, Status.SUCCESS, 'Успех!');
				}
			})
			.catch(({ error, res }) => {
				console.log({ error, res });
				if (res.status === 400 && error.current_password) {
					showDialog(ErrorMessage.CHANGE_PASSWORD, true);
				} else {
					showDefaultErrorMessage();
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleEditAvatar = (data) => {
		setIsLoading(true);
		auth
			.updateAvatar(data)
			.then((result) => {
				const picture = `${PICTURE_URL}${result.profile_picture}`;

				setCurrentUser({
					email: result.email,
					username: result.username,
					picture,
					darkMode: result.settings.dark_mode,
				});

				setVisiblePopupEditAvatar(false);
				showToast(SuccessMessage.EDIT_AVATAR, Status.SUCCESS, 'Успех!');
			})
			.catch(({ error, res }) => {
				console.log({ error, res });
				showDefaultErrorMessage();
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleDeleteAvatar = () => {
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
				showToast(SuccessMessage.DELETE_AVATAR, Status.SUCCESS, 'Успех!');
			})
			.catch(({ error, res }) => {
				console.log({ error, res });
				showDefaultErrorMessage();
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleDeleteUser = (password) => {
		setIsLoading(true);
		auth
			.deleteUser(password)
			.then((res) => {
				if (res.status === 204) {
					setVisiblePopupEditUser(false);
					logout(SuccessMessage.DELETE_USER);
				}
			})
			.catch(({ error, res }) => {
				console.log({ error, res });
				if (res.status === 400 && error.current_password) {
					showDialog(ErrorMessage.DELETE_USER, true);
				} else {
					showDefaultErrorMessage();
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	// Calendars
	const handleCreateCalendar = ({ name, description, color }) => {
		setIsLoading(true);
		calendarApi
			.createNewCalendar({ name, description, color })
			.then((newCalendar) => {
				setAllUserCalendars((prevState) => [newCalendar, ...prevState]);
				setChosenCalendars((prevState) => [newCalendar.id, ...prevState]);
				setVisiblePopupNewCalendar(false);
				showToast(SuccessMessage.CREATE_CALENDAR, Status.SUCCESS, 'Успех!');
			})
			.catch(({ error, res }) => {
				console.log({ error, res });
				showDefaultErrorMessage();
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handlePartialChangeEvents = (idCalendar) => {
		eventApi
			.getAllUserEvents({
				start: start.current,
				finish: finish.current,
				calendar: idCalendar,
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

				setAllUserEvents((prevState) => [
					...prevState.filter((e) => e.calendar.id !== idCalendar),
					...preparedData,
				]);
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
				handlePartialChangeEvents(calendar.id);
				setVisiblePopupEditCalendar(false);
				showToast(SuccessMessage.EDIT_CALENDAR, Status.SUCCESS, 'Успех!');
			})
			.catch(({ error, res }) => {
				console.log({ error, res });
				showDefaultErrorMessage();
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
					showToast(SuccessMessage.DELETE_CALENDAR, Status.SUCCESS, 'Успех!');
					setAllUserCalendars((prevState) =>
						prevState.filter((c) => c.id !== idCalendar)
					);
					setChosenCalendars((prevState) =>
						prevState.filter((id) => id !== idCalendar)
					);
					setAllUserEvents((prevState) =>
						prevState.filter((e) => e.calendar.id !== idCalendar)
					);
				}
			})
			.catch(({ error, res }) => {
				console.log({ error, res });
				showDefaultErrorMessage();
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	// Events
	const handleCreateEvent = (data) => {
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
				showToast(SuccessMessage.CREATE_EVENT, Status.SUCCESS, 'Успех!');
			})
			.catch(({ error, res }) => {
				console.log({ error, res });
				showDefaultErrorMessage();
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
				updatedEvent.start = parseISO(updatedEvent.datetime_start);
				updatedEvent.end = parseISO(updatedEvent.datetime_finish);
				updatedEvent.allDay = updatedEvent.all_day;
				setAllUserEvents((prevState) =>
					prevState.map((event) =>
						event.id === updatedEvent.id ? updatedEvent : event
					)
				);
				setVisiblePopupEditEvent(false);
				showToast(SuccessMessage.EDIT_EVENT, Status.SUCCESS, 'Успех!');
			})
			.catch(({ error, res }) => {
				console.log({ error, res });
				showDefaultErrorMessage();
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
					showToast(SuccessMessage.DELETE_EVENT, Status.SUCCESS, 'Успех!');
				}
			})
			.catch(({ error, res }) => {
				console.log({ error, res });
				showDefaultErrorMessage();
			})
			.finally(() => {
				setIsLoading(false);
			});
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
											onNewEventClickUnauth={setVisiblePopupAskToRegister}
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
							isFormLogin={isFormLogin}
							setIsFormLogin={setIsFormLogin}
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

						<PopupAskToRegister
							visible={visiblePopupAskToRegister}
							setVisible={setVisiblePopupAskToRegister}
							showRegisterPopup={setVisiblePopupLogin}
							setIsFormLogin={setIsFormLogin}
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
