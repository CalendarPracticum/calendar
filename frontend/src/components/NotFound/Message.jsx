import { forwardRef } from 'react';
import styles from './NotFound.module.css';

export const Message = forwardRef((props, ref) => {
	// eslint-disable-next-line react/prop-types
	const { id, message, isLeft } = props;
	return (
		<div
			className={isLeft ? styles.itemLeft : styles.itemRight}
			ref={ref}
			key={id}
		>
			{message}
		</div>
	);
});
