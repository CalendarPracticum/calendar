const BASE_URL = 'http://193.107.236.224/api/'; // 'http://localhost/api'

const getAccessToken = () => `Bearer ${localStorage.getItem('jwtAccess')}`;

const getJson = (response) => {
	if (response.ok) {
		return response.json();
	}
	throw new Error({ status: response.status });
};

/*
  Получение всех категорий
  Вернёт:
  [
    {
      "id": 0,
      "name": "string",
      "color": "12cc25a"
    }
  ]
*/
export const getAllCategories = () =>
	fetch(`${BASE_URL}/v1/categories`, {
		headers: {
			authorization: getAccessToken(),
		},
	}).then(getJson);

/*
  Получение всех ивентов
  Вернёт:
  [
    {
      "id": 0,
      "datetime_start": "2023-05-14T16:19:06.486Z",
      "datetime_finish": "2023-05-14T16:19:06.486Z",
      "all_day": true,
      "name": "string",
      "description": "string",
      "day_off": true,
      "holiday": true,
      "category": {
        "id": 0,
        "name": "string",
        "color": "8423f07"
      },
      "calendar": {
        "id": 0,
        "name": "string"
      }
    }
  ]
*/
export const getAllUserEvents = (start, finish) =>
	fetch(`${BASE_URL}/v1/events/?start_dt=${start}&finish_dt=${finish}`, {
		headers: {
			authorization: getAccessToken(),
		},
	}).then(getJson);

/*
  Создание нового ивента
  Вернёт:
  {
    "id": 0,
    "datetime_start": "2023-05-14T16:34:09.659Z",
    "datetime_finish": "2023-05-14T16:34:09.659Z",
    "all_day": true,
    "name": "string",
    "description": "string",
    "day_off": true,
    "holiday": true,
    "category": 0,
    "calendar": 0
  }
*/
export const createNewEvent = (
	start,
	finish,
	allDay,
	name,
	description,
	dayOff,
	holiday,
	category,
	calendar
) =>
	fetch(`${BASE_URL}/v1/events/`, {
		method: 'POST',
		headers: {
			authorization: getAccessToken(),
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			datetime_start: start,
			datetime_finish: finish,
			all_day: allDay,
			name,
			description,
			day_off: dayOff,
			holiday,
			category,
			calendar,
		}),
	}).then(getJson);
