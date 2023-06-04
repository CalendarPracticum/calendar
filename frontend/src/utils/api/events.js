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
		throw new Error(errorText[Object.keys(errorText)[0]][0]);
	});
};

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
      "calendar": {
        "id": 0,
        "name": "string"
      }
    }
  ]
*/
export const getAllUserEvents = ({ start, finish, calendar }) => {
	if (getAccessToken() === 'Bearer null') {
		return fetch(
			`${BASE_URL}/v1/events/?finish_dt=${finish}&start_dt=${start}&calendar=1`
		).then(getJson);
	}

	return fetch(
		`${BASE_URL}/v1/events/?finish_dt=${finish}&start_dt=${start}&calendar=${calendar}`,
		{
			headers: {
				authorization: getAccessToken(),
			},
		}
	).then(getJson);
};

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
    "calendar": 0
  }
*/
export const createNewEvent = (formData) =>
	fetch(`${BASE_URL}/v1/events/`, {
		method: 'POST',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({
			datetime_start: formData.timeStart,
			datetime_finish: formData.timeFinish,
			all_day: formData.allDay,
			name: formData.name,
			description: formData.description,
			calendar: formData.calendar.id,
		}),
	}).then(getJson);

/*
  Получение информации о конкретном событии
  Вернётся:
  {
    "id": 0,
    "datetime_start": "2023-06-04T20:00:19.424Z",
    "datetime_finish": "2023-06-04T20:00:19.424Z",
    "all_day": true,
    "name": "string",
    "description": "string",
    "day_off": true,
    "holiday": true,
    "calendar": {
      "id": 0,
      "name": "string",
      "color": "#fCD7d5"
    }
  }
*/
export const getEventById = (id) =>
	fetch(`${BASE_URL}/v1/events/${id}`, {
		headers: {
			authorization: getAccessToken(),
		},
	}).then(getJson);

/*
  Полное обновление события
  Вернётся:
  {
    "id": 0,
    "datetime_start": "2023-06-04T20:10:05.014Z",
    "datetime_finish": "2023-06-04T20:10:05.014Z",
    "all_day": true,
    "name": "string",
    "description": "string",
    "day_off": true,
    "holiday": true,
    "calendar": {
      "id": 0,
      "name": "string",
      "color": "#aF8"
    }
  }
*/
export const fullChangeEvent = (formData) =>
	fetch(`${BASE_URL}/v1/events/${formData.id}`, {
		method: 'PUT',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({
			datetime_start: formData.timeStart,
			datetime_finish: formData.timeFinish,
			all_day: formData.allDay,
			name: formData.name,
			description: formData.description,
			day_off: formData.dayOff, // в частности из за этого и ещё нескольких полей смысла в put нет
			holiday: formData.holiday, // и из-за этого
			calendar: formData.calendar.id,
		}),
	}).then(getJson);

/*
  Частичное обновление события
  Вернётся:
  {
    "id": 0,
    "datetime_start": "2023-06-04T20:10:05.014Z",
    "datetime_finish": "2023-06-04T20:10:05.014Z",
    "all_day": true,
    "name": "string",
    "description": "string",
    "day_off": true,
    "holiday": true,
    "calendar": {
      "id": 0,
      "name": "string",
      "color": "#aF8"
    }
  }
*/
export const partChangeEvent = (formData) =>
	fetch(`${BASE_URL}/v1/events/${formData.id}`, {
		method: 'PATCH',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({
			datetime_start: formData.timeStart,
			datetime_finish: formData.timeFinish,
			all_day: formData.allDay,
			name: formData.name,
			description: formData.description,
			calendar: formData.calendar.id,
		}),
	}).then(getJson);

/*
  Удаление события
*/
export const deleteEvent = (id) =>
	fetch(`${BASE_URL}/v1/events/${id}`, {
		method: 'DELETE',
		headers: {
			authorization: getAccessToken(),
		},
	});
