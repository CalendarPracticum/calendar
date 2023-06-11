import { React, useCallback, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'react-big-calendar';
import styles from './BaseCalendar.module.css';
import { culture, messages } from '../../utils/constants';
import CurrentUserContext from '../../context/CurrentUserContext';

export function BaseCalendar({ localizer }) {
	const userContext = useContext(CurrentUserContext);
	const { allUserEvents } = userContext;

	const { defaultDate, formats } = useMemo(
		() => ({
			defaultDate: new Date(),
			formats: {
				weekdayFormat: (date) => localizer.format(date, 'eeeeee', culture),
			},
		}),
		[localizer]
	);

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
			events={allUserEvents}
			className={styles.calendar}
			messages={messages}
			eventPropGetter={eventPropGetter}
		/>
	);
}

BaseCalendar.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	localizer: PropTypes.object.isRequired,
};
