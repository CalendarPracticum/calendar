import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar } from '../Sidebar/Sidebar';
import { BaseCalendar } from '../BaseCalendar/BaseCalendar';
import styles from './Main.module.css';

export function Main({ localizer, onNewEventClick }) {
  return (
    <main className={`${styles.main} container`}>
      <Sidebar onNewEventClick={onNewEventClick} />
      <div className={styles.content}>
        <BaseCalendar localizer={localizer} />
      </div>
    </main>
  );
}

Main.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  localizer: PropTypes.object.isRequired,
  onNewEventClick: PropTypes.func.isRequired,
};
