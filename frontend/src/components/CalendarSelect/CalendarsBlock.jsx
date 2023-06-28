import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { CalendarsContext } from '../../context';
import styles from './CalendarSelect.module.css';

export function CalendarBlock(props) {
	const { chosenCalendars } = useContext(CalendarsContext);
	const { calendars, handleCheckbox, handleClick, name, editButton } = props;

	const [isActive, setIsActive] = useState(true);

	return (
		<div className={styles.calendarContainer}>
			<div className={styles.acordion}>
				<button
					className={styles.button}
					onClick={() => setIsActive(!isActive)}
					type="button"
				>
					<span>{name}</span>
					<span className={styles.pointer}>
						{isActive ? (
							<i className="pi pi-angle-up" style={{ fontSize: '1.2rem' }} />
						) : (
							<i className="pi pi-angle-down" style={{ fontSize: '1.2rem' }} />
						)}
					</span>
				</button>
			</div>
			<div className={styles.allCalendars}>
				{isActive &&
					calendars.map((calendar) => (
						<label
							className={styles.list}
							htmlFor={calendar.id}
							key={calendar.id}
						>
							<input
								type="checkbox"
								id={calendar.id}
								name={calendar.id}
								onChange={handleCheckbox}
								checked={chosenCalendars.some((c) => c === calendar.id)}
							/>
							<span
								className={styles.checkbox}
								style={{ backgroundColor: calendar.color }}
							/>
							<span className={styles.text}>{calendar.name}</span>
							{editButton && (
								<button
									className={styles.edit}
									type="button"
									onClick={() => handleClick(calendar)}
								>
									<i className="pi pi-pencil" style={{ fontSize: '0.75rem' }} />
								</button>
							)}
						</label>
					))}
			</div>
		</div>
	);
}

CalendarBlock.propTypes = {
	editButton: PropTypes.bool.isRequired,
	name: PropTypes.string.isRequired,
	handleClick: PropTypes.func.isRequired,
	handleCheckbox: PropTypes.func.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	calendars: PropTypes.array.isRequired,
};
