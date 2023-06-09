import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Sidebar } from '../Sidebar/Sidebar';
import { BaseCalendar } from '../BaseCalendar/BaseCalendar';
import styles from './Main.module.css';
import { YearCalendar } from '../YearCalendar/YearCalendar';
import { CurrentUserContext } from '../../context';

export function Main({
	onNewEventClick,
	onNewCalendarClick,
	onEditCalendarClick,
	onEventDoubleClick,
}) {
	const userContext = useContext(CurrentUserContext);
	const { loggedIn } = userContext;

	const [visibleProdCalendar, setVisibleProdCalendar] = useState(false);

	const showCalendars = () => {
		if (visibleProdCalendar && loggedIn) {
			return (
				<>
					<BaseCalendar onEventDoubleClick={onEventDoubleClick} />
					<YearCalendar />
				</>
			);
		}

		if (!visibleProdCalendar && loggedIn) {
			return <BaseCalendar onEventDoubleClick={onEventDoubleClick} />;
		}

		if (visibleProdCalendar && !loggedIn) {
			return <YearCalendar />;
		}

		return <BaseCalendar />;
	};

	return (
		<main className={`${styles.main} container`}>
			<Sidebar
				onEditCalendarClick={onEditCalendarClick}
				onNewEventClick={onNewEventClick}
				onNewCalendarClick={onNewCalendarClick}
				showProdCalendar={setVisibleProdCalendar}
				visibleProdCalendar={visibleProdCalendar}
			/>
			<div className={styles.content}>{showCalendars()}</div>
		</main>
	);
}

Main.propTypes = {
	onEditCalendarClick: PropTypes.func.isRequired,
	onNewEventClick: PropTypes.func.isRequired,
	onNewCalendarClick: PropTypes.func.isRequired,
	onEventDoubleClick: PropTypes.func.isRequired,
};
