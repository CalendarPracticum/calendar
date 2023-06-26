import { useContext } from 'react';
import PropTypes from 'prop-types';
import styles from './CalendarSelect.module.css';
import { CurrentUserContext, CalendarsContext } from '../../context';
import { CalendarBlock } from './CalendarsBlock';

export function CalendarSelect({ onEditCalendarClick }) {
	const { currentUser } = useContext(CurrentUserContext);
	const { email } = currentUser;

	const {
		allUserCalendars,
		chosenCalendars,
		setChosenCalendars,
		setEditableCalendar,
	} = useContext(CalendarsContext);

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

	const handleClick = (calendar) => {
		setEditableCalendar(calendar);
		onEditCalendarClick(true);
	};

	const myCalendars = allUserCalendars.filter(
		(calendar) => email === calendar.owner
	);

	const otherCalendars = allUserCalendars.filter(
		(calendar) => email !== calendar.owner
	);

	return (
		<div className={styles.calendarsBlock}>
			<CalendarBlock
				name="Личные календари"
				calendars={myCalendars}
				handleCheckbox={handleCheckbox}
				chosenCalendars={chosenCalendars}
				handleClick={handleClick}
				editButton
			/>
			<CalendarBlock
				name="Другие"
				calendars={otherCalendars}
				handleCheckbox={handleCheckbox}
				chosenCalendars={chosenCalendars}
				handleClick={handleClick}
				editButton={false}
			/>
		</div>
	);
}

CalendarSelect.propTypes = {
	onEditCalendarClick: PropTypes.func.isRequired,
};
