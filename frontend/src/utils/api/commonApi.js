/* eslint-disable no-console */
export const BASE_URL = 'http://193.107.236.224/api';
export const PICTURE_URL = 'http://mycalendaily.acceleratorpracticum.ru';

export const HEADERS = {
	'Content-Type': 'application/json;charset=utf-8',
};

const LIFE_TIME_TO_UPDATE_MULTIPLIER = 0.5;
const getUnixTime = () => Math.round(+new Date() / 1000);

const isTokenExpired = (token) => {
	if (!token) {
		return true;
	}

	try {
		const tokenInfo = token.split('.')[1];
		const tokenInfoDecoded = window.atob(tokenInfo);
		const { exp, iat } = JSON.parse(tokenInfoDecoded);

		const tokenLeftTime = exp - getUnixTime();
		const minLifeTimeForUpdate = (exp - iat) * LIFE_TIME_TO_UPDATE_MULTIPLIER;
		console.log('осталось жить токену', { tokenLeftTime });
		console.log('планируемое обновление', { minLifeTimeForUpdate });

		return tokenLeftTime < minLifeTimeForUpdate;
	} catch (e) {
		console.error(e);
		return true;
	}
};

export const getAccessToken = () =>
	`Bearer ${localStorage.getItem('jwtAccess')}`;

export const checkReponse = (res) =>
	res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

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
		const res = await fetch(url, options);
		return await checkReponse(res);
	} catch (err) {
		if (isTokenExpired(localStorage.getItem('jwtAccess'))) {
			const refreshData = await refreshAccess(); // обновляем access токен
			console.log('новый токен', { refreshData });

			if (!refreshData.success) {
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
			console.log({ err });
			return Promise.reject(err);
		}
	}
};
