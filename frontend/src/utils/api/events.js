import {
	BASE_URL,
	HEADERS,
	getAccessToken,
	checkReponse,
	fetchWithRefresh,
} from './commonApi';

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
export const getAllUserEvents = ({ start, finish, calendar }) =>
	fetchWithRefresh(
		`${BASE_URL}/v1/events/?finish_dt=${finish}&start_dt=${start}&calendar=${calendar}`,
		{
			headers: {
				authorization: getAccessToken(),
			},
		}
	);

export const getHolidays = ({ start, finish, calendar }) =>
	fetch(
		`${BASE_URL}/v1/events/?finish_dt=${finish}&start_dt=${start}&calendar=${calendar}`
	).then(checkReponse);

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
	fetchWithRefresh(`${BASE_URL}/v1/events/`, {
		method: 'POST',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({
			datetime_start: formData.timeStart,
			datetime_finish: formData.timeFinish,
			all_day: formData.allDay,
			name: formData.title,
			description: formData.description,
			calendar: formData.calendar.id,
		}),
	});

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
	fetchWithRefresh(`${BASE_URL}/v1/events/${id}`, {
		headers: {
			authorization: getAccessToken(),
		},
	});

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
	fetchWithRefresh(`${BASE_URL}/v1/events/${formData.id}`, {
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
			day_off: formData.dayOff,
			holiday: formData.holiday,
			calendar: formData.calendar.id,
		}),
	});

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
export const partChangeEvent = (data) =>
	fetchWithRefresh(`${BASE_URL}/v1/events/${data.id}/`, {
		method: 'PATCH',
		headers: {
			...HEADERS,
			authorization: getAccessToken(),
		},
		body: JSON.stringify({
			datetime_start: data.timeStart,
			datetime_finish: data.timeFinish,
			all_day: data.allDay,
			name: data.title,
			description: data.description,
			calendar: data.calendar.id,
		}),
	});

/*
  Удаление события
*/
export const deleteEvent = (id) =>
	fetchWithRefresh(`${BASE_URL}/v1/events/${id}`, {
		method: 'DELETE',
		headers: {
			authorization: getAccessToken(),
		},
	});
