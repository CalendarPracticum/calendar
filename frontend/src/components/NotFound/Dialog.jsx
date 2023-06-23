/* eslint-disable react/prop-types */
import styles from './NotFound.module.css';
import { Message } from './Message';

export function Dialog({ messages }) {
	return (
		<div className={styles.dialog}>
			{messages.map(({ ref, id, message, isLeft }) => (
				<Message key={id} message={message} isLeft={isLeft} ref={ref} />
			))}
		</div>
	);
}
