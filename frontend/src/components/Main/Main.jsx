import React from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import styles from './Main.module.css';

export function Main() {
	return (
		<main className={`${styles.main} container`}>
			<Sidebar />
			<div className={styles.content}>Content</div>
		</main>
	);
}
