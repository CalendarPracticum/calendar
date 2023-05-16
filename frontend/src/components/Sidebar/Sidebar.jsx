import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import styles from './Sidebar.module.css';

export function Sidebar({ onNewEventClick }) {
	return (
		<div className={styles.sidebar}>
			<Button
				label="Событие"
				icon="pi pi-plus"
				iconPos="right"
				className={styles.button}
				onClick={() => onNewEventClick(true)}
			/>
			<div className={styles.calendarBlock}>
				<Calendar inline showWeek className={styles.calendar} />
			</div>
		</div>
	);
}

Sidebar.propTypes = {
	onNewEventClick: PropTypes.func.isRequired,
};
