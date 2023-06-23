import styles from './NotFound.module.css';

export function Lines() {
	return (
		<div className={styles.lines}>
			{[1, 2, 3, 4, 5, 6, 7].map((id) => {
				if (id === 4) {
					return (
						<div className={`${styles.line} ${styles.fourthLine}`} key={id} />
					);
				}
				return <div className={styles.line} key={id} />;
			})}
		</div>
	);
}
