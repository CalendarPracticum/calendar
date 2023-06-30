/* eslint-disable no-console */
import {
	BASE_URL,
	HEADERS,
	getAccessToken,
	checkReponse,
	fetchWithRefresh,
} from './commonApi';

/*
  Регистрация
  в случае успеха возвращает {id, email}
*/
export const register = (email, password) =>
	fetch(`${BASE_URL}/v1/users/`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({ email, password }),
	}).then(checkReponse);

/*
  Авторизация
  в случае успеха возвращает {access, refresh}
*/
export const authorize = (email, password) =>
	fetch(`${BASE_URL}/auth/create/`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({ email, password }),
	}).then(checkReponse);

/*
  Получение пользовательских данных
  Вернёт:
  {
    "id": 0,
    "email": "user@example.com",
    "username": "string",
    "profile_picture": "string",
    "settings": {
      "dark_mode": true,
      "background": "string"
    }
  }
*/
// export const getUserData = () =>
// 	fetch(`${BASE_URL}/v1/users/me/`, {
// 		headers: {
// 			...HEADERS,
// 			authorization: getAccessToken(),
// 		},
// 	}).then(checkReponse);

export const getUserData = () =>
	fetchWithRefresh(`${BASE_URL}/v1/users/me/`, {
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
	});

/*
  Изменение пользовательских данных
  Вернёт:
  {
    "id": 0,
    "email": "user@example.com",
    "username": "string",
    "profile_picture": "string",
    "settings": {
      "dark_mode": true,
      "background": "string"
    }
  }
*/
// export const updateUserData = ({ email, username, darkMode }) =>
// 	fetch(`${BASE_URL}/v1/users/me/`, {
// 		method: 'PATCH',
// 		headers: {
// 			...HEADERS,
// 			authorization: getAccessToken(),
// 		},
// 		body: JSON.stringify({
// 			email,
// 			username,
// 			settings: {
// 				dark_mode: darkMode,
// 			},
// 		}),
// 	}).then(checkReponse);

export const updateUserData = ({ email, username, darkMode }) =>
	fetchWithRefresh(`${BASE_URL}/v1/users/me/`, {
		method: 'PATCH',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({
			email,
			username,
			settings: {
				dark_mode: darkMode,
			},
		}),
	});

export const updateAvatar = ({ picture }) =>
	fetch(`${BASE_URL}/v1/users/me/`, {
		method: 'PATCH',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({
			profile_picture: picture,
		}),
	}).then(checkReponse);

/*
  Изменение пароля
  Вернёт:
  {
    "new_password": "string",
    "current_password": "string"
  }
*/
export const changePassword = ({ newPassword, currentPassword }) =>
	fetch(`${BASE_URL}/v1/users/set_password/`, {
		method: 'POST',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({
			new_password: newPassword,
			current_password: currentPassword,
		}),
	});

/*
Удаление пользовательского аккаунта
*/
export const deleteUser = (password) =>
	fetch(`${BASE_URL}/v1/users/me/`, {
		method: 'DELETE',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({
			current_password: password,
		}),
	});
