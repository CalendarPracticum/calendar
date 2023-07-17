/* Instruments */
import styles from './Footer.module.css';

export function Footer() {
	return (
		<footer className={styles.footer}>
			<a
				className={styles.link}
				href="https://github.com/CalendarPracticum/calendar"
				target="_blank"
				rel="noreferrer"
			>
				Справка и поддержка
			</a>
			<p className={styles.text}> &copy; MyCalenDaily, 2023</p>
		</footer>
	);
}
