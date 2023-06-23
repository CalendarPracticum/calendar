import { forwardRef } from 'react';
import styles from './NotFound.module.css';

// eslint-disable-next-line react/prop-types
export const Numbers404 = forwardRef((_, ref) => (
	<div className={styles.nums} ref={ref}>
		<div className={styles.numFourStart} />
		<div className={styles.numZero} />
		<div className={styles.numFourEnd} />
	</div>
));
