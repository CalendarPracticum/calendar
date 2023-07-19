/* Instruments */
import styles from './Footer.module.css';

export function Footer() {
	return (
		<footer className={`${styles.footer} container`}>
			<a
				className={styles.link}
				href="https://github.com/CalendarPracticum/calendar/wiki/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F-%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0-MyCalenDAily-(%D0%B8%D0%B4%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9-%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9-%D0%BA%D0%B0%D0%BB%D0%B5%D0%BD%D0%B4%D0%B0%D1%80%D1%8C)"
				target="_blank"
				rel="noreferrer"
			>
				Справка и поддержка
			</a>
			<p className={styles.text}> &copy; MyCalenDaily, 2023</p>
		</footer>
	);
}
