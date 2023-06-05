const BASE_URL = 'http://193.107.236.224/api'; // http://localhost/api

const getAccessToken = () => `Bearer ${localStorage.getItem('jwtAccess')}`;

const HEADERS = {
	'Content-Type': 'application/json',
};

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
  Получение всех календарей пользователя
  Вернётся:
  [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "owner": "user@example.com"
    }
  ]
*/
export const getAllUserCalendars = () =>
	fetch(`${BASE_URL}/v1/calendars/`, {
		headers: {
			authorization: getAccessToken(),
		},
	}).then(getJson);

/*
  Получение конкретного календаря пользователя по его id
  Вернётся:
  {
    "id": 0,
    "name": "string",
    "description": "string",
    "owner": "user@example.com"
  }
*/
export const getUserCalendarById = (id) =>
	fetch(`${BASE_URL}/v1/calendars/${id}`, {
		headers: {
			authorization: getAccessToken(),
		},
	}).then(getJson);

/*
  Создание нового календаря пользователя
  Вернётся:
  {
    "id": 0,
    "name": "string",
    "description": "string",
    "owner": "user@example.com"
  }
*/
export const createNewCalendar = ({ name, description, color }) =>
	fetch(`${BASE_URL}/v1/calendars/`, {
		method: 'POST',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({ name, description, color }),
	}).then(getJson);

/*
  Полное обновление календаря
  Вернётся:
  {
    "id": 0,
    "name": "string",
    "description": "string",
    "owner": "user@example.com",
    "color": "#2d6"
  }
*/
export const fullChangeCalendar = ({ name, description, color, id }) =>
	fetch(`${BASE_URL}/v1/calendars/${id}`, {
		method: 'PUT',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({ name, description, color }),
	}).then(getJson);

/*
  Частичное обновление календаря
  Вернётся:
  {
    "id": 0,
    "name": "string",
    "description": "string",
    "owner": "user@example.com",
    "color": "#DD4"
  }
*/
export const partChangeCalendar = ({ name, description, color, id }) =>
	fetch(`${BASE_URL}/v1/calendars/${id}`, {
		method: 'PATCH',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({ name, description, color }),
	}).then(getJson);

/*
  Удаление календаря
*/
export const deleteCalendar = (id) =>
	fetch(`${BASE_URL}/v1/calendars/${id}`, {
		method: 'DELETE',
		headers: {
			authorization: getAccessToken(),
		},
	});
