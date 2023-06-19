const BASE_URL = 'http://193.107.236.224/api';

const HEADERS = {
	'Content-Type': 'application/json',
};

const getAccessToken = () => `Bearer ${localStorage.getItem('jwtAccess')}`;

const getJson = (response) => {
	if (response.ok) {
		return response.json();
	}
	return response.json().then((errorText) => {
		throw new Error(
			Array.isArray(errorText[Object.keys(errorText)[0]])
				? errorText[Object.keys(errorText)[0]][0]
				: 'Произошла ошибка на сервере'
		);
	});
};

/*
  Регистрация
  в случае успеха возвращает {id, email}
*/
export const register = (email, password) =>
	fetch(`${BASE_URL}/v1/users/`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({ email, password }),
	}).then(getJson);

/*
  Авторизация
  в случае успеха возвращает {access, refresh}
*/
export const authorize = (email, password) =>
	fetch(`${BASE_URL}/auth/create/`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({ email, password }),
	}).then(getJson);

/*
  Получение access токена в случае, если в localStorage ещё остался refresh токен
  в случае успеха возвращает {access}
*/
export const refreshAccess = (refreshToken) =>
	fetch(`${BASE_URL}/auth/refresh/`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({ refresh: refreshToken }),
	}).then(getJson);

/*
  Проверка access токена на действительность
  в случае успешной проверки возвращается {}
*/
export const verify = (accessToken) =>
	fetch(`${BASE_URL}/auth/verify/`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({ token: accessToken }),
	}).then(getJson);

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
export const getUserData = () =>
	fetch(`${BASE_URL}/v1/users/me/`, {
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
	}).then(getJson);

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
export const updateUserData = ({ email, username, darkMode }) =>
	fetch(`${BASE_URL}/v1/users/me/`, {
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
	}).then(getJson);

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
	}).then(getJson);

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
