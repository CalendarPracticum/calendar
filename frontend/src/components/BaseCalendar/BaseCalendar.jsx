/* Core */
import { React, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';

/* Libraries */
import { zonedTimeToUtc } from 'date-fns-tz';
import { Calendar } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

/* Instruments */
import { culture, messages, noop } from '../../utils/constants';
import { CalendarsContext, LocalizationContext } from '../../context';
import styles from './BaseCalendar.module.css';

const DragAndDropCalendar = withDragAndDrop(Calendar);

export function BaseCalendar({
	onEventDoubleClick,
	onNewEventClick,
	onDragEvent,
}) {
	const localizer = useContext(LocalizationContext);
	const { format } = localizer;

	const {
		holidays,
		allUserEvents,
		setAllUserEvents,
		chosenCalendars,
		setEditableEvent,
	} = useContext(CalendarsContext);

	// TODO: потом сюда добавятся события пошаренных календарей
	const displayedEvents = [...holidays, ...allUserEvents].filter((e) =>
		chosenCalendars.includes(e.calendar.id)
	);

	// передвижка событий
	const moveEvent = useCallback(
		({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
			const { allDay } = event;

			if (event.calendar.id === 1) {
				return;
			}

			if (!allDay && droppedOnAllDaySlot) {
				// eslint-disable-next-line no-param-reassign
				event.allDay = true;
			}
			setAllUserEvents((prev) => {
				const existing = prev.find((ev) => ev.id === event.id) ?? {};
				const filtered = prev.filter((ev) => ev.id !== event.id);
				const newObject = {
					id: existing.id,
					name: existing.title,
					timeStart: zonedTimeToUtc(start),
					timeFinish: zonedTimeToUtc(end),
					allDay: existing.allDay,
					description: existing.description,
					calendar: {
						id: existing.calendar.id,
						name: existing.calendar.name,
						color: existing.calendar.color,
					},
				};
				onDragEvent(newObject);
				return [...filtered, { ...existing, start, end, allDay }];
			});
		},
		[setAllUserEvents, onDragEvent]
	);

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
			onEventDrop={moveEvent}
		/>
	);
}

BaseCalendar.propTypes = {
	onEventDoubleClick: PropTypes.func,
	onNewEventClick: PropTypes.func,
	onDragEvent: PropTypes.func,
};

BaseCalendar.defaultProps = {
	onEventDoubleClick: noop,
	onNewEventClick: noop,
	onDragEvent: noop,
};
