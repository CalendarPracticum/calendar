/* Core */
import { useContext } from 'react';
import PropTypes from 'prop-types';

/* Instruments */
import { holidaysCalendar } from '../../utils/constants';
import { CalendarsContext } from '../../context';
import styles from './CalendarSelect.module.css';

/* Components */
import { CalendarBlock } from './CalendarsBlock';

export function CalendarSelect({ onEditCalendarClick, onShareCalendarClick }) {
	const { allUserCalendars, setChosenCalendars, setEditableCalendar } =
		useContext(CalendarsContext);

	const handleCheckbox = (e) => {
		const calendarId = e.target.id;
		const isChecked = e.target.checked;

		if (isChecked) {
			setChosenCalendars((prevState) => [...prevState, +calendarId]);
		} else {
			setChosenCalendars((prevState) =>
				prevState.filter((id) => id !== +calendarId)
			);
		}
	};

	const handleClick = (calendar, isEdit) => {
		setEditableCalendar(calendar);
		if (isEdit) {
			onEditCalendarClick(true);
		} else {
			onShareCalendarClick(calendar.id);
		}
	};

	// TODO: потом сюда добявятся пошаренные календари
	const otherCalendars = [...holidaysCalendar];

	return (
		<div className={styles.calendarsBlock}>
			<CalendarBlock
				name="Личные календари"
				calendars={allUserCalendars}
				handleCheckbox={handleCheckbox}
				handleClick={handleClick}
				editButton
			/>
			<CalendarBlock
				name="Другие"
				calendars={otherCalendars}
				handleCheckbox={handleCheckbox}
				handleClick={handleClick}
				editButton={false}
			/>
		</div>
	);
}

CalendarSelect.propTypes = {
	onEditCalendarClick: PropTypes.func.isRequired,
	onShareCalendarClick: PropTypes.func.isRequired,
};
