import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar } from '../Sidebar/Sidebar';
import { BaseCalendar } from '../BaseCalendar/BaseCalendar';
import styles from './Main.module.css';

export function Main({ localizer, onNewEventClick, events }) {
	return (
		<main className={`${styles.main} container`}>
			<Sidebar onNewEventClick={onNewEventClick} />
			<div className={styles.content}>
				<BaseCalendar localizer={localizer} events={events} />
			</div>
		</main>
	);
}

Main.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	localizer: PropTypes.object.isRequired,
	onNewEventClick: PropTypes.func.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	events: PropTypes.array.isRequired,
};
