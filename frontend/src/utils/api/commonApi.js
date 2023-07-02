/* eslint-disable no-console */
export const BASE_URL = 'http://193.107.236.224/api';
export const PICTURE_URL = 'http://mycalendaily.acceleratorpracticum.ru';

export const HEADERS = {
	'Content-Type': 'application/json',
};

const LIFE_TIME_TO_UPDATE = 60;
const getUnixTime = () => Math.round(+new Date() / 1000);

const isTokenSoonExpired = (token) => {
	const tokenInfo = token.split('.')[1];
	const tokenInfoDecoded = window.atob(tokenInfo);
	// eslint-disable-next-line camelcase
	const { exp, token_type } = JSON.parse(tokenInfoDecoded);
	const tokenLeftTime = exp - getUnixTime();
	console.log(token_type, { tokenLeftTime });

	return tokenLeftTime < LIFE_TIME_TO_UPDATE;
};

export const getAccessToken = () =>
	`Bearer ${localStorage.getItem('jwtAccess')}`;

export const checkReponse = (res) => {
	if (res.status === 204) {
		return res;
	}
	if (res.ok) {
		return res.json();
	}
	// eslint-disable-next-line prefer-promise-reject-errors
	return res.json().then((error) => Promise.reject({ error, res }));
};

/*
  Проверка access токена на действительность
  в случае успешной проверки возвращается {}
*/
export const verify = () =>
	fetch(`${BASE_URL}/auth/verify/`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({ token: localStorage.getItem('jwtAccess') }),
	}).then(checkReponse);

/*
  Получение access токена в случае, если в localStorage ещё остался refresh токен
  в случае успеха возвращает {access}
*/
export const refreshAccess = () =>
	fetch(`${BASE_URL}/auth/refresh/`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({ refresh: localStorage.getItem('jwtRefresh') }),
	}).then(checkReponse);

export const fetchWithRefresh = async (url, options) => {
	try {
		/*
		const access = localStorage.getItem('jwtAccess');
		const refresh = localStorage.getItem('jwtRefresh');
		if (
			access &&
			isTokenSoonExpired(access) &&
			refresh &&
			!isTokenSoonExpired(refresh)
		) {
			const refreshData = await refreshAccess(); // обновляем access токен
			if (!refreshData.access) {
				return Promise.reject(refreshData);
			}
			localStorage.setItem('jwtAccess', refreshData.access);
			// eslint-disable-next-line no-param-reassign
			options.headers.authorization = getAccessToken();
		}
    */

		const access = localStorage.getItem('jwtAccess');
		const refresh = localStorage.getItem('jwtRefresh');
		isTokenSoonExpired(access);
		isTokenSoonExpired(refresh);

		const res = await fetch(url, options);
		return await checkReponse(res);
	} catch (errWithRes) {
		if (errWithRes.error.code === 'token_not_valid') {
			const refreshData = await refreshAccess(); // обновляем access токен

			if (!refreshData.access) {
				return Promise.reject(refreshData);
			}

			localStorage.setItem('jwtAccess', refreshData.access);
			// eslint-disable-next-line no-param-reassign
			options.headers.authorization = getAccessToken();
			const res = await fetch(url, options); // повторяем запрос
			// eslint-disable-next-line no-return-await
			return await checkReponse(res);
			// eslint-disable-next-line no-else-return
		} else {
			return Promise.reject(errWithRes);
		}
	}
};
