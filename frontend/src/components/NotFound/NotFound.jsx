import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export function NotFound() {
	return (
		<div className={styles.wrapper}>
			<h1 className={styles.title}>404</h1>
			<p className={styles.description}>Страница не найдена</p>
			<Link to="/" className={styles.link}>
				Домой
			</Link>
		</div>
	);
}
