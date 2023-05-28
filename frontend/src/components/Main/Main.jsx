import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar } from '../Sidebar/Sidebar';
import { BaseCalendar } from '../BaseCalendar/BaseCalendar';
import styles from './Main.module.css';
import { YearCalendar } from '../YearCalendar/YearCalendar';

export function Main({ onNewEventClick, localizer }) {
	return (
		<main className={`${styles.main} container`}>
			<Sidebar onNewEventClick={onNewEventClick} localizer={localizer} />
			<div className={styles.content}>
				<BaseCalendar localizer={localizer} />
				<YearCalendar localizer={localizer} />
			</div>
		</main>
	);
}

Main.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	localizer: PropTypes.object.isRequired,
	onNewEventClick: PropTypes.func.isRequired,
};
