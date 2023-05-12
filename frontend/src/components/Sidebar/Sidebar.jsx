import React from 'react';
import { Button } from 'primereact/button';
import styles from './Sidebar.module.css';

export function Sidebar() {
	return (
		<div className={styles.sidebar}>
			<Button
				label="Событие"
				icon="pi pi-plus"
				iconPos="right"
				className={styles.button}
			/>
		</div>
	);
}
