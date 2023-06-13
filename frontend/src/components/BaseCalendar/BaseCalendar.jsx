import { React, useCallback, useContext } from 'react';
import { Calendar } from 'react-big-calendar';
import styles from './BaseCalendar.module.css';
import { culture, messages } from '../../utils/constants';
import { CurrentUserContext, LocalizationContext } from '../../context';

export function BaseCalendar() {
	const localizer = useContext(LocalizationContext);
	const { format } = localizer;

	const userContext = useContext(CurrentUserContext);
	const { allUserEvents, chosenCalendars } = userContext;

  const displayedEvents = allUserEvents.filter(e => chosenCalendars.includes(`${e.calendar.id}`));

	const { defaultDate, formats } = {
		defaultDate: new Date(),
		formats: {
			weekdayFormat: (date) => format(date, 'eeeeee', culture),
		},
	};

	// окрашивание событий
	const eventPropGetter = useCallback(
		(event) => ({ style: { backgroundColor: event.calendar.color } }),
		[]
	);

	return (
		<Calendar
			dayPropGetter={(date) => {
				const dayOfWeek = date.getDay();
				const dateOfMonth = date.getMonth();
				const nowMonth = new Date().getMonth();
				const nowDay = new Date().getDate();
				const dayOfMonth = date.getDate();

				if (dateOfMonth !== nowMonth) {
					return { className: styles.otherMonth };
				}
				if (nowDay === dayOfMonth) {
					return { className: styles.today };
				}

				return dayOfWeek === 0 || dayOfWeek === 6
					? { className: styles.holiday }
					: {};
			}}
			defaultDate={defaultDate}
			localizer={localizer}
			startAccessor="start"
			endAccessor="end"
			culture={culture}
			formats={formats}
			events={displayedEvents}
			className={styles.calendar}
			messages={messages}
			eventPropGetter={eventPropGetter}
		/>
	);
}
