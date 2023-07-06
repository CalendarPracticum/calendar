const BASE_URL = 'http://193.107.236.224/api';

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
	fetch(`${BASE_URL}/v1/calendars/${id}/`, {
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

/*
  ЗАПРОСЫ НА ШЕРИНГ КАЛЕНДАРЯ
*/

/*
  Поделиться календарём с польщователем
  Вернётся:
  {
    "owner": "user@example.com",
    "user": "user@example.com",
    "calendar": "string",
    "custom_name": "string",
    "custom_color": "#fDd449"
  }
*/
export const shareCalendar = ({ id, user, name, color }) =>
	fetch(`${BASE_URL}/v1/calendars/${id}/share`, {
		method: 'POST',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({
      user,
      custom_name: name,
      custom_color: color,
    }),
	}).then(getJson);

/*
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
	fetch(`${BASE_URL}/v1/calendars/shared_to_user`, {
		headers: {
			authorization: getAccessToken(),
		},
	}).then(getJson);

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
	fetch(`${BASE_URL}/v1/calendars/shared_to_me`, {
		headers: {
			authorization: getAccessToken(),
		},
	}).then(getJson);

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
	fetch(`${BASE_URL}/v1/calendars/${id}/share`, {
		method: 'PATCH',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({
      custom_name: name,
      custom_color: color,
    }),
	}).then(getJson);

/*
  TODO: Спросить у бэков, работает это с двух сторон одиноково или нет

  Удалить доступ к календарю
  Вернётся 204))))
*/

export const deleteSharedCalendar = ({ id, user }) =>
	fetch(`${BASE_URL}/v1/calendars/${id}/share/`, {
		method: 'DELETE',
		headers: {
			authorization: getAccessToken(),
		},
    body: JSON.stringify({
      user,
    })
	});
