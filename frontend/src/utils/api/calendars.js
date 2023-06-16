const BASE_URL = 'http://193.107.236.224/api'; // http://localhost/api

const getAccessToken = () => `Bearer ${localStorage.getItem('jwtAccess')}`;

const getJson = (response) => {
	if (response.ok) {
		return response.json();
	}
	throw new Error({ status: response.status });
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
export const createNewCalendar = (name, description, color) =>
	fetch(`${BASE_URL}/v1/calendars/`, {
		method: 'POST',
		headers: {
			Authorization: getAccessToken(),
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name, description, color }),
	}).then(getJson);
