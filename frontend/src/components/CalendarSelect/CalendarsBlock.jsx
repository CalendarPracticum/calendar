import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './CalendarSelect.module.css';

export function CalendarBlock(props) {
	const {
		calendars,
		handleCheckbox,
		chosenCalendars,
		handleClick,
		name,
		editButton,
	} = props;

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
						{isActive ? '\u142f' : '\u1433'}
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
								defaultChecked={chosenCalendars.some((c) => c === calendar.id)}
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
									{'\u270E'}
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
	// eslint-disable-next-line react/forbid-prop-types
	chosenCalendars: PropTypes.array.isRequired,
};
