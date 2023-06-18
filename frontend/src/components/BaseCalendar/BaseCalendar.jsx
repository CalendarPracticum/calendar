import { React, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'react-big-calendar';
import styles from './BaseCalendar.module.css';
import { culture, messages, noop } from '../../utils/constants';
import { CurrentUserContext, LocalizationContext } from '../../context';

export function BaseCalendar({ onEventDoubleClick }) {
	const localizer = useContext(LocalizationContext);
	const { format } = localizer;

	const userContext = useContext(CurrentUserContext);
	const { allUserEvents, chosenCalendars, setEditableEvent } = userContext;

	const displayedEvents = allUserEvents.filter((e) =>
		chosenCalendars.includes(e.calendar.id)
	);

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

	const handleDoubleClick = (event) => {
		if (event.calendar.id === 1) {
			return;
		}
		onEventDoubleClick(true);
		setEditableEvent(event);
	};

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
				if (nowDay === dayOfMonth && nowMonth === dateOfMonth) {
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
			onDoubleClickEvent={handleDoubleClick}
		/>
	);
}

BaseCalendar.propTypes = {
	onEventDoubleClick: PropTypes.func,
};

BaseCalendar.defaultProps = {
	onEventDoubleClick: noop,
};
