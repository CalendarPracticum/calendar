/* eslint-disable no-console */
import {
	BASE_URL,
	HEADERS,
	getAccessToken,
	fetchWithRefresh,
} from './commonApi';

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
	fetchWithRefresh(`${BASE_URL}/v1/calendars/`, {
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
	});

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
	fetchWithRefresh(`${BASE_URL}/v1/calendars/${id}`, {
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
	});

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
	fetchWithRefresh(`${BASE_URL}/v1/calendars/`, {
		method: 'POST',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({ name, description, color }),
	});

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
	fetchWithRefresh(`${BASE_URL}/v1/calendars/${id}`, {
		method: 'PUT',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({ name, description, color }),
	});

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
	fetchWithRefresh(`${BASE_URL}/v1/calendars/${id}/`, {
		method: 'PATCH',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({ name, description, color }),
	});

/*
  Удаление календаря
*/
export const deleteCalendar = (id) =>
	fetchWithRefresh(`${BASE_URL}/v1/calendars/${id}`, {
		method: 'DELETE',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
	});
