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

/*
  ЗАПРОСЫ НА ШЕРИНГ КАЛЕНДАРЯ
*/

/*
  Поделиться календарём с пользователем
  Вернётся:
  {
    "owner": "user@example.com",
    "user": "user@example.com",
    "calendar": "string",
    "custom_name": "string",
    "custom_color": "#fDd449"
  }
*/
export const shareCalendar = ({ id, email, name, color }) =>
	fetchWithRefresh(`${BASE_URL}/v1/calendars/${id}/share/`, {
		method: 'POST',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({
			user: email,
			custom_name: name,
			custom_color: color,
		}),
	});

/*
  NOTE: НЕ ИСПОЛЬЗУЕМ
  Получение календарей, которыми ТЫ поделился с пользователями
  Вернётся массив объектов:
  {
    "owner": "user@example.com",
    "users": [
      "user1@user.com",
      "user2@user.com",
    ],
    "calendar": {
      "id": 1,
      "name": "string",
      "color": "#000",
    }
  }
*/
export const getAllSharedToOthers = () =>
	fetchWithRefresh(`${BASE_URL}/v1/calendars/shared_to_user/`, {
		headers: {
			authorization: getAccessToken(),
		},
	});

/*
  Получение данных конкретного календаря, которым ты поделился
  Вернётся объект:
  {
    "owner": "user@example.com",
    "users": [
      "user1@user.com",
      "user2@user.com",
    ],
    "calendar": {
      "id": 1,
      "name": "string",
      "color": "#000",
    }
  }
*/
export const getSharedCalendarById = (id) =>
	fetchWithRefresh(`${BASE_URL}/v1/calendars/${id}/share/`, {
		headers: {
			authorization: getAccessToken(),
		},
	});

/*
  Получение календарей, которыми поделились с тобой
  Вернётся массив объектов:
  {
    "id": 0,
    "owner": "user@example.com",
    "calendar": {
      "id": 1,
      "name": "string",
      "color": "#000",
    },
    "custom_name": "string",
    "custom_color": "#2Bd"
  }
*/
export const getAllSharedToMe = () =>
	fetchWithRefresh(`${BASE_URL}/v1/calendars/shared_to_me/`, {
		headers: {
			authorization: getAccessToken(),
		},
	});

/*
  Изменить свою копию календаря
  Вернётся:
  {
    "owner": "user@example.com",
    "user": "user@example.com",
    "calendar": "string",
    "custom_name": "string",
    "custom_color": "#2C6"
  }
*/
export const changeSharedCalendar = ({ id, name, color }) =>
	fetchWithRefresh(`${BASE_URL}/v1/calendars/${id}/share/`, {
		method: 'PATCH',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({
			custom_name: name,
			custom_color: color,
		}),
	});

/*
  TODO: Спросить у бэков, работает это с двух сторон одиноково или нет

  Удалить доступ к календарю
  Вернётся 204))))
*/

export const deleteSharedCalendar = ({ id, user }) =>
	fetchWithRefresh(`${BASE_URL}/v1/calendars/${id}/share/`, {
		method: 'DELETE',
		headers: {
			authorization: getAccessToken(),
		},
		body: JSON.stringify({
			user,
		}),
	});
