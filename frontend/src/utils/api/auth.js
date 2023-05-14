const BASE_URL = 'http://localhost/api'; // 'http://193.107.236.224/api/'

const HEADERS = {
	'Content-Type': 'application/json',
};

const getJson = (response) => {
	if (response.ok) {
		return response.json();
	}
	throw new Error({ status: response.status });
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
  в случае успеха возвращает {access, refresh}
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
		body: JSON.stringify({ access: accessToken }),
	}).then(getJson);
