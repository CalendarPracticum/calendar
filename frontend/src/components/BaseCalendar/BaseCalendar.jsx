/* Core */
import { React, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

/* Libraries */
import { zonedTimeToUtc } from 'date-fns-tz';
import { Calendar } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

/* Instruments */
import { culture, messages, noop } from '../../utils/constants';
import { CalendarsContext, LocalizationContext } from '../../context';
import styles from './BaseCalendar.module.css';

const DragAndDropCalendar = withDragAndDrop(Calendar);

export function BaseCalendar({
	onEventDoubleClick,
	onNewEventClick,
	onEditEvent,
}) {
	const localizer = useContext(LocalizationContext);
	const { format } = localizer;

	const {
		holidays,
		allUserEvents,
		allUserCalendars,
		chosenCalendars,
		setEditableEvent,
	} = useContext(CalendarsContext);

	// TODO: потом сюда добавятся события пошаренных календарей
	const displayedEvents = [...holidays, ...allUserEvents].filter((e) =>
		chosenCalendars.includes(e.calendar.id)
	);

	// изменение событий в календаре
	const editEvent = ({
		event,
		start,
		end,
		isAllDay: droppedOnAllDaySlot = false,
	}) => {
		const { allDay } = event;

		if (!allUserCalendars.map((el) => el.id).includes(event.calendar.id)) {
			return;
		}

		if (!allDay && droppedOnAllDaySlot) {
			// eslint-disable-next-line no-param-reassign
			event.allDay = true;
		} else if (allDay && !droppedOnAllDaySlot) {
			// eslint-disable-next-line no-param-reassign
			event.allDay = false;
		}

		const newObject = {
			id: event.id,
			name: event.title,
			timeStart: zonedTimeToUtc(start),
			timeFinish: zonedTimeToUtc(end),
			allDay: event.allDay,
			description: event.description,
			calendar: {
				id: event.calendar.id,
				name: event.calendar.name,
				color: event.calendar.color,
			},
		};
		onEditEvent(newObject);
	};

	const { defaultDate, formats } = {
		defaultDate: new Date(),
		formats: {
			weekdayFormat: (date) => format(date, 'eeee', culture),
			monthHeaderFormat: (date) => format(date, 'LLLL yyyy', culture),
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

	const handleSelectSlot = () => {
		onNewEventClick(true);
	};

	return (
		<DragAndDropCalendar
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
			onSelectSlot={handleSelectSlot}
			selectable
			onEventDrop={editEvent}
			onEventResize={editEvent}
			resizable
			popup
		/>
	);
}

BaseCalendar.propTypes = {
	onEventDoubleClick: PropTypes.func,
	onNewEventClick: PropTypes.func,
	onEditEvent: PropTypes.func,
};

BaseCalendar.defaultProps = {
	onEventDoubleClick: noop,
	onNewEventClick: noop,
	onEditEvent: noop,
};
