import React from 'react';
import styles from './Loader.module.css';

export function Loader() {
	return (
		<div className={styles.preloader}>
			<div className={styles.preloader__container}>
				<span className={styles.preloader__round} />
			</div>
		</div>
	);
}
