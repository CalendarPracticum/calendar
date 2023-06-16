import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Button } from 'primereact/button';
import { classNames as cn } from 'primereact/utils';
import { Calendar } from 'react-big-calendar';
import { CalendarSelect } from '../CalendarSelect/CalendarSelect';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './Sidebar.module.css';
import { culture, noop } from '../../utils/constants';
import { CurrentUserContext, LocalizationContext } from '../../context';

export function Sidebar({
	onEditCalendarClick,
	onNewEventClick,
	onNewCalendarClick,
	visibleProdCalendar,
	showProdCalendar,
}) {
	const localizer = useContext(LocalizationContext);
	const { format } = localizer;

	const userContext = useContext(CurrentUserContext);
	const { loggedIn } = userContext;

	const { defaultDate, formats } = {
		defaultDate: new Date(),
		formats: {
			weekdayFormat: (date) => format(date, 'eeeeee', culture),
		},
	};

	return (
		<div className={styles.sidebar}>
			<Button
				label="Событие"
				icon="pi pi-plus"
				iconPos="right"
				className={styles.button}
				onClick={() => onNewEventClick(true)}
				disabled={!loggedIn}
			/>
			<Calendar
				className={styles.calendar}
				toolbar={false}
				culture={culture}
				onDrillDown={noop}
				onNavigate={noop}
				style={{ height: 210, margin: 0, padding: 0, width: '100%' }}
				formats={formats}
				localizer={localizer}
				defaultDate={defaultDate}
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
			/>
			{loggedIn && (
				<>
					<CalendarSelect onEditCalendarClick={onEditCalendarClick} />
					<Button
						label="Новый календарь"
						icon="pi pi-plus"
						iconPos="left"
						className={cn(
							`p-button-sm p-button-outlined ${styles.btnNewCalendar}`
						)}
						onClick={() => onNewCalendarClick(true)}
						disabled={!loggedIn}
					/>
				</>
			)}
			<Button
				label={`${
					visibleProdCalendar ? 'Скрыть' : 'Показать'
				} производственный календарь`}
				className={cn(`p-button-sm p-button-link  ${styles.btnProdCalendar}`)}
				onClick={() => showProdCalendar((prevState) => !prevState)}
			/>
		</div>
	);
}

Sidebar.propTypes = {
	onEditCalendarClick: PropTypes.func.isRequired,
	onNewEventClick: PropTypes.func.isRequired,
	onNewCalendarClick: PropTypes.func.isRequired,
	visibleProdCalendar: PropTypes.bool.isRequired,
	showProdCalendar: PropTypes.func.isRequired,
};
